import type { LoaderFunctionArgs } from "react-router";
import { authLoader } from "@workos-inc/authkit-remix";

export async function loader(_args: LoaderFunctionArgs) {
  return authLoader({ returnPathname: "/home" });
}
