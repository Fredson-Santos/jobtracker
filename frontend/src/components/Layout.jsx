import { NavLink, Outlet } from 'react-router-dom'
import { HiOutlineViewGrid, HiOutlineBriefcase } from 'react-icons/hi'

export default function Layout() {
  return (
    <div className="app-layout">
      <aside className="sidebar">
        <div className="sidebar-logo">
          <span className="logo-icon">🎯</span>
          <h1>JobTracker</h1>
        </div>

        <nav className="sidebar-nav">
          <NavLink to="/" end className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            <HiOutlineViewGrid className="nav-icon" />
            <span>Dashboard</span>
          </NavLink>
          <NavLink to="/vagas" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            <HiOutlineBriefcase className="nav-icon" />
            <span>Vagas</span>
          </NavLink>
        </nav>
      </aside>

      <main className="main-content">
        <Outlet />
      </main>
    </div>
  )
}
