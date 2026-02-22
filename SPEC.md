# PokeTracker - Pokémon Collection Tracker

## Project Overview
- **Project Name**: PokeTracker
- **Type**: Static website (HTML/CSS/JS)
- **Core Functionality**: Track Pokémon collection across all 8 generations with catch counts, regional statistics, and detailed Pokémon information including Mega Evolutions and Gigantamax forms
- **Target Users**: Pokémon collectors and fans who want to track their collection digitally

## API Integration
- **Data Source**: [PokeAPI](https://pokeapi.co/)
- **Images**: PokeAPI sprites (official-artwork for full images)
- **Data Fetched**: Pokémon names, IDs, types, stats, sprites, forms (Mega, Gigantamax)

## UI/UX Specification

### Color Palette
- **Background**: `#1a1a2e` (deep navy)
- **Surface**: `#16213e` (dark blue)
- **Card**: `#0f3460` (medium blue)
- **Primary**: `#e94560` (vibrant red/pink - Pokéball inspired)
- **Secondary**: `#53d8fb` (electric blue)
- **Accent**: `#f9ed69` (yellow - Pokémon yellow)
- **Text Primary**: `#ffffff`
- **Text Secondary**: `#a0a0a0`

### Typography
- **Headings**: "Press Start 2P" (Google Fonts - pixel style, Pokémon themed)
- **Body**: "Inter", sans-serif
- **Sizes**: 
  - H1: 2rem
  - H2: 1.5rem
  - H3: 1.2rem
  - Body: 1rem

### Layout Structure

#### Global Navigation (sticky top)
- Logo: "PokeTracker" with Pokéball icon
- Nav Links: Home | Regions | Search | My Collection
- Mobile: Hamburger menu

#### Home Page (index.html)
- Hero section with total catch count
- 8 region cards (Kanto, Johto, Hoenn, Sinnoh, Unova, Kalos, Alola, Galar)
- Each region card shows: Region name, map image, catch count, Pokémon count

#### Region Pages (region.html?region=kanto)
- Region header with map
- Catch count stats
- Grid of Pokémon (filterable by type, caught/not caught)
- Click on Pokémon to view details

#### Pokémon Detail Page (pokemon.html?id=25)
- Large sprite image
- Name, ID, types
- Stats display (HP, Attack, Defense, etc.)
- Forms section (Mega, Gigantamax, regional variants)
- Catch/Uncatch button
- Evolution chain link

#### Search Page (search.html)
- Search bar with autocomplete
- Filter by: Generation, Type, Region, Caught status
- Results grid

#### Collection Page (collection.html)
- Filter tabs: All | Caught | Uncaught
- Sort options: By ID, By Name, By Type
- Statistics dashboard

### Responsive Breakpoints
- Mobile: < 768px (single column, stacked cards)
- Tablet: 768px - 1024px (2 columns)
- Desktop: > 1024px (4 columns for Pokémon grid)

### Components

#### Pokémon Card
- Thumbnail image
- Name
- ID number
- Types (badges)
- Caught indicator (checkmark or empty)
- Hover: Scale up slightly, show "View Details"

#### Region Map Card
- Map image
- Region name
- Catch progress bar
- Total/Collected count

#### Search Autocomplete
- Dropdown with matching Pokémon
- Shows sprite + name + type
- Keyboard navigation support

### Animations
- Page transitions: Fade in (0.3s)
- Cards: Hover scale (1.05)
- Buttons: Ripple effect on click
- Loading: Pokéball spinning animation

## Functionality Specification

### Core Features

1. **Catch Tracking**
   - Click to catch/uncatch any Pokémon
   - Persist to localStorage
   - Visual feedback on catch

2. **Regional Statistics**
   - Track catches per region (Gen 1-8 maps to regions)
   - Kanto: Gen 1 (1-151)
   - Johto: Gen 2 (152-251)
   - Hoenn: Gen 3 (252-386)
   - Sinnoh: Gen 4 (387-493)
   - Unova: Gen 5 (494-649)
   - Kalos: Gen 6 (650-721)
   - Alola: Gen 7 (722-809)
   - Galar: Gen 8 (810-905)

3. **Mega Evolution Support**
   - Include Mega forms (e.g., Mega Venusaur, Mega Charizard X/Y)
   - Display in forms section
   - Can be marked as caught separately

4. **Gigantamax Support**
   - Include Gigantamax forms
   - Display in forms section
   - Can be marked as caught separately

5. **Search**
   - Real-time search by name
   - Filter by type, generation, caught status
   - Show results instantly

6. **Navigation**
   - Breadcrumb navigation on detail pages
   - Quick jump to regions
   - Back to top button

### Data Handling
- **API Caching**: Cache fetched data in localStorage
- **Persistence**: All catches saved to localStorage
- **Initial Load**: Fetch all Pokémon list, then lazy-load details

### Edge Cases
- Handle API failures gracefully with retry
- Show placeholder for missing images
- Handle Pokémon with no forms gracefully

## Regions & Maps

### Region Data
| Region | Generation | Pokémon Range | Map Image |
|--------|------------|----------------|-----------|
| Kanto | Gen 1 | 1-151 | kanto-map.png |
| Johto | Gen 2 | 152-251 | johto-map.png |
| Hoenn | Gen 3 | 252-386 | hoenn-map.png |
| Sinnoh | Gen 4 | 387-493 | sinnoh-map.png |
| Unova | Gen 5 | 494-649 | unova-map.png |
| Kalos | Gen 6 | 650-721 | kalos-map.png |
| Alola | Gen 7 | 722-809 | alola-map.png |
| Galar | Gen 8 | 810-905 | galar-map.png |

### Map Sources
- Use placeholder/colored maps generated with CSS gradients representing each region's colors

## File Structure
```
/poketracker
├── index.html          # Home page
├── region.html         # Region detail page
├── pokemon.html        # Pokémon detail page
├── search.html         # Search page
├── collection.html     # My Collection page
├── css/
│   └── styles.css      # All styles
├── js/
│   ├── app.js          # Main application logic
│   ├── api.js          # PokeAPI integration
│   ├── storage.js      # localStorage handling
│   └── router.js       # Simple routing
├── assets/
│   └── maps/           # Region map images
└── README.md
```

## Acceptance Criteria

### Visual Checkpoints
- [ ] Dark theme with red/pink accent is visible
- [ ] Navigation is sticky and works on mobile
- [ ] Region cards display with maps
- [ ] Pokémon cards show images, names, types
- [ ] Caught Pokémon have visual indicator
- [ ] Responsive layout works on mobile/tablet/desktop

### Functional Checkpoints
- [ ] Can view all 905+ Pokémon
- [ ] Can catch/uncatch Pokémon
- [ ] Catch count persists after refresh
- [ ] Search returns relevant results
- [ ] Can navigate between regions
- [ ] Can view Pokémon details
- [ ] Mega and Gigantamax forms display
- [ ] Region catch counts are accurate

### Performance
- [ ] Initial page load < 3 seconds
- [ ] Smooth scrolling and animations
- [ ] No console errors on normal usage
