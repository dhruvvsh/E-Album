import { useParams, useNavigate } from 'react-router-dom'
import { useAppContext } from './AppContext.jsx'
import { ImageCarousel } from './ImageCarousel.jsx'

export function ImageCarouselView() {
  const { tripId, memorycardId } = useParams()
  const navigate = useNavigate()
  const { trips } = useAppContext()

  console.log('🎯 ImageCarouselView MOUNTED')
  console.log('🗺️ ROUTE PARAMS:', { tripId, memorycardId })
  console.log('📦 TOTAL TRIPS:', trips?.length)

  const trip = trips?.find((t) => t.id === tripId)
  console.log('🔍 CURRENT TRIP:', trip)

  if (!trip) {
    console.error('❌ TRIP NOT FOUND:', tripId)
    return (
      <div className="fixed inset-0 z-[9999] bg-black/95 flex items-center justify-center p-8">
        <div className="text-white max-w-md mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Trip Not Found</h2>
          <p className="mb-2">
            Trip ID: <code className="bg-gray-800 px-3 py-1 rounded text-sm">{tripId}</code>
          </p>
          <p className="text-gray-400 mb-6">
            Available trips: {trips?.map((t) => t.id).join(', ')}
          </p>
          <button
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-bold"
            onClick={() => navigate('/')}
          >
            ← Back to Home
          </button>
        </div>
      </div>
    )
  }

  const tripMemories = trip.memories || []
  console.log('🖼️ TRIP MEMORIES:', tripMemories.length)
  console.log(
    '📸 MEMORY IMAGES:',
    tripMemories.map((m) => ({ id: m.id, image: m.image ? '✅' : '❌' }))
  )

  if (tripMemories.length === 0) {
    console.error('❌ NO MEMORIES IN TRIP')
    return (
      <div className="fixed inset-0 z-[9999] bg-black/95 flex items-center justify-center p-8">
        <div className="text-white max-w-md mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">No Memories</h2>
          <button
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-bold"
            onClick={() => navigate(`/trips/${tripId}`)}
          >
            ← Back to Trip
          </button>
        </div>
      </div>
    )
  }

  const images = tripMemories.map((m) => ({
    id: m. id,
    image: m.image,
  }))
  const [, memoryId] = memorycardId.split('_')
  const startIndex = tripMemories.findIndex((m) => m.id === memoryId)

  console.log('✅ ImageCarouselView READY')
  console.log('🎬 CAROUSEL PROPS:', {
    images: images.length,
    startIndex,
    memorycardId,
    memoryId,
  })

  return (
    <ImageCarousel
      images={images}
      tripMemories={tripMemories}
      initialIndex={Math.max(0, startIndex)}
    />
  )
}
