"use client";

import { useState, useTransition } from "react";
import { ingestApiWithGemini } from "@/actions/ai/ingest-api";

export function ApiIngestForm() {
  const [name, setName] = useState("");
  const [docsUrl, setDocsUrl] = useState("");
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setResult(null);

    startTransition(async () => {
      try {
        const data = await ingestApiWithGemini(name, docsUrl);
        setResult(data);
      } catch (err: any) {
        setError(err.message ?? "Unexpected error");
      }
    });
  }

  return (
    <div className="max-w-xl space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">
            API name
          </label>
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded border px-3 py-2"
            placeholder="Stripe API"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">
            Documentation URL
          </label>
          <input
            required
            type="url"
            value={docsUrl}
            onChange={(e) => setDocsUrl(e.target.value)}
            className="w-full rounded border px-3 py-2"
            placeholder="https://docs.stripe.com"
          />
          <p className="text-xs text-muted-foreground">
            Usa la URL oficial de la documentación para máxima precisión
          </p>
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="rounded bg-black px-4 py-2 text-white disabled:opacity-50"
        >
          🤖 Auto-rellenar desde documentación
        </button>
      </form>

      {error && (
        <div className="rounded border border-red-500 bg-red-50 p-3 text-sm">
          {error}
        </div>
      )}

      {result && (
        <pre className="rounded bg-neutral-900 p-4 text-xs text-white overflow-auto">
{JSON.stringify(result, null, 2)}
        </pre>
      )}
    </div>
  );
}