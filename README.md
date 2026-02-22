# PokéTracker - Your Personal Pokémon Collection Manager

Track your Pokémon collection from Generation 1 (Kanto) through Generation 9 (Paldea). Mark Pokémon as owned, favorite your favorites, and track your progress across all regions.

## Table of Contents

- [Getting Started](#getting-started)
- [Features](#features)
- [Navigation](#navigation)
- [Collection Management](#collection-management)
- [Searching](#searching)
- [Gigantamax Forms](#gigantamax-forms)
- [Variant Forms](#variant-forms)
- [Technical Info](#technical-info)

---

## Getting Started

### Opening the App

**Web (Recommended):**
- Open `index.html` in any modern web browser (Chrome, Firefox, Safari, Edge)
- Or host on GitHub Pages for easy access anywhere

### Adding to Home Screen (PWA)

**iOS (Safari):**
1. Visit the website
2. Tap the **Share** button
3. Select **Add to Home Screen**

**Android (Chrome):**
1. Visit the website
2. Tap the **menu** (three dots)
3. Select **Add to Home Screen** or **Install App**

---

## Features

### Collection Tracking
- Mark any Pokémon as "owned" with a single tap
- Track owned Pokémon across all 9 generations
- View progress bars showing completion percentage per generation
- See total collection count in the header

### Favorites System
- Star your favorite Pokémon for quick access
- Favorites appear in a dedicated tab
- Removing a Pokémon from owned also removes it from favorites

### Recently Viewed
- Automatically tracks the last 20 Pokémon you viewed
- Quick access to revisit Pokémon you've explored

### Search
- Search by Pokémon name (partial match)
- Search by type (e.g., "fire", "water", "dragon")
- Results show up to 20 matches

### Generation Pages
- Browse Pokémon by region (Kanto through Paldea)
- Each generation shows: Kanto (151), Johto (100), Hoenn (135), Sinnoh (107), Unova (156), Kalos (72), Alola (88), Galar (96), Paldea (120)

---

## Navigation

### Desktop Navigation
- **Header:** Logo (left), Search bar (center), Collection stats (right)
- **Hamburger menu:** Click ☰ for quick navigation
- Click any generation card to view that region's Pokémon
- Use **Prev / Next** buttons to jump between generations
- Filter buttons: All | Owned | Favorites | Missing
- Sort buttons: # (by number) | A-Z (by name) | Type

### Mobile Navigation
- **Bottom Tab Bar:** Home | Search | Favorites | Recent
- **Hamburger menu:** Click ☰ in header for navigation
- Swipe left/right on detail pages to navigate between Pokémon

---

## Collection Management

### Marking Pokémon as Owned
1. Tap/click any Pokémon card to view details
2. Tap the "Add to Collection" button
3. The button turns green with "Owned" label
4. Collection stats update automatically

### Viewing Collection Stats
- Home page shows owned count and favorites count
- Each generation card shows owned/total and percentage
- Header displays total collection count

---

## Searching

### Search Examples
```
Searching "pikachu"     → Shows Pikachu
Searching "fire"        → Shows all Fire-type Pokémon  
Searching "dragon"      → Shows all Dragon-type Pokémon
Searching "25"          → Shows Pikachu (#25)
```

### Filter Options
- **All** - Shows all Pokémon in the generation
- **Owned** - Shows only Pokémon you've marked as owned
- **Favorites** - Shows only your favorited Pokémon
- **Missing** - Shows Pokémon you don't own yet

---

## Gigantamax Forms

Many Pokémon have Gigantamax forms available in Pokémon Sword & Shield.

### How to View Gigantamax Forms
1. Open any Pokémon's detail page
2. If the Pokémon has a Gigantamax form, you'll see a **⚡ Gigantamax** button
3. Tap/click the button to toggle between normal and Gigantamax artwork

---

## Variant Forms

Pokémon with multiple forms (like Deoxys, Rotom, Giratina, etc.) have a dropdown selector on their detail page.

### How to View Variants
1. Open any Pokémon's detail page
2. If the Pokémon has multiple forms, you'll see a **Form / Variant** dropdown
3. Select any variant to view that form's details
4. The dropdown lets you switch between all available forms

---

## Technical Info

### Data Source
All Pokémon data is fetched from [PokéAPI](https://pokeapi.co/), a free RESTful API for Pokémon data.

### Pokémon Count
- Total: 1025 Pokémon (Gen 1-9)
- Generation 9 (Paldea): #906-1025

### Storage
- **localStorage** is used to store:
  - Owned Pokémon IDs
  - Favorited Pokémon IDs
  - Recently viewed Pokémon (last 20)

### Browser Support
- Chrome (recommended)
- Firefox
- Safari
- Edge
- Mobile browsers (iOS Safari, Android Chrome)

### Files to Upload
```
├── index.html
├── search.html
├── favorites.html
├── recent.html
├── generation.html
├── pokemon.html
├── manifest.json
├── service-worker.js
├── css/
│   └── styles.css
└── js/
    ├── main.js
    ├── api.js
    └── storage.js
```

---

## Credits
- **PokéAPI** - For providing all Pokémon data
- **PokéAPI Sprites** - For the amazing sprite collection
