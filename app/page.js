import HeroSlideshow from '../components/HeroSlideshow';
import DailyQuranHadith from '../components/DailyQuranHadith';
import PrayerTimesCalendar from '../components/PrayerTimesCalendar';
import Link from 'next/link';
import { Calendar, Bell, Info, Mail } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Hero Slide Show */}
      <HeroSlideshow />
      
      {/* Quran & Hadith Widgets */}
      <DailyQuranHadith />

      {/* Prayer Times Section */}
      <PrayerTimesCalendar />

      {/* Main Content Grid: Quick Info & Quick Links */}
      <section className="py-16 bg-light-gray dark:bg-card-bg/20 border-t border-border-color">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="border border-border-color bg-card-bg rounded-2xl p-6 sm:p-10 shadow-sm max-w-4xl mx-auto text-center space-y-8">
            <div className="space-y-3">
              <h2 className="text-3xl font-extrabold text-foreground">Welcome to GMSA Ho Technical University</h2>
              <p className="text-foreground/80 leading-relaxed max-w-2xl mx-auto text-sm sm:text-base">
                The Ghana Muslim Students' Association (GMSA) at Ho Technical University is dedicated to fostering 
                a supportive, faith-driven, and academically excellent community for all Muslim students on campus. 
                We organize weekly Halaqahs, host congregational prayers at our campus prayer room, and engage in 
                community outreach and charity projects.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Link href="/about" className="flex flex-col items-center p-6 bg-light-gray hover:bg-primary/10 rounded-2xl transition-all group text-center space-y-3">
                <span className="p-3 bg-primary/15 text-primary rounded-xl group-hover:bg-primary group-hover:text-white transition-colors">
                  <Info className="h-6 w-6" />
                </span>
                <div>
                  <h4 className="font-bold text-foreground text-sm">About GMSA-HTU</h4>
                  <p className="text-xs text-muted mt-1">Learn about our history and board</p>
                </div>
              </Link>
              <Link href="/events" className="flex flex-col items-center p-6 bg-light-gray hover:bg-primary/10 rounded-2xl transition-all group text-center space-y-3">
                <span className="p-3 bg-primary/15 text-primary rounded-xl group-hover:bg-primary group-hover:text-white transition-colors">
                  <Calendar className="h-6 w-6" />
                </span>
                <div>
                  <h4 className="font-bold text-foreground text-sm">Upcoming Events</h4>
                  <p className="text-xs text-muted mt-1">Join our seminars and conferences</p>
                </div>
              </Link>
              <Link href="/announcements" className="flex flex-col items-center p-6 bg-light-gray hover:bg-primary/10 rounded-2xl transition-all group text-center space-y-3">
                <span className="p-3 bg-primary/15 text-primary rounded-xl group-hover:bg-primary group-hover:text-white transition-colors">
                  <Bell className="h-6 w-6" />
                </span>
                <div>
                  <h4 className="font-bold text-foreground text-sm">Announcements</h4>
                  <p className="text-xs text-muted mt-1">Latest news and campus alerts</p>
                </div>
              </Link>
              <Link href="/contact" className="flex flex-col items-center p-6 bg-light-gray hover:bg-primary/10 rounded-2xl transition-all group text-center space-y-3">
                <span className="p-3 bg-primary/15 text-primary rounded-xl group-hover:bg-primary group-hover:text-white transition-colors">
                  <Mail className="h-6 w-6" />
                </span>
                <div>
                  <h4 className="font-bold text-foreground text-sm">Get In Touch</h4>
                  <p className="text-xs text-muted mt-1">Contact the secretariat team</p>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
