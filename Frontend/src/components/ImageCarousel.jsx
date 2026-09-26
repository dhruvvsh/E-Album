import { useEffect, useState } from "react";
import { Heart, MapPin, X } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Button } from "./ui/button";
import { useAppContext } from "./AppContext";
import { getDisplayName } from "@/lib/format";
import { isVideoUrl } from "@/lib/media";

const NAV_BUTTON =
  "size-11 rounded-full border-0 bg-white/10 text-white backdrop-blur-md hover:bg-white/25 hover:text-white disabled:opacity-25";

export function ImageCarousel({ images, startIndex = 0 }) {
  const { handleToggleFavorite } = useAppContext();
  const navigate = useNavigate();
  const { tripId } = useParams();
  const [api, setApi] = useState(null);
  const [current, setCurrent] = useState(startIndex);

  const close = () => navigate(`/trips/${tripId}`);

  useEffect(() => {
    if (!api) return;
    const onSelect = () => setCurrent(api.selectedScrollSnap());
    onSelect();
    api.on("select", onSelect);
    return () => api.off("select", onSelect);
  }, [api]);

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === "Escape") {
        navigate(`/trips/${tripId}`);
        return;
      }
      // The carousel handles arrows itself once focus is inside it.
      if (e.target.closest?.('[data-slot="carousel"]')) return;
      if (e.key === "ArrowLeft") api?.scrollPrev();
      if (e.key === "ArrowRight") api?.scrollNext();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [api, navigate, tripId]);

  const active = images[current] ?? images[0];
  const info = active?.caption || active?.description;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Photo viewer"
      className="fixed inset-0 z-50 flex flex-col bg-neutral-950 text-white"
    >
      <div className="flex h-14 shrink-0 items-center justify-between px-4 sm:px-6">
        <span className="rounded-full bg-white/10 px-3 py-1 text-sm font-medium tabular-nums backdrop-blur-md">
          {current + 1} / {images.length}
        </span>
        <Button
          variant="ghost"
          size="icon"
          aria-label="Close viewer"
          className="rounded-full text-white hover:bg-white/15 hover:text-white"
          onClick={close}
        >
          <X className="h-5 w-5" />
        </Button>
      </div>

      <Carousel
        className="min-h-0 flex-1"
        opts={{ startIndex }}
        setApi={setApi}
      >
        <CarouselContent className="ml-0">
          {images.map((post) => (
            <CarouselItem
              key={post.id}
              className="flex h-[calc(100dvh-11rem)] basis-full items-center justify-center pl-0 sm:px-16"
            >
              {isVideoUrl(post.image) ? (
                <video
                  src={post.image}
                  controls
                  className="max-h-full max-w-full rounded-xl object-contain"
                />
              ) : (
                <img
                  src={post.image}
                  alt={post.caption || post.description || "Trip memory"}
                  className="max-h-full max-w-full rounded-xl object-contain shadow-2xl"
                />
              )}
            </CarouselItem>
          ))}
        </CarouselContent>

        <CarouselPrevious className={`left-4 hidden sm:inline-flex ${NAV_BUTTON}`} />
        <CarouselNext className={`right-4 hidden sm:inline-flex ${NAV_BUTTON}`} />
      </Carousel>

      <div className="flex h-24 shrink-0 items-center justify-between gap-4 px-4 pb-2 sm:px-6">
        <div className="min-w-0">
          {info && <p className="line-clamp-2 font-medium">{info}</p>}
          <p className="mt-0.5 flex items-center gap-1.5 truncate text-sm text-white/65">
            {active?.location && (
              <>
                <MapPin className="h-3.5 w-3.5 shrink-0" />
                {active.location}
                <span aria-hidden="true">·</span>
              </>
            )}
            by {getDisplayName(active?.author)}
          </p>
        </div>

        <button
          type="button"
          aria-label={active?.isFavoritedByUser ? "Remove from favorites" : "Add to favorites"}
          aria-pressed={!!active?.isFavoritedByUser}
          onClick={() => active && handleToggleFavorite(active.id)}
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full backdrop-blur-md transition-all hover:scale-110 ${
            active?.isFavoritedByUser
              ? "bg-red-500/90 text-white shadow-lg shadow-red-500/40"
              : "bg-white/10 text-white hover:bg-white/25"
          }`}
        >
          <Heart className={`h-6 w-6 ${active?.isFavoritedByUser ? "fill-current" : ""}`} />
        </button>
      </div>
    </div>
  );
}
