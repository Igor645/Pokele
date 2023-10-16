document.querySelector(".newButton").addEventListener("click", (event) => {
    event.preventDefault()
    disableButton();
    reset();
});

async function reset(){
    document.querySelector(".evoContainer").innerHTML = `<div class="tippTitle">EVOLUTION</div>
    <div class="singleEvo">
        <img class="questionmark" src="images/questionmark.png">
        <!--<img class="evoStage" src="images/placeholder.png"></img>-->
    </div>`
    document.querySelector(".pokeName").innerText = "???";
    document.querySelector(".pokemonContainer").innerHTML = `
        <div class="spriteContainer">
        <img class="pokemon" id="placeholder" src="images/placeholder.png">
        <div class="pokemonShadow"></div>
        </div>
        <div class="oval"></div>`

    document.querySelector(".typeContainer").innerHTML = `    <img class="type" src="images/UnknownType.png">
    <img class="type" src="images/UnknownType.png">`
    
document.querySelector(".rightPart").innerHTML = `<div class="genContainer">
<div class="tippTitle">GENS</div>
<div class="gens">
    <img class="questionmark" src="images/questionmark.png">
</div>
</div>`

guessInput = document.querySelector(".styled-input");
guessInput.disabled = false;
sprite = document.querySelector(".pokemon");
evoContainer = document.querySelector(".evoContainer");
genContainer = document.querySelector(".genContainer");
gens = document.querySelector(".gens");
typeContainer = document.querySelector(".typeContainer");
alreadyAlternatingContainers = [];
wrongGuesses = 0;

guessInput.disabled = true;
await getRandomPokemon();
setTimeout(() => {
    guessInput.disabled = false;
    guessInput.focus();
  }, 500)
}