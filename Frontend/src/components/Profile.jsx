import { useState } from 'react'
import { Camera, Heart, Images, Mail, Map, User as UserIcon } from 'lucide-react'
import { useAuth } from './auth/AuthContext.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card.jsx'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar.jsx'
import { Button } from './ui/button.jsx'
import { Input } from './ui/input.jsx'
import { Label } from './ui/label.jsx'
import { useAppContext } from './AppContext.jsx'

function StatCard({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-4 rounded-2xl border bg-card p-4 shadow-soft">
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-accent text-accent-foreground">
        <Icon className="h-5 w-5" />
      </span>
      <div>
        <p className="text-2xl font-semibold tabular-nums leading-none">{value}</p>
        <p className="mt-1 text-sm text-muted-foreground">{label}</p>
      </div>
    </div>
  )
}

export default function Profile() {
  const { user } = useAuth()
  const { trips, favoriteMemories } = useAppContext()
  const [isEditing, setIsEditing] = useState(false)
  const [name, setName] = useState(user?.username || '')
  const [email, setEmail] = useState(user?.email || '')

  const sharedMemories = trips
    .flatMap((trip) => trip.memories)
    .filter((memory) => memory.author?._id === user?._id).length

  const handleCancel = () => {
    setName(user?.username || '')
    setEmail(user?.email || '')
    setIsEditing(false)
  }

  const handleSave = () => {
    // TODO: Implement profile update
    setIsEditing(false)
  }

  return (
    <div className="mx-auto w-full max-w-4xl p-4 sm:p-6 lg:p-8">
      <div className="overflow-hidden rounded-3xl border bg-card shadow-soft">
        <div className="relative h-32 overflow-hidden bg-brand sm:h-40">
          <div className="absolute -right-10 -top-16 h-48 w-48 rounded-full bg-[var(--clay)]" />
          <div className="absolute -bottom-20 right-32 h-40 w-40 rounded-full bg-[var(--sand)]" />
        </div>

        <div className="flex flex-col gap-4 px-6 pb-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="-mt-12 flex items-end gap-4 sm:-mt-14">
            <div className="relative">
              <Avatar className="h-24 w-24 border-4 border-card shadow-lg sm:h-28 sm:w-28">
                <AvatarImage src={user?.avatar} alt={user?.username} />
                <AvatarFallback className="bg-brand text-3xl font-semibold text-white">
                  {user?.username?.charAt(0)?.toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
              <Button
                size="icon"
                variant="secondary"
                aria-label="Change profile photo"
                className="absolute bottom-0 right-0 h-8 w-8 rounded-full border shadow-sm"
              >
                <Camera className="h-4 w-4" />
              </Button>
            </div>
            <div className="pb-1">
              <h1 className="text-2xl font-bold tracking-tight">{user?.username}</h1>
              <p className="text-sm text-muted-foreground">{user?.email}</p>
            </div>
          </div>

          <div className="flex gap-2">
            {isEditing && (
              <Button variant="ghost" onClick={handleCancel}>
                Cancel
              </Button>
            )}
            <Button
              variant={isEditing ? 'gradient' : 'outline'}
              onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
            >
              {isEditing ? 'Save changes' : 'Edit profile'}
            </Button>
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <StatCard icon={Map} label="Trips" value={trips.length} />
        <StatCard icon={Images} label="Memories shared" value={sharedMemories} />
        <StatCard icon={Heart} label="Favorites" value={favoriteMemories.length} />
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Personal information</CardTitle>
          <CardDescription>Update your personal details</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-5 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="name" className="flex items-center gap-2">
              <UserIcon className="h-4 w-4 text-muted-foreground" />
              Name
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={!isEditing}
              placeholder="Your name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-muted-foreground" />
              Email
            </Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={!isEditing}
              placeholder="your.email@example.com"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
