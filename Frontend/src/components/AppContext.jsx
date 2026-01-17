import { createContext, useContext, useState, useMemo, useEffect } from 'react'
import { useAuth } from './auth/AuthContext.jsx'
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001'

const AppContext = createContext(null)

export const useAppContext = () => {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useAppContext must be used within AppProvider')
  }
  return context
}



const fetchTrips = async()=>{
  try {
    const res = await axios.get(`${API_URL}/trips`)
    return res.data;
  } catch (error) {
    console.error('Error fetching trips:', error);
  }
}

const fetchMemories = async(tripId)=>{
  try {
    const res = await axios.get(`${API_URL}/memories`); 
    return res.data;
  } catch (error) {
    console.error('Error fetching memories for trip:', error);
    return [];
  }
}

const normalizeMemory = (memory, currentUserId) => ({
  id: memory._id,
  tripId: memory.tripId,
  image: memory.image,
  description: memory.description, // For MemoryGroupCard
  caption: memory.caption || memory.description, // For carousel
  location: memory.location,
  author: memory.author,
  timestamp: memory.createdAt,
  isFavorite: memory.isFavorite || [],
  isFavoritedByUser: memory.isFavorite?.includes(currentUserId) || false,
})


const mergeTripsWithMemories = (trips, memories, userId) => {
  const memoryMap = {}

  memories.forEach(memory => {
    const tripId = memory.tripId
    if (!memoryMap[tripId]) memoryMap[tripId] = []
    memoryMap[tripId].push(normalizeMemory(memory, userId))
  })

  return trips.map(trip => ({
    id: trip._id,
    name: trip.tripName,
    description: trip.description,
    coverPhoto: trip.coverPhoto,
    startDate: trip.startDate,
    endDate: trip.endDate,
    isPrivate: trip.isPrivate,
    createdBy: trip.createdBy,
    participants: trip.participants,
    memories: memoryMap[trip._id] || []
  }))
}

export const AppProvider = ({ children }) => {
  const { user, isLoading } = useAuth()
  
  const [searchQuery, setSearchQuery] = useState('')
  const [isCreateTripModalOpen, setIsCreateTripModalOpen] = useState(false)
  const [selectedMemory, setSelectedMemory] = useState(null)
  const [isMemoryModalOpen, setIsMemoryModalOpen] = useState(false)
  const [trips, setTrips] = useState([])

  // Initialize trips when user is available
  useEffect(() => {
    if (!user || isLoading) return
      
      const loadData = async()=>{
        try {
          const[tripsData, memoriesData] = await Promise.all([
          fetchTrips(),
          fetchMemories()
        ])
        const mergedData = mergeTripsWithMemories(tripsData, memoriesData, user._id)
        setTrips(mergedData)
        } catch (error) {
          console.error('Error loading data:', error);
        }
        
      } 
    loadData()
  }, [user, isLoading])

  // Get all memories from all trips, sorted by timestamp
  const allMemories = useMemo(()=>{
    if(!trips.length) return []
    return trips.flatMap(trip =>trip.memories)
      .sort((a,b)=> new Date(b.timestamp)- new Date(a.timestamp))
  })
  // Get favorite memories
    const favoriteMemories = useMemo(() => {
      if (!trips.length || !user) return []
      return trips
        .flatMap((trip) => trip.memories)
        .filter((memory) => memory.isFavoritedByUser)
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
    }, [trips, user])

  // Filter memories based on search query
  const filteredMemories = useMemo(() => {
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
   setTrips(prevTrips=>[{...newTrip,id:newTrip._id,memories:[]},...prevTrips])
    } catch (error) {
      console.error('Error creating trip:', error);
    }
   }
  

   // TOGGLE FAVORITE
   const handleToggleFavorite = async (memoryId) => {
     try {
       console.log('⭐ FAVORITE TOGGLE:', memoryId)
       const res = await axios.put(`${API_URL}/memories/${memoryId}/favorite`)
 
       setTrips((prevTrips) =>
         prevTrips.map((trip) => ({
           ...trip,
           memories: trip.memories.map((memory) =>
             memory.id === memoryId
               ? {
                   ...memory,
                   isFavoritedByUser: res.data.isFavorited,
                   isFavorite: res.data.memory.isFavorite,
                 }
               : memory
           ),
         }))
       )
 
       console.log('✅ Favorite toggled')
     } catch (error) {
       console.error('Error toggling favorite:', error)
     }
   }

  // const handleMemoryClick = (memory) => {
  //   setSelectedMemory(memory)
  //   setIsMemoryModalOpen(true)
  // }
  const handleAddMemories = async(newMemories) => {
   try {
    const res = await axios.post(`${API_URL}/memories`, newMemories)
    const newMemory = res.data

    setTrips((prevTrips) =>
      prevTrips.map((trip) => {
        if (trip.id === newMemory.tripId) {
          return {
            ...trip,
            memories: [...trip.memories, newMemory],
          }
        }
        return trip
      })
    )
   } catch (error) {
    console.error('Error adding memories:', error)
   }
  }

  const handleDeleteMemory = async (memoryId) => {
    try {
      console.log('🗑️ DELETE MEMORY:', memoryId)
      await axios.delete(`${API_URL}/memories/${memoryId}`)

      setTrips((prevTrips) =>
        prevTrips.map((trip) => ({
          ...trip,
          memories: trip.memories.filter((m) => m.id !== memoryId),
        }))
      )

      console.log('✅ Memory deleted')
    } catch (error) {
      console.error('Error deleting memory:', error)
    }
  }

  // Normalised selected photo for PhotoModal 
  // const selectedPhoto = selectedMemory ? {
  //   id: selectedMemory.id,
  //   url: selectedMemory.image,
  //   title: selectedMemory.description,
  //   description: selectedMemory.description,
  //   photographer: selectedMemory.author.name,
  //   date: new Date(selectedMemory.timestamp).toLocaleDateString(),
  //   likes: selectedMemory.likes,
  //   isLiked: selectedMemory.isLiked,
  //   category: 'memory',
  //   tags: selectedMemory.location ? [selectedMemory.location] : []
  // } : null


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
    favoriteMemories,
    setSelectedMemory,
    isMemoryModalOpen,
    setIsMemoryModalOpen,
    handleAddMemories,
    // selectedPhoto,
    handleCreateTrip,
    handleToggleFavorite,
    handleDeleteMemory
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}
