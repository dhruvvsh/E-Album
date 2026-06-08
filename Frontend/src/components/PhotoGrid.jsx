import { PhotoCard } from './PhotoCard'
import { useAppContext } from './AppContext.jsx'

export function PhotoGrid() {
  const { favoriteMemories, handlePhotoClick, handleToggleFavorite } = useAppContext();
  if (!favoriteMemories||favoriteMemories.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-muted-foreground">No memories found</p>
          <p className="text-sm text-muted-foreground mt-1">Try adjusting your search or filters</p>
        </div>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 p-6">
      {favoriteMemories.map((memory) => (
        <PhotoCard
          key={memory.id} 
          photo={memory}
          onClick={() => handlePhotoClick(memory)}
          onLike={() => handleToggleFavorite(memory.id)}
        />
      ))}
    </div>
  )
}