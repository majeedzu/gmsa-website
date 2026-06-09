import { supabase, isSupabaseConfigured } from './supabase';

// Helper to determine if we are running in the browser
const isBrowser = typeof window !== 'undefined';

// ==========================================
// PREDEFINED SEED DATA FOR MOCK FALLBACKS
// ==========================================

const DEFAULT_QURAN_VERSES = [
  {
    id: 'q1',
    arabic_text: 'إِنَّ مَعَ الْعُسْرِ يُسْرًا',
    english_translation: 'Indeed, with hardship [will be] ease.',
    surah_name: 'Al-Inshirah',
    verse_number: 6
  },
  {
    id: 'q2',
    arabic_text: 'وَاعْتَصِمُوا بِحَبْلِ اللَّهِ جَمِيعًا وَلَا تَفَرَّقُوا',
    english_translation: 'And hold firmly to the rope of Allah all together and do not become divided.',
    surah_name: 'Ali \'Imran',
    verse_number: 103
  },
  {
    id: 'q3',
    arabic_text: 'ادْعُ إِلَىٰ سَبِيلِ رَبِّكَ بِالْحِكْمَةِ وَالْمَوْعِظَةِ الْحَسَنَةِ',
    english_translation: 'Invite to the way of your Lord with wisdom and good instruction.',
    surah_name: 'An-Nahl',
    verse_number: 125
  },
  {
    id: 'q4',
    arabic_text: 'رَبِّ زِدْنِي عِلْمًا',
    english_translation: 'My Lord, increase me in knowledge.',
    surah_name: 'Taha',
    verse_number: 114
  },
  {
    id: 'q5',
    arabic_text: 'إِنَّ اللَّهَ مَعَ الصَّابِرِينَ',
    english_translation: 'Indeed, Allah is with the patient.',
    surah_name: 'Al-Baqarah',
    verse_number: 153
  },
  {
    id: 'q6',
    arabic_text: 'وَأَقِيمُوا الصَّلَاةَ وَآتُوا Zَّكَاةَ وَارْكَعُوا مَعَ الرَّاكِعِينَ',
    english_translation: 'And establish prayer and give zakah and bow with those who bow [in worship and obedience].',
    surah_name: 'Al-Baqarah',
    verse_number: 43
  },
  {
    id: 'q7',
    arabic_text: 'يَا أَيُّهَا الَّذِينَ آمَنُوا اتَّقُوا اللَّهَ وَقُولُوا قَوْلًا سَدِيدًا',
    english_translation: 'O you who have believed, fear Allah and speak words of appropriate justice.',
    surah_name: 'Al-Ahzab',
    verse_number: 70
  }
];

const DEFAULT_HADITHS = [
  {
    id: 'h1',
    hadith_text: 'The best among you are those who learn the Qur\'an and teach it.',
    source: 'Sahih Bukhari',
    reference: 'Book 66, Hadith 45'
  },
  {
    id: 'h2',
    hadith_text: 'Actions are to be judged only by intentions, and a man will have only what he intended.',
    source: 'Sahih Bukhari & Sahih Muslim',
    reference: 'Hadith 1, 40 Hadith Nawawi'
  },
  {
    id: 'h3',
    hadith_text: 'None of you truly believes until he loves for his brother what he loves for himself.',
    source: 'Sahih Bukhari & Sahih Muslim',
    reference: 'Hadith 13, 40 Hadith Nawawi'
  },
  {
    id: 'h4',
    hadith_text: 'Whoever follows a path in the pursuit of knowledge, Allah will make a path to Paradise easy for him.',
    source: 'Sahih Muslim',
    reference: 'Book 39, Hadith 6518'
  },
  {
    id: 'h5',
    hadith_text: 'Verily, Allah does not look at your appearance or wealth, but rather He looks at your hearts and actions.',
    source: 'Sahih Muslim',
    reference: 'Book 45, Hadith 43'
  },
  {
    id: 'h6',
    hadith_text: 'The strong man is not one who is good at wrestling, but the strong man is one who controls himself in a fit of rage.',
    source: 'Sahih Bukhari',
    reference: 'Book 78, Hadith 141'
  },
  {
    id: 'h7',
    hadith_text: 'Cleanliness is half of faith.',
    source: 'Sahih Muslim',
    reference: 'Book 2, Hadith 1'
  }
];

const DEFAULT_SLIDESHOW = [
  {
    id: 's1',
    image_url: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=1200',
    display_order: 1,
    title: 'Welcome to GMSA-HTU',
    description: 'Serving the Muslim Students of Ho Technical University and nurturing faith, unity, and excellence.'
  },
  {
    id: 's2',
    image_url: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&q=80&w=1200',
    display_order: 2,
    title: 'Daily Prayers & Gathering',
    description: 'Join us for our daily congregational prayers and spiritual circles (Halaqah).'
  },
  {
    id: 's3',
    image_url: 'https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?auto=format&fit=crop&q=80&w=1200',
    display_order: 3,
    title: 'Islamic Educational Resources',
    description: 'Access academic and spiritual materials, articles, and recorded Friday Khutbahs.'
  },
  {
    id: 's4',
    image_url: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=80&w=1200',
    display_order: 4,
    title: 'Community Outreach & Charity',
    description: 'Living out our values through social action, local donation programs, and environmental support.'
  },
  {
    id: 's5',
    image_url: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=1200',
    display_order: 5,
    title: 'Annual Muslim Conferences',
    description: 'Participate in major regional seminars, debates, and leadership programs.'
  }
];

const DEFAULT_EXECUTIVES = [
  {
    id: 'e1',
    name: 'Brother Abdul Rahman Bello',
    position: 'President',
    photo_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300',
    bio: 'A level 400 Computer Science student passionate about community mobilization, educational excellence, and Islamic leadership.'
  },
  {
    id: 'e2',
    name: 'Sister Fatima Alhassan',
    position: 'Vice President (Amira)',
    photo_url: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&q=80&w=300',
    bio: 'Managing and coordinating female students affairs, counseling services, and organizing local Quran study groups.'
  },
  {
    id: 'e3',
    name: 'Brother Ibrahim Kojo',
    position: 'General Secretary',
    photo_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=300',
    bio: 'Oversees organizational records, official communications, and administration of association programs.'
  },
  {
    id: 'e4',
    name: 'Sister Zainab Zakaria',
    position: 'Treasurer',
    photo_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300',
    bio: 'Responsible for accounting, budgeting, and raising donations for community projects and Islamic events.'
  },
  {
    id: 'e5',
    name: 'Brother Yusuf Mahama',
    position: 'Public Relations Officer (PRO)',
    photo_url: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&q=80&w=300',
    bio: 'Manages social media networks, event announcements, and maintains public affairs with external boards.'
  }
];

const DEFAULT_EVENTS = [
  {
    id: 'ev1',
    title: 'GMSA HTU Annual Islamic Conference',
    description: 'A grand convention of students, imams, and scholars discussing the topic "Role of the Muslim Youth in Sustainable Nation Building". Includes lectures, Q&A session, and special presentation of awards.',
    event_date: '2026-06-25',
    event_time: '13:30',
    venue: 'HTU Great Hall',
    banner_url: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&q=80&w=600',
    created_at: '2026-06-01T12:00:00Z'
  },
  {
    id: 'ev2',
    title: 'Weekly Halaqah (Islamic Circle)',
    description: 'Weekly study and reminder circle focusing on Aqeedah, Tazkiyah, and Hadith studies. Free books and refreshments are provided.',
    event_date: '2026-06-12',
    event_time: '16:30',
    venue: 'GMSA-HTU Central Mosque Room',
    banner_url: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80&w=600',
    created_at: '2026-06-02T10:00:00Z'
  },
  {
    id: 'ev3',
    title: 'Ramadan Iftar & Feeding Program',
    description: 'Annual gathering to serve hot meals to over 500 Muslim and non-Muslim students and locals on campus during Ramadan.',
    event_date: '2026-03-20',
    event_time: '18:00',
    venue: 'HTU Campus Gardens',
    banner_url: 'https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?auto=format&fit=crop&q=80&w=600',
    created_at: '2026-03-10T10:00:00Z'
  },
  {
    id: 'ev4',
    title: 'Eid-ul-Fitr Campus Prayers',
    description: 'Commemorating the festival of fast-breaking. Congregrational prayers, sermon, and social gathering.',
    event_date: '2026-03-31',
    event_time: '07:30',
    venue: 'HTU Sports Stadium',
    banner_url: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&q=80&w=600',
    created_at: '2026-03-25T08:00:00Z'
  }
];

const DEFAULT_ANNOUNCEMENTS = [
  {
    id: 'a1',
    title: 'Registration for Arabic & Qur\'an Recitation Classes',
    content: 'We are pleased to announce the commencement of Arabic grammar and Qur\'an recitation (Tajweed) courses. Open to beginners and advanced students. Classes take place every Saturday and Sunday from 9:00 AM to 11:00 AM.',
    image_url: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=600',
    pdf_url: '',
    created_at: '2026-06-07T09:00:00Z'
  },
  {
    id: 'a2',
    title: 'Release of Friday Khutbah Notes: Duties of the Student',
    content: 'The official sermon notes for this week\'s Friday Khutbah (Khutbah: "The Responsibility of Seeking Knowledge and Modesty in Islam") have been uploaded to the resources area. You can download the PDF summary below.',
    image_url: 'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?auto=format&fit=crop&q=80&w=600',
    pdf_url: '/assets/docs/friday_khutbah_seeking_knowledge.pdf',
    created_at: '2026-06-05T15:00:00Z'
  },
  {
    id: 'a3',
    title: 'Call for Dues Payment - Academic Semester',
    content: 'Dear members, this is a friendly reminder to pay your association dues ($30 per semester) to help fund mosque maintenance, handouts, and campus operations. Contact Zainab (Treasurer) for payments.',
    image_url: '',
    pdf_url: '',
    created_at: '2026-06-01T08:00:00Z'
  },
  {
    id: 'a4',
    title: 'Mosque Cleanup and Renovation Campaign',
    content: 'Join the executives and general assembly this Saturday, June 13th, for a thorough cleanup and paint maintenance of our campus prayer hall. Bring brushes, cleaning cloth, and plastic bags. Refreshments will be provided after Dhuhr.',
    image_url: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&q=80&w=600',
    pdf_url: '',
    created_at: '2026-06-08T10:00:00Z'
  }
];

const DEFAULT_GALLERY = [
  { id: 'g1', image_url: 'https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?auto=format&fit=crop&q=80&w=600', category: 'Ramadan', created_at: '2026-03-20' },
  { id: 'g2', image_url: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&q=80&w=600', category: 'Eid', created_at: '2026-03-31' },
  { id: 'g3', image_url: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&q=80&w=600', category: 'Conferences', created_at: '2026-06-25' },
  { id: 'g4', image_url: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80&w=600', category: 'Seminars', created_at: '2026-06-02' },
  { id: 'g5', image_url: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=80&w=600', category: 'Community Service', created_at: '2026-05-15' },
  { id: 'g6', image_url: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=600', category: 'General Activities', created_at: '2026-06-08' }
];

const DEFAULT_KHUTBAH_NOTES = [
  {
    id: 'k1',
    title: 'The Purpose of Seeking Islamic & Academic Knowledge',
    content: 'Knowledge is the foundation of faith and action. In this khutbah, we study the Prophetic guidance on combining academic excellence with spiritual growth.',
    pdf_url: '/assets/docs/khutbah_seeking_knowledge.pdf',
    created_at: '2026-06-05T12:30:00Z'
  },
  {
    id: 'k2',
    title: 'Unity and Brotherhood in Campus Communities',
    content: 'A comprehensive sermon highlighting the prohibition of tribalism, divisions, and mutual envy. Building strong bonds among student bodies.',
    pdf_url: '/assets/docs/khutbah_unity_brotherhood.pdf',
    created_at: '2026-05-29T12:30:00Z'
  },
  {
    id: 'k3',
    title: 'Character (Akhlaq) as the True Measure of Faith',
    content: 'Exploring how standard courtesy, honesty, and modesty shape a believer\'s personality, quoting examples from the life of Prophet Muhammad (PBUH).',
    pdf_url: '/assets/docs/khutbah_good_character.pdf',
    created_at: '2026-05-22T12:30:00Z'
  }
];

const DEFAULT_SETTINGS = {
  gmsaLogo: '/gmsa-logo.jpg', // Base64 or local path representation
  htuLogo: '/htu-logo.png',
  phone: '+233 24 123 4567',
  email: 'info@gmsahtu.com',
  address: 'Ho Technical University Campus, GMSA Secretariat, Ho, Volta Region, Ghana',
  socialFacebook: 'https://facebook.com/gmsahtu',
  socialTwitter: 'https://twitter.com/gmsahtu',
  socialInstagram: 'https://instagram.com/gmsahtu',
  footerText: '© 2026 Ghana Muslim Students\' Association - Ho Technical University Branch. All rights reserved.'
};

// ==========================================
// LOCAL STORAGE MOCK DATABASE LAYER
// ==========================================

const getStored = (key, fallback) => {
  if (!isBrowser) return fallback;
  const stored = localStorage.getItem(`gmsa_${key}`);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      console.error('Error reading localStorage key', key, e);
    }
  }
  // Initialize storage if missing
  localStorage.setItem(`gmsa_${key}`, JSON.stringify(fallback));
  return fallback;
};

const setStored = (key, val) => {
  if (!isBrowser) return;
  localStorage.setItem(`gmsa_${key}`, JSON.stringify(val));
};

// State wrappers
const getMockData = () => {
  return {
    quran: getStored('quran_verses', DEFAULT_QURAN_VERSES),
    hadiths: getStored('hadiths', DEFAULT_HADITHS),
    slideshow: getStored('slideshow', DEFAULT_SLIDESHOW),
    executives: getStored('executives', DEFAULT_EXECUTIVES),
    events: getStored('events', DEFAULT_EVENTS),
    announcements: getStored('announcements', DEFAULT_ANNOUNCEMENTS),
    gallery: getStored('gallery', DEFAULT_GALLERY),
    khutbah: getStored('khutbah_notes', DEFAULT_KHUTBAH_NOTES),
    settings: getStored('settings', DEFAULT_SETTINGS),
    contacts: getStored('contacts', []),
    subscribers: getStored('subscribers', [])
  };
};

// ==========================================
// AUTHENTICATION LOGIC
// ==========================================

export const auth = {
  login: async (email, password) => {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      if (data && data.session) {
        const session = {
          user: { id: data.user.id, email: data.user.email, role: 'admin' },
          expires_at: data.session.expires_at * 1000
        };
        if (isBrowser) {
          localStorage.setItem('gmsa_session', JSON.stringify(session));
        }
      }
      return data;
    } else {
      // Mock Login
      if (email === 'admin@gmsahtu.com' && password === 'Admin@123') {
        const session = {
          user: { id: 'admin-id', email: 'admin@gmsahtu.com', role: 'admin' },
          expires_at: Date.now() + 3600000
        };
        if (isBrowser) {
          localStorage.setItem('gmsa_session', JSON.stringify(session));
        }
        return session;
      } else {
        throw new Error('Invalid email or password. Please use email admin@gmsahtu.com and password Admin@123');
      }
    }
  },

  logout: async () => {
    if (isSupabaseConfigured) {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    }
    if (isBrowser) {
      localStorage.removeItem('gmsa_session');
    }
    return true;
  },

  getSession: () => {
    if (isBrowser) {
      // 1. Try reading the unified session first
      const sessionStr = localStorage.getItem('gmsa_session');
      if (sessionStr) {
        try {
          const session = JSON.parse(sessionStr);
          if (session.expires_at > Date.now()) {
            return session;
          }
          localStorage.removeItem('gmsa_session');
        } catch (e) {
          localStorage.removeItem('gmsa_session');
        }
      }

      // 2. If Supabase is configured and gmsa_session wasn't found/valid, try parsing Supabase's local session key
      if (isSupabaseConfigured) {
        try {
          const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
          const ref = supabaseUrl ? new URL(supabaseUrl).hostname.split('.')[0] : '';
          if (ref) {
            const sbSessionStr = localStorage.getItem(`sb-${ref}-auth-token`);
            if (sbSessionStr) {
              const sbSession = JSON.parse(sbSessionStr);
              if (sbSession && sbSession.expires_at * 1000 > Date.now()) {
                const session = {
                  user: { id: sbSession.user.id, email: sbSession.user.email, role: 'admin' },
                  expires_at: sbSession.expires_at * 1000
                };
                localStorage.setItem('gmsa_session', JSON.stringify(session));
                return session;
              }
            }
          }
        } catch (err) {
          console.error('Error parsing Supabase session from localStorage', err);
        }
      }
    }
    return null;
  },

  changePassword: async (newPassword) => {
    if (isSupabaseConfigured) {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;
    } else {
      // Mock change password (just simulation)
      console.log('Password successfully changed to:', newPassword);
    }
    return true;
  }
};

// ==========================================
// UNIFIED DATA OPERATIONS (SUPABASE OR MOCK)
// ==========================================

export const db = {
  // --- Slideshow ---
  getSlideshow: async () => {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from('slideshow')
        .select('*')
        .order('display_order', { ascending: true });
      if (!error && data) return data;
    }
    return getMockData().slideshow.sort((a, b) => a.display_order - b.display_order);
  },

  saveSlideshowItem: async (item) => {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from('slideshow')
        .upsert(item)
        .select();
      if (error) throw error;
      return data[0];
    } else {
      const items = getMockData().slideshow;
      if (item.id) {
        const index = items.findIndex(i => i.id === item.id);
        if (index > -1) items[index] = { ...items[index], ...item };
      } else {
        item.id = 'slide_' + Math.random().toString(36).substr(2, 9);
        items.push(item);
      }
      setStored('slideshow', items);
      return item;
    }
  },

  deleteSlideshowItem: async (id) => {
    if (isSupabaseConfigured) {
      const { error } = await supabase.from('slideshow').delete().eq('id', id);
      if (error) throw error;
    } else {
      const items = getMockData().slideshow.filter(i => i.id !== id);
      setStored('slideshow', items);
    }
    return true;
  },

  reorderSlideshow: async (orderedIds) => {
    if (isSupabaseConfigured) {
      const promises = orderedIds.map((id, index) => 
        supabase.from('slideshow').update({ display_order: index + 1 }).eq('id', id)
      );
      await Promise.all(promises);
    } else {
      const items = getMockData().slideshow;
      orderedIds.forEach((id, index) => {
        const item = items.find(i => i.id === id);
        if (item) item.display_order = index + 1;
      });
      setStored('slideshow', items);
    }
    return true;
  },

  // --- Quran & Hadiths ---
  getQuranVerses: async () => {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase.from('quran_verses').select('*');
      if (!error && data) return data;
    }
    return getMockData().quran;
  },

  saveQuranVerse: async (verse) => {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase.from('quran_verses').upsert(verse).select();
      if (error) throw error;
      return data[0];
    } else {
      const items = getMockData().quran;
      if (verse.id) {
        const index = items.findIndex(i => i.id === verse.id);
        if (index > -1) items[index] = { ...items[index], ...verse };
      } else {
        verse.id = 'q_' + Math.random().toString(36).substr(2, 9);
        items.push(verse);
      }
      setStored('quran_verses', items);
      return verse;
    }
  },

  deleteQuranVerse: async (id) => {
    if (isSupabaseConfigured) {
      const { error } = await supabase.from('quran_verses').delete().eq('id', id);
      if (error) throw error;
    } else {
      const items = getMockData().quran.filter(i => i.id !== id);
      setStored('quran_verses', items);
    }
    return true;
  },

  getHadiths: async () => {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase.from('hadiths').select('*');
      if (!error && data) return data;
    }
    return getMockData().hadiths;
  },

  saveHadith: async (hadith) => {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase.from('hadiths').upsert(hadith).select();
      if (error) throw error;
      return data[0];
    } else {
      const items = getMockData().hadiths;
      if (hadith.id) {
        const index = items.findIndex(i => i.id === hadith.id);
        if (index > -1) items[index] = { ...items[index], ...hadith };
      } else {
        hadith.id = 'h_' + Math.random().toString(36).substr(2, 9);
        items.push(hadith);
      }
      setStored('hadiths', items);
      return hadith;
    }
  },

  deleteHadith: async (id) => {
    if (isSupabaseConfigured) {
      const { error } = await supabase.from('hadiths').delete().eq('id', id);
      if (error) throw error;
    } else {
      const items = getMockData().hadiths.filter(i => i.id !== id);
      setStored('hadiths', items);
    }
    return true;
  },

  // --- Announcements ---
  getAnnouncements: async () => {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from('announcements')
        .select('*')
        .order('created_at', { ascending: false });
      if (!error && data) return data;
    }
    return getMockData().announcements.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  },

  saveAnnouncement: async (announcement) => {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase.from('announcements').upsert(announcement).select();
      if (error) throw error;
      return data[0];
    } else {
      const items = getMockData().announcements;
      if (announcement.id) {
        const index = items.findIndex(i => i.id === announcement.id);
        if (index > -1) items[index] = { ...items[index], ...announcement };
      } else {
        announcement.id = 'ann_' + Math.random().toString(36).substr(2, 9);
        announcement.created_at = new Date().toISOString();
        items.push(announcement);
      }
      setStored('announcements', items);
      return announcement;
    }
  },

  deleteAnnouncement: async (id) => {
    if (isSupabaseConfigured) {
      const { error } = await supabase.from('announcements').delete().eq('id', id);
      if (error) throw error;
    } else {
      const items = getMockData().announcements.filter(i => i.id !== id);
      setStored('announcements', items);
    }
    return true;
  },

  // --- Events ---
  getEvents: async () => {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('event_date', { ascending: true });
      if (!error && data) return data;
    }
    return getMockData().events.sort((a, b) => new Date(a.event_date) - new Date(b.event_date));
  },

  saveEvent: async (event) => {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase.from('events').upsert(event).select();
      if (error) throw error;
      return data[0];
    } else {
      const items = getMockData().events;
      if (event.id) {
        const index = items.findIndex(i => i.id === event.id);
        if (index > -1) items[index] = { ...items[index], ...event };
      } else {
        event.id = 'ev_' + Math.random().toString(36).substr(2, 9);
        event.created_at = new Date().toISOString();
        items.push(event);
      }
      setStored('events', items);
      return event;
    }
  },

  deleteEvent: async (id) => {
    if (isSupabaseConfigured) {
      const { error } = await supabase.from('events').delete().eq('id', id);
      if (error) throw error;
    } else {
      const items = getMockData().events.filter(i => i.id !== id);
      setStored('events', items);
    }
    return true;
  },

  // --- Gallery ---
  getGallery: async () => {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from('gallery')
        .select('*')
        .order('created_at', { ascending: false });
      if (!error && data) return data;
    }
    return getMockData().gallery.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  },

  saveGalleryItem: async (item) => {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase.from('gallery').insert(item).select();
      if (error) throw error;
      return data[0];
    } else {
      const items = getMockData().gallery;
      item.id = 'gal_' + Math.random().toString(36).substr(2, 9);
      item.created_at = new Date().toISOString().split('T')[0];
      items.push(item);
      setStored('gallery', items);
      return item;
    }
  },

  deleteGalleryItem: async (id) => {
    if (isSupabaseConfigured) {
      const { error } = await supabase.from('gallery').delete().eq('id', id);
      if (error) throw error;
    } else {
      const items = getMockData().gallery.filter(i => i.id !== id);
      setStored('gallery', items);
    }
    return true;
  },

  // --- Executives ---
  getExecutives: async () => {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase.from('executives').select('*');
      if (!error && data) return data;
    }
    return getMockData().executives;
  },

  saveExecutive: async (executive) => {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase.from('executives').upsert(executive).select();
      if (error) throw error;
      return data[0];
    } else {
      const items = getMockData().executives;
      if (executive.id) {
        const index = items.findIndex(i => i.id === executive.id);
        if (index > -1) items[index] = { ...items[index], ...executive };
      } else {
        executive.id = 'exec_' + Math.random().toString(36).substr(2, 9);
        items.push(executive);
      }
      setStored('executives', items);
      return executive;
    }
  },

  deleteExecutive: async (id) => {
    if (isSupabaseConfigured) {
      const { error } = await supabase.from('executives').delete().eq('id', id);
      if (error) throw error;
    } else {
      const items = getMockData().executives.filter(i => i.id !== id);
      setStored('executives', items);
    }
    return true;
  },

  // --- Resources / Khutbah Notes ---
  getKhutbahNotes: async () => {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from('khutbah_notes')
        .select('*')
        .order('created_at', { ascending: false });
      if (!error && data) return data;
    }
    return getMockData().khutbah.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  },

  saveKhutbahNote: async (note) => {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase.from('khutbah_notes').upsert(note).select();
      if (error) throw error;
      return data[0];
    } else {
      const items = getMockData().khutbah;
      if (note.id) {
        const index = items.findIndex(i => i.id === note.id);
        if (index > -1) items[index] = { ...items[index], ...note };
      } else {
        note.id = 'khut_' + Math.random().toString(36).substr(2, 9);
        note.created_at = new Date().toISOString();
        items.push(note);
      }
      setStored('khutbah_notes', items);
      return note;
    }
  },

  deleteKhutbahNote: async (id) => {
    if (isSupabaseConfigured) {
      const { error } = await supabase.from('khutbah_notes').delete().eq('id', id);
      if (error) throw error;
    } else {
      const items = getMockData().khutbah.filter(i => i.id !== id);
      setStored('khutbah_notes', items);
    }
    return true;
  },

  // --- Contacts ---
  getContacts: async () => {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from('contacts')
        .select('*')
        .order('created_at', { ascending: false });
      if (!error && data) return data;
    }
    return getMockData().contacts.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  },

  saveContact: async (message) => {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase.from('contacts').insert(message).select();
      if (error) throw error;
      return data[0];
    } else {
      const items = getMockData().contacts;
      message.id = 'msg_' + Math.random().toString(36).substr(2, 9);
      message.created_at = new Date().toISOString();
      items.push(message);
      setStored('contacts', items);
      return message;
    }
  },

  deleteContact: async (id) => {
    if (isSupabaseConfigured) {
      const { error } = await supabase.from('contacts').delete().eq('id', id);
      if (error) throw error;
    } else {
      const items = getMockData().contacts.filter(i => i.id !== id);
      setStored('contacts', items);
    }
    return true;
  },

  // --- Newsletter Subscribers ---
  getSubscribers: async () => {
    return getStored('subscribers', []);
  },

  saveSubscriber: async (email) => {
    const list = getStored('subscribers', []);
    if (!list.includes(email)) {
      list.push(email);
      setStored('subscribers', list);
    }
    return true;
  },

  // --- Website Settings ---
  getSettings: async () => {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase.from('website_settings').select('*');
      if (!error && data && data.length > 0) {
        // Map settings array of {key, value} to a single object
        const settingsObj = {};
        data.forEach(item => {
          settingsObj[item.key] = item.value;
        });
        return { ...DEFAULT_SETTINGS, ...settingsObj };
      }
    }
    const stored = getMockData().settings;
    if (!stored.gmsaLogo) stored.gmsaLogo = DEFAULT_SETTINGS.gmsaLogo;
    if (!stored.htuLogo) stored.htuLogo = DEFAULT_SETTINGS.htuLogo;
    return stored;
  },

  saveSettings: async (newSettings) => {
    if (isSupabaseConfigured) {
      const promises = Object.entries(newSettings).map(([key, value]) =>
        supabase.from('website_settings').upsert({ key, value })
      );
      await Promise.all(promises);
    } else {
      const current = getMockData().settings;
      const updated = { ...current, ...newSettings };
      setStored('settings', updated);
    }
    return newSettings;
  },

  // --- Storage Mock & Real ---
  uploadFile: async (bucket, file) => {
    if (isSupabaseConfigured) {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error } = await supabase.storage
        .from(bucket)
        .upload(filePath, file);

      if (error) throw error;

      const { data } = supabase.storage
        .from(bucket)
        .getPublicUrl(filePath);

      return data.publicUrl;
    } else {
      // Mock File Upload: return a promise with base64 dataUrl
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
        reader.readAsDataURL(file);
      });
    }
  }
};
