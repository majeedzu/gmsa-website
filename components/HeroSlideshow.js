'use html';
'use client';

import { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Play, Pause } from 'lucide-react';
import { db } from '../lib/db';

export default function HeroSlideshow() {
  const [slides, setSlides] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const timerRef = useRef(null);

  useEffect(() => {
    db.getSlideshow().then(data => {
      if (data && data.length > 0) {
        setSlides(data);
      }
    });
  }, []);

  useEffect(() => {
    if (isPlaying && slides.length > 1) {
      timerRef.current = setInterval(() => {
        handleNext();
      }, 5000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, currentIndex, slides]);

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? slides.length - 1 : prevIndex - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex === slides.length - 1 ? 0 : prevIndex + 1));
  };

  const handleDotClick = (index) => {
    setCurrentIndex(index);
  };

  if (slides.length === 0) {
    return (
      <div className="h-[60vh] min-h-[400px] w-full flex items-center justify-center bg-light-gray animate-pulse">
        <div className="text-center">
          <div className="h-8 w-48 bg-gray-300 rounded mb-4 mx-auto"></div>
          <div className="h-4 w-64 bg-gray-200 rounded mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-[65vh] min-h-[450px] lg:h-[75vh] w-full overflow-hidden group bg-[#020202]">
      {/* Slides */}
      {slides.map((slide, index) => {
        const isActive = index === currentIndex;
        return (
          <div
            key={slide.id || index}
            className={`absolute inset-0 w-full h-full transition-all duration-1000 ease-in-out ${
              isActive ? 'opacity-100 scale-100' : 'opacity-0 scale-105 pointer-events-none'
            }`}
          >
            {/* Background Image with Dark Overlay */}
            <div 
              className="absolute inset-0 bg-cover bg-center transition-all"
              style={{ backgroundImage: `url(${slide.image_url})` }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/30" />
            </div>

            {/* Content Container */}
            <div className="absolute inset-0 flex items-center justify-center text-center px-4 sm:px-6 lg:px-8">
              <div className="max-w-3xl transform transition-transform duration-1000 translate-y-0">
                <h1 className="text-3xl sm:text-5xl font-extrabold text-white leading-tight tracking-tight mb-4 drop-shadow-md">
                  {slide.title || 'Nurturing Faith & Brotherhood'}
                </h1>
                <p className="text-base sm:text-xl text-gray-200 mb-8 max-w-2xl mx-auto font-medium drop-shadow">
                  {slide.description || 'Ghana Muslim Students\' Association, Ho Technical University branch.'}
                </p>
                <div className="flex justify-center space-x-4">
                  <a
                    href="/about"
                    className="px-6 py-3 font-semibold text-white bg-primary hover:bg-primary/90 rounded-md shadow-lg transition-transform hover:scale-105"
                  >
                    Learn More
                  </a>
                  <a
                    href="/contact"
                    className="px-6 py-3 font-semibold text-primary-green bg-white hover:bg-gray-100 rounded-md shadow-lg transition-transform hover:scale-105"
                  >
                    Contact Secretariat
                  </a>
                </div>
              </div>
            </div>
          </div>
        );
      })}

      {/* Navigation Arrows */}
      <button
        onClick={handlePrev}
        className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/40 hover:bg-primary text-white cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"
        aria-label="Previous Slide"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>
      <button
        onClick={handleNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/40 hover:bg-primary text-white cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"
        aria-label="Next Slide"
      >
        <ChevronRight className="h-6 w-6" />
      </button>

      {/* Control Tools */}
      <div className="absolute bottom-6 right-6 flex items-center space-x-2 z-10">
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="p-2 rounded-full bg-black/40 hover:bg-black/60 text-white cursor-pointer transition-colors"
          aria-label={isPlaying ? 'Pause Slideshow' : 'Play Slideshow'}
        >
          {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
        </button>
      </div>

      {/* Indicators Dots */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-2.5 z-10">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => handleDotClick(index)}
            className={`w-3 h-3 rounded-full cursor-pointer transition-all duration-300 ${
              index === currentIndex 
                ? 'bg-primary dark:bg-secondary w-8' 
                : 'bg-white/40 hover:bg-white/70'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
