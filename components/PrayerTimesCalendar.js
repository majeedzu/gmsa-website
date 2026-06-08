'use html';
'use client';

import { useState, useEffect } from 'react';
import { Clock, MapPin, Calendar, Compass } from 'lucide-react';

// Hardcoded fallback times for Ho, Ghana (in case API is unavailable)
const DEFAULT_TIMINGS = {
  Fajr: '04:58',
  Sunrise: '06:11',
  Dhuhr: '12:18',
  Asr: '15:38',
  Maghrib: '18:24',
  Isha: '19:34'
};

const DEFAULT_HIJRI = {
  day: '22',
  month: 'Dhu al-Hijjah',
  year: '1447'
};

export default function PrayerTimesCalendar() {
  const [timings, setTimings] = useState(DEFAULT_TIMINGS);
  const [dates, setDates] = useState({
    gregorian: '',
    hijri: ''
  });
  const [locationName, setLocationName] = useState('Ho, Volta Region (Default)');
  const [loading, setLoading] = useState(true);
  const [nextPrayer, setNextPrayer] = useState('');
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    // Gregorian initial load
    const today = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const formattedGregorian = today.toLocaleDateString('en-US', options);
    setDates(prev => ({ ...prev, gregorian: formattedGregorian }));

    // Detect Location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          setLocationName(`Detected Coordinates (${lat.toFixed(2)}°, ${lng.toFixed(2)}°)`);
          fetchPrayerTimes(lat, lng);
        },
        (error) => {
          console.warn('Geolocation denied or failed. Loading HTU default location (Ho).', error);
          // HTU Ho, Ghana Coordinates: Lat 6.6008, Lng 0.4713
          setLocationName('Ho Technical University (Volta Region)');
          fetchPrayerTimes(6.6008, 0.4713);
        }
      );
    } else {
      setLocationName('Ho Technical University (Volta Region)');
      fetchPrayerTimes(6.6008, 0.4713);
    }
  }, []);

  // Compute Next Prayer
  useEffect(() => {
    if (!timings) return;

    const interval = setInterval(() => {
      const now = new Date();
      const currentMinutes = now.getHours() * 60 + now.getMinutes();
      
      const list = [
        { name: 'Fajr', time: timings.Fajr },
        { name: 'Sunrise', time: timings.Sunrise },
        { name: 'Dhuhr', time: timings.Dhuhr },
        { name: 'Asr', time: timings.Asr },
        { name: 'Maghrib', time: timings.Maghrib },
        { name: 'Isha', time: timings.Isha }
      ];

      // Convert times to minutes
      const parsedList = list.map(item => {
        const [h, m] = item.time.split(':').map(Number);
        return { name: item.name, totalMinutes: h * 60 + m };
      });

      // Find next prayer
      let upcoming = parsedList.find(p => p.totalMinutes > currentMinutes);
      let isNextDay = false;

      if (!upcoming) {
        // If all prayers passed, next is tomorrow's Fajr
        upcoming = parsedList[0];
        isNextDay = true;
      }

      setNextPrayer(upcoming.name);

      // Time difference calculation
      let diff = 0;
      if (isNextDay) {
        diff = (1440 - currentMinutes) + upcoming.totalMinutes;
      } else {
        diff = upcoming.totalMinutes - currentMinutes;
      }

      const hrs = Math.floor(diff / 60);
      const mins = diff % 60;
      setTimeLeft(`${hrs > 0 ? `${hrs}h ` : ''}${mins}m`);
    }, 1000);

    return () => clearInterval(interval);
  }, [timings]);

  const fetchPrayerTimes = async (lat, lng) => {
    try {
      const res = await fetch(`https://api.aladhan.com/v1/timings?latitude=${lat}&longitude=${lng}&method=3`);
      const payload = await res.json();
      
      if (payload && payload.data) {
        const apiTimings = payload.data.timings;
        // Filter key timings
        setTimings({
          Fajr: apiTimings.Fajr,
          Sunrise: apiTimings.Sunrise,
          Dhuhr: apiTimings.Dhuhr,
          Asr: apiTimings.Asr,
          Maghrib: apiTimings.Maghrib,
          Isha: apiTimings.Isha
        });

        // Parse Hijri date
        const hijri = payload.data.date.hijri;
        const formattedHijri = `${hijri.day} ${hijri.month.en} ${hijri.year} AH`;
        setDates(prev => ({ ...prev, hijri: formattedHijri }));
      }
    } catch (e) {
      console.error('Failed to fetch prayer times from Aladhan API. Using offline defaults.', e);
      // Construct fallback Hijri string
      setDates(prev => ({
        ...prev,
        hijri: `${DEFAULT_HIJRI.day} ${DEFAULT_HIJRI.month} ${DEFAULT_HIJRI.year} AH`
      }));
    } finally {
      setLoading(false);
    }
  };

  const getHijriDate = () => {
    if (dates.hijri) return dates.hijri;
    return `${DEFAULT_HIJRI.day} ${DEFAULT_HIJRI.month} ${DEFAULT_HIJRI.year} AH`;
  };

  return (
    <section className="py-12 bg-background dark:bg-light-gray/2">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Calendar and Location Header Banner */}
        <div className="bg-gradient-to-r from-primary to-secondary text-white rounded-2xl p-6 sm:p-8 shadow-lg mb-8 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="flex items-center space-x-4">
            <span className="p-3 bg-white/10 rounded-xl">
              <Calendar className="h-7 w-7 text-gold" />
            </span>
            <div>
              <p className="text-xs text-white/80 font-bold tracking-widest uppercase">Islamic & Gregorian Calendar</p>
              <h2 className="text-xl sm:text-2xl font-bold flex flex-wrap gap-x-2 items-center">
                <span>{dates.gregorian}</span>
                <span className="text-gold">•</span>
                <span className="text-white/95 text-lg font-medium">{getHijriDate()}</span>
              </h2>
            </div>
          </div>

          <div className="flex items-center space-x-2 bg-white/10 px-4 py-2 rounded-lg border border-white/10 text-sm">
            <MapPin className="h-4 w-4 text-gold" />
            <span className="font-semibold">{locationName}</span>
          </div>
        </div>

        {/* Dynamic Prayer Times Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {Object.entries(timings).map(([prayer, time]) => {
            const isNext = prayer === nextPrayer;
            return (
              <div
                key={prayer}
                className={`rounded-xl p-5 border transition-all duration-300 text-center relative ${
                  isNext
                    ? 'bg-primary/5 dark:bg-secondary/5 border-primary dark:border-secondary shadow-md scale-105 z-10'
                    : 'bg-card-bg border-border-color hover:border-gray-300 dark:hover:border-zinc-700'
                }`}
              >
                {/* Active Highlight Badge */}
                {isNext && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary dark:bg-secondary text-white dark:text-black text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider shadow">
                    Next: {timeLeft}
                  </span>
                )}
                
                <p className="text-xs text-muted font-bold tracking-wider uppercase mb-2">
                  {prayer}
                </p>
                <p className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
                  {time}
                </p>
                
                {/* Visual clock icon inside current/next prayer card */}
                <div className="mt-3 flex justify-center text-muted">
                  <Clock className={`h-4 w-4 ${isNext ? 'text-primary dark:text-secondary animate-pulse' : 'opacity-40'}`} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
