import { type ActionFunctionArgs, type LoaderFunctionArgs } from "react-router";
import { json, redirect } from '~/utils/responses';
import { setThemeCookie } from "~/utils/theme";
import type { DaisyTheme } from "~/types";

/**
 * API route to handle theme changes
 * Follows Remix best practices: action for mutations
 */
export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const theme = formData.get("theme") as DaisyTheme;

  if (!theme) {
    return json({ error: "Theme is required" }, { status: 400 });
  }

  const referer = request.headers.get('Referer') || '/';
  return redirect(referer, {
    headers: {
      'Set-Cookie': setThemeCookie(theme),
    },
  });
}

// Provide a loader to gracefully handle accidental GET requests
export async function loader({ request }: LoaderFunctionArgs) {
  return json({ message: "Use POST to alterar o tema" });
}
