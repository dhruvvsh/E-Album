import { Compass, Plus, SearchX } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { TripCard } from './TripCard.jsx'
import { PageHeader } from './PageHeader.jsx'
import { EmptyState } from './EmptyState.jsx'
import { Button } from './ui/button'
import { useAppContext } from './AppContext.jsx'

function TripCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border bg-card shadow-soft">
      <div className="aspect-[4/3] animate-pulse bg-muted" />
      <div className="space-y-3 p-4">
        <div className="h-3.5 w-3/4 animate-pulse rounded bg-muted" />
        <div className="h-3.5 w-1/2 animate-pulse rounded bg-muted" />
        <div className="h-6 w-24 animate-pulse rounded-full bg-muted" />
      </div>
    </div>
  )
}

export function TripsView() {
  const navigate = useNavigate()
  const { trips: allTrips, filteredTrips, isLoadingTrips, searchQuery, setSearchQuery, setIsCreateTripModalOpen } =
    useAppContext()
  const trips = filteredTrips || []
  const memoryCount = allTrips.reduce((sum, trip) => sum + trip.memories.length, 0)

  const newTripButton = (
    <Button onClick={() => setIsCreateTripModalOpen(true)}>
      <Plus className="h-4 w-4" />
      New trip
    </Button>
  )

  return (
    <div className="mx-auto w-full max-w-7xl p-4 sm:p-6 lg:p-8">
      <PageHeader
        title="My Trips"
        description={
          isLoadingTrips
            ? 'Loading your adventures...'
            : `${allTrips.length} ${allTrips.length === 1 ? 'trip' : 'trips'} · ${memoryCount} ${memoryCount === 1 ? 'memory' : 'memories'}`
        }
        actions={allTrips.length > 0 && newTripButton}
      />

      {isLoadingTrips ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <TripCardSkeleton key={i} />
          ))}
        </div>
      ) : allTrips.length === 0 ? (
        <EmptyState
          icon={Compass}
          title="Your first adventure starts here"
          description="Create a trip album, invite friends, and collect every moment in one place."
          action={newTripButton}
        />
      ) : trips.length === 0 ? (
        <EmptyState
          icon={SearchX}
          title="No trips match your search"
          description={`Nothing found for "${searchQuery}". Try a different keyword.`}
          action={
            <Button variant="outline" onClick={() => setSearchQuery('')}>
              Clear search
            </Button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {trips.map((trip, index) => (
            <div key={trip.id} className="animate-fade-up" style={{ animationDelay: `${Math.min(index, 8) * 50}ms` }}>
              <TripCard trip={trip} onClick={() => navigate(`/trips/${trip.id}`)} />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
