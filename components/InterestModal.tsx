"use client";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
  projectName: string;
  onSuccess: () => void;
}

export default function InterestModal({
  isOpen,
  onClose,
  projectId,
  projectName,
  onSuccess,
}: Props) {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [closing, setClosing] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Reset state each time modal opens
  useEffect(() => {
    if (isOpen) {
      setMessage("");
      setError("");
      setLoading(false);
      setClosing(false);
      // Focus textarea after animation starts
      const t = setTimeout(() => textareaRef.current?.focus(), 80);
      return () => clearTimeout(t);
    }
  }, [isOpen]);

  // Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") animateClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  // Lock body scroll while open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      return () => { document.body.style.overflow = ""; };
    }
  }, [isOpen]);

  function animateClose() {
    setClosing(true);
    setTimeout(() => {
      setClosing(false);
      onClose();
    }, 140);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/interests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectId, message: message.trim() }),
      });
      const data = await res.json();
      if (res.status === 409) {
        setError("You have already expressed interest in this project.");
        setLoading(false);
        return;
      }
      if (!res.ok) {
        setError(data.error ?? "Something went wrong.");
        setLoading(false);
        return;
      }
      // Close then fire success so parent can update button state
      setClosing(true);
      setTimeout(() => {
        setClosing(false);
        onClose();
        onSuccess();
      }, 140);
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  if (!isOpen && !closing) return null;

  return createPortal(
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center px-4 ${
        closing ? "modal-overlay-out" : "modal-overlay-in"
      }`}
      style={{ backgroundColor: "rgba(0,0,0,0.3)" }}
      onClick={animateClose}
    >
      <div
        className={`w-full max-w-md bg-white rounded-2xl p-8 border border-border ${
          closing ? "modal-card-out" : "modal-card-in"
        }`}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="interest-modal-heading"
      >
        {/* Project name label */}
        <p className="text-xs text-ink-3 mb-1">{projectName}</p>

        {/* Heading */}
        <h2 id="interest-modal-heading" className="text-lg font-semibold text-ink mb-6">
          Tell them what you bring
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <textarea
            ref={textareaRef}
            rows={4}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="What skills or ideas would you contribute to this project?"
            className="input resize-none"
          />

          {error && (
            <p className="text-xs text-accent">{error}</p>
          )}

          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={animateClose}
              className="btn-secondary flex-1"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary flex-1 disabled:opacity-50"
            >
              {loading ? "Sending..." : "Send"}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}
