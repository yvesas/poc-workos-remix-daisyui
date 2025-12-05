import { Outlet, useLoaderData, type LoaderFunctionArgs } from "react-router";
import { json, redirect } from "~/utils/responses";
import { getThemeFromCookie } from "~/utils/theme";
import { Header } from "~/components/Header";
import { Sidebar } from "~/components/Sidebar";
import type { User, DaisyTheme } from "~/types";
import { authkitLoader } from "@workos-inc/authkit-remix";

type LoaderData = {
  user: User;
  theme: DaisyTheme;
};

/**
 * Private layout route
 * Requires authentication and provides layout structure
 * Follows Remix best practices: loader for data fetching, nested routes
 */
export async function loader(args: LoaderFunctionArgs) {
  const data = (await authkitLoader(args as any)) as any;
  const user = data?.user as User | null;
  const signInUrl = data?.signInUrl as string | undefined;
  if (!user) {
    if (signInUrl) return redirect(signInUrl);
    return redirect("/");
  }
  const theme = getThemeFromCookie(args.request) || "light";
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
