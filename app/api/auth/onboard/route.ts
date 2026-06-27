import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { updateUser, getUserById } from "@/lib/user-store";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const user = getUserById(session.user.id);
  if (!user) return NextResponse.json({ error: "User not found." }, { status: 404 });
  return NextResponse.json({
    name: user.name ?? "",
    grade: user.grade ?? "",
    school: user.school ?? "",
    bio: user.bio ?? "",
    skills: user.skills ?? [],
    lookingToBuild: user.lookingToBuild ?? "",
    onboardingComplete: user.onboardingComplete,
  });
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { name, grade, school, bio, skills, lookingToBuild } = await req.json();

  if (!name || !grade || !school) {
    return NextResponse.json({ error: "Name, grade, and school are required." }, { status: 400 });
  }

  const userId = session.user.id;
  const updated = updateUser(userId, {
    name,
    grade,
    school,
    bio,
    skills,
    lookingToBuild,
    onboardingComplete: true,
  });

  if (!updated) {
    return NextResponse.json({ error: "User not found." }, { status: 404 });
  }

  return NextResponse.json({ ok: true, name: updated.name });
}
