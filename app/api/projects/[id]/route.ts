import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import {
  getUserProjectById,
  updateProject,
  deleteProject,
} from "@/lib/project-store";
import type { Category, Project } from "@/lib/data";

const VALID_CATEGORIES: Category[] = [
  "Tech", "Business", "Social Impact", "Science", "Arts & Media", "Education",
];
const VALID_STAGES: Project["stage"][] = ["Idea", "Prototype", "MVP", "Growing"];

interface Params { params: { id: string } }

export async function GET(_req: NextRequest, { params }: Params) {
  const project = getUserProjectById(params.id);
  if (!project) {
    return NextResponse.json({ error: "Project not found." }, { status: 404 });
  }
  return NextResponse.json({ project });
}

export async function PATCH(req: NextRequest, { params }: Params) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const project = getUserProjectById(params.id);
  if (!project) {
    return NextResponse.json({ error: "Project not found." }, { status: 404 });
  }
  if (project.ownerId !== session.user.id) {
    return NextResponse.json({ error: "Only the project owner can edit this project." }, { status: 403 });
  }

  const body = await req.json();
  const { name, shortDescription, fullDescription, category, stage, skillsNeeded, openRoles } = body ?? {};

  if (category && !VALID_CATEGORIES.includes(category)) {
    return NextResponse.json({ error: "Invalid project type." }, { status: 400 });
  }
  if (stage && !VALID_STAGES.includes(stage)) {
    return NextResponse.json({ error: "Invalid stage." }, { status: 400 });
  }

  const patch: Record<string, unknown> = {};
  if (name?.trim()) patch.name = name.trim();
  if (shortDescription?.trim()) patch.shortDescription = shortDescription.trim();
  if (fullDescription?.trim()) patch.fullDescription = fullDescription.trim();
  if (category) patch.category = category;
  if (stage) patch.stage = stage;
  if (Array.isArray(skillsNeeded)) patch.skillsNeeded = skillsNeeded;
  if (Array.isArray(openRoles)) patch.openRoles = openRoles;

  const updated = updateProject(params.id, patch);
  return NextResponse.json({ project: updated });
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const project = getUserProjectById(params.id);
  if (!project) {
    return NextResponse.json({ error: "Project not found." }, { status: 404 });
  }
  if (project.ownerId !== session.user.id) {
    return NextResponse.json({ error: "Only the project owner can delete this project." }, { status: 403 });
  }

  deleteProject(params.id);
  return NextResponse.json({ ok: true });
}
