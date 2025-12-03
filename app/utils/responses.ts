/**
 * JSON response helper for React Router v7
 * Replaces the removed json() helper from v6
 */
export function json<T>(
  data: T,
  init?: ResponseInit
): Response {
  const headers = new Headers(init?.headers);
  if (!headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json; charset=utf-8');
  }

  return new Response(JSON.stringify(data), {
    ...init,
    headers,
  });
}

/**
 * Redirect helper for React Router v7
 */
export function redirect(url: string, init?: ResponseInit): Response {
  const headers = new Headers(init?.headers);
  headers.set('Location', url);

  return new Response(null, {
    status: 302,
    ...init,
    headers,
  });
}
