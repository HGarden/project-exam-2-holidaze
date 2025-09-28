import './header.css'
import SearchForm from '@/components/SearchForm.jsx';
import { Link, NavLink } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';
import ctx from '@/components/context.jsx';

function Header() {
  const { auth, addToast, setPage } = useContext(ctx);
  const loggedIn = !!auth?.token;
  const isManager = !!auth?.user?.venueManager;
  const [showSearch, setShowSearch] = useState(false);
  // Force light theme
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', 'light');
    localStorage.removeItem('theme');
  }, []);

  // Close search modal on Escape
  useEffect(() => {
    if (!showSearch) return;
    function onKey(e) { if (e.key === 'Escape') setShowSearch(false); }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [showSearch]);

  return (
    <header className="navbar bg-base-100 border-b border-base-200 sticky top-0 z-40">
      <div className="flex flex-1 min-w-0 items-center gap-2 whitespace-nowrap">
        <div className="flex items-center gap-2">
          {/* Mobile menu */}
          <div className="dropdown md:hidden">
            <div tabIndex={0} role="button" className="btn btn-ghost" aria-label="Open menu">☰</div>
            <ul tabIndex={0} className="menu dropdown-content bg-base-100 text-base-content rounded-box z-[1] w-52 p-2 shadow mt-2">
              <li><NavLink to="/" onClick={() => setPage?.(1)}>Home</NavLink></li>
              {isManager && <li><NavLink to="/admin">Admin</NavLink></li>}
              {loggedIn ? (
                <>
                  <li><NavLink to="/profile">Profile</NavLink></li>
                  <li><button onClick={() => { auth.setUser(null); auth.setToken(null); addToast('Logged out', 'success'); }}>Logout</button></li>
                </>
              ) : (
                <>
                  <li><NavLink to="/login">Login</NavLink></li>
                  <li><NavLink to="/register">Register</NavLink></li>
                </>
              )}
            </ul>
          </div>
          <Link to="/" onClick={() => setPage?.(1)} className="btn btn-ghost text-2xl md:text-3xl logo-text shrink-0">Holidaze</Link>
        </div>
        <nav className="hidden md:flex gap-2 ml-2 items-center">
          <NavLink
            to="/"
            onClick={() => setPage?.(1)}
            className={({ isActive }) => `btn btn-ghost ${isActive ? 'btn-active' : ''}`}
            aria-label="Home"
            title="Home"
          >
            {/* Home icon only */}
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 opacity-70">
              <path d="M11.47 3.84a.75.75 0 01.94 0l7.5 6a.75.75 0 01.28.58V20a2 2 0 01-2 2h-3.75a.75.75 0 01-.75-.75V16a1 1 0 00-1-1h-2a1 1 0 00-1 1v5.25a.75.75 0 01-.75.75H4.25A2.25 2.25 0 012 19.75V10.4a.75.75 0 01.28-.58l3.5-2.8V5.25a.75.75 0 01.75-.75h1.5a.75.75 0 01.75.75V6l2.69-2.16z" />
            </svg>
            <span className="sr-only">Home</span>
          </NavLink>
          {isManager && (
            <NavLink
              to="/admin"
              className={({ isActive }) => `btn btn-ghost ${isActive ? 'btn-active' : ''}`}
            >
              Admin
            </NavLink>
          )}
        </nav>
      </div>
      <div className="flex items-center gap-2 min-w-0">
        {/* Mobile search (modal) */}
        <button
          type="button"
          className="btn btn-ghost sm:hidden"
          aria-label="Open search"
          onClick={() => setShowSearch(true)}
        >
          {/* Inline SVG magnifying glass for robust rendering */}
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
            <path fillRule="evenodd" d="M10.5 3a7.5 7.5 0 105.012 13.138l3.675 3.675a.75.75 0 101.06-1.06l-3.675-3.676A7.5 7.5 0 0010.5 3zm-6 7.5a6 6 0 1110.93 3.536A6 6 0 014.5 10.5z" clipRule="evenodd" />
          </svg>
          <span className="sr-only">Search</span>
        </button>
        {/* Inline search on sm+ */}
        <div className="hidden sm:block max-w-[40vw] sm:max-w-xs md:max-w-sm">
          <SearchForm />
        </div>
        {/* Theme toggle removed: using cohesive light theme */}
        {loggedIn ? (
          <div className="dropdown dropdown-end hidden md:block">
            <div tabIndex={0} role="button" className="btn btn-ghost whitespace-nowrap max-w-[12rem] truncate">
              {auth.user?.name || 'Account'}
            </div>
            <ul tabIndex={0} className="menu dropdown-content bg-base-100 text-base-content rounded-box z-[1] w-52 p-2 shadow">
              <li><Link to="/profile">Profile</Link></li>
              {isManager && <li><Link to="/admin">Manage Venues</Link></li>}
              <li><Link to="/login" onClick={() => { auth.setUser(null); auth.setToken(null); addToast('Logged out', 'success'); }}>Logout</Link></li>
            </ul>
          </div>
        ) : (
          <div className="hidden md:flex join">
            <Link className="btn join-item" to="/login">Login</Link>
            <Link className="btn join-item btn-primary" to="/register">Register</Link>
          </div>
        )}
      </div>
      {/* Mobile search modal overlay */}
      {showSearch && (
        <div
          className="fixed inset-0 z-[70] flex items-start justify-center pt-16 bg-black/40"
          role="dialog"
          aria-modal="true"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowSearch(false);
          }}
        >
          <div className="bg-base-100 text-base-content rounded-box shadow-md w-[min(95vw,28rem)] p-4">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-sm opacity-70">Search</h2>
              <button className="btn btn-ghost btn-sm" onClick={() => setShowSearch(false)} aria-label="Close search">✕</button>
            </div>
            <SearchForm autoFocus />
          </div>
        </div>
      )}
    </header>
  )
}

export default Header