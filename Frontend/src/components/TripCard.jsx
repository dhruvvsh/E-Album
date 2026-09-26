import { useState } from 'react'
import { Calendar, Camera, Lock, MoreVertical, Trash2 } from 'lucide-react'
import { ImageWithFallback } from './figma/ImageWithFallback'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu'
import { useAppContext } from './AppContext.jsx'
import { useAuth } from './auth/AuthContext.jsx'
import { formatDateRange, getDisplayName } from '@/lib/format'

export function TripCard({ trip, onClick }) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const { handleDeleteTrip } = useAppContext()
  const { user } = useAuth()

  const participants = trip.participants || []
  const creatorId = trip.createdBy?._id || trip.createdBy
  const canDelete = creatorId && creatorId === user?._id

  return (
    <>
      <article className="group relative overflow-hidden rounded-2xl border bg-card shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
        <div className="relative aspect-[4/3] overflow-hidden bg-muted">
          <ImageWithFallback
            src={trip.coverPhoto}
            alt=""
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-black/20" />

          <div className="pointer-events-none absolute left-3 top-3 flex gap-2">
            <span className="flex items-center gap-1 rounded-full bg-black/35 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-md">
              <Camera className="h-3.5 w-3.5" />
              {trip.memories.length}
            </span>
            {trip.isPrivate && (
              <span className="flex items-center gap-1 rounded-full bg-black/35 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-md">
                <Lock className="h-3.5 w-3.5" />
                Private
              </span>
            )}
          </div>

          <div className="pointer-events-none absolute inset-x-0 bottom-0 p-4 text-white">
            <h3 className="line-clamp-1 text-lg font-semibold leading-tight drop-shadow-sm">{trip.name}</h3>
            <p className="mt-1 flex items-center gap-1.5 text-xs text-white/80">
              <Calendar className="h-3.5 w-3.5" />
              {formatDateRange(trip.startDate, trip.endDate)}
            </p>
          </div>
        </div>

        <div className="space-y-3 p-4">
          <p className="line-clamp-2 min-h-[2.5rem] text-sm text-muted-foreground">
            {trip.description || 'No description yet.'}
          </p>

          <div className="flex items-center justify-between">
            <div className="flex -space-x-2">
              {participants.slice(0, 4).map((participant) => (
                <Avatar key={participant._id} className="h-7 w-7 border-2 border-card">
                  <AvatarImage src={participant.avatar} alt={getDisplayName(participant)} />
                  <AvatarFallback className="text-[10px]">
                    {getDisplayName(participant).charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              ))}
              {participants.length > 4 && (
                <span className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-card bg-muted text-[10px] font-medium">
                  +{participants.length - 4}
                </span>
              )}
            </div>
            <span className="text-xs text-muted-foreground">
              {participants.length} {participants.length === 1 ? 'member' : 'members'}
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={onClick}
          aria-label={`Open trip ${trip.name}`}
          className="absolute inset-0 z-[1] cursor-pointer rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />

        {canDelete && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                aria-label="Trip options"
                className="absolute right-3 top-3 z-[2] flex h-8 w-8 items-center justify-center rounded-full bg-black/35 text-white backdrop-blur-md transition-colors hover:bg-black/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                <MoreVertical className="h-4 w-4" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-44">
              <DropdownMenuItem
                onClick={() => setShowDeleteDialog(true)}
                className="cursor-pointer text-destructive focus:text-destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete trip
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </article>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this trip?</AlertDialogTitle>
            <AlertDialogDescription>
              <strong>{trip.name}</strong> and all of its memories will be permanently deleted. This
              action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => handleDeleteTrip(trip.id)}
              className="bg-destructive text-white hover:bg-destructive/90"
            >
              Delete trip
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
