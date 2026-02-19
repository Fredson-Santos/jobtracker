import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useTheme } from '../context/ThemeContext'

export default function Layout() {
  const { dark, toggle } = useTheme()
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 font-sans text-gray-900 dark:text-white transition-colors">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
          {/* Logo */}
          <NavLink to="/" className="flex items-center gap-2 no-underline">
            <span className="text-xl">🎯</span>
            <h1 className="font-heading font-bold text-lg text-gray-900 dark:text-white">JobTracker</h1>
          </NavLink>

          {/* Nav tabs — visível md+ */}
          <nav className="hidden md:flex items-center gap-1 bg-gray-100 dark:bg-gray-700/50 rounded-full p-1">
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                `px-4 py-1.5 rounded-full text-sm font-medium transition-colors no-underline ${
                  isActive
                    ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`
              }
            >
              Dashboard
            </NavLink>
            <NavLink
              to="/vagas"
              className={({ isActive }) =>
                `px-4 py-1.5 rounded-full text-sm font-medium transition-colors no-underline ${
                  isActive
                    ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`
              }
            >
              Vagas
            </NavLink>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-1.5">
            {/* Add button */}
            <button
              onClick={() => navigate('/vagas/nova')}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-600 dark:text-gray-300"
              title="Nova vaga"
            >
              <span className="material-icons-round text-xl">add</span>
            </button>

            {/* Dark mode toggle */}
            <button
              onClick={toggle}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-600 dark:text-gray-300"
              title={dark ? 'Modo claro' : 'Modo escuro'}
            >
              <span className="material-icons-round text-xl">
                {dark ? 'light_mode' : 'dark_mode'}
              </span>
            </button>

            {/* Avatar */}
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-bold ml-1">
              F
            </div>
          </div>
        </div>

        {/* Nav mobile — visível apenas < md */}
        <nav className="md:hidden flex border-t border-gray-200 dark:border-gray-700">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-medium transition-colors no-underline ${
                isActive
                  ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                  : 'text-gray-500 dark:text-gray-400'
              }`
            }
          >
            <span className="material-icons-round text-lg">dashboard</span>
            Dashboard
          </NavLink>
          <NavLink
            to="/vagas"
            className={({ isActive }) =>
              `flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-medium transition-colors no-underline ${
                isActive
                  ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                  : 'text-gray-500 dark:text-gray-400'
              }`
            }
          >
            <span className="material-icons-round text-lg">work_outline</span>
            Vagas
          </NavLink>
        </nav>
      </header>

      {/* Content */}
      <main className="max-w-5xl mx-auto px-4 py-6">
        <Outlet />
      </main>
    </div>
  )
}
