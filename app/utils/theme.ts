import type { DaisyTheme } from '~/types';

export function getThemeFromCookie(request: Request): DaisyTheme | null {
  const cookieHeader = request.headers.get('Cookie');
  if (!cookieHeader) return null;
  
  const match = cookieHeader.match(/theme=([^;]+)/);
  return match ? (match[1] as DaisyTheme) : null;
}

export function setThemeCookie(theme: DaisyTheme): string {
  return `theme=${theme}; Path=/; Max-Age=31536000; SameSite=Lax`;
}
