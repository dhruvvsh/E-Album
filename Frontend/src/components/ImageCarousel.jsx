import { useState } from 'react';
import { ChevronLeft, ChevronRight, Heart, MessageCircle, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { ScrollArea } from './ui/scroll-area';

export function ImageCarousel({ images }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [likes, setLikes] = useState(images.map(() => false));
  const [likeCounts, setLikeCounts] = useState(images.map(() => Math.floor(Math.random() * 100)));
  const [comments, setComments] = useState(images.map(() => [
    { id: 1, author: 'John Doe', text: 'Beautiful capture!', timestamp: '2h ago' },
    { id: 2, author: 'Jane Smith', text: 'Love this perspective!', timestamp: '5h ago' },
  ]));
  const [commentText, setCommentText] = useState('');
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const getPrevIndex = () => {
    return currentIndex === 0 ? images.length - 1 : currentIndex - 1;
  };

  const getNextIndex = () => {
    return currentIndex === images.length - 1 ? 0 : currentIndex + 1;
  };

  const toggleLike = () => {
    const newLikes = [...likes];
    const newLikeCounts = [...likeCounts];
    
    if (newLikes[currentIndex]) {
      newLikes[currentIndex] = false;
      newLikeCounts[currentIndex] -= 1;
    } else {
      newLikes[currentIndex] = true;
      newLikeCounts[currentIndex] += 1;
    }
    
    setLikes(newLikes);
    setLikeCounts(newLikeCounts);
  };

  const addComment = () => {
    if (commentText.trim() === '') return;
    
    const newComments = [...comments];
    const newComment = {
      id: Date.now(),
      author: 'You',
      text: commentText,
      timestamp: 'Just now'
    };
    
    newComments[currentIndex] = [newComment, ...newComments[currentIndex]];
    setComments(newComments);
    setCommentText('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      addComment();
    }
  };

  return (
    <div className="relative w-full h-screen flex flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 px-4 sm:px-8">
      {/* Images Container */}
      <div className="relative w-full max-w-7xl h-[70vh] flex items-center justify-center mb-16">
        {/* Previous Image - Left Side */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`prev-${getPrevIndex()}`}
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 0.3, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.5 }}
            className="hidden lg:block absolute left-0 w-[20vw] max-w-[280px] h-[50vh] max-h-[400px]"
            style={{ transform: 'translateX(2rem)' }}
          >
            <ImageWithFallback
              src={images[getPrevIndex()]}
              alt={`Image ${getPrevIndex() + 1}`}
              className="w-full h-full object-cover rounded-xl shadow-xl"
            />
          </motion.div>
        </AnimatePresence>

        {/* Current Image - Center */}
        <div className="relative z-10 w-full max-w-[800px] h-[60vh] max-h-[600px] mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={`current-${currentIndex}`}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.5 }}
              className="w-full h-full"
            >
              <ImageWithFallback
                src={images[currentIndex]}
                alt={`Image ${currentIndex + 1}`}
                className="w-full h-full object-cover rounded-2xl shadow-2xl"
              />
            </motion.div>
          </AnimatePresence>
          
          {/* Interaction Buttons Overlay */}
          <div className="absolute bottom-6 left-6 right-6 flex items-center gap-3 z-30">
            {/* Like Button */}
            <button
              onClick={toggleLike}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/95 hover:bg-white shadow-lg transition-all duration-200 hover:scale-105 backdrop-blur-sm"
            >
              <Heart 
                className={`w-5 h-5 transition-colors ${
                  likes[currentIndex] 
                    ? 'fill-red-500 text-red-500' 
                    : 'text-gray-700'
                }`}
              />
              <span className="text-gray-800">{likeCounts[currentIndex]}</span>
            </button>

            {/* Comment Button */}
            <Dialog open={isCommentsOpen} onOpenChange={setIsCommentsOpen}>
              <DialogTrigger asChild>
                <button className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/95 hover:bg-white shadow-lg transition-all duration-200 hover:scale-105 backdrop-blur-sm">
                  <MessageCircle className="w-5 h-5 text-gray-700" />
                  <span className="text-gray-800">{comments[currentIndex].length}</span>
                </button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[550px] max-h-[85vh]">
                <DialogHeader>
                  <DialogTitle>Comments</DialogTitle>
                  <DialogDescription>
                    View and add comments for this image.
                  </DialogDescription>
                </DialogHeader>
                
                {/* Comments List */}
                <ScrollArea className="h-[350px] pr-4 -mx-1">
                  <div className="space-y-5 px-1">
                    {comments[currentIndex].length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-12 text-center">
                        <MessageCircle className="w-12 h-12 text-gray-300 mb-3" />
                        <p className="text-gray-500">No comments yet. Be the first to comment!</p>
                      </div>
                    ) : (
                      comments[currentIndex].map((comment) => (
                        <div key={comment.id} className="space-y-2 pb-4 border-b last:border-0 last:pb-0">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white flex-shrink-0">
                              {comment.author[0].toUpperCase()}
                            </div>
                            <div className="flex items-center gap-2 min-w-0">
                              <span className="text-gray-900 truncate">{comment.author}</span>
                              <span className="text-gray-400 flex-shrink-0">·</span>
                              <span className="text-gray-500 flex-shrink-0">{comment.timestamp}</span>
                            </div>
                          </div>
                          <p className="text-gray-700 pl-10">{comment.text}</p>
                        </div>
                      ))
                    )}
                  </div>
                </ScrollArea>

                {/* Add Comment Input */}
                <div className="flex gap-2 pt-4 border-t mt-2">
                  <Input
                    placeholder="Add a comment..."
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="flex-1"
                  />
                  <Button onClick={addComment} size="icon" disabled={!commentText.trim()}>
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Next Image - Right Side */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`next-${getNextIndex()}`}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 0.3, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            transition={{ duration: 0.5 }}
            className="hidden lg:block absolute right-0 w-[20vw] max-w-[280px] h-[50vh] max-h-[400px]"
            style={{ transform: 'translateX(-2rem)' }}
          >
            <ImageWithFallback
              src={images[getNextIndex()]}
              alt={`Image ${getNextIndex() + 1}`}
              className="w-full h-full object-cover rounded-xl shadow-xl"
            />
          </motion.div>
        </AnimatePresence>

        {/* Navigation Button - Left */}
        <button
          onClick={goToPrevious}
          className="absolute left-0 sm:left-4 z-20 p-3 sm:p-4 rounded-full bg-white/90 hover:bg-white shadow-lg transition-all duration-200 hover:scale-110"
          aria-label="Previous image"
        >
          <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 text-gray-800" />
        </button>

        {/* Navigation Button - Right */}
        <button
          onClick={goToNext}
          className="absolute right-0 sm:right-4 z-20 p-3 sm:p-4 rounded-full bg-white/90 hover:bg-white shadow-lg transition-all duration-200 hover:scale-110"
          aria-label="Next image"
        >
          <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 text-gray-800" />
        </button>
      </div>

      {/* Indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2.5 z-20 bg-white/80 backdrop-blur-sm px-4 py-2.5 rounded-full shadow-lg">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`rounded-full transition-all duration-300 ${
              index === currentIndex 
                ? 'bg-gray-800 w-8 h-2.5' 
                : 'bg-gray-400 hover:bg-gray-600 w-2.5 h-2.5'
            }`}
            aria-label={`Go to image ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
