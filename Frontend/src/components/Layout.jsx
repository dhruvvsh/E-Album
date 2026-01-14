import React, { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { Header } from './Header'
import { CreateTripModal } from './CreateTripModal'
import { PhotoModal } from './PhotoModal'
import { ImageCarousel } from './ImageCarousel.jsx'
import  sampleTrips  from '../App'
import { useAppContext } from './AppContext.jsx'
import AddMemories from './AddMemories.jsx'


const Layout = () => {
    const {
    searchQuery,
    setSearchQuery,
    isCreateTripModalOpen,
    setIsCreateTripModalOpen,
    isMemoryModalOpen,
    setIsMemoryModalOpen,
    handleAddMemories,
    selectedPhoto,
    allMemories,
    currentMemoryIndex,
    handleCreateTrip,
    handleLike
  } = useAppContext()
  console.log(isMemoryModalOpen)
//   const [searchQuery, setSearchQuery] = useState('')
//   const [isCreateTripModalOpen, setIsCreateTripModalOpen] = useState(false)
//   const [selectedMemory, setSelectedMemory] = useState(null)
//   const [isMemoryModalOpen, setIsMemoryModalOpen] = useState(false)
// //   const [trips, setTrips] = useState(sampleTrips)




//  const handleLike = (memoryId) => {
//     setTrips(prevTrips => 
//       prevTrips.map(trip => ({
//         ...trip,
//         memories: trip.memories.map(memory => 
//           memory.id === memoryId 
//             ? { 
//                 ...memory, 
//                 isLiked: !memory.isLiked, 
//                 likes: memory.isLiked ? memory.likes - 1 : memory.likes + 1 
//               }
//             : memory
//         )
//       }))
//     )
//   }


//    const handleCreateTrip = (tripData) => {
//     const newTrip = {
//       ...tripData,
//       id: Date.now().toString(),
//       memories: [], 
//       createdBy: currentUser
//     }
//     setTrips(prev => [newTrip, ...prev])
//   }


// const handleMemoryClick = (memory) => {
//     setSelectedMemory(memory)
//     setIsMemoryModalOpen(true)
//   }


//   const selectedPhoto = selectedMemory ? {
//     id: selectedMemory.id,
//     url: selectedMemory.image,
//     title: selectedMemory.description,
//     description: selectedMemory.description,
//     photographer: selectedMemory.author.name,
//     date: new Date(selectedMemory.timestamp).toLocaleDateString(),
//     likes: selectedMemory.likes,
//     isLiked: selectedMemory.isLiked,
//     category: 'memory',
//     tags: selectedMemory.location ? [selectedMemory.location] : []
//   } : null

  return (
    <div className="min-h-screen bg-background">
          <Header onSearch={setSearchQuery} searchQuery={searchQuery} />
          
          <div className="flex h-[calc(100vh-73px)]">
            <Sidebar 
            //   currentView={currentView}
            //   onViewChange={setCurrentView}
              onCreateTrip={() => setIsCreateTripModalOpen(true)}
            />
            
            <main className="flex-1 overflow-y-auto"> 
              <Outlet />
            </main>
          </div>
     
          <CreateTripModal
            isOpen={isCreateTripModalOpen}
            onClose={() => setIsCreateTripModalOpen(false)}
            onCreateTrip={handleCreateTrip}
          />
          <AddMemories
          isOpen={isMemoryModalOpen}
          onClose={() => setIsMemoryModalOpen(false)}
          onAddMemories={handleAddMemories}
          />
    
          {/* <PhotoModal
            photo={selectedPhoto}
            isOpen={isMemoryModalOpen} 
            onClose={() => setIsMemoryModalOpen(false)}
            onLike={handleLike}
          /> */}
         {/* <ImageCarousel
         images={selectedPhoto}
         memories={allMemories}
        initialIndex={currentMemoryIndex}
        isOpen={isMemoryModalOpen}
        onClose={() => setIsMemoryModalOpen(false)}
        onLike={handleLike}
      /> */}
        </div>

  )
}

export default Layout
