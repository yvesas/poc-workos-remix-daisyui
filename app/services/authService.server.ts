import type { User } from "~/types";
import {
  getUserFromSession as _getUserFromSession,
  requireUser as _requireUser,
  logout as _logout,
} from "~/utils/session.server";

/**
 * Authentication service
 * Delegates to WorkOS-based session utilities
 */

export async function getUserFromSession(request: Request): Promise<User | null> {
  return _getUserFromSession(request);
}

export async function requireUser(request: Request): Promise<User> {
  return _requireUser(request);
}

export async function logout(request: Request) {
  return _logout(request);
}
