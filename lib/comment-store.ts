import fs from "fs";
import path from "path";
import { randomUUID } from "crypto";

const DATA_FILE = path.join(process.cwd(), "data", "comments.json");

export interface StoredComment {
  id: string;
  projectId: string;
  userId: string;
  userName: string;
  text: string;
  createdAt: string;
}

function readComments(): StoredComment[] {
  try {
    if (!fs.existsSync(DATA_FILE)) return [];
    return JSON.parse(fs.readFileSync(DATA_FILE, "utf-8"));
  } catch {
    return [];
  }
}

function writeComments(comments: StoredComment[]): void {
  const dir = path.dirname(DATA_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(DATA_FILE, JSON.stringify(comments, null, 2));
}

/** Comments for a project, oldest first (chronological reading order). */
export function getCommentsByProject(projectId: string): StoredComment[] {
  return readComments()
    .filter((c) => c.projectId === projectId)
    .sort((a, b) => a.createdAt.localeCompare(b.createdAt));
}

export function createComment(
  data: Omit<StoredComment, "id" | "createdAt">
): StoredComment {
  const comments = readComments();
  const comment: StoredComment = {
    ...data,
    id: `c-${randomUUID().slice(0, 8)}`,
    createdAt: new Date().toISOString(),
  };
  comments.push(comment);
  writeComments(comments);
  return comment;
}
