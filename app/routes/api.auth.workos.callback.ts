import { type LoaderFunctionArgs } from "react-router";
import { json } from "~/utils/responses";

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");

  if (!code) {
    return json({ error: "Código ausente na callback" }, { status: 400 });
  }

  return json({ message: "Callback recebido", code, state });
}

