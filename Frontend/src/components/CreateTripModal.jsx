import { useState } from 'react'
import { ImagePlus, Loader2, Lock, X } from 'lucide-react'
import { toast } from 'react-toastify'
import { Button } from './ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog'
import { Input } from './ui/input'
import { Textarea } from './ui/textarea'
import { Label } from './ui/label'
import { Switch } from './ui/switch'
import { useAppContext } from './AppContext'
import { getErrorMessage } from '@/lib/api'

const DEFAULT_COVER = 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800'

const EMPTY_TRIP = {
  name: '',
  description: '',
  coverPhoto: '',
  startDate: '',
  endDate: '',
  isPrivate: false,
}

export function CreateTripModal({ isOpen, onClose, onCreateTrip }) {
  const { uploadToCloudinary } = useAppContext()
  const [uploading, setUploading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [formData, setFormData] = useState(EMPTY_TRIP)

  const update = (field) => (e) => setFormData((prev) => ({ ...prev, [field]: e.target.value }))

  const resetAndClose = () => {
    if (submitting) return
    setFormData(EMPTY_TRIP)
    setIsDragging(false)
    onClose()
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.name?.trim() || !formData.description?.trim() || !formData.startDate) {
      toast.error('Please fill in all required fields.')
      return
    }

    if (uploading) {
      toast.warning('Please wait for the image upload to finish.')
      return
    }

    try {
      setSubmitting(true)
      await onCreateTrip({
        tripName: formData.name.trim(),
        description: formData.description.trim(),
        coverPhoto: formData.coverPhoto || DEFAULT_COVER,
        startDate: formData.startDate,
        endDate: formData.endDate || formData.startDate,
        isPrivate: formData.isPrivate,
      })

      toast.success('Trip created successfully!')
      setFormData(EMPTY_TRIP)
      onClose()
    } catch (error) {
      console.error('Trip creation failed:', error)
      toast.error(getErrorMessage(error, 'Failed to create trip. Please try again.'))
    } finally {
      setSubmitting(false)
    }
  }

  const uploadCover = async (file) => {
    if (!file) return

    try {
      setUploading(true)
      const url = await uploadToCloudinary(file, 'image')
      setFormData((prev) => ({ ...prev, coverPhoto: url }))
    } catch (error) {
      console.error('Upload failed:', error)
      toast.error('Failed to upload cover photo.')
    } finally {
      setUploading(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragging(false)
    if (!uploading) uploadCover(e.dataTransfer.files?.[0])
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) resetAndClose() }}>
      <DialogContent className="flex max-h-[92vh] flex-col gap-0 p-0 sm:max-w-[520px]">
        <DialogHeader className="px-6 pb-4 pt-6">
          <DialogTitle>Create a new trip</DialogTitle>
          <DialogDescription>
            Set up a shared album for your trip. You can invite friends right after.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col">
          <div className="min-h-0 flex-1 space-y-5 overflow-y-auto px-6 pb-4">
            <div className="space-y-2">
              <Label htmlFor="name">Trip name</Label>
              <Input
                id="name"
                placeholder="e.g., Summer in Bali"
                value={formData.name}
                onChange={update('name')}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="What is this trip about?"
                value={formData.description}
                onChange={update('description')}
                rows={3}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="coverPhoto">Cover photo</Label>
              {formData.coverPhoto ? (
                <div className="relative overflow-hidden rounded-xl border bg-muted">
                  <img src={formData.coverPhoto} alt="Cover preview" className="h-40 w-full object-cover" />
                  <Button
                    type="button"
                    size="sm"
                    variant="secondary"
                    className="absolute right-2 top-2 rounded-full bg-black/50 text-white backdrop-blur-md hover:bg-black/70"
                    onClick={() => setFormData((prev) => ({ ...prev, coverPhoto: '' }))}
                  >
                    <X className="h-3.5 w-3.5" />
                    Remove
                  </Button>
                </div>
              ) : (
                <label
                  htmlFor="coverPhoto"
                  onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={handleDrop}
                  className={`flex cursor-pointer flex-col items-center justify-center gap-1.5 rounded-xl border-2 border-dashed px-4 py-7 text-center transition-colors ${
                    isDragging
                      ? 'border-primary bg-primary/5'
                      : 'border-muted-foreground/30 hover:border-primary/60 hover:bg-muted/50'
                  }`}
                >
                  {uploading ? (
                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                  ) : (
                    <ImagePlus className="h-6 w-6 text-muted-foreground" />
                  )}
                  <span className="text-sm font-medium">
                    {uploading ? 'Uploading cover photo...' : 'Click to upload or drag and drop'}
                  </span>
                  <span className="text-xs text-muted-foreground">Optional. We'll use a default if you skip it.</span>
                  <input
                    id="coverPhoto"
                    type="file"
                    accept="image/*,.heic,.heif"
                    className="sr-only"
                    disabled={uploading}
                    onChange={(e) => {
                      uploadCover(e.target.files?.[0])
                      e.target.value = ''
                    }}
                  />
                </label>
              )}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="startDate">Start date</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={update('startDate')}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endDate">End date</Label>
                <Input
                  id="endDate"
                  type="date"
                  min={formData.startDate || undefined}
                  value={formData.endDate}
                  onChange={update('endDate')}
                />
              </div>
            </div>

            <div className="flex items-start justify-between gap-4 rounded-xl border bg-muted/40 p-4">
              <div className="flex gap-3">
                <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                  <Lock className="h-4 w-4" />
                </span>
                <div>
                  <Label htmlFor="private" className="cursor-pointer">Private trip</Label>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    Only people you invite can see this album.
                  </p>
                </div>
              </div>
              <Switch
                id="private"
                checked={formData.isPrivate}
                onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, isPrivate: checked }))}
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 border-t px-6 py-4">
            <Button type="button" variant="outline" onClick={resetAndClose} disabled={submitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={uploading || submitting}>
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : uploading ? (
                'Uploading photo...'
              ) : (
                'Create trip'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
