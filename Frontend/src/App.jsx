import { useState, useMemo } from 'react'
import { Header } from './components/Header'
import { Sidebar } from './components/Sidebar'
import { PostsView } from './components/PostsView'
import { TripsView } from './components/TripsView'
import { TripDetailView } from './components/TripDetailView'
import { CreateTripModal } from './components/CreateTripModal'
import { PhotoModal } from './components/PhotoModal'
import { BrowserRouter,Routes,Route,Navigate } from 'react-router-dom'
import Profile  from './components/Profile.jsx'
import Settings from './components/Settings'
import { useAuth } from './components/auth/AuthContext'
import { AuthPage } from './components/auth/AuthPage'
import Layout from './components/Layout.jsx'
import { ImageCarouselView } from './components/ImageCarouselView'




export default function App() {

     const {isAuthenticated, isLoading}=useAuth();

       if (isLoading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }
  return (
       <Routes>
      {/* Public auth route */}
      <Route
        path="/auth"
        element={isAuthenticated ? <Navigate to="/" replace /> : <AuthPage />}
      />

      {/* Protected routes inside Layout */}
      {isAuthenticated && (
        <Route element={<Layout />}>
          <Route path="/" element={<TripsView />} >
          </Route>
           <Route path="/trips/:tripId" element={<TripDetailView />} />
          <Route path="/trips/:tripId/:memorycardId" element={<ImageCarouselView />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/profile" element={<Profile />} />
        </Route>
      )}

      {/* Fallback */}
      <Route path="*" element={<Navigate to={isAuthenticated ? "/" : "/auth"} />} />
    </Routes>

  )
}