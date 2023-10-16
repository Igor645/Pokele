let intervalId;

function alternateImages(container) {
  let currentAlternateSrcs = container.alternateImages || new Set();
  let currentIndex = 1;
  console.log(currentAlternateSrcs)

  if (currentAlternateSrcs.size < 1) {
    return;
  }

  function updateImage() {
    if (document.body.contains(container)) {
      const srcArray = Array.from(currentAlternateSrcs);
      currentIndex = (currentIndex + 1) % srcArray.length;
      console.log(srcArray)
      console.log(currentIndex)
      container.src = srcArray[currentIndex];
    }
  }

  setInterval(updateImage, 2000);
}


function alternateImagesGuessAll() {
  function updateImage(pk) {
    let dataAlternation = pk.dataset.alternation;
    if (dataAlternation === undefined) {
      dataAlternation = '0';
      pk.dataset.alternation = '0';
    }

    const srcArray = Array.from(pk.alternateImages);
    const newAlternationValue = (parseInt(dataAlternation) + 1) % srcArray.length;

    pk.dataset.alternation = newAlternationValue.toString();
    if(pk.classList.contains("guessed")){
      pk.src = srcArray[newAlternationValue];
    }
  }
  const allPokemonVisible = document.querySelectorAll(".pixelSprite");

  
  intervalId = setInterval(() => {
    allPokemonVisible.forEach(updateImage);
  }, 4500);
}

function stopAlternatingImages() {
  const allPokemonVisible = document.querySelectorAll(".pixelSprite");

  allPokemonVisible.forEach(pk => {
    if(pk.classList.contains("guessed")){
      pk.src = pk.alternateImages[0];
    }
  });

  clearInterval(intervalId);
}
