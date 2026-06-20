export default function PostCard({ post }) {
  const date = new Date(post.created_at).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  })

  return (
    <article className="bg-pitch-800 border border-pitch-700 rounded-lg overflow-hidden">
      {post.image_url && (
        <img src={post.image_url} alt={post.title} className="w-full h-48 object-cover" />
      )}
      <div className="p-5">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide mb-2">
          {post.is_pinned && <span className="text-whistle-500">Pinned</span>}
          <span className="text-chalk-500">{post.type || 'Update'} · {date}</span>
        </div>
        <h3 className="font-display text-xl text-chalk-100 mb-2">{post.title}</h3>
        <p className="text-chalk-300 whitespace-pre-line">{post.content}</p>
      </div>
    </article>
  )
}
