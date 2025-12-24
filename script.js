let songs = [];

/* --- 2. Element Selectors --- */

let currentSong = 0;
const audio = new Audio();

const playBtn = document.getElementById("play");
const playIcon = playBtn.querySelector("i");
const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next");
const seek = document.getElementById("seek");
const volume = document.getElementById("volume");

const title = document.getElementById("title");
const artist = document.getElementById("artist");
const albumArt = document.getElementById("album-art");
const currentTimeDisplay = document.getElementById("current-time");
const durationDisplay = document.getElementById("duration");

const libraryDiv = document.querySelector(".library");
const searchInput = document.getElementById("search");


async function apicheck() {
  try {
    let res = await fetch("https://free-music-api2.vercel.app/getSongs");
    let Data = await res.json();

    // API data ko player format me convert karna
    songs = Data.map(item => ({
      title: item.songName || "Unknown Title",
      artist: item.singer || "Unknown Artist",
      src: item.url,          // audio file
      img: item.songBanner || ""   // album art
    }));

    // first song load + library render
    currentSong = 0;
    loadSong(currentSong);
    renderLibrary(songs);

  } catch (err) {
    console.error("API Error:", err);
  }
}


/* --- 3. Helper: Update Slider Fill --- */
// Yeh function range input ke background color (fill) ko control karta hai
function updateSliderColor(slider) {
  const min = slider.min || 0;
  const max = slider.max || 100;
  const value = slider.value;
  const percentage = ((value - min) / (max - min)) * 100;
  slider.style.backgroundSize = percentage + "% 100%";
}

/* --- 4. Core Functions --- */

function loadSong(index) {
  const song = songs[index];
  audio.src = song.src;
  title.textContent = song.title;
  artist.textContent = song.artist;
  albumArt.src = song.img ? song.img : "https://picsum.photos/200/200";

  seek.value = 0;
  updateSliderColor(seek); // Reset color on load
}

function playSong() {
  audio.play();
  playIcon.classList.remove("fa-circle-play");
  playIcon.classList.add("fa-circle-pause");
}

function pauseSong() {
  audio.pause();
  playIcon.classList.remove("fa-circle-pause");
  playIcon.classList.add("fa-circle-play");
}

playBtn.addEventListener("click", () => {
  if (audio.paused) {
    playSong();
  } else {
    pauseSong();
  }
});

prevBtn.addEventListener("click", () => {
  currentSong = (currentSong - 1 + songs.length) % songs.length;
  loadSong(currentSong);
  playSong();
});

nextBtn.addEventListener("click", () => {
  currentSong = (currentSong + 1) % songs.length;
  loadSong(currentSong);
  playSong();
});

/* --- 5. Seek & Volume Logic --- */

audio.addEventListener("timeupdate", () => {
  if (audio.duration) {
    const progress = (audio.currentTime / audio.duration) * 100;
    seek.value = progress;
    updateSliderColor(seek); // Update color as song plays
    
    currentTimeDisplay.textContent = formatTime(audio.currentTime);
    durationDisplay.textContent = formatTime(audio.duration);
  }
});

seek.addEventListener("input", () => {
  if (audio.duration) {
    audio.currentTime = (seek.value / 100) * audio.duration;
    updateSliderColor(seek); // Update color while dragging
  }
});

volume.addEventListener("input", () => {
  audio.volume = volume.value;
  updateSliderColor(volume); // Update color for volume bar
});

function formatTime(seconds) {
  const mins = Math.floor(seconds / 60) || 0;
  const secs = Math.floor(seconds % 60) || 0;
  return `${mins}:${secs < 10 ? "0" + secs : secs}`;
}

/* --- 6. Library & Search --- */

function renderLibrary(list) {
  libraryDiv.innerHTML = "";
  libraryDiv.classList.add("library-grid");

  list.forEach((song, index) => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
            <img src="${song.img}" alt="${song.title}" onerror="this.src='https://picsum.photos/200/200'">
            <h3>${song.title}</h3>
            <p>${song.artist}</p>
            <button class="play-btn"><i class="fa-solid fa-play"></i></button>
        `;

    card.addEventListener("click", () => {
      // Find original index in songs array to play correct song after search
      currentSong = songs.findIndex(s => s.src === song.src);
      loadSong(currentSong);
      playSong();
    });

    libraryDiv.appendChild(card);
  });
}

searchInput.addEventListener("input", (e) => {
  const keyword = e.target.value.toLowerCase();
  const filtered = songs.filter(
    (song) =>
      song.title.toLowerCase().includes(keyword) ||
      song.artist.toLowerCase().includes(keyword)
  );
  renderLibrary(filtered);
});

/* --- 7. Initialization --- */
// loadSong(currentSong);
// renderLibrary(songs);
updateSliderColor(volume); // Set initial volume bar color


apicheck();