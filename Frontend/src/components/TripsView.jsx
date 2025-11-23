import { useNavigate } from 'react-router-dom'
import { TripCard } from './TripCard.jsx'
import { useAppContext } from './AppContext.jsx'

export function TripsView() {
  const navigate = useNavigate()
  const { filteredTrips } = useAppContext()
  const trips = filteredTrips || []


  if (trips.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <h3 className="mb-2">No trips yet</h3>
          <p className="text-muted-foreground">Create your first trip to start sharing memories!</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="mb-2">My Trips</h2>
        <p className="text-muted-foreground">All your travel memories in one place</p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {trips.map((trip) => (
          <TripCard
            key={trip.id}
            trip={trip}
            onClick={() => navigate(`/trips/${trip.id}`)}
          />
        ))}
      </div>
    </div>
  )
}