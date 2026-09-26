import { Heart, MapPin } from 'lucide-react'
import { ImageWithFallback } from './figma/ImageWithFallback'
import { getDisplayName } from '@/lib/format'
import { isVideoUrl } from '@/lib/media'

export function PhotoCard({ photo, onClick, onLike }) {
  const isFavorite = photo.isFavoritedByUser

  return (
    <div className="group relative mb-4 break-inside-avoid overflow-hidden rounded-2xl border bg-muted shadow-soft transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl">
      {isVideoUrl(photo.image) ? (
        <video src={photo.image} muted className="block w-full object-cover" />
      ) : (
        <ImageWithFallback
          src={photo.image}
          alt={photo.description || 'Favorite photo'}
          className="block w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      )}

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-within:opacity-100" />

      <div className="pointer-events-none absolute inset-x-0 bottom-0 translate-y-1 p-3 text-white opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:opacity-100">
        {photo.description && <p className="line-clamp-2 text-sm font-semibold">{photo.description}</p>}
        <p className="mt-0.5 flex items-center gap-1 text-xs text-white/75">
          {photo.location && (
            <>
              <MapPin className="h-3 w-3" />
              {photo.location} ·{' '}
            </>
          )}
          {getDisplayName(photo.author)}
        </p>
      </div>

      <button
        type="button"
        onClick={onClick}
        aria-label={`Open ${photo.description || 'photo'}`}
        className="absolute inset-0 z-[1] cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-white"
      />

      <button
        type="button"
        onClick={onLike}
        aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        aria-pressed={isFavorite}
        className={`absolute right-2.5 top-2.5 z-[2] flex h-9 w-9 items-center justify-center rounded-full backdrop-blur-md transition-all hover:scale-110 ${
          isFavorite ? 'bg-red-500/90 text-white' : 'bg-black/35 text-white hover:bg-black/55'
        }`}
      >
        <Heart className={`h-[18px] w-[18px] ${isFavorite ? 'fill-current' : ''}`} />
      </button>
    </div>
  )
}
