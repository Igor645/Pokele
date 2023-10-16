const availableGens = ["gen-i", "gen-ii", "gen-iii", "gen-iv", "gen-v", "gen-vi", "gen-vii", "gen-viii", "gen-ix"];
const languages = ['en', 'fr', 'de', 'es'];
const rejectedForms = ["totem", "mega", "gmax", "starter", "-cap", "orange", "yellow",
                      "green", "blue", "indigo", "violet", "50-power-construct", "-ash", "battle-bond",
                      "small", "large", "super", "cosplay", "own-tempo"]; 
const isLoggedIn = sessionStorage.getItem('isLoggedIn') === 'true';

const loginLink = document.querySelector('.login');

const apiUrl = "https://noobtriestowin-001-site1.ctempurl.com/api"

if (isLoggedIn) {
  const username = sessionStorage.getItem('accountName').toUpperCase();
  loginLink.innerText = username;

  loginLink.removeAttribute('href');
}

async function fetchPokemonData(genId) {
  try {
    const response = await fetch(`https://pokeapi.co/api/v2/generation/${genId}/`);
    const data = await response.json();
    const pokemonArray = [];

    for (const entry of data.pokemon_species) {
      const pokemonId = entry.url.split('/').slice(-2, -1)[0];
      const localizedNames = await fetchLocalizedNames(pokemonId);

      pokemonArray.push({
        id: pokemonId,
        localizedNames: localizedNames,
        alternateImg: [`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonId}.png`]
      });

      const speciesResponse = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${pokemonId}/`);
      const speciesData = await speciesResponse.json();

      if (speciesData.varieties.length > 1) {
        for (let i = 1; i < speciesData.varieties.length; i++) {
          const variety = speciesData.varieties[i];
          const formName = variety.pokemon.name;
          const includesPart = rejectedForms.some(form => formName.includes(form));
          if (!includesPart) {
            const formId = variety.pokemon.url.split('/').slice(-2, -1)[0];
            const foundPokemon = pokemonArray.find(pokemon => pokemon.id === pokemonId);
            let altUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${formId}.png`;
            isValidURL(altUrl)
            .then(isValid => {
                if (isValid) {
                    foundPokemon.alternateImg.push(altUrl);
                } else {
                    console.error(`Invalid URL: ${altUrl}`);
                }
            })
            .catch(error => console.error(error));        
          }
        }    
      }
    }
    console.log(pokemonArray)
    return pokemonArray;
  } catch (error) {
    console.error('Error fetching Pokemon data:', error);
    return [];
  }
}

function isValidURL(url) {
  return fetch(url)
      .then(response => response.ok)
      .catch(() => false);
}

function extractName(input) {
  const parts = input.split('-');
  console.log(parts)
  if (parts.length === 2) {
    console.log(parts[1])
    return parts[1];
  } else {
    const result = parts.slice(1).join('-');
    console.log(result)
    return result;
  }
}

async function fetchLocalizedNames(pokemonId) {
    const localizedNames = {};
  
    for (const language of languages) {
      try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${pokemonId}/`);
        const data = await response.json();

        const nameEntry = data.names.find((nameData) => nameData.language.name === language);
  
        if (nameEntry) {
          let name = nameEntry.name;
          name = name.replace(/♀/g, '').replace(/♂/g, '');
          name = name.replace(/\s+/g, '_');
          localizedNames[language] = name;
        }
      } catch (error) {
        console.error(`Error fetching ${language} name for Pokemon ${pokemonId}:`, error);
      }
    }
  
    return localizedNames;
  }
  

  async function renderGeneration(genId, genString) {
    const pokemonData = await fetchPokemonData(genId);
    pokemonData.sort((a, b) => {
        return parseInt(a.id) - parseInt(b.id);
    });
  
    const pixelContainer = document.getElementById(genString).querySelector('.pixelContainer');
  
    // Create an array of promises for URL validations
    const urlValidationPromises = pokemonData.map(async (pokemon) => {
      const isValid = await isValidURL(`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png`);
      return { isValid, pokemon };
    });
  
    const validatedData = await Promise.all(urlValidationPromises);
  
    validatedData.forEach(({ isValid, pokemon }) => {
      if (isValid) {
        pixelContainer.insertAdjacentHTML(
          'beforeend',
          `
          <img class="pixelSprite unknown unguessed" id="${pokemon.id}" data-names="en:${pokemon.localizedNames.en} de:${pokemon.localizedNames.de} 
          fr:${pokemon.localizedNames.fr} es:${pokemon.localizedNames.es}" data-alternateimage="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png" src="images/UnknownPokemon.png">
        `
        );
  
        if (pokemon.alternateImg.length > 0) {
          const container = document.getElementById(pokemon.id);
          container.alternateImages = [];
          pokemon.alternateImg.forEach(img => {
            container.alternateImages.push(img);
          });
        }
      }
    });
  
    console.log(pokemonData);
  }
  

async function renderAllGenerations() {
  document.body.style.overflowY = 'hidden';
  const generationPromises = availableGens.map(async (gen, index) => {
    const genId = index + 1;
    await renderGeneration(genId, gen);
  });

  try {
    await Promise.all(generationPromises);
    handlePostLoading();
    document.body.style.overflowY = 'auto';
  } catch (error) {
    console.error('Error loading generations:', error);
  }
}

function addScript(scriptUrl){
  const scriptElement = document.createElement('script');
  scriptElement.src = scriptUrl;
  document.body.appendChild(scriptElement);
}

function handlePostLoading(){
  document.querySelector(".bufferContainer").innerHTML = `
  <div class="gameModeTitle">what do you want to guess?</div>
  <div class="modes">
      <div id="all" class="mode mainMode">all</div>
      <div id="gen-i" class="mode subMode">gen-i</div>
      <div id="gen-ii" class="mode subMode">gen-ii</div>
      <div id="gen-iii" class="mode subMode">gen-iii</div>
      <div id="gen-iv" class="mode subMode">gen-iv</div>
      <div id="gen-v" class="mode subMode">gen-v</div>
      <div id="gen-vi" class="mode subMode">gen-vi</div>
      <div id="gen-vii" class="mode subMode">gen-vii</div>
      <div id="gen-viii" class="mode subMode">gen-viii</div>
      <div id="gen-ix" class="mode subMode">gen-ix</div>
  </div>
  `

  addScript('scripts/guessAll/modeSelect.js');
}

renderAllGenerations();