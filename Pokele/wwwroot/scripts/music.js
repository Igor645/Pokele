const music = document.getElementById('music');
const soundButton = document.querySelector('.soundButton');
const audioSelect = document.getElementById('audioSelect');
let isMuted = true;

function updateSoundIcon() {
    soundButton.src = isMuted ? 'images/sound-min.svg' : 'images/sound-max.svg';
}

soundButton.addEventListener('click', function() {
    if (isMuted) {
        isMuted = false;
        music.muted = false;
        music.volume = 0.1;    
        music.play();    
    } else {
        isMuted = true;
        music.muted = true;
        music.volume = 0;
    }
    updateSoundIcon();
    //sessionStorage.setItem('isMuted', JSON.stringify(isMuted));
});

function updateAudioSource() {
    const audioDir = 'audio/music/';
    const selectedAudio = audioSelect.value;
    const audioPath = audioDir + selectedAudio;

    const selectedOption = audioSelect.options[audioSelect.selectedIndex];
    const volume = parseFloat(selectedOption.getAttribute('data-volume'));

    music.src = audioPath;
    music.volume = isMuted ? 0 : volume;
    music.play();
}

audioSelect.addEventListener('change', updateAudioSource);

function randomizeAudio() {
    const audioSelect = document.getElementById('audioSelect');
    const audioFiles = Array.from(audioSelect.options).map(option => option.value);

    const randomIndex = Math.floor(Math.random() * audioFiles.length);
    const randomAudio = audioFiles[randomIndex];
    const audioPath = 'audio/music/' + randomAudio;

    audioSelect.selectedIndex = randomIndex;
    const selectedOption = audioSelect.options[randomIndex];
    const volume = parseFloat(selectedOption.getAttribute('data-volume'));

    music.src = audioPath;
    /*music.volume = isMuted ? 0 : volume;
    music.muted = isMuted;
    music.play();*/
}

randomizeAudio();
updateSoundIcon();
