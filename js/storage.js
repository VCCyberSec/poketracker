const STORAGE_KEY = 'poketracker_owned';
const FAVORITES_KEY = 'poketracker_favorites';
const RECENT_KEY = 'poketracker_recent';

function getOwnedPokemon() {
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) return [];
  try {
    return JSON.parse(data);
  } catch {
    return [];
  }
}

function saveOwnedPokemon(owned) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(owned));
}

function isPokemonOwned(pokemonId) {
  const owned = getOwnedPokemon();
  return owned.includes(String(pokemonId));
}

function togglePokemonOwnership(pokemonId) {
  const owned = getOwnedPokemon();
  const id = String(pokemonId);
  const index = owned.indexOf(id);
  
  if (index === -1) {
    owned.push(id);
  } else {
    owned.splice(index, 1);
    const favs = getFavorites();
    const favIndex = favs.indexOf(id);
    if (favIndex !== -1) {
      favs.splice(favIndex, 1);
      saveFavorites(favs);
    }
  }
  
  saveOwnedPokemon(owned);
  return index === -1;
}

function getFavorites() {
  const data = localStorage.getItem(FAVORITES_KEY);
  if (!data) return [];
  try {
    return JSON.parse(data);
  } catch {
    return [];
  }
}

function saveFavorites(favorites) {
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
}

function isPokemonFavorite(pokemonId) {
  const favorites = getFavorites();
  return favorites.includes(String(pokemonId));
}

function togglePokemonFavorite(pokemonId) {
  const favorites = getFavorites();
  const id = String(pokemonId);
  const index = favorites.indexOf(id);
  
  if (index === -1) {
    favorites.push(id);
  } else {
    favorites.splice(index, 1);
  }
  
  saveFavorites(favorites);
  return index === -1;
}

function getRecentPokemon() {
  const data = localStorage.getItem(RECENT_KEY);
  if (!data) return [];
  try {
    return JSON.parse(data);
  } catch {
    return [];
  }
}

function addToRecent(pokemonId) {
  let recent = getRecentPokemon();
  recent = recent.filter(id => id !== String(pokemonId));
  recent.unshift(String(pokemonId));
  recent = recent.slice(0, 20);
  localStorage.setItem(RECENT_KEY, JSON.stringify(recent));
}

function getCollectionStats() {
  const owned = getOwnedPokemon();
  const favorites = getFavorites();
  return {
    owned: owned.length,
    favorites: favorites.length,
    total: 1025
  };
}

function getGenerationStats(gen) {
  const ranges = {
    1: { start: 1, end: 151 },
    2: { start: 152, end: 251 },
    3: { start: 252, end: 386 },
    4: { start: 387, end: 493 },
    5: { start: 494, end: 649 },
    6: { start: 650, end: 721 },
    7: { start: 722, end: 809 },
    8: { start: 810, end: 905 },
    9: { start: 906, end: 1025 }
  };
  
  const range = ranges[gen];
  const owned = getOwnedPokemon();
  
  let ownedInGen = 0;
  for (let i = range.start; i <= range.end; i++) {
    if (owned.includes(String(i))) {
      ownedInGen++;
    }
  }
  
  return {
    owned: ownedInGen,
    total: range.end - range.start + 1,
    percentage: Math.round((ownedInGen / (range.end - range.start + 1)) * 100)
  };
}
