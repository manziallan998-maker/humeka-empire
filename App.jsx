import { Link, NavLink } from 'react-router-dom'
import { useSiteSettings } from '../lib/useSiteSettings'

export default function Header() {
  const { settings } = useSiteSettings()

  const linkClass = ({ isActive }) =>
    `px-3 py-2 text-sm font-semibold tracking-wide uppercase transition-colors ${
      isActive ? 'text-whistle-500' : 'text-chalk-300 hover:text-chalk-100'
    }`

  return (
    <header className="sticky top-0 z-40 bg-pitch-950/95 backdrop-blur border-b border-pitch-700">
      <div className="max-w-6xl mx-auto px-4 flex items-center justify-between h-16">
        <Link to="/" className="flex items-center gap-2">
          {settings.logo_url ? (
            <img src={settings.logo_url} alt={settings.site_name} className="h-9 w-auto" />
          ) : (
            <span className="font-display text-2xl text-grass-400">
              HUMEKA<span className="text-whistle-500">TV</span>
            </span>
          )}
        </Link>

        <nav className="hidden sm:flex items-center">
          <NavLink to="/" className={linkClass} end>
            Watch
          </NavLink>
          <NavLink to="/posts" className={linkClass}>
            News
          </NavLink>
          <NavLink to="/about" className={linkClass}>
            About
          </NavLink>
        </nav>

        <a
          href={`https://youtube.com/channel/${settings.youtube_channel_id}?sub_confirmation=1`}
          target="_blank"
          rel="noreferrer"
          className="bg-grass-500 hover:bg-grass-600 text-pitch-950 font-semibold text-sm px-4 py-2 rounded-full transition-colors"
        >
          Subscribe
        </a>
      </div>
    </header>
  )
}
