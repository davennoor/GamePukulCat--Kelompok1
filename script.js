lucide.createIcons();

        const holes = document.querySelectorAll('.hole');
        const moles = document.querySelectorAll('.mole');
        const scoreDisplay = document.getElementById('score');
        const timerDisplay = document.getElementById('timer');
        const highscoreDisplay = document.getElementById('high-score');
        const startBtn = document.getElementById('start-btn');
        const modal = document.getElementById('modal');
        const restartBtn = document.getElementById('restart-btn');
        const soundToggle = document.getElementById('sound-toggle');
        
        const sfxHit = document.getElementById('sfx-hit');
        const bgMusic = document.getElementById('bg-music');
        bgMusic.volume = 0.2;

        let score = 0;
        let timeLeft = 30;
        let timeUp = false;
        let lastHole;
        let timerId;
        let isMuted = false;

        let highScore = localStorage.getItem('whackMoleHighV2') || 0;
        highscoreDisplay.textContent = highScore;

        function playSound(sound) {
            if (isMuted) return;
            sound.currentTime = 0;
            sound.play().catch(e => {});
        }

        soundToggle.addEventListener('click', () => {
            isMuted = !isMuted;
            const icon = isMuted ? 'volume-x' : 'volume-2';
            soundToggle.innerHTML = `<i data-lucide="${icon}"></i>`;
            lucide.createIcons();
            if (isMuted) bgMusic.pause(); else if(!timeUp && timeLeft < 30) bgMusic.play();
        });

        // Pengaturan waktu kemunculan yang lebih lambat
        function randomTime(min, max) {
            // Skala kesulitan yang lebih halus
            const difficultyScale = Math.max(0, score * 8); 
            const newMin = Math.max(700, min - difficultyScale);
            const newMax = Math.max(1200, max - difficultyScale);
            return Math.round(Math.random() * (newMax - newMin) + newMin);
        }

        function randomHole(holes) {
            const idx = Math.floor(Math.random() * holes.length);
            const hole = holes[idx];
            if (hole === lastHole) return randomHole(holes);
            lastHole = hole;
            return hole;
        }

        function peep() {
            // Waktu muncul di layar (dibuat lebih lama agar tidak terlalu cepat hilang)
            const showTime = randomTime(800, 1400); 
            const hole = randomHole(holes);
            const mole = hole.querySelector('.mole');
            mole.classList.add('up');

            setTimeout(() => {
                mole.classList.remove('up');
                // Berikan jeda antar kemunculan agar lebih santai
                if (!timeUp) {
                    setTimeout(peep, Math.random() * 500 + 200);
                }
            }, showTime);
        }

        function createParticles(x, y) {
            for (let i = 0; i < 8; i++) {
                const p = document.createElement('div');
                p.classList.add('particle');
                p.style.left = x + 'px';
                p.style.top = y + 'px';
                p.style.setProperty('--x', (Math.random() - 0.5) * 100 + 'px');
                p.style.setProperty('--y', (Math.random() - 0.5) * 100 + 'px');
                document.body.appendChild(p);
                setTimeout(() => p.remove(), 500);
            }
        }

        function whack(e) {
            if (!e.isTrusted) return;
            score++;
            playSound(sfxHit);
            this.classList.remove('up');
            scoreDisplay.textContent = score;
            createParticles(e.pageX, e.pageY);
            if (window.navigator.vibrate) window.navigator.vibrate(30);
        }

        function startGame() {
            score = 0;
            timeLeft = 30;
            timeUp = false;
            scoreDisplay.textContent = 0;
            timerDisplay.textContent = timeLeft;
            startBtn.disabled = true;
            modal.style.display = 'none';

            if (!isMuted) bgMusic.play();

            peep();

            timerId = setInterval(() => {
                timeLeft--;
                timerDisplay.textContent = timeLeft;
                if (timeLeft <= 0) {
                    clearInterval(timerId);
                    endGame();
                }
            }, 1000);
        }

        function endGame() {
            timeUp = true;
            startBtn.disabled = false;
            bgMusic.pause();
            bgMusic.currentTime = 0;

            if (score > highScore) {
                highScore = score;
                localStorage.setItem('whackMoleHighV2', highScore);
                highscoreDisplay.textContent = highScore;
            }

            document.getElementById('final-score').textContent = score;
            modal.style.display = 'flex';
        }

        moles.forEach(mole => mole.addEventListener('click', whack));
        startBtn.addEventListener('click', startGame);
        restartBtn.addEventListener('click', startGame);