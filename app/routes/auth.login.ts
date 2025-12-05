import { json, redirect } from "~/utils/responses";
import type { LoaderFunctionArgs } from "react-router";
import { authkitLoader } from "@workos-inc/authkit-remix";

export async function loader(args: LoaderFunctionArgs) {
  const data = (await authkitLoader(args as any)) as any;
  const signInUrl = data?.signInUrl as string | undefined;
  if (signInUrl) return redirect(signInUrl);
  return json(
    { error: "WorkOS não configurado: signInUrl indisponível" },
    { status: 501 }
  );
}
