import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function Dashboard() {
  const [stats, setStats] = useState({ videos: 0, draftVideos: 0, posts: 0 })

  useEffect(() => {
    async function load() {
      const [videos, draftVideos, posts] = await Promise.all([
        supabase.from('videos').select('id', { count: 'exact', head: true }),
        supabase.from('videos').select('id', { count: 'exact', head: true }).eq('status', 'draft'),
        supabase.from('posts').select('id', { count: 'exact', head: true })
      ])
      setStats({
        videos: videos.count || 0,
        draftVideos: draftVideos.count || 0,
        posts: posts.count || 0
      })
    }
    load()
  }, [])

  const cards = [
    { label: 'Published & draft videos', value: stats.videos, to: '/publisher/videos' },
    { label: 'Drafts awaiting review', value: stats.draftVideos, to: '/publisher/videos' },
    { label: 'Posts & announcements', value: stats.posts, to: '/publisher/posts' }
  ]

  return (
    <div>
      <h1 className="font-display text-2xl text-chalk-100 mb-1">Dashboard</h1>
      <p className="text-chalk-500 mb-8">Everything shown on the public site is controlled from here.</p>

      <div className="grid sm:grid-cols-3 gap-4 mb-10">
        {cards.map((card) => (
          <Link
            key={card.label}
            to={card.to}
            className="bg-pitch-800 border border-pitch-700 rounded-lg p-5 hover:border-grass-500 transition-colors"
          >
            <p className="font-display text-3xl text-whistle-500">{card.value}</p>
            <p className="text-chalk-300 text-sm mt-1">{card.label}</p>
          </Link>
        ))}
      </div>

      <div className="bg-pitch-800 border border-pitch-700 rounded-lg p-6">
        <h2 className="font-display text-lg text-chalk-100 mb-3">Getting started</h2>
        <ol className="list-decimal list-inside text-chalk-300 space-y-2 text-sm">
          <li>
            Go to <Link to="/publisher/youtube-sync" className="text-whistle-500">YouTube sync</Link> to
            pull in your latest uploads automatically.
          </li>
          <li>
            Or add a video by hand from <Link to="/publisher/videos" className="text-whistle-500">Videos</Link>.
          </li>
          <li>
            Post a match preview or announcement from{' '}
            <Link to="/publisher/posts" className="text-whistle-500">Posts</Link>.
          </li>
          <li>
            Update the logo, channel ID and social links in{' '}
            <Link to="/publisher/settings" className="text-whistle-500">Site settings</Link>.
          </li>
        </ol>
      </div>
    </div>
  )
}
