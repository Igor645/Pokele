const imageUrls = {
    "generation-i-1": './genImages/generation-i-1.jfif',
    "generation-i-2": './genImages/generation-i-2.jfif',
    "generation-i-3": './genImages/generation-i-3.jfif',
    "generation-ii-1": './genImages/generation-ii-1.jfif',
    "generation-ii-2": './genImages/generation-ii-2.jfif',
    "generation-ii-3": './genImages/generation-ii-3.jfif',
    "generation-iii-1": './genImages/generation-iii-1.jfif',
    "generation-iii-2": './genImages/generation-iii-2.jfif',
    "generation-iii-3": './genImages/generation-iii-3.jfif',
    "generation-iv-1": './genImages/generation-iv-1.jpg',
    "generation-iv-2": './genImages/generation-iv-2.jpg',
    "generation-iv-3": './genImages/generation-iv-3.png',
    "generation-v-1": './genImages/generation-v-1.jfif',
    "generation-v-2": './genImages/generation-v-2.jfif',
    "generation-v-3": './genImages/generation-v-3.jfif',
    "generation-v-4": './genImages/generation-v-4.jfif',
    "generation-vi-1": './genImages/generation-vi-1.jfif',
    "generation-vi-2": './genImages/generation-vi-2.jfif',
    "generation-vii-1": './genImages/generation-vii-1.jfif',
    "generation-vii-2": './genImages/generation-vii-2.jfif',
    "generation-vii-3": './genImages/generation-vii-3.jfif',
    "generation-vii-4": './genImages/generation-vii-4.jfif',
    "generation-viii-1": './genImages/generation-viii-1.jfif',
    "generation-viii-2": './genImages/generation-viii-2.jfif',
    "generation-ix-1": './genImages/generation-ix-1.jfif',
    "generation-ix-2": './genImages/generation-ix-2.jfif',
};

function getGenImages(genName) {
    const matchingKeys = Object.keys(imageUrls).filter(key =>
        key.includes(genName.toLowerCase())
    );
    
    if (matchingKeys.length > 0) {
        return matchingKeys.map(key => imageUrls[key]);
    } else {
        return null;
    }
}

function revealGens() {
    let genName = currentPokemonSpecies.generation.name.toLowerCase();
    let genUrls = getGenImages(genName + "-")
    
    const questionmark = genContainer.querySelector('.questionmark');
    questionmark.remove();

    if (genUrls) {
        genUrls.forEach(url => {
            gens.innerHTML += ` <img class="gen" src="${url}">`
        });
    } else {
        console.log('Image URLs not found for the specified generation.');
    }
}
