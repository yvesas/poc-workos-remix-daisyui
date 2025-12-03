import { Link, useLocation } from 'react-router';

/**
 * Sidebar component for private layout
 * Features: navigation menu, version label
 * Follows Single Responsibility Principle - only handles sidebar navigation
 */
export function Sidebar() {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <aside className="w-64 bg-base-200 min-h-screen flex flex-col border-r border-base-300">
      {/* Navigation Menu */}
      <nav className="flex-1 p-4">
        <ul className="menu gap-2">
          <li>
            <Link
              to="/home"
              className={isActive('/home') ? 'active' : ''}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
                />
              </svg>
              Home
            </Link>
          </li>
          <li>
            <Link
              to="/perfil"
              className={isActive('/perfil') ? 'active' : ''}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                />
              </svg>
              Perfil
            </Link>
          </li>
        </ul>
      </nav>

      {/* Version Footer */}
      <div className="p-4 border-t border-base-300">
        <div className="text-center text-sm opacity-60">
          <span className="font-mono">v0.1.0</span>
        </div>
      </div>
    </aside>
  );
}
