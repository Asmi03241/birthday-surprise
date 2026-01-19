const app = document.getElementById("app");

/* =======================
   SOUNDS (BUTTON ONLY)
======================= */
const popSound = new Audio("assets/sound/pop.mp3");
const previewMusic = new Audio("assets/sound/romantic-preview.mp3");
const letterMusic = new Audio("assets/sound/letter-music.mp3");

function playPop() {
  popSound.currentTime = 0;
  popSound.play();
}

/* =======================
   MUSIC HELPERS
======================= */
function fadeInMusic(audio, target = 0.6) {
  audio.volume = 0;
  audio.play();
  let v = 0;
  const fade = setInterval(() => {
    v += 0.04;
    audio.volume = Math.min(target, v);
    if (v >= target) clearInterval(fade);
  }, 100);
}

function fadeOutMusic(audio) {
  const fade = setInterval(() => {
    if (audio.volume > 0.05) {
      audio.volume -= 0.05;
    } else {
      audio.pause();
      audio.currentTime = 0;
      clearInterval(fade);
    }
  }, 100);
}

/* =======================
   CONFETTI
======================= */
const canvas = document.getElementById("confetti");
const ctx = canvas.getContext("2d");
let confettiInterval;

function startConfetti() {
  canvas.width = innerWidth;
  canvas.height = innerHeight;
  confettiInterval = setInterval(() => {
    ctx.fillStyle = `hsl(${Math.random()*360},100%,70%)`;
    ctx.beginPath();
    ctx.arc(Math.random()*canvas.width, Math.random()*canvas.height, 4, 0, Math.PI*2);
    ctx.fill();
  }, 40);
}

function stopConfetti() {
  clearInterval(confettiInterval);
  ctx.clearRect(0,0,canvas.width,canvas.height);
}

/* =======================
   START
======================= */
showChoice();

/* =======================
   SCREEN 1 – CHOICE
======================= */
function showChoice() {
  stopConfetti();
  app.innerHTML = `
    <div class="screen">
      <h1 class="reveal">Hey you! 🐱💭</h1>
      <img src="assets/cats/cat-screen1-confused.jpeg" width="220" class="cat-pop">
      <p class="reveal">Do you know what today is?</p>
      <button onclick="playPop(); showYes()">YES 😍</button>
      <button onclick="playPop(); showNo()">NO 😐</button>
    </div>
  `;
}

/* =======================
   NO PAGE
======================= */
function showNo() {
  app.innerHTML = `
    <div class="screen">
      <h1 class="reveal">HOW DARE YOU 😤</h1>
      <img src="assets/cats/cat-screen1-angry.jpeg" width="220" class="cat-pop">
      <p class="reveal">Think again 😒</p>
      <button onclick="playPop(); showChoice()">OK OK 😭</button>
    </div>
  `;
}

function showYes() {
  showBirthday();
}

/* =======================
   BIRTHDAY PAGE
======================= */
function showBirthday() {
  playPop();
  startConfetti();

  app.innerHTML = `
    <div class="screen">
      <h2 class="reveal">Of course you know… 😌💖</h2>
      <h1 class="reveal">
        IT’S YOUR BIRTHDAYYYY<br>YAYYYYY 🎉✨
      </h1>
      <h1 class="big-birthday reveal">
        HAPPIESTTT BIRTHDAYYY<br>BABYYYY 💕
      </h1>
      <img src="assets/cats/cat-birthday-reveal.jpeg" width="260" class="cat-pop">
      <p class="reveal">Ready for a surprise? 👀💌</p>
      <button onclick="playPop(); showGoodBoy()">YESSS 💖</button>
      <button onclick="playPop(); showSurpriseNoV2()">NO 😼</button>
    </div>
  `;
}

/* =======================
   SURPRISE NO
======================= */
function showSurpriseNoV2() {
  stopConfetti();
  playPop();

  app.innerHTML = `
    <div class="screen">
      <h1 class="reveal" style="font-size:44px;color:#ff4d6d;">
        HOW DARE YOU!? 😾
      </h1>
      <img src="assets/cats/cat-screen2-no-v2.jpeg" width="260" class="cat-pop">
      <button onclick="playPop(); showBirthday()">GO BACK!! 😭</button>
    </div>
  `;
}

/* =======================
   GOOD BOY
======================= */
function showGoodBoy() {
  stopConfetti();
  playPop();
  app.innerHTML = `
    <div class="screen">
      <h1 class="reveal" style="font-size:48px;color:#ff5c8a;">
        GOOD BOYYYY 😼💖
      </h1>
      <img src="assets/cats/cat-good-boy.jpeg" width="280" class="cat-pop">
      <p class="reveal">You chose the right answer 😏✨</p>
      <button onclick="playPop(); showPreviewVideo()">Click here 👀💞</button>
    </div>
  `;
}

/* =======================
   PREVIEW VIDEO (WITH MUSIC)
======================= */
function showPreviewVideo() {
  fadeInMusic(previewMusic, 0.6);

  app.innerHTML = `
    <div class="screen preview-screen">

      <!-- TOP NOTE -->
      <div id="waitNote" class="preview-note-top">
        wait till the song ends 👀💖
      </div>

      <!-- VIDEO -->
      <video 
        id="previewVideo"
        src="assets/videos/preview-video.mp4"
        autoplay
        playsinline
        controls
      ></video>

      <!-- FINAL LYRIC BELOW VIDEO -->
      <div id="finalLyric" class="final-lyric-below">
        But I think they call this love
      </div>

    </div>
  `;

  const video = document.getElementById("previewVideo");
  const lyric = document.getElementById("finalLyric");
  const screen = document.querySelector(".preview-screen");

  /* ======================
     VIDEO ↔ AUDIO SYNC
  ====================== */
  video.addEventListener("play", () => {
    if (previewMusic.paused) previewMusic.play();
  });

  video.addEventListener("pause", () => {
    if (!previewMusic.paused) previewMusic.pause();
  });

  video.addEventListener("seeking", () => {
    previewMusic.currentTime = video.currentTime;
  });

  video.addEventListener("seeked", () => {
    previewMusic.currentTime = video.currentTime;
  });

  /* ======================
     LYRIC VISIBILITY (SEEK SAFE)
  ====================== */
  video.addEventListener("timeupdate", () => {
  if (video.currentTime >= 23) {
    lyric.style.opacity = "1";
  } else {
    lyric.style.opacity = "0";
  }
});

  /* ======================
     SMOOTH FADE AT END (NO CUT)
  ====================== */
  video.addEventListener("ended", () => {
    // fade visuals immediately
    screen.classList.add("preview-fade-out");

    // fade music together
    fadeOutMusic(previewMusic);

    // go to envelope after fade
    setTimeout(() => {
      showCanvaEnvelope();
    }, 1600); // must match CSS animation
  });
}

/* =======================
   ENVELOPE
======================= */
function showCanvaEnvelope() {
  app.innerHTML = `
    <div class="screen">
      <img src="assets/photos/envelope-canva.jpeg"
           class="canva-img"
           id="envelopeImg">
      <button onclick="openEnvelope()">OPEN 💖</button>
    </div>
  `;
}

function openEnvelope() {
  playPop();
  const env = document.getElementById("envelopeImg");
  env.offsetHeight;
  env.classList.add("opening");
  setTimeout(showLetter, 850);
}

/* =======================
   LETTER (TEXT UNCHANGED)
======================= */
function showLetter() {
  fadeInMusic(letterMusic, 0.4);

  app.innerHTML = `
    <div class="letter-container">
      <div class="letter">

        <h2>My dearest love,</h2>

        <!-- PARAGRAPH 1 -->
        <p class="letter-line">
Happiest birthday to the most important person I have! 🎉  
You truly mean the world to me 💕  

Being with you is the best feeling I’ve ever experienced.  
I’m so grateful to have you, myyyy babyyyy,  
myyy sweet cupcake, merii pyarri sii jaaannnnn,  
myyy handsome husband 💖  

Mera pyarraa bachha… you are my family 🏡  
You are my safe place, my happiness, my comfort, my everything.  

Every moment with you feels magical.  
Your smile lights up my world,  
your presence makes everything better ✨
the time i get to spend with you is the most precious one!the one where i laugh the most,
the one where world feels calm and life seems to be easy!
All the memories we share and going to share in the future are always going to be the bestt!
all the kisses, hugss and everything is just soooo beautifull
I can't wait to marry youuuu!hehee 🤭
yeyyeeeyeyeeeyeyyeeeeeee!!!!💗
        </p>

        <!-- PARAGRAPH 2 -->
        <p class="letter-line">
Today, all I wish for is your happiness, success, and good health.  
May everything you dream about come true,  
and may you achieve the best in everything you do —  
because you truly are the bestestttt!! 🥹✨  

Always keep smiling and loving me (hehee 🤭),  
because you look the prettiest when you smile 😊  

I am so proud of the person you are becoming,  
and so grateful that I get to walk beside you  
through every dream, every laugh, every memory 🥹💗

        </p>

        <!-- PARAGRAPH 3 -->
        <p class="letter-line">
No matter where life takes us,  
just know that I'll always be there for youu!  

I love you a lotttttttttt 💗  
more than words could ever define!  

<strong>Happiest 18th, my man! 🎂🎉</strong><br>
You deserve all the love in the world 💖
        </p>

        <span class="sign">
          Yours forever,<br>I love you endlessly 💞
        </span>

        <p class="last-line">
          Forever yours, in every universe 🌙✨
        </p>

        <button onclick="playPop(); endLetter()">End 💌</button>

      </div>
    </div>
  `;

  const paras = document.querySelectorAll(".letter-line");
  paras.forEach((p, i) => {
    p.style.animationDelay = `${i * 1.2}s`;
  });
}

  const lines = document.querySelectorAll(".letter-line");
  lines.forEach((line, i) => {
    line.style.animationDelay = `${i * 0.6}s`;
  });

function endLetter() {
  fadeOutMusic(letterMusic);
  showWaitScreen();
}

/* =======================
   WAIT SCREEN
======================= */
function showWaitScreen() {
  app.innerHTML = `
    <div class="screen">

      <h2 class="reveal">Wait… this isn’t the end 🥺💞</h2>

      <!-- CUTE CAT -->
      <img 
        src="assets/cats/cat-wait-cute.jpeg"
        width="240"
        class="cat-pop"
        alt="cute waiting cat"
      >

      <p class="reveal">
        There’s something more I want you to see…
      </p>

      <button onclick="playPop(); showFinalVideo()">
        See more 💖
      </button>

    </div>
  `;
}

/* =======================
   FINAL VIDEO
======================= */
function showFinalVideo() {
  app.innerHTML = `
    <div class="screen final-video-screen">

      <video 
        id="finalVideo"
        src="assets/videos/message-video.mp4"
        autoplay
        playsinline
        controls
      ></video>

    </div>
  `;

  const video = document.getElementById("finalVideo");
  const screen = document.querySelector(".final-video-screen");

  // When video ENDS naturally
  video.addEventListener("ended", () => {
    // Fade out the whole screen
    screen.classList.add("final-video-fade-out");

    // After fade animation, show end screen
    setTimeout(() => {
      showEndScreen();
    }, 1600); // match CSS animation duration
  });
}
function showEndScreen() {
  app.innerHTML = `
    <div class="screen">

      <div class="end-wrapper">

        <!-- FINAL CUTE CAT -->
        <img 
          src="assets/cats/cat-end-cute.jpeg"
          width="260"
          class="cat-pop end-cat"
          alt="cute ending cat"
        >

        <!-- FINAL CARD -->
        <div class="end-card">
          <p>This one was for you 💞</p>
          <span>— made with all my love</span>
        </div>

      </div>

    </div>
  `;
}

