import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

const emptyForm = {
  id: null,
  title: '',
  content: '',
  image_url: '',
  type: 'Announcement',
  status: 'published',
  is_pinned: false
}

export default function ManagePosts() {
  const [posts, setPosts] = useState([])
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  async function loadPosts() {
    const { data } = await supabase.from('posts').select('*').order('created_at', { ascending: false })
    setPosts(data || [])
  }

  useEffect(() => {
    loadPosts()
  }, [])

  function resetForm() {
    setForm(emptyForm)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setSaving(true)
    setError(null)

    const payload = {
      title: form.title.trim(),
      content: form.content,
      image_url: form.image_url || null,
      type: form.type,
      status: form.status,
      is_pinned: form.is_pinned
    }

    const query = form.id
      ? supabase.from('posts').update(payload).eq('id', form.id)
      : supabase.from('posts').insert(payload)

    const { error } = await query
    setSaving(false)

    if (error) {
      setError(error.message)
      return
    }

    resetForm()
    loadPosts()
  }

  async function deletePost(post) {
    if (!confirm(`Delete "${post.title}"?`)) return
    await supabase.from('posts').delete().eq('id', post.id)
    loadPosts()
  }

  async function toggleStatus(post) {
    const status = post.status === 'published' ? 'draft' : 'published'
    await supabase.from('posts').update({ status }).eq('id', post.id)
    loadPosts()
  }

  return (
    <div>
      <h1 className="font-display text-2xl text-chalk-100 mb-1">Posts</h1>
      <p className="text-chalk-500 mb-8">
        Announcements and news shown on the public News page.
      </p>

      <form onSubmit={handleSubmit} className="bg-pitch-800 border border-pitch-700 rounded-lg p-6 mb-10 grid sm:grid-cols-2 gap-4">
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
          <label className="block text-sm text-chalk-300 mb-1">Content *</label>
          <textarea
            required
            rows={5}
            value={form.content}
            onChange={(e) => setForm({ ...form, content: e.target.value })}
            className="w-full bg-pitch-900 border border-pitch-700 rounded-md px-3 py-2 text-chalk-100"
          />
        </div>

        <div>
          <label className="block text-sm text-chalk-300 mb-1">Image URL</label>
          <input
            value={form.image_url || ''}
            onChange={(e) => setForm({ ...form, image_url: e.target.value })}
            className="w-full bg-pitch-900 border border-pitch-700 rounded-md px-3 py-2 text-chalk-100"
          />
        </div>

        <div>
          <label className="block text-sm text-chalk-300 mb-1">Type</label>
          <select
            value={form.type}
            onChange={(e) => setForm({ ...form, type: e.target.value })}
            className="w-full bg-pitch-900 border border-pitch-700 rounded-md px-3 py-2 text-chalk-100"
          >
            <option>Announcement</option>
            <option>Match preview</option>
            <option>Result</option>
            <option>News</option>
          </select>
        </div>

        <label className="flex items-center gap-2 text-sm text-chalk-300">
          <input
            type="checkbox"
            checked={form.is_pinned}
            onChange={(e) => setForm({ ...form, is_pinned: e.target.checked })}
          />
          Pin to top of News page
        </label>

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

        {error && <p className="text-whistle-500 text-sm sm:col-span-2">{error}</p>}

        <div className="sm:col-span-2 flex gap-3">
          <button
            type="submit"
            disabled={saving}
            className="bg-grass-500 hover:bg-grass-600 disabled:opacity-60 text-pitch-950 font-semibold px-5 py-2.5 rounded-md"
          >
            {saving ? 'Saving…' : form.id ? 'Update post' : 'Publish post'}
          </button>
          {form.id && (
            <button type="button" onClick={resetForm} className="text-chalk-300 px-3 py-2.5 text-sm">
              Cancel edit
            </button>
          )}
        </div>
      </form>

      <div className="space-y-3">
        {posts.map((post) => (
          <div key={post.id} className="flex items-center gap-4 bg-pitch-800 border border-pitch-700 rounded-lg p-4">
            <div className="flex-1 min-w-0">
              <p className="text-chalk-100 font-medium truncate">{post.title}</p>
              <p className="text-chalk-500 text-xs mt-0.5">
                {post.type} · {post.status === 'published' ? 'Published' : 'Draft'}
                {post.is_pinned ? ' · Pinned' : ''}
              </p>
            </div>
            <div className="flex gap-2 shrink-0 text-sm">
              <button onClick={() => toggleStatus(post)} className="text-chalk-300 hover:text-whistle-500 px-2">
                {post.status === 'published' ? 'Unpublish' : 'Publish'}
              </button>
              <button onClick={() => setForm(post)} className="text-chalk-300 hover:text-whistle-500 px-2">
                Edit
              </button>
              <button onClick={() => deletePost(post)} className="text-chalk-300 hover:text-red-400 px-2">
                Delete
              </button>
            </div>
          </div>
        ))}

        {posts.length === 0 && <p className="text-chalk-500">No posts yet.</p>}
      </div>
    </div>
  )
}
