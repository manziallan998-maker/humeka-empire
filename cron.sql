import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

const FALLBACK = {
  site_name: 'HUMEKA TV',
  tagline: 'Rwandan football, match highlights and live updates',
  logo_url: null,
  youtube_channel_id: 'UC55j2e32L6BIimC_BJSESMg',
  show_posts: true,
  show_live_ticker: true,
  social_links: {}
}

export function useSiteSettings() {
  const [settings, setSettings] = useState(FALLBACK)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    supabase
      .from('site_settings')
      .select('*')
      .eq('id', 1)
      .single()
      .then(({ data, error }) => {
        if (!active) return
        if (!error && data) setSettings({ ...FALLBACK, ...data })
        setLoading(false)
      })
    return () => {
      active = false
    }
  }, [])

  return { settings, loading }
}
