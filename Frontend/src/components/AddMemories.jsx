import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload, X } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useAppContext } from "./AppContext.jsx"; 

// MODAL 1: Add First Memory (Full Details)
const AddFirstMemory = ({ isOpen, onClose, onAddMemory }) => {
  const { tripId } = useParams();
  const { uploadToCloudinary } = useAppContext(); 
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    image: "",
    description: "",
    caption: "",
    location: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.image) {
      setError("Please upload an image");
      return;
    }
    if (!formData.description.trim()) {
      setError("Please add a description");
      return;
    }

    await onAddMemory({
      tripId: tripId,
      image: formData.image,
      description: formData.description,
      caption: formData.caption,
      location: formData.location,
    });

    setFormData({ image: "", description: "", caption: "", location: "" });
    setError("");
    onClose();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    setError("");
    try {
      const isVideo = file.type.startsWith("video/");
      const url = await uploadToCloudinary(file, isVideo ? "video" : "image");
      setFormData((prev) => ({ ...prev, image: url }));
    } catch (err) {
      console.error("Upload failed", err);
      setError("Image upload failed. Please try again.");
    } finally {
      setUploading(false);
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
            Add your first memory to this trip album. Fill in the details.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {error && (
            <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm">
              {error}
            </div>
          )}

          {/* Image Upload */}
          <div className="space-y-2">
            <Label htmlFor="imageUpload">🖼️ Upload Image</Label>
            <div className="flex space-x-2 items-center">
              <Input
                id="imageUpload"
                type="file"
                accept="image/*,video/*"
                onChange={handleFileChange}
                className="hidden"
                disabled={uploading}
              />

              {uploading ? (
                <div className="flex items-center gap-2 flex-1 p-2 border rounded text-sm text-gray-500">
                  <span className="animate-spin">⏳</span> Uploading...
                </div>
              ) : formData.image ? (
                <div className="flex items-center gap-2 flex-1">
                  <img
                    src={formData.image}
                    alt="Preview"
                    className="w-20 h-20 object-cover rounded border"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleButtonClick}
                  >
                    Change
                  </Button>
                </div>
              ) : (
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={handleButtonClick}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Choose Image
                </Button>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">📝 Description</Label>
            <Textarea
              id="description"
              placeholder="Tell us about your memory..."
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, description: e.target.value }))
              }
              rows={3}
            />
          </div>

          {/* Caption */}
          <div className="space-y-2">
            <Label htmlFor="caption">💬 Caption</Label>
            <Input
              id="caption"
              placeholder="Give your memory a caption..."
              value={formData.caption}
              maxLength={55}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, caption: e.target.value }))
              }
            />
          </div>

          {/* Location */}
          <div className="space-y-2">
            <Label htmlFor="location">📍 Location</Label>
            <Input
              id="location"
              placeholder="Where was this?"
              value={formData.location}
              maxLength={20}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, location: e.target.value }))
              }
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="button" onClick={handleSubmit} disabled={uploading}>
              {uploading ? "Uploading..." : "Add Memory"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// MODAL 2: Add More Photos (Only Images + Captions)

const AddMorePhotos = ({ isOpen, onClose, onAddPhotos, tripId }) => {
  const { uploadToCloudinary } = useAppContext(); 
  const [uploading, setUploading] = useState(false); 
  const [error, setError] = useState("");
  const [images, setImages] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (images.length === 0) {
      setError("Please upload at least one image");
      return;
    }

    const missingCaption = images.some((img) => !img.caption.trim());
    if (missingCaption) {
      setError("Please add captions for all images");
      return;
    }

   
    const newPhotos = images.map((img) => ({
      tripId: tripId,
      image: img.url, // already-uploaded Cloudinary URL
      caption: img.caption,
    }));

    await onAddPhotos(newPhotos);

    setImages([]);
    setError("");
    onClose();
  };

  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setUploading(true);
    setError("");

    try {
      const uploadedImages = await Promise.all(
        files.map(async (file) => {
          const isVideo = file.type.startsWith("video/");
          const url = await uploadToCloudinary(file, isVideo ? "video" : "image");
          return { url, caption: "" };
        })
      );

      setImages((prev) => [...prev, ...uploadedImages]);
    } catch (err) {
      console.error("Upload failed", err);
      setError("Upload failed. Please try again.");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const updateCaption = (index, caption) => {
    setImages((prev) =>
      prev.map((img, i) => (i === index ? { ...img, caption } : img))
    );
  };

  const handleButtonClick = () => {
    document.getElementById("morePhotosUpload").click();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add More Photos</DialogTitle>
          <DialogDescription>
            Add more photos to this memory. They'll share the same description
            and location.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {error && (
            <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm">
              {error}
            </div>
          )}

          {/* Image Upload */}
          <div className="space-y-2">
            <Label htmlFor="morePhotosUpload">🖼️ Upload Photos</Label>
            <div className="flex space-x-2 items-center">
              <Input
                id="morePhotosUpload"
                type="file"
                accept="image/*,video/*"
                multiple
                onChange={handleFileChange}
                className="hidden"
                disabled={uploading}
              />

              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={handleButtonClick}
                disabled={uploading}
              >
                {uploading ? (
                  <>
                    <span className="animate-spin mr-2">⏳</span> Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4 mr-2" />
                    Choose Images ({images.length} selected)
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Image Previews with Captions */}
          {images.length > 0 && (
            <div className="space-y-3">
              <Label>Photos & Captions</Label>
              <div className="space-y-3 max-h-[400px] overflow-y-auto p-2 border rounded-lg bg-gray-50">
                {images.map((img, index) => (
                  <div
                    key={index}
                    className="flex gap-3 items-start bg-white p-3 rounded-lg border"
                  >
                    <img
                      src={img.url}
                      alt={`Preview ${index + 1}`}
                      className="w-20 h-20 object-cover rounded border flex-shrink-0"
                    />

                    <div className="flex-1 space-y-2">
                      <Label htmlFor={`caption-${index}`} className="text-xs">
                        Caption for Photo {index + 1}
                      </Label>
                      <Input
                        id={`caption-${index}`}
                        placeholder="Add caption..."
                        value={img.caption}
                        maxLength={55}
                        onChange={(e) => updateCaption(index, e.target.value)}
                        className="text-sm"
                      />
                      <p className="text-xs text-gray-500">
                        {img.caption.length}/55
                      </p>
                    </div>

                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 flex-shrink-0"
                      onClick={() => removeImage(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end space-x-2 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="button" onClick={handleSubmit} disabled={uploading}>
              Add {images.length} {images.length === 1 ? "Photo" : "Photos"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export { AddFirstMemory, AddMorePhotos };