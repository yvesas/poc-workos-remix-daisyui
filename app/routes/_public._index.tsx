import {
  useFetcher,
  type LoaderFunctionArgs,
} from "react-router";
import { useEffect } from "react";
import { redirect } from "~/utils/responses";
import { Logo } from "~/components/Logo";
import {
  getUserFromSession,
} from "~/services/authService.server";

/**
 * Landing page - public page showcasing the POC
 * Features: information about React Router v7, DaisyUI, and WorkOS
 */

// Redirect to home if already logged in
export async function loader({
  request,
}: LoaderFunctionArgs): Promise<Response | null> {
  const user = await getUserFromSession(request);
  if (user) {
    return redirect("/home");
  }
  return null;
}

export default function LandingPage() {
  const workos = useFetcher<any>();
  useEffect(() => {
    if (workos.state === "idle" && !workos.data) {
      try {
        workos.load("/auth/info");
      } catch (e) {
        console.error("[workos] falha ao carregar /auth/info", e);
      }
    }
  }, [workos.state]);

  useEffect(() => {
    if (workos.state === "idle" && workos.data && !workos.data?.signInUrl) {
      console.error("[workos] signInUrl indisponível", workos.data);
    }
  }, [workos.state, workos.data]);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="hero min-h-screen bg-gradient-to-br from-primary/10 via-base-100 to-secondary/10">
        <div className="hero-content text-center">
          <div className="max-w-4xl">
            <div className="flex justify-center mb-8">
              <Logo className="w-24 h-24 text-primary" />
            </div>
            <h1 className="text-6xl font-bold mb-6">POC-wOS-remix</h1>
            <p className="text-2xl mb-8 text-base-content/80">
              Proof of Concept: React Router v7 + DaisyUI + WorkOS
            </p>
            <p className="text-lg mb-12 text-base-content/60 max-w-2xl mx-auto">
              Uma aplicação moderna demonstrando as capacidades do React Router
              v7 em modo framework, a flexibilidade do DaisyUI com múltiplos
              temas, e preparada para integração com WorkOS para autenticação
              empresarial.
            </p>

            {/* Login Card */}
            <div className="card bg-base-100 shadow-2xl max-w-md mx-auto">
              <div className="card-body">
                <h2 className="card-title justify-center mb-4">
                  Entrar no Sistema
                </h2>
                <p className="text-sm text-base-content/60 text-center mb-4">
                  Autenticação segura com WorkOS
                </p>
                <a
                  href="/auth/login"
                  className="btn btn-primary w-full"
                  onClick={() => {
                    console.log("[workos] Iniciando login via Hosted Sign-in");
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-5 h-5"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12 1.5a5.25 5.25 0 00-5.25 5.25v3a3 3 0 00-3 3v6.75a3 3 0 003 3h10.5a3 3 0 003-3v-6.75a3 3 0 00-3-3v-3c0-2.9-2.35-5.25-5.25-5.25zm3.75 8.25v-3a3.75 3.75 0 10-7.5 0v3h7.5z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Entrar com WorkOS
                </a>
                {workos.state === "idle" && workos.data && !workos.data?.signInUrl && (
                  <div className="alert alert-warning mt-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="stroke-current shrink-0 h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                      />
                    </svg>
                    <span>
                      WorkOS não configurado. Defina WORKOS_CLIENT_ID,
                      WORKOS_API_KEY, WORKOS_REDIRECT_URI e
                      WORKOS_COOKIE_PASSWORD.
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-base-200">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-16">
            Tecnologias da POC
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* React Router v7 */}
            <div className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow">
              <div className="card-body">
                <div className="text-4xl mb-4">⚡</div>
                <h3 className="card-title">React Router v7</h3>
                <p className="text-base-content/70">
                  Framework mode com SSR, loaders, actions, e nested routes. A
                  evolução do Remix com melhorias de performance e developer
                  experience.
                </p>
                <div className="card-actions justify-end mt-4">
                  <div className="badge badge-primary">Framework Mode</div>
                  <div className="badge badge-outline">SSR</div>
                </div>
              </div>
            </div>

            {/* DaisyUI */}
            <div className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow">
              <div className="card-body">
                <div className="text-4xl mb-4">🎨</div>
                <h3 className="card-title">DaisyUI</h3>
                <p className="text-base-content/70">
                  Biblioteca de componentes para Tailwind CSS com 7 temas
                  pré-configurados: light, dark, cupcake, business, night,
                  dracula e winter.
                </p>
                <div className="card-actions justify-end mt-4">
                  <div className="badge badge-secondary">7 Temas</div>
                  <div className="badge badge-outline">Tailwind</div>
                </div>
              </div>
            </div>

            {/* WorkOS */}
            <div className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow">
              <div className="card-body">
                <div className="text-4xl mb-4">🔐</div>
                <h3 className="card-title">WorkOS</h3>
                <p className="text-base-content/70">
                  Plataforma de autenticação empresarial com SSO, SAML, e
                  gerenciamento de usuários integrada nesta aplicação.
                </p>
                <div className="card-actions justify-end mt-4">
                  <div className="badge badge-success">Ativo</div>
                  <div className="badge badge-outline">SSO</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Architecture Section */}
      <div className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-16">
            Arquitetura BFF
          </h2>
          <div className="max-w-4xl mx-auto">
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <p className="text-lg text-base-content/80 mb-6">
                  Esta POC implementa o padrão{" "}
                  <strong>Backend for Frontend (BFF)</strong>, onde as rotas de
                  API do React Router v7 funcionam como uma camada intermediária
                  entre o frontend e os serviços backend.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-bold mb-2 flex items-center gap-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-5 h-5 text-success"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      Benefícios
                    </h4>
                    <ul className="list-disc list-inside space-y-1 text-base-content/70">
                      <li>Segurança aprimorada</li>
                      <li>Otimização de dados</li>
                      <li>Versionamento independente</li>
                      <li>Type-safety end-to-end</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-bold mb-2 flex items-center gap-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-5 h-5 text-info"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
                        />
                      </svg>
                      Implementação
                    </h4>
                    <ul className="list-disc list-inside space-y-1 text-base-content/70">
                      <li>Rotas em /api/*</li>
                      <li>Loaders para leitura</li>
                      <li>Actions para escrita</li>
                      <li>Validação centralizada</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="footer footer-center p-10 bg-base-200 text-base-content">
        <aside>
          <Logo className="w-12 h-12 text-primary" />
          <p className="font-bold text-lg">POC-wOS-remix</p>
          <p className="text-base-content/60">Versão 0.1.0</p>
          <p className="text-sm text-base-content/50 mt-2">
            Demonstrando React Router v7, DaisyUI e arquitetura BFF
          </p>
        </aside>
      </footer>
    </div>
  );
}
