"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

interface Notification {
  id: string;
  type: "interest";
  message: string;
  projectId: string;
  fromUserId: string;
  fromUserName: string;
  read: boolean;
  createdAt: string;
}

function initials(name: string): string {
  return name.split(" ").map((p) => p[0]).filter(Boolean).slice(0, 2).join("").toUpperCase() || "?";
}

function timeAgo(dateString: string): string {
  const diff = Date.now() - new Date(dateString).getTime();
  const minutes = Math.floor(diff / 60_000);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    fetch("/api/notifications")
      .then((r) => (r.ok ? r.json() : { notifications: [] }))
      .then((data) => {
        if (!active) return;
        setNotifications(data.notifications ?? []);
        setLoading(false);
        // Mark all as read
        fetch("/api/notifications", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "markAllRead" }),
        }).catch(() => {});
      })
      .catch(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-ink tracking-tight mb-0.5">Notifications</h1>
          <p className="text-sm text-ink-2">
            {notifications.length > 0
              ? `${notifications.length} notification${notifications.length !== 1 ? "s" : ""}`
              : "All caught up"}
          </p>
        </div>
        <Link href="/dashboard" className="text-xs text-ink-3 hover:text-ink transition-colors">
          Back to dashboard
        </Link>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 rounded-xl bg-surface border border-border animate-pulse" />
          ))}
        </div>
      ) : notifications.length === 0 ? (
        <div className="border border-border rounded-xl p-12 bg-surface text-center">
          <p className="text-ink font-medium mb-1">No notifications yet</p>
          <p className="text-xs text-ink-3 leading-relaxed max-w-xs mx-auto">
            When someone expresses interest in your project, it will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {notifications.map((n, i) => {
            // Before markAllRead fires client-side, unread items are highlighted
            // We show all items — after the effect runs they'll display as read next visit
            const wasUnread = !n.read && i < 3; // approximate: freshly loaded unread items

            return (
              <Link
                key={n.id}
                href={`/project/${n.projectId}`}
                className={`group flex items-start gap-4 p-4 rounded-xl border transition-colors hover:border-ink-3 ${
                  wasUnread
                    ? "bg-accent/5 border-accent/20"
                    : "bg-surface border-border"
                }`}
              >
                {/* Sender avatar */}
                <div className="w-9 h-9 rounded-full bg-white border border-border flex items-center justify-center text-xs font-semibold text-ink-2 shrink-0">
                  {initials(n.fromUserName)}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-ink leading-snug">{n.message}</p>
                  <p className="text-xs text-ink-3 mt-1">{timeAgo(n.createdAt)}</p>
                </div>

                {/* Arrow */}
                <svg
                  className="w-4 h-4 text-ink-3 group-hover:text-ink-2 transition-colors shrink-0 mt-0.5"
                  fill="none" stroke="currentColor" viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
