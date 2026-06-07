// =========================================
// 4. BAGIAN LOGIKA & ATURAN GAME (script.js)
// =========================================
// Catatan: Berisi sistem sound synthesizer (Web Audio), pemunculan kucing acak,
// sistem waktu mundur, serta manajemen status (Berhenti/Jeda/Main Kembali).


// --- 4a. Definisi Aset Desain Kucing (Vektor SVG Resolusi Tinggi) ---

// Kucing Biasa (Membawa topi merah miring dan bunga tulip)
const NORMAL_CAT_SVG = `
<svg viewBox="0 0 100 100" class="w-full h-full">
    <rect x="5" y="5" width="90" height="90" rx="30" fill="#a2dcd7" />

    <!-- Telinga -->
    <path d="M 25 35 L 10 15 L 35 25 Z" fill="#ebdfd5" stroke="#333" stroke-width="1.5" stroke-linejoin="round" />
    <path d="M 22 32 L 13 18 L 29 25 Z" fill="#fca5a5" />
    <path d="M 75 35 L 90 15 L 65 25 Z" fill="#ebdfd5" stroke="#333" stroke-width="1.5" stroke-linejoin="round" />
    <path d="M 78 32 L 87 18 L 71 25 Z" fill="#fca5a5" />

    <!-- Kepala -->
    <ellipse cx="50" cy="50" rx="35" ry="28" fill="#fcf8f2" stroke="#333" stroke-width="1.5" />

    <!-- Garis Pipi Kucing -->
    <path d="M 18 45 C 22 45 22 47 18 49" stroke="#333" stroke-width="1.5" stroke-linecap="round" fill="none" />
    <path d="M 18 51 C 22 51 22 53 18 55" stroke="#333" stroke-width="1.5" stroke-linecap="round" fill="none" />
    <path d="M 82 45 C 78 45 78 47 82 49" stroke="#333" stroke-width="1.5" stroke-linecap="round" fill="none" />
    <path d="M 82 51 C 78 51 78 53 82 55" stroke="#333" stroke-width="1.5" stroke-linecap="round" fill="none" />

    <!-- Mata Kucing Lucu -->
    <ellipse cx="36" cy="46" rx="4.5" ry="6" fill="#1e293b" />
    <circle cx="34" cy="44" r="1.5" fill="#ffffff" />
    <circle cx="38" cy="48" r="0.8" fill="#ffffff" />
    <ellipse cx="64" cy="46" rx="4.5" ry="6" fill="#1e293b" />
    <circle cx="62" cy="44" r="1.5" fill="#ffffff" />
    <circle cx="66" cy="48" r="0.8" fill="#ffffff" />

    <!-- Hidung & Mulut -->
    <polygon points="50,51 47,54 53,54" fill="#fca5a5" stroke="#333" stroke-width="0.5" />
    <path d="M 46 56 C 48 58 50 58 50 56 C 50 58 52 58 54 56" stroke="#333" stroke-width="1.5" stroke-linecap="round" fill="none" />

    <!-- Kumis -->
    <line x1="25" y1="53" x2="10" y2="52" stroke="#333" stroke-width="1" />
    <line x1="25" y1="57" x2="8" y2="59" stroke="#333" stroke-width="1" />
    <line x1="75" y1="53" x2="90" y2="52" stroke="#333" stroke-width="1" />
    <line x1="75" y1="57" x2="92" y2="59" stroke="#333" stroke-width="1" />

    <!-- Topi Bisbol Merah Miring -->
    <path d="M 28 32 Q 50 18 70 28 Q 72 38 48 40 Q 24 38 28 32 Z" fill="#ef4444" stroke="#333" stroke-width="1.5" />
    <path d="M 38 34 Q 56 32 74 41" stroke="#ef4444" stroke-width="4.5" stroke-linecap="round" fill="none" />
    <circle cx="49" cy="22" r="3" fill="#ffffff" stroke="#333" stroke-width="1" />

    <!-- Buket Bunga Tulip Mini -->
    <g transform="translate(62, 58)">
        <path d="M 5 15 L 8 2" stroke="#22c55e" stroke-width="1.5" />
        <path d="M 12 15 L 12 0" stroke="#22c55e" stroke-width="1.5" />
        <path d="M 19 15 L 16 3" stroke="#22c55e" stroke-width="1.5" />
        <path d="M 4 2 Q 8 -4 10 2 Z" fill="#ec4899" />
        <path d="M 6 2 Q 8 -1 10 2 Z" fill="#f472b6" />
        <path d="M 9 0 Q 12 -6 15 0 Z" fill="#ef4444" />
        <path d="M 11 0 Q 12 -3 15 0 Z" fill="#f87171" />
        <path d="M 14 3 Q 17 -3 19 3 Z" fill="#eab308" />
        <rect x="7" y="11" width="10" height="3" rx="1" fill="#ec4899" />
    </g>
</svg>
`;

// Kucing Bonus (Memakai kacamata hitam keren & Mahkota Emas)
const BONUS_CAT_SVG = `
<svg viewBox="0 0 100 100" class="w-full h-full">
    <rect x="5" y="5" width="90" height="90" rx="30" fill="#fef08a" />
    <path d="M 25 35 L 10 15 L 35 25 Z" fill="#e2e8f0" stroke="#333" stroke-width="1.5" stroke-linejoin="round" />
    <path d="M 22 32 L 13 18 L 29 25 Z" fill="#f87171" />
    <path d="M 75 35 L 90 15 L 65 25 Z" fill="#e2e8f0" stroke="#333" stroke-width="1.5" stroke-linejoin="round" />
    <path d="M 78 32 L 87 18 L 71 25 Z" fill="#f87171" />

    <ellipse cx="50" cy="50" rx="35" ry="28" fill="#ffffff" stroke="#333" stroke-width="1.5" />

    <!-- Kacamata Hitam Kece -->
    <path d="M 22 43 Q 35 48 48 43 L 48 45 Q 35 52 22 45 Z" fill="#1e293b" />
    <path d="M 52 43 Q 65 48 78 43 L 78 45 Q 65 52 52 45 Z" fill="#1e293b" />
    <line x1="45" y1="44" x2="55" y2="44" stroke="#1e293b" stroke-width="3" />

    <polygon points="50,51 47,54 53,54" fill="#f87171" />
    <path d="M 46 56 C 48 58 50 58 50 56 C 50 58 52 58 54 56" stroke="#333" stroke-width="1.5" stroke-linecap="round" fill="none" />

    <!-- Mahkota Emas Cerah -->
    <path d="M 35 25 L 40 10 L 50 18 L 60 10 L 65 25 Z" fill="#fbbf24" stroke="#333" stroke-width="1.5" stroke-linejoin="round" />
    <circle cx="40" cy="9" r="2.5" fill="#ef4444" />
    <circle cx="50" cy="17" r="2" fill="#3b82f6" />
    <circle cx="60" cy="9" r="2.5" fill="#ef4444" />
</svg>
`;

// Kucing Pusing (Ketika berhasil diklik / dipukul)
const DIZZY_CAT_SVG = `
<svg viewBox="0 0 100 100" class="w-full h-full dizzy-animation">
    <rect x="5" y="5" width="90" height="90" rx="30" fill="#fca5a5" />
    <path d="M 25 35 L 12 20 L 35 28 Z" fill="#ebdfd5" stroke="#333" stroke-width="1.5" stroke-linejoin="round" />
    <path d="M 75 35 L 88 20 L 65 28 Z" fill="#ebdfd5" stroke="#333" stroke-width="1.5" stroke-linejoin="round" />

    <ellipse cx="50" cy="50" rx="35" ry="28" fill="#fcf8f2" stroke="#333" stroke-width="1.5" />

    <!-- Mata Spiral Pusing -->
    <path d="M 30 46 A 5 5 0 1 0 40 46 A 4 4 0 1 0 32 46 A 3 3 0 1 0 38 46" fill="none" stroke="#333" stroke-width="2" />
    <path d="M 60 46 A 5 5 0 1 0 70 46 A 4 4 0 1 0 62 46 A 3 3 0 1 0 68 46" fill="none" stroke="#333" stroke-width="2" />

    <path d="M 45 60 Q 50 52 55 60" stroke="#333" stroke-width="2" stroke-linecap="round" fill="none" />

    <!-- Plester Luka Medis di Dahi -->
    <rect x="40" y="24" width="20" height="8" rx="2" fill="#fed7aa" stroke="#333" stroke-width="1" transform="rotate(-15, 50, 28)" />
    <line x1="48" y1="25" x2="48" y2="31" stroke="#333" stroke-width="1" />
    <line x1="52" y1="25" x2="52" y2="31" stroke="#333" stroke-width="1" />
</svg>
`;


// --- 4b. Web Audio API (Sintesis Efek Suara secara Real-time) ---
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
let soundEnabled = true;

function playSynthSound(type) {
    if (!soundEnabled) return;
    try {
        if (audioCtx.state === 'suspended') audioCtx.resume();

        const osc  = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);

        if (type === 'hit') {
            // Suara tepukan ceria bernada tinggi
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(150, audioCtx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(800, audioCtx.currentTime + 0.15);
            gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.15);
            osc.start(); osc.stop(audioCtx.currentTime + 0.16);

        } else if (type === 'hit_bonus') {
            // Suara berdenting ganda yang manis (+2 Poin)
            osc.type = 'sine';
            osc.frequency.setValueAtTime(600, audioCtx.currentTime);
            osc.frequency.setValueAtTime(1200, audioCtx.currentTime + 0.08);
            gain.gain.setValueAtTime(0.25, audioCtx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);
            osc.start(); osc.stop(audioCtx.currentTime + 0.31);

        } else if (type === 'miss') {
            // Suara meluncur kebawah jika meleset
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(180, audioCtx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(70, audioCtx.currentTime + 0.25);
            gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.25);
            osc.start(); osc.stop(audioCtx.currentTime + 0.26);

        } else if (type === 'level_up') {
            // Fanfare kemenangan singkat saat naik level
            const now = audioCtx.currentTime;
            osc.type = 'sine';
            osc.frequency.setValueAtTime(440, now);
            osc.frequency.setValueAtTime(554, now + 0.1);
            osc.frequency.setValueAtTime(659, now + 0.2);
            osc.frequency.setValueAtTime(880, now + 0.3);
            gain.gain.setValueAtTime(0.2, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.5);
            osc.start(); osc.stop(now + 0.51);

        } else if (type === 'gameover') {
            // Suara dramatis ketika waktu habis
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(300, audioCtx.currentTime);
            osc.frequency.linearRampToValueAtTime(100, audioCtx.currentTime + 0.6);
            gain.gain.setValueAtTime(0.25, audioCtx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.6);
            osc.start(); osc.stop(audioCtx.currentTime + 0.61);

        } else if (type === 'tick') {
            // Detak waktu krusial 5 detik terakhir
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(1000, audioCtx.currentTime);
            gain.gain.setValueAtTime(0.05, audioCtx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.05);
            osc.start(); osc.stop(audioCtx.currentTime + 0.06);
        }
    } catch (e) {
        console.warn("Audio error:", e);
    }
}


// --- 4c. Variabel Global Penampung State Game ---
let score           = 0;
let timeLeft        = 30;
let highscore       = parseInt(localStorage.getItem('pukul_cat_record')) || 0;
let currentLevel    = 1;
let initialDifficulty = 'easy';
let gameStatus      = 'idle'; // idle | playing | paused | gameover
let activeCats      = {};     // { index: { type, timeoutId, hit } }
let timerInterval   = null;
let spawnTimeoutId  = null;

// Referensi elemen DOM UI
const scoreVal    = document.getElementById('score-val');
const timeVal     = document.getElementById('time-val');
const levelVal    = document.getElementById('level-val');
const recordVal   = document.getElementById('record-val');
const btnPrimary  = document.getElementById('btn-primary');
const primaryIcon = document.getElementById('primary-icon');
const primaryText = document.getElementById('primary-text');
const pauseOverlay  = document.getElementById('pause-overlay');
const pauseContent  = document.getElementById('pause-content');
const waktuCard     = document.getElementById('waktu-card');

// Menampilkan record skor tertinggi saat halaman siap dijalankan
document.addEventListener('DOMContentLoaded', () => {
    recordVal.textContent = highscore;
    renderAllHolesWithEmpty();
});

// Menghapus semua isi lubang permainan
function renderAllHolesWithEmpty() {
    for (let i = 0; i < 9; i++) clearHoleDOM(i);
}

// Konfigurasi Kecepatan Berdasarkan Tingkat Kesulitan Awal
const speeds = {
    easy:   { minPop: 900,  maxPop: 1500, duration: 1300 },
    medium: { minPop: 700,  maxPop: 1200, duration: 1000 },
    hard:   { minPop: 500,  maxPop: 900,  duration: 800  }
};

// Mengganti tingkat kesulitan awal saat diklik
function setDifficulty(level) {
    if (gameStatus === 'playing' || gameStatus === 'paused') return;
    initialDifficulty = level;

    ['easy', 'medium', 'hard'].forEach(d => {
        const btn = document.getElementById(`diff-${d}`);
        btn.className = d === level
            ? "py-2 px-1 text-xs font-bold rounded-xl transition-all duration-300 bg-white text-rose-500 shadow-sm"
            : "py-2 px-1 text-xs font-bold rounded-xl transition-all duration-300 text-slate-500 hover:text-slate-700";
    });
}

// Tampilkan / Sembunyikan Modal Petunjuk Cara Bermain
const modalHelp = document.getElementById('modal-help');
const helpBox   = document.getElementById('help-box');
document.getElementById('btn-help').addEventListener('click', () => toggleHelp(true));

function toggleHelp(show) {
    if (show) {
        modalHelp.classList.remove('hidden');
        setTimeout(() => {
            modalHelp.classList.remove('opacity-0');
            helpBox.classList.remove('scale-90');
        }, 50);
    } else {
        modalHelp.classList.add('opacity-0');
        helpBox.classList.add('scale-90');
        setTimeout(() => modalHelp.classList.add('hidden'), 300);
    }
}

// Mengaktifkan / Menonaktifkan Efek Suara
document.getElementById('btn-sound').addEventListener('click', () => {
    soundEnabled = !soundEnabled;
    const soundIcon = document.getElementById('sound-icon');
    soundIcon.className = soundEnabled
        ? "fas fa-volume-up text-slate-600"
        : "fas fa-volume-mute text-rose-400";
});


// --- 4d. Alur Utama Logika Spawn Kucing (Maksimal 2 Kucing) ---
function spawnCats() {
    if (gameStatus !== 'playing') return;

    // Peluang munculnya 2 kucing meningkat seiring level
    const levelFactor = Math.min(0.8, (currentLevel - 1) * 0.15);
    const spawnCount  = (Math.random() < levelFactor + 0.2) ? 2 : 1;

    // Kumpulkan lubang yang kosong
    const emptyHoles = [];
    for (let i = 0; i < 9; i++) {
        if (!activeCats[i]) emptyHoles.push(i);
    }

    if (emptyHoles.length > 0) {
        const selectedHoles = [];
        const limit = Math.min(spawnCount, emptyHoles.length);
        for (let k = 0; k < limit; k++) {
            const randIdx = Math.floor(Math.random() * emptyHoles.length);
            selectedHoles.push(emptyHoles.splice(randIdx, 1)[0]);
        }

        selectedHoles.forEach(holeIndex => {
            const isBonus = Math.random() < 0.15;
            const catType = isBonus ? 'bonus' : 'normal';

            const container = document.getElementById(`cat-${holeIndex}`);
            container.innerHTML = isBonus ? BONUS_CAT_SVG : NORMAL_CAT_SVG;

            // Trigger transisi CSS masuk
            setTimeout(() => container.classList.add('active'), 10);

            // Durasi kucing terlihat (makin cepat seiring level)
            const baseDuration       = speeds[initialDifficulty].duration;
            const calculatedDuration = Math.max(450, baseDuration / (1 + (currentLevel - 1) * 0.15));

            const timeoutId = setTimeout(() => slideDownCat(holeIndex), calculatedDuration);

            activeCats[holeIndex] = { type: catType, timeoutId, hit: false };
        });
    }

    // Jadwalkan spawn berikutnya
    const baseMin       = speeds[initialDifficulty].minPop;
    const baseMax       = speeds[initialDifficulty].maxPop;
    const nextSpawnDelay = Math.max(500, (baseMin + Math.random() * (baseMax - baseMin)) / (1 + (currentLevel - 1) * 0.12));
    spawnTimeoutId = setTimeout(spawnCats, nextSpawnDelay);
}

// Kucing turun bersembunyi kembali ke lubang
function slideDownCat(index) {
    const container = document.getElementById(`cat-${index}`);
    if (container) container.classList.remove('active');

    setTimeout(() => {
        if (activeCats[index] && !activeCats[index].hit) {
            clearHoleDOM(index);
            delete activeCats[index];
        }
    }, 250);
}

// Mengosongkan data HTML di dalam lubang terpilih
function clearHoleDOM(index) {
    const container = document.getElementById(`cat-${index}`);
    if (container) {
        container.innerHTML = '';
        container.className = "cat-character w-full h-full relative";
    }
}


// --- 4e. Logika Pemukulan Kucing (Whack) ---
function whack(index) {
    if (gameStatus !== 'playing') return;

    const catState = activeCats[index];
    if (catState && !catState.hit) {
        catState.hit = true;
        clearTimeout(catState.timeoutId);

        // Tambah skor sesuai jenis kucing
        if (catState.type === 'bonus') {
            score += 2;
            playSynthSound('hit_bonus');
        } else {
            score += 1;
            playSynthSound('hit');
        }
        scoreVal.textContent = score;

        // Ubah tampilan jadi kucing pusing
        const container = document.getElementById(`cat-${index}`);
        container.innerHTML = DIZZY_CAT_SVG;
        container.classList.add('hit');

        createWhackParticles(index);
        checkLevelProgression();

        setTimeout(() => {
            clearHoleDOM(index);
            delete activeCats[index];
        }, 300);

    } else if (!catState) {
        // Meleset di lubang kosong
        playSynthSound('miss');
    }
}

// Sistem naik level: Setiap kelipatan 10 Poin
function checkLevelProgression() {
    const newLevel = Math.floor(score / 10) + 1;
    if (newLevel > currentLevel) {
        currentLevel = newLevel;
        levelVal.textContent = currentLevel;
        playSynthSound('level_up');

        levelVal.classList.add('scale-150', 'text-amber-500');
        setTimeout(() => levelVal.classList.remove('scale-150', 'text-amber-500'), 400);
    }
}

// Membuat letupan partikel bintang
function createWhackParticles(index) {
    const holeElement = document.getElementById(`cat-${index}`).parentElement;
    const rect  = holeElement.getBoundingClientRect();
    const colors = ['#f43f5e', '#3b82f6', '#10b981', '#fbbf24', '#ec4899', '#a855f7'];

    for (let i = 0; i < 8; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';

        const angle    = Math.random() * Math.PI * 2;
        const distance = 40 + Math.random() * 50;
        const dx    = Math.cos(angle) * distance;
        const dy    = Math.sin(angle) * distance;
        const color = colors[Math.floor(Math.random() * colors.length)];

        particle.style.setProperty('--dx',    `${dx}px`);
        particle.style.setProperty('--dy',    `${dy}px`);
        particle.style.setProperty('--angle', `${Math.random() * 360}deg`);
        particle.innerHTML = `
            <svg viewBox="0 0 24 24" width="20" height="20" fill="${color}">
                <path d="M12 .587l3.668 7.431 8.2 1.192-5.934 5.787 1.4 8.168L12 18.896l-7.334 3.857 1.4-8.168L.132 9.21l8.2-1.192z"/>
            </svg>
        `;
        particle.style.left     = `${rect.left + rect.width / 2}px`;
        particle.style.top      = `${rect.top + rect.height / 2}px`;
        particle.style.position = 'fixed';
        particle.style.zIndex   = '100';

        document.body.appendChild(particle);
        setTimeout(() => particle.remove(), 600);
    }
}


// --- 4f. Kontrol Fitur Game (Mulai, Pause, Resume, Restart, Stop) ---

function togglePlayPause() {
    if      (gameStatus === 'idle' || gameStatus === 'gameover') startGame();
    else if (gameStatus === 'playing')  pauseGame();
    else if (gameStatus === 'paused')   resumeGame();
}

function startGame() {
    gameStatus   = 'playing';
    score        = 0;
    timeLeft     = 30;
    currentLevel = 1;

    scoreVal.textContent = score;
    timeVal.textContent  = timeLeft;
    levelVal.textContent = currentLevel;

    waktuCard.classList.remove('bg-rose-100', 'border-rose-300', 'animate-pulse');
    waktuCard.classList.add('bg-cyan-50/80', 'border-cyan-100');

    primaryIcon.className  = "fas fa-pause";
    primaryText.textContent = "Berhenti Dulu (Pause)";
    btnPrimary.className   = "w-full py-4 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 text-white font-extrabold text-lg shadow-lg shadow-amber-200 hover:shadow-xl hover:shadow-amber-300 transition-all duration-300 active:scale-98 flex items-center justify-center gap-2";

    activeCats = {};
    renderAllHolesWithEmpty();

    startTimer();
    spawnCats();
}

function pauseGame() {
    gameStatus = 'paused';

    clearInterval(timerInterval);
    clearTimeout(spawnTimeoutId);
    Object.keys(activeCats).forEach(idx => clearTimeout(activeCats[idx].timeoutId));

    pauseOverlay.classList.remove('opacity-0', 'pointer-events-none');
    pauseContent.classList.remove('scale-95');

    primaryIcon.className   = "fas fa-play";
    primaryText.textContent = "Lanjutkan Bermain";
    btnPrimary.className    = "w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-extrabold text-lg shadow-lg shadow-emerald-200 hover:shadow-xl hover:shadow-emerald-300 transition-all duration-300 active:scale-98 flex items-center justify-center gap-2";
}

function resumeGame() {
    gameStatus = 'playing';

    pauseOverlay.classList.add('opacity-0', 'pointer-events-none');
    pauseContent.classList.add('scale-95');

    primaryIcon.className   = "fas fa-pause";
    primaryText.textContent = "Berhenti Dulu (Pause)";
    btnPrimary.className    = "w-full py-4 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 text-white font-extrabold text-lg shadow-lg shadow-amber-200 hover:shadow-xl hover:shadow-amber-300 transition-all duration-300 active:scale-98 flex items-center justify-center gap-2";

    // Pasang kembali timer kucing yang tertunda
    Object.keys(activeCats).forEach(idx => {
        const baseDuration       = speeds[initialDifficulty].duration;
        const calculatedDuration = Math.max(400, baseDuration / (1 + (currentLevel - 1) * 0.15));
        activeCats[idx].timeoutId = setTimeout(() => slideDownCat(idx), calculatedDuration);
    });

    startTimer();
    spawnTimeoutId = setTimeout(spawnCats, 600);
}

function stopGame() {
    if (gameStatus === 'idle') return;

    clearInterval(timerInterval);
    clearTimeout(spawnTimeoutId);
    Object.keys(activeCats).forEach(idx => clearTimeout(activeCats[idx].timeoutId));

    activeCats = {};
    renderAllHolesWithEmpty();
    pauseOverlay.classList.add('opacity-0', 'pointer-events-none');

    gameStatus   = 'idle';
    timeLeft     = 30;
    score        = 0;
    currentLevel = 1;

    scoreVal.textContent = "0";
    timeVal.textContent  = "30";
    levelVal.textContent = "1";

    primaryIcon.className   = "fas fa-play";
    primaryText.textContent = "Mulai Bermain";
    btnPrimary.className    = "w-full py-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-pink-500 text-white font-extrabold text-lg shadow-lg shadow-pink-200 hover:shadow-xl hover:shadow-pink-300 transition-all duration-300 active:scale-98 flex items-center justify-center gap-2";

    waktuCard.className = "bg-cyan-50/80 rounded-2xl p-3 border border-cyan-100 text-center flex flex-col justify-center transition-all duration-300 neo-btn";
}

function restartGame() {
    stopGame();
    setTimeout(() => startGame(), 100);
}


// --- 4g. Sistem Hitung Mundur Waktu (Timer) ---
function startTimer() {
    timerInterval = setInterval(() => {
        timeLeft--;
        timeVal.textContent = timeLeft;

        // Efek detak jantung merah di 5 detik terakhir
        if (timeLeft <= 5 && timeLeft > 0) {
            playSynthSound('tick');
            waktuCard.className = "bg-rose-100 rounded-2xl p-3 border border-rose-300 text-center flex flex-col justify-center transition-all duration-300 neo-btn animate-pulse";
        }

        if (timeLeft <= 0) endGame();
    }, 1000);
}

// Mengakhiri game ketika waktu habis (Game Over)
function endGame() {
    clearInterval(timerInterval);
    clearTimeout(spawnTimeoutId);
    playSynthSound('gameover');

    gameStatus = 'gameover';

    // Simpan skor tertinggi ke Local Storage
    let isNewHighScore = false;
    if (score > highscore) {
        highscore = score;
        localStorage.setItem('pukul_cat_record', highscore);
        recordVal.textContent = highscore;
        isNewHighScore = true;
    }

    document.getElementById('final-score').textContent = score;
    document.getElementById('final-level').textContent = currentLevel;

    const badge = document.getElementById('new-high-score-badge');
    isNewHighScore ? badge.classList.remove('hidden') : badge.classList.add('hidden');

    const overlay = document.getElementById('modal-gameover');
    const box     = document.getElementById('gameover-box');
    overlay.classList.remove('hidden');
    setTimeout(() => {
        overlay.classList.remove('opacity-0');
        box.classList.remove('scale-90');
    }, 50);

    primaryIcon.className   = "fas fa-play";
    primaryText.textContent = "Mulai Bermain";
    btnPrimary.className    = "w-full py-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-pink-500 text-white font-extrabold text-lg shadow-lg shadow-pink-200 hover:shadow-xl hover:shadow-pink-300 transition-all duration-300 active:scale-98 flex items-center justify-center gap-2";
}

// Menutup modal Game Over dan langsung memulai ulang
function closeGameOverAndRestart() {
    const overlay = document.getElementById('modal-gameover');
    const box     = document.getElementById('gameover-box');

    overlay.classList.add('opacity-0');
    box.classList.add('scale-90');

    setTimeout(() => {
        overlay.classList.add('hidden');
        restartGame();
    }, 300);
}