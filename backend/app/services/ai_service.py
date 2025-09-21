from __future__ import annotations

import asyncio
import json
import re
from typing import Any, Dict, List
import httpx
from app.core.config import get_settings

settings = get_settings()

def _strip_fences(text: str) -> str:
    s = text.strip()
    if s.startswith("```"):
        s = re.sub(r"^```(?:json)?\s*", "", s, flags=re.IGNORECASE)
        s = re.sub(r"\s*```$", "", s)
    return s.strip()


def _extract_json_loose(text: str) -> Dict[str, Any]:
    s = _strip_fences(text)
    try:
        return json.loads(s)
    except Exception:
        pass

    start = s.find("{")
    while start != -1:
        depth = 0
        for i, ch in enumerate(s[start:], start):
            if ch == "{":
                depth += 1
            elif ch == "}":
                depth -= 1
                if depth == 0:
                    candidate = s[start : i + 1]
                    try:
                        return json.loads(candidate)
                    except Exception:
                        break
        start = s.find("{", start + 1)

    raise ValueError("no valid JSON found")


_SYSTEM_MSG = (
    "Output ONLY a single JSON object following the schema. "
    "Do not include backticks, markdown, or any text outside the JSON."
)

_SCHEMA_MSG = (
    "Schema:\n"
    "{\n"
    '  "score": number (1-10),\n'
    '  "issues": [{"title": string, "detail": string}],\n'
    '  "security": [string],\n'
    '  "performance": [string],\n'
    '  "summary": string\n'
    "}\n\n"
)


def _build_user_message(language: str, code: str) -> str:
    header = (
        f"You are a strict senior {language} code reviewer.\n"
        "Return ONLY a single JSON object (no prose, no markdown, no backticks).\n\n"
        + _SCHEMA_MSG +
        "Analyze the code and fill the schema precisely.\n"
        "Code:\n"
    )
    return header + (code or "")


_RETRY_STATUS = {429, 500, 502, 503, 504}

async def _post_chat(
    client: httpx.AsyncClient,
    url: str,
    payload: Dict[str, Any],
    headers: Dict[str, str],
) -> httpx.Response:
    return await client.post(url, json=payload, headers=headers)


async def review_with_openai(code: str, language: str) -> Dict[str, Any]:
    if not code or not code.strip():
        return {
            "score": 5,
            "issues": [{"title": "Empty code", "detail": "No code provided."}],
            "security": [],
            "performance": [],
            "summary": "No code.",
        }

    messages: List[Dict[str, str]] = [
        {"role": "system", "content": _SYSTEM_MSG},
        {"role": "user", "content": _build_user_message(language, code)},
    ]

    base_url = settings.openai_base_url.rstrip("/")
    url = f"{base_url}/v1/chat/completions"
    headers: Dict[str, str] = {"Authorization": f"Bearer {settings.openai_api_key}", "Content-Type": "application/json",
                               "HTTP-Referer": getattr(settings, "frontend_url", "http://localhost:5173"),
                               "X-Title": "ai-code-review"}


    base_payload: Dict[str, Any] = {
        "model": settings.openai_model,
        "messages": messages,
        "temperature": 0.0,
        "max_tokens": 700,
    }

    payloads = [
        dict(base_payload, response_format={"type": "json_object"}),
        base_payload,
    ]

    last_text: str = ""
    timeout = 60.0
    max_retries = 3
    base_delay = 1.0

    async with httpx.AsyncClient(timeout=timeout) as client:
        for payload in payloads:
            for attempt in range(1, max_retries + 1):
                resp = await _post_chat(client, url, payload, headers)

                if resp.status_code in _RETRY_STATUS:
                    await asyncio.sleep(min(base_delay * (2 ** (attempt - 1)), 10))
                    continue

                resp.raise_for_status()
                data = resp.json()
                content = data["choices"][0]["message"]["content"]
                last_text = content

                try:
                    return _extract_json_loose(content)
                except Exception:
                    break

    return {
        "score": 5,
        "issues": [{"title": "Parse error", "detail": "AI returned non-JSON; using fallback."}],
        "security": [],
        "performance": [],
        "summary": (last_text or "")[:800],
    }
