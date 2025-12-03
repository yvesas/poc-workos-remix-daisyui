import { type ActionFunctionArgs } from "react-router";
import { json } from "~/utils/responses";
import { createUserSession } from "~/services/authService.server";

/**
 * API route to handle user login (mock)
 * In production, this would integrate with WorkOS
 */
export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const email = formData.get("email");
  const password = formData.get("password");

  // Mock validation
  if (!email || !password) {
    return json({ error: "Email and password are required" }, { status: 400 });
  }

  // Mock authentication - in production, validate with WorkOS
  // For now, accept any credentials
  const userId = "user-123";

  return createUserSession(userId, "/home");
}
