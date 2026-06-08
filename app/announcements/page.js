'use html';
'use client';

import { useState, useEffect } from 'react';
import { Bell, Search, Calendar, Download, FileText } from 'lucide-react';
import { db } from '../../lib/db';

export default function Announcements() {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    db.getAnnouncements().then(data => {
      setAnnouncements(data);
      setLoading(false);
    });
  }, []);

  const filteredList = announcements.filter(ann => 
    ann.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    ann.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-background min-h-screen py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="text-xs font-bold text-primary dark:text-secondary uppercase tracking-widest bg-primary/10 dark:bg-secondary/10 px-3 py-1 rounded-full">
            Bulletin Board
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-foreground tracking-tight">
            Official Announcements
          </h1>
          <p className="text-muted text-sm sm:text-base">
            Stay informed with the latest updates, circulars, and instructions from the GMSA-HTU Executive Secretariat.
          </p>
          <div className="h-1 w-20 bg-gold rounded mx-auto" />
        </div>

        {/* Search Bar */}
        <div className="flex justify-end items-center max-w-md ml-auto">
          <div className="relative w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
            <input
              type="text"
              placeholder="Search announcements..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-card-bg text-foreground placeholder-zinc-500 text-sm pl-10 pr-4 py-2.5 rounded-xl border border-border-color focus:outline-none focus:border-primary w-full shadow-sm"
            />
          </div>
        </div>

        {/* Announcements Stack */}
        {loading ? (
          <div className="space-y-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-44 bg-gray-150 dark:bg-gray-800 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : filteredList.length > 0 ? (
          <div className="space-y-6">
            {filteredList.map((ann) => (
              <div
                key={ann.id}
                className="bg-card-bg border border-border-color rounded-2xl overflow-hidden hover:border-primary/40 hover:shadow-md transition-all p-6 sm:p-8 flex flex-col md:flex-row gap-6 items-stretch"
              >
                {/* Optional Announcement Image */}
                {ann.image_url && (
                  <div className="w-full md:w-64 h-48 md:h-auto shrink-0 relative rounded-xl overflow-hidden border border-border-color/60 bg-zinc-100">
                    <img
                      src={ann.image_url}
                      alt={ann.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                {/* Text Content */}
                <div className="flex-grow flex flex-col justify-between space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2 text-xs text-muted font-bold">
                      <Calendar className="h-3.5 w-3.5 text-primary" />
                      <span>
                        {new Date(ann.created_at).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}
                      </span>
                    </div>
                    
                    <h3 className="text-xl font-bold text-foreground leading-tight">
                      {ann.title}
                    </h3>
                    
                    <p className="text-foreground/85 text-sm sm:text-base leading-relaxed whitespace-pre-line">
                      {ann.content}
                    </p>
                  </div>

                  {/* Attachment Section */}
                  {ann.pdf_url && (
                    <div className="pt-2 flex flex-wrap gap-2">
                      <a
                        href={ann.pdf_url}
                        download
                        className="inline-flex items-center space-x-2 px-4 py-2 bg-primary/10 hover:bg-primary text-primary hover:text-white dark:bg-secondary/10 dark:text-secondary dark:hover:bg-secondary dark:hover:text-black rounded-lg text-xs font-bold transition-all border border-transparent shadow-sm"
                      >
                        <Download className="h-4 w-4" />
                        <span>Download Circular Documents</span>
                      </a>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 border border-dashed border-border-color rounded-2xl bg-card-bg space-y-4 max-w-md mx-auto">
            <Bell className="h-10 w-10 text-muted mx-auto animate-bounce" />
            <div className="space-y-1">
              <h3 className="text-base font-bold text-foreground">No announcements found</h3>
              <p className="text-muted text-xs px-6">
                No matching bulletin listings exist. Please check back later for updates.
              </p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
