import { Star, MapPin, MoreVertical, Trash2 } from 'lucide-react'
import { ImageWithFallback } from './figma/ImageWithFallback'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Card, CardContent, CardHeader } from './ui/card'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu'
import { useAppContext } from './AppContext.jsx'

export function MemoryGroupCard({ group, tripId }) {
  const navigate = useNavigate()
  const { handleToggleFavorite, handleDeleteMemory } = useAppContext()
  const firstMemory = group.memories[0]
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const formatTimeAgo = (timestamp) => {
    const now = new Date()
    const time = new Date(timestamp)
    const diffInHours = Math.floor((now - time) / (1000 * 60 * 60))
    if (diffInHours < 1) return 'Just now'
    if (diffInHours < 24) return `${diffInHours}h ago`
    return Math.floor(diffInHours / 24) + 'd ago'
  }

  const memorycardId = `${group.user._id}_${firstMemory.id}`

  const handleImageClick = () => {
    console.log('🖱️ MemoryGroupCard CLICKED')
    console.log('📍 Navigating to:', `/trips/${tripId}/${memorycardId}`)
    navigate(`/trips/${tripId}/${memorycardId}`)
  }

  const handleToggleFav = (e) => {
    e.stopPropagation()
    if (firstMemory) {
      handleToggleFavorite(firstMemory.id)
    }
  }

  const handleDelete = () => {
    console.log('🗑️ DELETE clicked')
    handleDeleteMemory(firstMemory.id)
    setShowDeleteConfirm(false)
  }

  return (
    <>
      <Card
        className="w-full max-w-md overflow-hidden hover:shadow-lg transition-all cursor-pointer group"
        onClick={handleImageClick}
      >
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 flex-1">
              <Avatar className="h-10 w-10">
                <AvatarImage
                  src={firstMemory.author?.avatar}
                  alt={firstMemory.author?.name}
                />
                <AvatarFallback>
                  {firstMemory.author?.email?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="font-semibold">{firstMemory.author?.name}</p>
                <p className="text-xs text-muted-foreground">
                  {formatTimeAgo(firstMemory.timestamp)}
                </p>
              </div>
            </div>

            {/* MENU DROPDOWN */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <MoreVertical className="h-4 w-4 text-gray-600" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation()
                    setShowDeleteConfirm(true)
                  }}
                  className="text-red-600 cursor-pointer"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Memory
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {/* MAIN IMAGE - NO STRETCHING */}
          <div className="aspect-square overflow-hidden relative">
            <ImageWithFallback
              src={firstMemory.image}
              alt={firstMemory.description}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
            />
            {group.memories.length > 1 && (
              <div className="absolute bottom-3 right-3 bg-black/70 text-white text-xs px-2.5 py-1 rounded-full font-semibold">
                +{group.memories.length - 1}
              </div>
            )}
          </div>

          {/* DESCRIPTION + METADATA */}
          <div className="p-4 bg-gradient-to-t from-gray-50 to-white">
            {/* CAPTION/DESCRIPTION */}
            <p className="text-sm font-medium text-gray-900 line-clamp-2 mb-2">
              "{firstMemory.description}"
            </p>

            {/* FAVORITE BUTTON */}
            <div className="flex items-center justify-between mb-2">
              <button
                onClick={handleToggleFav}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full hover:bg-gray-200 transition-colors cursor-pointer"
                title="Add to favorites"
              >
                <Star
                  className={`w-4 h-4 transition-all ${
                    firstMemory?.isFavoritedByUser
                      ? 'fill-yellow-400 text-yellow-400 scale-110'
                      : 'text-gray-400 hover:text-gray-600'
                  }`}
                />
                <span className="text-xs text-gray-600 font-medium">
                  {firstMemory?.isFavoritedByUser ? 'Favorited' : 'Favorite'}
                </span>
              </button>
            </div>

            {/* LOCATION */}
            {firstMemory.location && (
              <div className="flex items-center gap-1 text-xs text-gray-600 mb-2">
                <MapPin className="w-3 h-3" />
                <span className="line-clamp-1">{firstMemory.location}</span>
              </div>
            )}

            {/* PHOTO COUNT */}
            {group.memories.length > 1 && (
              <p className="text-xs text-gray-500">
                {group.memories.length} photos
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* DELETE CONFIRMATION MODAL */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl">
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              Delete Memory?
            </h2>
            <p className="text-gray-600 mb-6">
              This will delete this memory permanently. This action cannot be
              undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-900 rounded-lg font-semibold transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
