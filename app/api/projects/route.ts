import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getUserById } from "@/lib/user-store";
import { createProject, getAllUserProjects, type NewProjectInput } from "@/lib/project-store";
import type { Category, Project } from "@/lib/data";

const VALID_CATEGORIES: Category[] = [
  "Tech", "Business", "Social Impact", "Science", "Arts & Media", "Education",
];
const VALID_STAGES: Project["stage"][] = ["Idea", "Prototype", "MVP", "Growing"];

export async function GET() {
  // Public list of all real, user-created projects (for the explore feed)
  return NextResponse.json({ projects: getAllUserProjects() });
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "You must be signed in." }, { status: 401 });
  }

  const userId = session.user.id;
  const user = getUserById(userId);
  if (!user || !user.onboardingComplete) {
    return NextResponse.json({ error: "Complete your profile first." }, { status: 403 });
  }

  const body = await req.json();
  const {
    name,
    shortDescription,
    fullDescription,
    category,
    stage,
    skillsNeeded,
    teamMembers,
    openRoles,
  } = body ?? {};

  if (!name?.trim() || !shortDescription?.trim() || !fullDescription?.trim()) {
    return NextResponse.json(
      { error: "Name, short description, and full description are required." },
      { status: 400 }
    );
  }
  if (!VALID_CATEGORIES.includes(category)) {
    return NextResponse.json({ error: "Please choose a valid project type." }, { status: 400 });
  }
  if (!VALID_STAGES.includes(stage)) {
    return NextResponse.json({ error: "Please choose a valid stage." }, { status: 400 });
  }

  const input: NewProjectInput = {
    name: name.trim(),
    shortDescription: shortDescription.trim(),
    fullDescription: fullDescription.trim(),
    category,
    stage,
    skillsNeeded: Array.isArray(skillsNeeded) ? skillsNeeded : [],
    teamMembers: Array.isArray(teamMembers) ? teamMembers : [],
    openRoles: Array.isArray(openRoles) ? openRoles : [],
  };

  const project = createProject(input, { id: userId, name: user.name ?? "You" });
  return NextResponse.json({ project }, { status: 201 });
}
