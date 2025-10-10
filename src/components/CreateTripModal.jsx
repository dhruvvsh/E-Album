import { useState } from 'react'
import { Calendar, Upload, Users, X } from 'lucide-react'
import { Button } from './ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog'
import { Input } from './ui/input'
import { Textarea } from './ui/textarea'
import { Label } from './ui/label'
import { Switch } from './ui/switch'

export function CreateTripModal({ isOpen, onClose, onCreateTrip }) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    coverPhoto: '',
    startDate: '',
    endDate: '',
    isPrivate: false,
    participants: []
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (!formData.name || !formData.startDate) {
      return
    }

    // Mock participants for demo
    const mockParticipants = [
      { id: '1', name: 'You', email: 'you@example.com', avatar: '' },
      { id: '2', name: 'Alex Chen', email: 'alex@example.com', avatar: '' },
      { id: '3', name: 'Sarah Johnson', email: 'sarah@example.com', avatar: '' }
    ]

    onCreateTrip({
      name: formData.name,
      description: formData.description,
      coverPhoto: formData.coverPhoto || 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800',
      startDate: formData.startDate,
      endDate: formData.endDate || formData.startDate,
      isPrivate: formData.isPrivate,
      participants: mockParticipants
    })

    // Reset form
    setFormData({
      name: '',
      description: '',
      coverPhoto: '',
      startDate: '',
      endDate: '',
      isPrivate: false,
      participants: []
    })
    
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Trip</DialogTitle>
          <DialogDescription>
            Create a new trip album to share memories with friends and family. Fill in the details below to get started.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Trip Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Trip Name</Label>
            <Input
              id="name"
              placeholder="e.g., Trip to Bali"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Tell us about your trip..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
            />
          </div>

          {/* Cover Photo */}
          <div className="space-y-2">
            <Label htmlFor="coverPhoto">Cover Photo URL</Label>
            <div className="flex space-x-2">
              <Input
                id="coverPhoto"
                placeholder="https://example.com/photo.jpg"
                value={formData.coverPhoto}
                onChange={(e) => setFormData({ ...formData, coverPhoto: e.target.value })}
              />
              <Button type="button" variant="outline" size="icon">
                <Upload className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date</Label>
              <Input
                id="startDate"
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endDate">End Date</Label>
              <Input
                id="endDate"
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
              />
            </div>
          </div>

          {/* Privacy */}
          <div className="flex items-center space-x-2">
            <Switch
              id="private"
              checked={formData.isPrivate}
              onCheckedChange={(checked) => setFormData({ ...formData, isPrivate: checked })}
            />
            <Label htmlFor="private">Private trip (only invited participants can see)</Label>
          </div>

          {/* Participants */}
          <div className="space-y-2">
            <Label>Participants</Label>
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Users className="h-4 w-4" />
              <span>You'll be able to invite friends after creating the trip</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              Create Trip
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}