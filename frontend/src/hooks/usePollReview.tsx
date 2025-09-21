import { useEffect, useRef, useState } from "react";
import { fetchReview } from "../services/reviewService";
import type {ReviewDoc} from "../types/review";

export function usePollReview(id?: string, intervalMs = 1500) {
  const [data, setData] = useState<ReviewDoc | null>(null);
  const [loading, setLoading] = useState<boolean>(!!id);
  const [error, setError] = useState<string | null>(null);
  const timer = useRef<number | null>(null);

  useEffect(() => {
    if (!id) return;

    const tick = async () => {
      try {
        const res = await fetchReview(id);
        setData(res);
        if (res.status === "completed" || res.status === "failed") {
          setLoading(false);
          if (timer.current) window.clearInterval(timer.current);
        }
      } catch (e: any) {
        setError(e?.message ?? "Erro ao buscar review");
        setLoading(false);
        if (timer.current) window.clearInterval(timer.current);
      }
    };

    tick();
    timer.current = window.setInterval(tick, intervalMs);

    return () => {
      if (timer.current) window.clearInterval(timer.current);
    };
  }, [id, intervalMs]);

  return { data, loading, error };
}