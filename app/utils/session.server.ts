import { redirect } from '~/utils/responses';
import type { User } from '~/types';

/**
 * Get authenticated user from WorkOS session
 * Returns null if user is not authenticated
 * 
 * Note: This function is a simplified version that returns user data
 * extracted from the WorkOS session. For route loaders/actions,
 * use authkitLoader directly.
 */
export async function getUserFromSession(request: Request): Promise<User | null> {
  try {
    // Import authkitLoader dynamically to avoid issues
    const { authkitLoader } = await import('@workos-inc/authkit-remix');
    const data = (await authkitLoader({ request } as any)) as any;
    const user = data?.user;
    
    if (!user) {
      return null;
    }

    // Map WorkOS user to our User type
    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      phone: '', // WorkOS doesn't provide phone by default
      avatarUrl: user.profilePictureUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.firstName}`,
    };
  } catch (error) {
    // If there's any error getting the user, return null
    console.error('[WorkOS] Error getting user:', error);
    return null;
  }
}

/**
 * Require authenticated user or redirect to login
 * Throws redirect if user is not authenticated
 */
export async function requireUser(request: Request): Promise<User> {
  const user = await getUserFromSession(request);
  
  if (!user) {
    throw redirect('/');
  }
  
  return user;
}

/**
 * Logout user and redirect to home
 * WorkOS handles session destruction
 */
export async function logout(request: Request) {
  return redirect('/');
}
