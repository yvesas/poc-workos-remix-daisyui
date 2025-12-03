import type { User } from "~/types";
import {
  getUserFromSession as _getUserFromSession,
  requireUser as _requireUser,
  createUserSession as _createUserSession,
  logout as _logout,
} from "~/utils/session.server";

export async function getUserFromSession(request: Request): Promise<User | null> {
  return _getUserFromSession(request);
}

export async function requireUser(request: Request): Promise<User> {
  return _requireUser(request);
}

export async function createUserSession(userId: string, redirectTo: string) {
  return _createUserSession(userId, redirectTo);
}

export async function logout(request: Request) {
  return _logout(request);
}
