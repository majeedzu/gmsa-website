'use html';
'use client';

import { useState, useEffect } from 'react';
import { BookOpen, HelpCircle } from 'lucide-react';
import { db } from '../lib/db';

export default function DailyQuranHadith() {
  const [verse, setVerse] = useState(null);
  const [hadith, setHadith] = useState(null);

  useEffect(() => {
    // Deterministic Day of Year index: 0 to 365
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 0);
    const diff = now - start;
    const oneDay = 1000 * 60 * 60 * 24;
    const dayOfYear = Math.floor(diff / oneDay);

    // Fetch and rotate Quran Verses
    db.getQuranVerses().then(verses => {
      if (verses && verses.length > 0) {
        const index = dayOfYear % verses.length;
        setVerse(verses[index]);
      }
    });

    // Fetch and rotate Hadiths
    db.getHadiths().then(hadithsList => {
      if (hadithsList && hadithsList.length > 0) {
        const index = dayOfYear % hadithsList.length;
        setHadith(hadithsList[index]);
      }
    });
  }, []);

  return (
    <section className="py-12 bg-light-gray dark:bg-card-bg/40 border-y border-border-color">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Daily Quran Verse Card */}
          <div className="bg-background dark:bg-card-bg border border-border-color rounded-xl p-6 sm:p-8 shadow-sm flex flex-col justify-between relative overflow-hidden group hover:border-primary/50 transition-all duration-300">
            {/* Islamic motif watermark (top-right decorative circle) */}
            <div className="absolute -top-10 -right-10 w-28 h-28 bg-primary/5 dark:bg-secondary/5 rounded-full flex items-center justify-center text-primary/10 dark:text-secondary/10 font-bold text-5xl select-none">
              ع
            </div>
            
            <div>
              <div className="flex items-center space-x-2.5 mb-6">
                <span className="p-2 bg-primary/10 dark:bg-secondary/10 text-primary dark:text-secondary rounded-lg">
                  <BookOpen className="h-5 w-5" />
                </span>
                <h3 className="text-lg font-bold text-foreground">Daily Quran Verse</h3>
              </div>
              
              {verse ? (
                <div className="space-y-6">
                  {/* Arabic text with beautiful font styling */}
                  <p 
                    className="text-2xl sm:text-3xl font-semibold text-right leading-loose text-primary dark:text-secondary tracking-wide select-all" 
                    dir="rtl"
                    style={{ fontFamily: "'Noto Naskh Arabic', 'Scheherazade New', Georgia, serif" }}
                  >
                    {verse.arabic_text}
                  </p>
                  {/* English Translation */}
                  <p className="text-foreground/90 italic text-sm sm:text-base leading-relaxed pl-3 border-l-2 border-gold">
                    "{verse.english_translation}"
                  </p>
                </div>
              ) : (
                <div className="animate-pulse space-y-4">
                  <div className="h-8 bg-gray-200 dark:bg-gray-800 rounded w-full"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-3/4"></div>
                </div>
              )}
            </div>
            
            {verse && (
              <div className="mt-8 flex justify-between items-center text-xs text-muted font-semibold border-t border-border-color/60 pt-4">
                <span>Surah {verse.surah_name}</span>
                <span className="px-2 py-0.5 bg-light-gray dark:bg-muted-bg rounded-md">Verse {verse.verse_number}</span>
              </div>
            )}
          </div>

          {/* Daily Hadith Card */}
          <div className="bg-background dark:bg-card-bg border border-border-color rounded-xl p-6 sm:p-8 shadow-sm flex flex-col justify-between relative overflow-hidden group hover:border-primary/50 transition-all duration-300">
            {/* Watermark */}
            <div className="absolute -top-10 -right-10 w-28 h-28 bg-gold/5 rounded-full flex items-center justify-center text-gold/10 font-bold text-5xl select-none">
              ح
            </div>

            <div>
              <div className="flex items-center space-x-2.5 mb-6">
                <span className="p-2 bg-gold/10 text-gold rounded-lg">
                  <BookOpen className="h-5 w-5" />
                </span>
                <h3 className="text-lg font-bold text-foreground">Daily Hadith</h3>
              </div>

              {hadith ? (
                <div className="space-y-4">
                  <p className="text-foreground/95 text-sm sm:text-base leading-relaxed pl-3 border-l-2 border-primary">
                    "{hadith.hadith_text}"
                  </p>
                </div>
              ) : (
                <div className="animate-pulse space-y-4">
                  <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-full"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-5/6"></div>
                </div>
              )}
            </div>

            {hadith && (
              <div className="mt-8 flex justify-between items-center text-xs text-muted font-semibold border-t border-border-color/60 pt-4">
                <span>{hadith.source}</span>
                <span className="px-2 py-0.5 bg-light-gray dark:bg-muted-bg rounded-md">{hadith.reference}</span>
              </div>
            )}
          </div>

        </div>
      </div>
    </section>
  );
}
