import { Camera, ImageOff, Loader2 } from 'lucide-react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAppContext } from './AppContext.jsx'
import { ImageCarousel } from './ImageCarousel.jsx'
import { EmptyState } from './EmptyState.jsx'
import { Button } from './ui/button'

export function ImageCarouselView() {
  const { tripId, memorycardId } = useParams()
  const navigate = useNavigate()
  const { trips, isLoadingTrips } = useAppContext()

  const trip = trips?.find((t) => t.id === tripId)

  if (!trip) {
    if (isLoadingTrips) {
      return (
        <div className="flex h-64 items-center justify-center text-muted-foreground">
          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          Loading...
        </div>
      )
    }
    return (
      <EmptyState
        icon={Camera}
        title="Trip not found"
        description="This trip may have been deleted, or you might not have access to it."
        action={<Button onClick={() => navigate('/')}>Back to trips</Button>}
      />
    )
  }

  const tripMemories = trip.memories || []

  if (tripMemories.length === 0) {
    return (
      <EmptyState
        icon={ImageOff}
        title="No memories to show"
        description="This trip doesn't have any photos yet."
        action={
          <Button onClick={() => navigate(`/trips/${tripId}`)}>
            Back to trip
          </Button>
        }
      />
    )
  }

  const images = tripMemories.map((m) => ({
    id: m.id,
    image: m.image,
    caption: m.caption,
    description: m.description,
    location: m.location,
    author: m.author,
    isFavoritedByUser: m.isFavoritedByUser,
  }))

  const [, memoryId] = (memorycardId || '').split('_')
  const startIndex = tripMemories.findIndex((m) => m.id === memoryId)

  return <ImageCarousel images={images} startIndex={Math.max(0, startIndex)} />
}
