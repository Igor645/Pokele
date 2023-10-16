let savedGuesses
const loadAudio = document.getElementById("myAudio");
loadAudio.volume = 0.3;

const getGuessedPokemon = async () => {
    const userId = sessionStorage.getItem('userId');
  
    try {
        const response = await fetch(`${apiUrl}/User/${userId}/GetGuessedPokemon`, {
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
      searchGuessedPokemon();  
    } catch (error) {
      console.error('Error:', error);
    }
  };
  
getGuessedPokemon();

function searchGuessedPokemon(){
  document.querySelectorAll('.pixelSprite').forEach(sprite => {
        if(savedGuesses.includes(parseInt(sprite.id))){
            revealDbPokemon(sprite);
        }
    })
}

function revealDbPokemon(img) {
    img.classList.remove("unguessed");
    const alternateImageSrc = img.getAttribute("data-alternateimage"); 
  
    const tempImage = new Image();
    tempImage.src = alternateImageSrc;
  
    tempImage.onload = function() {
      loadAudio.currentTime = 0;
      img.src = alternateImageSrc;
      loadAudio.play();
      img.classList.remove("unknown");
      img.classList.add("guessed");
      document.querySelector(".nowGuessed").innerText = guessedPokemon.length;
      genContainerUnguessed(img.parentElement.parentElement);
    };
  }
  
  function genContainerUnguessed(container){
    let unguessedMon = container.querySelectorAll(".unguessed");
    console.log(unguessedMon.length);
    if(unguessedMon.length === 0){
      container.style.border = "0.3vw solid rgb(77, 210, 126)"
    }
  }