import type { LoaderFunctionArgs } from "react-router";
import { redirect } from "react-router";

/**
 * WorkOS Auth Login Route
 * Redirects user to WorkOS Hosted Sign-in page
 */
export async function loader({ request }: LoaderFunctionArgs) {
  console.log("[auth.login] Iniciando...");
  
  const clientId = process.env.WORKOS_CLIENT_ID;
  const redirectUri = process.env.WORKOS_REDIRECT_URI;

  console.log("[auth.login] Credenciais:", {
    clientId: clientId ? `${clientId.substring(0, 10)}...` : "MISSING",
    redirectUri,
  });

  if (!clientId || !redirectUri) {
    console.error("[auth.login] ERRO: Variáveis de ambiente faltando!");
    throw new Error("WorkOS not configured: missing CLIENT_ID or REDIRECT_URI");
  }

  // Construct WorkOS authorization URL
  const authorizationUrl = new URL("https://api.workos.com/user_management/authorize");
  authorizationUrl.searchParams.set("client_id", clientId);
  authorizationUrl.searchParams.set("redirect_uri", redirectUri);
  authorizationUrl.searchParams.set("response_type", "code");
  authorizationUrl.searchParams.set("provider", "authkit");

  const finalUrl = authorizationUrl.toString();
  console.log("[auth.login] Redirecionando para:", finalUrl);

  // Redirect to WorkOS
  return redirect(finalUrl);
}
