'use html';
'use client';

import { useState, useEffect } from 'react';
import { ImageIcon, X, ZoomIn, Download, Info } from 'lucide-react';
import { db } from '../../lib/db';

const CATEGORIES = [
  'All',
  'Ramadan',
  'Eid',
  'Conferences',
  'Seminars',
  'Community Service',
  'General Activities'
];

export default function Gallery() {
  const [items, setItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(null);

  useEffect(() => {
    db.getGallery().then(data => {
      setItems(data);
      setLoading(false);
    });
  }, []);

  const filteredItems = selectedCategory === 'All'
    ? items
    : items.filter(item => item.category === selectedCategory);

  return (
    <div className="bg-background min-h-screen py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="text-xs font-bold text-primary dark:text-secondary uppercase tracking-widest bg-primary/10 dark:bg-secondary/10 px-3 py-1 rounded-full">
            Photo Gallery
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-foreground tracking-tight">
            GMSA-HTU Photo Gallery
          </h1>
          <p className="text-muted text-sm sm:text-base">
            Moments, events, and community activities captured across our various activities.
          </p>
          <div className="h-1 w-20 bg-gold rounded mx-auto" />
        </div>

        {/* Category Filter Buttons */}
        <div className="flex flex-wrap gap-2 justify-center py-4 border-b border-border-color">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 text-xs sm:text-sm font-bold rounded-full transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-primary dark:bg-secondary text-white dark:text-black shadow'
                  : 'bg-light-gray dark:bg-muted-bg text-muted hover:text-foreground'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="h-64 bg-gray-150 dark:bg-gray-800 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                onClick={() => setActiveImage(item)}
                className="bg-card-bg border border-border-color rounded-xl overflow-hidden shadow-sm hover:shadow-md hover:border-primary/40 transition-all duration-300 relative group cursor-pointer aspect-video"
              >
                <img
                  src={item.image_url}
                  alt={item.category}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                
                {/* Dark overlay showing on hover */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-4">
                  <span className="self-start text-[10px] font-bold text-black bg-gold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                    {item.category}
                  </span>
                  <div className="flex justify-between items-center text-white">
                    <span className="text-xs font-semibold">GMSA HTU</span>
                    <ZoomIn className="h-5 w-5" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 border border-dashed border-border-color rounded-xl bg-card-bg max-w-md mx-auto space-y-4">
            <ImageIcon className="h-10 w-10 text-muted mx-auto" />
            <div className="space-y-1">
              <h3 className="text-base font-bold text-foreground">No photos found</h3>
              <p className="text-muted text-xs px-6">
                There are no photos uploaded in the '{selectedCategory}' category yet.
              </p>
            </div>
          </div>
        )}

        {/* Lightbox Modal */}
        {activeImage && (
          <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4 animate-fade-in">
            {/* Close trigger */}
            <button
              onClick={() => setActiveImage(null)}
              className="absolute top-6 right-6 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white cursor-pointer transition-colors"
            >
              <X className="h-6 w-6" />
            </button>

            {/* Modal Box */}
            <div className="max-w-4xl max-h-[80vh] flex flex-col items-center space-y-4 relative">
              <img
                src={activeImage.image_url}
                alt={activeImage.category}
                className="max-w-full max-h-[70vh] object-contain rounded-lg shadow-2xl border border-zinc-800"
              />
              
              <div className="flex justify-between items-center w-full text-white px-2">
                <div>
                  <span className="text-xs font-bold uppercase tracking-widest text-gold bg-gold/15 px-3 py-1 rounded-full border border-gold/20 inline-block mb-1">
                    {activeImage.category}
                  </span>
                  <p className="text-[10px] text-zinc-400">Ghana Muslim Students' Association - Ho Technical University</p>
                </div>
                <a
                  href={activeImage.image_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-1.5 px-4 py-2 bg-primary text-white rounded-lg text-xs font-bold hover:bg-primary/95 transition-colors"
                >
                  <Download className="h-4 w-4" />
                  <span>Open URL</span>
                </a>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
