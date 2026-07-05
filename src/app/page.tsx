"use client";

import { useRef, useState } from "react";

type Status = "idle" | "loading" | "streaming" | "done" | "error";

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [advice, setAdvice] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  function pickFile(next: File | null) {
    setError(null);
    setAdvice("");
    setStatus("idle");
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    if (next) {
      setFile(next);
      setPreviewUrl(URL.createObjectURL(next));
    } else {
      setFile(null);
      setPreviewUrl(null);
    }
  }

  function reset() {
    pickFile(null);
    if (inputRef.current) inputRef.current.value = "";
  }

  async function analyze() {
    if (!file) return;
    setStatus("loading");
    setError(null);
    setAdvice("");

    try {
      const form = new FormData();
      form.append("image", file);

      const res = await fetch("/api/analyze", { method: "POST", body: form });

      if (!res.ok) {
        const data = await res.json().catch(() => ({ error: "Erreur serveur" }));
        throw new Error(data.error ?? `Erreur ${res.status}`);
      }

      if (!res.body) throw new Error("Réponse vide du serveur.");

      setStatus("streaming");
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let text = "";
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        text += decoder.decode(value, { stream: true });
        setAdvice(text);
      }
      setStatus("done");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur inconnue");
      setStatus("error");
    }
  }

  const busy = status === "loading" || status === "streaming";

  return (
    <main>
      <header>
        <h1>Restructure ta pièce</h1>
        <p>Prends une photo, reçois des conseils concrets pour l'améliorer.</p>
      </header>

      <section className="card">
        {!previewUrl ? (
          <label className="upload" htmlFor="photo">
            <strong>Choisir ou prendre une photo</strong>
            <span>JPEG, PNG ou WEBP — jusqu'à 8 Mo</span>
            <input
              ref={inputRef}
              id="photo"
              type="file"
              accept="image/*"
              capture="environment"
              onChange={(e) => pickFile(e.target.files?.[0] ?? null)}
            />
          </label>
        ) : (
          <>
            <div className="preview">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={previewUrl} alt="Aperçu de la pièce" />
            </div>
            <div className="actions">
              <button
                className="primary"
                type="button"
                onClick={analyze}
                disabled={busy}
              >
                {busy ? (
                  <>
                    <span className="spinner" aria-hidden />
                    Analyse en cours…
                  </>
                ) : (
                  "Analyser la pièce"
                )}
              </button>
              <button
                className="secondary"
                type="button"
                onClick={reset}
                disabled={busy}
              >
                Changer de photo
              </button>
            </div>
          </>
        )}

        {error && <div className="error">{error}</div>}
      </section>

      {(advice || status === "streaming") && (
        <section className="card">
          <div className="result">{renderAdvice(advice)}</div>
          {status === "streaming" && !advice && (
            <p className="hint">Claude regarde la pièce…</p>
          )}
        </section>
      )}
    </main>
  );
}

function renderAdvice(text: string): React.ReactNode {
  if (!text) return null;
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    const m = part.match(/^\*\*([^*]+)\*\*$/);
    if (m) return <strong key={i}>{m[1]}</strong>;
    return <span key={i}>{part}</span>;
  });
}
