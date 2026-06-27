/**
 * File-based store for user-created projects (prototype only).
 * Shaped to be compatible with the display `Project` type in lib/data.ts.
 */
import fs from "fs";
import path from "path";
import { randomUUID } from "crypto";
import type { Project, Category, Member } from "./data";

const DATA_FILE = path.join(process.cwd(), "data", "projects.json");

export interface StoredProject extends Project {
  ownerId: string;
  seed: false;
}

export interface NewProjectInput {
  name: string;
  shortDescription: string;
  fullDescription: string;
  category: Category;
  stage: Project["stage"];
  skillsNeeded: string[];
  teamMembers: string[]; // additional member names (creator added automatically)
  openRoles: string[];
}

function initials(name: string): string {
  return name
    .split(" ")
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function makeMember(name: string, id?: string): Member {
  return {
    id: id ?? randomUUID(),
    name,
    grade: "",
    school: "",
    avatar: initials(name) || "?",
    skills: [],
    bio: "",
    activeProjects: [],
  };
}

function readProjects(): StoredProject[] {
  try {
    if (!fs.existsSync(DATA_FILE)) return [];
    return JSON.parse(fs.readFileSync(DATA_FILE, "utf-8"));
  } catch {
    return [];
  }
}

function writeProjects(projects: StoredProject[]): void {
  const dir = path.dirname(DATA_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(DATA_FILE, JSON.stringify(projects, null, 2));
}

/** All user-created projects, newest first. */
export function getAllUserProjects(): StoredProject[] {
  return readProjects().sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function getUserProjectsByOwner(ownerId: string): StoredProject[] {
  return getAllUserProjects().filter((p) => p.ownerId === ownerId);
}

export function getUserProjectById(id: string): StoredProject | null {
  return readProjects().find((p) => p.id === id) ?? null;
}

export function createProject(
  input: NewProjectInput,
  owner: { id: string; name: string }
): StoredProject {
  const projects = readProjects();
  const creator = makeMember(owner.name || "You", owner.id);
  const extraMembers = input.teamMembers
    .map((n) => n.trim())
    .filter(Boolean)
    .map((n) => makeMember(n));

  const project: StoredProject = {
    id: `u-${randomUUID().slice(0, 8)}`,
    ownerId: owner.id,
    seed: false,
    name: input.name,
    shortDescription: input.shortDescription,
    fullDescription: input.fullDescription,
    category: input.category,
    stage: input.stage,
    skillsNeeded: input.skillsNeeded,
    members: [creator, ...extraMembers],
    openRoles: input.openRoles,
    createdAt: new Date().toISOString(),
    likes: 0,
  };

  projects.push(project);
  writeProjects(projects);
  return project;
}

export function updateProject(
  id: string,
  patch: Partial<Omit<StoredProject, "id" | "ownerId" | "seed" | "members" | "createdAt">>
): StoredProject | null {
  const projects = readProjects();
  const idx = projects.findIndex((p) => p.id === id);
  if (idx === -1) return null;
  projects[idx] = { ...projects[idx], ...patch };
  writeProjects(projects);
  return projects[idx];
}

export function deleteProject(id: string): boolean {
  const projects = readProjects();
  const filtered = projects.filter((p) => p.id !== id);
  if (filtered.length === projects.length) return false;
  writeProjects(filtered);
  return true;
}
