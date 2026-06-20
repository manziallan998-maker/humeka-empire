import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../lib/AuthContext'

export default function Login() {
  const { signIn, user } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  if (user) return <Navigate to="/publisher" replace />

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    const { error } = await signIn(email, password)
    setLoading(false)
    if (error) setError(error.message)
    else navigate('/publisher')
  }

  return (
    <div className="min-h-screen bg-pitch-950 flex items-center justify-center px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm bg-pitch-800 border border-pitch-700 rounded-xl p-8"
      >
        <p className="font-display text-2xl text-grass-400 text-center mb-1">
          HUMEKA<span className="text-whistle-500">TV</span>
        </p>
        <p className="text-center text-chalk-500 text-sm mb-6">Publisher panel</p>

        <label className="block text-sm text-chalk-300 mb-1">Email</label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full mb-4 bg-pitch-900 border border-pitch-700 rounded-md px-3 py-2 text-chalk-100 focus:outline-none focus:ring-2 focus:ring-grass-500"
        />

        <label className="block text-sm text-chalk-300 mb-1">Password</label>
        <input
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full mb-5 bg-pitch-900 border border-pitch-700 rounded-md px-3 py-2 text-chalk-100 focus:outline-none focus:ring-2 focus:ring-grass-500"
        />

        {error && <p className="text-whistle-500 text-sm mb-4">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-grass-500 hover:bg-grass-600 disabled:opacity-60 text-pitch-950 font-semibold py-2.5 rounded-md transition-colors"
        >
          {loading ? 'Signing in…' : 'Sign in'}
        </button>

        <p className="text-chalk-500 text-xs text-center mt-5">
          Publisher accounts are created in Supabase Authentication — see the README for setup.
        </p>
      </form>
    </div>
  )
}
