/* ============================================================
   BIRTHDAY WEBSITE - JavaScript (Animations + Interactions)
   ============================================================ */

// ── FLOATING HEARTS ─────────────────────────────────────────
(function initFloatingHearts() {
    const container = document.getElementById('floating-hearts');
    const emojis = ['💕', '❤️', '🌹', '🌸', '💖', '✨', '💫', '🌺'];

    function createHeart() {
        if (container.children.length > (window.innerWidth < 768 ? 15 : 30)) return;
        const el = document.createElement('span');
        el.className = 'heart-float';
        el.textContent = emojis[Math.floor(Math.random() * emojis.length)];
        el.style.left = Math.random() * 100 + 'vw';
        el.style.fontSize = (0.8 + Math.random() * 1.4) + 'rem';
        el.style.animationDuration = (8 + Math.random() * 10) + 's';
        el.style.animationDelay = (Math.random() * 5) + 's';
        container.appendChild(el);
        setTimeout(() => el.remove(), 20000);
    }

    for (let i = 0; i < 8; i++) setTimeout(createHeart, i * 500);
    setInterval(createHeart, 2200);
})();

// ── PARTICLE CANVAS ──────────────────────────────────────────
(function initParticles() {
    const canvas = document.getElementById('particles-canvas');
    const ctx = canvas.getContext('2d');

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let particles = [];

    class Particle {
        constructor() { this.reset(); }
        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.vx = (Math.random() - 0.5) * 0.4;
            this.vy = -Math.random() * 0.5 - 0.2;
            this.size = Math.random() * 2.5 + 0.5;
            this.alpha = Math.random() * 0.4 + 0.1;
            this.color = ['#e91e63', '#f48fb1', '#f9c74f', '#ce93d8', '#ff8fa3'][Math.floor(Math.random() * 5)];
        }
        update() {
            this.x += this.vx;
            this.y += this.vy;
            this.alpha -= 0.0008;
            if (this.alpha <= 0 || this.y < -10) this.reset();
        }
        draw() {
            ctx.save();
            ctx.globalAlpha = this.alpha;
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }
    }

    const particleCount = window.innerWidth < 768 ? 35 : 80;
    for (let i = 0; i < particleCount; i++) particles.push(new Particle());

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => { p.update(); p.draw(); });
        requestAnimationFrame(animate);
    }
    animate();

    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
})();

// ── COUNTDOWN TIMER ──────────────────────────────────────────
(function initCountdown() {
    // SET YOUR BIRTHDAY DATE HERE — Risma Galuh: 14 Februari 2008
    const BIRTH_MONTH = 1; // Februari (0-indexed)
    const BIRTH_DAY = 14;

    function updateCountdown() {
        const now = new Date();
        let target = new Date(now.getFullYear(), BIRTH_MONTH, BIRTH_DAY);
        if (now > target) target = new Date(now.getFullYear() + 1, BIRTH_MONTH, BIRTH_DAY);

        const diff = target - now;
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        document.getElementById('days').textContent = String(days).padStart(3, '0');
        document.getElementById('hours').textContent = String(hours).padStart(2, '0');
        document.getElementById('minutes').textContent = String(minutes).padStart(2, '0');
        document.getElementById('seconds').textContent = String(seconds).padStart(2, '0');
    }

    updateCountdown();
    setInterval(updateCountdown, 1000);

    // Hitung usia: Risma Galuh lahir 14 Februari 2008
    const birthYear = 2008;
    const now = new Date();
    const hasBirthdayPassedThisYear = (
        now.getMonth() > BIRTH_MONTH ||
        (now.getMonth() === BIRTH_MONTH && now.getDate() >= BIRTH_DAY)
    );
    const age = now.getFullYear() - birthYear - (hasBirthdayPassedThisYear ? 0 : 1);
    document.getElementById('ageNumber').textContent = age;
})();


// ── LOVE DURATION COUNTER ─────────────────────────────────────
(function initLoveDuration() {
    // SET YOUR ANNIVERSARY DATE HERE (Year, Month-1, Day)
    // 21 September 2025 = new Date(2025, 8, 21)
    const anniversaryDate = new Date(2025, 8, 21);

    function updateLoveDuration() {
        const now = new Date();

        let years = now.getFullYear() - anniversaryDate.getFullYear();
        let months = now.getMonth() - anniversaryDate.getMonth();
        let days = now.getDate() - anniversaryDate.getDate();

        // Adjust if days are negative (borrow from previous month)
        if (days < 0) {
            months--;
            const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0);
            days += prevMonth.getDate();
        }
        if (months < 0) {
            years--;
            months += 12;
        }

        document.getElementById('loveYears').textContent = years;
        document.getElementById('loveMonths').textContent = months;
        document.getElementById('loveDays').textContent = days;
    }

    updateLoveDuration();
    setInterval(updateLoveDuration, 1000 * 60); // update per minute
})();

// ── SCROLL ANIMATIONS (Intersection Observer) ─────────────────
(function initScrollAnimations() {
    const sections = document.querySelectorAll('section');

    sections.forEach(section => {
        section.classList.add('fade-in-section');
    });

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });

    sections.forEach(section => observer.observe(section));
})();

// ── PHOTO UPLOAD ─────────────────────────────────────────────
function loadPhoto(input, imgId) {
    const file = input.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
        const img = document.getElementById(imgId);
        img.src = e.target.result;
        img.classList.remove('hidden');

        const num = imgId.replace('img', '');
        const ph = document.getElementById('ph' + num);
        if (ph) ph.style.display = 'none';

        img.style.opacity = '0';
        img.style.transform = 'scale(0.95)';
        img.style.transition = 'all 0.5s ease';
        setTimeout(() => {
            img.style.opacity = '1';
            img.style.transform = 'scale(1)';
        }, 50);
    };
    reader.readAsDataURL(file);
}

// ── VIDEO UPLOAD ─────────────────────────────────────────────
function loadVideo(input, videoElId, placeholderId) {
    const file = input.files[0];
    if (!file) return;

    const videoEl = document.getElementById(videoElId);
    const placeholder = document.getElementById(placeholderId);
    const url = URL.createObjectURL(file);

    videoEl.src = url;
    videoEl.classList.remove('hidden');
    videoEl.style.opacity = '0';
    videoEl.style.transition = 'opacity 0.5s ease';

    const label = placeholder.querySelector('.video-upload-label');
    if (label) label.style.display = 'none';

    videoEl.onloadeddata = () => {
        videoEl.style.opacity = '1';
    };
    videoEl.load();
}

// ── MUSIC PLAYER (Fixed: musik.mp3) ──────────────────────────
// Global function called by the overlay in index.html
// ── MUSIC PLAYER (UI Sync & Controls) ──────────────────────────
(function initMusicUI() {
    var audio = document.getElementById('bgMusic');
    var sub = document.getElementById('musicSub');
    if (!audio) return;

    // Event listeners to keep UI in sync
    audio.addEventListener('play', function () {
        setMusicUI(true);
        if (sub) sub.textContent = '♪ Sedang diputar';
    });
    audio.addEventListener('pause', function () {
        setMusicUI(false);
        if (sub) sub.textContent = '♪ Berhenti (Klik ▶)';
    });

    audio.addEventListener('error', function () {
        if (sub) {
            var code = audio.error ? audio.error.code : 'unknown';
            sub.textContent = '⚠️ Audio Error (' + code + ') - Cek musik.mp3';
        }
    });

    // Sync UI on load
    if (!audio.paused) {
        setMusicUI(true);
        if (sub) sub.textContent = '♪ Sedang diputar';
    }
})();

// ── SUPABASE CONFIGURATION (Ganti dengan data Anda) ──────────
const SUPABASE_URL = 'Isi_Project_URL_Anda_Di_Sini';
const SUPABASE_KEY = 'Isi_Anon_Key_Anda_Di_Sini';
const supabase = window.supabase ? window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY) : null;

// ── GLOBAL GALLERY (Cloud Sync with Supabase) ────────────────
async function loadSavedMedia() {
    const statusDot = document.getElementById('statusDot');
    const statusText = document.getElementById('statusText');

    if (!supabase || SUPABASE_URL.includes('Isi_Project')) {
        console.warn("Supabase belum terhubung. Selesaikan Langkah 2 di Walkthrough.");
        const grid = document.getElementById('sharedGalleryGrid');
        if (grid) grid.innerHTML = '<div class="empty-gallery-msg">☁️ Selesaikan Langkah 2 (API Key) untuk mengaktifkan galeri global...</div>';
        return;
    }

    // Mark as active
    if (statusDot) statusDot.classList.add('active');
    if (statusText) statusText.textContent = 'Cloud: Tersambung (Mulus & Global)';

    const { data, error } = await supabase
        .from('memories')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error("Gagal memuat data:", error);
        if (statusText) statusText.textContent = 'Cloud: Error Database (Cek Tabel)';
        return;
    }

    const grid = document.getElementById('sharedGalleryGrid');
    if (!grid) return;
    grid.innerHTML = '';

    if (data.length === 0) {
        grid.innerHTML = '<div class="empty-gallery-msg">Belum ada kenangan di galeri. Ayo tambahkan foto/video pertama kalian! 🌹</div>';
    } else {
        data.forEach(item => {
            renderMediaCard(item, false);
        });
    }
}

function renderMediaCard(item, isNew) {
    const grid = document.getElementById('sharedGalleryGrid');
    const card = document.createElement('div');
    card.className = 'shared-photo-card';

    // Gunakan URL langsung dari database
    const isVideo = item.type.startsWith('video/');
    const mediaHtml = isVideo
        ? `<video src="${item.url}" class="shared-photo-img" controls></video>`
        : `<img src="${item.url}" class="shared-photo-img" alt="Memori">`;

    card.innerHTML = `
        ${mediaHtml}
        <div class="shared-photo-info">
            Kenangan abadi! 💖
            <span class="shared-photo-date">${item.date}</span>
        </div>
    `;

    grid.prepend(card);
    if (isNew) {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        setTimeout(() => {
            card.style.transition = 'all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, 50);
        card.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
}

async function handlePhotoUpload(event) {
    const file = event.target.files[0];
    if (!file || !supabase) {
        if (!supabase) alert("Hubungkan Supabase dulu ya (Langkah 2)!");
        return;
    }

    const uploadBtn = document.querySelector('.upload-btn span');
    const originalText = uploadBtn.textContent;
    uploadBtn.textContent = '⌛ Mengupload ke Awan...';

    // 1. Upload ke Storage Bucket 'photos'
    const fileName = `${Date.now()}_${file.name}`;
    const { data: storageData, error: storageError } = await supabase.storage
        .from('photos')
        .upload(fileName, file);

    if (storageError) {
        console.error("Upload storage gagal:", storageError);
        alert("Upload gagal: " + storageError.message);
        uploadBtn.textContent = originalText;
        return;
    }

    // 2. Dapatkan URL Public
    const { data: publicUrlData } = supabase.storage
        .from('photos')
        .getPublicUrl(fileName);

    const publicUrl = publicUrlData.publicUrl;

    // 3. Simpan Metadata ke Tabel 'memories'
    const now = new Date();
    const dateStr = now.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });

    const { data: dbData, error: dbError } = await supabase
        .from('memories')
        .insert([{
            url: publicUrl,
            type: file.type,
            date: dateStr
        }])
        .select();

    if (dbError) {
        console.error("Gagal simpan ke database:", dbError);
        alert("Database error: " + dbError.message);
    } else {
        renderMediaCard(dbData[0], true);
    }

    uploadBtn.textContent = originalText;
}

// Cek koneksi & muat data saat awal
if (supabase) {
    loadSavedMedia();
}

// Fungsi bantu hapus galeri (hanya untuk database di sini)
async function clearSharedMemories() {
    if (!supabase) return;
    if (!confirm('Hapus selamanya semua kenangan dari cloud?')) return;

    const { error } = await supabase
        .from('memories')
        .delete()
        .neq('id', 0); // Hapus semua

    if (error) alert("Gagal menghapus: " + error.message);
    else {
        document.getElementById('sharedGalleryGrid').innerHTML = '';
        alert('Cloud Gallery dibersihkan! ✨');
    }
}

function toggleMusic() {
    var audio = document.getElementById('bgMusic');
    var sub = document.getElementById('musicSub');
    if (!audio) return;

    if (audio.paused) {
        // Retry playing
        audio.play().then(function () {
            if (sub) sub.textContent = '♪ Sedang diputar';
        }).catch(function () {
            // Fallback reload if stuck
            audio.load();
            audio.play().catch(function () { });
        });
    } else {
        audio.pause();
        if (sub) sub.textContent = '♪ Berhenti (Klik ▶)';
    }
}

function toggleYtMusic() { toggleMusic(); }
function loadMusic() { }

function setMusicUI(playing) {
    var btn = document.getElementById('playBtn');
    var icon = document.getElementById('musicNoteIcon');
    if (btn) btn.textContent = playing ? '⏸' : '▶';
    if (icon) icon.style.animation = playing ? 'pulse 1.5s ease infinite' : 'none';
}

// ── FIREWORKS (Dark Overlay Mode) ────────────────────────────
let fwActive = false;
let fwAnimFrame = null;
let fwParticles = [];
let fwBurstTimer = null;

const FW_PALETTES = [
    ['#f9c74f', '#ffdf80', '#ffd700'],   // gold
    ['#f48fb1', '#ff6b95', '#e91e63'],   // rose
    ['#ce93d8', '#ba68c8', '#9c27b0'],   // purple
    ['#80deea', '#26c6da', '#00acc1'],   // teal
    ['#ffffff', '#f9c74f', '#f48fb1'],   // white-gold-pink
];

function launchFireworks() {
    var overlay = document.getElementById('fw-overlay');
    var canvas = document.getElementById('fw-canvas');
    if (!overlay || !canvas) return;

    // Stop any previous session cleanly
    closeFwOverlay(true);

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    overlay.classList.add('fw-active');
    fwActive = true;
    fwParticles = [];

    var ctx = canvas.getContext('2d');
    renderFw(ctx, canvas);

    // Schedule bursts: 0ms, 500ms, 900ms, 1300ms … up to ~8s
    var schedule = [0, 500, 850, 1200, 1600, 2000, 2350, 2700, 3100, 3500, 3900, 4300, 4700, 5100];
    schedule.forEach(function (delay) {
        fwBurstTimer = setTimeout(function () {
            if (!fwActive) return;
            // Fire 2-4 bursts simultaneously
            var n = 2 + Math.floor(Math.random() * 3);
            for (var i = 0; i < n; i++) spawnBurst(canvas);
        }, delay);
    });
}

function spawnBurst(canvas) {
    var cx = canvas.width;
    var cy = canvas.height;

    // Safe zones: avoid center 30% x 30% area (where text sits)
    var safeZones = [
        { x: cx * (0.05 + Math.random() * 0.22), y: cy * (0.05 + Math.random() * 0.40) },
        { x: cx * (0.73 + Math.random() * 0.22), y: cy * (0.05 + Math.random() * 0.40) },
        { x: cx * (0.05 + Math.random() * 0.22), y: cy * (0.55 + Math.random() * 0.35) },
        { x: cx * (0.73 + Math.random() * 0.22), y: cy * (0.55 + Math.random() * 0.35) },
        { x: cx * (0.25 + Math.random() * 0.50), y: cy * (0.72 + Math.random() * 0.22) },
    ];
    var pos = safeZones[Math.floor(Math.random() * safeZones.length)];
    var palette = FW_PALETTES[Math.floor(Math.random() * FW_PALETTES.length)];
    var count = 100 + Math.floor(Math.random() * 60);
    var spread = 0.85 + Math.random() * 0.3; // burst fullness

    for (var i = 0; i < count; i++) {
        var angle = (Math.PI * 2 / count) * i + (Math.random() - 0.5) * 0.15;
        var speed = (3 + Math.random() * 6) * spread;
        var color = palette[Math.floor(Math.random() * palette.length)];
        var isStar = Math.random() < 0.2; // 20% are "glitter" sparks

        fwParticles.push({
            x: pos.x, y: pos.y,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            alpha: 1,
            decay: 0.008 + Math.random() * 0.009, // slower fade = smoother
            radius: isStar ? (1 + Math.random() * 1.5) : (2.5 + Math.random() * 2),
            color: color,
            glow: isStar ? 4 : 14,
            drag: 0.96 + Math.random() * 0.02,
        });
    }
}

function renderFw(ctx, canvas) {
    if (!fwActive) return;

    // Soft dark trail — lower alpha = longer, more visible trails
    ctx.fillStyle = 'rgba(4, 0, 15, 0.14)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    var alive = [];
    for (var i = 0; i < fwParticles.length; i++) {
        var p = fwParticles[i];
        p.vx *= p.drag;
        p.vy = p.vy * p.drag + 0.09;  // gentle gravity
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= p.decay;
        if (p.alpha <= 0) continue;

        ctx.save();
        ctx.globalAlpha = p.alpha * p.alpha; // quadratic fade = smoother tail
        ctx.shadowBlur = p.glow;
        ctx.shadowColor = p.color;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, Math.max(0.5, p.radius * p.alpha), 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
        alive.push(p);
    }
    fwParticles = alive;

    fwAnimFrame = requestAnimationFrame(function () { renderFw(ctx, canvas); });
}

function closeFwOverlay(silent) {
    var overlay = document.getElementById('fw-overlay');
    var canvas = document.getElementById('fw-canvas');
    if (overlay && !silent) overlay.classList.remove('fw-active');
    if (overlay && silent) overlay.classList.remove('fw-active');
    fwActive = false;
    fwParticles = [];
    if (fwAnimFrame) cancelAnimationFrame(fwAnimFrame);
    if (fwBurstTimer) clearTimeout(fwBurstTimer);
    if (canvas) {
        var ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
}

window.addEventListener('resize', function () {
    if (!fwActive) return;
    var canvas = document.getElementById('fw-canvas');
    if (canvas) { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
});

// Launch a small burst on page load (existing behavior)
window.addEventListener('load', function () {
    setTimeout(function () {
        // Only tiny auto-burst on load, not full overlay
        const canvas = document.getElementById('particles-canvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        for (let i = 0; i < 3; i++) {
            setTimeout(function () { _smallBurst(canvas, ctx); }, i * 500);
        }
    }, 1200);
});

function _smallBurst(canvas, ctx) {
    const cx = Math.random() * canvas.width;
    const cy = Math.random() * canvas.height * 0.5;
    const colors = ['#e91e63', '#f9c74f', '#ce93d8', '#ff8fa3', '#ffffff'];
    for (let i = 0; i < 50; i++) {
        const angle = (Math.PI * 2 / 50) * i;
        const speed = 2 + Math.random() * 4;
        let x = cx, y = cy, alpha = 1;
        const color = colors[Math.floor(Math.random() * colors.length)];
        (function anim() {
            alpha -= 0.03;
            if (alpha <= 0) return;
            x += Math.cos(angle) * speed * alpha;
            y += Math.sin(angle) * speed * alpha + 0.15;
            ctx.save(); ctx.globalAlpha = alpha;
            ctx.fillStyle = color;
            ctx.beginPath(); ctx.arc(x, y, 2.5, 0, Math.PI * 2); ctx.fill();
            ctx.restore();
            requestAnimationFrame(anim);
        })();
    }
}



// ── HERO name customization ──────────────────────────────────
// Auto-twinkling sparkle on hero title
(function heroSparkle() {
    const heroTitle = document.querySelector('.hero-title');
    if (!heroTitle) return;
    heroTitle.style.transition = 'text-shadow 1.5s ease';
    setInterval(() => {
        heroTitle.style.textShadow = `0 0 ${20 + Math.random() * 30}px rgba(233,30,99,${0.3 + Math.random() * 0.4})`;
    }, 1500);
})();
