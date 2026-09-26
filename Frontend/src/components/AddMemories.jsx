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
import { ImagePlus, Loader2, MapPin, Upload, X } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useAppContext } from "./AppContext.jsx";
import { isVideoUrl } from "@/lib/media";

// MODAL 1: Add Memory (full details)

const EMPTY_MEMORY = { image: "", description: "", caption: "", location: "" };

const AddFirstMemory = ({ isOpen, onClose, onAddMemory }) => {
  const { tripId } = useParams();
  const { uploadToCloudinary } = useAppContext();
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [formData, setFormData] = useState(EMPTY_MEMORY);

  const update = (field) => (e) =>
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));

  const resetAndClose = () => {
    if (submitting) return;
    setFormData(EMPTY_MEMORY);
    setError("");
    setIsDragging(false);
    onClose();
  };

  const uploadFile = async (file) => {
    if (!file) return;
    setUploading(true);
    setError("");
    try {
      const isVideo = file.type.startsWith("video/");
      const url = await uploadToCloudinary(file, isVideo ? "video" : "image");
      setFormData((prev) => ({ ...prev, image: url }));
    } catch (err) {
      console.error("Upload failed", err);
      setError("Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (!uploading) uploadFile(e.dataTransfer.files?.[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.image) {
      setError("Please upload a photo or video.");
      return;
    }
    if (!formData.description.trim()) {
      setError("Please add a description.");
      return;
    }

    setSubmitting(true);
    setError("");
    const ok = await onAddMemory({
      tripId,
      image: formData.image,
      description: formData.description.trim(),
      caption: formData.caption.trim(),
      location: formData.location.trim(),
    });
    setSubmitting(false);
    if (ok === false) return;

    setFormData(EMPTY_MEMORY);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) resetAndClose(); }}>
      <DialogContent className="flex max-h-[90vh] flex-col gap-0 p-0 sm:max-w-[480px]">
        <DialogHeader className="px-6 pt-6 pb-4">
          <DialogTitle>Add a memory</DialogTitle>
          <DialogDescription>
            Share a moment from this trip with everyone in the album.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col">
          <div className="min-h-0 flex-1 space-y-5 overflow-y-auto px-6 pb-4">
            {error && (
              <div
                role="alert"
                className="rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-600 dark:text-red-400"
              >
                {error}
              </div>
            )}

            {formData.image ? (
              <div className="relative overflow-hidden rounded-xl border bg-muted">
                {isVideoUrl(formData.image) ? (
                  <video src={formData.image} controls className="max-h-64 w-full object-cover" />
                ) : (
                  <img src={formData.image} alt="Preview" className="max-h-64 w-full object-cover" />
                )}
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  className="absolute right-2 top-2 rounded-full bg-black/50 text-white backdrop-blur-md hover:bg-black/70"
                  onClick={() => setFormData((prev) => ({ ...prev, image: "" }))}
                  disabled={submitting}
                >
                  <X className="h-3.5 w-3.5" />
                  Replace
                </Button>
              </div>
            ) : (
              <label
                htmlFor="imageUpload"
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed px-4 py-10 text-center transition-colors ${
                  isDragging
                    ? "border-primary bg-primary/5"
                    : "border-muted-foreground/30 hover:border-primary/60 hover:bg-muted/50"
                }`}
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-muted">
                  {uploading ? (
                    <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                  ) : (
                    <ImagePlus className="h-5 w-5 text-muted-foreground" />
                  )}
                </span>
                <span className="text-sm font-medium">
                  {uploading ? "Uploading..." : "Click to choose or drag and drop"}
                </span>
                <span className="text-xs text-muted-foreground">A photo or video from your trip</span>
                <input
                  id="imageUpload"
                  type="file"
                  accept="image/*,video/*,.heic,.heif"
                  className="sr-only"
                  disabled={uploading}
                  onChange={(e) => {
                    uploadFile(e.target.files?.[0]);
                    e.target.value = "";
                  }}
                />
              </label>
            )}

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Tell the story behind this moment..."
                value={formData.description}
                onChange={update("description")}
                rows={3}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="caption">Caption</Label>
                <Input
                  id="caption"
                  placeholder="Short caption (optional)"
                  value={formData.caption}
                  maxLength={55}
                  onChange={update("caption")}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <div className="relative">
                  <MapPin className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="location"
                    placeholder="Where was this?"
                    value={formData.location}
                    maxLength={20}
                    onChange={update("location")}
                    className="pl-9"
                  />
                </div>
              </div>
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
                  Adding...
                </>
              ) : uploading ? (
                "Uploading..."
              ) : (
                "Add memory"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

// MODAL 2: Add More Photos (images/videos + optional captions)

const AddMorePhotos = ({ isOpen, onClose, onAddPhotos, tripId }) => {
  const { uploadToCloudinary } = useAppContext();
  const [items, setItems] = useState([]);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const uploadingCount = items.filter((item) => item.status === "uploading").length;
  const readyItems = items.filter((item) => item.status === "done");
  const isBusy = uploadingCount > 0 || submitting;

  const resetAndClose = () => {
    if (submitting) return;
    setItems([]);
    setError("");
    setIsDragging(false);
    onClose();
  };

  const uploadFiles = async (fileList) => {
    const files = Array.from(fileList).filter(
      (file) => file.type.startsWith("image/") || file.type.startsWith("video/") || /\.(heic|heif)$/i.test(file.name)
    );
    if (files.length === 0) {
      setError("Please choose image or video files.");
      return;
    }

    setError("");
    const pending = files.map((file) => ({
      id: crypto.randomUUID(),
      file,
      url: "",
      caption: "",
      status: "uploading",
    }));
    setItems((prev) => [...prev, ...pending]);

    const results = await Promise.all(
      pending.map(async ({ id, file }) => {
        try {
          const url = await uploadToCloudinary(
            file,
            file.type.startsWith("video/") ? "video" : "image"
          );
          setItems((prev) =>
            prev.map((item) => (item.id === id ? { ...item, url, status: "done" } : item))
          );
          return true;
        } catch (err) {
          console.error("Upload failed", err);
          setItems((prev) => prev.filter((item) => item.id !== id));
          return false;
        }
      })
    );

    const failedCount = results.filter((ok) => !ok).length;
    if (failedCount > 0) {
      setError(
        `${failedCount} ${failedCount === 1 ? "file" : "files"} failed to upload. Please try again.`
      );
    }
  };

  const handleFileChange = (e) => {
    uploadFiles(e.target.files);
    e.target.value = "";
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (!isBusy) uploadFiles(e.dataTransfer.files);
  };

  const removeItem = (id) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const updateCaption = (id, caption) => {
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, caption } : item)));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (readyItems.length === 0) {
      setError("Please upload at least one photo.");
      return;
    }

    setSubmitting(true);
    setError("");

    const failed = await onAddPhotos(
      readyItems.map((item) => ({ tripId, image: item.url, caption: item.caption.trim() }))
    );
    setSubmitting(false);

    if (failed?.length) {
      const failedUrls = new Set(failed.map((photo) => photo.image));
      setItems((prev) => prev.filter((item) => failedUrls.has(item.url)));
      setError(`${failed.length} ${failed.length === 1 ? "photo" : "photos"} could not be added. Try again.`);
      return;
    }

    setItems([]);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) resetAndClose(); }}>
      <DialogContent className="flex max-h-[90vh] flex-col gap-0 p-0 sm:max-w-[560px]">
        <DialogHeader className="px-6 pt-6 pb-4">
          <DialogTitle>Add more photos</DialogTitle>
          <DialogDescription>
            New photos share this memory's description and location.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col">
          <div className="min-h-0 flex-1 space-y-4 overflow-y-auto px-6 pb-4">
            {error && (
              <div
                role="alert"
                className="rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-600 dark:text-red-400"
              >
                {error}
              </div>
            )}

            <label
              htmlFor="morePhotosUpload"
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed px-4 py-8 text-center transition-colors ${
                isDragging
                  ? "border-primary bg-primary/5"
                  : "border-muted-foreground/30 hover:border-primary/60 hover:bg-muted/50"
              }`}
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                <Upload className="h-5 w-5 text-muted-foreground" />
              </span>
              <span className="text-sm font-medium">Click to choose or drag and drop</span>
              <span className="text-xs text-muted-foreground">Photos or videos, multiple allowed</span>
              <input
                id="morePhotosUpload"
                type="file"
                accept="image/*,video/*,.heic,.heif"
                multiple
                className="sr-only"
                onChange={handleFileChange}
                disabled={submitting}
              />
            </label>

            {items.length > 0 && (
              <ul className="space-y-2">
                {items.map((item, index) => (
                  <li
                    key={item.id}
                    className="flex items-center gap-3 rounded-lg border bg-card p-2"
                  >
                    <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-md bg-muted">
                      {item.status === "uploading" ? (
                        <div className="flex h-full w-full items-center justify-center">
                          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                        </div>
                      ) : isVideoUrl(item.url) ? (
                        <video src={item.url} muted className="h-full w-full object-cover" />
                      ) : (
                        <img
                          src={item.url}
                          alt={`Photo ${index + 1}`}
                          className="h-full w-full object-cover"
                        />
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      {item.status === "uploading" ? (
                        <p className="truncate text-sm text-muted-foreground">
                          Uploading {item.file.name}...
                        </p>
                      ) : (
                        <>
                          <Input
                            aria-label={`Caption for photo ${index + 1}`}
                            placeholder="Add a caption (optional)"
                            value={item.caption}
                            maxLength={55}
                            onChange={(e) => updateCaption(item.id, e.target.value)}
                            className="h-8 text-sm"
                          />
                          <p className="mt-1 text-right text-[11px] text-muted-foreground">
                            {item.caption.length}/55
                          </p>
                        </>
                      )}
                    </div>

                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      aria-label={`Remove photo ${index + 1}`}
                      className="h-8 w-8 shrink-0"
                      onClick={() => removeItem(item.id)}
                      disabled={submitting}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="flex justify-end gap-2 border-t px-6 py-4">
            <Button type="button" variant="outline" onClick={resetAndClose} disabled={submitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={isBusy || readyItems.length === 0}>
              {submitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Adding...
                </>
              ) : uploadingCount > 0 ? (
                "Uploading..."
              ) : (
                `Add ${readyItems.length || ""} ${readyItems.length === 1 ? "photo" : "photos"}`.replace("  ", " ")
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export { AddFirstMemory, AddMorePhotos };