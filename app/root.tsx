import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from 'react-router';

import type { Route } from './+types/root';
import './app.css';
import { getThemeFromCookie } from './utils/theme';
import { json } from './utils/responses';

export const links: Route.LinksFunction = () => [
  { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
  {
    rel: 'preconnect',
    href: 'https://fonts.gstatic.com',
    crossOrigin: 'anonymous',
  },
  {
    rel: 'stylesheet',
    href: 'https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap',
  },
];

export async function loader({ request }: Route.LoaderArgs): Promise<Response> {
  const theme = getThemeFromCookie(request) || 'light';
  return json({ theme });
}

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body suppressHydrationWarning>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  const data = useLoaderData<{ theme: string }>();
  const theme = data?.theme || 'light';

  return (
    <div data-theme={theme} suppressHydrationWarning>
      <Outlet />
    </div>
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = 'Oops!';
  let details = 'Ocorreu um erro inesperado.';
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? '404' : 'Erro';
    details =
      error.status === 404
        ? 'A página solicitada não foi encontrada.'
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-base-200">
      <div className="card bg-base-100 shadow-xl max-w-2xl">
        <div className="card-body">
          <h1 className="card-title text-4xl text-error">{message}</h1>
          <p className="text-lg">{details}</p>
          {stack && (
            <div className="mockup-code mt-4">
              <pre className="overflow-x-auto">
                <code>{stack}</code>
              </pre>
            </div>
          )}
          <div className="card-actions justify-end mt-4">
            <a href="/" className="btn btn-primary">
              Voltar ao Início
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
