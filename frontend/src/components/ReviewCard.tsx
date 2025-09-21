import type {ReviewDoc} from "../types/review";

export default function ReviewCard({ review }: { review: ReviewDoc }) {
  return (
    <div className="border rounded p-3 space-y-2">
      <div className="text-sm">
        <b>Status:</b> {review.status}
        {" · "}
        <b>Language:</b> {review.language}
      </div>

      {review.result && (
        <>
          <div><b>Score:</b> {review.result.score}/10</div>
          {review.result.summary && <div><b>Summary:</b> {review.result.summary}</div>}

          {review.result.issues?.length > 0 && (
            <div>
              <b>Issues:</b>
              <ul className="list-disc ml-5">
                {review.result.issues.map((it, i) => (
                  <li key={i}><b>{it.title}:</b> {it.detail}</li>
                ))}
              </ul>
            </div>
          )}

          {review.result.security?.length > 0 && (
            <div>
              <b>Security:</b>
              <ul className="list-disc ml-5">{review.result.security.map((s, i) => <li key={i}>{s}</li>)}</ul>
            </div>
          )}

          {review.result.performance?.length > 0 && (
            <div>
              <b>Performance:</b>
              <ul className="list-disc ml-5">{review.result.performance.map((s, i) => <li key={i}>{s}</li>)}</ul>
            </div>
          )}
        </>
      )}

      <details>
        <summary className="cursor-pointer text-sm text-gray-600">See Your Code</summary>
        <pre className="bg-gray-50 p-2 rounded overflow-auto text-xs">{review.code}</pre>
      </details>
    </div>
  );
}