import { NavLink, Outlet } from "react-router-dom";

const navigation = [
  { to: "/", label: "Dashboard", icon: "📊" },
  { to: "/portfolio", label: "Portfolio", icon: "💼" },
  { to: "/kyc", label: "KYC", icon: "🔐" },
  { to: "/dataroom", label: "Data Room", icon: "📁" },
];

export function Layout() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🏦</span>
              <h1 className="text-xl font-bold text-gray-900">
                CantonTreasury
              </h1>
            </div>
            <nav className="flex items-center gap-1">
              {navigation.map(({ to, label, icon }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={to === "/"}
                  className={({ isActive }) =>
                    `flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-treasury-50 text-treasury-700"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                    }`
                  }
                >
                  <span>{icon}</span>
                  <span className="hidden sm:inline">{label}</span>
                </NavLink>
              ))}
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-gray-400">
          CantonTreasury &mdash; Tokenized Treasury Bills on the Canton Network
        </div>
      </footer>
    </div>
  );
}
