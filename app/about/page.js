'use html';
'use client';

import { useState, useEffect } from 'react';
import { Shield, Target, Award, Users, BookOpen } from 'lucide-react';
import { db } from '../../lib/db';

export default function About() {
  const [executives, setExecutives] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    db.getExecutives().then(data => {
      setExecutives(data);
      setLoading(false);
    });
  }, []);

  const objectives = [
    "To unite all Muslim students at Ho Technical University under a single, cohesive brotherhood.",
    "To promote the study and practice of orthodox Islamic values, beliefs, and ethics.",
    "To facilitate congregational prayers, Islamic classes, and spiritual development programs.",
    "To coordinate welfare support and academic mentorship for Muslim students on campus.",
    "To build friendly, constructive relations with non-Muslim student unions and administration."
  ];

  return (
    <div className="bg-background min-h-screen py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* About Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="text-xs font-bold text-primary dark:text-secondary uppercase tracking-widest bg-primary/10 dark:bg-secondary/10 px-3 py-1 rounded-full">
            Our Identity
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-foreground tracking-tight">
            About GMSA-HTU
          </h1>
          <p className="text-muted text-sm sm:text-base">
            Discover the history, objectives, organizational structure, and leadership of the 
            Ghana Muslim Students' Association branch at Ho Technical University.
          </p>
          <div className="h-1 w-20 bg-gold rounded mx-auto" />
        </div>

        {/* 1. History Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center border border-border-color bg-card-bg rounded-2xl p-6 sm:p-10 shadow-sm">
          <div className="lg:col-span-7 space-y-6">
            <h2 className="text-2xl font-bold text-foreground">Our History</h2>
            <div className="h-1 w-12 bg-primary dark:bg-secondary rounded" />
            <p className="text-foreground/85 text-sm sm:text-base leading-relaxed">
              The Ghana Muslim Students' Association (GMSA) HTU branch was established to create a 
              structured platform for Muslim students to support one another in spiritual growth and academic 
              pursuits. Over the years, the branch has grown from a handful of dedicated members holding prayers 
              in host class rooms to a fully established student body with a central prayer hall (Mosque) and a 
              fully operating executive board.
            </p>
            <p className="text-foreground/85 text-sm sm:text-base leading-relaxed">
              Through the generosity of donors, patrons, and alumni, the association maintains daily services, 
              organizes educational seminars, and provides vital support to first-year students transitioning into 
              university life in the Volta Region of Ghana.
            </p>
          </div>
          <div className="lg:col-span-5 relative h-64 lg:h-80 w-full overflow-hidden rounded-xl border border-border-color">
            <div 
              className="absolute inset-0 bg-cover bg-center" 
              style={{ backgroundImage: `url('https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=500')` }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/30 to-black/10" />
          </div>
        </div>

        {/* 2. Mission & Vision & Values Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Mission Card */}
          <div className="bg-card-bg border border-border-color rounded-2xl p-6 sm:p-8 hover:border-primary/40 transition-colors shadow-sm space-y-4">
            <span className="p-3 bg-primary/10 dark:bg-secondary/10 text-primary dark:text-secondary rounded-xl inline-block">
              <Target className="h-6 w-6" />
            </span>
            <h2 className="text-xl font-bold text-foreground">Our Mission</h2>
            <p className="text-foreground/85 text-sm leading-relaxed">
              To empower Muslim students at Ho Technical University by providing comprehensive spiritual development, 
              promoting quality education, and building strong leadership capabilities based on the pure principles of 
              Al-Qur'an and Sunnah, thereby cultivating a prosperous society.
            </p>
          </div>

          {/* Vision Card */}
          <div className="bg-card-bg border border-border-color rounded-2xl p-6 sm:p-8 hover:border-gold/40 transition-colors shadow-sm space-y-4">
            <span className="p-3 bg-gold/10 text-gold rounded-xl inline-block">
              <Shield className="h-6 w-6" />
            </span>
            <h2 className="text-xl font-bold text-foreground">Our Vision</h2>
            <p className="text-foreground/85 text-sm leading-relaxed">
              To be a premier model student association that fosters exceptional academic achievements, outstanding 
              moral character, and serves as a vibrant light for Islamic knowledge and peaceful community service in 
              the Volta Region.
            </p>
          </div>
        </div>

        {/* 3. Objectives List */}
        <div className="bg-card-bg border border-border-color rounded-2xl p-6 sm:p-10 shadow-sm space-y-6">
          <h2 className="text-2xl font-bold text-foreground flex items-center space-x-2">
            <Award className="h-6 w-6 text-primary dark:text-secondary" />
            <span>Association Objectives</span>
          </h2>
          <div className="h-1 w-12 bg-gold rounded" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {objectives.map((obj, i) => (
              <div key={i} className="flex items-start space-x-3 text-sm sm:text-base text-foreground/85">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary text-xs font-bold mt-0.5">
                  {i + 1}
                </span>
                <p className="leading-relaxed">{obj}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 4. Organizational Structure Header */}
        <div className="bg-card-bg border border-border-color rounded-2xl p-6 sm:p-10 shadow-sm space-y-6">
          <h2 className="text-2xl font-bold text-foreground flex items-center space-x-2">
            <Users className="h-6 w-6 text-primary dark:text-secondary" />
            <span>Organizational Structure</span>
          </h2>
          <div className="h-1 w-12 bg-primary rounded" />
          <p className="text-foreground/85 text-sm sm:text-base leading-relaxed">
            The association operates under a hierarchical structure comprising the **Patrons Board** (advising faculty members), 
            the **General Assembly** (comprising all general student members), the **Executive Board** (elected officers leading 
            the branches), and the **Amira Wing** (managing affairs unique to female students). Special working committees (such 
            as organizing, education, and welfare committees) are created as needed to carry out tasks.
          </p>
        </div>

        {/* 5. Dynamic Executives Profiles Section */}
        <div className="space-y-8">
          <div className="text-center space-y-3">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground">
              Current Executive Committee
            </h2>
            <p className="text-muted text-sm max-w-xl mx-auto">
              Meet our dedicated leaders serving the association for this academic session.
            </p>
            <div className="h-1 w-12 bg-gold rounded mx-auto" />
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="h-80 bg-gray-150 dark:bg-gray-800 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : executives.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 justify-center">
              {executives.map((exec) => (
                <div
                  key={exec.id}
                  className="bg-card-bg border border-border-color rounded-2xl overflow-hidden hover:border-primary/40 hover:shadow-md transition-all flex flex-col h-full"
                >
                  <div className="h-56 bg-zinc-200 dark:bg-zinc-800 relative w-full shrink-0">
                    {exec.photo_url ? (
                      <img
                        src={exec.photo_url}
                        alt={exec.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-primary/10 text-primary font-bold text-3xl">
                        {exec.name[0]}
                      </div>
                    )}
                  </div>
                  <div className="p-4 flex-grow flex flex-col justify-between">
                    <div className="space-y-1">
                      <h3 className="text-sm font-bold text-foreground leading-snug line-clamp-1">{exec.name}</h3>
                      <p className="text-xs text-primary dark:text-secondary font-bold tracking-wider uppercase">{exec.position}</p>
                    </div>
                    {exec.bio && (
                      <p className="text-[11px] text-muted leading-relaxed line-clamp-3 mt-3 pt-3 border-t border-border-color/60">
                        {exec.bio}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center italic text-muted text-sm">No executive records found.</p>
          )}
        </div>

      </div>
    </div>
  );
}
