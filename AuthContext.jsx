import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export default function Settings() {
  const [form, setForm] = useState(null)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    supabase
      .from('site_settings')
      .select('*')
      .eq('id', 1)
      .single()
      .then(({ data }) => {
        setForm(
          data || {
            id: 1,
            site_name: 'HUMEKA TV',
            tagline: '',
            logo_url: '',
            youtube_channel_id: '',
            show_posts: true,
            show_live_ticker: true,
            social_links: { youtube: '', twitter: '', instagram: '', tiktok: '' }
          }
        )
      })
  }, [])

  async function handleSubmit(e) {
    e.preventDefault()
    setSaving(true)
    setMessage('')

    const { error } = await supabase.from('site_settings').upsert({ ...form, id: 1 })

    setSaving(false)
    setMessage(error ? error.message : 'Settings saved.')
  }

  if (!form) return <p className="text-chalk-500">Loading…</p>

  const social = form.social_links || {}

  return (
    <div>
      <h1 className="font-display text-2xl text-chalk-100 mb-1">Site settings</h1>
      <p className="text-chalk-500 mb-8">Controls branding and which sections appear publicly.</p>

      <form onSubmit={handleSubmit} className="bg-pitch-800 border border-pitch-700 rounded-lg p-6 grid sm:grid-cols-2 gap-4 max-w-2xl">
        <div className="sm:col-span-2">
          <label className="block text-sm text-chalk-300 mb-1">Site name</label>
          <input
            value={form.site_name || ''}
            onChange={(e) => setForm({ ...form, site_name: e.target.value })}
            className="w-full bg-pitch-900 border border-pitch-700 rounded-md px-3 py-2 text-chalk-100"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="block text-sm text-chalk-300 mb-1">Tagline</label>
          <input
            value={form.tagline || ''}
            onChange={(e) => setForm({ ...form, tagline: e.target.value })}
            className="w-full bg-pitch-900 border border-pitch-700 rounded-md px-3 py-2 text-chalk-100"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="block text-sm text-chalk-300 mb-1">Logo URL</label>
          <input
            value={form.logo_url || ''}
            onChange={(e) => setForm({ ...form, logo_url: e.target.value })}
            className="w-full bg-pitch-900 border border-pitch-700 rounded-md px-3 py-2 text-chalk-100"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="block text-sm text-chalk-300 mb-1">YouTube channel ID</label>
          <input
            value={form.youtube_channel_id || ''}
            onChange={(e) => setForm({ ...form, youtube_channel_id: e.target.value })}
            className="w-full bg-pitch-900 border border-pitch-700 rounded-md px-3 py-2 text-chalk-100"
          />
        </div>

        {['youtube', 'twitter', 'instagram', 'tiktok'].map((key) => (
          <div key={key}>
            <label className="block text-sm text-chalk-300 mb-1 capitalize">{key} link</label>
            <input
              value={social[key] || ''}
              onChange={(e) =>
                setForm({ ...form, social_links: { ...social, [key]: e.target.value } })
              }
              className="w-full bg-pitch-900 border border-pitch-700 rounded-md px-3 py-2 text-chalk-100"
            />
          </div>
        ))}

        <label className="flex items-center gap-2 text-sm text-chalk-300 sm:col-span-2">
          <input
            type="checkbox"
            checked={form.show_live_ticker}
            onChange={(e) => setForm({ ...form, show_live_ticker: e.target.checked })}
          />
          Show the scrolling ticker on the homepage
        </label>

        <label className="flex items-center gap-2 text-sm text-chalk-300 sm:col-span-2">
          <input
            type="checkbox"
            checked={form.show_posts}
            onChange={(e) => setForm({ ...form, show_posts: e.target.checked })}
          />
          Show the News &amp; Announcements nav link
        </label>

        {message && <p className="text-grass-400 text-sm sm:col-span-2">{message}</p>}

        <div className="sm:col-span-2">
          <button
            type="submit"
            disabled={saving}
            className="bg-grass-500 hover:bg-grass-600 disabled:opacity-60 text-pitch-950 font-semibold px-5 py-2.5 rounded-md"
          >
            {saving ? 'Saving…' : 'Save settings'}
          </button>
        </div>
      </form>
    </div>
  )
}
