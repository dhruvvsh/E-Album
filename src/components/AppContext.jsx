import { createContext, useContext, useState, useMemo, useEffect } from 'react'
import { useAuth } from './auth/AuthContext.jsx'

const AppContext = createContext(null)

export const useAppContext = () => {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useAppContext must be used within AppProvider')
  }
  return context
}

// Sample users
const sampleUsers = [
  { id: '1', name: 'Alex Chen', email: 'alex@example.com', avatar: '' },
  { id: '2', name: 'Sarah Johnson', email: 'sarah@example.com', avatar: '' },
  { id: '3', name: 'Mike Wilson', email: 'mike@example.com', avatar: '' },
  { id: '4', name: 'Emma Davis', email: 'emma@example.com', avatar: '' }
]

// Sample trips with memories
const createSampleTrips = (currentUser) => {
  if (!currentUser) return []
  
  return [
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
}

export const AppProvider = ({ children }) => {
  const { user, isLoading } = useAuth()
  
  const [searchQuery, setSearchQuery] = useState('')
  const [isCreateTripModalOpen, setIsCreateTripModalOpen] = useState(false)
  const [selectedMemory, setSelectedMemory] = useState(null)
  const [isMemoryModalOpen, setIsMemoryModalOpen] = useState(false)
  const [trips, setTrips] = useState([])
  const [tripsInitialized, setTripsInitialized] = useState(false)
  
  // Initialize trips when user is available
  useEffect(() => {
    if (user && !isLoading && !tripsInitialized) {
      setTrips(createSampleTrips(user))
      setTripsInitialized(true)
    }
  }, [user, isLoading, tripsInitialized])

  // Get all memories from all trips, sorted by timestamp
  const allMemories = useMemo(() => {
    if (!trips || trips.length === 0) return []
    const memories = trips.flatMap(trip => trip.memories || [])
    return memories.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
  }, [trips])

  // Filter memories based on search query
  const filteredMemories = useMemo(() => {
    if (!allMemories || allMemories.length === 0) return []
    if (!searchQuery) return allMemories
    
    const query = searchQuery.toLowerCase()
    return allMemories.filter(memory => 
      memory.description?.toLowerCase().includes(query) ||
      memory.author?.name?.toLowerCase().includes(query) ||
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
      createdBy: user
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
    const memory = allMemories.find(m => m.id === memoryId)
    if (memory) {
      handleMemoryClick(memory)
    }
  }

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

  const value = {
    searchQuery,
    setSearchQuery,
    trips,
    filteredTrips,
    allMemories,
    filteredMemories,
    isCreateTripModalOpen,
    setIsCreateTripModalOpen,
    selectedMemory,
    setSelectedMemory,
    isMemoryModalOpen,
    setIsMemoryModalOpen,
    selectedPhoto,
    handleCreateTrip,
    handleLike,
    handleMemoryClick,
    handleComment
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}
