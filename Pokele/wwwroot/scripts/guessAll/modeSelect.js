let modes = document.querySelectorAll(".mode");
let genContainers = document.querySelectorAll(".genGuess")
let recordDiv = document.querySelector(".recordContainer")
let chosenGeneration;
let modeId; 

const getChosenGeneration = async () => {
  const userId = sessionStorage.getItem('userId');

  try {
      const response = await fetch(`${apiUrl}/User/${userId}/GetChosenGeneration`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    if (!response.ok) {
      const errorMessage = await response.text();
      throw new Error(`Error getting chosen generation: ${errorMessage}`);
    }

    chosenGeneration = await response.text();
    
  } catch (error) {
    console.error('Error:', error);
  }
};

async function main () {
  if(sessionStorage.getItem("isLoggedIn"))
  {
    await getChosenGeneration();
    if(chosenGeneration != "none")
    {
      console.log(chosenGeneration)
      document.querySelector(".modes").innerHTML += `<div id="continue" class="mode mainMode">continue</div>`
      modes = document.querySelectorAll(".mode");
    }
  }
  modes.forEach(mode => {
    mode.addEventListener("click", async (event) => {
        const chosenGeneration = mode.id;
        modeId = mode.id;
        event.preventDefault();
        await handleMode(mode);
        document.querySelector(".bufferContainer").remove();
        document.body.style.overflowY = 'auto';
        addScript('scripts/guessAll/timer.js');
        addScript('scripts/guessAll/guess.js');

        const isLoggedIn = sessionStorage.getItem('isLoggedIn') === 'true';
        if (isLoggedIn && mode.id != "continue") {
            const userId = sessionStorage.getItem('userId');
        
            await getRecordTime(userId, mode.id)
            fetch(`${apiUrl}/User/${userId}/SetChosenGeneration`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ generation: chosenGeneration })
            })
            .then(response => response.json())
            .then(data => console.log(data))
            .catch(error => console.error('Error:', error));
        }          
    })
})
}

main();

async function handleMode(mode) {
  const userId = sessionStorage.getItem('userId');      
    let genToGuess;
    if (mode.id != "continue") {
      if(sessionStorage.getItem("isLoggedIn")){
        await resetGuessedPokemon();
      }
      genToGuess = mode.id;
    } else {
      addScript('scripts/guessAll/loadData.js');
      await getChosenGeneration();
      genToGuess = chosenGeneration;
      await getRecordTime(userId, genToGuess)
    }
  
    genContainers.forEach(gen => {
      const collumn = gen.parentElement;
  
      if (gen.id != genToGuess && genToGuess != "all") {
        gen.remove();
        if (collumn.children.length === 0) {
          collumn.remove();
        }
      }
    });
  }

  const getRecordTime = async (userId, generation) => {
    try {
        const response = await fetch(`${apiUrl}/User/${userId}/GetRecordTime?generation=${generation}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });
  
      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(`Error getting record time: ${errorMessage}`);
      }
  
      recordDiv.innerText = await response.text();
      console.log(`Record time for ${generation}:`);
  
      // Do something with the recordTime data, e.g., update the UI
    } catch (error) {
      console.error('Error:', error);
    }
  };  

const resetGuessedPokemon = async () => {
    const userId = sessionStorage.getItem('userId');
  
    try {
        const response = await fetch(`${apiUrl}/User/${userId}/ResetGuessedPokemon`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        }
      });
  
      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(`Error resetting guessed Pokemon: ${errorMessage}`);
      }
  
      const userData = await response.json();
      console.log('Guessed Pokemon reset successfully:', userData);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  


