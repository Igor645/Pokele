const inputElement = document.querySelector(".guessInput");
const silhouetteBtn = document.querySelector(".silhouetteBtn");
const audio = document.getElementById("myAudio");
const pixelSprites = document.querySelectorAll('.pixelSprite');
let guessedPokemon = [];
let amountOfPokemon = pixelSprites.length;
let isSavingProgress = false;
const languageCheckboxes = document.querySelectorAll('.language-checkbox');

const getAlreadyGuessedPokemon = async () => {
  const userId = sessionStorage.getItem('userId');

  try {
      const response = await fetch(`http://noobtriestowin-001-site1.ctempurl.com/api/User/${userId}/GetGuessedPokemon`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    if (!response.ok) {
      const errorMessage = await response.text();
      throw new Error(`Error getting guessed Pokémon: ${errorMessage}`);
    }

    savedGuesses = await response.json();
    guessedPokemon = savedGuesses;
  } catch (error) {
    console.error('Error:', error);
  }
};

if(sessionStorage.getItem("isLoggedIn")){
  getAlreadyGuessedPokemon();
}

function updateLabelState(checkbox) {
  const label = checkbox.parentElement.querySelector(".language-label");
  const isChecked = checkbox.checked;

  if (isChecked) {
    label.classList.add('label-checked');
  } else {
    label.classList.remove('label-checked');
  }
}

languageCheckboxes.forEach((checkbox) => {
  updateLabelState(checkbox);

  checkbox.addEventListener('click', () => {
    updateLabelState(checkbox);
    checkInput();
  });
});

audio.volume = 0.3;

silhouetteBtn.addEventListener("click", event => {
  event.preventDefault();

  pixelSprites.forEach((sprite) => {
    const imgClasses = Array.from(sprite.classList);

    if(imgClasses.includes("unguessed")){
      sprite.style.filter = "brightness(0)";
      revealPokemon(sprite);
    }
  })
})

inputElement.addEventListener('input', checkInput);

async function checkInput() {
  const inputValue = inputElement.value.toLowerCase();
  
  if (!inputValue) {
    return;
  }

  pixelSprites.forEach(async (img) => {
    const namesAttribute = img.getAttribute('data-names');
    const imgClasses = Array.from(img.classList);

    if (namesAttribute) {
      const namePairs = namesAttribute.split(' ');
      const nameMap = {};
    
      namePairs.forEach((pair) => {
        const [language, name] = pair.split(':');
        const formattedName = name ? name.toLowerCase().replace(/_/g, ' ') : '';
        nameMap[language] = formattedName;
      });
      const selectedLanguages = Array.from(document.querySelectorAll('.language-checkbox:checked')).map(checkbox => checkbox.value);
    
      const formattedInputValue = inputValue.toLowerCase();
    
      if (selectedLanguages.some(language => nameMap[language] === formattedInputValue) && imgClasses.includes("unguessed")) {
        guessedPokemon.push(img.id);
        if(sessionStorage.getItem("isLoggedIn")){
          waitForSave(img);
        }
        console.log(guessedPokemon.length)
        console.log(amountOfPokemon)
        audio.currentTime = 0;
        await revealPokemon(img);
        inputElement.value = "";
        img.style.filter = "none";
        img.classList.remove("unguessed");

        if(guessedPokemon.length == amountOfPokemon){
          resetGuessedPokemon();
          stopTimer();
          document.body.innerHTML += `<div class="bufferContainer">
              <div class="guessedAll">
                  <div class="congrats">YOU HAVE GUESSED THEM ALL</div>
                  <div class="resetButton">RESET</div>
              </div>
          </div>`
          
          document.querySelector(".resetButton").addEventListener("click", event => {
            event.preventDefault();
            location.reload();
          })
        }
      }
    }
  });
}

async function revealPokemon(img) {
  const alternateImageSrc = img.getAttribute("data-alternateimage"); 
  const tempImage = new Image();
  tempImage.src = alternateImageSrc;

  tempImage.onload = function() {
    img.src = alternateImageSrc;
    audio.play();
    img.classList.remove("unknown");
    img.classList.add("guessed")
  };
}

async function saveProgress(img){
  const guessedPokemonDto = {
    PokemonId: img.id
  };
  console.log(`uploading ${img.id}`)
  const userId = sessionStorage.getItem('userId');

  try {
      const response = await fetch(`http://noobtriestowin-001-site1.ctempurl.com/api/User/${userId}/AddGuessedPokemon`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(guessedPokemonDto)
    });
  
    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.error('Error:', error);
  }
}

async function waitForSave(img){
  if (!isSavingProgress) {
    isSavingProgress = true;
    try {
      await saveProgress(img);
    } finally {
      isSavingProgress = false;
    }
  } else {
    while (isSavingProgress) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    await saveProgress(img)
  }
}


