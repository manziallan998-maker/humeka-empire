import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

const emptyForm = {
  id: null,
  youtube_id: '',
  title: '',
  description: '',
  thumbnail_url: '',
  category: '',
  published_at: '',
  status: 'published',
  is_featured: false
}

export default function ManageVideos() {
  const [videos, setVideos] = useState([])
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  async function loadVideos() {
    const { data } = await supabase
      .from('videos')
      .select('*')
      .order('published_at', { ascending: false })
    setVideos(data || [])
  }

  useEffect(() => {
    loadVideos()
  }, [])

  function startEdit(video) {
    setForm({ ...video, published_at: video.published_at?.slice(0, 10) || '' })
  }

  function resetForm() {
    setForm(emptyForm)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setSaving(true)
    setError(null)

    const payload = {
      youtube_id: form.youtube_id.trim(),
      title: form.title.trim(),
      description: form.description,
      thumbnail_url: form.thumbnail_url || null,
      category: form.category || null,
      published_at: form.published_at ? new Date(form.published_at).toISOString() : new Date().toISOString(),
      status: form.status,
      is_featured: form.is_featured
    }

    const query = form.id
      ? supabase.from('videos').update(payload).eq('id', form.id)
      : supabase.from('videos').insert(payload)

    const { error } = await query
    setSaving(false)

    if (error) {
      setError(error.message)
      return
    }

    resetForm()
    loadVideos()
  }

  async function toggleStatus(video) {
    const status = video.status === 'published' ? 'draft' : 'published'
    await supabase.from('videos').update({ status }).eq('id', video.id)
    loadVideos()
  }

  async function toggleFeatured(video) {
    await supabase.from('videos').update({ is_featured: !video.is_featured }).eq('id', video.id)
    loadVideos()
  }

  async function deleteVideo(video) {
    if (!confirm(`Delete "${video.title}"? This can't be undone.`)) return
    await supabase.from('videos').delete().eq('id', video.id)
    loadVideos()
  }

  return (
    <div>
      <h1 className="font-display text-2xl text-chalk-100 mb-1">Videos</h1>
      <p className="text-chalk-500 mb-8">
        Add a video by pasting its YouTube link or ID, or pull a batch automatically from{' '}
        <a href="/publisher/youtube-sync" className="text-whistle-500">YouTube sync</a>.
      </p>

      <form onSubmit={handleSubmit} className="bg-pitch-800 border border-pitch-700 rounded-lg p-6 mb-10 grid sm:grid-cols-2 gap-4">
        <div className="sm:col-span-2">
          <label className="block text-sm text-chalk-300 mb-1">YouTube video ID *</label>
          <input
            required
            placeholder="e.g. dQw4w9WgXcQ"
            value={form.youtube_id}
            onChange={(e) => setForm({ ...form, youtube_id: e.target.value })}
            className="w-full bg-pitch-900 border border-pitch-700 rounded-md px-3 py-2 text-chalk-100"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="block text-sm text-chalk-300 mb-1">Title *</label>
          <input
            required
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="w-full bg-pitch-900 border border-pitch-700 rounded-md px-3 py-2 text-chalk-100"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="block text-sm text-chalk-300 mb-1">Description</label>
          <textarea
            rows={3}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="w-full bg-pitch-900 border border-pitch-700 rounded-md px-3 py-2 text-chalk-100"
          />
        </div>

        <div>
          <label className="block text-sm text-chalk-300 mb-1">Thumbnail URL</label>
          <input
            value={form.thumbnail_url || ''}
            onChange={(e) => setForm({ ...form, thumbnail_url: e.target.value })}
            className="w-full bg-pitch-900 border border-pitch-700 rounded-md px-3 py-2 text-chalk-100"
          />
        </div>

        <div>
          <label className="block text-sm text-chalk-300 mb-1">Category</label>
          <input
            placeholder="Highlights, Interview, Live…"
            value={form.category || ''}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            className="w-full bg-pitch-900 border border-pitch-700 rounded-md px-3 py-2 text-chalk-100"
          />
        </div>

        <div>
          <label className="block text-sm text-chalk-300 mb-1">Published date</label>
          <input
            type="date"
            value={form.published_at}
            onChange={(e) => setForm({ ...form, published_at: e.target.value })}
            className="w-full bg-pitch-900 border border-pitch-700 rounded-md px-3 py-2 text-chalk-100"
          />
        </div>

        <div>
          <label className="block text-sm text-chalk-300 mb-1">Status</label>
          <select
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value })}
            className="w-full bg-pitch-900 border border-pitch-700 rounded-md px-3 py-2 text-chalk-100"
          >
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </select>
        </div>

        <label className="flex items-center gap-2 text-sm text-chalk-300 sm:col-span-2">
          <input
            type="checkbox"
            checked={form.is_featured}
            onChange={(e) => setForm({ ...form, is_featured: e.target.checked })}
          />
          Feature at the top of the homepage
        </label>

        {error && <p className="text-whistle-500 text-sm sm:col-span-2">{error}</p>}

        <div className="sm:col-span-2 flex gap-3">
          <button
            type="submit"
            disabled={saving}
            className="bg-grass-500 hover:bg-grass-600 disabled:opacity-60 text-pitch-950 font-semibold px-5 py-2.5 rounded-md"
          >
            {saving ? 'Saving…' : form.id ? 'Update video' : 'Add video'}
          </button>
          {form.id && (
            <button type="button" onClick={resetForm} className="text-chalk-300 px-3 py-2.5 text-sm">
              Cancel edit
            </button>
          )}
        </div>
      </form>

      <div className="space-y-3">
        {videos.map((video) => (
          <div
            key={video.id}
            className="flex items-center gap-4 bg-pitch-800 border border-pitch-700 rounded-lg p-4"
          >
            <img
              src={video.thumbnail_url || 'https://placehold.co/120x68/111613/8B9490?text=No+thumb'}
              alt=""
              className="w-28 aspect-video object-cover rounded shrink-0"
            />
            <div className="flex-1 min-w-0">
              <p className="text-chalk-100 font-medium truncate">{video.title}</p>
              <p className="text-chalk-500 text-xs mt-0.5">
                {video.status === 'published' ? 'Published' : 'Draft'}
                {video.is_featured ? ' · Featured' : ''}
              </p>
            </div>
            <div className="flex gap-2 shrink-0 text-sm">
              <button onClick={() => toggleFeatured(video)} className="text-chalk-300 hover:text-whistle-500 px-2">
                {video.is_featured ? 'Unfeature' : 'Feature'}
              </button>
              <button onClick={() => toggleStatus(video)} className="text-chalk-300 hover:text-whistle-500 px-2">
                {video.status === 'published' ? 'Unpublish' : 'Publish'}
              </button>
              <button onClick={() => startEdit(video)} className="text-chalk-300 hover:text-whistle-500 px-2">
                Edit
              </button>
              <button onClick={() => deleteVideo(video)} className="text-chalk-300 hover:text-red-400 px-2">
                Delete
              </button>
            </div>
          </div>
        ))}

        {videos.length === 0 && <p className="text-chalk-500">No videos yet.</p>}
      </div>
    </div>
  )
}
