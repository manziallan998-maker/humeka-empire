import { Link } from 'react-router-dom'
import { useSiteSettings } from '../lib/useSiteSettings'

export default function Footer() {
  const { settings } = useSiteSettings()
  const social = settings.social_links || {}

  return (
    <footer className="border-t border-pitch-700 mt-16">
      <div className="max-w-6xl mx-auto px-4 py-10 flex flex-col sm:flex-row justify-between gap-6">
        <div>
          <p className="font-display text-xl text-grass-400">
            HUMEKA<span className="text-whistle-500">TV</span>
          </p>
          <p className="text-chalk-500 text-sm mt-1 max-w-xs">{settings.tagline}</p>
        </div>

        <div className="flex flex-wrap gap-4 text-sm text-chalk-300">
          {social.youtube && (
            <a href={social.youtube} target="_blank" rel="noreferrer" className="hover:text-whistle-500">
              YouTube
            </a>
          )}
          {social.twitter && (
            <a href={social.twitter} target="_blank" rel="noreferrer" className="hover:text-whistle-500">
              X / Twitter
            </a>
          )}
          {social.instagram && (
            <a href={social.instagram} target="_blank" rel="noreferrer" className="hover:text-whistle-500">
              Instagram
            </a>
          )}
          {social.tiktok && (
            <a href={social.tiktok} target="_blank" rel="noreferrer" className="hover:text-whistle-500">
              TikTok
            </a>
          )}
          <Link to="/publisher/login" className="hover:text-whistle-500 text-chalk-500">
            Publisher login
          </Link>
        </div>
      </div>
      <div className="text-center text-chalk-500 text-xs pb-6">
        © {new Date().getFullYear()} {settings.site_name}. All rights reserved.
      </div>
    </footer>
  )
}
