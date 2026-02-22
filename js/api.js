const BASE_URL = 'https://pokeapi.co/api/v2';

const GEN_RANGES = {
  1: { start: 1, end: 151, region: 'Kanto', name: 'Generation I' },
  2: { start: 152, end: 251, region: 'Johto', name: 'Generation II' },
  3: { start: 252, end: 386, region: 'Hoenn', name: 'Generation III' },
  4: { start: 387, end: 493, region: 'Sinnoh', name: 'Generation IV' },
  5: { start: 494, end: 649, region: 'Unova', name: 'Generation V' },
  6: { start: 650, end: 721, region: 'Kalos', name: 'Generation VI' },
  7: { start: 722, end: 809, region: 'Alola', name: 'Generation VII' },
  8: { start: 810, end: 905, region: 'Galar', name: 'Generation VIII' },
  9: { start: 906, end: 1025, region: 'Paldea', name: 'Generation IX' }
};

async function fetchWithTimeout(url, timeout = 10000) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  
  try {
    const response = await fetch(url, { signal: controller.signal });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
  } catch (error) {
    if (error.name === 'AbortError') {
      throw new Error('Request timeout');
    }
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
}

async function fetchWithRetry(url, retries = 3, timeout = 10000) {
  for (let i = 0; i < retries; i++) {
    try {
      return await fetchWithTimeout(url, timeout);
    } catch (error) {
      if (i === retries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
    }
  }
}

async function fetchPokemonList(start, end) {
  const promises = [];
  for (let i = start; i <= end; i++) {
    promises.push(fetchPokemon(i));
  }
  return Promise.all(promises);
}

async function fetchPokemonBatch(start, count = 30) {
  const promises = [];
  for (let i = start; i < start + count && i <= 905; i++) {
    promises.push(fetchPokemon(i));
  }
  return Promise.all(promises);
}

async function searchPokemon(query) {
  const results = [];
  const searchId = parseInt(query);
  const queryLower = query.toLowerCase();
  
  if (!isNaN(searchId) && searchId >= 1 && searchId <= 1025) {
    try {
      const pokemon = await fetchPokemon(searchId);
      results.push(pokemon);
    } catch (e) {}
  }
  
  if (results.length >= 20) return results;
  
  try {
    const data = await fetchWithRetry(`${BASE_URL}/pokemon?limit=1025`, 3, 15000);
    const allPokemon = data.results;
    
    const matchingNames = allPokemon
      .filter(p => {
        const name = p.name.toLowerCase();
        return name.includes(queryLower);
      })
      .slice(0, 20 - results.length);
    
    const fetchPromises = matchingNames.map(p => {
      const id = parseInt(p.url.split('/').filter(Boolean).pop());
      return fetchPokemon(id).catch(() => null);
    });
    
    const fetched = await Promise.all(fetchPromises);
    fetched.forEach(p => {
      if (p && results.length < 20) {
        results.push(p);
      }
    });
  } catch (e) {
    console.error('Search failed:', e);
  }
  
  return results.slice(0, 20);
}

async function fetchPokemon(idOrName) {
  const data = await fetchWithRetry(`${BASE_URL}/pokemon/${idOrName}`);
  return formatPokemonData(data);
}

function formatPokemonData(data) {
  return {
    id: data.id,
    name: data.name,
    species: data.species,
    types: data.types.map(t => t.type.name),
    sprites: {
      front: data.sprites.front_default,
      frontShiny: data.sprites.front_shiny,
      official: data.sprites.other['official-artwork']?.front_default || data.sprites.front_default,
      animated: data.sprites.versions?.['generation-v']?.['black-white']?.animated?.front_default
    },
    stats: data.stats.map(s => ({
      name: s.stat.name,
      value: s.base_stat
    })),
    height: data.height / 10,
    weight: data.weight / 10,
    abilities: data.abilities.map(a => ({
      name: a.ability.name,
      isHidden: a.is_hidden
    }))
  };
}

function getGenerationInfo(gen) {
  return GEN_RANGES[gen];
}

async function fetchAllGenerations() {
  const gens = [];
  for (let i = 1; i <= 9; i++) {
    const info = GEN_RANGES[i];
    gens.push({
      number: i,
      region: info.region,
      name: info.name,
      start: info.start,
      end: info.end,
      count: info.end - info.start + 1
    });
  }
  return gens;
}

const GIGANTAMAX_FORMS = {
  12: true, 25: true, 133: true, 143: true, 150: true, 165: true, 166: true,
  204: true, 205: true, 207: true, 210: true, 212: true, 214: true, 215: true,
  227: true, 229: true, 248: true, 413: true, 414: true, 416: true, 417: true,
  425: true, 426: true, 454: true, 462: true, 472: true, 474: true, 484: true,
  531: true, 569: true, 628: true, 705: true, 713: true, 720: true, 724: true,
  725: true, 726: true, 727: true, 728: true, 729: true, 730: true, 774: true,
  777: true, 778: true, 801: true, 806: true, 888: true, 889: true, 890: true,
  891: true, 892: true, 894: true, 895: true, 896: true, 897: true, 898: true,
};

function hasGigantamax(id) {
  return !!GIGANTAMAX_FORMS[id];
}

function getGen8GigantamaxSprite(id) {
  const gigantamaxList = [
    1,2,3,4,5,6,7,8,9,10,11,12,25,26,27,28,52,53,59,68,69,70,71,74,75,76,
    94,95,99,100,101,102,103,104,105,106,107,108,109,110,111,112,113,114,115,
    116,117,118,119,120,121,122,123,124,125,126,127,128,129,130,131,132,133,
    134,135,136,137,138,139,140,141,142,143,144,145,146,147,148,149,150,151,
    155,156,157,158,159,160,161,162,163,164,165,166,170,171,172,173,174,175,
    176,177,178,179,180,181,182,183,184,185,186,187,188,189,190,191,192,193,
    194,195,196,197,198,199,200,201,202,203,204,205,207,208,209,210,211,212,
    213,214,215,217,218,219,220,221,222,223,224,225,226,227,228,229,230,232,
    233,234,235,236,237,238,239,240,241,242,243,244,245,246,247,248,249,250,
    251
  ];
  
  if (gigantamaxList.includes(id)) {
    return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/${id}.png`;
  }
  return null;
}

async function fetchGigantamaxData(id) {
  try {
    const data = await fetchWithRetry(`${BASE_URL}/pokemon/${id}`);
    if (data.forms && data.forms.some(f => f.name.includes('gigantamax'))) {
      return {
        hasGigantamax: true,
        gigantamaxName: `${data.name}-gigantamax`
      };
    }
  } catch (e) {}
  return { hasGigantamax: hasGigantamax(id) };
}

async function fetchPokemonForms(idOrName) {
  try {
    console.log('Fetching forms for:', idOrName);
    const data = await fetchWithRetry(`${BASE_URL}/pokemon-species/${idOrName}`);
    const forms = [];
    
    console.log('Varieties:', data.varieties?.length);
    
    if (data.varieties && data.varieties.length > 1) {
      for (const variety of data.varieties) {
        const formId = parseInt(variety.pokemon.url.split('/').filter(Boolean).pop());
        forms.push({
          name: variety.pokemon.name,
          id: formId,
          isDefault: variety.is_default
        });
      }
    }
    
    console.log('Forms found:', forms.length);
    return forms;
  } catch (e) {
    console.error('Error fetching forms:', e);
    return [];
  }
}

function getPokemonImageUrl(id) {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;
}

function getOfficialArtworkUrl(id) {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
}
