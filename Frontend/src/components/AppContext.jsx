import { createContext, useContext, useState, useMemo, useEffect } from 'react'
import { useAuth } from './auth/AuthContext.jsx'
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

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
  
  return 
}

const fetchTrips = async()=>{
  try {
    const res = await axios.get(`${API_URL}/trips`)
    setTrips(res.data);
  } catch (error) {
    console.error('Error fetching trips:', error);
  }
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
      fetchTrips()
    }
  }, [user, isLoading])

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

  const handleCreateTrip = async(tripData) => {
    try {
      const res= await axios.post(`${API_URL}/trips`,tripData);
      const newTrip=res.data;
   setTrips(prevTrips=>[newTrip,...prevTrips])
    } catch (error) {
      console.error('Error creating trip:', error);
    }
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

//  const currentMemoryIndex = selectedMemory 
//     ? allMemories.findIndex(m => m.id === selectedMemory.id)
//     : 0

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
    // currentMemoryIndex,
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
