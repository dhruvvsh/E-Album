import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

export function ImageCarousel() {
  const posts = [
    {
      id: 1,
      image: "https://picsum.photos/1200/800?random=1",
    },
    {
      id: 2,
      image: "https://picsum.photos/1200/800?random=2",
    },
    {
      id: 3,
      image: "https://picsum.photos/1200/800?random=3",
    },
    {
      id: 4,
      image: "https://picsum.photos/1200/800?random=4",
    },
    {
      id: 5,
      image: "https://picsum.photos/1200/800?random=5",
    },
  ];

  return (
    <div className="w-full flex justify-center items-center py-10">
      <div className="w-full max-w-5xl">
        <Carousel className="w-full">
          <CarouselContent>
            {posts.map((post) => (
              <CarouselItem key={post.id} className="basis-full">
                <div className="rounded-2xl overflow-hidden shadow-xl">
                  {/* Control image size here */}
                  <div className="w-full h-[60vh] bg-black">
                    <img
                      src={post.image}
                      alt="carousel"
                      className="w-full h-full object-cover"
                    />
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
