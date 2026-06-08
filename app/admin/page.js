'use html';
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  LayoutDashboard, Image, Bell, Calendar, Users, BookOpen, FileText, Settings, 
  Trash2, Plus, Edit, Save, LogOut, ArrowUp, ArrowDown, ShieldAlert, CheckCircle2, AlertCircle, Eye, EyeOff, Key
} from 'lucide-react';
import { db, auth } from '../../lib/db';

export default function AdminDashboard() {
  const router = useRouter();
  const [session, setSession] = useState(null);
  const [activeTab, setActiveTab] = useState('overview'); // overview, slideshow, announcements, events, gallery, executives, resources, scriptures, settings
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Database Data States
  const [stats, setStats] = useState({ slideshow: 0, announcements: 0, events: 0, gallery: 0, executives: 0, resources: 0, messages: 0 });
  const [slideshow, setSlideshow] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [events, setEvents] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [executives, setExecutives] = useState([]);
  const [resources, setResources] = useState([]);
  const [verses, setVerses] = useState([]);
  const [hadiths, setHadiths] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [settings, setSettings] = useState({});

  // CRUD Form Dialog States
  const [dialog, setDialog] = useState({ type: null, open: false, data: {} });
  const [uploadProgress, setUploadProgress] = useState(false);

  useEffect(() => {
    const activeSession = auth.getSession();
    if (!activeSession) {
      router.push('/login');
    } else {
      setSession(activeSession);
      loadAllData();
    }
  }, [router]);

  const showSuccess = (msg) => {
    setSuccess(msg);
    setTimeout(() => setSuccess(''), 4000);
  };

  const showError = (msg) => {
    setError(msg);
    setTimeout(() => setError(''), 5000);
  };

  const loadAllData = async () => {
    setLoading(true);
    try {
      const s = await db.getSlideshow();
      const a = await db.getAnnouncements();
      const e = await db.getEvents();
      const g = await db.getGallery();
      const exec = await db.getExecutives();
      const r = await db.getKhutbahNotes();
      const v = await db.getQuranVerses();
      const h = await db.getHadiths();
      const c = await db.getContacts();
      const set = await db.getSettings();

      setSlideshow(s);
      setAnnouncements(a);
      setEvents(e);
      setGallery(g);
      setExecutives(exec);
      setResources(r);
      setVerses(v);
      setHadiths(h);
      setContacts(c);
      setSettings(set);

      setStats({
        slideshow: s.length,
        announcements: a.length,
        events: e.length,
        gallery: g.length,
        executives: exec.length,
        resources: r.length,
        messages: c.length
      });
    } catch (err) {
      console.error(err);
      showError('Error loading dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await auth.logout();
    router.push('/login');
  };

  // --- FILE UPLOAD UTIL ---
  const handleFileUpload = async (e, bucket, field) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploadProgress(true);
    try {
      const url = await db.uploadFile(bucket, file);
      setDialog(prev => ({
        ...prev,
        data: { ...prev.data, [field]: url }
      }));
      showSuccess('File uploaded successfully!');
    } catch (err) {
      console.error(err);
      showError('Upload failed.');
    } finally {
      setUploadProgress(false);
    }
  };

  const handleLogoUpload = async (e, field) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploadProgress(true);
    try {
      const url = await db.uploadFile('branding', file);
      setSettings(prev => ({ ...prev, [field]: url }));
      await db.saveSettings({ [field]: url });
      showSuccess('Logo updated successfully!');
    } catch (err) {
      console.error(err);
      showError('Logo upload failed.');
    } finally {
      setUploadProgress(false);
    }
  };

  // ==========================================
  // FORM CRUD OPERATIONS
  // ==========================================

  const openFormDialog = (tabName, initialData = {}) => {
    setDialog({
      type: tabName,
      open: true,
      data: initialData
    });
  };

  const closeFormDialog = () => {
    setDialog({ type: null, open: false, data: {} });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const { type, data } = dialog;
    try {
      if (type === 'announcements') {
        await db.saveAnnouncement(data);
      } else if (type === 'events') {
        await db.saveEvent(data);
      } else if (type === 'gallery') {
        await db.saveGalleryItem(data);
      } else if (type === 'slideshow') {
        if (!data.display_order) data.display_order = slideshow.length + 1;
        await db.saveSlideshowItem(data);
      } else if (type === 'executives') {
        await db.saveExecutive(data);
      } else if (type === 'resources') {
        await db.saveKhutbahNote(data);
      } else if (type === 'verses') {
        await db.saveQuranVerse(data);
      } else if (type === 'hadiths') {
        await db.saveHadith(data);
      }
      
      closeFormDialog();
      showSuccess('Saved successfully!');
      loadAllData();
    } catch (err) {
      console.error(err);
      showError('Failed to save details.');
    }
  };

  const handleDelete = async (tabName, id) => {
    if (!confirm('Are you sure you want to delete this item?')) return;
    try {
      if (tabName === 'announcements') await db.deleteAnnouncement(id);
      else if (tabName === 'events') await db.deleteEvent(id);
      else if (tabName === 'gallery') await db.deleteGalleryItem(id);
      else if (tabName === 'slideshow') await db.deleteSlideshowItem(id);
      else if (tabName === 'executives') await db.deleteExecutive(id);
      else if (tabName === 'resources') await db.deleteKhutbahNote(id);
      else if (tabName === 'verses') await db.deleteQuranVerse(id);
      else if (tabName === 'hadiths') await db.deleteHadith(id);
      else if (tabName === 'contacts') await db.deleteContact(id);

      showSuccess('Deleted successfully!');
      loadAllData();
    } catch (err) {
      console.error(err);
      showError('Failed to delete item.');
    }
  };

  const moveSlide = async (index, direction) => {
    const newSlides = [...slideshow];
    if (direction === 'up' && index > 0) {
      const temp = newSlides[index];
      newSlides[index] = newSlides[index - 1];
      newSlides[index - 1] = temp;
    } else if (direction === 'down' && index < newSlides.length - 1) {
      const temp = newSlides[index];
      newSlides[index] = newSlides[index + 1];
      newSlides[index + 1] = temp;
    }
    const ids = newSlides.map(s => s.id);
    await db.reorderSlideshow(ids);
    loadAllData();
    showSuccess('Order updated!');
  };

  const handleSettingsSave = async (e) => {
    e.preventDefault();
    try {
      await db.saveSettings(settings);
      showSuccess('Settings updated successfully!');
      loadAllData();
    } catch (err) {
      console.error(err);
      showError('Failed to save settings.');
    }
  };

  if (!session) {
    return (
      <div className="min-h-[85vh] flex items-center justify-center bg-background">
        <div className="text-center space-y-3">
          <ShieldAlert className="h-10 w-10 text-muted mx-auto animate-bounce" />
          <p className="text-sm font-semibold text-muted">Checking authorization session...</p>
        </div>
      </div>
    );
  }

  const menuItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'slideshow', label: 'Slideshow', icon: Image },
    { id: 'announcements', label: 'Announcements', icon: Bell },
    { id: 'events', label: 'Events', icon: Calendar },
    { id: 'gallery', label: 'Gallery', icon: Image },
    { id: 'executives', label: 'Executives', icon: Users },
    { id: 'resources', label: 'Resources (Khutbah)', icon: FileText },
    { id: 'scriptures', label: 'Quran & Hadith', icon: BookOpen },
    { id: 'settings', label: 'Website Settings', icon: Settings }
  ];

  return (
    <div className="bg-background min-h-screen flex flex-col lg:flex-row border-t border-border-color">
      
      {/* Sidebar Navigation */}
      <aside className="w-full lg:w-64 bg-card-bg border-r border-border-color lg:min-h-screen flex flex-col justify-between shrink-0">
        <div className="p-4 space-y-4">
          <div className="px-3 py-2 border-b border-border-color/60">
            <p className="text-[10px] font-bold text-primary dark:text-secondary uppercase tracking-widest">Admin Control</p>
            <p className="text-sm font-bold text-foreground truncate">{session.user.email}</p>
          </div>

          <nav className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-semibold text-left transition-colors cursor-pointer ${
                    activeTab === item.id
                      ? 'bg-primary/10 dark:bg-secondary/10 text-primary dark:text-secondary'
                      : 'text-foreground/80 hover:bg-light-gray hover:text-foreground'
                  }`}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-4 border-t border-border-color space-y-2">
          <button
            onClick={() => router.push('/change-password')}
            className="w-full flex items-center space-x-3 px-4 py-2.5 rounded-lg text-xs font-bold text-foreground/80 hover:bg-light-gray border border-border-color cursor-pointer"
          >
            <Key className="h-4 w-4 text-muted" />
            <span>Change Password</span>
          </button>
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-4 py-2.5 rounded-lg text-xs font-bold text-red-650 hover:bg-red-50 dark:hover:bg-red-950/20 border border-transparent cursor-pointer"
          >
            <LogOut className="h-4 w-4 shrink-0" />
            <span>Log Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-grow p-6 sm:p-8 space-y-8">
        
        {/* Notifications Bar */}
        {success && (
          <div className="flex items-center space-x-2 text-[#0F7A35] bg-green-50 dark:bg-green-950/20 dark:text-green-400 p-4 rounded-xl border border-green-200/50 shadow-sm animate-fade-in">
            <CheckCircle2 className="h-5 w-5 shrink-0" />
            <span className="text-xs font-semibold">{success}</span>
          </div>
        )}
        {error && (
          <div className="flex items-center space-x-2 text-red-600 bg-red-50 dark:bg-red-950/20 dark:text-red-400 p-4 rounded-xl border border-red-200/50 shadow-sm animate-fade-in">
            <AlertCircle className="h-5 w-5 shrink-0" />
            <span className="text-xs font-semibold">{error}</span>
          </div>
        )}

        {loading ? (
          <div className="h-96 flex items-center justify-center">
            <div className="text-center space-y-2">
              <div className="h-10 w-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
              <p className="text-xs text-muted font-bold">Synchronizing database content...</p>
            </div>
          </div>
        ) : (
          <>
            {/* OVERVIEW TAB */}
            {activeTab === 'overview' && (
              <div className="space-y-8 animate-fade-in">
                <div className="border-b border-border-color pb-4">
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">Overview Dashboard</h1>
                  <p className="text-xs text-muted">A numeric index of your uploaded website contents and form contacts.</p>
                </div>

                {/* Counters Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                  {[
                    { label: 'Announcements', count: stats.announcements, color: 'text-primary' },
                    { label: 'Events', count: stats.events, color: 'text-gold' },
                    { label: 'Gallery Files', count: stats.gallery, color: 'text-blue-500' },
                    { label: 'Slides', count: stats.slideshow, color: 'text-purple-500' },
                    { label: 'Khutbah Notes', count: stats.resources, color: 'text-indigo-500' },
                    { label: 'Messages', count: stats.messages, color: 'text-red-500' }
                  ].map((stat, i) => (
                    <div key={i} className="bg-card-bg border border-border-color p-5 rounded-2xl text-center shadow-sm">
                      <p className="text-[10px] text-muted font-bold uppercase tracking-wider mb-2">{stat.label}</p>
                      <p className={`text-3xl font-extrabold ${stat.color}`}>{stat.count}</p>
                    </div>
                  ))}
                </div>

                {/* Contact Submissions list */}
                <div className="space-y-4">
                  <h2 className="text-xl font-bold text-foreground">Contact Form Messages ({contacts.length})</h2>
                  {contacts.length > 0 ? (
                    <div className="bg-card-bg border border-border-color rounded-2xl overflow-hidden shadow-sm">
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left border-collapse">
                          <thead className="bg-light-gray dark:bg-muted-bg text-xs font-bold uppercase text-muted tracking-wider border-b border-border-color">
                            <tr>
                              <th className="p-4">Sender</th>
                              <th className="p-4">Subject</th>
                              <th className="p-4">Message</th>
                              <th className="p-4 text-right">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-border-color">
                            {contacts.map((msg) => (
                              <tr key={msg.id} className="hover:bg-light-gray/50 transition-colors">
                                <td className="p-4 whitespace-nowrap">
                                  <div className="font-bold text-foreground">{msg.name}</div>
                                  <div className="text-xs text-muted">{msg.email}</div>
                                  <div className="text-[10px] text-muted">{new Date(msg.created_at).toLocaleString()}</div>
                                </td>
                                <td className="p-4 font-bold text-foreground">{msg.subject}</td>
                                <td className="p-4 text-xs text-foreground/80 max-w-xs truncate" title={msg.message}>{msg.message}</td>
                                <td className="p-4 text-right">
                                  <button
                                    onClick={() => handleDelete('contacts', msg.id)}
                                    className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg cursor-pointer"
                                    title="Delete Message"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ) : (
                    <div className="p-8 border border-dashed border-border-color rounded-2xl bg-card-bg text-center text-muted italic text-sm">
                      No customer query messages recorded in database.
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* SLIDESHOW MODULE */}
            {activeTab === 'slideshow' && (
              <div className="space-y-6 animate-fade-in">
                <div className="flex justify-between items-center border-b border-border-color pb-4">
                  <div>
                    <h1 className="text-2xl font-extrabold text-foreground">Manage Hero Slideshow</h1>
                    <p className="text-xs text-muted">Upload and drag banner slideshow listings displaying on your homepage.</p>
                  </div>
                  <button
                    onClick={() => openFormDialog('slideshow')}
                    className="flex items-center space-x-2 px-4 py-2 text-xs font-bold text-white bg-primary hover:bg-primary/95 dark:bg-secondary dark:text-black rounded-lg cursor-pointer shadow"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Add Slide</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {slideshow.map((slide, index) => (
                    <div
                      key={slide.id}
                      className="bg-card-bg border border-border-color p-4 rounded-xl flex items-center justify-between gap-4"
                    >
                      <div className="flex items-center space-x-4">
                        <img src={slide.image_url} alt="" className="h-14 w-24 object-cover rounded border border-border-color" />
                        <div>
                          <h3 className="font-bold text-sm text-foreground">{slide.title || 'Untitled Banner'}</h3>
                          <p className="text-xs text-muted line-clamp-1">{slide.description}</p>
                          <span className="text-[10px] text-primary dark:text-secondary font-bold uppercase tracking-wider">Order: {slide.display_order}</span>
                        </div>
                      </div>

                      <div className="flex items-center space-x-1">
                        <button
                          disabled={index === 0}
                          onClick={() => moveSlide(index, 'up')}
                          className="p-2 text-foreground/80 hover:bg-light-gray rounded disabled:opacity-30 cursor-pointer"
                        >
                          <ArrowUp className="h-4 w-4" />
                        </button>
                        <button
                          disabled={index === slideshow.length - 1}
                          onClick={() => moveSlide(index, 'down')}
                          className="p-2 text-foreground/80 hover:bg-light-gray rounded disabled:opacity-30 cursor-pointer"
                        >
                          <ArrowDown className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => openFormDialog('slideshow', slide)}
                          className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/20 rounded cursor-pointer"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete('slideshow', slide.id)}
                          className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 rounded cursor-pointer"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ANNOUNCEMENTS MODULE */}
            {activeTab === 'announcements' && (
              <div className="space-y-6 animate-fade-in">
                <div className="flex justify-between items-center border-b border-border-color pb-4">
                  <div>
                    <h1 className="text-2xl font-extrabold text-foreground">Manage Announcements</h1>
                    <p className="text-xs text-muted">Create, edit, or delete official announcements.</p>
                  </div>
                  <button
                    onClick={() => openFormDialog('announcements')}
                    className="flex items-center space-x-2 px-4 py-2 text-xs font-bold text-white bg-primary hover:bg-primary/95 dark:bg-secondary dark:text-black rounded-lg cursor-pointer shadow"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Create Announcement</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {announcements.map((ann) => (
                    <div
                      key={ann.id}
                      className="bg-card-bg border border-border-color rounded-xl p-5 flex flex-col justify-between"
                    >
                      <div className="space-y-2">
                        {ann.image_url && <img src={ann.image_url} alt="" className="h-32 w-full object-cover rounded-lg mb-2" />}
                        <span className="text-[10px] text-muted font-bold block">{new Date(ann.created_at).toLocaleDateString()}</span>
                        <h3 className="font-bold text-sm text-foreground">{ann.title}</h3>
                        <p className="text-xs text-muted line-clamp-3 leading-relaxed">{ann.content}</p>
                      </div>

                      <div className="flex justify-between items-center mt-4 pt-3 border-t border-border-color/60">
                        <span className="text-[10px] text-primary dark:text-secondary font-bold">
                          {ann.pdf_url ? 'Has Document attachment' : 'No document'}
                        </span>
                        <div className="flex space-x-1">
                          <button
                            onClick={() => openFormDialog('announcements', ann)}
                            className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/20 rounded cursor-pointer"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete('announcements', ann.id)}
                            className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 rounded cursor-pointer"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* EVENTS MODULE */}
            {activeTab === 'events' && (
              <div className="space-y-6 animate-fade-in">
                <div className="flex justify-between items-center border-b border-border-color pb-4">
                  <div>
                    <h1 className="text-2xl font-extrabold text-foreground">Manage Events</h1>
                    <p className="text-xs text-muted">Coordinate upcoming programs, dates, and venues.</p>
                  </div>
                  <button
                    onClick={() => openFormDialog('events')}
                    className="flex items-center space-x-2 px-4 py-2 text-xs font-bold text-white bg-primary hover:bg-primary/95 dark:bg-secondary dark:text-black rounded-lg cursor-pointer shadow"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Create Event</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {events.map((ev) => (
                    <div
                      key={ev.id}
                      className="bg-card-bg border border-border-color rounded-xl p-5 flex flex-col justify-between"
                    >
                      <div className="space-y-2">
                        {ev.banner_url && <img src={ev.banner_url} alt="" className="h-32 w-full object-cover rounded-lg mb-2" />}
                        <span className="text-[10px] text-gold font-bold uppercase tracking-wider bg-gold/10 px-2 py-0.5 rounded">{ev.event_date}</span>
                        <h3 className="font-bold text-sm text-foreground">{ev.title}</h3>
                        <p className="text-xs text-muted leading-relaxed line-clamp-2">{ev.description}</p>
                        <div className="text-[11px] text-muted space-y-0.5">
                          <div><span className="font-semibold text-foreground">Time:</span> {ev.event_time}</div>
                          <div><span className="font-semibold text-foreground">Venue:</span> {ev.venue}</div>
                        </div>
                      </div>

                      <div className="flex justify-end space-x-1 mt-4 pt-3 border-t border-border-color/60">
                        <button
                          onClick={() => openFormDialog('events', ev)}
                          className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/20 rounded cursor-pointer"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete('events', ev.id)}
                          className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 rounded cursor-pointer"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* GALLERY MODULE */}
            {activeTab === 'gallery' && (
              <div className="space-y-6 animate-fade-in">
                <div className="flex justify-between items-center border-b border-border-color pb-4">
                  <div>
                    <h1 className="text-2xl font-extrabold text-foreground">Manage Photo Gallery</h1>
                    <p className="text-xs text-muted">Upload and classify visual memories into categories.</p>
                  </div>
                  <button
                    onClick={() => openFormDialog('gallery')}
                    className="flex items-center space-x-2 px-4 py-2 text-xs font-bold text-white bg-primary hover:bg-primary/95 dark:bg-secondary dark:text-black rounded-lg cursor-pointer shadow"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Upload Image</span>
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                  {gallery.map((item) => (
                    <div
                      key={item.id}
                      className="bg-card-bg border border-border-color rounded-xl overflow-hidden relative group"
                    >
                      <img src={item.image_url} alt="" className="w-full h-36 object-cover" />
                      <div className="p-3 flex justify-between items-center">
                        <span className="text-[10px] font-bold text-muted uppercase tracking-wider">{item.category}</span>
                        <button
                          onClick={() => handleDelete('gallery', item.id)}
                          className="p-1.5 text-red-650 hover:bg-red-50 dark:hover:bg-red-950/20 rounded cursor-pointer"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* EXECUTIVES MODULE */}
            {activeTab === 'executives' && (
              <div className="space-y-6 animate-fade-in">
                <div className="flex justify-between items-center border-b border-border-color pb-4">
                  <div>
                    <h1 className="text-2xl font-extrabold text-foreground">Manage Executive Profiles</h1>
                    <p className="text-xs text-muted">Register, edit, or delete GMSA-HTU executives.</p>
                  </div>
                  <button
                    onClick={() => openFormDialog('executives')}
                    className="flex items-center space-x-2 px-4 py-2 text-xs font-bold text-white bg-primary hover:bg-primary/95 dark:bg-secondary dark:text-black rounded-lg cursor-pointer shadow"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Add Executive</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-4">
                  {executives.map((exec) => (
                    <div
                      key={exec.id}
                      className="bg-card-bg border border-border-color rounded-xl p-4 flex flex-col justify-between"
                    >
                      <div className="space-y-3">
                        <div className="h-32 w-full bg-zinc-200 dark:bg-zinc-800 rounded-lg overflow-hidden">
                          {exec.photo_url ? (
                            <img src={exec.photo_url} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center font-bold text-xl text-primary">{exec.name[0]}</div>
                          )}
                        </div>
                        <div>
                          <h3 className="font-bold text-sm text-foreground truncate">{exec.name}</h3>
                          <p className="text-xs font-bold text-primary dark:text-secondary uppercase">{exec.position}</p>
                          <p className="text-[10px] text-muted line-clamp-2 mt-1 leading-relaxed">{exec.bio}</p>
                        </div>
                      </div>

                      <div className="flex justify-end space-x-1 mt-4 pt-2 border-t border-border-color/60">
                        <button
                          onClick={() => openFormDialog('executives', exec)}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/20 rounded cursor-pointer"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete('executives', exec.id)}
                          className="p-1.5 text-red-650 hover:bg-red-50 dark:hover:bg-red-950/20 rounded cursor-pointer"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* RESOURCES MODULE */}
            {activeTab === 'resources' && (
              <div className="space-y-6 animate-fade-in">
                <div className="flex justify-between items-center border-b border-border-color pb-4">
                  <div>
                    <h1 className="text-2xl font-extrabold text-foreground">Manage Friday Khutbah & Downloads</h1>
                    <p className="text-xs text-muted">Upload and index PDFs in your Islamic Resources and Friday Khutbah database.</p>
                  </div>
                  <button
                    onClick={() => openFormDialog('resources')}
                    className="flex items-center space-x-2 px-4 py-2 text-xs font-bold text-white bg-primary hover:bg-primary/95 dark:bg-secondary dark:text-black rounded-lg cursor-pointer shadow"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Add PDF Resource</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {resources.map((res) => (
                    <div
                      key={res.id}
                      className="bg-card-bg border border-border-color p-4 rounded-xl flex justify-between items-center gap-4"
                    >
                      <div>
                        <h3 className="font-bold text-sm text-foreground">{res.title}</h3>
                        <p className="text-xs text-muted line-clamp-1">{res.content}</p>
                        <span className="text-[10px] text-primary dark:text-secondary font-bold truncate block max-w-sm">File: {res.pdf_url}</span>
                      </div>

                      <div className="flex space-x-1 shrink-0">
                        <button
                          onClick={() => openFormDialog('resources', res)}
                          className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/20 rounded cursor-pointer"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete('resources', res.id)}
                          className="p-2 text-red-650 hover:bg-red-50 dark:hover:bg-red-950/20 rounded cursor-pointer"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* SCRIPTURES MODULE (QURAN / HADITH) */}
            {activeTab === 'scriptures' && (
              <div className="space-y-8 animate-fade-in">
                
                {/* Quran Verses Block */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center border-b border-border-color pb-3">
                    <div>
                      <h2 className="text-xl font-bold text-foreground">Quran Verses pool</h2>
                      <p className="text-xs text-muted">Add verses for the daily automatic rotation.</p>
                    </div>
                    <button
                      onClick={() => openFormDialog('verses')}
                      className="flex items-center space-x-2 px-3 py-1.5 text-xs font-bold text-white bg-primary hover:bg-primary/95 dark:bg-secondary dark:text-black rounded-lg cursor-pointer shadow"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      <span>Add Verse</span>
                    </button>
                  </div>

                  <div className="space-y-3">
                    {verses.map((v) => (
                      <div key={v.id} className="bg-card-bg border border-border-color p-4 rounded-xl flex justify-between items-center gap-4">
                        <div className="space-y-1">
                          <p className="text-sm font-semibold text-right text-primary dark:text-secondary" dir="rtl">{v.arabic_text}</p>
                          <p className="text-xs text-foreground/80 italic">"{v.english_translation}"</p>
                          <span className="text-[10px] text-muted font-bold">Surah {v.surah_name} ({v.verse_number})</span>
                        </div>
                        <div className="flex space-x-1 shrink-0">
                          <button
                            onClick={() => openFormDialog('verses', v)}
                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete('verses', v.id)}
                            className="p-1.5 text-red-650 hover:bg-red-50 rounded"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Hadiths Block */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center border-b border-border-color pb-3">
                    <div>
                      <h2 className="text-xl font-bold text-foreground">Hadiths Pool</h2>
                      <p className="text-xs text-muted">Add authentic hadiths for daily rotation.</p>
                    </div>
                    <button
                      onClick={() => openFormDialog('hadiths')}
                      className="flex items-center space-x-2 px-3 py-1.5 text-xs font-bold text-white bg-primary hover:bg-primary/95 dark:bg-secondary dark:text-black rounded-lg cursor-pointer shadow"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      <span>Add Hadith</span>
                    </button>
                  </div>

                  <div className="space-y-3">
                    {hadiths.map((h) => (
                      <div key={h.id} className="bg-card-bg border border-border-color p-4 rounded-xl flex justify-between items-center gap-4">
                        <div className="space-y-1">
                          <p className="text-xs text-foreground/90">"{h.hadith_text}"</p>
                          <span className="text-[10px] text-muted font-bold">{h.source} - {h.reference}</span>
                        </div>
                        <div className="flex space-x-1 shrink-0">
                          <button
                            onClick={() => openFormDialog('hadiths', h)}
                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete('hadiths', h.id)}
                            className="p-1.5 text-red-650 hover:bg-red-50 rounded"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* SETTINGS MODULE */}
            {activeTab === 'settings' && (
              <div className="space-y-6 animate-fade-in max-w-3xl">
                <div className="border-b border-border-color pb-4">
                  <h1 className="text-2xl font-extrabold text-foreground">Website Settings</h1>
                  <p className="text-xs text-muted">Configure association details, logos, social networks, and copy text.</p>
                </div>

                <form onSubmit={handleSettingsSave} className="space-y-6 bg-card-bg border border-border-color p-6 sm:p-8 rounded-2xl shadow-sm">
                  {/* Logos Configuration */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-bold text-foreground uppercase tracking-wider">Logos Configuration</h3>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      {/* Logo slot 1 */}
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-foreground/80 block">GMSA National Logo</label>
                        <div className="flex items-center space-x-4">
                          <div className="h-16 w-16 bg-zinc-100 dark:bg-zinc-800 rounded border border-border-color flex items-center justify-center overflow-hidden shrink-0">
                            {settings.gmsaLogo ? <img src={settings.gmsaLogo} alt="" className="h-full w-full object-contain" /> : <span className="text-xs text-muted">No Image</span>}
                          </div>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleLogoUpload(e, 'gmsaLogo')}
                            className="text-xs text-muted"
                          />
                        </div>
                      </div>

                      {/* Logo slot 2 */}
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-foreground/80 block">HTU Logo</label>
                        <div className="flex items-center space-x-4">
                          <div className="h-16 w-16 bg-zinc-100 dark:bg-zinc-800 rounded border border-border-color flex items-center justify-center overflow-hidden shrink-0">
                            {settings.htuLogo ? <img src={settings.htuLogo} alt="" className="h-full w-full object-contain" /> : <span className="text-xs text-muted">No Image</span>}
                          </div>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleLogoUpload(e, 'htuLogo')}
                            className="text-xs text-muted"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="h-[1px] bg-border-color" />

                  {/* Contact Details */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-bold text-foreground uppercase tracking-wider">Contact Information</h3>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-foreground/80">Support Hotline Phone</label>
                        <input
                          type="text"
                          value={settings.phone || ''}
                          onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                          className="bg-light-gray dark:bg-muted-bg text-foreground placeholder-zinc-500 text-sm px-4 py-2 rounded-lg border border-transparent focus:outline-none focus:border-primary w-full"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-foreground/80">Official Support Email</label>
                        <input
                          type="email"
                          value={settings.email || ''}
                          onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                          className="bg-light-gray dark:bg-muted-bg text-foreground placeholder-zinc-500 text-sm px-4 py-2 rounded-lg border border-transparent focus:outline-none focus:border-primary w-full"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-foreground/80">Secretariat Office Location</label>
                      <input
                        type="text"
                        value={settings.address || ''}
                        onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                        className="bg-light-gray dark:bg-muted-bg text-foreground placeholder-zinc-500 text-sm px-4 py-2 rounded-lg border border-transparent focus:outline-none focus:border-primary w-full"
                      />
                    </div>
                  </div>

                  <div className="h-[1px] bg-border-color" />

                  {/* Social Networks */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-bold text-foreground uppercase tracking-wider">Social Networks Links</h3>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-foreground/80">Facebook Page</label>
                        <input
                          type="url"
                          value={settings.socialFacebook || ''}
                          onChange={(e) => setSettings({ ...settings, socialFacebook: e.target.value })}
                          className="bg-light-gray dark:bg-muted-bg text-foreground placeholder-zinc-500 text-sm px-4 py-2 rounded-lg border border-transparent focus:outline-none focus:border-primary w-full"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-foreground/80">Twitter / X Handle</label>
                        <input
                          type="url"
                          value={settings.socialTwitter || ''}
                          onChange={(e) => setSettings({ ...settings, socialTwitter: e.target.value })}
                          className="bg-light-gray dark:bg-muted-bg text-foreground placeholder-zinc-500 text-sm px-4 py-2 rounded-lg border border-transparent focus:outline-none focus:border-primary w-full"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-foreground/80">Instagram Profile</label>
                        <input
                          type="url"
                          value={settings.socialInstagram || ''}
                          onChange={(e) => setSettings({ ...settings, socialInstagram: e.target.value })}
                          className="bg-light-gray dark:bg-muted-bg text-foreground placeholder-zinc-500 text-sm px-4 py-2 rounded-lg border border-transparent focus:outline-none focus:border-primary w-full"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="h-[1px] bg-border-color" />

                  {/* Copy Texts */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-bold text-foreground uppercase tracking-wider">Footer Copy Info</h3>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-foreground/80">Footer Copyright Line</label>
                      <input
                        type="text"
                        value={settings.footerText || ''}
                        onChange={(e) => setSettings({ ...settings, footerText: e.target.value })}
                        className="bg-light-gray dark:bg-muted-bg text-foreground placeholder-zinc-500 text-sm px-4 py-2 rounded-lg border border-transparent focus:outline-none focus:border-primary w-full"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full flex items-center justify-center space-x-2 py-3 bg-primary dark:bg-secondary text-white dark:text-black font-bold rounded-xl shadow hover:scale-[1.01] hover:bg-primary/95 transition-all cursor-pointer"
                  >
                    <Save className="h-4 w-4" />
                    <span>Save Website Settings</span>
                  </button>
                </form>
              </div>
            )}
          </>
        )}
      </main>

      {/* =======================================================
          CRUD FORM MODAL DIALOG
          ======================================================= */}
      {dialog.open && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-card-bg border border-border-color rounded-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl relative">
            <h2 className="text-lg font-bold text-foreground mb-4 capitalize">
              {dialog.data.id ? 'Edit' : 'Add New'} {dialog.type === 'verses' ? 'Quran Verse' : dialog.type === 'hadiths' ? 'Hadith' : dialog.type.slice(0,-1)}
            </h2>
            
            <form onSubmit={handleFormSubmit} className="space-y-4">
              
              {/* SLIDESHOW FORM FIELDS */}
              {dialog.type === 'slideshow' && (
                <>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-foreground/80">Banner Title</label>
                    <input
                      type="text"
                      required
                      value={dialog.data.title || ''}
                      onChange={(e) => setDialog({ ...dialog, data: { ...dialog.data, title: e.target.value } })}
                      className="bg-light-gray dark:bg-muted-bg text-foreground text-sm px-4 py-2 rounded-lg w-full border border-transparent focus:outline-none focus:border-primary"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-foreground/80">Banner Description</label>
                    <textarea
                      required
                      value={dialog.data.description || ''}
                      onChange={(e) => setDialog({ ...dialog, data: { ...dialog.data, description: e.target.value } })}
                      className="bg-light-gray dark:bg-muted-bg text-foreground text-sm px-4 py-2 rounded-lg w-full border border-transparent focus:outline-none focus:border-primary"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-foreground/80 block">Slide Image File</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e, 'slideshow', 'image_url')}
                      className="text-xs text-muted"
                    />
                    {dialog.data.image_url && <img src={dialog.data.image_url} alt="" className="h-20 w-36 object-cover rounded mt-2 border border-border-color" />}
                  </div>
                </>
              )}

              {/* ANNOUNCEMENTS FORM FIELDS */}
              {dialog.type === 'announcements' && (
                <>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-foreground/80">Announcement Title</label>
                    <input
                      type="text"
                      required
                      value={dialog.data.title || ''}
                      onChange={(e) => setDialog({ ...dialog, data: { ...dialog.data, title: e.target.value } })}
                      className="bg-light-gray dark:bg-muted-bg text-foreground text-sm px-4 py-2 rounded-lg w-full border border-transparent focus:outline-none focus:border-primary"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-foreground/80">Announcement Content</label>
                    <textarea
                      required
                      rows="4"
                      value={dialog.data.content || ''}
                      onChange={(e) => setDialog({ ...dialog, data: { ...dialog.data, content: e.target.value } })}
                      className="bg-light-gray dark:bg-muted-bg text-foreground text-sm px-4 py-2 rounded-lg w-full border border-transparent focus:outline-none focus:border-primary"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-foreground/80 block">Banner Thumbnail Image (Optional)</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e, 'announcements', 'image_url')}
                      className="text-xs text-muted"
                    />
                    {dialog.data.image_url && <img src={dialog.data.image_url} alt="" className="h-20 w-36 object-cover rounded mt-2 border border-border-color" />}
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-foreground/80 block">Circular PDF Attachment (Optional)</label>
                    <input
                      type="file"
                      accept="application/pdf"
                      onChange={(e) => handleFileUpload(e, 'announcements', 'pdf_url')}
                      className="text-xs text-muted"
                    />
                    {dialog.data.pdf_url && <p className="text-[10px] text-primary mt-1 font-semibold truncate">Doc: {dialog.data.pdf_url}</p>}
                  </div>
                </>
              )}

              {/* EVENTS FORM FIELDS */}
              {dialog.type === 'events' && (
                <>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-foreground/80">Event Title</label>
                    <input
                      type="text"
                      required
                      value={dialog.data.title || ''}
                      onChange={(e) => setDialog({ ...dialog, data: { ...dialog.data, title: e.target.value } })}
                      className="bg-light-gray dark:bg-muted-bg text-foreground text-sm px-4 py-2 rounded-lg w-full border border-transparent focus:outline-none focus:border-primary"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-foreground/80">Description Details</label>
                    <textarea
                      required
                      value={dialog.data.description || ''}
                      onChange={(e) => setDialog({ ...dialog, data: { ...dialog.data, description: e.target.value } })}
                      className="bg-light-gray dark:bg-muted-bg text-foreground text-sm px-4 py-2 rounded-lg w-full border border-transparent focus:outline-none focus:border-primary"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-foreground/80">Program Date</label>
                      <input
                        type="date"
                        required
                        value={dialog.data.event_date || ''}
                        onChange={(e) => setDialog({ ...dialog, data: { ...dialog.data, event_date: e.target.value } })}
                        className="bg-light-gray dark:bg-muted-bg text-foreground text-sm px-4 py-2 rounded-lg w-full border border-transparent focus:outline-none focus:border-primary"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-foreground/80">Start Time</label>
                      <input
                        type="time"
                        required
                        value={dialog.data.event_time || ''}
                        onChange={(e) => setDialog({ ...dialog, data: { ...dialog.data, event_time: e.target.value } })}
                        className="bg-light-gray dark:bg-muted-bg text-foreground text-sm px-4 py-2 rounded-lg w-full border border-transparent focus:outline-none focus:border-primary"
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-foreground/80">Program Venue</label>
                    <input
                      type="text"
                      required
                      value={dialog.data.venue || ''}
                      onChange={(e) => setDialog({ ...dialog, data: { ...dialog.data, venue: e.target.value } })}
                      className="bg-light-gray dark:bg-muted-bg text-foreground text-sm px-4 py-2 rounded-lg w-full border border-transparent focus:outline-none focus:border-primary"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-foreground/80 block">Event Banner Image</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e, 'events', 'banner_url')}
                      className="text-xs text-muted"
                    />
                    {dialog.data.banner_url && <img src={dialog.data.banner_url} alt="" className="h-20 w-36 object-cover rounded mt-2 border border-border-color" />}
                  </div>
                </>
              )}

              {/* GALLERY FORM FIELDS */}
              {dialog.type === 'gallery' && (
                <>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-foreground/80">Photo Category</label>
                    <select
                      required
                      value={dialog.data.category || ''}
                      onChange={(e) => setDialog({ ...dialog, data: { ...dialog.data, category: e.target.value } })}
                      className="bg-light-gray dark:bg-muted-bg text-foreground text-sm px-4 py-2 rounded-lg w-full border border-transparent focus:outline-none focus:border-primary"
                    >
                      <option value="">Select Category...</option>
                      <option value="Ramadan">Ramadan</option>
                      <option value="Eid">Eid</option>
                      <option value="Conferences">Conferences</option>
                      <option value="Seminars">Seminars</option>
                      <option value="Community Service">Community Service</option>
                      <option value="General Activities">General Activities</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-foreground/80 block">Image File</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e, 'gallery', 'image_url')}
                      className="text-xs text-muted"
                    />
                    {dialog.data.image_url && <img src={dialog.data.image_url} alt="" className="h-20 w-36 object-cover rounded mt-2 border border-border-color" />}
                  </div>
                </>
              )}

              {/* EXECUTIVES FORM FIELDS */}
              {dialog.type === 'executives' && (
                <>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-foreground/80">Full Name</label>
                    <input
                      type="text"
                      required
                      value={dialog.data.name || ''}
                      onChange={(e) => setDialog({ ...dialog, data: { ...dialog.data, name: e.target.value } })}
                      className="bg-light-gray dark:bg-muted-bg text-foreground text-sm px-4 py-2 rounded-lg w-full border border-transparent focus:outline-none focus:border-primary"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-foreground/80">Executive Office Position</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. President, General Secretary"
                      value={dialog.data.position || ''}
                      onChange={(e) => setDialog({ ...dialog, data: { ...dialog.data, position: e.target.value } })}
                      className="bg-light-gray dark:bg-muted-bg text-foreground text-sm px-4 py-2 rounded-lg w-full border border-transparent focus:outline-none focus:border-primary"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-foreground/80">Biography details (Optional)</label>
                    <textarea
                      value={dialog.data.bio || ''}
                      onChange={(e) => setDialog({ ...dialog, data: { ...dialog.data, bio: e.target.value } })}
                      className="bg-light-gray dark:bg-muted-bg text-foreground text-sm px-4 py-2 rounded-lg w-full border border-transparent focus:outline-none focus:border-primary"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-foreground/80 block">Profile Photo File</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e, 'executives', 'photo_url')}
                      className="text-xs text-muted"
                    />
                    {dialog.data.photo_url && <img src={dialog.data.photo_url} alt="" className="h-20 w-20 object-cover rounded mt-2 border border-border-color" />}
                  </div>
                </>
              )}

              {/* RESOURCES FORM FIELDS */}
              {dialog.type === 'resources' && (
                <>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-foreground/80">Document Title</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Friday Sermon Summary - 08/06/2026"
                      value={dialog.data.title || ''}
                      onChange={(e) => setDialog({ ...dialog, data: { ...dialog.data, title: e.target.value } })}
                      className="bg-light-gray dark:bg-muted-bg text-foreground text-sm px-4 py-2 rounded-lg w-full border border-transparent focus:outline-none focus:border-primary"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-foreground/80">Short details (Optional)</label>
                    <textarea
                      value={dialog.data.content || ''}
                      onChange={(e) => setDialog({ ...dialog, data: { ...dialog.data, content: e.target.value } })}
                      className="bg-light-gray dark:bg-muted-bg text-foreground text-sm px-4 py-2 rounded-lg w-full border border-transparent focus:outline-none focus:border-primary"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-foreground/80 block">PDF Resource File</label>
                    <input
                      type="file"
                      accept="application/pdf"
                      onChange={(e) => handleFileUpload(e, 'resources', 'pdf_url')}
                      className="text-xs text-muted"
                    />
                    {dialog.data.pdf_url && <p className="text-[10px] text-primary mt-1 font-semibold truncate">Doc: {dialog.data.pdf_url}</p>}
                  </div>
                </>
              )}

              {/* SCRIPTURE VERSES FORM FIELDS */}
              {dialog.type === 'verses' && (
                <>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-foreground/80 block text-right">Arabic Text (الخط العربي)</label>
                    <textarea
                      required
                      dir="rtl"
                      rows="3"
                      value={dialog.data.arabic_text || ''}
                      onChange={(e) => setDialog({ ...dialog, data: { ...dialog.data, arabic_text: e.target.value } })}
                      className="bg-light-gray dark:bg-muted-bg text-foreground text-base px-4 py-2 rounded-lg w-full border border-transparent focus:outline-none focus:border-primary"
                      style={{ fontFamily: "Scheherazade New, serif" }}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-foreground/80">English Translation</label>
                    <textarea
                      required
                      value={dialog.data.english_translation || ''}
                      onChange={(e) => setDialog({ ...dialog, data: { ...dialog.data, english_translation: e.target.value } })}
                      className="bg-light-gray dark:bg-muted-bg text-foreground text-sm px-4 py-2 rounded-lg w-full border border-transparent focus:outline-none focus:border-primary"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-foreground/80">Surah Name</label>
                      <input
                        type="text"
                        required
                        value={dialog.data.surah_name || ''}
                        onChange={(e) => setDialog({ ...dialog, data: { ...dialog.data, surah_name: e.target.value } })}
                        className="bg-light-gray dark:bg-muted-bg text-foreground text-sm px-4 py-2 rounded-lg w-full border border-transparent focus:outline-none focus:border-primary"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-foreground/80">Verse Number</label>
                      <input
                        type="number"
                        required
                        value={dialog.data.verse_number || ''}
                        onChange={(e) => setDialog({ ...dialog, data: { ...dialog.data, verse_number: parseInt(e.target.value) } })}
                        className="bg-light-gray dark:bg-muted-bg text-foreground text-sm px-4 py-2 rounded-lg w-full border border-transparent focus:outline-none focus:border-primary"
                      />
                    </div>
                  </div>
                </>
              )}

              {/* HADITHS FORM FIELDS */}
              {dialog.type === 'hadiths' && (
                <>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-foreground/80">Hadith Text</label>
                    <textarea
                      required
                      rows="4"
                      value={dialog.data.hadith_text || ''}
                      onChange={(e) => setDialog({ ...dialog, data: { ...dialog.data, hadith_text: e.target.value } })}
                      className="bg-light-gray dark:bg-muted-bg text-foreground text-sm px-4 py-2 rounded-lg w-full border border-transparent focus:outline-none focus:border-primary"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-foreground/80">Collection Source</label>
                      <select
                        required
                        value={dialog.data.source || ''}
                        onChange={(e) => setDialog({ ...dialog, data: { ...dialog.data, source: e.target.value } })}
                        className="bg-light-gray dark:bg-muted-bg text-foreground text-sm px-4 py-2 rounded-lg w-full border border-transparent focus:outline-none focus:border-primary"
                      >
                        <option value="">Select...</option>
                        <option value="Sahih Bukhari">Sahih Bukhari</option>
                        <option value="Sahih Muslim">Sahih Muslim</option>
                        <option value="Riyad-us-Saliheen">Riyad-us-Saliheen</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-foreground/80">Book & Hadith Reference</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Book 1, Hadith 24"
                        value={dialog.data.reference || ''}
                        onChange={(e) => setDialog({ ...dialog, data: { ...dialog.data, reference: e.target.value } })}
                        className="bg-light-gray dark:bg-muted-bg text-foreground text-sm px-4 py-2 rounded-lg w-full border border-transparent focus:outline-none focus:border-primary"
                      />
                    </div>
                  </div>
                </>
              )}

              {/* Dialog actions */}
              <div className="flex justify-end space-x-2 pt-4 border-t border-border-color/60 mt-6">
                <button
                  type="button"
                  onClick={closeFormDialog}
                  className="px-5 py-2 text-xs font-bold text-foreground/80 hover:bg-light-gray rounded-lg border border-border-color cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploadProgress}
                  className="px-5 py-2 text-xs font-bold text-white bg-primary hover:bg-primary/95 dark:bg-secondary dark:text-black rounded-lg cursor-pointer"
                >
                  {uploadProgress ? 'Processing files...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
