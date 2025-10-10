import { useState } from 'react'
import { useAuth } from './auth/AuthContext.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card.jsx'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar.jsx'
import { Button } from './ui/button.jsx'
import { Input } from './ui/input.jsx'
import { Label } from './ui/label.jsx'
import { Separator } from './ui/separator.jsx'
import { Camera, Mail, User as UserIcon } from 'lucide-react'

export default function Profile() {
  const { user } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [name, setName] = useState(user?.name || '')
  const [email, setEmail] = useState(user?.email || '')

  const handleSave = () => {
    // TODO: Implement profile update
    setIsEditing(false)
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h2 className="mb-2">Profile Settings</h2>
        <p className="text-muted-foreground">Manage your account information and preferences</p>
      </div>

      {/* Profile Header */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex items-center space-x-6">
            <div className="relative">
              <Avatar className="h-24 w-24">
                <AvatarImage src={user?.avatar} alt={user?.name} />
                <AvatarFallback className="text-2xl">
                  {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
              <Button
                size="icon"
                variant="secondary"
                className="absolute bottom-0 right-0 h-8 w-8 rounded-full"
              >
                <Camera className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex-1">
              <h3 className="mb-1">{user?.name}</h3>
              <p className="text-muted-foreground">{user?.email}</p>
            </div>
            <Button
              variant={isEditing ? "default" : "outline"}
              onClick={() => isEditing ? handleSave() : setIsEditing(true)}
            >
              {isEditing ? 'Save Changes' : 'Edit Profile'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Personal Information */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
          <CardDescription>Update your personal details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">
              <div className="flex items-center space-x-2">
                <UserIcon className="h-4 w-4" />
                <span>Name</span>
              </div>
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
            <Label htmlFor="email">
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4" />
                <span>Email</span>
              </div>
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

      {/* Stats */}
      <Card>
        <CardHeader>
          <CardTitle>Activity Stats</CardTitle>
          <CardDescription>Your journey so far</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-4 bg-muted rounded-lg">
              <div className="text-2xl font-semibold mb-1">3</div>
              <div className="text-sm text-muted-foreground">Trips Created</div>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <div className="text-2xl font-semibold mb-1">8</div>
              <div className="text-sm text-muted-foreground">Memories Shared</div>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <div className="text-2xl font-semibold mb-1">127</div>
              <div className="text-sm text-muted-foreground">Total Likes</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
