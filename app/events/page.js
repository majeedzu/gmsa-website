'use html';
'use client';

import { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, Clock, MapPin, Search, CalendarPlus } from 'lucide-react';
import { db } from '../../lib/db';

export default function Events() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('upcoming'); // 'upcoming' or 'past'
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    db.getEvents().then(data => {
      setEvents(data);
      setLoading(false);
    });
  }, []);

  const todayStr = new Date().toISOString().split('T')[0];

  // Separate and sort events
  const upcomingEvents = events
    .filter(e => e.event_date >= todayStr)
    .sort((a, b) => new Date(a.event_date) - new Date(b.event_date));

  const pastEvents = events
    .filter(e => e.event_date < todayStr)
    .sort((a, b) => new Date(b.event_date) - new Date(a.event_date));

  // Apply search filtering
  const filterBySearch = (list) => {
    if (!searchQuery) return list;
    return list.filter(e => 
      e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.venue.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const currentList = activeTab === 'upcoming' ? filterBySearch(upcomingEvents) : filterBySearch(pastEvents);

  return (
    <div className="bg-background min-h-screen py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="text-xs font-bold text-primary dark:text-secondary uppercase tracking-widest bg-primary/10 dark:bg-secondary/10 px-3 py-1 rounded-full">
            Events Board
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-foreground tracking-tight">
            GMSA-HTU Programs & Events
          </h1>
          <p className="text-muted text-sm sm:text-base">
            Participate in our upcoming spiritual halaqahs, campus conventions, Eid celebrations, and community outreach.
          </p>
          <div className="h-1 w-20 bg-gold rounded mx-auto" />
        </div>

        {/* Tab Controls and Search Bar */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-card-bg border border-border-color p-4 rounded-2xl shadow-sm">
          {/* Tabs */}
          <div className="flex space-x-2 w-full sm:w-auto bg-light-gray dark:bg-muted-bg p-1 rounded-xl">
            <button
              onClick={() => setActiveTab('upcoming')}
              className={`flex-1 sm:flex-initial px-6 py-2.5 text-sm font-bold rounded-lg transition-all cursor-pointer ${
                activeTab === 'upcoming'
                  ? 'bg-background text-primary dark:text-secondary shadow-sm'
                  : 'text-muted hover:text-foreground'
              }`}
            >
              Upcoming ({upcomingEvents.length})
            </button>
            <button
              onClick={() => setActiveTab('past')}
              className={`flex-1 sm:flex-initial px-6 py-2.5 text-sm font-bold rounded-lg transition-all cursor-pointer ${
                activeTab === 'past'
                  ? 'bg-background text-primary dark:text-secondary shadow-sm'
                  : 'text-muted hover:text-foreground'
              }`}
            >
              Past / Archived ({pastEvents.length})
            </button>
          </div>

          {/* Search bar */}
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
            <input
              type="text"
              placeholder="Search events..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-light-gray dark:bg-muted-bg text-foreground placeholder-zinc-500 text-sm pl-10 pr-4 py-2.5 rounded-xl border border-transparent focus:outline-none focus:border-primary w-full transition-all"
            />
          </div>
        </div>

        {/* Events Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-96 bg-gray-150 dark:bg-gray-800 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : currentList.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {currentList.map((ev) => (
              <div
                key={ev.id}
                className="bg-card-bg border border-border-color rounded-2xl overflow-hidden hover:shadow-lg hover:border-primary/30 transition-all flex flex-col h-full group"
              >
                {/* Banner Image */}
                <div className="h-48 w-full bg-zinc-200 dark:bg-zinc-800 relative overflow-hidden shrink-0">
                  {ev.banner_url ? (
                    <img
                      src={ev.banner_url}
                      alt={ev.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-primary/5 text-primary text-sm font-semibold">
                      GMSA-HTU Event Banner
                    </div>
                  )}
                  {/* Category overlay indicating status */}
                  <span className={`absolute top-4 right-4 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                    activeTab === 'upcoming' 
                      ? 'bg-[#0F7A35] text-white shadow' 
                      : 'bg-zinc-600 text-white'
                  }`}>
                    {activeTab === 'upcoming' ? 'Scheduled' : 'Completed'}
                  </span>
                </div>

                {/* Content */}
                <div className="p-6 flex-grow flex flex-col justify-between space-y-6">
                  <div className="space-y-3">
                    <span className="text-[11px] text-primary dark:text-secondary font-bold uppercase tracking-widest bg-primary/10 dark:bg-secondary/10 px-3 py-1 rounded-md inline-block">
                      {new Date(ev.event_date).toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'long', year: 'numeric' })}
                    </span>
                    <h3 className="text-lg font-bold text-foreground leading-snug group-hover:text-primary dark:group-hover:text-secondary transition-colors">
                      {ev.title}
                    </h3>
                    <p className="text-foreground/80 text-sm leading-relaxed line-clamp-3">
                      {ev.description}
                    </p>
                  </div>

                  {/* Metadata Row */}
                  <div className="space-y-2 text-xs text-muted font-medium pt-4 border-t border-border-color/60">
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 shrink-0 text-primary dark:text-secondary" />
                      <span>{ev.event_time.substring(0, 5)} GMT</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4 shrink-0 text-primary dark:text-secondary" />
                      <span className="line-clamp-1">{ev.venue}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 border border-dashed border-border-color rounded-2xl bg-card-bg space-y-4 max-w-md mx-auto">
            <CalendarPlus className="h-10 w-10 text-muted mx-auto" />
            <div className="space-y-1">
              <h3 className="text-base font-bold text-foreground">No events found</h3>
              <p className="text-muted text-xs px-6">
                We couldn't find any events matching your criteria. Try adjusting your search term.
              </p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
