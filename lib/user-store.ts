/**
 * Simple file-based user store for prototype use.
 * In production this would be replaced with a real database.
 */
import fs from "fs";
import path from "path";

const DATA_FILE = path.join(process.cwd(), "data", "users.json");

export interface StoredUser {
  id: string;
  email: string;
  passwordHash: string;
  onboardingComplete: boolean;
  // Profile fields (filled during onboarding)
  name?: string;
  grade?: string;
  school?: string;
  bio?: string;
  skills?: string[];
  lookingToBuild?: string;
  createdAt: string;
}

function readUsers(): StoredUser[] {
  try {
    if (!fs.existsSync(DATA_FILE)) return [];
    const raw = fs.readFileSync(DATA_FILE, "utf-8");
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function writeUsers(users: StoredUser[]): void {
  const dir = path.dirname(DATA_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(DATA_FILE, JSON.stringify(users, null, 2));
}

export function getUserByEmail(email: string): StoredUser | null {
  return readUsers().find((u) => u.email === email) ?? null;
}

export function getUserById(id: string): StoredUser | null {
  return readUsers().find((u) => u.id === id) ?? null;
}

export function createUser(data: Omit<StoredUser, "createdAt">): StoredUser {
  const users = readUsers();
  const user: StoredUser = { ...data, createdAt: new Date().toISOString() };
  users.push(user);
  writeUsers(users);
  return user;
}

export function getAllOnboardedUsers(): Omit<StoredUser, "passwordHash" | "email">[] {
  return readUsers()
    .filter((u) => u.onboardingComplete)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    .map(({ passwordHash, email, ...safe }) => safe);
}

export function updateUser(id: string, patch: Partial<StoredUser>): StoredUser | null {
  const users = readUsers();
  const idx = users.findIndex((u) => u.id === id);
  if (idx === -1) return null;
  users[idx] = { ...users[idx], ...patch };
  writeUsers(users);
  return users[idx];
}
