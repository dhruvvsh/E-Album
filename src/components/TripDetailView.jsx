import { ArrowLeft, Calendar, Users, MapPin, Plus } from 'lucide-react'
import { useParams, useNavigate } from 'react-router-dom'
import { Button } from './ui/button'
import { ImageWithFallback } from './figma/ImageWithFallback.jsx'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { MemoryCard } from './MemoryCard.jsx'
import { useAppContext } from './AppContext.jsx'

export function TripDetailView() {
  const { tripId } = useParams()
  const navigate = useNavigate()
  const { trips, handleLike, handleComment, handleMemoryClick } = useAppContext()
  
  const trip = trips?.find(t => t.id === tripId)
  
  if (!trip) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <h3 className="mb-2">Trip not found</h3>
          <p className="text-muted-foreground mb-4">The trip you're looking for doesn't exist.</p>
          <Button onClick={() => navigate('/trips')}>Back to Trips</Button>
        </div>
      </div>
    )
  }
  const formatDateRange = (start, end) => {
    const startDate = new Date(start).toLocaleDateString('en-US', { 
      month: 'long', 
      day: 'numeric', 
      year: 'numeric' 
    })
    
    if (!end || end === start) return startDate
    
    const endDate = new Date(end).toLocaleDateString('en-US', { 
      month: 'long', 
      day: 'numeric', 
      year: 'numeric' 
    })
    
    return `${startDate} - ${endDate}`
  }

  const sortedMemories = trip?.memories ? [...trip.memories].sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  ) : []

  return (
    <div className="min-h-full">
      {/* Header */}
      <div className="relative">
        {/* Cover Photo */}
        <div className="h-64 md:h-80 overflow-hidden">
          <ImageWithFallback
            src={trip.coverPhoto}
            alt={trip.name}
            className="w-full h-full object-cover"
          />
        </div>
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/40" />
        
        {/* Back Button */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-4 left-4 text-white hover:bg-white/20"
          onClick={() => navigate('/trips')}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        
        {/* Trip Info */}
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <h1 className="mb-2">{trip.name}</h1>
          {trip.description && (
            <p className="text-white/90 mb-4">{trip.description}</p>
          )}
          
          <div className="flex items-center space-x-6 text-white/80">
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-2" />
              <span>{formatDateRange(trip.startDate, trip.endDate)}</span>
            </div>
            <div className="flex items-center">
              <Users className="h-4 w-4 mr-2" />
              <span>{trip.participants.length} participants</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Participants */}
        <div className="mb-8">
          <h3 className="mb-4">Participants</h3>
          <div className="flex flex-wrap gap-3">
            {trip.participants.map((participant) => (
              <div key={participant.id} className="flex items-center space-x-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={participant.avatar} alt={participant.name} />
                  <AvatarFallback>
                    {participant.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm">{participant.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Memories Timeline */}
        <div className="flex items-center justify-between mb-6">
          <h3>Memories ({trip.memories.length})</h3>
          <Button onClick={() => {/* TODO: Implement add memory */}}>
            <Plus className="h-4 w-4 mr-2" />
            Add Memory
          </Button>
        </div>

        {sortedMemories.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-muted-foreground mb-4">No memories yet</div>
            <Button onClick={() => {/* TODO: Implement add memory */}} variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Add the first memory
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {sortedMemories.map((memory) => (
              <MemoryCard
                key={memory.id}
                memory={memory}
                onLike={handleLike}
                onComment={handleComment}
                onClick={() => handleMemoryClick(memory)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}