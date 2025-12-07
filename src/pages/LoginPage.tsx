import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Avatar } from "../components/Avatar";

// Lista de usuários para o select
const USERS_LIST = [
  { username: "raphael.vascconcelos", name: "Raphael Vasconcelos" },
  { username: "matheus.costa", name: "Matheus Costa" },
  { username: "andrea.vasconcelos", name: "Andrea Vasconcelos" },
  { username: "marcus.lopes", name: "Marcus Lopes" },
];

export function LoginPage() {
  const [selectedUsername, setSelectedUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  
  const selectedUser = USERS_LIST.find(u => u.username === selectedUsername);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // Simular um pequeno delay para melhor UX
    await new Promise((resolve) => setTimeout(resolve, 300));

    const success = login(selectedUsername.trim().toLowerCase(), password);

    if (!success) {
      setError("Usuário ou senha incorretos. Verifique suas credenciais.");
      setIsLoading(false);
    } else {
      setIsLoading(false);
      // O redirecionamento será feito automaticamente pelo App
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-black px-4">
      <div className="w-full max-w-md">
        <div className="bg-gray-800 rounded-2xl shadow-lg border border-gray-700 p-8">
          {/* Logo/Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-500 rounded-xl mb-4 shadow-md">
              <svg
                className="w-8 h-8 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-100 mb-2">
              BNCC Manager
            </h1>
            <p className="text-sm text-gray-400">
              Acesse sua conta para continuar
            </p>
          </div>

          {/* Seleção de Usuário */}
          <div className="mb-5">
            <label
              htmlFor="user-select"
              className="block text-xs font-semibold uppercase tracking-wide text-gray-300 mb-2"
            >
              Selecione seu usuário
            </label>
            <div className="relative">
              <select
                id="user-select"
                value={selectedUsername}
                onChange={(e) => {
                  setSelectedUsername(e.target.value);
                  setError("");
                }}
                className="w-full pl-4 pr-10 py-3 rounded-lg border border-gray-700 bg-gray-900 text-sm text-gray-100 appearance-none focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/30 transition-all cursor-pointer"
              >
                <option value="">-- Selecione um usuário --</option>
                {USERS_LIST.map((user) => (
                  <option key={user.username} value={user.username}>
                    {user.name}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg
                  className="w-5 h-5 text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>
            
            {/* Avatar do usuário selecionado */}
            {selectedUser && (
              <div className="mt-4 flex items-center justify-center gap-3 p-4 bg-gray-800/50 rounded-lg border border-gray-700">
                <Avatar
                  name={selectedUser.name}
                  username={selectedUser.username}
                  size="lg"
                />
                <div className="text-left">
                  <p className="text-sm font-medium text-gray-100">
                    {selectedUser.name}
                  </p>
                  <p className="text-xs text-gray-400">
                    {selectedUser.username}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="bg-red-900/30 border border-red-700 rounded-lg p-3 flex items-start gap-2">
                <svg
                  className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <p className="text-sm text-red-300">{error}</p>
              </div>
            )}


            <div>
              <label
                htmlFor="password"
                className="block text-xs font-semibold uppercase tracking-wide text-gray-300 mb-2"
              >
                Senha
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    className="h-5 w-5 text-gray-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                </div>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError("");
                  }}
                  placeholder="Digite sua senha"
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-700 bg-gray-900 text-sm text-gray-100 placeholder-gray-500 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/30 transition-all"
                  required
                  autoComplete="current-password"
                  disabled={isLoading}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || !selectedUsername}
              className="w-full bg-primary-500 text-white py-3 px-4 rounded-lg font-medium text-sm shadow-sm hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <svg
                    className="animate-spin h-4 w-4 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Entrando...
                </>
              ) : (
                <>
                  Entrar
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
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

