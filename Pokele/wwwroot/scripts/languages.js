let languageButtons = document.querySelectorAll(".language");
let guessInput = document.querySelector(".styled-input");

languageButtons.forEach(btn => {
    btn.addEventListener("click", (event) => {
        event.preventDefault();
        let selected = document.querySelector(".language#selected");
        selected.id = ""
        btn.id = "selected"
        guessInput.focus();
        correctName = getCorrectName();
    })
})

function getCorrectName(){
    let selectedLanguage = document.querySelector(".language#selected");
    let name;

    for (const entry of currentPokemonSpecies.names) {
      if (entry.language.name == selectedLanguage.getAttribute('value')) {
          name = entry.name;
          break;
      }
  }

  name = name.replace(/[\u2642\u2640]/g, '');

  return name.toLowerCase();
}
