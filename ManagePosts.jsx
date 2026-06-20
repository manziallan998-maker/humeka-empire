import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './lib/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import Header from './components/Header'
import Footer from './components/Footer'

import Home from './pages/Home'
import Watch from './pages/Watch'
import Posts from './pages/Posts'
import About from './pages/About'

import Login from './publisher/Login'
import PublisherLayout from './publisher/Layout'
import Dashboard from './publisher/Dashboard'
import ManageVideos from './publisher/ManageVideos'
import YouTubeSync from './publisher/YouTubeSync'
import ManagePosts from './publisher/ManagePosts'
import Settings from './publisher/Settings'

function PublicLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col font-body">
      <Header />
      <div className="flex-1">{children}</div>
      <Footer />
    </div>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Public site */}
        <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
        <Route path="/watch/:youtubeId" element={<PublicLayout><Watch /></PublicLayout>} />
        <Route path="/posts" element={<PublicLayout><Posts /></PublicLayout>} />
        <Route path="/about" element={<PublicLayout><About /></PublicLayout>} />

        {/* Publisher panel */}
        <Route path="/publisher/login" element={<Login />} />
        <Route
          path="/publisher"
          element={
            <ProtectedRoute>
              <PublisherLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="videos" element={<ManageVideos />} />
          <Route path="youtube-sync" element={<YouTubeSync />} />
          <Route path="posts" element={<ManagePosts />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </AuthProvider>
  )
}
