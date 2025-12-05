import {
  Form,
  useActionData,
  useNavigation,
  useFetcher,
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
} from "react-router";
import { json, redirect } from "~/utils/responses";
import { Logo } from "~/components/Logo";
import {
  getUserFromSession,
  createUserSession,
} from "~/services/authService.server";

type ActionData = {
  error?: string;
};

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

export async function action({
  request,
}: ActionFunctionArgs): Promise<Response> {
  const formData = await request.formData();
  const email = formData.get("email");
  const password = formData.get("password");

  if (!email || !password) {
    return json<ActionData>(
      { error: "Email e senha são obrigatórios" },
      { status: 400 }
    );
  }
  // Mock login direto: cria sessão e redireciona para /home
  return createUserSession("user-123", "/home");
}

export default function LandingPage() {
  const actionData = useActionData<ActionData>();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";
  const workos = useFetcher<any>();
  if (workos.state === "idle" && !workos.data) {
    workos.load("/auth/info");
  }

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

            {/* Login Form */}
            <div className="card bg-base-100 shadow-2xl max-w-md mx-auto">
              <div className="card-body">
                <h2 className="card-title justify-center mb-4">
                  Acesso Rápido
                </h2>
                <Form method="post" className="space-y-4">
                  <div className="form-control">
                    <input
                      type="email"
                      name="email"
                      placeholder="seu@email.com"
                      className="input input-bordered"
                      required
                    />
                  </div>
                  <div className="form-control">
                    <input
                      type="password"
                      name="password"
                      placeholder="Senha"
                      className="input input-bordered"
                      required
                    />
                  </div>
                  {actionData?.error && (
                    <div className="alert alert-error">
                      <span>{actionData.error}</span>
                    </div>
                  )}
                  <button
                    type="submit"
                    className="btn btn-primary w-full"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <span className="loading loading-spinner"></span>
                        Entrando...
                      </>
                    ) : (
                      "Entrar"
                    )}
                  </button>
                </Form>
                <div className="divider">ou</div>
                <a
                  href={workos.data?.signInUrl || "#"}
                  className={`btn btn-secondary w-full ${!workos.data?.signInUrl ? 'btn-disabled' : ''}`}
                  aria-disabled={!workos.data?.signInUrl}
                  onClick={(e) => {
                    if (!workos.data?.signInUrl) e.preventDefault();
                  }}
                >
                  Entrar com WorkOS
                </a>
                {!workos.data?.signInUrl && (
                  <div className="alert alert-warning mt-3">
                    <span>
                      WorkOS não configurado. Defina WORKOS_CLIENT_ID, WORKOS_API_KEY,
                      WORKOS_REDIRECT_URI e WORKOS_COOKIE_PASSWORD.
                    </span>
                  </div>
                )}
                <p className="text-sm text-base-content/60 text-center mt-4">
                  Demo: Use qualquer email e senha
                </p>
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
                  gerenciamento de usuários. Integração planejada para
                  autenticação robusta.
                </p>
                <div className="card-actions justify-end mt-4">
                  <div className="badge badge-accent">Em Breve</div>
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
