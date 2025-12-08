import type { LoaderFunctionArgs } from "react-router";
import { authkitLoader } from "@workos-inc/authkit-remix";

export const loader = (args: LoaderFunctionArgs) => {
  const presence = {
    WORKOS_CLIENT_ID: !!process.env.WORKOS_CLIENT_ID,
    WORKOS_API_KEY: !!process.env.WORKOS_API_KEY,
    WORKOS_REDIRECT_URI: !!process.env.WORKOS_REDIRECT_URI,
    WORKOS_COOKIE_PASSWORD: !!process.env.WORKOS_COOKIE_PASSWORD,
    SESSION_SECRET: !!process.env.SESSION_SECRET,
  };
  console.log("[wOS env]", presence);
  return authkitLoader(args as any);
};
