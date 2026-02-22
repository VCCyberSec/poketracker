# Pokémon Collection Tracker - Specification

## 1. Project Overview

- **Project Name**: PokéTracker
- **Type**: Multi-page website/webapp
- **Core Functionality**: A personal Pokémon collection tracker that displays Pokémon from Generations 1-8, allows users to mark which Pokémon they own, and provides detailed individual Pokémon pages with images fetched from PokéAPI.
- **Target Users**: Pokémon collectors and enthusiasts who want to track their collection

## 2. UI/UX Specification

### Layout Structure

**Main Pages:**
- `index.html` - Landing page with generation selection
- `generation.html` - Reusable page for displaying Pokémon by generation (uses URL params)
- `pokemon.html` - Individual Pokémon detail page (uses URL params)

**Page Sections:**
- Header: Fixed navigation with logo and collection stats
- Main Content: Grid of Pokémon cards or generation selection
- Footer: Credits and data source attribution

**Responsive Breakpoints:**
- Mobile: < 640px (2 columns)
- Tablet: 640px - 1024px (4 columns)
- Desktop: > 1024px (6 columns)

### Visual Design

**Color Palette:**
- Background Primary: `#0f0f23` (deep space blue)
- Background Secondary: `#1a1a2e` (dark navy)
- Card Background: `#16213e` (midnight blue)
- Accent Primary: `#e94560` (pokéball red)
- Accent Secondary: `#f9ed69` (lightning yellow)
- Text Primary: `#eaeaea` (off-white)
- Text Secondary: `#a0a0a0` (muted gray)
- Owned Badge: `#4ecca3` (mint green)
- Unowned: `#ff6b6b` (coral red)

**Typography:**
- Headings: "Press Start 2P" (Google Fonts - pixel art style)
- Body: "Exo 2" (Google Fonts - clean, futuristic)
- Logo: 24px
- Page Titles: 18px
- Card Names: 14px
- Body Text: 14px

**Spacing System:**
- Base unit: 8px
- Card padding: 16px
- Grid gap: 16px
- Section margins: 32px

**Visual Effects:**
- Card hover: Scale 1.05, box-shadow glow
- Pokémon images: Subtle floating animation
- Page transitions: Fade in (0.3s)
- Owned indicator: Pulsing glow effect

### Components

**Generation Card (Index Page):**
- Region name with icon
- Generation number
- Pokémon count
- Background gradient unique to region
- Hover: Lift effect with glow

**Pokémon Card (Generation Page):**
- Pokémon sprite/image (from PokéAPI)
- Pokémon name
- Pokémon number (#001)
- Owned checkbox/indicator
- Type badges
- Hover: Scale up, glow effect

**Pokémon Detail Page:**
- Large Pokémon image (animated sprite if available)
- Pokémon name and number
- Type(s) with colored badges
- Base stats (HP, Attack, Defense, Sp.Atk, Sp.Def, Speed)
- Height/Weight
- Abilities
- Owned toggle button
- Back to generation link

**Header:**
- Logo (left)
- Total collection count / Total Pokémon (center)
- Theme toggle (optional)

## 3. Functionality Specification

### Core Features

1. **Generation Selection (Index)**
   - Display 8 generation cards
   - Each card links to generation.html with ?gen=X parameter
   - Show region name, generation number, Pokémon count

2. **Generation Pokémon Grid**
   - Fetch all Pokémon for the selected generation
   - Display in responsive grid
   - Show owned/unowned status
   - Click card to go to detail page
   - Filter: All / Owned / Missing

3. **Individual Pokémon Page**
   - Fetch Pokémon data from PokéAPI
   - Display all stats, types, abilities
   - Toggle owned status (saved to localStorage)
   - Show shiny variant if available

4. **Collection Tracking**
   - Store owned Pokémon in localStorage
   - Persist across sessions
   - Show collection progress on index page
   - Calculate completion percentage per generation

### Data Handling

- **PokéAPI Endpoints:**
  - Generations: `https://pokeapi.co/api/v2/generation/{id}`
  - Pokémon: `https://pokeapi.co/api/v2/pokemon/{id}`
  - Pokémon species: `https://pokeapi.co/api/v2/pokemon-species/{id}`

- **Generation Ranges:**
  - Gen 1 (Kanto): #001 - #151
  - Gen 2 (Johto): #152 - #251
  - Gen 3 (Hoenn): #252 - #386
  - Gen 4 (Sinnoh): #387 - #493
  - Gen 5 (Unova): #494 - #649
  - Gen 6 (Kalos): #650 - #721
  - Gen 7 (Alola): #722 - #809
  - Gen 8 (Galar): #810 - #905

- **localStorage Schema:**
  ```json
  {
    "poketracker_owned": ["1", "4", "7", "25", ...]
  }
  ```

### Edge Cases
- Handle API failures gracefully with error message
- Show loading states while fetching
- Handle Pokémon with missing sprites
- Support direct linking to Pokémon by ID

## 4. Acceptance Criteria

### Visual Checkpoints
- [ ] Index page shows all 8 generations with distinct region styling
- [ ] Generation page displays Pokémon in responsive grid
- [ ] Pokémon cards show image, name, number, types, owned status
- [ ] Detail page shows complete Pokémon information
- [ ] Owned Pokémon have visible mint green indicator
- [ ] Dark theme is consistent across all pages
- [ ] Hover effects work on all interactive elements
- [ ] Responsive layout works on mobile/tablet/desktop

### Functional Checkpoints
- [ ] Clicking generation card navigates to generation page
- [ ] Clicking Pokémon card navigates to detail page
- [ ] Toggling owned status updates localStorage
- [ ] Collection count updates in real-time
- [ ] Back navigation works correctly
- [ ] Page loads show loading states
- [ ] All Pokémon images load from PokéAPI

## 5. Technical Implementation

- **Files:**
  - `index.html` - Main landing page
  - `generation.html` - Generation Pokémon grid
  - `pokemon.html` - Pokémon detail page
  - `css/styles.css` - All styles
  - `js/main.js` - Shared functionality
  - `js/api.js` - PokéAPI fetch functions
  - `js/storage.js` - localStorage management

- **External Resources:**
  - Google Fonts: Press Start 2P, Exo 2
  - PokéAPI: https://pokeapi.co/
