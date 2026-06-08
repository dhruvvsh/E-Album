import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Heart } from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";
import { X } from "lucide-react";
import { useAppContext } from "./AppContext";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";

export function ImageCarousel({ images, tripMemories, startIndex }) {
  const [isFavorited, setIsFavorited] = useState([]);
  const { handleToggleFavorite } = useAppContext();
  const navigate = useNavigate();
  const { tripId, memorycardId } = useParams();

  console.log("images :", images);
  console.log(images.map((img) => img._id));
  return (
    <div className="w-full flex justify-center items-center py-10">
      <div className="w-full max-w-5xl">
        <Carousel className="w-full">
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 z-10 text-white hover:bg-white/20"
            onClick={() => navigate(`/trips/${tripId}`)}
          >
            <X className="h-6 w-6" />
          </Button>
          <CarouselContent>
            {images.map((post) => (
              <CarouselItem key={post.id} className="basis-full">
                <div className="rounded-2xl overflow-hidden shadow-xl">
                  {/* Control image size here */}
                  <div className="relative w-full h-[60vh] bg-black">
                    <img
                      src={post.image}
                      alt="carousel"
                      className="w-full h-full object-cover"
                    />
                    <button
                      onClick={() => handleToggleFavorite(post.id)}
                      className={`absolute bottom-6 right-6 p-3 rounded-full transition-all duration-300 transform hover:scale-125 backdrop-blur-md ${isFavorited.includes(post.id)
                        ? 'bg-red-500/90 text-white shadow-lg shadow-red-500/50 scale-110'
                        : 'bg-white/20 text-white hover:bg-white/40'
                        }`}
                    >
                      <Heart
                        size={26}
                        className={isFavorited ? 'fill-current' : ''}
                      />
                    </button>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>

          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
    </div>
  );
}
