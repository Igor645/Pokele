let alreadyAlternatingContainers = new Set();

async function getGif(id, container, isAltImage) {
  try {
    container.src = "";
    if (container.classList.contains("evoStage") && container.classList.contains("placeholder")) {
      container.classList.remove("placeholder");
      container.classList.remove("marked");
    }

    const [showdownResponse, pngResponse] = await Promise.all([
      fetch(`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/${id}.gif`),
      fetch(`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`)
    ]);

    const response = showdownResponse.ok ? showdownResponse : pngResponse;

    if (response.ok) {
      const gifUrl = URL.createObjectURL(await response.blob());
      if (isAltImage) {
        handleAltImages(container, gifUrl);
      } else {
        container.src = gifUrl;
      }
    } else {
      console.error("Error fetching Pokémon GIF:", response.statusText);
    }
  } catch (error) {
    console.error("Error fetching random Pokémon species:", error);
  }
}


function handleAltImages(container, gifUrl) {
  if (!container.classList.contains("alternate-image")) {
    container.classList.add("alternate-image");

    container.alternateImages = [];
  }

  container.alternateImages.push(gifUrl);

  if (!alreadyAlternatingContainers.has(container)) {
    alternateImages(container);
    alreadyAlternatingContainers.add(container);
  }
}

async function revealSilhouette()
{
  var idsArray
  await getGif(randomSpeciesNumber, sprite, false);
  dimBrightness(sprite);
  changeSpriteSize();
  let evoStageDivs = document.querySelectorAll(".evoStage");
  evoStageDivs.forEach(stage => { 
    if (stage.id.includes(",")) {   
      idsArray = stage.id.split(",");
    }

    if(Array.isArray(idsArray)){
      let i = 0;
      idsArray.forEach(id => {
        if(i == 0){
          getGif(id, stage, false)
          stage.setAttribute("data-alternate-images", "");
          getGif(id, stage, true)
        }
        else{
          getGif(id, stage, true)
        }
        i++;
      })
    }
    else{
      getGif(stage.id, stage,false);
    }
    adjustShadow();
    dimBrightness(stage);
  });
}

function adjustShadow(){
  let shadow = document.querySelector(".pokemonShadow");
  let image =  document.querySelector(".pokemon");
  image.addEventListener("load", (event) => {
    shadow.style.width = document.querySelector(".pokemon").clientWidth + 125 + "px";
  })
}

function dimBrightness(image){
  image.style.filter = "brightness(0%)"
}