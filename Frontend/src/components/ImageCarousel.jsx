import { useState, useEffect, useCallback } from 'react'
import { ChevronLeft, ChevronRight, Star, X } from 'lucide-react'
import { motion } from 'framer-motion'
import { ImageWithFallback } from './figma/ImageWithFallback'
import { Button } from './ui/button'
import { useAppContext } from './AppContext.jsx'

export function ImageCarousel({ 
  images, 
  tripMemories = [], 
  initialIndex = 0, 
  onClose 
}) {
  const { handleToggleFavorite } = useAppContext()
  const [currentIndex, setCurrentIndex] = useState(initialIndex)
  
  const currentMemory = tripMemories[currentIndex]

  const goToPrevious = useCallback(() => {
    setCurrentIndex((prev) => prev === 0 ? images.length - 1 : prev - 1)
  }, [images.length])

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => prev === images.length - 1 ? 0 : prev + 1)
  }, [images.length])

  const toggleFavorite = useCallback(() => {
    if (currentMemory) {
      console.log('⭐ FAVORITE TOGGLE:', currentMemory.id)
      handleToggleFavorite(currentMemory.id)
    }
  }, [currentMemory, handleToggleFavorite])

  // Keyboard navigation
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'ArrowLeft') goToPrevious()
      if (e.key === 'ArrowRight') goToNext()
      if (e.key === 'Escape') onClose?.()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [goToPrevious, goToNext, onClose])

  const getPrevIndex = () => currentIndex === 0 ? images.length - 1 : currentIndex - 1
  const getNextIndex = () => currentIndex === images.length - 1 ? 0 : currentIndex + 1

  return (
    <>
      {/* BACKDROP */}
      <div 
        className="fixed inset-0 z-[9998] bg-black/95 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* CAROUSEL CONTENT */}
      <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center p-4 overflow-hidden">
        {/* CLOSE BUTTON */}
        <Button
          onClick={onClose}
          className="absolute top-6 right-6 z-[10000] bg-white/30 hover:bg-white/50 text-white h-14 w-14 rounded-2xl backdrop-blur-sm border-white/20"
        >
          <X className="h-7 w-7" />
        </Button>

        {/* MAIN CAROUSEL SECTION */}
        <div className="relative w-full h-[85vh] flex items-center justify-center gap-8">
          
          {/* LEFT SIDE IMAGE - SMALL */}
          <motion.div
            className="hidden xl:block absolute left-0 w-32 h-48 flex-shrink-0"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 0.3, x: 0 }}
            transition={{ duration: 0.4 }}
          >
            <ImageWithFallback
              src={images[getPrevIndex()]}
              alt="Previous"
              className="w-full h-full object-cover rounded-xl shadow-2xl"
            />
          </motion.div>

          {/* MAIN IMAGE - CENTER - NO STRETCHING */}
          <div className="relative flex-1 max-w-3xl h-full flex items-center justify-center">
            <motion.div
              key={`carousel-${currentIndex}`}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="w-full h-full flex items-center justify-center"
            >
              <ImageWithFallback
                src={images[currentIndex]}
                alt={`Image ${currentIndex + 1}`}
                className="max-w-full max-h-full object-contain rounded-3xl shadow-2xl"
              />
            </motion.div>
          </div>

          {/* RIGHT SIDE IMAGE - SMALL */}
          <motion.div
            className="hidden xl:block absolute right-0 w-32 h-48 flex-shrink-0"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 0.3, x: 0 }}
            transition={{ duration: 0.4 }}
          >
            <ImageWithFallback
              src={images[getNextIndex()]}
              alt="Next"
              className="w-full h-full object-cover rounded-xl shadow-2xl"
            />
          </motion.div>

          {/* NAVIGATION ARROWS */}
          <button
            onClick={goToPrevious}
            className="absolute left-4 z-[10000] p-4 rounded-full bg-white/90 hover:bg-white shadow-2xl hover:scale-110 transition-all w-16 h-16 flex items-center justify-center"
            aria-label="Previous"
          >
            <ChevronLeft className="w-8 h-8 text-gray-800" />
          </button>
          
          <button
            onClick={goToNext}
            className="absolute right-4 z-[10000] p-4 rounded-full bg-white/90 hover:bg-white shadow-2xl hover:scale-110 transition-all w-16 h-16 flex items-center justify-center"
            aria-label="Next"
          >
            <ChevronRight className="w-8 h-8 text-gray-800" />
          </button>
        </div>

        {/* BOTTOM CONTROLS */}
        <div className="flex flex-col items-center gap-6 w-full mt-8">
          {/* INDICATOR DOTS */}
          <div className="flex gap-2.5 bg-white/90 backdrop-blur-sm px-6 py-3 rounded-full shadow-xl">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`rounded-full transition-all duration-300 ${
                  index === currentIndex 
                    ? 'bg-black w-10 h-3 shadow-lg' 
                    : 'bg-gray-400 hover:bg-gray-600 w-3 h-3'
                }`}
              />
            ))}
          </div>

          {/* MEMORY CAPTION + INFO */}
          {currentMemory && (
            <motion.div 
              className="bg-white/95 backdrop-blur-sm px-8 py-6 rounded-3xl shadow-2xl max-w-2xl w-full"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              key={`info-${currentIndex}`}
            >
              {/* HEADER - FAVORITE BUTTON */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex-1" />
                <button
                  onClick={toggleFavorite}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-all"
                  title="Add to favorites"
                >
                  <Star 
                    className={`w-6 h-6 transition-all ${
                      currentMemory?.isFavoritedByUser 
                        ? 'fill-yellow-400 text-yellow-400 scale-110' 
                        : 'text-gray-400 hover:text-gray-600'
                    }`}
                  />
                </button>
              </div>

              {/* CAPTION - STORY/NARRATIVE (Italicized) */}
              <h3 className="text-2xl font-bold text-gray-900 mb-3 italic">
                "{currentMemory.caption || currentMemory.description}"
              </h3>

              {/* METADATA */}
              <div className="flex flex-col gap-2 text-sm text-gray-600 pt-4 border-t">
                {currentMemory.location && (
                  <span>📍 {currentMemory.location}</span>
                )}
                <span>📅 {new Date(currentMemory.timestamp).toLocaleDateString()}</span>
                <span>📷 by {currentMemory.author?.name}</span>
              </div>

              {/* COUNTER */}
              <div className="text-center mt-4 text-gray-500 text-sm">
                {currentIndex + 1} of {images.length}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </>
  )
}
