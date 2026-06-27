import fs from "fs";
import path from "path";
import { randomUUID } from "crypto";

const DATA_FILE = path.join(process.cwd(), "data", "notifications.json");

export interface StoredNotification {
  id: string;
  userId: string;       // recipient (project owner)
  type: "interest";
  message: string;
  projectId: string;
  fromUserId: string;
  fromUserName: string;
  read: boolean;
  createdAt: string;
}

function readNotifications(): StoredNotification[] {
  try {
    if (!fs.existsSync(DATA_FILE)) return [];
    return JSON.parse(fs.readFileSync(DATA_FILE, "utf-8"));
  } catch {
    return [];
  }
}

function writeNotifications(notifications: StoredNotification[]): void {
  const dir = path.dirname(DATA_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(DATA_FILE, JSON.stringify(notifications, null, 2));
}

export function getNotificationsByUser(userId: string): StoredNotification[] {
  return readNotifications()
    .filter((n) => n.userId === userId)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function getUnreadCount(userId: string): number {
  return readNotifications().filter((n) => n.userId === userId && !n.read).length;
}

export function createNotification(
  data: Omit<StoredNotification, "id" | "createdAt" | "read">
): StoredNotification {
  const notifications = readNotifications();
  const notification: StoredNotification = {
    ...data,
    id: `n-${randomUUID().slice(0, 8)}`,
    read: false,
    createdAt: new Date().toISOString(),
  };
  notifications.push(notification);
  writeNotifications(notifications);
  return notification;
}

export function markAllReadForUser(userId: string): void {
  const notifications = readNotifications();
  let changed = false;
  for (const n of notifications) {
    if (n.userId === userId && !n.read) {
      n.read = true;
      changed = true;
    }
  }
  if (changed) writeNotifications(notifications);
}
