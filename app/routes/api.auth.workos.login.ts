import { type LoaderFunctionArgs } from "react-router";
import { json } from "~/utils/responses";

export async function loader({ request }: LoaderFunctionArgs) {
  const apiKey = process.env.WORKOS_API_KEY || import.meta.env.WORKOS_API_KEY;
  const clientId =
    process.env.WORKOS_CLIENT_ID || import.meta.env.WORKOS_CLIENT_ID;
  const redirectUri =
    process.env.WORKOS_REDIRECT_URI || import.meta.env.WORKOS_REDIRECT_URI;

  if (!apiKey || !clientId || !redirectUri) {
    return json(
      {
        error: "WorkOS não configurado",
        missing: {
          WORKOS_API_KEY: !!apiKey,
          WORKOS_CLIENT_ID: !!clientId,
          WORKOS_REDIRECT_URI: !!redirectUri,
        },
      },
      { status: 501 }
    );
  }

  return json({
    message: "WorkOS configurado. Integrar provider e org domains.",
  });
}
