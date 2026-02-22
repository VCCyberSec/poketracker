// PokeTracker - Bundled JavaScript for GitHub Pages compatibility

(function() {
  'use strict';

  // ==================== STORAGE ====================
  const STORAGE_KEY = 'poketracker_catches';

  function getCatches() {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : {};
  }

  function saveCatches(catches) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(catches));
  }

  function isCaught(pokemonId) {
    const catches = getCatches();
    return catches[pokemonId] === true;
  }

  function toggleCatch(pokemonId) {
    const catches = getCatches();
    if (catches[pokemonId]) {
      delete catches[pokemonId];
    } else {
      catches[pokemonId] = true;
    }
    saveCatches(catches);
    return catches[pokemonId] === true;
  }

  function getCatchCount() {
    const catches = getCatches();
    return Object.keys(catches).filter(id => catches[id]).length;
  }

  function getCatchesByRegion(region) {
    const catches = getCatches();
    const regionRanges = {
      kanto: { start: 1, end: 151 },
      johto: { start: 152, end: 251 },
      hoenn: { start: 252, end: 386 },
      sinnoh: { start: 387, end: 493 },
      unova: { start: 494, end: 649 },
      kalos: { start: 650, end: 721 },
      alola: { start: 722, end: 809 },
      galar: { start: 810, end: 905 }
    };
    
    const range = regionRanges[region];
    if (!range) return 0;
    
    let count = 0;
    for (let i = range.start; i <= range.end; i++) {
      if (catches[i]) count++;
    }
    return count;
  }

  function getRegionTotal(region) {
    const regionRanges = {
      kanto: { start: 1, end: 151 },
      johto: { start: 152, end: 251 },
      hoenn: { start: 252, end: 386 },
      sinnoh: { start: 387, end: 493 },
      unova: { start: 494, end: 649 },
      kalos: { start: 650, end: 721 },
      alola: { start: 722, end: 809 },
      galar: { start: 810, end: 905 }
    };
    
    const range = regionRanges[region];
    if (!range) return 0;
    return range.end - range.start + 1;
  }

  // ==================== API ====================
  const API_BASE = 'https://pokeapi.co/api/v2';
  const CACHE_KEY = 'poketracker_cache';
  const CACHE_DURATION = 24 * 60 * 60 * 1000;

  function getCache() {
    const data = localStorage.getItem(CACHE_KEY);
    return data ? JSON.parse(data) : {};
  }

  function setCache(key, value) {
    const cache = getCache();
    cache[key] = { data: value, timestamp: Date.now() };
    localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
  }

  function getCached(key) {
    const cache = getCache();
    if (cache[key] && Date.now() - cache[key].timestamp < CACHE_DURATION) {
      return cache[key].data;
    }
    return null;
  }

  async function fetchWithCache(url) {
    const cacheKey = url.replace(/[^a-zA-Z0-9]/g, '_');
    const cached = getCached(cacheKey);
    if (cached) return cached;

    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    setCache(cacheKey, data);
    return data;
  }

  let allPokemon = [];

  async function getAllPokemon(limit = 905) {
    const data = await fetchWithCache(`${API_BASE}/pokemon?limit=${limit}`);
    return data.results.map((p, i) => ({
      name: p.name,
      id: i + 1,
      url: p.url
    }));
  }

  async function getPokemon(idOrName) {
    const data = await fetchWithCache(`${API_BASE}/pokemon/${idOrName}`);
    return transformPokemon(data);
  }

  function transformPokemon(data) {
    const types = data.types.map(t => t.type.name);
    const stats = {};
    data.stats.forEach(s => {
      stats[s.stat.name] = s.base_stat;
    });

    const sprites = {
      front: data.sprites.front_default,
      back: data.sprites.back_default,
      official: data.sprites.other['official-artwork'].front_default || data.sprites.front_default,
      dream: data.sprites.other.dream_world.front_default,
      home: data.sprites.other.home.front_default,
      showdown: data.sprites.other.showdown.front_default
    };

    const forms = data.forms.map(f => ({
      name: f.name,
      url: f.url
    }));

    return {
      id: data.id,
      name: data.name,
      types,
      stats,
      sprites,
      height: data.height / 10,
      weight: data.weight / 10,
      abilities: data.abilities.map(a => a.ability.name),
      forms,
      species: data.species.url
    };
  }

  function getPokemonImage(id) {
    return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
  }

  const typeColors = {
    normal: '#A8A77A',
    fire: '#EE8130',
    water: '#6390F0',
    electric: '#F7D02C',
    grass: '#7AC74C',
    ice: '#96D9D6',
    fighting: '#C22E28',
    poison: '#A33EA1',
    ground: '#E2BF65',
    flying: '#A98FF3',
    psychic: '#F95587',
    bug: '#A6B91A',
    rock: '#B6A136',
    ghost: '#735797',
    dragon: '#6F35FC',
    dark: '#705746',
    steel: '#B7B7CE',
    fairy: '#D685AD'
  };

  const regions = [
    { name: 'Kanto', id: 'kanto', gen: 1, start: 1, end: 151, color: '#FF5959' },
    { name: 'Johto', id: 'johto', gen: 2, start: 152, end: 251, color: '#C4C44A' },
    { name: 'Hoenn', id: 'hoenn', gen: 3, start: 252, end: 386, color: '#FF9E55' },
    { name: 'Sinnoh', id: 'sinnoh', gen: 4, start: 387, end: 493, color: '#85C1E9' },
    { name: 'Unova', id: 'unova', gen: 5, start: 494, end: 649, color: '#7FB3D5' },
    { name: 'Kalos', id: 'kalos', gen: 6, start: 650, end: 721, color: '#F1948A' },
    { name: 'Alola', id: 'alola', gen: 7, start: 722, end: 809, color: '#73C6B6' },
    { name: 'Galar', id: 'galar', gen: 8, start: 810, end: 905, color: '#8596E8' }
  ];

  const megaMap = {
    3: [{ name: 'Mega Venusaur', sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/10033.png' }],
    6: [
      { name: 'Mega Charizard X', sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/10034.png' },
      { name: 'Mega Charizard Y', sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/10035.png' }
    ],
    9: [{ name: 'Mega Blastoise', sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/10036.png' }],
    65: [{ name: 'Mega Alakazam', sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/10038.png' }],
    94: [{ name: 'Mega Gengar', sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/10039.png' }],
    115: [{ name: 'Mega Kangaskhan', sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/10040.png' }],
    127: [{ name: 'Mega Pinsir', sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/10041.png' }],
    130: [{ name: 'Mega Gyarados', sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/10042.png' }],
    150: [
      { name: 'Mega Mewtwo X', sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/10043.png' },
      { name: 'Mega Mewtwo Y', sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/10044.png' }
    ],
    181: [{ name: 'Mega Ampharos', sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/10045.png' }],
    214: [{ name: 'Mega Heracross', sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/10046.png' }],
    257: [{ name: 'Mega Blaziken', sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/10047.png' }],
    282: [{ name: 'Mega Gardevoir', sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/10048.png' }],
    303: [{ name: 'Mega Mawile', sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/10049.png' }],
    306: [{ name: 'Mega Aggron', sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/10050.png' }],
    308: [{ name: 'Mega Medicham', sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/10051.png' }],
    319: [{ name: 'Mega Manectric', sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/10052.png' }],
    354: [{ name: 'Mega Banette', sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/10055.png' }],
    380: [
      { name: 'Mega Latias', sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/10058.png' },
      { name: 'Mega Latios', sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/10059.png' }
    ],
    445: [{ name: 'Mega Garchomp', sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/10070.png' }],
    448: [{ name: 'Mega Lucario', sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/10071.png' }],
    453: [{ name: 'Mega Crobat', sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/10073.png' }],
    484: [{ name: 'Mega Palkia', sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/10078.png' }],
    487: [{ name: 'Mega Giratina', sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/10079.png' }],
    531: [{ name: 'Mega Audino', sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/10080.png' }],
    719: [{ name: 'Mega Diancie', sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/10081.png' }]
  };

  const gmaxList = [25, 94, 131, 143, 150, 249, 251, 258, 282, 323, 534, 550, 567, 713, 716, 800, 809, 813, 814, 815, 816, 817, 818, 819, 820, 823, 824, 825, 826, 834, 839, 840, 841, 842, 843, 844, 845, 846, 847, 848, 849, 854, 855, 858, 859, 860, 861, 862, 863, 864, 865, 866, 867, 868, 869, 871, 872, 873, 874, 875, 876, 877, 878, 879, 880, 881, 882, 883, 884, 885, 886, 887, 888, 889, 890, 891, 892, 893, 894, 895, 896, 897, 898, 899, 900, 901, 902, 903, 904, 905];

  function getMegaFormsForPokemon(id, name) {
    return megaMap[id] || [];
  }

  function getGmaxFormsForPokemon(id) {
    if (gmaxList.includes(id)) {
      return [{ name: name, official: getPokemonImage(id) }];
    }
    return [];
  }

  // ==================== RENDERING ====================
  let currentFilter = 'all';

  async function getPokemonTypes(id) {
    try {
      const data = await getPokemon(id);
      return data.types;
    } catch {
      return [];
    }
  }

  function createPokemonCard(id, name, types, caught) {
    const typesHtml = types.map(t => 
      `<span class="type-badge" style="background: ${typeColors[t] || '#777'}">${t}</span>`
    ).join('');
    
    return `
      <div class="pokemon-card ${caught ? 'caught' : ''}" data-id="${id}" onclick="window.location.href='pokemon.html?id=${id}'">
        <img class="pokemon-image" src="${getPokemonImage(id)}" alt="${name}" loading="lazy">
        <div class="pokemon-name">${name}</div>
        <div class="pokemon-id">#${String(id).padStart(3, '0')}</div>
        <div class="pokemon-types">${typesHtml}</div>
      </div>
    `;
  }

  function getRegionForPokemon(id) {
    for (const region of regions) {
      if (id >= region.start && id <= region.end) {
        return region.id;
      }
    }
    return 'kanto';
  }

  function getRegionName(id) {
    for (const region of regions) {
      if (id >= region.start && id <= region.end) {
        return region.name;
      }
    }
    return 'Kanto';
  }

  async function renderHome() {
    const container = document.getElementById('app');
    if (!container) return;
    
    const totalCaught = getCatchCount();
    
    let html = `
      <div class="hero fade-in">
        <h1>PokéTracker</h1>
        <div class="hero-stats">
          <div class="stat-box">
            <span class="stat-number">${totalCaught}</span>
            <span class="stat-label">Total Caught</span>
          </div>
          <div class="stat-box">
            <span class="stat-number">${Math.round((totalCaught / 905) * 100)}%</span>
            <span class="stat-label">Complete</span>
          </div>
        </div>
      </div>
      
      <h2 class="section-title">Regions</h2>
      <div class="region-grid">
    `;
    
    for (const region of regions) {
      const caught = getCatchesByRegion(region.id);
      const total = getRegionTotal(region.id);
      const percent = Math.round((caught / total) * 100);
      
      html += `
        <div class="region-card fade-in" onclick="window.location.href='region.html?region=${region.id}'">
          <div class="region-map-placeholder" style="background: linear-gradient(135deg, ${region.color}40, ${region.color}20)">
            ${region.name[0]}
          </div>
          <div class="region-info">
            <h3 class="region-name">${region.name}</h3>
            <div class="region-stats">
              <span class="region-count">${caught} / ${total}</span>
            </div>
            <div class="progress-bar">
              <div class="progress-fill" style="width: ${percent}%"></div>
            </div>
          </div>
        </div>
      `;
    }
    
    html += '</div>';
    container.innerHTML = html;
  }

  async function renderRegion() {
    const params = new URLSearchParams(window.location.search);
    const regionId = params.get('region') || 'kanto';
    const region = regions.find(r => r.id === regionId) || regions[0];
    
    const container = document.getElementById('app');
    if (!container) return;
    
    const caught = getCatchesByRegion(region.id);
    const total = getRegionTotal(region.id);
    const percent = Math.round((caught / total) * 100);
    
    const pokemonInRegion = allPokemon.filter(p => p.id >= region.start && p.id <= region.end);
    
    let html = `
      <div class="breadcrumb">
        <a href="index.html">Home</a>
        <span>/</span>
        <span>${region.name}</span>
      </div>
      
      <h1 class="page-title">${region.name} Region</h1>
      
      <div class="hero fade-in" style="margin-bottom: 2rem;">
        <div class="region-map-placeholder" style="height: 200px; background: linear-gradient(135deg, ${region.color}40, ${region.color}20); font-size: 4rem;">
          ${region.name[0]}
        </div>
        <div class="hero-stats">
          <div class="stat-box">
            <span class="stat-number">${caught}</span>
            <span class="stat-label">Caught</span>
          </div>
          <div class="stat-box">
            <span class="stat-number">${percent}%</span>
            <span class="stat-label">Complete</span>
          </div>
        </div>
      </div>
      
      <div class="filters">
        <button class="filter-btn active" data-filter="all">All</button>
        <button class="filter-btn" data-filter="caught">Caught</button>
        <button class="filter-btn" data-filter="uncaught">Uncaught</button>
      </div>
      
      <div class="pokemon-grid">
    `;
    
    for (const pokemon of pokemonInRegion) {
      const isPokemonCaught = isCaught(pokemon.id);
      const type = await getPokemonTypes(pokemon.id);
      
      html += createPokemonCard(pokemon.id, pokemon.name, type, isPokemonCaught);
    }
    
    html += '</div>';
    container.innerHTML = html;
    
    setupFilters(pokemonInRegion, region);
  }

  function setupFilters(pokemonList, region) {
    const buttons = document.querySelectorAll('.filter-btn');
    
    buttons.forEach(btn => {
      btn.addEventListener('click', () => {
        buttons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        const filter = btn.dataset.filter;
        const grid = document.querySelector('.pokemon-grid');
        
        renderFilteredPokemon(pokemonList, filter);
      });
    });
  }

  async function renderFilteredPokemon(pokemonList, filter) {
    const grid = document.querySelector('.pokemon-grid');
    grid.innerHTML = '';
    
    for (const pokemon of pokemonList) {
      const caught = isCaught(pokemon.id);
      if (filter === 'caught' && !caught) continue;
      if (filter === 'uncaught' && caught) continue;
      
      const types = await getPokemonTypes(pokemon.id);
      grid.innerHTML += createPokemonCard(pokemon.id, pokemon.name, types, caught);
    }
    
    if (grid.children.length === 0) {
      grid.innerHTML = `
        <div class="empty-state" style="grid-column: 1 / -1;">
          <h3>No Pokémon found</h3>
          <p>Try a different filter</p>
        </div>
      `;
    }
  }

  async function renderPokemonDetail() {
    const params = new URLSearchParams(window.location.search);
    const id = parseInt(params.get('id')) || 1;
    
    const container = document.getElementById('app');
    if (!container) return;
    
    try {
      const pokemon = await getPokemon(id);
      const caught = isCaught(id);
      
      const stats = [
        { name: 'HP', value: pokemon.stats.hp, color: '#4CAF50' },
        { name: 'Attack', value: pokemon.stats.attack, color: '#F44336' },
        { name: 'Defense', value: pokemon.stats.defense, color: '#2196F3' },
        { name: 'Sp. Atk', value: pokemon.stats['special-attack'], color: '#FF9800' },
        { name: 'Sp. Def', value: pokemon.stats['special-defense'], color: '#9C27B0' },
        { name: 'Speed', value: pokemon.stats.speed, color: '#00BCD4' }
      ];
      
      let html = `
        <div class="breadcrumb">
          <a href="index.html">Home</a>
          <span>/</span>
          <a href="region.html?region=${getRegionForPokemon(id)}">${getRegionName(id)}</a>
          <span>/</span>
          <span>${pokemon.name}</span>
        </div>
        
        <div class="pokemon-detail fade-in">
          <div class="pokemon-detail-image">
            <img src="${pokemon.sprites.official || getPokemonImage(id)}" alt="${pokemon.name}">
          </div>
          <div class="pokemon-detail-info">
            <h1 class="pokemon-detail-name">${pokemon.name}</h1>
            <p class="pokemon-detail-id">#${String(pokemon.id).padStart(3, '0')}</p>
            <div class="pokemon-detail-types">
              ${pokemon.types.map(t => `<span class="type-badge" style="background: ${typeColors[t]}">${t}</span>`).join('')}
            </div>
            
            <div class="stats-container">
              ${stats.map(s => `
                <div class="stat-row">
                  <span class="stat-name">${s.name}</span>
                  <div class="stat-bar-container">
                    <div class="stat-bar" style="width: ${Math.min(s.value, 100)}%; background: ${s.color}"></div>
                  </div>
                  <span class="stat-value">${s.value}</span>
                </div>
              `).join('')}
            </div>
            
            <button class="catch-btn ${caught ? 'catch' : 'uncaught'}" id="catchBtn">
              ${caught ? '✓ Caught!' : 'Mark as Caught'}
            </button>
          </div>
        </div>
      `;
      
      container.innerHTML = html;
      
      document.getElementById('catchBtn').addEventListener('click', () => {
        const nowCaught = toggleCatch(id);
        const btn = document.getElementById('catchBtn');
        btn.className = `catch-btn ${nowCaught ? 'catch' : 'uncaught'}`;
        btn.textContent = nowCaught ? '✓ Caught!' : 'Mark as Caught';
        
        const card = document.querySelector(`.pokemon-card[data-id="${id}"]`);
        if (card) {
          card.classList.toggle('caught', nowCaught);
        }
      });
      
      await renderFormsSection(container, pokemon);
      
    } catch (error) {
      console.error('Error loading pokemon:', error);
      showError('Failed to load Pokémon details');
    }
  }

  async function renderFormsSection(container, pokemon) {
    const megaForms = getMegaFormsForPokemon(pokemon.id, pokemon.name);
    const gmaxForms = getGmaxFormsForPokemon(pokemon.id);
    
    let html = '';
    
    if (megaForms.length > 0) {
      html += `
        <div class="forms-section fade-in">
          <h3>Mega Evolutions</h3>
          <div class="forms-grid">
            ${megaForms.map(f => `
              <div class="form-card">
                <img src="${f.sprite}" alt="${f.name}">
                <span>${f.name.replace(pokemon.name + '-', '')}</span>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    }
    
    if (gmaxForms.length > 0) {
      html += `
        <div class="forms-section fade-in">
          <h3>Gigantamax Forms</h3>
          <div class="forms-grid">
            ${gmaxForms.map(f => `
              <div class="form-card">
                <img src="${f.official}" alt="${f.name}">
                <span>Gigantamax</span>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    }
    
    if (html) {
      container.innerHTML += html;
    }
  }

  async function renderSearch() {
    const container = document.getElementById('app');
    if (!container) return;
    
    const totalCaught = getCatchCount();
    
    container.innerHTML = `
      <h1 class="page-title">Search Pokémon</h1>
      
      <div class="search-container">
        <input type="text" class="search-input" id="searchInput" placeholder="Search by name...">
        <div class="search-results" id="searchResults"></div>
      </div>
      
      <div class="filters">
        <button class="filter-btn active" data-filter="all">All</button>
        <button class="filter-btn" data-filter="caught">Caught</button>
        <button class="filter-btn" data-filter="uncaught">Uncaught</button>
        <button class="filter-btn" data-filter="type-normal">Normal</button>
        <button class="filter-btn" data-filter="type-fire">Fire</button>
        <button class="filter-btn" data-filter="type-water">Water</button>
        <button class="filter-btn" data-filter="type-electric">Electric</button>
        <button class="filter-btn" data-filter="type-grass">Grass</button>
        <button class="filter-btn" data-filter="type-ice">Ice</button>
      </div>
      
      <div class="pokemon-grid" id="pokemonGrid">
    `;
    
    await renderAllPokemonGrid('all');
    
    document.getElementById('app').innerHTML += '</div>';
    
    setupSearch();
    setupSearchFilters();
  }

  async function renderAllPokemonGrid(filter) {
    const grid = document.getElementById('pokemonGrid');
    if (!grid) return;
    
    grid.innerHTML = '';
    
    for (const pokemon of allPokemon) {
      const caught = isCaught(pokemon.id);
      
      if (filter === 'caught' && !caught) continue;
      if (filter === 'uncaught' && caught) continue;
      
      const types = await getPokemonTypes(pokemon.id);
      
      if (filter.startsWith('type-') && !types.includes(filter.replace('type-', ''))) continue;
      
      grid.innerHTML += createPokemonCard(pokemon.id, pokemon.name, types, caught);
    }
  }

  function setupSearch() {
    const input = document.getElementById('searchInput');
    const results = document.getElementById('searchResults');
    
    if (!input || !results) return;
    
    input.addEventListener('input', async (e) => {
      const query = e.target.value.toLowerCase().trim();
      
      if (query.length < 2) {
        results.classList.remove('active');
        return;
      }
      
      const matches = allPokemon.filter(p => p.name.toLowerCase().includes(query)).slice(0, 10);
      
      if (matches.length === 0) {
        results.innerHTML = '<div class="search-result-item"><span>No results found</span></div>';
      } else {
        results.innerHTML = matches.map(p => `
          <div class="search-result-item" onclick="window.location.href='pokemon.html?id=${p.id}'">
            <img src="${getPokemonImage(p.id)}" alt="${p.name}">
            <span>${p.name}</span>
          </div>
        `).join('');
      }
      
      results.classList.add('active');
    });
    
    input.addEventListener('blur', () => {
      setTimeout(() => results.classList.remove('active'), 200);
    });
  }

  function setupSearchFilters() {
    const buttons = document.querySelectorAll('.filter-btn');
    
    buttons.forEach(btn => {
      btn.addEventListener('click', () => {
        buttons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        renderAllPokemonGrid(btn.dataset.filter);
      });
    });
  }

  async function renderCollection() {
    const container = document.getElementById('app');
    if (!container) return;
    
    const caughtList = Object.keys(getCatches()).filter(id => getCatches()[id]).length;
    const totalCaught = caughtList;
    
    container.innerHTML = `
      <h1 class="page-title">My Collection</h1>
      
      <div class="collection-stats">
        <div class="collection-stat-card">
          <span class="collection-stat-number">${totalCaught}</span>
          <span class="collection-stat-label">Total Caught</span>
        </div>
        <div class="collection-stat-card">
          <span class="collection-stat-number">${905 - totalCaught}</span>
          <span class="collection-stat-label">Remaining</span>
        </div>
        <div class="collection-stat-card">
          <span class="collection-stat-number">${Math.round((totalCaught / 905) * 100)}%</span>
          <span class="collection-stat-label">Complete</span>
        </div>
      </div>
      
      <div class="filters">
        <button class="filter-btn active" data-filter="all">All</button>
        <button class="filter-btn" data-filter="caught">Caught</button>
        <button class="filter-btn" data-filter="uncaught">Uncaught</button>
      </div>
      
      <div class="pokemon-grid" id="collectionGrid">
      </div>
    `;
    
    await renderCollectionGrid('all');
    
    setupCollectionFilters();
  }

  async function renderCollectionGrid(filter) {
    const grid = document.getElementById('collectionGrid');
    if (!grid) return;
    
    grid.innerHTML = '';
    
    let pokemonToShow = [];
    
    if (filter === 'all') {
      pokemonToShow = allPokemon;
    } else if (filter === 'caught') {
      pokemonToShow = allPokemon.filter(p => isCaught(p.id));
    } else {
      pokemonToShow = allPokemon.filter(p => !isCaught(p.id));
    }
    
    for (const pokemon of pokemonToShow) {
      const caught = isCaught(pokemon.id);
      const types = await getPokemonTypes(pokemon.id);
      grid.innerHTML += createPokemonCard(pokemon.id, pokemon.name, types, caught);
    }
    
    if (grid.children.length === 0) {
      grid.innerHTML = `
        <div class="empty-state" style="grid-column: 1 / -1;">
          <h3>No Pokémon found</h3>
          <p>Start catching Pokémon to build your collection!</p>
        </div>
      `;
    }
  }

  function setupCollectionFilters() {
    const buttons = document.querySelectorAll('.filter-btn');
    
    buttons.forEach(btn => {
      btn.addEventListener('click', () => {
        buttons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        renderCollectionGrid(btn.dataset.filter);
      });
    });
  }

  // ==================== UTILITIES ====================
  function showLoading() {
    let loader = document.querySelector('.loading');
    if (!loader) {
      loader = document.createElement('div');
      loader.className = 'loading';
      loader.innerHTML = '<div class="pokeball-spinner"></div><p class="loading-text">Loading...</p>';
      
      const app = document.getElementById('app');
      if (app) {
        app.innerHTML = '';
        app.appendChild(loader);
      }
    }
    loader.style.display = 'flex';
  }

  function hideLoading() {
    const loader = document.querySelector('.loading');
    if (loader) {
      loader.style.display = 'none';
    }
  }

  function showError(message) {
    const app = document.getElementById('app');
    if (app) {
      app.innerHTML = `
        <div class="empty-state">
          <h3>Error</h3>
          <p>${message}</p>
          <button class="filter-btn" onclick="location.reload()" style="margin-top: 1rem;">Try Again</button>
        </div>
      `;
    }
  }

  function setupNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    
    if (hamburger && navLinks) {
      hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
      });
    }
  }

  function setupBackToTop() {
    const btn = document.createElement('div');
    btn.className = 'back-to-top';
    btn.innerHTML = '↑';
    btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
    document.body.appendChild(btn);
    
    window.addEventListener('scroll', () => {
      if (window.scrollY > 300) {
        btn.classList.add('visible');
      } else {
        btn.classList.remove('visible');
      }
    });
  }

  function getPage() {
    const path = window.location.pathname;
    
    if (path.includes('region.html')) return 'region';
    if (path.includes('pokemon.html')) return 'pokemon';
    if (path.includes('search.html')) return 'search';
    if (path.includes('collection.html')) return 'collection';
    return 'home';
  }

  // ==================== INIT ====================
  async function init() {
    setupNavigation();
    setupBackToTop();
    
    const page = getPage();
    
    showLoading();
    
    try {
      allPokemon = await getAllPokemon(905);
      
      switch(page) {
        case 'home':
          await renderHome();
          break;
        case 'region':
          await renderRegion();
          break;
        case 'pokemon':
          await renderPokemonDetail();
          break;
        case 'search':
          await renderSearch();
          break;
        case 'collection':
          await renderCollection();
          break;
        default:
          await renderHome();
      }
    } catch (error) {
      console.error('Error loading page:', error);
      showError('Failed to load data. Please try again.');
    }
    
    hideLoading();
  }

  // Start the app
  document.addEventListener('DOMContentLoaded', init);

})();
