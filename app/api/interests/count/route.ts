import { NextRequest, NextResponse } from "next/server";
import { countInterestsByProject } from "@/lib/interest-store";

export async function GET(req: NextRequest) {
  const projectId = req.nextUrl.searchParams.get("projectId");
  if (!projectId) {
    return NextResponse.json({ error: "projectId is required." }, { status: 400 });
  }
  return NextResponse.json({ count: countInterestsByProject(projectId) });
}
