import { Outlet, useLoaderData, type LoaderFunctionArgs } from 'react-router';
import { json } from '~/utils/responses';
import { requireUser } from '~/services/authService.server';
import { getThemeFromCookie } from '~/utils/theme';
import { Header } from '~/components/Header';
import { Sidebar } from '~/components/Sidebar';
import type { User, DaisyTheme } from '~/types';

type LoaderData = {
  user: User;
  theme: DaisyTheme;
};

/**
 * Private layout route
 * Requires authentication and provides layout structure
 * Follows Remix best practices: loader for data fetching, nested routes
 */
export async function loader({ request }: LoaderFunctionArgs) {
  const user = await requireUser(request);
  const theme = getThemeFromCookie(request) || 'light';

  return json<LoaderData>({ user, theme });
}

export default function PrivateLayout() {
  const { user, theme } = useLoaderData<typeof loader>();

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header user={user} currentTheme={theme} />
        <main className="flex-1 overflow-y-auto bg-base-100 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
