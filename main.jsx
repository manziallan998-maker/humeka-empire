import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../lib/AuthContext'

const links = [
  { to: '/publisher', label: 'Dashboard', end: true },
  { to: '/publisher/videos', label: 'Videos' },
  { to: '/publisher/youtube-sync', label: 'YouTube sync' },
  { to: '/publisher/posts', label: 'Posts' },
  { to: '/publisher/settings', label: 'Site settings' }
]

export default function Layout() {
  const { signOut, user } = useAuth()
  const navigate = useNavigate()

  async function handleSignOut() {
    await signOut()
    navigate('/publisher/login')
  }

  const linkClass = ({ isActive }) =>
    `block px-4 py-2.5 rounded-md text-sm font-medium transition-colors ${
      isActive ? 'bg-grass-500 text-pitch-950' : 'text-chalk-300 hover:bg-pitch-700'
    }`

  return (
    <div className="min-h-screen bg-pitch-950 flex">
      <aside className="w-60 shrink-0 border-r border-pitch-700 p-4 flex flex-col">
        <p className="font-display text-xl text-grass-400 px-2 mb-6">
          HUMEKA<span className="text-whistle-500">TV</span>
          <span className="block text-xs text-chalk-500 font-body font-normal mt-0.5">
            Publisher panel
          </span>
        </p>

        <nav className="space-y-1 flex-1">
          {links.map((link) => (
            <NavLink key={link.to} to={link.to} end={link.end} className={linkClass}>
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-pitch-700 pt-4 mt-4">
          <p className="text-chalk-500 text-xs truncate px-2 mb-2">{user?.email}</p>
          <button
            onClick={handleSignOut}
            className="w-full text-left px-4 py-2.5 rounded-md text-sm font-medium text-chalk-300 hover:bg-pitch-700"
          >
            Sign out
          </button>
        </div>
      </aside>

      <main className="flex-1 p-8 max-w-4xl">
        <Outlet />
      </main>
    </div>
  )
}
