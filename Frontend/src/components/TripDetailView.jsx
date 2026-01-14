import { ArrowLeft, Calendar, Users, Plus } from 'lucide-react'
import { useParams, useNavigate } from 'react-router-dom'
import { Button } from './ui/button'
import { ImageWithFallback } from './figma/ImageWithFallback.jsx'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { MemoryGroupCard } from './MemoryGroupCard.jsx'  // ← NEW
import { useAppContext } from './AppContext.jsx'

export function TripDetailView() {
  const { tripId } = useParams()
  const navigate = useNavigate()
  const { trips, setIsMemoryModalOpen, isMemoryModalOpen, handleAddMemories } = useAppContext()
  

  const trip = trips?.find(t => t.id === tripId)
  
  if (!trip) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <h3 className="mb-2">Trip not found</h3>
          <Button onClick={() => navigate('/')}>Back to Trips</Button>
        </div>
      </div>
    )
  }

  const formatDateRange = (start, end) => {
    const startDate = new Date(start).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
    if (!end || end === start) return startDate
    const endDate = new Date(end).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
    return `${startDate} - ${endDate}`
  }

 const groupMemoriesByUser = (memories) => {
  const groups = {}
  memories.forEach(memory => {
    const userId = memory.author?._id || memory.author?.id
    if (!groups[userId]) {
      groups[userId] = {
        user: memory.author,
        memories: []
      }
    }
    groups[userId].memories.push(memory)
  })
  
  return Object.values(groups).map(group => ({
    ...group,
    count: group.memories.length,
    memories: group.memories.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))  // Newest first
  })).sort((a, b) => b.count - a.count)  // Most memories first
}

const memoryGroups = groupMemoriesByUser(trip.memories || [])

  return (
    <div className="min-h-full">
      {/* Header */}
      <div className="relative">
        <div className="h-64 md:h-80 overflow-hidden">
          <ImageWithFallback src={trip.coverPhoto} alt={trip.name} className="w-full h-full object-cover" />
        </div>
        <div className="absolute inset-0 bg-black/40" />
        <Button 
          variant="ghost" 
          size="icon" 
          className="absolute top-4 left-4 text-white hover:bg-white/20" 
          onClick={() => navigate('/')}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <h1 className="mb-2 text-2xl font-bold">{trip.name}</h1>
          {trip.description && <p className="text-white/90 mb-4">{trip.description}</p>}
          <div className="flex items-center space-x-6 text-white/80">
            <div className="flex items-center"><Calendar className="h-4 w-4 mr-2" /><span>{formatDateRange(trip.startDate, trip.endDate)}</span></div>
            <div className="flex items-center"><Users className="h-4 w-4 mr-2" /><span>{trip.participants?.length || 0} participants</span></div>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Participants */}
        {trip.participants?.length > 0 && (
          <div className="mb-8">
            <h3 className="mb-4 font-semibold">Participants</h3>
            <div className="flex flex-wrap gap-3">
              {trip.participants.map((p) => (
                <div key={p._id} className="flex items-center space-x-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={p.avatar} alt={p.name} />
                    <AvatarFallback>{p.email?.charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <span className="text-sm">{p.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Memory Groups */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold">Memories ({trip.memories?.length || 0})</h3>
          <Button variant="outline" 
            onClick={() => setIsMemoryModalOpen(true)}
            isOpen={isMemoryModalOpen}
            onClose={() => setIsMemoryModalOpen(false)}
            onAddMemories={handleAddMemories}>
          <Plus className="h-4 w-4 mr-2" /> Add Memory</Button>
        </div>

        {memoryGroups.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-muted-foreground mb-4">No memories yet</div>
            <Button variant="outline"><Plus className="h-4 w-4 mr-2" /> Add first memory</Button>
          </div>
        ) : (
          <div className="space-y-4">
            {memoryGroups.map((group) => (
             <MemoryGroupCard
              key={group.user._id}
              group={group}
               tripId={tripId}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
