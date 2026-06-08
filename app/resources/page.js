'use html';
'use client';

import { useState, useEffect } from 'react';
import { BookOpen, Search, Download, FileText, ExternalLink, Bookmark } from 'lucide-react';
import { db } from '../../lib/db';

const SECTIONS = [
  { id: 'khutbah', label: 'Friday Khutbah Notes' },
  { id: 'quran', label: 'Quran Resources' },
  { id: 'hadith', label: 'Hadith Resources' },
  { id: 'articles', label: 'Islamic Articles' },
  { id: 'downloads', label: 'Download Center' }
];

export default function Resources() {
  const [khutbahs, setKhutbahs] = useState([]);
  const [activeTab, setActiveTab] = useState('khutbah');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    db.getKhutbahNotes().then(data => {
      setKhutbahs(data);
      setLoading(false);
    });
  }, []);

  const filteredKhutbahs = khutbahs.filter(k => 
    k.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (k.content && k.content.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="bg-background min-h-screen py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="text-xs font-bold text-primary dark:text-secondary uppercase tracking-widest bg-primary/10 dark:bg-secondary/10 px-3 py-1 rounded-full">
            Knowledge Center
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-foreground tracking-tight">
            Islamic Resources & Downloads
          </h1>
          <p className="text-muted text-sm sm:text-base">
            Access weekly Friday Khutbah summaries, authentic Qur'an & Hadith documents, and academic handbooks.
          </p>
          <div className="h-1 w-20 bg-gold rounded mx-auto" />
        </div>

        {/* Tab Controls and Search */}
        <div className="flex flex-col lg:flex-row gap-6 items-stretch">
          
          {/* Navigation Sidebar Tabs */}
          <div className="w-full lg:w-1/4 shrink-0 flex flex-col space-y-1">
            {SECTIONS.map((sec) => (
              <button
                key={sec.id}
                onClick={() => {
                  setActiveTab(sec.id);
                  setSearchQuery('');
                }}
                className={`w-full px-5 py-4 rounded-xl font-bold text-left text-sm flex items-center justify-between border cursor-pointer transition-all ${
                  activeTab === sec.id
                    ? 'bg-primary/5 dark:bg-secondary/5 border-primary text-primary dark:border-secondary dark:text-secondary shadow-sm'
                    : 'bg-card-bg border-border-color text-foreground/80 hover:bg-light-gray'
                }`}
              >
                <span>{sec.label}</span>
                <Bookmark className={`h-4 w-4 ${activeTab === sec.id ? 'opacity-100 fill-current' : 'opacity-30'}`} />
              </button>
            ))}
          </div>

          {/* Details Content Board */}
          <div className="w-full lg:w-3/4 bg-card-bg border border-border-color rounded-2xl p-6 sm:p-8 shadow-sm space-y-6 flex flex-col justify-between">
            <div>
              {/* Tab Header Banner */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-border-color pb-4 gap-4">
                <h2 className="text-xl font-extrabold text-foreground">
                  {SECTIONS.find(s => s.id === activeTab)?.label}
                </h2>
                
                {/* Search Bar for Khutbahs */}
                {activeTab === 'khutbah' && (
                  <div className="relative w-full sm:w-64">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
                    <input
                      type="text"
                      placeholder="Search notes..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="bg-light-gray dark:bg-muted-bg text-foreground placeholder-zinc-500 text-xs pl-9 pr-3 py-2 rounded-lg border border-transparent focus:outline-none focus:border-primary w-full"
                    />
                  </div>
                )}
              </div>

              {/* Dynamic tab contents */}
              <div className="pt-6">
                
                {/* 1. Friday Khutbah Notes */}
                {activeTab === 'khutbah' && (
                  loading ? (
                    <div className="space-y-4">
                      {[1, 2].map(i => (
                        <div key={i} className="h-28 bg-gray-150 dark:bg-gray-800 rounded-xl animate-pulse" />
                      ))}
                    </div>
                  ) : filteredKhutbahs.length > 0 ? (
                    <div className="space-y-4">
                      {filteredKhutbahs.map((k) => (
                        <div
                          key={k.id}
                          className="bg-background border border-border-color rounded-xl p-5 hover:border-primary/45 transition-colors flex flex-col sm:flex-row gap-4 justify-between items-start"
                        >
                          <div className="space-y-1 flex-grow">
                            <span className="text-[10px] text-muted font-bold block">
                              Sermon Date: {new Date(k.created_at).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                            </span>
                            <h3 className="text-base font-bold text-foreground">{k.title}</h3>
                            {k.content && (
                              <p className="text-foreground/80 text-xs sm:text-sm line-clamp-2 mt-1">
                                {k.content}
                              </p>
                            )}
                          </div>
                          
                          <a
                            href={k.pdf_url}
                            download
                            className="flex items-center space-x-1.5 px-4 py-2 bg-primary/10 hover:bg-primary text-primary hover:text-white dark:bg-secondary/10 dark:text-secondary dark:hover:bg-secondary dark:hover:text-black rounded-lg text-xs font-bold shrink-0 self-end sm:self-center transition-all shadow-sm"
                          >
                            <Download className="h-3.5 w-3.5" />
                            <span>Download PDF</span>
                          </a>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted text-sm italic">No Khutbah notes found matching search query.</p>
                  )
                )}

                {/* 2. Quran Resources */}
                {activeTab === 'quran' && (
                  <div className="space-y-6">
                    <p className="text-sm text-foreground/80 leading-relaxed">
                      Study, recite, and comprehend the Holy Qur'an with verified links and downloadable translations.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="border border-border-color rounded-xl p-5 bg-background hover:border-primary/40 transition-colors flex flex-col justify-between">
                        <div className="space-y-2 mb-4">
                          <h3 className="font-bold text-sm text-foreground">Quran.com Official</h3>
                          <p className="text-xs text-muted">Read, listen, and learn the Quran with multiple English translations, word-by-word meanings, and audio recitation.</p>
                        </div>
                        <a href="https://quran.com" target="_blank" rel="noopener noreferrer" className="text-xs text-primary dark:text-secondary font-bold hover:underline flex items-center space-x-1">
                          <span>Visit Website</span>
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </div>
                      <div className="border border-border-color rounded-xl p-5 bg-background hover:border-primary/40 transition-colors flex flex-col justify-between">
                        <div className="space-y-2 mb-4">
                          <h3 className="font-bold text-sm text-foreground">Tajweed Rules Guide (PDF)</h3>
                          <p className="text-xs text-muted">A comprehensive PDF manual explaining standard rules of Qur'anic recitation (Tajweed) with diagrams.</p>
                        </div>
                        <a href="/assets/docs/tajweed_rules_guide.pdf" download className="text-xs text-primary dark:text-secondary font-bold hover:underline flex items-center space-x-1">
                          <span>Download PDF Manual</span>
                          <Download className="h-3 w-3" />
                        </a>
                      </div>
                    </div>
                  </div>
                )}

                {/* 3. Hadith Resources */}
                {activeTab === 'hadith' && (
                  <div className="space-y-6">
                    <p className="text-sm text-foreground/80 leading-relaxed">
                      Access collections of Prophet Muhammad's (PBUH) traditions, statements, and approvals.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="border border-border-color rounded-xl p-5 bg-background hover:border-primary/40 transition-colors flex flex-col justify-between">
                        <div className="space-y-2 mb-4">
                          <h3 className="font-bold text-sm text-foreground">Sunnah.com Portal</h3>
                          <p className="text-xs text-muted">The leading database for search operations in Sahih al-Bukhari, Sahih Muslim, Sunan an-Nasa'i, and Riyad-us-Saliheen.</p>
                        </div>
                        <a href="https://sunnah.com" target="_blank" rel="noopener noreferrer" className="text-xs text-primary dark:text-secondary font-bold hover:underline flex items-center space-x-1">
                          <span>Explore Hadiths</span>
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </div>
                      <div className="border border-border-color rounded-xl p-5 bg-background hover:border-primary/40 transition-colors flex flex-col justify-between">
                        <div className="space-y-2 mb-4">
                          <h3 className="font-bold text-sm text-foreground">40 Hadith Nawawi</h3>
                          <p className="text-xs text-muted">Download Imam An-Nawawi's famous compilation of 40 essential Hadiths summarizing core theology and ethics.</p>
                        </div>
                        <a href="/assets/docs/40_hadith_nawawi.pdf" download className="text-xs text-primary dark:text-secondary font-bold hover:underline flex items-center space-x-1">
                          <span>Download Hadith Book</span>
                          <Download className="h-3 w-3" />
                        </a>
                      </div>
                    </div>
                  </div>
                )}

                {/* 4. Islamic Articles */}
                {activeTab === 'articles' && (
                  <div className="space-y-6">
                    <p className="text-sm text-foreground/80 leading-relaxed">
                      Read contemporary, scholarly articles discussing campus life, mental wellness, and ethics in modern society.
                    </p>
                    <div className="space-y-4">
                      <div className="border border-border-color rounded-xl p-5 bg-background hover:border-primary/40 transition-colors">
                        <span className="text-[10px] bg-primary/10 text-primary font-bold px-2 py-0.5 rounded uppercase">Ethics</span>
                        <h3 className="font-bold text-base text-foreground mt-2 mb-1">Maintaining Focus and Intention in Seekers of Knowledge</h3>
                        <p className="text-xs text-muted leading-relaxed mb-3">Exploring the integration of academic degrees with high Islamic ethical values. Practical guide for first-year students.</p>
                        <a href="#" className="text-xs text-primary dark:text-secondary font-bold hover:underline">Read Article</a>
                      </div>
                      <div className="border border-border-color rounded-xl p-5 bg-background hover:border-primary/40 transition-colors">
                        <span className="text-[10px] bg-gold/10 text-gold font-bold px-2 py-0.5 rounded uppercase">Worship</span>
                        <h3 className="font-bold text-base text-foreground mt-2 mb-1">The Significance of Dhikr (Remembrance) during Exams</h3>
                        <p className="text-xs text-muted leading-relaxed mb-3">How constant contemplation and trust (Tawakkul) in Allah helps ease student anxiety during test periods.</p>
                        <a href="#" className="text-xs text-primary dark:text-secondary font-bold hover:underline">Read Article</a>
                      </div>
                    </div>
                  </div>
                )}

                {/* 5. Download Center */}
                {activeTab === 'downloads' && (
                  <div className="space-y-6">
                    <p className="text-sm text-foreground/80 leading-relaxed">
                      Download forms, academic calendars, handouts, mosque circular schedules, and the GMSA constitution.
                    </p>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-4 bg-background border border-border-color rounded-xl hover:border-primary/40 transition-colors">
                        <div className="flex items-center space-x-3">
                          <FileText className="h-5 w-5 text-red-500" />
                          <div>
                            <p className="font-bold text-sm text-foreground">GMSA HTU Constitution</p>
                            <p className="text-[10px] text-muted">Official charter, rules, and guidelines of the branch.</p>
                          </div>
                        </div>
                        <a href="/assets/docs/gmsa_htu_constitution.pdf" download className="p-2 bg-light-gray dark:bg-muted-bg hover:bg-primary/10 text-primary rounded-lg transition-colors">
                          <Download className="h-4 w-4" />
                        </a>
                      </div>

                      <div className="flex items-center justify-between p-4 bg-background border border-border-color rounded-xl hover:border-primary/40 transition-colors">
                        <div className="flex items-center space-x-3">
                          <FileText className="h-5 w-5 text-blue-500" />
                          <div>
                            <p className="font-bold text-sm text-foreground">Mosque Hall Handout & Duas</p>
                            <p className="text-[10px] text-muted">Daily morning and evening supplications compiled for students.</p>
                          </div>
                        </div>
                        <a href="/assets/docs/morning_evening_adhkar.pdf" download className="p-2 bg-light-gray dark:bg-muted-bg hover:bg-primary/10 text-primary rounded-lg transition-colors">
                          <Download className="h-4 w-4" />
                        </a>
                      </div>
                    </div>
                  </div>
                )}

              </div>
            </div>
            
            {/* Disclaimer notice */}
            <div className="mt-8 pt-4 border-t border-border-color/60 text-[10px] text-muted flex items-start space-x-1.5 leading-relaxed">
              <BookOpen className="h-4 w-4 shrink-0 mt-0.5" />
              <span>All documents uploaded by the administrators undergo evaluation. For hardcopy requests or queries, please contact the GMSA Secretariat desk.</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
