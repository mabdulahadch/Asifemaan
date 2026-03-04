
# Urdu Poetry Portfolio — Ahmad Mushtaq Tribute

A database-backed poetry portfolio website inspired by the Rekhta.org poet page layout, dedicated to the poet Ahmad Mushtaq. It will support **both Urdu (Nastaliq) and Roman Urdu** with a script toggle.

---

## 1. Backend (Supabase Database)

Set up the following tables to store all content:

- **poets** — name, birth year, location, bio, photo URL, follower count
- **ghazals** — title (Roman + Urdu), full text, poet reference
- **couplets (sher)** — couplet text (Roman + Urdu), linked ghazal reference, poet reference
- **ebooks** — title, year, cover image URL, poet reference
- **articles** — title, content/link, poet reference
- **audio_entries** — title, audio URL, poet reference
- **video_entries** — title, video URL/embed, poet reference
- **image_shayari** — image URL, caption, poet reference

Sample data for Ahmad Mushtaq will be seeded into the database.

---

## 2. Top Navigation Bar

- Logo/site name on the left
- Navigation links: Poets, Sher, Dictionary, E-Books, Blog, Shayari, etc.
- Search bar with icon
- Language toggle (ENG / اردو) on the right
- Login button

---

## 3. Poet Hero Banner

A dark overlay banner section with:
- Circular poet photo on the left
- Poet name in large Nastaliq/stylized font
- Birth year and location (with calendar & pin icons)
- Follow button with follower count
- Short bio text
- Heart (favorite) and share icons

---

## 4. Tab Navigation

Horizontal scrollable tab bar with counts, matching the Rekhta layout:
- **ALL** | **Profile** | **Ghazal 80** | **Sher 72** | **E-Book 14** | **Top 20 Shayari** | **Image Shayari 26** | **Audio 38** | **Video 3** | **Article 1** | **Other** | **Translation**

Each tab loads its respective content section. The "ALL" tab shows a summary of every section.

---

## 5. Content Sections (ALL tab view)

### 5a. Ghazal Section
- Section heading "GHAZAL" with count
- List of ghazal titles (clickable) with heart/favorite icon
- "See All" link at bottom
- Clicking a ghazal opens a detail page with full text in both scripts

### 5b. Sher-o-Shayari Section
- Each couplet displayed in **both Urdu Nastaliq and Roman Urdu** (dual script display)
- Favorite and share action buttons per couplet
- "See Ghazal" link to view the full source ghazal

### 5c. Articles Section
- List of article titles, clickable

### 5d. Books / E-Books Section
- Grid of book cards with cover image, title, and year

### 5e. Image Shayari Section
- Grid of poetry images with captions

### 5f. Audio Section
- List of audio entries with play controls

### 5g. Video Section
- Embedded video players or thumbnails

---

## 6. Right Sidebar

- **Poet Navigation Links**: Index of Poets, Top Read Poets, Classical Poets, Women Poets, Young Poets, Poet Audios
- **Explore More** section with promotional content

---

## 7. Script Toggle (Urdu ↔ Roman)

- A global toggle in the nav bar to switch between Urdu Nastaliq script and Roman Urdu transliteration
- All poetry content renders in the selected script
- Nastaliq font (e.g., Jameel Noori Nastaleeq or Mehr Nastaliq Web via Google Fonts/CDN) for Urdu mode

---

## 8. Individual Poem Detail Page

- Full ghazal text displayed in both/selected script
- Poet attribution with link back to profile
- Favorite, share, and audio playback options

---

## 9. Responsive Design

- Mobile-friendly layout with collapsible sidebar
- Horizontal scroll for tabs on smaller screens
- Proper RTL support when in Urdu mode
