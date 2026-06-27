import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getUserById } from "@/lib/user-store";
import { getCommentsByProject, createComment } from "@/lib/comment-store";

export async function GET(req: NextRequest) {
  // Public — anyone can read comments
  const projectId = req.nextUrl.searchParams.get("projectId");
  if (!projectId) {
    return NextResponse.json({ error: "projectId is required." }, { status: 400 });
  }
  return NextResponse.json({ comments: getCommentsByProject(projectId) });
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "You must be signed in to comment." }, { status: 401 });
  }

  const userId = session.user.id;
  const user = getUserById(userId);
  if (!user?.onboardingComplete) {
    return NextResponse.json({ error: "Complete your profile first." }, { status: 403 });
  }

  const { projectId, text } = await req.json();
  if (!projectId) {
    return NextResponse.json({ error: "projectId is required." }, { status: 400 });
  }
  if (!text?.trim()) {
    return NextResponse.json({ error: "Comment cannot be empty." }, { status: 400 });
  }

  const comment = createComment({
    projectId,
    userId,
    userName: user.name ?? "A student",
    text: text.trim(),
  });

  return NextResponse.json({ comment }, { status: 201 });
}
