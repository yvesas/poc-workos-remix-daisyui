import type { LoaderFunctionArgs } from "react-router";
import { redirect } from "react-router";
import { authkitLoader } from "@workos-inc/authkit-remix";

/**
 * WorkOS Callback Route
 * Handles the OAuth callback from WorkOS after user authentication
 */
export async function loader(args: LoaderFunctionArgs) {
  // authkitLoader processes the callback and sets the session
  // Then returns user data or redirects
  const result = await authkitLoader(args as any);
  
  // If we got user data back, redirect to home
  // authkitLoader handles the session creation automatically
  return redirect("/home");
}
