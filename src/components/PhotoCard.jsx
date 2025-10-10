import { Heart, Download, Share2 } from 'lucide-react'
import { Button } from './ui/button'
import { ImageWithFallback } from './figma/ImageWithFallback'
import { useState } from 'react'

export function PhotoCard({ photo, onClick, onLike }) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div 
      className="group relative bg-card rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      {/* Image */}
      <div className="aspect-square overflow-hidden">
        <ImageWithFallback
          src={photo.url}
          alt={photo.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
        />
      </div>

      {/* Overlay */}
      {isHovered && (
        <div className="absolute inset-0 bg-black/40 flex items-end p-3 transition-opacity duration-200">
          <div className="flex-1">
            <h4 className="text-white mb-1">{photo.title}</h4>
            <p className="text-white/70 text-sm">by {photo.photographer}</p>
          </div>
          <div className="flex space-x-2">
            <Button
              size="icon"
              variant="secondary"
              className="h-8 w-8 bg-white/20 hover:bg-white/30 border-0"
              onClick={(e) => {
                e.stopPropagation()
                onLike(photo.id)
              }}
            >
              <Heart className={`h-4 w-4 ${photo.isLiked ? 'fill-red-500 text-red-500' : 'text-white'}`} />
            </Button>
            <Button
              size="icon"
              variant="secondary"
              className="h-8 w-8 bg-white/20 hover:bg-white/30 border-0"
              onClick={(e) => e.stopPropagation()}
            >
              <Share2 className="h-4 w-4 text-white" />
            </Button>
            <Button
              size="icon"
              variant="secondary"
              className="h-8 w-8 bg-white/20 hover:bg-white/30 border-0"
              onClick={(e) => e.stopPropagation()}
            >
              <Download className="h-4 w-4 text-white" />
            </Button>
          </div>
        </div>
      )}

      {/* Like indicator */}
      {photo.isLiked && !isHovered && (
        <div className="absolute top-2 right-2">
          <Heart className="h-5 w-5 fill-red-500 text-red-500" />
        </div>
      )}
    </div>
  )
}