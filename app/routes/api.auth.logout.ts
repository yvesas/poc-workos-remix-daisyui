import type { ActionFunctionArgs } from 'react-router';
import { logout } from '~/services/authService.server';

/**
 * API route to handle user logout
 * Follows Remix best practices: server-side logic in .server.ts
 */
export async function action({ request }: ActionFunctionArgs) {
  return logout(request);
}
