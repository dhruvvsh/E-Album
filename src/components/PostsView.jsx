import { MemoryCard } from './MemoryCard'

export function PostsView({ memories, trips, onLike, onComment, onMemoryClick }) {
  const getTripName = (tripId) => {
    const trip = trips.find(t => t.id === tripId)
    return trip?.name || 'Unknown Trip'
  }

  if (memories.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <h3 className="mb-2">No recent posts</h3>
          <p className="text-muted-foreground">Start sharing memories from your trips!</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="mb-2">Recent Posts</h2>
        <p className="text-muted-foreground">Latest memories from all your trips</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {memories.map((memory) => (
          <MemoryCard
            key={memory.id}
            memory={memory}
            showTripName={true}
            tripName={getTripName(memory.tripId)}
            onLike={onLike}
            onComment={onComment}
            onClick={() => onMemoryClick(memory)}
          />
        ))}
      </div>
    </div>
  )
}