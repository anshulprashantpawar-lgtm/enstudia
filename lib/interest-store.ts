import fs from "fs";
import path from "path";
import { randomUUID } from "crypto";

const DATA_FILE = path.join(process.cwd(), "data", "interests.json");

export interface StoredInterest {
  id: string;
  projectId: string;
  userId: string;
  userName: string;
  userSkills: string[];
  role: string | null;  // null = general interest, string = specific role applied for
  message: string;
  createdAt: string;
}

function readInterests(): StoredInterest[] {
  try {
    if (!fs.existsSync(DATA_FILE)) return [];
    return JSON.parse(fs.readFileSync(DATA_FILE, "utf-8"));
  } catch {
    return [];
  }
}

function writeInterests(interests: StoredInterest[]): void {
  const dir = path.dirname(DATA_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(DATA_FILE, JSON.stringify(interests, null, 2));
}

export function getInterestsByProject(projectId: string): StoredInterest[] {
  return readInterests()
    .filter((i) => i.projectId === projectId)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function getInterestsByUser(userId: string): StoredInterest[] {
  return readInterests().filter((i) => i.userId === userId);
}

export function hasUserExpressedInterest(projectId: string, userId: string): boolean {
  return readInterests().some((i) => i.projectId === projectId && i.userId === userId);
}

export function countInterestsByProject(projectId: string): number {
  return readInterests().filter((i) => i.projectId === projectId).length;
}

export function createInterest(
  data: Omit<StoredInterest, "id" | "createdAt">
): StoredInterest {
  const interests = readInterests();
  const interest: StoredInterest = {
    ...data,
    id: `i-${randomUUID().slice(0, 8)}`,
    createdAt: new Date().toISOString(),
  };
  interests.push(interest);
  writeInterests(interests);
  return interest;
}
