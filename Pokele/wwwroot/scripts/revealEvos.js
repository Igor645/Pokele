async function fetchEvolutionChain(url) {
    try {
      const response = await fetch(url);
      const evolutionChainData = await response.json();
      return evolutionChainData;
    } catch (error) {
      console.error("Error fetching evolution chain:", error);
      return null;
    }
  }
  
async function revealEvolutions() {
  try {
    const evolutionChainUrl = currentPokemonSpecies.evolution_chain.url;
    const evolutionChain = await fetchEvolutionChain(evolutionChainUrl);

    if (!evolutionChain || !evolutionChain.chain) {
      throw new Error('Invalid evolution data');
    }

    const countAndIds = countEvolutionStages(evolutionChain.chain);
    let evoContainer = document.querySelector('.evoContainer'); // Replace with your actual container ID or selector

    if (!evoContainer) {
      throw new Error('Invalid container element');
    }

    evoContainer.querySelector(".singleEvo").remove();

    for (let i = 0; i < countAndIds[0]; i++) {
      const singleEvo = document.createElement('div');
      singleEvo.classList.add('singleEvo');

      const img = document.createElement('img');
      img.classList.add('evoStage', 'placeholder');
      img.id = countAndIds[1][i];
      img.src = 'images/placeholder.png';

      if (
        countAndIds[1][i] == randomSpeciesNumber ||
        (Array.isArray(countAndIds[1][i]) &&
          countAndIds[1][i].includes(randomSpeciesNumber.toString()))
      ) {
        img.classList.add('marked');
      }

      singleEvo.appendChild(img);
      evoContainer.appendChild(singleEvo);
    }
  } catch (error) {
    console.error("Error revealing evolutions:", error);
  }
}


  function extractPokemonIdFromUrl(url) {
    const urlParts = url.split("/");
    return urlParts[urlParts.length - 2];
  }

  function countEvolutionStages(chain) {
    let countAndIds = [];
    let count = 1;
    let pokemonId
    let chainsToCheck = [];
    const evolutionIds = [];
    
    while (chain != null) {
      if(chain.species && chain.evolves_to.length <= 1){
        pokemonId = extractPokemonIdFromUrl(chain.species.url);
        if(chain.evolves_to.length != 0)
        {
          chain = chain.evolves_to[0];
          count++;
        }
        else{
          chain = null
        }
        evolutionIds.push(pokemonId);
      }
      else if(chain.evolves_to != []) {
        pokemonId = extractPokemonIdFromUrl(chain.species.url);
        evolutionIds.push(pokemonId);
        pokemonId = []
        chain.evolves_to.forEach(branch => {
          pokemonId.push(extractPokemonIdFromUrl(branch.species.url))
          chainsToCheck.push(branch)
        })
        chain = null;
        count++;
        evolutionIds.push(pokemonId);
      }
    }

    while(chainsToCheck != null){
      pokemonId = []
      chainsToCheck.forEach(chain => {
        checkChain(pokemonId, chain)
      })

      if(pokemonId.length != 0){
        evolutionIds.push(pokemonId);
        count++;
      }
      chainsToCheck = null;
    }
  
    countAndIds = [count, evolutionIds];

    console.log(countAndIds)
    return countAndIds;
  }

function checkChain(pokemonId, chain){    
    if(chain.evolves_to.length != 0){
      chain.evolves_to.forEach(branch => {
        pokemonId.push(extractPokemonIdFromUrl(branch.species.url))
      })
    }
}
  
  