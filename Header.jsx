import { Link } from 'react-router-dom'

function timeAgo(dateString) {
  if (!dateString) return ''
  const seconds = Math.floor((Date.now() - new Date(dateString).getTime()) / 1000)
  const units = [
    ['year', 31536000],
    ['month', 2592000],
    ['day', 86400],
    ['hour', 3600],
    ['minute', 60]
  ]
  for (const [label, secs] of units) {
    const value = Math.floor(seconds / secs)
    if (value >= 1) return `${value} ${label}${value > 1 ? 's' : ''} ago`
  }
  return 'just now'
}

export default function VideoCard({ video }) {
  return (
    <Link to={`/watch/${video.youtube_id}`} className="group block">
      <div className="relative rounded-lg overflow-hidden bg-pitch-800 aspect-video">
        {video.thumbnail_url ? (
          <img
            src={video.thumbnail_url}
            alt={video.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-chalk-500 font-display">
            HUMEKA TV
          </div>
        )}
        {video.is_featured && <span className="score-corner">TOP</span>}
      </div>
      <div className="pt-3">
        <h3 className="font-semibold text-chalk-100 leading-snug line-clamp-2 group-hover:text-whistle-500 transition-colors">
          {video.title}
        </h3>
        <p className="text-chalk-500 text-sm mt-1">
          {video.category ? `${video.category} · ` : ''}
          {timeAgo(video.published_at)}
        </p>
      </div>
    </Link>
  )
}
