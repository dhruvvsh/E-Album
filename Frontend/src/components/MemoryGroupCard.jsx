import { MapPin, MoreVertical, Trash2, Images, Plus } from 'lucide-react'
import { ImageWithFallback } from './figma/ImageWithFallback'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Button } from './ui/button'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { AddMorePhotos } from './AddMemories.jsx'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu'
import { useAppContext } from './AppContext.jsx'
import { formatTimeAgo, getDisplayName } from '@/lib/format'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from './ui/alert-dialog'

export function MemoryGroupCard({ group, tripId }) {
  const navigate = useNavigate()
  const { handleDeleteMemoryGroup, handleAddMemories } = useAppContext()
  const firstMemory = group.memories[0]
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false)

  const authorName = getDisplayName(firstMemory.author)
  const photoCount = group.memories.length
  const memorycardId = `${group.user._id}_${firstMemory.id}`
  const memoryIds = group.memories.map((m) => m.id)

  const handleImageClick = () => {
    navigate(`/trips/${tripId}/${memorycardId}`)
  }

  const handleDelete = () => {
    handleDeleteMemoryGroup(memoryIds)
    setShowDeleteConfirm(false)
  }

  // each extra photo inherits description & location from the first memory
  const handleAddMorePhotos = async (newPhotos) => {
    const failed = []

    for (const photo of newPhotos) {
      const ok = await handleAddMemories({
        ...photo,
        tripId,
        description: firstMemory.description,
        location: firstMemory.location || "",
      })
      if (!ok) failed.push(photo)
    }

    if (failed.length === 0) setIsPhotoModalOpen(false)
    return failed
  }

  return (
    <>
      <article className="group flex w-full flex-col overflow-hidden rounded-2xl border bg-card text-card-foreground shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
        <div className="relative aspect-square overflow-hidden bg-muted">
          <ImageWithFallback
            src={firstMemory.image}
            alt={firstMemory.description || 'Trip memory'}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />

          <button
            type="button"
            onClick={handleImageClick}
            aria-label={`Open ${photoCount > 1 ? `${photoCount} photos` : 'photo'} by ${authorName}`}
            className="absolute inset-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-white"
          />

          <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/50 to-transparent" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

          <div className="pointer-events-none absolute left-2 top-2 flex items-center gap-2 rounded-full bg-black/35 py-0.5 pl-0.5 pr-2.5 text-white backdrop-blur-md">
            <Avatar className="h-6 w-6 ring-2 ring-white/60">
              <AvatarImage src={firstMemory.author?.avatar} alt={authorName} />
              <AvatarFallback className="bg-white/25 text-xs text-white">
                {authorName.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 leading-tight">
              <p className="max-w-[5.5rem] truncate text-[11px] font-semibold">{authorName}</p>
              <p className="text-[10px] text-white/75">{formatTimeAgo(firstMemory.timestamp)}</p>
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                aria-label="Memory options"
                className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-black/35 text-white backdrop-blur-md transition-colors hover:bg-black/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                <MoreVertical className="h-4 w-4" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem
                onClick={() => setShowDeleteConfirm(true)}
                className="cursor-pointer text-red-600 focus:text-red-600"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Memory
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {photoCount > 1 && (
            <div className="pointer-events-none absolute right-2 top-11 flex items-center gap-1 rounded-full bg-black/35 px-2 py-0.5 text-[11px] font-medium text-white backdrop-blur-md">
              <Images className="h-3.5 w-3.5" />
              {photoCount}
            </div>
          )}

          <div className="pointer-events-none absolute inset-x-0 bottom-0 space-y-1 p-3 text-white">
            {firstMemory.description && (
              <p className="line-clamp-2 text-sm font-semibold leading-snug drop-shadow-sm">
                {firstMemory.description}
              </p>
            )}
            {firstMemory.location && (
              <div className="flex items-center gap-1 text-[11px] text-white/80">
                <MapPin className="h-3.5 w-3.5 shrink-0" />
                <span className="line-clamp-1">{firstMemory.location}</span>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between gap-2 px-3 py-2">
          <span className="hidden text-xs text-muted-foreground sm:block">
            {photoCount} {photoCount === 1 ? 'photo' : 'photos'}
          </span>
          <Button
            variant="outline"
            size="sm"
            className="h-8 flex-1 rounded-full px-2.5 text-xs sm:flex-none"
            onClick={() => setIsPhotoModalOpen(true)}
          >
            <Plus className="mr-1 h-3.5 w-3.5" />
            Add photos
          </Button>
        </div>
      </article>

      <AddMorePhotos
        tripId={tripId}
        isOpen={isPhotoModalOpen}
        onClose={() => setIsPhotoModalOpen(false)}
        onAddPhotos={handleAddMorePhotos}
      />

      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Memory?</AlertDialogTitle>
            <AlertDialogDescription>
              This will delete this memory permanently. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}