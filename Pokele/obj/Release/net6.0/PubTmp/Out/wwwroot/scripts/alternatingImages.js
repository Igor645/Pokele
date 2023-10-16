
function alternateImages(element) {
  console.log(element.src);
  let currentAlternateSrcs = element.getAttribute("data-alternate-images") ? element.getAttribute("data-alternate-images").split(",") : [];
  let currentIndex = 1;
  if (currentAlternateSrcs.length > 1) {
    return;
  }

  function updateImage() {
    if(document.body.contains(element)){
      currentAlternateSrcs = element.getAttribute("data-alternate-images") ? element.getAttribute("data-alternate-images").split(",") : [];
      console.log(currentAlternateSrcs)
      element.src = currentAlternateSrcs[currentIndex - 1];
      

      currentIndex++;
      if(currentIndex > currentAlternateSrcs.length)
      {
        currentIndex = 1;
      }
      console.log(currentIndex)
    }
  }

  setInterval(updateImage, 2000);
}
