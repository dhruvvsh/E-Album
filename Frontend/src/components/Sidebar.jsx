import { Home, Camera, User, Settings, Plus } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import { Button } from './ui/button.jsx'
import { ScrollArea } from './ui/scroll-area.jsx'
import { Separator } from './ui/separator.jsx'
import { useAppContext } from './AppContext.jsx'

export function Sidebar({ onCreateTrip, onCreateMemory }) {

   const { filteredTrips } = useAppContext()
    const trips = filteredTrips || []

  const navItems = [
    // { id: 'posts', name: 'Recent Posts', icon: <Home className="h-5 w-5" />, path: '/' },
    { id: 'trips', name: 'My Trips', icon: <Camera className="h-5 w-5" />, path: '/trips' },
    { id: 'profile', name: 'Profile', icon: <User className="h-5 w-5" />, path: '/profile' },
    { id: 'settings', name: 'Settings', icon: <Settings className="h-5 w-5" />, path: '/settings' },
  ]

  return (
    <div className="w-64 bg-background border-r border-border h-full">
      <ScrollArea className="h-full">
        <div className="p-4">
          {/* Create Actions */}
          <div className="mb-6 space-y-2">
            <Button 
              onClick={onCreateTrip}
              className="w-full justify-start"
              variant="default"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Trip
            </Button>
            {/* <Button 
              onClick={onCreateMemory}
              className="w-full justify-start"
              variant="outline"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Memory
            </Button> */}
          </div>

          <Separator className="my-4" />

          {/* Navigation */}
          <div>
            <h3 className="mb-3 text-muted-foreground">Navigation</h3>
            <div className="space-y-1">
              {navItems.map((item) => (
                <NavLink
                  key={item.id}
                  to={item.path}
                  end={item.path === '/'}
                >
                  {({ isActive }) => (
                    <Button
                      variant={isActive ? "secondary" : "ghost"}
                      className="w-full justify-start"
                    >
                      {item.icon}
                      <span className="ml-3">{item.name}</span>
                    </Button>
                  )}
                </NavLink>
              ))}
            </div>
          </div>

          <Separator className="my-6" />

          {/* Quick Stats */}
          <div>
            <h3 className="mb-3 text-muted-foreground">Stats</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Trips:</span>
                <span>{trips?.length || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Memories:</span>
                <span>{trips?.memories?.length || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Friends:</span>
                <span>{trips?.participants?.length || 0}</span>
              </div>
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  )
}