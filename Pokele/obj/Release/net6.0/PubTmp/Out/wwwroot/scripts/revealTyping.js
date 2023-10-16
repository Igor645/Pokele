async function fetchPokemonTyping(pokemonSpeciesUrl) {
    try {
      const response = await fetch(pokemonSpeciesUrl);
      const speciesData = await response.json();
  
      // Extract the typing information from species data
      const typing = speciesData.types.map(typeInfo => typeInfo.type.name);
      
      return typing;
    } catch (error) {
      console.error("Error fetching typing:", error);
      return null;
    }
  }
  
  // Usage
  async function revealTyping() {
    try {
      const typingData = await fetchPokemonTyping(`https://pokeapi.co/api/v2/pokemon/${currentPokemonSpecies.id}`);
        typeContainer.querySelectorAll(".type").forEach(element => {
            element.remove();
        })

      if (typingData) {
        typingData.forEach(type => {
            typeContainer.innerHTML += `<img class="type" src="../typeImages/${type}.png">`
        })               
      }
    } catch (error) {
      console.error("Error revealing typing:", error);
    }
  }