import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Calendar, Camera, ImagePlus, Loader2, Lock, Mail, Plus, Send, Users } from "lucide-react";
import { toast } from "react-toastify";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { ImageWithFallback } from "./figma/ImageWithFallback.jsx";
import { MemoryGroupCard } from "./MemoryGroupCard.jsx";
import { EmptyState } from "./EmptyState.jsx";
import { AddFirstMemory } from "./AddMemories.jsx";
import { useAppContext } from "./AppContext.jsx";
import api, { getErrorMessage } from "@/lib/api";
import { formatDateRange, getDisplayName } from "@/lib/format";

const groupMemoriesByUser = (memories) => {
  const groups = {};
  memories.forEach((memory) => {
    const userId = memory.author?._id || memory.author?.id;
    if (!groups[userId]) {
      groups[userId] = { user: memory.author, memories: [] };
    }
    groups[userId].memories.push(memory);
  });

  return Object.values(groups)
    .map((group) => ({
      ...group,
      count: group.memories.length,
      memories: group.memories.sort(
        (a, b) => new Date(b.timestamp) - new Date(a.timestamp),
      ),
    }))
    .sort((a, b) => b.count - a.count);
};

export function TripDetailView() {
  const { tripId } = useParams();
  const navigate = useNavigate();
  const { trips, isLoadingTrips, handleAddMemories } = useAppContext();

  const [isMemoryModalOpen, setIsMemoryModalOpen] = useState(false);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const trip = trips?.find((t) => t.id === tripId);

  if (!trip) {
    if (isLoadingTrips) {
      return (
        <div className="flex h-64 items-center justify-center text-muted-foreground">
          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          Loading trip...
        </div>
      );
    }
    return (
      <EmptyState
        icon={Camera}
        title="Trip not found"
        description="This trip may have been deleted, or you might not have access to it."
        action={<Button onClick={() => navigate("/")}>Back to trips</Button>}
      />
    );
  }

  const participants = trip.participants || [];
  const memoryGroups = groupMemoriesByUser(trip.memories || []);
  const memoryCount = trip.memories?.length || 0;

  const handleInviteParticipant = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      const { data } = await api.post(`/trips/${tripId}/invite`, {
        email: inviteEmail.trim(),
      });

      toast.success(data.message || "Invitation sent successfully");

      setInviteEmail("");
      setIsInviteModalOpen(false);
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-full">
      <div className="relative h-72 overflow-hidden bg-muted sm:h-80 md:h-96">
        <ImageWithFallback
          src={trip.coverPhoto}
          alt=""
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/30" />

        <Button
          variant="ghost"
          size="icon"
          className="absolute left-4 top-4 rounded-full bg-black/35 text-white backdrop-blur-md hover:bg-black/60 hover:text-white sm:left-6 sm:top-6"
          aria-label="Back to trips"
          onClick={() => navigate("/")}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>

        <div className="absolute inset-x-0 bottom-0 mx-auto w-full max-w-7xl px-4 pb-6 text-white sm:px-6 lg:px-8">
          {trip.isPrivate && (
            <span className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-medium backdrop-blur-md">
              <Lock className="h-3.5 w-3.5" />
              Private trip
            </span>
          )}
          <h1 className="text-3xl font-bold tracking-tight drop-shadow-sm sm:text-4xl">
            {trip.name}
          </h1>
          {trip.description && (
            <p className="mt-2 line-clamp-2 max-w-2xl text-white/85">{trip.description}</p>
          )}
          <div className="mt-4 flex flex-wrap items-center gap-2 text-sm">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1.5 backdrop-blur-md">
              <Calendar className="h-4 w-4" />
              {formatDateRange(trip.startDate, trip.endDate, { long: true })}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1.5 backdrop-blur-md">
              <Users className="h-4 w-4" />
              {participants.length} {participants.length === 1 ? "traveler" : "travelers"}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1.5 backdrop-blur-md">
              <Camera className="h-4 w-4" />
              {memoryCount} {memoryCount === 1 ? "memory" : "memories"}
            </span>
          </div>
        </div>
      </div>

      <div className="mx-auto w-full max-w-7xl space-y-8 p-4 sm:p-6 lg:p-8">
        <section
          aria-label="Travelers"
          className="flex flex-col gap-4 rounded-2xl border bg-card p-4 shadow-soft sm:flex-row sm:items-center sm:justify-between"
        >
          <div className="flex min-w-0 items-center gap-4">
            <div className="flex -space-x-2">
              {participants.slice(0, 6).map((p) => (
                <Avatar key={p._id} className="h-9 w-9 border-2 border-card" title={getDisplayName(p)}>
                  <AvatarImage src={p.avatar} alt={getDisplayName(p)} />
                  <AvatarFallback className="text-xs">
                    {getDisplayName(p).charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              ))}
              {participants.length > 6 && (
                <span className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-card bg-muted text-xs font-medium">
                  +{participants.length - 6}
                </span>
              )}
            </div>
            <p className="min-w-0 truncate text-sm text-muted-foreground">
              {participants.map(getDisplayName).slice(0, 3).join(", ")}
              {participants.length > 3 && ` and ${participants.length - 3} more`}
            </p>
          </div>
          <Button variant="outline" onClick={() => setIsInviteModalOpen(true)}>
            <Users className="h-4 w-4" />
            Invite people
          </Button>
        </section>

        <section aria-label="Memories">
          <div className="mb-6 flex items-center justify-between gap-3">
            <h2 className="text-xl font-semibold tracking-tight">
              Memories
              <span className="ml-2 rounded-full bg-muted px-2.5 py-0.5 text-sm font-medium text-muted-foreground">
                {memoryCount}
              </span>
            </h2>
            <Button onClick={() => setIsMemoryModalOpen(true)}>
              <Plus className="h-4 w-4" />
              Add memory
            </Button>
          </div>

          {memoryGroups.length === 0 ? (
            <div className="rounded-2xl border border-dashed bg-card/50">
              <EmptyState
                icon={ImagePlus}
                title="No memories yet"
                description="Be the first to share a photo or video from this trip."
                action={
                  <Button onClick={() => setIsMemoryModalOpen(true)}>
                    <Plus className="h-4 w-4" />
                    Add first memory
                  </Button>
                }
              />
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
              {memoryGroups.map((group) => (
                <MemoryGroupCard
                  key={group.user?._id}
                  group={group}
                  tripId={tripId}
                />
              ))}
            </div>
          )}
        </section>
      </div>

      <AddFirstMemory
        isOpen={isMemoryModalOpen}
        onClose={() => setIsMemoryModalOpen(false)}
        onAddMemory={handleAddMemories}
      />

      <Dialog open={isInviteModalOpen} onOpenChange={setIsInviteModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader className="items-center text-center sm:items-start sm:text-left">
            <span className="mb-1 flex h-11 w-11 items-center justify-center rounded-xl bg-brand text-white shadow-sm">
              <Send className="h-5 w-5" />
            </span>
            <DialogTitle>Invite someone to {trip.name}</DialogTitle>
            <DialogDescription>
              We'll email them a private link to join this trip and share memories.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleInviteParticipant} className="space-y-4">
            <div className="relative">
              <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="email"
                required
                autoFocus
                placeholder="friend@example.com"
                aria-label="Email address"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                className="pl-10"
              />
            </div>

            <Button
              type="submit"
             
              className="w-full"
              disabled={loading || !inviteEmail.trim()}
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                "Send invite"
              )}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
