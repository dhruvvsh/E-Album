import { Calendar, Users, Camera } from 'lucide-react'
import { ImageWithFallback } from './figma/ImageWithFallback'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Card, CardContent } from './ui/card'

export function TripCard({ trip, onClick }) {
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', { 
      month: 'short', 
      year: 'numeric' 
    })
  }

  return (
    <Card 
      className="group cursor-pointer overflow-hidden hover:shadow-lg transition-all duration-200 hover:scale-[1.02]"
      onClick={onClick}
    >
      <div className="relative">
        {/* Cover Photo */}
        <div className="aspect-[4/3] overflow-hidden">
          <ImageWithFallback
            src={trip.coverPhoto}
            alt={trip.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
          />
        </div>
        
        {/* Memory Count Badge */}
        <div className="absolute top-3 right-3 bg-black/70 text-white px-2 py-1 rounded-full flex items-center space-x-1">
          <Camera className="h-3 w-3" />
          <span className="text-xs">{trip.memories.length}</span>
        </div>
      </div>

      <CardContent className="p-4">
        {/* Trip Name */}
        <h3 className="mb-2 line-clamp-1">{trip.name}</h3>
        
        {/* Description */}
        {trip.description && (
          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
            {trip.description}
          </p>
        )}

        {/* Date */}
        <div className="flex items-center text-sm text-muted-foreground mb-3">
          <Calendar className="h-4 w-4 mr-2" />
          <span>
            {formatDate(trip.startDate)}
            {trip.endDate && trip.endDate !== trip.startDate && (
              ` - ${formatDate(trip.endDate)}`
            )}
          </span>
        </div>

        {/* Participants */}
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Users className="h-4 w-4 mr-2 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              {trip.participants.length} participants
            </span>
          </div>
          
          {/* Participant Avatars */}
          <div className="flex -space-x-2">
            {trip.participants.slice(0, 3).map((participant) => (
              <Avatar key={participant.id} className="h-6 w-6 border-2 border-background">
                <AvatarImage src={participant.avatar} alt={participant.name} />
                <AvatarFallback className="text-xs">
                  {participant.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            ))}
            {trip.participants.length > 3 && (
              <div className="h-6 w-6 rounded-full bg-muted border-2 border-background flex items-center justify-center">
                <span className="text-xs">+{trip.participants.length - 3}</span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}