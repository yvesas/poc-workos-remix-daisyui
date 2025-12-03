import { createCookieSessionStorage } from 'react-router';
import { redirect } from '~/utils/responses';
import type { User } from '~/types';

// Session configuration
const sessionSecret = process.env.SESSION_SECRET || 'default-secret-change-in-production';

const { getSession, commitSession, destroySession } = createCookieSessionStorage({
  cookie: {
    name: '__session',
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
    sameSite: 'lax',
    secrets: [sessionSecret],
    secure: process.env.NODE_ENV === 'production',
  },
});

export { getSession, commitSession, destroySession };

// Get user from session
export async function getUserFromSession(request: Request): Promise<User | null> {
  const session = await getSession(request.headers.get('Cookie'));
  const userId = session.get('userId');
  
  if (!userId) {
    return null;
  }

  // In a real app, fetch user from database
  // For now, return mock user
  return {
    id: userId,
    email: 'user@example.com',
    firstName: 'John',
    lastName: 'Doe',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
  };
}

// Require authenticated user or redirect to login
export async function requireUser(request: Request): Promise<User> {
  const user = await getUserFromSession(request);
  
  if (!user) {
    throw redirect('/');
  }
  
  return user;
}

// Create user session (mock login)
export async function createUserSession(userId: string, redirectTo: string) {
  const session = await getSession();
  session.set('userId', userId);
  
  return redirect(redirectTo, {
    headers: {
      'Set-Cookie': await commitSession(session),
    },
  });
}

// Logout user
export async function logout(request: Request) {
  const session = await getSession(request.headers.get('Cookie'));
  
  return redirect('/', {
    headers: {
      'Set-Cookie': await destroySession(session),
    },
  });
}
