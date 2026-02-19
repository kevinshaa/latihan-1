/* ============================================================
   BIRTHDAY WEBSITE - Master Script (Restored & Robust)
   ============================================================ */

// ── 1. INITIALIZATION & GLOBAL SCOPE ────────────────────────
window.addEventListener('load', () => {
    initFloatingHearts();
    initParticles();
    initCountdown();
    initLoveDuration();
    initScrollAnimations();
    initHeroSparkle();

    // Status awal (menunggu koneksi)
    const statusText = document.getElementById('statusText');
    if (statusText) statusText.textContent = 'Cloud: Sedang menghubungkan...';

    // Coba muat data dari cloud setelah jeda singkat
    setTimeout(() => {
        if (typeof window.loadSavedMedia === 'function') window.loadSavedMedia();
    }, 1500);
});

// ── 2. MUSIC PLAYER LOGIC ───────────────────────────────────
window.toggleMusic = function () {
    const audio = document.getElementById('bgMusic');
    const sub = document.getElementById('musicSub');
    if (!audio) return;

    if (audio.paused) {
        audio.play().then(() => {
            window.setMusicUI(true);
        }).catch(() => {
            audio.load();
            audio.play().then(() => window.setMusicUI(true)).catch(() => { });
        });
    } else {
        audio.pause();
        window.setMusicUI(false);
    }
};

window.setMusicUI = function (playing) {
    const btn = document.getElementById('playBtn');
    const icon = document.getElementById('musicNoteIcon');
    const sub = document.getElementById('musicSub');
    if (btn) btn.textContent = playing ? '⏸' : '▶';
    if (sub) sub.textContent = playing ? '♪ Sedang diputar' : '♪ Berhenti (Klik ▶)';
    if (icon) icon.style.animation = playing ? 'music-note-beat 2s ease-in-out infinite' : 'none';
};

// ── 3. FIREWORKS LOGIC ──────────────────────────────────────
let fwActive = false;
let fwParticles = [];
let fwAnimFrame = null;
let fwBurstTimer = [];

const FW_PALETTES = [
    ['#f9c74f', '#ffdf80', '#ffd700'], ['#f48fb1', '#ff6b95', '#e91e63'],
    ['#ce93d8', '#ba68c8', '#9c27b0'], ['#80deea', '#26c6da', '#00acc1']
];

window.launchFireworks = function () {
    const overlay = document.getElementById('fw-overlay');
    const canvas = document.getElementById('fw-canvas');
    if (!overlay || !canvas) return;

    window.closeFwOverlay(true);
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    overlay.classList.add('fw-active');
    fwActive = true;
    fwParticles = [];

    const ctx = canvas.getContext('2d');
    const render = () => {
        if (!fwActive) return;
        ctx.fillStyle = 'rgba(4, 0, 15, 0.15)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        fwParticles = fwParticles.filter(p => {
            p.vx *= 0.97; p.vy = p.vy * 0.97 + 0.1;
            p.x += p.vx; p.y += p.vy; p.alpha -= 0.01;
            if (p.alpha <= 0) return false;
            ctx.save(); ctx.globalAlpha = p.alpha; ctx.fillStyle = p.color;
            ctx.beginPath(); ctx.arc(p.x, p.y, 2, 0, Math.PI * 2); ctx.fill(); ctx.restore();
            return true;
        });
        fwAnimFrame = requestAnimationFrame(render);
    };
    render();

    [0, 500, 1000, 1500, 2000, 2500, 3000].forEach(delay => {
        fwBurstTimer.push(setTimeout(() => {
            if (!fwActive) return;
            const x = Math.random() * canvas.width;
            const y = Math.random() * canvas.height * 0.6;
            const color = FW_PALETTES[Math.floor(Math.random() * FW_PALETTES.length)][0];
            for (let i = 0; i < 60; i++) {
                const angle = Math.random() * Math.PI * 2;
                const speed = Math.random() * 6 + 2;
                fwParticles.push({ x, y, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed, alpha: 1, color });
            }
        }, delay));
    });
};

window.closeFwOverlay = function (silent = false) {
    const overlay = document.getElementById('fw-overlay');
    if (overlay) overlay.classList.remove('fw-active');
    fwActive = false;
    fwParticles = [];
    if (fwAnimFrame) cancelAnimationFrame(fwAnimFrame);
    fwBurstTimer.forEach(t => clearTimeout(t));
    fwBurstTimer = [];
};

// ── 4. ANNIVERSARY & COUNTDOWN ──────────────────────────────
function initLoveDuration() {
    const start = new Date(2025, 8, 21); // 21 Sept 2025
    const update = () => {
        const now = new Date();
        let y = now.getFullYear() - start.getFullYear();
        let m = now.getMonth() - start.getMonth();
        let d = now.getDate() - start.getDate();
        if (d < 0) { m--; d += new Date(now.getFullYear(), now.getMonth(), 0).getDate(); }
        if (m < 0) { y--; m += 12; }
        document.getElementById('loveYears').textContent = Math.max(0, y);
        document.getElementById('loveMonths').textContent = Math.max(0, m);
        document.getElementById('loveDays').textContent = Math.max(0, d);
    };
    update(); setInterval(update, 60000);
}

function initCountdown() {
    const update = () => {
        const target = new Date(new Date().getFullYear(), 1, 14); // 14 Feb
        if (new Date() > target) target.setFullYear(target.getFullYear() + 1);
        const diff = target - new Date();
        document.getElementById('days').textContent = String(Math.floor(diff / 864e5)).padStart(3, '0');
        document.getElementById('hours').textContent = String(Math.floor((diff % 864e5) / 36e5)).padStart(2, '0');
        document.getElementById('minutes').textContent = String(Math.floor((diff % 36e5) / 6e4)).padStart(2, '0');
        document.getElementById('seconds').textContent = String(Math.floor((diff % 6e4) / 1e3)).padStart(2, '0');
        document.getElementById('ageNumber').textContent = new Date().getFullYear() - 2008;
    };
    update(); setInterval(update, 1000);
}

// ── 5. GALLERY & UPLOAD ─────────────────────────────────────
window.handlePhotoUpload = function (e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (ev) => {
        const item = { url: ev.target.result, type: file.type, date: new Date().toLocaleDateString('id-ID') };
        renderMediaCard(item, true);
        const statusText = document.getElementById('statusText'); // Get statusText here
        if (supabase) {
            try {
                const name = `${Date.now()}_${file.name}`;
                const { error: storageError } = await supabase.storage.from('photos').upload(name, file);

                if (storageError) {
                    if (statusText) statusText.textContent = '❌ Cloud Error: Cek Bucket "photos" (Harus Public)';
                    console.error("Storage Error:", storageError);
                    return;
                }

                const { data: publicUrlData } = supabase.storage.from('photos').getPublicUrl(name);
                const { error: dbError } = await supabase.from('memories').insert([{
                    url: publicUrlData.publicUrl,
                    type: file.type,
                    date: item.date
                }]);

                if (dbError) {
                    if (statusText) statusText.textContent = '❌ Cloud Error: Cek Tabel "memories" di SQL';
                    console.error("Database Error:", dbError);
                } else {
                    if (statusText) statusText.textContent = '✅ Berhasil Tersimpan di Cloud!';
                }
            } catch (err) {
                if (statusText) statusText.textContent = '❌ Cloud Sync Gagal (Cek Koneksi)';
                console.warn("Cloud Sync Exception:", err);
            }
        }
    };
    reader.readAsDataURL(file);
};

window.loadSavedMedia = async function () {
    const statusDot = document.getElementById('statusDot');
    const statusText = document.getElementById('statusText');
    const grid = document.getElementById('sharedGalleryGrid');

    if (!supabase) {
        if (statusText) statusText.textContent = 'Cloud: Menunggu Supabase...';
        return;
    }

    const { data, error } = await supabase.from('memories').select('*').order('created_at', { ascending: false });

    if (error) {
        console.error("Fetch Error:", error);
        if (statusText) {
            statusText.textContent = (error.message.includes('not found'))
                ? '❌ Error: Tabel "memories" Belum Dibuat'
                : '❌ Cloud Error: ' + error.message;
        }
        return;
    }

    if (statusDot) statusDot.classList.add('active');
    if (statusText) statusText.textContent = 'Cloud: Sinkron Berhasil ✨';

    if (grid) {
        grid.innerHTML = '';
        if (data.length === 0) {
            grid.innerHTML = '<div class="empty-gallery-msg">Belum ada kenangan. Ayo tambah foto/video pertama kalian! 🌹</div>';
        } else {
            data.forEach(item => renderMediaCard(item, false));
        }
    }
};

function renderMediaCard(item, isNew) {
    const grid = document.getElementById('sharedGalleryGrid');
    if (!grid) return;
    const div = document.createElement('div');
    div.className = 'shared-photo-card';

    const isVideo = item.type && item.type.startsWith('video/');
    const mediaHtml = isVideo
        ? `<video src="${item.url}" class="shared-photo-img" controls></video>`
        : `<img src="${item.url}" class="shared-photo-img" alt="Memori">`;

    div.innerHTML = `
        ${mediaHtml}
        <div class="shared-photo-info">
            Kenangan abadi! 💖
            <span class="shared-photo-date">${item.date || 'Baru saja'}</span>
        </div>
    `;
    grid.prepend(div);
}

window.clearSharedMemories = function () {
    if (confirm('Bersihkan galeri ini? Semua foto di cloud akan dihapus.')) {
        document.getElementById('sharedGalleryGrid').innerHTML = '';
        if (supabase) {
            supabase.from('memories').delete().neq('id', 0).then(() => {
                const st = document.getElementById('statusText');
                if (st) st.textContent = 'Cloud: Galeri telah dibersihkan';
            });
        }
    }
};

window.loadPhoto = function (input, imgId) {
    const f = input.files[0]; if (!f) return;
    const r = new FileReader();
    r.onload = e => {
        const img = document.getElementById(imgId); img.src = e.target.result; img.classList.remove('hidden');
        const ph = document.getElementById('ph' + imgId.replace('img', '')); if (ph) ph.style.display = 'none';
    };
    r.readAsDataURL(f);
}

window.loadVideo = function (i, v, p) {
    const f = i.files[0]; if (!f) return;
    const el = document.getElementById(v); el.src = URL.createObjectURL(f); el.classList.remove('hidden');
    document.getElementById(p).querySelector('.video-upload-label').style.display = 'none';
}

// ── 6. ANIMATIONS & UI ──────────────────────────────────────
function initFloatingHearts() {
    const c = document.getElementById('floating-hearts');
    setInterval(() => {
        if (c.children.length > 20) return;
        const e = document.createElement('span'); e.className = 'heart-float';
        e.textContent = ['❤️', '💖', '🌹', '✨'][Math.floor(Math.random() * 4)];
        e.style.left = Math.random() * 100 + 'vw'; e.style.animationDuration = (5 + Math.random() * 5) + 's';
        c.appendChild(e); setTimeout(() => e.remove(), 10000);
    }, 1500);
}

function initParticles() {
    const cv = document.getElementById('particles-canvas'); const ctx = cv.getContext('2d');
    cv.width = window.innerWidth; cv.height = window.innerHeight;
    let parts = Array.from({ length: 50 }, () => ({ x: Math.random() * cv.width, y: Math.random() * cv.height, v: Math.random() * 0.5 + 0.2 }));
    const anim = () => {
        ctx.clearRect(0, 0, cv.width, cv.height); ctx.fillStyle = 'white'; ctx.globalAlpha = 0.3;
        parts.forEach(p => { p.y -= p.v; if (p.y < 0) p.y = cv.height; ctx.beginPath(); ctx.arc(p.x, p.y, 1, 0, 7); ctx.fill(); });
        requestAnimationFrame(anim);
    };
    anim();
}

function initScrollAnimations() {
    const obs = new IntersectionObserver(ents => ents.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); }), { threshold: 0.1 });
    document.querySelectorAll('section').forEach(s => { s.classList.add('fade-in-section'); obs.observe(s); });
}

function initHeroSparkle() {
    const h = document.querySelector('.hero-title'); if (!h) return;
    setInterval(() => h.style.textShadow = `0 0 ${20 + Math.random() * 20}px rgba(233,30,99,0.5)`, 1000);
}

// ── 7. SUPABASE CONFIG ──────────────────────────────────────
const SUPABASE_URL = 'https://lasbelwjsatzfaczinks.supabase.co';
const SUPABASE_KEY = 'sb_publishable_f8OCZCVbS31zv1Zhg51vfg_OdwjqsVu';
let supabase = null;

// Initialize Supabase safely
function initSupabase() {
    try {
        if (typeof window.supabase !== 'undefined') {
            supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
        }
    } catch (e) {
        console.error("Supabase Init Error:", e);
    }
}
initSupabase();
