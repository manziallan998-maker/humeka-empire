import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import VideoCard from '../components/VideoCard'

export default function Watch() {
  const { youtubeId } = useParams()
  const [video, setVideo] = useState(null)
  const [related, setRelated] = useState([])

  useEffect(() => {
    supabase
      .from('videos')
      .select('*')
      .eq('youtube_id', youtubeId)
      .single()
      .then(({ data }) => setVideo(data))

    supabase
      .from('videos')
      .select('*')
      .eq('status', 'published')
      .neq('youtube_id', youtubeId)
      .order('published_at', { ascending: false })
      .limit(6)
      .then(({ data }) => setRelated(data || []))
  }, [youtubeId])

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 grid lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2">
        <div className="aspect-video rounded-lg overflow-hidden bg-black">
          <iframe
            className="w-full h-full"
            src={`https://www.youtube.com/embed/${youtubeId}`}
            title={video?.title || 'HUMEKA TV video'}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>

        {video ? (
          <div className="mt-4">
            <h1 className="font-display text-2xl text-chalk-100">{video.title}</h1>
            <p className="text-chalk-500 text-sm mt-1">
              {video.category || 'Match highlights'} ·{' '}
              {new Date(video.published_at).toLocaleDateString('en-GB', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
              })}
            </p>
            <p className="text-chalk-300 mt-4 whitespace-pre-line">{video.description}</p>
          </div>
        ) : (
          <p className="text-chalk-500 mt-4">
            This video isn't in the HUMEKA TV library yet, but you can still watch it above.
          </p>
        )}

        <Link to="/" className="inline-block mt-6 text-whistle-500 font-semibold text-sm">
          ← Back to all videos
        </Link>
      </div>

      <div>
        <h2 className="font-display text-lg text-chalk-300 mb-4">Up next</h2>
        <div className="space-y-5">
          {related.map((v) => (
            <VideoCard key={v.id} video={v} />
          ))}
        </div>
      </div>
    </div>
  )
}
