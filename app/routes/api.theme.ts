import { type ActionFunctionArgs } from 'react-router';
import { json } from '~/utils/responses';
import { setThemeCookie } from '~/utils/theme';
import type { DaisyTheme } from '~/types';

/**
 * API route to handle theme changes
 * Follows Remix best practices: action for mutations
 */
export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const theme = formData.get('theme') as DaisyTheme;

  if (!theme) {
    return json({ error: 'Theme is required' }, { status: 400 });
  }

  return json(
    { success: true },
    {
      headers: {
        'Set-Cookie': setThemeCookie(theme),
      },
    }
  );
}
