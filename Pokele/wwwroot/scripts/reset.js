document.querySelector(".newButton").addEventListener("click", async (event) => {
    event.preventDefault();
    disableButton();
    await reset();
});

async function reset(){
    try {
        guessInput.removeEventListener("keyup", handleGuess);
        guessInput.style.color = "black";
        guessInput.style.fontSize = "1.6vw";
        guessInput.style.textAlign = "left";
        guessInput.value = "";
    
        const evoContainer = document.querySelector(".evoContainer");
        evoContainer.innerHTML = `
            <div class="tippTitle">EVOLUTION</div>
            <div class="singleEvo">
                <img class="questionmark" src="images/questionmark.png">
            </div>`;
    
        document.querySelector(".pokeName").innerText = "???";
    
        const pokemonContainer = document.querySelector(".pokemonContainer");
        pokemonContainer.innerHTML = `
            <div class="spriteContainer">
                <img class="pokemon" id="placeholder" src="images/placeholder.png">
                <div class="pokemonShadow"></div>
            </div>
            <div class="oval"></div>`;
    
        const typeContainer = document.querySelector(".typeContainer");
        typeContainer.innerHTML = `
            <img class="type" src="images/UnknownType.png">
            <img class="type" src="images/UnknownType.png">`;
    
        if(!isGuessingGen){
            const genContainer = document.querySelector(".genContainer");
            genContainer.innerHTML = `
                <div class="tippTitle">GENS</div>
                <div class="gens">
                    <img class="questionmark" src="images/questionmark.png">
                </div>`;
        }
    
        document.removeEventListener("keydown", handleKeyPress);
    
        guessInput = document.querySelector(".styled-input");
        guessInput.disabled = false;
        sprite = document.querySelector(".pokemon");
        genContainer = document.querySelector(".genContainer");
        gens = document.querySelector(".gens");
        alreadyAlternatingContainers = new Set();
        wrongGuesses = 0;
    
        guessInput.disabled = true;
        await getRandomPokemon();
                
        guessInput.disabled = false;
        document.querySelector(".styled-input").style.fontFamily = "Pixel";
        guessInput.focus();
    } catch (error) {
        console.error("Error resetting:", error);
    }
}
