import { createContext, useContext, useState, useMemo, useEffect } from 'react'
import { toast } from 'react-toastify'
import { useAuth } from './auth/AuthContext.jsx'
import api, { getErrorMessage } from '@/lib/api'
import { toWebImageUrl } from '@/lib/media'
import { getDisplayName } from '@/lib/format'

const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'dvgywczai'
const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || 'E-album'

const AppContext = createContext(null)

export const useAppContext = () => {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useAppContext must be used within AppProvider')
  }
  return context
}

const fetchTrips = async () => {
  try {
    const res = await api.get('/trips')
    return res.data || []
  } catch (error) {
    toast.error(getErrorMessage(error, 'Failed to load trips'))
    return []
  }
}

const fetchMemories = async (tripId) => {
  try {
    const res = await api.get(`/memories/trip/${tripId}`)
    return res.data || []
  } catch (error) {
    toast.error(getErrorMessage(error, 'Failed to load memories'))
    return []
  }
}

const normalizeMemory = (memory, currentUserId) => ({
  id: memory._id,
  tripId: memory.tripId,
  image: toWebImageUrl(memory.image),
  description: memory.description, // For MemoryGroupCard
  caption: memory.caption || memory.description, // For carousel
  location: memory.location,
  author: memory.author,
  timestamp: memory.createdAt,
  isFavorite: memory.isFavorite || [],
  isFavoritedByUser: memory.isFavorite?.includes(currentUserId) || false,
})

const normalizeTrip = (trip, memories, userId) => ({
  id: trip._id,
  name: trip.tripName,
  description: trip.description,
  coverPhoto: toWebImageUrl(trip.coverPhoto),
  startDate: trip.startDate,
  endDate: trip.endDate,
  isPrivate: trip.isPrivate,
  createdBy: trip.createdBy,
  participants: trip.participants,
  memories: memories.map((memory) => normalizeMemory(memory, userId)),
})

export const AppProvider = ({ children }) => {
  const { user, isLoading } = useAuth()

  const [searchQuery, setSearchQuery] = useState('')
  const [isCreateTripModalOpen, setIsCreateTripModalOpen] = useState(false)
  const [selectedMemory, setSelectedMemory] = useState(null)
  const [trips, setTrips] = useState([])
  const [isLoadingTrips, setIsLoadingTrips] = useState(true)

  // Initialize trips when user is available
  useEffect(() => {
    if (!user || isLoading) return

    const loadData = async () => {
      setIsLoadingTrips(true)
      try {
        const tripsData = await fetchTrips()
        const memoriesByTrip = await Promise.all(
          tripsData.map((trip) => fetchMemories(trip._id))
        )
        setTrips(
          tripsData.map((trip, index) =>
            normalizeTrip(trip, memoriesByTrip[index], user._id)
          )
        )
      } finally {
        setIsLoadingTrips(false)
      }
    }
    loadData()
  }, [user, isLoading])

  // Get all memories from all trips, sorted by timestamp
  const allMemories = useMemo(() => {
    if (!trips.length) return []
    return trips.flatMap(trip => trip.memories)
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
  }, [trips])

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
      getDisplayName(memory.author).toLowerCase().includes(query) ||
      memory.location?.toLowerCase().includes(query)
    )
  }, [allMemories, searchQuery])

  // Filter trips based on search query
  const filteredTrips = useMemo(() => {
    if (!searchQuery) return trips

    const query = searchQuery.toLowerCase()
    return trips.filter(trip =>
      trip.name?.toLowerCase().includes(query) ||
      trip.description?.toLowerCase().includes(query)
    )
  }, [trips, searchQuery])

  const handleCreateTrip = async (tripData) => {
    const res = await api.post('/trips', tripData)
    setTrips((prevTrips) => [normalizeTrip(res.data, [], user._id), ...prevTrips])
  }

  const handleDeleteTrip = async (tripId) => {
    try {
      await api.delete(`/trips/${tripId}`)
      setTrips((prevTrips) => prevTrips.filter((trip) => trip.id !== tripId))
      toast.success('Trip deleted')
    } catch (error) {
      toast.error(getErrorMessage(error, 'Failed to delete trip'))
    }
  }

  const handleToggleFavorite = async (memoryId) => {
    try {
      const res = await api.put(`/memories/${memoryId}/favorite`)

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
    } catch (error) {
      toast.error(getErrorMessage(error, 'Failed to update favorite'))
    }
  }

  const handleAddMemories = async (newMemories) => {
    try {
      const res = await api.post('/memories', newMemories)
      const newMemory = normalizeMemory(res.data, user._id)

      setTrips((prevTrips) =>
        prevTrips.map((trip) =>
          trip.id === newMemory.tripId
            ? { ...trip, memories: [...trip.memories, newMemory] }
            : trip
        )
      )
      return true
    } catch (error) {
      toast.error(getErrorMessage(error, 'Failed to add memory'))
      return false
    }
  }

  const handleDeleteMemoryGroup = async (memoryIds) => {
    try {
      await api.delete('/memories/group', { data: { memoryIds } })

      setTrips((prevTrips) =>
        prevTrips.map((trip) => ({
          ...trip,
          memories: trip.memories.filter((m) => !memoryIds.includes(m.id)),
        }))
      )
      toast.success('Memories deleted')
    } catch (error) {
      toast.error(getErrorMessage(error, 'Failed to delete memories'))
    }
  }

  const handleDeleteMemory = async (memoryId) => {
    try {
      await api.delete(`/memories/${memoryId}`)
      setTrips((prevTrips) =>
        prevTrips.map((trip) => ({
          ...trip,
          memories: trip.memories.filter((m) => m.id !== memoryId),
        }))
      )
      toast.success('Memory deleted')
    } catch (error) {
      toast.error(getErrorMessage(error, 'Failed to delete memory'))
    }
  }

  const uploadToCloudinary = async (file, resourceType = 'image') => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET)

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/${resourceType}/upload`,
      { method: 'POST', body: formData },
    )

    const data = await res.json()
    if (!res.ok || !data.secure_url) {
      throw new Error(data.error?.message || 'Upload failed')
    }
    return toWebImageUrl(data.secure_url)
  }

  const value = {
    searchQuery,
    setSearchQuery,
    trips,
    isLoadingTrips,
    filteredTrips,
    allMemories,
    filteredMemories,
    isCreateTripModalOpen,
    setIsCreateTripModalOpen,
    selectedMemory,
    favoriteMemories,
    setSelectedMemory,
    handleAddMemories,
    handleCreateTrip,
    handleDeleteTrip,
    handleToggleFavorite,
    handleDeleteMemory,
    handleDeleteMemoryGroup,
    uploadToCloudinary
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}
