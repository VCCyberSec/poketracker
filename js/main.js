function showLoading() {
  return `<div class="loading">
    <div class="loading-spinner"></div>
    <p>Loading Pokémon data...</p>
  </div>`;
}

function showError(message) {
  return `<div class="error">
    <h2>Oops!</h2>
    <p>${message}</p>
  </div>`;
}

function formatPokemonId(id) {
  return '#' + String(id).padStart(3, '0');
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function capitalizeWords(str) {
  return str.split('-').map(capitalize).join(' ');
}

function updateCollectionStats() {
  const stats = getCollectionStats();
  const statsEl = document.getElementById('collection-stats');
  if (statsEl) {
    statsEl.innerHTML = `<span>${stats.owned}</span> / ${stats.total} Pokémon`;
  }
  
  const gen = new URLSearchParams(window.location.search).get('gen');
  if (gen) {
    const genStats = getGenerationStats(parseInt(gen));
    const genStatsEl = document.getElementById('gen-stats');
    if (genStatsEl) {
      genStatsEl.innerHTML = `<span>${genStats.owned}</span> / ${genStats.total} (${genStats.percentage}%)`;
    }
  }
}

async function triggerHaptic(type = 'light') {
  if (window.Capacitor && window.Capacitor.Plugins && window.Capacitor.Plugins.Haptics) {
    try {
      if (type === 'success') {
        await window.Capacitor.Plugins.Haptics.notification({ type: 'SUCCESS' });
      } else if (type === 'warning') {
        await window.Capacitor.Plugins.Haptics.notification({ type: 'WARNING' });
      } else {
        await window.Capacitor.Plugins.Haptics.impact({ style: 'light' });
      }
    } catch (e) {}
  }
}

async function triggerSelectionHaptic() {
  if (window.Capacitor && window.Capacitor.Plugins && window.Capacitor.Plugins.Haptics) {
    try {
      await window.Capacitor.Plugins.Haptics.selectionClick();
    } catch (e) {}
  }
}

async function renderGenerationCards() {
  const container = document.getElementById('generations');
  if (!container) return;
  
  container.innerHTML = showLoading();
  
  try {
    const generations = await fetchAllGenerations();
    let html = '<div class="gen-grid">';
    
    for (const gen of generations) {
      const stats = getGenerationStats(gen.number);
      html += `
        <a href="generation.html?gen=${gen.number}" class="gen-card fade-in" data-gen="${gen.number}">
          <div class="gen-number">Gen ${gen.number}</div>
          <div class="gen-region">${gen.region}</div>
          <div class="gen-count">${gen.count} Pokémon</div>
          <div class="gen-progress">
            <div class="gen-progress-bar" style="width: ${stats.percentage}%"></div>
          </div>
          <div class="gen-progress-text">${stats.owned} / ${stats.total} owned (${stats.percentage}%)</div>
        </a>
      `;
    }
    
    html += '</div>';
    container.innerHTML = html;
  } catch (error) {
    container.innerHTML = showError('Failed to load generations. Please try again.');
    console.error(error);
  }
}

let currentGen = 1;
let allPokemon = [];
let displayedPokemon = [];
let currentFilter = 'all';
let currentSort = 'number';
let isLoadingMore = false;
let currentPokemonId = null;
let showGigantamax = false;

async function initGenerationPage() {
  const params = new URLSearchParams(window.location.search);
  currentGen = parseInt(params.get('gen')) || 1;
  
  const info = getGenerationInfo(currentGen);
  if (!info) {
    window.location.href = 'index.html';
    return;
  }
  
  document.getElementById('page-title').textContent = `${info.region} (Gen ${currentGen})`;
  updateGenSummary(currentGen, info);
  
  const navControls = document.getElementById('nav-controls');
  if (navControls) {
    let navHtml = '';
    if (currentGen > 1) {
      navHtml += `<a href="generation.html?gen=${currentGen - 1}" class="nav-btn">← Prev</a>`;
    }
    navHtml += `<a href="index.html" class="nav-btn home-btn">🏠 Home</a>`;
    if (currentGen < 8) {
      navHtml += `<a href="generation.html?gen=${currentGen + 1}" class="nav-btn">Next →</a>`;
    }
    navControls.innerHTML = navHtml;
  }
  
  const pokemonContainer = document.getElementById('pokemon-container');
  if (!pokemonContainer) return;
  
  pokemonContainer.innerHTML = showLoading();
  
  try {
    allPokemon = await fetchPokemonList(info.start, info.end);
    displayedPokemon = [];
    renderPokemonGrid(allPokemon.slice(0, 30));
    setupInfiniteScroll();
    updateGenSummary(currentGen, info);
  } catch (error) {
    pokemonContainer.innerHTML = showError('Failed to load Pokémon. Please try again.');
    console.error(error);
  }
}

function updateGenSummary(gen, info) {
  const stats = getGenerationStats(gen);
  
  const summaryTitle = document.getElementById('gen-summary-title');
  if (summaryTitle) {
    summaryTitle.textContent = `Gen ${gen} - ${info.region}`;
  }
  
  const ownedEl = document.getElementById('gen-owned');
  if (ownedEl) {
    ownedEl.textContent = stats.owned;
  }
  
  const totalEl = document.getElementById('gen-total');
  if (totalEl) {
    totalEl.textContent = stats.total;
  }
  
  const percentEl = document.getElementById('gen-percent');
  if (percentEl) {
    percentEl.textContent = `${stats.percentage}%`;
  }
  
  const progressBar = document.getElementById('gen-progress-bar');
  if (progressBar) {
    progressBar.style.width = `${stats.percentage}%`;
  }
}

function setupInfiniteScroll() {
  const sentinel = document.getElementById('scroll-sentinel');
  if (!sentinel) return;
  
  const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting && !isLoadingMore) {
      loadMorePokemon();
    }
  }, { threshold: 0.1 });
  
  observer.observe(sentinel);
}

function loadMorePokemon() {
  const start = displayedPokemon.length;
  const batch = allPokemon.slice(start, start + 30);
  
  if (batch.length === 0) return;
  
  isLoadingMore = true;
  
  setTimeout(() => {
    displayedPokemon = [...displayedPokemon, ...batch];
    renderPokemonGrid(displayedPokemon);
    isLoadingMore = false;
  }, 100);
}

function sortPokemon(pokemon) {
  let sorted = [...pokemon];
  
  if (currentSort === 'number') {
    sorted.sort((a, b) => a.id - b.id);
  } else if (currentSort === 'name') {
    sorted.sort((a, b) => a.name.localeCompare(b.name));
  } else if (currentSort === 'type') {
    sorted.sort((a, b) => a.types[0].localeCompare(b.types[0]));
  }
  
  return sorted;
}

function filterPokemon(pokemon) {
  return pokemon.filter(p => {
    if (currentFilter === 'all') return true;
    if (currentFilter === 'owned') return isPokemonOwned(p.id);
    if (currentFilter === 'missing') return !isPokemonOwned(p.id);
    if (currentFilter === 'favorites') return isPokemonFavorite(p.id);
    return true;
  });
}

function renderPokemonGrid(pokemon) {
  const container = document.getElementById('pokemon-container');
  if (!container) return;
  
  const filtered = sortPokemon(filterPokemon(pokemon));
  
  if (filtered.length === 0) {
    container.innerHTML = '<div class="error"><p>No Pokémon found</p></div>';
    return;
  }
  
  let html = '<div class="poke-grid">';
  
  for (const p of filtered) {
    const owned = isPokemonOwned(p.id);
    const favorite = isPokemonFavorite(p.id);
    const imgUrl = p.sprites.official || p.sprites.front;
    
    html += `
      <a href="pokemon.html?id=${p.id}" class="poke-card fade-in ${owned ? 'owned' : ''}">
        <div class="poke-number">${formatPokemonId(p.id)}</div>
        <img src="${imgUrl}" alt="${p.name}" class="poke-img" loading="lazy">
        <div class="poke-name">${capitalizeWords(p.name)}</div>
        <div class="poke-types">
          ${p.types.map(t => `<span class="type-badge ${t}">${t}</span>`).join('')}
        </div>
        ${favorite ? '<div class="favorite-badge">★</div>' : ''}
      </a>
    `;
  }
  
  html += '</div>';
  
  if (displayedPokemon.length < allPokemon.length) {
    html += '<div id="scroll-sentinel" class="loading-more">Loading more...</div>';
  }
  
  container.innerHTML = html;
}

function setupFilterButtons() {
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      triggerSelectionHaptic();
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentFilter = btn.dataset.filter;
      renderPokemonGrid(allPokemon);
    });
  });
  
  document.querySelectorAll('.sort-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      triggerSelectionHaptic();
      document.querySelectorAll('.sort-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentSort = btn.dataset.sort;
      renderPokemonGrid(allPokemon);
    });
  });
}

async function initPokemonDetailPage() {
  const params = new URLSearchParams(window.location.search);
  const id = parseInt(params.get('id'));
  
  if (!id) {
    window.location.href = 'index.html';
    return;
  }
  
  currentPokemonId = id;
  addToRecent(id);
  
  const container = document.getElementById('detail-container');
  if (!container) return;
  
  container.innerHTML = showLoading();
  
  try {
    const pokemon = await fetchPokemon(id);
    const gigantamaxData = await fetchGigantamaxData(id);
    renderPokemonDetail(pokemon, gigantamaxData);
    setupSwipeNavigation();
  } catch (error) {
    container.innerHTML = showError('Failed to load Pokémon details. Please try again.');
    console.error(error);
  }
}

function setupSwipeNavigation() {
  const container = document.getElementById('detail-container');
  if (!container) return;
  
  let startX = 0;
  
  container.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
  }, { passive: true });
  
  container.addEventListener('touchend', (e) => {
    const endX = e.changedTouches[0].clientX;
    const diff = startX - endX;
    const threshold = 50;
    
    if (Math.abs(diff) > threshold) {
      triggerSelectionHaptic();
      
      if (diff > 0 && currentPokemonId < 905) {
        window.location.href = `pokemon.html?id=${currentPokemonId + 1}`;
      } else if (diff < 0 && currentPokemonId > 1) {
        window.location.href = `pokemon.html?id=${currentPokemonId - 1}`;
      }
    }
  }, { passive: true });
}

function renderPokemonDetail(pokemon, gigantamaxData) {
  const container = document.getElementById('detail-container');
  const owned = isPokemonOwned(pokemon.id);
  const favorite = isPokemonFavorite(pokemon.id);
  const hasGmax = gigantamaxData?.hasGigantamax || hasGigantamax(pokemon.id);
  
  const statMap = {
    'hp': 'HP', 'attack': 'Attack', 'defense': 'Defense',
    'special-attack': 'Sp.Atk', 'special-defense': 'Sp.Def', 'speed': 'Speed'
  };
  
  const maxStat = 255;
  const gen = getGenFromId(pokemon.id);
  const info = getGenerationInfo(gen);
  
  let imgUrl = pokemon.sprites.official || pokemon.sprites.front;
  if (showGigantamax && hasGmax) {
    const gmaxUrl = getGen8GigantamaxSprite(pokemon.id);
    if (gmaxUrl) imgUrl = gmaxUrl;
  }
  
  container.innerHTML = `
    <div class="breadcrumb">
      <a href="index.html">Home</a> &gt; <a href="generation.html?gen=${gen}">${info.region}</a> &gt; <span>${capitalizeWords(pokemon.name)}</span>
    </div>
    
    <div class="detail-nav">
      ${pokemon.id > 1 ? `<a href="pokemon.html?id=${pokemon.id - 1}" class="detail-nav-btn">← #${formatPokemonId(pokemon.id - 1)}</a>` : '<span></span>'}
      <a href="generation.html?gen=${gen}" class="back-link">Back</a>
      ${pokemon.id < 905 ? `<a href="pokemon.html?id=${pokemon.id + 1}" class="detail-nav-btn">#${formatPokemonId(pokemon.id + 1)} →</a>` : '<span></span>'}
    </div>
    
    <div class="detail-header">
      <img src="${imgUrl}" alt="${pokemon.name}" class="detail-img ${showGigantamax ? 'gigantamax' : ''}">
      <div class="detail-info">
        <h1>${capitalizeWords(pokemon.name)}${showGigantamax && hasGmax ? ' (Gigantamax)' : ''}</h1>
        <div class="detail-number">${formatPokemonId(pokemon.id)}</div>
        <div class="detail-types">
          ${pokemon.types.map(t => `<span class="type-badge ${t}">${t}</span>`).join('')}
        </div>
        ${hasGmax ? `<button class="gigantamax-toggle ${showGigantamax ? 'active' : ''}" id="gigantamax-toggle">⚡ Gigantamax</button>` : ''}
      </div>
    </div>
    
    <div class="action-buttons">
      <div class="owned-toggle ${owned ? 'owned' : ''}" id="owned-toggle">
        <div class="owned-toggle-btn"></div>
        <span class="owned-label">${owned ? 'Owned' : 'Add to Collection'}</span>
      </div>
      
      <button class="favorite-toggle ${favorite ? 'active' : ''}" id="favorite-toggle">
        ${favorite ? '★ Favorited' : '☆ Add to Favorites'}
      </button>
    </div>
    
    <div class="stats-section">
      <h2>Base Stats</h2>
      ${pokemon.stats.map(s => `
        <div class="stat-row">
          <div class="stat-name">${statMap[s.name] || s.name}</div>
          <div class="stat-bar-container">
            <div class="stat-bar ${s.name.replace('special-', 'sp')}" style="width: ${(s.value / maxStat) * 100}%"></div>
          </div>
          <div class="stat-value">${s.value}</div>
        </div>
      `).join('')}
    </div>
    
    <div class="info-grid">
      <div class="info-card">
        <h3>Height</h3>
        <p>${pokemon.height} m</p>
      </div>
      <div class="info-card">
        <h3>Weight</h3>
        <p>${pokemon.weight} kg</p>
      </div>
      <div class="info-card">
        <h3>Abilities</h3>
        <div class="abilities">
          ${pokemon.abilities.map(a => `<span class="ability">${capitalizeWords(a.name)}${a.isHidden ? ' (Hidden)' : ''}</span>`).join('')}
        </div>
      </div>
      ${hasGmax ? `<div class="info-card"><h3>Gigantamax</h3><p class="gigantamax-info">Available</p></div>` : ''}
    </div>
    
    <p class="swipe-hint">Swipe left/right to navigate</p>
  `;
  
  document.getElementById('owned-toggle').addEventListener('click', async () => {
    const nowOwned = togglePokemonOwnership(pokemon.id);
    const toggle = document.getElementById('owned-toggle');
    toggle.classList.toggle('owned', nowOwned);
    toggle.querySelector('.owned-label').textContent = nowOwned ? 'Owned' : 'Add to Collection';
    updateCollectionStats();
    await triggerHaptic(nowOwned ? 'success' : 'warning');
  });
  
  document.getElementById('favorite-toggle').addEventListener('click', async () => {
    const nowFav = togglePokemonFavorite(pokemon.id);
    const btn = document.getElementById('favorite-toggle');
    btn.classList.toggle('active', nowFav);
    btn.textContent = nowFav ? '★ Favorited' : '☆ Add to Favorites';
    updateCollectionStats();
    await triggerHaptic('light');
  });
  
  const gmaxToggle = document.getElementById('gigantamax-toggle');
  if (gmaxToggle) {
    gmaxToggle.addEventListener('click', async () => {
      showGigantamax = !showGigantamax;
      renderPokemonDetail(pokemon, gigantamaxData);
      await triggerHaptic('light');
    });
  }
}

function getGenFromId(id) {
  for (let gen = 1; gen <= 8; gen++) {
    const range = getGenerationInfo(gen);
    if (id >= range.start && id <= range.end) {
      return gen;
    }
  }
  return 1;
}

async function initSearchPage() {
  const searchInput = document.getElementById('search-input');
  const resultsContainer = document.getElementById('search-results');
  
  if (!searchInput || !resultsContainer) return;
  
  searchInput.addEventListener('input', async (e) => {
    const query = e.target.value.trim();
    
    if (query.length < 2) {
      resultsContainer.innerHTML = '<p class="search-hint">Type at least 2 characters to search</p>';
      return;
    }
    
    resultsContainer.innerHTML = showLoading();
    
    try {
      const results = await searchPokemon(query);
      renderSearchResults(results);
    } catch (error) {
      resultsContainer.innerHTML = showError('Search failed. Please try again.');
    }
  });
  
  searchInput.focus();
}

function renderSearchResults(pokemon) {
  const container = document.getElementById('search-results');
  if (!container) return;
  
  if (pokemon.length === 0) {
    container.innerHTML = '<p class="search-hint">No Pokémon found</p>';
    return;
  }
  
  let html = '<div class="poke-grid">';
  
  for (const p of pokemon) {
    const owned = isPokemonOwned(p.id);
    const imgUrl = p.sprites.official || p.sprites.front;
    
    html += `
      <a href="pokemon.html?id=${p.id}" class="poke-card fade-in ${owned ? 'owned' : ''}">
        <div class="poke-number">${formatPokemonId(p.id)}</div>
        <img src="${imgUrl}" alt="${p.name}" class="poke-img" loading="lazy">
        <div class="poke-name">${capitalizeWords(p.name)}</div>
        <div class="poke-types">
          ${p.types.map(t => `<span class="type-badge ${t}">${t}</span>`).join('')}
        </div>
      </a>
    `;
  }
  
  html += '</div>';
  container.innerHTML = html;
}

async function initFavoritesPage() {
  const container = document.getElementById('favorites-container');
  if (!container) return;
  
  container.innerHTML = showLoading();
  
  try {
    const favorites = getFavorites();
    if (favorites.length === 0) {
      container.innerHTML = '<p class="search-hint">No favorites yet! Star some Pokémon to add them here.</p>';
      return;
    }
    
    const promises = favorites.map(id => fetchPokemon(id));
    const pokemon = await Promise.all(promises);
    
    renderFavoritesGrid(pokemon);
  } catch (error) {
    container.innerHTML = showError('Failed to load favorites.');
  }
}

function renderFavoritesGrid(pokemon) {
  const container = document.getElementById('favorites-container');
  if (!container) return;
  
  let html = '<div class="poke-grid">';
  
  for (const p of pokemon) {
    const owned = isPokemonOwned(p.id);
    const imgUrl = p.sprites.official || p.sprites.front;
    
    html += `
      <a href="pokemon.html?id=${p.id}" class="poke-card fade-in ${owned ? 'owned' : ''}">
        <div class="poke-number">${formatPokemonId(p.id)}</div>
        <img src="${imgUrl}" alt="${p.name}" class="poke-img" loading="lazy">
        <div class="poke-name">${capitalizeWords(p.name)}</div>
        <div class="poke-types">
          ${p.types.map(t => `<span class="type-badge ${t}">${t}</span>`).join('')}
        </div>
        <div class="favorite-badge">★</div>
      </a>
    `;
  }
  
  html += '</div>';
  container.innerHTML = html;
}

async function initRecentPage() {
  const container = document.getElementById('recent-container');
  if (!container) return;
  
  container.innerHTML = showLoading();
  
  try {
    const recent = getRecentPokemon();
    if (recent.length === 0) {
      container.innerHTML = '<p class="search-hint">No recently viewed Pokémon. Start exploring!</p>';
      return;
    }
    
    const promises = recent.map(id => fetchPokemon(id));
    const pokemon = await Promise.all(promises);
    
    renderRecentGrid(pokemon);
  } catch (error) {
    container.innerHTML = showError('Failed to load recent.');
  }
}

function renderRecentGrid(pokemon) {
  const container = document.getElementById('recent-container');
  if (!container) return;
  
  let html = '<div class="poke-grid">';
  
  for (const p of pokemon) {
    const owned = isPokemonOwned(p.id);
    const imgUrl = p.sprites.official || p.sprites.front;
    
    html += `
      <a href="pokemon.html?id=${p.id}" class="poke-card fade-in ${owned ? 'owned' : ''}">
        <div class="poke-number">${formatPokemonId(p.id)}</div>
        <img src="${imgUrl}" alt="${p.name}" class="poke-img" loading="lazy">
        <div class="poke-name">${capitalizeWords(p.name)}</div>
        <div class="poke-types">
          ${p.types.map(t => `<span class="type-badge ${t}">${t}</span>`).join('')}
        </div>
      </a>
    `;
  }
  
  html += '</div>';
  container.innerHTML = html;
}

document.addEventListener('DOMContentLoaded', () => {
  updateCollectionStats();
  
  const navToggle = document.getElementById('nav-toggle');
  const floatingNav = document.getElementById('floating-nav');
  if (navToggle && floatingNav) {
    navToggle.addEventListener('click', (e) => {
      e.preventDefault();
      floatingNav.classList.toggle('open');
    });
  }
  
  if (document.getElementById('generations')) {
    renderGenerationCards();
  }
  
  if (document.getElementById('pokemon-container')) {
    initGenerationPage();
    setupFilterButtons();
  }
  
  if (document.getElementById('detail-container')) {
    initPokemonDetailPage();
  }
  
  if (document.getElementById('search-input')) {
    initSearchPage();
  }
  
  if (document.getElementById('favorites-container')) {
    initFavoritesPage();
  }
  
  if (document.getElementById('recent-container')) {
    initRecentPage();
  }
});$
