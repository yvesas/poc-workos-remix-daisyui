import type { ActionFunctionArgs } from "react-router";
import { signOut } from "@workos-inc/authkit-remix";

/**
 * API route to handle user logout
 * Follows Remix best practices: server-side logic in .server.ts
 */
export async function action({ request }: ActionFunctionArgs) {
  return signOut(request);
}
