import { json, redirect } from "~/utils/responses";
import type { LoaderFunctionArgs } from "react-router";
import { authkitLoader } from "@workos-inc/authkit-remix";

export async function loader(args: LoaderFunctionArgs) {
  const data = (await authkitLoader(args as any)) as any;
  const signInUrl = data?.signInUrl as string | undefined;
  if (signInUrl) return redirect(signInUrl);
  console.error("[workos] auth.login signInUrl indisponível", {
    env: {
      WORKOS_CLIENT_ID: !!process.env.WORKOS_CLIENT_ID,
      WORKOS_API_KEY: !!process.env.WORKOS_API_KEY,
      WORKOS_REDIRECT_URI: !!process.env.WORKOS_REDIRECT_URI,
      WORKOS_COOKIE_PASSWORD: !!process.env.WORKOS_COOKIE_PASSWORD,
      SESSION_SECRET: !!process.env.SESSION_SECRET,
    },
    dataKeys: Object.keys(data || {}).sort(),
  });
  return json(
    { error: "WorkOS não configurado: signInUrl indisponível" },
    { status: 501 }
  );
}
