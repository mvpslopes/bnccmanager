import { ReactNode } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Avatar } from "./Avatar";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen flex flex-col bg-gray-900">
      <header className="sticky top-0 z-10 border-b border-gray-800 bg-gray-900 shadow-lg">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="h-16 flex items-center justify-between">
            <div>
              <h1 className="text-lg font-semibold text-gray-100">
                BNCC Manager
              </h1>
              <p className="text-xs text-gray-400 mt-0.5">
                Plataforma de consulta rápida de links
              </p>
            </div>
            <div className="flex items-center gap-4">
              {user && (
                <div className="flex items-center gap-3">
                  <Avatar
                    src={user.avatar}
                    name={user.name}
                    username={user.username}
                    size="md"
                    className="flex-shrink-0"
                  />
                  <div className="text-right hidden sm:block">
                    <p className="text-xs font-medium text-gray-100">
                      {user.name}
                    </p>
                    <p className="text-[10px] text-gray-400">{user.username}</p>
                  </div>
                  <button
                    onClick={logout}
                    className="inline-flex items-center gap-2 text-xs font-medium text-gray-300 hover:text-gray-100 bg-gray-800 hover:bg-gray-700 px-3 py-2 rounded-lg transition-all duration-150"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                      />
                    </svg>
                    Sair
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">{children}</div>
      </main>
    </div>
  );
}


