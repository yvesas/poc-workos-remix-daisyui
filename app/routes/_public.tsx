import { Outlet } from 'react-router';

/**
 * Public layout route
 * Simple layout for public pages (landing page)
 */
export default function PublicLayout() {
  return (
    <div className="min-h-screen bg-base-100">
      <Outlet />
    </div>
  );
}
