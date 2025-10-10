import { X, Heart, Download, Share2, ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from './ui/button'
import { Dialog, DialogContent } from './ui/dialog'
import { ImageWithFallback } from './figma/ImageWithFallback'
import { Badge } from './ui/badge'

export function PhotoModal({ 
  photo, 
  isOpen, 
  onClose, 
  onLike, 
  onPrevious,
  onNext,
  hasNext,
  hasPrevious 
}) {
  if (!photo) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl w-full h-[90vh] p-0 bg-black/95">
        <div className="relative h-full flex">
          {/* Close button */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 z-10 text-white hover:bg-white/20"
            onClick={onClose}
          >
            <X className="h-6 w-6" />
          </Button>

          {/* Navigation buttons */}
          {hasPrevious && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-4 top-1/2 -translate-y-1/2 z-10 text-white hover:bg-white/20"
              onClick={onPrevious}
            >
              <ChevronLeft className="h-8 w-8" />
            </Button>
          )}

          {hasNext && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-4 top-1/2 -translate-y-1/2 z-10 text-white hover:bg-white/20"
              onClick={onNext}
            >
              <ChevronRight className="h-8 w-8" />
            </Button>
          )}

          {/* Image */}
          <div className="flex-1 flex items-center justify-center p-8">
            <ImageWithFallback
              src={photo.url}
              alt={photo.title}
              className="max-w-full max-h-full object-contain"
            />
          </div>

          {/* Photo info sidebar */}
          <div className="w-80 bg-background p-6 overflow-y-auto">
            <div className="space-y-6">
              {/* Title and photographer */}
              <div>
                <h2 className="mb-2">{photo.title}</h2>
                <p className="text-muted-foreground">by {photo.photographer}</p>
                <p className="text-sm text-muted-foreground mt-1">{photo.date}</p>
              </div>

              {/* Description */}
              {photo.description && (
                <div>
                  <h3 className="mb-2">Description</h3>
                  <p className="text-sm text-muted-foreground">{photo.description}</p>
                </div>
              )}

              {/* Tags */}
              <div>
                <h3 className="mb-2">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {photo.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-3">
                <Button
                  variant={photo.isLiked ? "default" : "outline"}
                  className="w-full"
                  onClick={() => onLike(photo.id)}
                >
                  <Heart className={`h-4 w-4 mr-2 ${photo.isLiked ? 'fill-current' : ''}`} />
                  {photo.isLiked ? 'Liked' : 'Like'} ({photo.likes})
                </Button>
                
                <div className="flex space-x-2">
                  <Button variant="outline" className="flex-1">
                    <Share2 className="h-4 w-4 mr-2" />
                    Share
                  </Button>
                  <Button variant="outline" className="flex-1">
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                </div>
              </div>

              {/* Photo details */}
              <div>
                <h3 className="mb-2">Details</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Category:</span>
                    <span>{photo.category}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Date:</span>
                    <span>{photo.date}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Likes:</span>
                    <span>{photo.likes}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}