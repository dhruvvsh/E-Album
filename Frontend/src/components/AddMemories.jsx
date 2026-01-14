import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog'
import { Label } from './ui/label'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Upload } from 'lucide-react'
import { Textarea } from './ui/textarea'
import { useParams } from 'react-router-dom'  
import React, { useState } from 'react'

const AddMemories = ({ isOpen, onClose, onAddMemories }) => {
  const[error, setError] = useState('');
  const { tripId } = useParams();
const [formData, setFormData] = useState({
    image: '',
    description: '',
    caption: '',
    location:''
  });

  const handleSubmit =(e)=>{
    e.preventDefault();
    if(!formData.image){
      setError('please upload an image');
      return;
    }

    onAddMemories({
      tripId: tripId,
      image: formData.image,
      description: formData.description,
      caption: formData.caption,
      location: formData.location
    });

    setFormData({
    image: '',
    description: '',
    caption: '',
    location:''
    })
    onClose();
  }


 const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageURL = URL.createObjectURL(file);
      setFormData({ ...formData, image: imageURL });
    }
  };

  const handleButtonClick = () => {
    document.getElementById("imageUpload").click();
  };


  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Memory</DialogTitle>
          <DialogDescription>
            Add a new memory to your trip album. Fill in the details.
          </DialogDescription>
        </DialogHeader>
        <form className="space-y-4 overflow-x-hidden" onSubmit={handleSubmit}>
           {error && (
            <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm">
              {error}
            </div>
          )}
        <div className="space-y-2">
          <Label htmlFor="upload image">🖼️Upload Image</Label>
          <div className="flex space-x-2 items-center">
  
          <Input
            id="imageUpload"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
          />
          
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={handleButtonClick}
          >
            <Upload className="h-4 w-4" />
          </Button>
        </div>
        </div>
         <div className="space-y-2">
            <Label htmlFor="description">📝Description</Label>
            <Textarea
              id="description"
              placeholder="Tell us about your memory..."
              value={formData.description}
              style={{ wordBreak: 'break-all', overflowWrap: 'anywhere' }}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
            />
          </div>
          <div className="space-y-2 ">
            <Label htmlFor="caption">💬Caption</Label>
            <Input
              id="caption"
              placeholder="Give your memory a caption..."
              value={formData.caption}
              maxLength={55}
              onChange={(e) => setFormData({ ...formData, caption: e.target.value })}
            />
          </div>
           <div className="space-y-2 ">
            <Label htmlFor="location">📍Location</Label>

            <Input
              id="location"
              placeholder="location..."
              value={formData.location}
              maxLength={20}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            />
          </div>
          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              Add Memory
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default AddMemories
