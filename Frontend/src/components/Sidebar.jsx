import { Camera, Heart, Plus, Settings, User } from 'lucide-react'
import { NavLink, useLocation } from 'react-router-dom'
import { Button } from './ui/button.jsx'
import { useAppContext } from './AppContext.jsx'
import { useAuth } from './auth/AuthContext.jsx'

const NAV_ITEMS = [
  { id: 'trips', name: 'My Trips', icon: Camera, path: '/', matches: (p) => p === '/' || p.startsWith('/trips') },
  { id: 'favorites', name: 'Favorites', icon: Heart, path: '/favorites', matches: (p) => p.startsWith('/favorites') },
  { id: 'profile', name: 'Profile', icon: User, path: '/profile', matches: (p) => p.startsWith('/profile') },
  { id: 'settings', name: 'Settings', icon: Settings, path: '/settings', matches: (p) => p.startsWith('/settings') },
]

function useLibraryStats() {
  const { trips, favoriteMemories } = useAppContext()
  const { user } = useAuth()

  const memories = trips.reduce((sum, trip) => sum + (trip.memories?.length || 0), 0)
  const friends = new Set(
    trips.flatMap((trip) => (trip.participants || []).map((p) => p._id)).filter((id) => id && id !== user?._id)
  ).size

  return { trips: trips.length, memories, friends, favorites: favoriteMemories.length }
}

export function Sidebar({ onCreateTrip }) {
  const { pathname } = useLocation()
  const stats = useLibraryStats()

  const statItems = [
    { label: 'Trips', value: stats.trips },
    { label: 'Memories', value: stats.memories },
    { label: 'Friends', value: stats.friends },
  ]

  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r bg-sidebar/80 backdrop-blur md:flex">
      <div className="flex-1 space-y-6 overflow-y-auto p-4">
        <Button onClick={onCreateTrip} size="lg" className="w-full">
          <Plus className="h-4 w-4" />
          New trip
        </Button>

        <nav aria-label="Main">
          <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Menu
          </p>
          <ul className="space-y-1">
            {NAV_ITEMS.map(({ id, name, icon: Icon, path, matches }) => {
              const isActive = matches(pathname)
              return (
                <li key={id}>
                  <NavLink
                    to={path}
                    aria-current={isActive ? 'page' : undefined}
                    className={`group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-accent text-accent-foreground'
                        : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                    }`}
                  >
                    {isActive && (
                      <span className="absolute left-0 top-1/2 h-5 w-1 -translate-y-1/2 rounded-r-full bg-primary" />
                    )}
                    <Icon className="h-[18px] w-[18px]" />
                    <span className="flex-1">{name}</span>
                    {id === 'favorites' && stats.favorites > 0 && (
                      <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
                        {stats.favorites}
                      </span>
                    )}
                  </NavLink>
                </li>
              )
            })}
          </ul>
        </nav>
      </div>

      <div className="p-4">
        <div className="rounded-2xl border bg-card p-4 shadow-soft">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Your library
          </p>
          <dl className="grid grid-cols-3 gap-2 text-center">
            {statItems.map((item) => (
              <div key={item.label}>
                <dd className="text-xl font-semibold tabular-nums">{item.value}</dd>
                <dt className="text-[11px] text-muted-foreground">{item.label}</dt>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </aside>
  )
}

export function MobileNav({ onCreateTrip }) {
  const { pathname } = useLocation()
  const [trips, favorites, profile, settings] = NAV_ITEMS

  const renderItem = ({ id, name, icon: Icon, path, matches }) => {
    const isActive = matches(pathname)
    return (
      <NavLink
        key={id}
        to={path}
        aria-current={isActive ? 'page' : undefined}
        className={`flex flex-1 flex-col items-center gap-0.5 py-2 text-[11px] font-medium transition-colors ${
          isActive ? 'text-primary' : 'text-muted-foreground'
        }`}
      >
        <Icon className={`h-5 w-5 ${isActive && id === 'favorites' ? 'fill-current' : ''}`} />
        {name}
      </NavLink>
    )
  }

  return (
    <nav
      aria-label="Main"
      className="fixed inset-x-0 bottom-0 z-40 flex items-end border-t bg-background/90 px-2 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl md:hidden"
    >
      {renderItem(trips)}
      {renderItem(favorites)}
      <div className="flex flex-1 justify-center">
        <button
          type="button"
          onClick={onCreateTrip}
          aria-label="New trip"
          className="-mt-5 flex h-12 w-12 items-center justify-center rounded-full bg-brand text-white shadow-sm transition-transform active:scale-95"
        >
          <Plus className="h-6 w-6" />
        </button>
      </div>
      {renderItem(profile)}
      {renderItem(settings)}
    </nav>
  )
}
