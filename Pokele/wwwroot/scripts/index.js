let sprite = document.querySelector(".pokemon");
let evoContainer = document.querySelector(".evoContainer");
let genContainer = document.querySelector(".genContainer");
let gens = document.querySelector(".gens");
let typeContainer = document.querySelector(".typeContainer");
const container = document.querySelector('#firework-container')
const fireworks = new Fireworks.default(container, {
  paricles: 70,
  delay: {
    min: 10,  // Lower minimum delay
    max: 30   // Lower maximum delay
  },
  acceleration: 1.04,
  intensity: 40
})
let currentPokemonSpecies;
let currentPokemon;
let correctName;
let randomSpeciesNumber;
let wrongGuesses = 0;
let isGuessingGen = false;

guessInput.focus();

const isLoggedIn = sessionStorage.getItem('isLoggedIn') === 'true';

const loginLink = document.querySelector('.login');

if (isLoggedIn) {
  const username = sessionStorage.getItem('accountName').toUpperCase();
  loginLink.innerText = username;

  loginLink.removeAttribute('href');
}


let canPressEnter = true;

async function handleGuess(event) {
  if (event.key === "Enter" && canPressEnter) {
    canPressEnter = false; // Disable pressing Enter temporarily
    disableButton();
    const userGuess = guessInput.value.toLowerCase();
    guessInput.value = "";

    if (correctName == userGuess) {
      launchFireworkWithRandomDelay(15, 0, 0);
      guessInput.disabled = true;
      if (wrongGuesses === 0) {
        await revealEvolutions();
      }

      if (wrongGuesses <= 1 && !isGuessingGen) {
        await revealGens();
      }

      if (wrongGuesses <= 2) {
        await revealTyping();
      }

      if (wrongGuesses <= 3) {
        await revealSilhouette();
      }

      if (wrongGuesses <= 4) {
        brightenAll();
      }

      guessInput.style.color = "green";
      guessInput.style.fontFamily = "MarioKart";
      guessInput.style.textAlign = "center";
      guessInput.value = "YOU GUESSED IT!!!";
    } else {
      inputFieldShake();
      wrongGuesses++;
      getTips();
    }

    setTimeout(() => {
      canPressEnter = true; // Re-enable pressing Enter after a delay
    }, 400); // Allow pressing Enter after 1 second
  }
}

genPickFunctions();
getRandomPokemon();

async function getRandomPokemon() {
  let apiUrl;
  let generation = document.querySelector(".genPick.selected").id;
  
  let minPokemonId;
  let maxPokemonId;

  if (generation != "all") {
    isGuessingGen = true;
    await getPokedexRangeForGeneration(generation)
    .then(({ min, max }) => {
      console.log(`Minimum Pokedex Number: ${min}`);
      console.log(`Maximum Pokedex Number: ${max}`);
      randomSpeciesNumber = getRandomNumberBetween(min, max);
    })
    .catch(error => console.error('Error:', error));
  } else {
    isGuessingGen = false;
    apiUrl = "https://pokeapi.co/api/v2/pokemon-species/";
    await fetch(apiUrl)
      .then(response => response.json())
      .then(data => {
        maxPokemonId = data.count;
        minPokemonId = 1;
        randomSpeciesNumber =getRandomNumberBetween(minPokemonId, maxPokemonId);
      })
      .catch(error => {
        console.error("Error fetching total species count:", error);
      });
  }

  console.log(randomSpeciesNumber)
  await fetch(`https://pokeapi.co/api/v2/pokemon-species/${randomSpeciesNumber}/`)
    .then(response => response.json())
    .then(pokemonSpecies => {
      currentPokemonSpecies = pokemonSpecies;
      correctName = getCorrectName("en");
      if(isGuessingGen){
        revealGens();
      }
      console.log(pokemonSpecies);
      guessInput.addEventListener("keyup", handleGuess);
    })
    .catch(error => {
      console.error("Error fetching random Pokémon species:", error);
    });

    function getRandomNumberBetween(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }
}

async function getPokedexRangeForGeneration(generation) {
  const response = await fetch(`https://pokeapi.co/api/v2/generation/${generation}/`);
  const data = await response.json();
  
  const pokemonSpeciesUrls = data.pokemon_species.map(species => species.url);
  const pokemonIds = pokemonSpeciesUrls.map(url => url.split('/').slice(-2, -1)[0]);
  
  const min = Math.min(...pokemonIds);
  const max = Math.max(...pokemonIds);
  
  return { min, max };
}

  function changeSpriteSize(){
    sprite.id = "";
    sprite.style.transform = "scale(2.3)";
    sprite.style.maxHeight = "12vh"
  }

  async function brightenAll() {
    await Promise.all(
      Array.from(document.querySelectorAll(".evoStage")).map(async (stage) => {
        await brighten(stage);
      })
    );
  
    document.querySelector(".pokeName").innerText = correctName.toUpperCase();
  
    await brighten(sprite);
  
    document.addEventListener("keydown", handleKeyPress);
  }
  
  function brighten(image) {
    return new Promise((resolve) => {
        image.style.filter = "";
        resolve();
    });
  }
  
  async function handleKeyPress(event) {
    if (event.key === "Enter") {
        await reset();
    }
  };  

  function inputFieldShake() {
    const textboxImage = document.querySelector(".textbox-image");
    guessInput.classList.remove("shake");
    textboxImage.classList.remove("shake");
    void textboxImage.offsetWidth;
    void guessInput.offsetWidth;
    guessInput.classList.add("shake");
    textboxImage.classList.add("shake");
  }

  async function getTips(){
    if(isGuessingGen){
      switch (wrongGuesses)
      {
        case 1:
          console.log("revealing evos")
          await revealEvolutions();
          break;
        case 2:
          console.log("revealing type")
          await revealTyping();
          break;
        case 3:
          console.log("revealing silhouette")
          await revealSilhouette();
          break;
        case 4:
          console.log("revealing sprite")
          brightenAll();
          wrongMarker();
          break;
      }
    }
    else{
      switch (wrongGuesses)
      {
        case 1:
          await revealEvolutions();
          break;
        case 2:
          revealGens();
          break;
        case 3:
          await revealTyping();
          break;
        case 4:
          await revealSilhouette();
          break;
        case 5:
          brightenAll();
          wrongMarker();
          break;
      }
    }

    function wrongMarker(){
      guessInput.style.color = "red";
      guessInput.style.fontFamily = "MarioKart";
      guessInput.style.textAlign = "center";
      guessInput.disabled = true;
      guessInput.value = "YOU COULDN'T GUESS IT"
    }
  }
  
  function disableButton() {
    let newButton = document.querySelector(".newButton");
    newButton.classList.add("disabled"); 
    setTimeout(() => {
      newButton.classList.remove("disabled");
    }, 1000);
  }

  function generateRandomDelay(min, max) {
    return Math.random() * (max - min) + min;
}

function launchFireworkWithRandomDelay(numTimes, minDelay, maxDelay) {
    let count = 0;
    
    function launch() {
        if (count < numTimes) {
            fireworks.launch(1);
            count++;
            setTimeout(launch, generateRandomDelay(minDelay, maxDelay));
        }
    }

    launch();
}


function genPickFunctions(){
const genPicks = document.querySelectorAll('.genPick');

function handleGenPickClick(event) {
    genPicks.forEach(genPick => {
      if(genPick.id == "all"){
        isGuessingGen = false;
      }
      genPick.classList.remove('selected')
    });
    event.target.classList.add('selected');    
    reset();
}


genPicks.forEach(genPick => {
    genPick.addEventListener('click', handleGenPickClick);
});

}
