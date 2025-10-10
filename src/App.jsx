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

// Mock current user
const currentUser = {
  id: 'current-user',
  name: 'You',
  email: 'you@example.com',
  avatar: ''
}

// Sample users
const sampleUsers = [
  { id: '1', name: 'Alex Chen', email: 'alex@example.com', avatar: '' },
  { id: '2', name: 'Sarah Johnson', email: 'sarah@example.com', avatar: '' },
  { id: '3', name: 'Mike Wilson', email: 'mike@example.com', avatar: '' },
  { id: '4', name: 'Emma Davis', email: 'emma@example.com', avatar: '' }
]

// Sample trips with memories
const sampleTrips = [
  {
    id: '1',
    name: 'Trip to Bali',
    description: 'Amazing tropical adventure with friends exploring temples, beaches, and local culture',
    coverPhoto: 'https://images.unsplash.com/photo-1613278435217-de4e5a91a4ee?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYWxpJTIwdGVtcGxlJTIwc3Vuc2V0fGVufDF8fHx8MTc1ODIzMTgwMnww&ixlib=rb-4.1.0&q=80&w=1080',
    participants: [currentUser, sampleUsers[0], sampleUsers[1]],
    createdBy: currentUser,
    startDate: '2025-08-15',
    endDate: '2025-08-22',
    isPrivate: false,
    memories: [
      {
        id: '1',
        tripId: '1',
        image: 'https://images.unsplash.com/photo-1613278435217-de4e5a91a4ee?w=800',
        description: 'Sunset at Tanah Lot Temple - absolutely breathtaking!',
        author: currentUser,
        timestamp: '2025-08-16T18:30:00Z',
        location: 'Tanah Lot, Bali',
        likes: 12,
        isLiked: true,
        comments: [
          {
            id: '1',
            memoryId: '1',
            author: sampleUsers[0],
            text: 'This is incredible! 😍',
            timestamp: '2025-08-16T19:00:00Z'
          }
        ]
      },
      {
        id: '2',
        tripId: '1',
        image: 'https://images.unsplash.com/photo-1550096197-74450b766366?w=800',
        description: 'Beach day vibes with the squad! Crystal clear waters and perfect weather.',
        author: sampleUsers[0],
        timestamp: '2025-08-17T14:20:00Z',
        location: 'Nusa Dua Beach, Bali',
        likes: 8,
        isLiked: false,
        comments: []
      }
    ]
  },
  {
    id: '2',
    name: 'Paris Adventure',
    description: 'Romantic getaway exploring the city of lights and incredible cuisine',
    coverPhoto: 'https://images.unsplash.com/photo-1431274172761-fca41d930114?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYXJpcyUyMGVpZmZlbCUyMHRvd2VyfGVufDF8fHx8MTc1ODI2Mjg0Mnww&ixlib=rb-4.1.0&q=80&w=1080',
    participants: [currentUser, sampleUsers[2]],
    createdBy: currentUser,
    startDate: '2025-09-01',
    endDate: '2025-09-05',
    isPrivate: false,
    memories: [
      {
        id: '3',
        tripId: '2',
        image: 'https://images.unsplash.com/photo-1431274172761-fca41d930114?w=800',
        description: 'Classic Eiffel Tower shot! Had to wait 2 hours for this perfect moment.',
        author: currentUser,
        timestamp: '2025-09-02T20:15:00Z',
        location: 'Eiffel Tower, Paris',
        likes: 15,
        isLiked: true,
        comments: [
          {
            id: '2',
            memoryId: '3',
            author: sampleUsers[2],
            text: 'Worth the wait! Amazing shot ✨',
            timestamp: '2025-09-02T21:00:00Z'
          }
        ]
      }
    ]
  },
  {
    id: '3',
    name: 'Tokyo Nights',
    description: 'Urban exploration through the neon-lit streets and amazing food scene',
    coverPhoto: 'https://images.unsplash.com/photo-1756823964511-31ececb61d2a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0b2t5byUyMHN0cmVldCUyMG5pZ2h0fGVufDF8fHx8MTc1ODI3NjEzM3ww&ixlib=rb-4.1.0&q=80&w=1080',
    participants: [currentUser, sampleUsers[1], sampleUsers[3]],
    createdBy: currentUser,
    startDate: '2025-07-10',
    endDate: '2025-07-17',
    isPrivate: false,
    memories: [
      {
        id: '4',
        tripId: '3',
        image: 'https://images.unsplash.com/photo-1756823964511-31ececb61d2a?w=800',
        description: 'Shibuya crossing at midnight - the energy is unreal!',
        author: sampleUsers[1],
        timestamp: '2025-07-12T00:30:00Z',
        location: 'Shibuya, Tokyo',
        likes: 22,
        isLiked: true,
        comments: [
          {
            id: '3',
            memoryId: '4',
            author: currentUser,
            text: 'This captures the vibe perfectly!',
            timestamp: '2025-07-12T01:00:00Z'
          },
          {
            id: '4',
            memoryId: '4',
            author: sampleUsers[3],
            text: 'I was there! Such an amazing night 🌃',
            timestamp: '2025-07-12T01:15:00Z'
          }
        ]
      }
    ]
  }
]

export default function App() {


  const [currentView, setCurrentView] = useState('trips')
  const [selectedTrip, setSelectedTrip] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [isCreateTripModalOpen, setIsCreateTripModalOpen] = useState(false)
  const [selectedMemory, setSelectedMemory] = useState(null)
  const [isMemoryModalOpen, setIsMemoryModalOpen] = useState(false)
  const [trips, setTrips] = useState(sampleTrips)

  // Get all memories from all trips, sorted by timestamp
  const allMemories = useMemo(() => {
    const memories = trips.flatMap(trip => trip.memories)
    return memories.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
  }, [trips])

  // Filter memories based on search query
  const filteredMemories = useMemo(() => {
    if (!searchQuery) return allMemories
    
    const query = searchQuery.toLowerCase()
    return allMemories.filter(memory => 
      memory.description.toLowerCase().includes(query) ||
      memory.author.name.toLowerCase().includes(query) ||
      memory.location?.toLowerCase().includes(query)
    )
  }, [allMemories, searchQuery])

  // Filter trips based on search query
  const filteredTrips = useMemo(() => {
    if (!searchQuery) return trips
    
    const query = searchQuery.toLowerCase()
    return trips.filter(trip => 
      trip.name.toLowerCase().includes(query) ||
      trip.description.toLowerCase().includes(query)
    )
  }, [trips, searchQuery])

  const handleCreateTrip = (tripData) => {
    const newTrip = {
      ...tripData,
      id: Date.now().toString(),
      memories: [],
      createdBy: currentUser
    }
    setTrips(prev => [newTrip, ...prev])
  }

  const handleLike = (memoryId) => {
    setTrips(prevTrips => 
      prevTrips.map(trip => ({
        ...trip,
        memories: trip.memories.map(memory => 
          memory.id === memoryId 
            ? { 
                ...memory, 
                isLiked: !memory.isLiked, 
                likes: memory.isLiked ? memory.likes - 1 : memory.likes + 1 
              }
            : memory
        )
      }))
    )
  }

  const handleMemoryClick = (memory) => {
    setSelectedMemory(memory)
    setIsMemoryModalOpen(true)
  }

  const handleComment = (memoryId) => {
    // For now, just open the memory modal
    const memory = allMemories.find(m => m.id === memoryId)
    if (memory) {
      handleMemoryClick(memory)
    }
  }

  // const renderMainContent = () => {
  //   if (selectedTrip) {
  //     return (
  //       <TripDetailView
  //         trip={selectedTrip}
  //         onBack={() => setSelectedTrip(null)}
  //         onLike={handleLike}
  //         onComment={handleComment}
  //         onMemoryClick={handleMemoryClick}
  //         onAddMemory={() => {/* TODO: Implement add memory */}}
  //       />
  //     )
  //   }

  //   switch (currentView) {
  //     case 'posts':
  //       return (
  //         <PostsView
  //           memories={filteredMemories}
  //           trips={trips}
  //           onLike={handleLike}
  //           onComment={handleComment}
  //           onMemoryClick={handleMemoryClick}
  //         />
  //       )
  //     case 'trips':
  //       return (
  //         <TripsView
  //           trips={filteredTrips}
  //           onTripSelect={setSelectedTrip}
  //         />
  //       )
  //     case 'profile':
  //       return (
  //         <div className="p-6">
  //           <h2 className="mb-4">Profile</h2>
  //           <p className="text-muted-foreground">Profile settings coming soon...</p>
  //         </div>
  //       )
  //     case 'settings':
  //       return (
  //         <div className="p-6">
  //           <h2 className="mb-4">Settings</h2>
  //           <p className="text-muted-foreground">App settings coming soon...</p>
  //         </div>
  //       )
  //     default:
  //       return null
  //   }
  // }
  

  // Convert Memory to Photo format for the modal
  const selectedPhoto = selectedMemory ? {
    id: selectedMemory.id,
    url: selectedMemory.image,
    title: selectedMemory.description,
    description: selectedMemory.description,
    photographer: selectedMemory.author.name,
    date: new Date(selectedMemory.timestamp).toLocaleDateString(),
    likes: selectedMemory.likes,
    isLiked: selectedMemory.isLiked,
    category: 'memory',
    tags: selectedMemory.location ? [selectedMemory.location] : []
  } : null
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
          <Route path="/" element={<TripsView />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/profile" element={<Profile />} />
        </Route>
      )}

      {/* Fallback */}
      <Route path="*" element={<Navigate to={isAuthenticated ? "/" : "/auth"} />} />
    </Routes>

    // <div className="min-h-screen bg-background">
    //   <Header onSearch={setSearchQuery} searchQuery={searchQuery} />
      
    //   <div className="flex h-[calc(100vh-73px)]">
    //     <Sidebar 
    //       currentView={currentView}
    //       onViewChange={setCurrentView}
    //       onCreateTrip={() => setIsCreateTripModalOpen(true)}
    //       onCreateMemory={() => {/* TODO: Implement create memory */}}
    //     />
        
    //     <main className="flex-1 overflow-y-auto">
    //       {renderMainContent()}
    //     </main>
    //   </div>

    //   <CreateTripModal
    //     isOpen={isCreateTripModalOpen}
    //     onClose={() => setIsCreateTripModalOpen(false)}
    //     onCreateTrip={handleCreateTrip}
    //   />

    //   <PhotoModal
    //     photo={selectedPhoto}
    //     isOpen={isMemoryModalOpen}
    //     onClose={() => setIsMemoryModalOpen(false)}
    //     onLike={handleLike}
    //   />
    // </div>
  )
}