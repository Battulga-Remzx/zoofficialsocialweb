// Өөрийн MP3 файлын нэрийг энд тавина
const audio = new Audio("./music.mp3");
audio.loop = true;
audio.volume = 0.5;
audio.autoplay = true;

const enterOverlay = document.getElementById("enterOverlay");
const playBtn = document.getElementById("playBtn");
const playIcon = document.getElementById("playIcon");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const muteBtn = document.getElementById("muteBtn");
const muteIcon = document.getElementById("muteIcon");
const volumeSlider = document.getElementById("volumeSlider");
const progressFill = document.getElementById("progressFill");
const progressBar = document.getElementById("progressBar");
const currentTimeEl = document.getElementById("currentTime");
const durationTimeEl = document.getElementById("durationTime");

let isPlaying = false;
let isMuted = false;

function formatTime(sec) {
  if (isNaN(sec)) return "0:00";
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s < 10 ? "0" : ""}${s}`;
}

function updatePlayIcon() {
  playIcon.className = isPlaying ? "fa-solid fa-pause" : "fa-solid fa-play";
}

function updateVolumeIcon() {
  if (audio.muted || audio.volume === 0) {
    muteIcon.className = "fa-solid fa-volume-xmark";
  } else if (audio.volume < 0.5) {
    muteIcon.className = "fa-solid fa-volume-low";
  } else {
    muteIcon.className = "fa-solid fa-volume-high";
  }
}

function startAudio() {
  audio.play().then(() => {
    isPlaying = true;
    updatePlayIcon();
    enterOverlay.classList.add("hidden");
  }).catch(() => {
    // Хөтөч автоматаар тоглуулахыг хориглосон үед overlay дээр дарахад эхэлнэ
  });
}

// Хуудас ачаалагдах үед шууд тоглуулахыг оролдоно
window.addEventListener("DOMContentLoaded", () => {
  startAudio();
});

// "click to enter..." дэлгэц дээр дарахад бүрхүүл алга болж дуу шууд эхэлнэ
enterOverlay.addEventListener("click", () => {
  enterOverlay.classList.add("hidden");
  audio.play().then(() => {
    isPlaying = true;
    updatePlayIcon();
  }).catch(() => {});
});

audio.addEventListener("loadedmetadata", () => {
  durationTimeEl.textContent = formatTime(audio.duration);
});

audio.addEventListener("timeupdate", () => {
  currentTimeEl.textContent = formatTime(audio.currentTime);
  const pct = audio.duration ? (audio.currentTime / audio.duration) * 100 : 0;
  progressFill.style.width = `${pct}%`;
});

playBtn.addEventListener("click", () => {
  if (audio.paused) {
    audio.play().then(() => {
      isPlaying = true;
      updatePlayIcon();
    }).catch(() => {});
  } else {
    audio.pause();
    isPlaying = false;
    updatePlayIcon();
  }
});

prevBtn.addEventListener("click", () => {
  if (!audio.duration) return;
  audio.currentTime = Math.max(0, audio.currentTime - 10);
});

nextBtn.addEventListener("click", () => {
  if (!audio.duration) return;
  audio.currentTime = Math.min(audio.duration, audio.currentTime + 10);
});

muteBtn.addEventListener("click", () => {
  isMuted = !isMuted;
  audio.muted = isMuted;
  if (isMuted) {
    volumeSlider.value = 0;
  } else {
    if (audio.volume === 0) audio.volume = 0.5;
    volumeSlider.value = audio.volume;
    if (audio.paused) {
      audio.play().then(() => {
        isPlaying = true;
        updatePlayIcon();
      }).catch(() => {});
    }
  }
  updateVolumeIcon();
});

volumeSlider.addEventListener("input", (e) => {
  const val = parseFloat(e.target.value);
  audio.volume = val;
  audio.muted = val === 0;
  isMuted = audio.muted;
  if (!isMuted && audio.paused) {
    audio.play().then(() => {
      isPlaying = true;
      updatePlayIcon();
    }).catch(() => {});
  }
  updateVolumeIcon();
});

progressBar.addEventListener("click", (e) => {
  if (!audio.duration) return;
  const rect = progressBar.getBoundingClientRect();
  const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
  audio.currentTime = ratio * audio.duration;
});

updatePlayIcon();
updateVolumeIcon();