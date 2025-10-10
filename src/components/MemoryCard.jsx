import { Heart, MessageCircle, MapPin, MoreHorizontal } from 'lucide-react'
import { ImageWithFallback } from './figma/ImageWithFallback'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Button } from './ui/button'
import { Card, CardContent, CardHeader } from './ui/card'

export function MemoryCard({ 
  memory, 
  showTripName = false, 
  tripName, 
  onLike, 
  onComment, 
  onClick 
}) {
  const formatTimeAgo = (timestamp) => {
    const now = new Date()
    const time = new Date(timestamp)
    const diffInHours = Math.floor((now.getTime() - time.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) return 'Just now'
    if (diffInHours < 24) return `${diffInHours}h ago`
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`
    return time.toLocaleDateString()
  }

  return (
    <Card className="w-full max-w-md overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={memory.author.avatar} alt={memory.author.name} />
              <AvatarFallback>
                {memory.author.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{memory.author.name}</p>
              <div className="flex items-center text-sm text-muted-foreground">
                <span>{formatTimeAgo(memory.timestamp)}</span>
                {showTripName && tripName && (
                  <>
                    <span className="mx-1">•</span>
                    <span>{tripName}</span>
                  </>
                )}
              </div>
            </div>
          </div>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        {/* Image */}
        <div 
          className="aspect-square overflow-hidden cursor-pointer"
          onClick={onClick}
        >
          <ImageWithFallback
            src={memory.image}
            alt={memory.description}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
          />
        </div>

        {/* Actions */}
        <div className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                className="h-8 px-2"
                onClick={() => onLike(memory.id)}
              >
                <Heart className={`h-5 w-5 mr-1 ${memory.isLiked ? 'fill-red-500 text-red-500' : ''}`} />
                <span>{memory.likes}</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 px-2"
                onClick={() => onComment(memory.id)}
              >
                <MessageCircle className="h-5 w-5 mr-1" />
                <span>{memory.comments.length}</span>
              </Button>
            </div>
            {memory.location && (
              <div className="flex items-center text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 mr-1" />
                <span>{memory.location}</span>
              </div>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <p className="text-sm">
              <span className="font-medium">{memory.author.name}</span>{' '}
              {memory.description}
            </p>
            
            {/* Comments Preview */}
            {memory.comments.length > 0 && (
              <div className="text-sm text-muted-foreground">
                {memory.comments.length > 2 && (
                  <button 
                    className="hover:underline mb-1 block"
                    onClick={() => onComment(memory.id)}
                  >
                    View all {memory.comments.length} comments
                  </button>
                )}
                {memory.comments.slice(-2).map((comment) => (
                  <p key={comment.id} className="mb-1">
                    <span className="font-medium text-foreground">{comment.author.name}</span>{' '}
                    {comment.text}
                  </p>
                ))}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}