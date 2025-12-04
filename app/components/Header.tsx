import { Form, Link } from "react-router";
import { Logo } from "./Logo";
import { DAISY_THEMES, type DaisyTheme } from "~/types";
import type { User } from "~/types";
import { useProfileStore } from "~/stores/profileStore";

interface HeaderProps {
  user: User;
  currentTheme: DaisyTheme;
}

/**
 * Header component for private layout
 * Features: theme toggle, theme selector dropdown, logo, user avatar with dropdown
 * Uses Zustand store to display updated user name in real-time
 * Follows Single Responsibility Principle - only handles header UI
 */
export function Header({ user: serverUser, currentTheme }: HeaderProps) {
  // Use Zustand store for real-time user data updates
  const { user: storeUser } = useProfileStore();
  const user = storeUser || serverUser;

  const applyTheme = (theme: DaisyTheme) => {
    document.documentElement.setAttribute("data-theme", theme);
  };

  return (
    <header className="navbar bg-base-100 border-b border-base-300 px-4 gap-4">
      {/* Logo and Product Name */}
      <div className="flex-1">
        <Link
          to="/home"
          className="flex items-center gap-3 hover:opacity-80 transition-opacity"
        >
          <Logo className="w-10 h-10 text-primary" />
          <span className="text-xl font-bold">POC-wOS-remix</span>
        </Link>
      </div>

      {/* Theme Controls */}
      <div className="flex-none gap-2">
        {/* Theme Selector Dropdown */}
        <div className="dropdown dropdown-end">
          <div
            tabIndex={0}
            role="button"
            className="btn btn-ghost btn-sm gap-2"
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
                d="M4.098 19.902a3.75 3.75 0 005.304 0l6.401-6.402M6.75 21A3.75 3.75 0 013 17.25V4.125C3 3.504 3.504 3 4.125 3h5.25c.621 0 1.125.504 1.125 1.125v4.072M6.75 21a3.75 3.75 0 003.75-3.75V8.197M6.75 21h13.125c.621 0 1.125-.504 1.125-1.125v-5.25c0-.621-.504-1.125-1.125-1.125h-4.072M10.5 8.197l2.88-2.88c.438-.439 1.15-.439 1.59 0l3.712 3.713c.44.44.44 1.152 0 1.59l-2.879 2.88M6.75 17.25h.008v.008H6.75v-.008z"
              />
            </svg>
            <span className="hidden sm:inline capitalize">{currentTheme}</span>
          </div>
          <ul
            tabIndex={0}
            className="dropdown-content z-[1] menu p-2 shadow-lg bg-base-100 rounded-box w-52 border border-base-300 mt-2"
          >
            {DAISY_THEMES.map((theme) => (
              <li key={theme}>
                <Form method="post" action="/api/theme">
                  <input type="hidden" name="theme" value={theme} />
                  <button
                    type="submit"
                    onClick={() => applyTheme(theme)}
                    className={`capitalize ${currentTheme === theme ? "active" : ""}`}
                  >
                    {theme}
                  </button>
                </Form>
              </li>
            ))}
          </ul>
        </div>

        {/* User Avatar Dropdown */}
        <div className="dropdown dropdown-end">
          <div tabIndex={0} role="button" className="btn btn-ghost gap-2 px-2">
            {/* User Name - Hidden on small screens */}
            <div className="hidden md:flex flex-col items-end">
              <span className="text-sm font-semibold">
                {user.firstName} {user.lastName}
              </span>
              <span className="text-xs text-base-content/60">{user.email}</span>
            </div>

            {/* Avatar */}
            <div className="avatar placeholder">
              <div className="w-10 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                {user.avatarUrl ? (
                  <img
                    src={user.avatarUrl}
                    alt={`${user.firstName} ${user.lastName}`}
                  />
                ) : (
                  <div className="bg-primary text-primary-content">
                    <span className="text-lg">
                      {user.firstName[0]}
                      {user.lastName[0]}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
          <ul
            tabIndex={0}
            className="dropdown-content z-[1] menu p-2 shadow-lg bg-base-100 rounded-box w-52 border border-base-300 mt-2"
          >
            <li className="menu-title">
              <span>
                {user.firstName} {user.lastName}
              </span>
            </li>
            <li>
              <Link to="/perfil">
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
            <li>
              <Form method="post" action="/api/auth/logout">
                <button type="submit" className="w-full text-left">
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
                      d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75"
                    />
                  </svg>
                  Sair
                </button>
              </Form>
            </li>
          </ul>
        </div>
      </div>
    </header>
  );
}
