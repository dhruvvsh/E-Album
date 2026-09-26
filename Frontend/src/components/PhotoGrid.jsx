import { Heart } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { PhotoCard } from './PhotoCard'
import { PageHeader } from './PageHeader.jsx'
import { EmptyState } from './EmptyState.jsx'
import { Button } from './ui/button'
import { useAppContext } from './AppContext.jsx'

export function PhotoGrid() {
  const navigate = useNavigate()
  const { favoriteMemories, handleToggleFavorite, isLoadingTrips } = useAppContext()

  const openMemory = (memory) => {
    navigate(`/trips/${memory.tripId}/${memory.author?._id}_${memory.id}`)
  }

  return (
    <div className="mx-auto w-full max-w-7xl p-4 sm:p-6 lg:p-8">
      <PageHeader
        title="Favorites"
        description={
          isLoadingTrips
            ? 'Loading...'
            : `${favoriteMemories.length} ${favoriteMemories.length === 1 ? 'memory' : 'memories'} you love`
        }
      />

      {!isLoadingTrips && favoriteMemories.length === 0 ? (
        <EmptyState
          icon={Heart}
          title="No favorites yet"
          description="Tap the heart on any photo to save it here for quick access."
          action={
            <Button onClick={() => navigate('/')}>
              Browse trips
            </Button>
          }
        />
      ) : (
        <div className="columns-2 gap-4 md:columns-3 xl:columns-4 2xl:columns-5">
          {favoriteMemories.map((memory) => (
            <PhotoCard
              key={memory.id}
              photo={memory}
              onClick={() => openMemory(memory)}
              onLike={() => handleToggleFavorite(memory.id)}
            />
          ))}
        </div>
      )}
    </div>
  )
}
