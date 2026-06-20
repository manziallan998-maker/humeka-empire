import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { useSiteSettings } from '../lib/useSiteSettings'

export default function YouTubeSync() {
  const { settings } = useSiteSettings()
  const [channelId, setChannelId] = useState(settings.youtube_channel_id || '')
  const [count, setCount] = useState(15)
  const [status, setStatus] = useState('idle') // idle | working | done | error
  const [message, setMessage] = useState('')
  const [imported, setImported] = useState([])

  async function handleSync(e) {
    e.preventDefault()
    setStatus('working')
    setMessage('')
    setImported([])

    try {
      const { data, error } = await supabase.functions.invoke('sync-youtube', {
        body: { channelId: channelId.trim(), maxResults: Number(count) }
      })

      if (error) throw error
      if (data?.error) throw new Error(data.error)

      const videos = data?.videos || []

      if (videos.length === 0) {
        setStatus('done')
        setMessage('No videos found for that channel ID.')
        return
      }

      setImported(videos)
      setStatus('done')
      setMessage(`Synced ${videos.length} video${videos.length === 1 ? '' : 's'} from YouTube.`)
    } catch (err) {
      setStatus('error')
      setMessage(err.message)
    }
  }

  return (
    <div>
      <h1 className="font-display text-2xl text-chalk-100 mb-1">YouTube sync</h1>
      <p className="text-chalk-500 mb-8 max-w-xl">
        Pull your latest uploads straight from YouTube instead of adding them one by one. Existing
        videos with the same YouTube ID are updated rather than duplicated. This also runs
        automatically every hour — see <code className="text-chalk-300">supabase/cron.sql</code> in
        the project. The YouTube API key lives only on the server (a Supabase Edge Function
        secret), never in the browser.
      </p>

      <form onSubmit={handleSync} className="bg-pitch-800 border border-pitch-700 rounded-lg p-6 grid sm:grid-cols-3 gap-4 mb-8">
        <div className="sm:col-span-2">
          <label className="block text-sm text-chalk-300 mb-1">Channel ID</label>
          <input
            required
            value={channelId}
            onChange={(e) => setChannelId(e.target.value)}
            className="w-full bg-pitch-900 border border-pitch-700 rounded-md px-3 py-2 text-chalk-100"
          />
        </div>
        <div>
          <label className="block text-sm text-chalk-300 mb-1">How many</label>
          <input
            type="number"
            min={1}
            max={50}
            value={count}
            onChange={(e) => setCount(e.target.value)}
            className="w-full bg-pitch-900 border border-pitch-700 rounded-md px-3 py-2 text-chalk-100"
          />
        </div>

        <div className="sm:col-span-3">
          <button
            type="submit"
            disabled={status === 'working'}
            className="bg-grass-500 hover:bg-grass-600 disabled:opacity-60 text-pitch-950 font-semibold px-5 py-2.5 rounded-md"
          >
            {status === 'working' ? 'Syncing…' : 'Sync now'}
          </button>
        </div>
      </form>

      {message && (
        <p className={`mb-6 text-sm ${status === 'error' ? 'text-whistle-500' : 'text-grass-400'}`}>
          {message}
        </p>
      )}

      {imported.length > 0 && (
        <div className="grid sm:grid-cols-3 gap-4">
          {imported.map((v) => (
            <div key={v.youtube_id} className="bg-pitch-800 border border-pitch-700 rounded-lg overflow-hidden">
              <img src={v.thumbnail_url} alt="" className="w-full aspect-video object-cover" />
              <p className="text-chalk-100 text-sm p-3 line-clamp-2">{v.title}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
