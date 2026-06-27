import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getUserById } from "@/lib/user-store";
import {
  createInterest,
  getInterestsByProject,
  hasUserExpressedInterest,
} from "@/lib/interest-store";
import { getUserProjectById } from "@/lib/project-store";
import { createNotification } from "@/lib/notification-store";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const projectId = req.nextUrl.searchParams.get("projectId");
  if (!projectId) {
    return NextResponse.json({ error: "projectId is required." }, { status: 400 });
  }

  const project = getUserProjectById(projectId);
  if (!project) {
    return NextResponse.json({ error: "Project not found." }, { status: 404 });
  }
  if (project.ownerId !== session.user.id) {
    return NextResponse.json({ error: "Only the project owner can view applicants." }, { status: 403 });
  }

  return NextResponse.json({ interests: getInterestsByProject(projectId) });
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "You must be signed in." }, { status: 401 });
  }

  const userId = session.user.id;
  const user = getUserById(userId);
  if (!user?.onboardingComplete) {
    return NextResponse.json({ error: "Complete your profile first." }, { status: 403 });
  }

  const { projectId, role, message } = await req.json();
  if (!projectId) {
    return NextResponse.json({ error: "projectId is required." }, { status: 400 });
  }

  const project = getUserProjectById(projectId);
  if (!project) {
    return NextResponse.json({ error: "Project not found." }, { status: 404 });
  }
  if (project.ownerId === userId) {
    return NextResponse.json({ error: "You cannot apply to your own project." }, { status: 403 });
  }
  if (hasUserExpressedInterest(projectId, userId)) {
    return NextResponse.json(
      { error: "You have already expressed interest in this project." },
      { status: 409 }
    );
  }

  const interest = createInterest({
    projectId,
    userId,
    userName: user.name ?? "A student",
    userSkills: user.skills ?? [],
    role: role ?? null,
    message: message ?? "",
  });

  // Notify the project owner
  const roleText = role ? ` for the ${role} role` : "";
  createNotification({
    userId: project.ownerId,
    type: "interest",
    message: `${user.name ?? "A student"} expressed interest in ${project.name}${roleText}`,
    projectId,
    fromUserId: userId,
    fromUserName: user.name ?? "A student",
  });

  return NextResponse.json({ interest }, { status: 201 });
}
