# PokéTracker - Your Personal Pokémon Collection Manager

Track your Pokémon collection from Generation 1 (Kanto) through Generation 9 (Paldea). Mark Pokémon as owned, favorite your favorites, and track your progress across all regions.

## Table of Contents

- [Features](#features)
- [Navigation](#navigation)
- [Collection Management](#collection-management)
- [Searching](#searching)
- [Gigantamax Forms](#gigantamax-forms)
- [Variant Forms](#variant-forms)
- [Technical Info](#technical-info)

## Features

### Collection Tracking
- Mark any Pokémon as "owned" with a single tap
- Track owned Pokémon across all 9 generations
- View progress bars showing completion percentage per generation
- See total collection count in the header
- **Quick access:** Click "Owned" on home page to see all owned Pokémon

### Favorites System
- Star your favorite Pokémon for quick access
- Favorites appear in a dedicated tab
- **Quick access:** Click "Favorites" on home page to jump to favorites
- Removing a Pokémon from owned also removes it from favorites

### Search
- Search by Pokémon name (partial match)
- Search by Pokémon number
- Searches across all 1025 Pokémon
- Results show up to 20 matches
- Fast search with real-time results as you type

### Generation Pages
- Browse Pokémon by region (Kanto through Paldea)
- Displayed in a 3x3 grid on desktop
- Each generation shows: Kanto (151), Johto (100), Hoenn (135), Sinnoh (107), Unova (156), Kalos (72), Alola (88), Galar (96), Paldea (120)



## Navigation

### Home Page
- Click any generation card to view that region's Pokémon
- Click "Owned" to see all collected Pokémon
- Click "Favorites" to see your favorites
- Large generation cards with region names and progress bars

### Generation Page
- Use **Prev / Next** buttons to jump between generations
- Filter buttons: All | Owned | Favorites | Missing
- Sort buttons: # (by number) | A-Z (by name) | Type

### Detail Page
- **Navigation:** Previous | Home | Back to Generation | Next
- Breadcrumb showing: Home > Region > Pokémon Name
- Swipe left/right on mobile to navigate between Pokémon
- Variant/Form dropdown for Pokémon with multiple forms


## Collection Management

### Marking Pokémon as Owned
1. Tap/click any Pokémon card to view details
2. Tap the "Add to Collection" button
3. The button turns green with "Owned" label
4. Collection stats update automatically

### Viewing Collection Stats
- Home page: Click "Owned" or "Favorites" for quick access
- Each generation card shows owned/total and percentage
- Header displays total collection count


## Searching

### Search Examples
```
Searching "pikachu"     → Shows Pikachu
Searching "charizard"   → Shows Charizard
Searching "25"          → Shows Pikachu (#25)
Searching "1000"        → Shows Gholdengo (#1000)
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


### Storage
- **localStorage** is used to store:
  - Owned Pokémon IDs
  - Favorited Pokémon IDs
  - Recently viewed Pokémon (last 20)



## Credits
- **PokéAPI** - For providing all Pokémon data
