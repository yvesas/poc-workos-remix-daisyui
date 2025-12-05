import type { LoaderFunctionArgs } from 'react-router';
import { authkitLoader } from '@workos-inc/authkit-remix';

export const loader = (args: LoaderFunctionArgs) => authkitLoader(args as any);

