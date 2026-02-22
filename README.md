# PokéTracker

A static Pokémon collection tracking website that allows you to track your Pokémon from Generation 1 to Generation 8 across all regions.

## Features

### Collection Tracking
- Track catches for all 905+ Pokémon (Gen 1-8)
- Mark Pokémon as caught/uncaught with a single click
- Data persists in your browser using localStorage

### Regional Statistics
- 8 regions: Kanto, Johto, Hoenn, Sinnoh, Unova, Kalos, Alola, Galar
- View catch count and completion percentage per region
- Visual progress bars for each region

### Search & Filters
- Real-time search by Pokémon name
- Filter by: All, Caught, Uncaught
- Filter by Pokémon type (Normal, Fire, Water, Electric, Grass, Ice)

### Pokémon Details
- View detailed stats (HP, Attack, Defense, Sp. Atk, Sp. Def, Speed)
- See type badges for each Pokémon
- View official artwork
- Breadcrumb navigation

### Special Forms
- **Mega Evolutions**: Support for all Mega Evolution forms
- **Gigantamax**: Support for Gigantamax forms

### Responsive Design
- Fully responsive layout for mobile, tablet, and desktop
- Mobile-friendly hamburger navigation
- Touch-friendly cards and buttons

## Pages

| Page | Description |
|------|-------------|
| `index.html` | Home page with total catches and region overview |
| `region.html?region=kanto` | Region detail with all Pokémon in that region |
| `pokemon.html?id=25` | Individual Pokémon detail page |
| `search.html` | Search and filter all Pokémon |
| `collection.html` | View your collected Pokémon |

## How to Use

### Local Development
1. Open `index.html` in a web browser
2. Browse regions or search for Pokémon
3. Click on any Pokémon to view details
4. Click "Mark as Caught" to add to your collection
5. View your collection statistics on the Collection page

### GitHub Pages Deployment
1. Create a repository on GitHub
2. Push all files to the repository
3. Go to Settings > Pages
4. Select the main branch as the source
5. Your site will be live at `https://yourusername.github.io/repo-name/`

## Data Source

All Pokémon data is fetched from the [PokeAPI](https://pokeapi.co/), a free RESTful API for Pokémon data.

## Technical Details

- Pure HTML, CSS, and JavaScript (no frameworks)
- Bundled JavaScript for GitHub Pages compatibility
- LocalStorage for data persistence
- API caching for performance

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## File Structure

```
poketracker/
├── index.html          # Home page
├── region.html         # Region detail page
├── pokemon.html        # Pokémon detail page
├── search.html         # Search page
├── collection.html     # My Collection page
├── css/
│   └── styles.css     # All styles
├── js/
│   └── app.js         # Bundled application logic
└── README.md          # This file
```

## Color Scheme

- Background: Deep Navy (#1a1a2e)
- Surface: Dark Blue (#16213e)
- Card: Medium Blue (#0f3460)
- Primary: Vibrant Red/Pink (#e94560)
- Secondary: Electric Blue (#53d8fb)
- Accent: Yellow (#f9ed69)

## License

This project is for educational purposes. Pokémon and Pokémon character names are trademarks of Nintendo.
