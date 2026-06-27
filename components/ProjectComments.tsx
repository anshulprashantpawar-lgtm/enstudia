"use client";
import { useState } from "react";
import Link from "next/link";

export interface Comment {
  id: string;
  userId: string;
  userName: string;
  text: string;
  createdAt: string;
}

interface Props {
  projectId: string;
  isLoggedIn: boolean;
  initialComments: Comment[];
}

function initial(name: string): string {
  return (name.trim()[0] ?? "?").toUpperCase();
}

function timeAgo(dateString: string): string {
  const diff = Date.now() - new Date(dateString).getTime();
  const minutes = Math.floor(diff / 60_000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export default function ProjectComments({ projectId, isLoggedIn, initialComments }: Props) {
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [text, setText] = useState("");
  const [posting, setPosting] = useState(false);
  const [error, setError] = useState("");

  async function handlePost(e: React.FormEvent) {
    e.preventDefault();
    if (!text.trim()) return;
    setError("");
    setPosting(true);
    try {
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectId, text }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Could not post comment.");
        setPosting(false);
        return;
      }
      setComments((prev) => [...prev, data.comment]);
      setText("");
      setPosting(false);
    } catch {
      setError("Something went wrong. Please try again.");
      setPosting(false);
    }
  }

  return (
    <section className="mt-12 pt-10 border-t border-border">
      <h2 className="text-sm font-semibold text-ink-3 uppercase tracking-wider mb-1">
        Comments ({comments.length})
      </h2>
      <p className="text-xs text-ink-3 mb-6">Public discussion — visible to everyone.</p>

      {/* Comment list */}
      {comments.length > 0 ? (
        <div className="space-y-4 mb-8">
          {comments.map((c) => (
            <div key={c.id} className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-white border border-border flex items-center justify-center text-xs font-semibold text-ink-2 shrink-0">
                {initial(c.userName)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-2 mb-0.5">
                  <span className="text-sm font-medium text-ink">{c.userName}</span>
                  <span className="text-2xs text-ink-3">{timeAgo(c.createdAt)}</span>
                </div>
                <p className="text-sm text-ink-2 leading-relaxed whitespace-pre-line break-words">
                  {c.text}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-ink-3 mb-8">No comments yet. Start the conversation.</p>
      )}

      {/* Composer */}
      {isLoggedIn ? (
        <form onSubmit={handlePost} className="border-t border-border pt-6">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={3}
            placeholder="Add a public comment..."
            className="input resize-none"
          />
          {error && <p className="text-xs text-accent mt-2">{error}</p>}
          <div className="flex justify-end mt-3">
            <button
              type="submit"
              disabled={posting || !text.trim()}
              className="btn-primary text-sm px-5 disabled:opacity-50"
            >
              {posting ? "Posting..." : "Post"}
            </button>
          </div>
        </form>
      ) : (
        <div className="border-t border-border pt-6">
          <p className="text-sm text-ink-2">
            <Link href="/login" className="text-accent hover:text-accent-hover underline underline-offset-2">
              Sign in
            </Link>{" "}
            to join the discussion.
          </p>
        </div>
      )}
    </section>
  );
}
