# PokéTracker - Your Personal Pokémon Collection Manager

Track your Pokémon collection from Generation 1 (Kanto) through Generation 8 (Galar). Mark Pokémon as owned, favorite your favorites, and track your progress across all regions.

## Table of Contents

- [Getting Started](#getting-started)
- [Features](#features)
- [Navigation](#navigation)
- [Mobile vs Desktop](#mobile-vs-desktop)
- [Collection Management](#collection-management)
- [Searching & Filtering](#searching--filtering)
- [Gigantamax Forms](#gigantamax-forms)
- [Tips & Tricks](#tips--tricks)
- [Technical Info](#technical-info)

---

## Getting Started

### Opening the App

**Desktop:**
- Open `index.html` in any modern web browser (Chrome, Firefox, Safari, Edge)

**Mobile (APK):**
- Install the APK on your Android device
- Or add to home screen as a PWA (see below)

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
- Track owned Pokémon across all 8 generations
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
- Browse Pokémon by region (Kanto through Galar)
- Each generation shows: Kanto (151), Johto (100), Hoenn (135), Sinnoh (107), Unova (156), Kalos (72), Alola (88), Galar (96)

---

## Navigation

### Desktop Navigation

**Header:**
- Click the PokéTracker logo to return to home
- Collection stats displayed in the top-right corner

**Home Page:**
- Click any generation card to view that region's Pokémon
- Progress bar shows owned/total for each generation

**Generation Page:**
- Use **Prev / Next** buttons to jump between generations
- Filter buttons: All | Owned | Favorites | Missing
- Sort buttons: # (by number) | A-Z (by name) | Type

**Detail Page:**
- Click any Pokémon card to view details
- Use **Previous / Next** buttons to browse sequentially
- Back link returns to the generation page

### Mobile Navigation

**Bottom Tab Bar:**
The app features a bottom navigation bar with 4 tabs:
- 🏠 **Home** - Region selection
- 🔍 **Search** - Find Pokémon
- ⭐ **Favorites** - Your starred Pokémon
- 🕐 **Recent** - Recently viewed

**Swipe Navigation:**
- On detail pages, swipe left/right to navigate between Pokémon

**Pull to Refresh:**
- Pull down on any generation page to reload the Pokémon list

---

## Mobile vs Desktop

| Feature | Mobile | Desktop |
|---------|--------|---------|
| Navigation | Bottom tabs | Header + floating menu |
| Browse Pokémon | Swipe left/right | Prev/Next buttons |
| Refresh | Pull down | Browser refresh |
| Touch targets | 48px minimum | Standard |
| Infinite scroll | Auto-loads | Auto-loads |
| Haptic feedback | Yes | No |
| Share button | Native share | Clipboard copy |

---

## Collection Management

### Marking Pokémon as Owned

1. **From Generation Page:**
   - Tap/click any Pokémon card
   - On the detail page, tap the "Add to Collection" button
   - The button turns green with "Owned" label
   - On mobile, you'll feel a haptic vibration

2. **Unowning a Pokémon:**
   - Tap the same button again to remove from collection
   - If the Pokémon was favorited, it will also be unfavorited

### Viewing Collection Stats

**Home Page:**
- Each generation card shows: Owned / Total (Percentage)
- Summary stats at the top: Owned count and Favorites count

**Generation Page:**
- Header shows both total and current generation stats
- Large summary card at the top displays:
  - Generation name
  - Owned count
  - Total count
  - Completion percentage
  - Visual progress bar

---

## Searching & Filtering

### Search Examples

```
Searching "pikachu"     → Shows Pikachu
Searching "fire"         → Shows all Fire-type Pokémon  
Searching "dragon"       → Shows all Dragon-type Pokémon
Searching "25"            → Shows Pikachu (#25)
```

### Filter Options

On generation pages, use the filter bar:

- **All** - Shows all Pokémon in the generation
- **Owned** - Shows only Pokémon you've marked as owned
- **Favorites** - Shows only your favorited Pokémon
- **Missing** - Shows Pokémon you don't own yet

### Sort Options

- **#** - Sort by Pokédex number (default)
- **A-Z** - Sort alphabetically by name
- **Type** - Sort by primary type

---

## Gigantamax Forms

Many Pokémon have Gigantamax forms available in Pokémon Sword & Shield.

### How to View Gigantamax Forms

1. Open any Pokémon's detail page
2. If the Pokémon has a Gigantamax form, you'll see a **⚡ Gigantamax** button
3. Tap/click the button to toggle between normal and Gigantamax artwork
4. The button stays purple when Gigantamax is active
5. The Pokémon's name will show "(Gigantamax)" when active

### Which Pokémon Have Gigantamax?

- All Generation 1 Pokémon (Bulbasaur through Mewtwo)
- Many popular Pokémon: Pikachu, Eevee, Snorlax, Charizard, etc.
- All Generation 8 Pokémon (Zacian, Zamazenta, Eternatus, etc.)

---

## Tips & Tricks

### Pro Tips

1. **Quick Collection Tracking:**
   - Use the "Missing" filter to see what you need to complete a generation
   - Focus on one generation at a time

2. **Efficient Searching:**
   - Use type names like "fire", "water", "electric", "grass", "psychic", "ghost", "dragon"
   - Search is case-insensitive

3. **Mobile Experience:**
   - Enable haptic feedback by using the app on a mobile device
   - Use swipe navigation to quickly browse through Pokémon

4. **Progress Motivation:**
   - Check the generation summary cards to see your completion percentage
   - Aim for 100% in each generation!

5. **Sharing:**
   - Use the share button on detail pages to show off your favorite Pokémon
   - Works best on mobile with native share dialog

### Common Questions

**Q: Does my collection save?**
A: Yes! Your collection is saved in your browser's local storage. It persists across sessions but won't transfer between different browsers or devices.

**Q: How do I reset my collection?**
A: There's no reset button in the app. To reset, you'd need to clear your browser's local storage for the site.

**Q: Can I export my collection?**
A: Not currently, but your data is stored locally and will persist as long as you don't clear your browser data.

**Q: Why do some Pokémon images look different?**
A: The app fetches images from PokéAPI. Some have multiple sprites available - official artwork, animated versions, and Gigantamax forms.

---

## Technical Info

### Data Source
All Pokémon data is fetched from [PokéAPI](https://pokeapi.co/), a free RESTful API for Pokémon data.

### Images
Pokémon sprites and artwork are loaded from:
- [PokéAPI Sprites Repository](https://github.com/PokeAPI/sprites)
- Official artwork from Pokémon HOME (via PokéAPI)

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

### API Endpoints Used
```
https://pokeapi.co/api/v2/pokemon/{id}
https://pokeapi.co/api/v2/pokemon-species/{id}
```

---

## Building the APK

If you're a developer and want to build the Android APK:

```bash
# Install dependencies
npm install

# Sync web assets
npx cap sync android

# Open in Android Studio
npx cap open android

# In Android Studio: Build → Build APK
```

The APK will be generated at:
`android/app/build/outputs/apk/debug/app-debug.apk`

---

## Credits

- **PokéAPI** - For providing all Pokémon data
- **PokéAPI Sprites** - For the ama
