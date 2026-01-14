import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Heart, MessageCircle, Share2 } from 'lucide-react';

export function ImageCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const posts = [
    {
      id: 1,
      author: 'Dan Walker',
      time: '17 minutes ago',
      avatar: 'https://i.pravatar.cc/150?img=12',
      image:
        'https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?w=800&h=600&fit=crop',
      likes: 64,
      likedBy: 'Elise Walker',
    },
    {
      id: 2,
      author: 'Lana Henrikssen',
      time: '1 day ago',
      avatar: 'https://i.pravatar.cc/150?img=5',
      image:
        'https://images.unsplash.com/photo-1682687221038-404cb8830901?w=800&h=600&fit=crop',
      likes: 1800,
      likedBy: 'Jenna Davis',
    },
    {
      id: 3,
      author: 'Stella Bergmann',
      time: '45 minutes ago',
      avatar: 'https://i.pravatar.cc/150?img=9',
      image:
        'https://images.unsplash.com/photo-1682687220063-4742bd7fd538?w=800&h=600&fit=crop',
      likes: 299,
      likedBy: 'Bobby Brown',
    },
    {
      id: 4,
      author: 'Jenna Davis',
      time: '3 hours ago',
      avatar: 'https://i.pravatar.cc/150?img=1',
      image:
        'https://images.unsplash.com/photo-1682687218147-9806132dc697?w=800&h=600&fit=crop',
      likes: 687,
      likedBy: 'David Kim',
    },
    {
      id: 5,
      author: 'Elise Walker',
      time: '1 hour ago',
      avatar: 'https://i.pravatar.cc/150?img=45',
      image:
        'https://images.unsplash.com/photo-1682687220199-d0124f48f95b?w=800&h=600&fit=crop',
      likes: 49,
      likedBy: 'Dan Walker',
    },
    {
      id: 6,
      author: 'Milly Augustine',
      time: '6 hours ago',
      avatar: 'https://i.pravatar.cc/150?img=47',
      image:
        'https://images.unsplash.com/photo-1682687221073-5a3a4c1825f7?w=800&h=600&fit=crop',
      likes: 341,
      likedBy: 'Gaelle Morris',
    },
  ];

  const nextSlide = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex((prev) => (prev + 1) % posts.length);
    setTimeout(() => setIsAnimating(false), 600);
  };

  const prevSlide = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex((prev) => (prev - 1 + posts.length) % posts.length);
    setTimeout(() => setIsAnimating(false), 600);
  };

  const goToSlide = (index) => {
    if (isAnimating || index === currentIndex) return;
    setIsAnimating(true);
    setCurrentIndex(index);
    setTimeout(() => setIsAnimating(false), 600);
  };

  const currentPost = posts[currentIndex];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-5xl relative">
        {/* Card */}
        <div className="relative bg-white rounded-2xl shadow-2xl overflow-hidden lg:h-[600px] h-[550px] flex flex-col">
          {/* Header */}
          <div className="flex items-center gap-3 p-4 border-b border-slate-200 bg-white">
            <img
              src={currentPost.avatar}
              alt={currentPost.author}
              className="w-10 h-10 lg:w-12 lg:h-12 rounded-full object-cover ring-2 ring-slate-200"
            />
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-slate-900 text-sm lg:text-base truncate">
                {currentPost.author}
              </h3>
              <p className="text-xs lg:text-sm text-slate-500">
                {currentPost.time}
              </p>
            </div>
          </div>

          {/* Image */}
          <div className="flex-1 bg-slate-100 relative">
            <img
              src={currentPost.image}
              alt="Post"
              className={`w-full h-full object-cover transition-transform duration-700 ${
                isAnimating ? 'scale-[1.02] opacity-90' : 'scale-100 opacity-100'
              }`}
            />
          </div>

          {/* Footer */}
          <div className="p-3 lg:p-4 border-t border-slate-200 bg-white">
            <div className="flex items-center gap-3 lg:gap-4 mb-2 lg:mb-3">
              <button className="flex items-center gap-1.5 lg:gap-2 text-slate-600 hover:text-red-500 transition-all duration-300 hover:scale-110">
                <Heart className="w-4 h-4 lg:w-5 lg:h-5" />
                <span className="font-medium text-sm lg:text-base">
                  {currentPost.likes}
                </span>
              </button>
              <button className="flex items-center gap-1.5 lg:gap-2 text-slate-600 hover:text-blue-500 transition-all duration-300 hover:scale-110">
                <MessageCircle className="w-4 h-4 lg:w-5 lg:h-5" />
              </button>
              <button className="flex items-center gap-1.5 lg:gap-2 text-slate-600 hover:text-green-500 transition-all duration-300 hover:scale-110">
                <Share2 className="w-4 h-4 lg:w-5 lg:h-5" />
              </button>
            </div>

            <div className="flex items-center gap-2">
              <img
                src={posts[(currentIndex + 1) % posts.length].avatar}
                alt=""
                className="w-5 h-5 lg:w-6 lg:h-6 rounded-full object-cover"
              />
              <p className="text-xs lg:text-sm text-slate-600 truncate">
                Liked by <span className="font-semibold">{currentPost.likedBy}</span> and{' '}
                <span className="font-semibold">{currentPost.likes - 1} others</span>
              </p>
            </div>
          </div>

          {/* Arrows */}
          <button
            onClick={prevSlide}
            disabled={isAnimating}
            className="absolute left-2 lg:left-4 top-1/2 -translate-y-1/2 bg-white/95 hover:bg-white backdrop-blur-sm rounded-full p-2 lg:p-3 shadow-lg transition-all duration-300 hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed z-10"
          >
            <ChevronLeft className="w-5 h-5 lg:w-6 lg:h-6 text-slate-700" />
          </button>
          <button
            onClick={nextSlide}
            disabled={isAnimating}
            className="absolute right-2 lg:right-4 top-1/2 -translate-y-1/2 bg-white/95 hover:bg-white backdrop-blur-sm rounded-full p-2 lg:p-3 shadow-lg transition-all duration-300 hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed z-10"
          >
            <ChevronRight className="w-5 h-5 lg:w-6 lg:h-6 text-slate-700" />
          </button>

          {/* Dots */}
          <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2 z-10">
            {posts.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                disabled={isAnimating}
                className={`h-1.5 lg:h-2 rounded-full transition-all duration-500 disabled:cursor-not-allowed ${
                  index === currentIndex
                    ? 'w-6 lg:w-8 bg-white shadow-lg'
                    : 'w-1.5 lg:w-2 bg-white/50 hover:bg-white/75'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Thumbnails */}
        <div className="mt-6 flex gap-3 overflow-x-auto pb-2 px-2">
          {posts.map((post, index) => (
            <button
              key={post.id}
              onClick={() => goToSlide(index)}
              className={`flex-shrink-0 transition-all ${
                index === currentIndex
                  ? 'ring-4 ring-blue-500 scale-105'
                  : 'ring-2 ring-slate-300 opacity-60 hover:opacity-100'
              } rounded-lg overflow-hidden`}
            >
              <img
                src={post.image}
                alt={post.author}
                className="w-20 h-20 object-cover"
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
