let sprite = document.querySelector(".pokemon");
let evoContainer = document.querySelector(".evoContainer");
let genContainer = document.querySelector(".genContainer");
let gens = document.querySelector(".gens");
let typeContainer = document.querySelector(".typeContainer");

let currentPokemonSpecies;
let currentPokemon;
let correctName;
let randomSpeciesNumber;
let wrongGuesses = 0;

guessInput.focus();

const isLoggedIn = sessionStorage.getItem('isLoggedIn') === 'true';

const loginLink = document.querySelector('.login');

if (isLoggedIn) {
  const username = sessionStorage.getItem('accountName').toUpperCase();
  loginLink.innerText = username;

  loginLink.removeAttribute('href');
}


guessInput.addEventListener("keyup", async function(event) {
    if (event.key === "Enter") {
      disableButton();
        const userGuess = guessInput.value.toLowerCase();

        if (correctName == userGuess) {
          guessInput.disabled = true;
          console.log(wrongGuesses)
          inputFieldGlow("lime");
            if (wrongGuesses === 0) {
              await revealEvolutions();
            }
          
            if (wrongGuesses <= 1) {
              await revealGens();
            }
          
            if (wrongGuesses <= 2) {
              await revealTyping();
            }
          
            if (wrongGuesses <= 3) {
              revealSilhouette();
            }
          
            if (wrongGuesses <= 4) {
              setTimeout(() => {
                brightenAll();
              }, 1000)
            }

        } else {
            inputFieldGlow("red");
            wrongGuesses++;
            getTips();
        }
        guessInput.value = "";
    }
});

getRandomPokemon();

async function getRandomPokemon(){
    await fetch("https://pokeapi.co/api/v2/pokemon-species/")
    .then(response => response.json())
    .then(data => {
      const speciesCount = data.count;
      //randomSpeciesNumber = 133
      randomSpeciesNumber = Math.floor(Math.random() * speciesCount) + 1;
      console.log(`Random species number: ${randomSpeciesNumber}`);
  
      fetch(`https://pokeapi.co/api/v2/pokemon-species/${randomSpeciesNumber}/`)
        .then(response => response.json())
        .then(pokemonSpecies => {
            currentPokemonSpecies = pokemonSpecies;
            correctName = getCorrectName("en");
            console.log(pokemonSpecies)
        })
        .catch(error => {
          console.error("Error fetching random Pokémon species:", error);
        });
    })
    .catch(error => {
      console.error("Error fetching species count:", error);
    });
  }

  function changeSpriteSize(){
    sprite.id = "";
    sprite.style.transform = "scale(2.3)";
  }

  function brighten(image){
    image.style.filter = "";
  }

  function brightenAll()
  {
    document.querySelectorAll(".evoStage").forEach(stage => {
      brighten(stage)
    });

    document.querySelector(".pokeName").innerText = correctName.toUpperCase();

    brighten(sprite);
  }

  function inputFieldGlow(color) {
    guessInput.style.backgroundColor = color;

    setTimeout(() => {
        guessInput.style.backgroundColor = "white";
    }, 1000);
  }

  async function getTips(){
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
        guessInput.disabled = true;
        break;
    }
  }
  
  function disableButton() {
    let newButton = document.querySelector(".newButton");
    newButton.classList.add("disabled"); 
    setTimeout(() => {
      newButton.classList.remove("disabled");
    }, 1000);
  }

  