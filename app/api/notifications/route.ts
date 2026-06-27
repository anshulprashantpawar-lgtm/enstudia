import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import {
  getNotificationsByUser,
  getUnreadCount,
  markAllReadForUser,
} from "@/lib/notification-store";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const userId = session.user.id;
  return NextResponse.json({
    notifications: getNotificationsByUser(userId),
    unreadCount: getUnreadCount(userId),
  });
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { action } = await req.json();
  if (action === "markAllRead") {
    markAllReadForUser(session.user.id);
    return NextResponse.json({ ok: true });
  }
  return NextResponse.json({ error: "Unknown action." }, { status: 400 });
}
