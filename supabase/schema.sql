-- ====================================================================
-- GMSA-HTU OFFICIAL WEBSITE - DATABASE SCHEMA DEFINITIONS
-- Run these statements in the Supabase SQL Editor to configure tables.
-- ====================================================================

-- 1. Enable UUID Extension
create extension if not exists "uuid-ossp";

-- 2. Profiles Table (Admin/Visitor Roles)
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text not null,
  role text not null default 'visitor', -- 'admin' or 'visitor'
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Slideshow Table (Homepage Slider)
create table public.slideshow (
  id uuid default gen_random_uuid() primary key,
  image_url text not null,
  display_order integer not null default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. Announcements Table
create table public.announcements (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  content text not null,
  image_url text,
  pdf_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 5. Events Table
create table public.events (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  description text not null,
  event_date date not null,
  event_time time not null,
  venue text not null,
  banner_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 6. Gallery Table
create table public.gallery (
  id uuid default gen_random_uuid() primary key,
  image_url text not null,
  category text not null, -- 'Ramadan', 'Eid', 'Conferences', 'Seminars', 'Community Service', 'General Activities'
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 7. Quran Verses Table
create table public.quran_verses (
  id uuid default gen_random_uuid() primary key,
  arabic_text text not null,
  english_translation text not null,
  surah_name text not null,
  verse_number integer not null
);

-- 8. Hadiths Table
create table public.hadiths (
  id uuid default gen_random_uuid() primary key,
  hadith_text text not null,
  source text not null,
  reference text not null
);

-- 9. Executives Table
create table public.executives (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  position text not null,
  photo_url text,
  bio text
);

-- 10. Khutbah Notes Table
create table public.khutbah_notes (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  content text,
  pdf_url text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 11. Contacts Table (User Form Submissions)
create table public.contacts (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  email text not null,
  subject text not null,
  message text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 12. Website Settings Table
create table public.website_settings (
  key text primary key,
  value jsonb not null
);

-- ==========================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==========================================

-- Enable Row Level Security on all tables
alter table public.profiles enable row level security;
alter table public.slideshow enable row level security;
alter table public.announcements enable row level security;
alter table public.events enable row level security;
alter table public.gallery enable row level security;
alter table public.quran_verses enable row level security;
alter table public.hadiths enable row level security;
alter table public.executives enable row level security;
alter table public.khutbah_notes enable row level security;
alter table public.contacts enable row level security;
alter table public.website_settings enable row level security;

-- Setup Admin Policy Helper Functions
create or replace function public.is_admin()
returns boolean as $$
begin
  return exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
end;
$$ language plpgsql security definer;

-- Profiles: Admin read/write. Public read.
create policy "Allow public read profile details" on public.profiles for select using (true);
create policy "Allow admin edit profiles" on public.profiles for all using (public.is_admin());

-- Slideshow: Public read. Admin write.
create policy "Allow public read slideshow" on public.slideshow for select using (true);
create policy "Allow admin write slideshow" on public.slideshow for all using (public.is_admin());

-- Announcements: Public read. Admin write.
create policy "Allow public read announcements" on public.announcements for select using (true);
create policy "Allow admin write announcements" on public.announcements for all using (public.is_admin());

-- Events: Public read. Admin write.
create policy "Allow public read events" on public.events for select using (true);
create policy "Allow admin write events" on public.events for all using (public.is_admin());

-- Gallery: Public read. Admin write.
create policy "Allow public read gallery" on public.gallery for select using (true);
create policy "Allow admin write gallery" on public.gallery for all using (public.is_admin());

-- Quran Verses: Public read. Admin write.
create policy "Allow public read quran_verses" on public.quran_verses for select using (true);
create policy "Allow admin write quran_verses" on public.quran_verses for all using (public.is_admin());

-- Hadiths: Public read. Admin write.
create policy "Allow public read hadiths" on public.hadiths for select using (true);
create policy "Allow admin write hadiths" on public.hadiths for all using (public.is_admin());

-- Executives: Public read. Admin write.
create policy "Allow public read executives" on public.executives for select using (true);
create policy "Allow admin write executives" on public.executives for all using (public.is_admin());

-- Khutbah Notes: Public read. Admin write.
create policy "Allow public read khutbah_notes" on public.khutbah_notes for select using (true);
create policy "Allow admin write khutbah_notes" on public.khutbah_notes for all using (public.is_admin());

-- Contacts: Public can insert. Admin can read/delete.
create policy "Allow public insert contacts" on public.contacts for insert with check (true);
create policy "Allow admin access contacts" on public.contacts for all using (public.is_admin());

-- Website Settings: Public read. Admin write.
create policy "Allow public read settings" on public.website_settings for select using (true);
create policy "Allow admin write settings" on public.website_settings for all using (public.is_admin());

-- ==========================================
-- DEFAULT SEED DATA
-- ==========================================

-- Insert Default Settings
insert into public.website_settings (key, value) values
('gmsaLogo', '""'),
('htuLogo', '""'),
('phone', '"\\+233 24 123 4567"'),
('email', '"info@gmsahtu.com"'),
('address', '"Ho Technical University Campus, GMSA Secretariat, Ho, Volta Region, Ghana"'),
('socialFacebook', '"https://facebook.com/gmsahtu"'),
('socialTwitter', '"https://twitter.com/gmsahtu"'),
('socialInstagram', '"https://instagram.com/gmsahtu"'),
('footerText', '"© 2026 Ghana Muslim Students'' Association - Ho Technical University Branch. All rights reserved."')
on conflict (key) do nothing;

-- Insert default Quran verses
insert into public.quran_verses (arabic_text, english_translation, surah_name, verse_number) values
('إِنَّ مَعَ الْعُسْرِ يُسْرًا', 'Indeed, with hardship [will be] ease.', 'Al-Inshirah', 6),
('وَاعْتَصِمُوا بِحَبْلِ اللَّهِ جَمِيعًا وَلَا تَفَرَّقُوا', 'And hold firmly to the rope of Allah all together and do not become divided.', 'Ali ''Imran', 103),
('ادْعُ إِلَىٰ سَبِيلِ رَبِّكَ بِالْحِكْمَةِ وَالْمَوْعِظَةِ الْحَسَنَةِ', 'Invite to the way of your Lord with wisdom and good instruction.', 'An-Nahl', 125),
('رَبِّ زِدْنِي عِلْمًا', 'My Lord, increase me in knowledge.', 'Taha', 114),
('إِنَّ اللَّهَ مَعَ الصَّابِرِينَ', 'Indeed, Allah is with the patient.', 'Al-Baqarah', 153);

-- Insert default Hadiths
insert into public.hadiths (hadith_text, source, reference) values
('The best among you are those who learn the Qur''an and teach it.', 'Sahih Bukhari', 'Book 66, Hadith 45'),
('Actions are to be judged only by intentions, and a man will have only what he intended.', 'Sahih Bukhari & Sahih Muslim', 'Hadith 1, 40 Hadith Nawawi'),
('None of you truly believes until he loves for his brother what he loves for himself.', 'Sahih Bukhari & Sahih Muslim', 'Hadith 13, 40 Hadith Nawawi'),
('Whoever follows a path in the pursuit of knowledge, Allah will make a path to Paradise easy for him.', 'Sahih Muslim', 'Book 39, Hadith 6518');
