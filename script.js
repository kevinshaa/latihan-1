/* ============================================================
   BIRTHDAY WEBSITE - Master Script (ES5 Defensive Version)
   ============================================================ */

// ── 1. CORE INTERACTIVE FUNCTIONS (Always Defined First) ─────
window.toggleMusic = function () {
    try {
        var audio = document.getElementById('bgMusic');
        var sub = document.getElementById('musicSub');
        if (!audio) return;

        if (audio.paused) {
            audio.play().then(function () {
                window.setMusicUI(true);
            }).catch(function () {
                audio.load();
                audio.play().then(function () { window.setMusicUI(true); }).catch(function () { });
            });
        } else {
            audio.pause();
            window.setMusicUI(false);
        }
    } catch (e) { console.error("toggleMusic error:", e); }
};

window.setMusicUI = function (playing) {
    try {
        var btn = document.getElementById('playBtn');
        var icon = document.getElementById('musicNoteIcon');
        var sub = document.getElementById('musicSub');
        if (btn) btn.textContent = playing ? '⏸' : '▶';
        if (sub) sub.textContent = playing ? '♪ Sedang diputar' : '♪ Berhenti (Klik ▶)';
        if (icon) icon.style.animation = playing ? 'music-note-beat 2s ease-in-out infinite' : 'none';
    } catch (e) { }
};

var fwActive = false;
var fwParticles = [];
var fwAnimFrame = null;
var fwBurstTimer = [];

window.launchFireworks = function () {
    try {
        var overlay = document.getElementById('fw-overlay');
        var canvas = document.getElementById('fw-canvas');
        if (!overlay || !canvas) return;

        window.closeFwOverlay(true);
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        overlay.classList.add('fw-active');
        fwActive = true;
        fwParticles = [];

        var ctx = canvas.getContext('2d');
        var render = function () {
            if (!fwActive) return;
            ctx.fillStyle = 'rgba(4, 0, 15, 0.15)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            var alive = [];
            for (var i = 0; i < fwParticles.length; i++) {
                var p = fwParticles[i];
                p.vx *= 0.97; p.vy = p.vy * 0.97 + 0.1;
                p.x += p.vx; p.y += p.vy; p.alpha -= 0.01;
                if (p.alpha > 0) {
                    ctx.save(); ctx.globalAlpha = p.alpha; ctx.fillStyle = p.color;
                    ctx.beginPath(); ctx.arc(p.x, p.y, 2, 0, Math.PI * 2); ctx.fill(); ctx.restore();
                    alive.push(p);
                }
            }
            fwParticles = alive;
            fwAnimFrame = requestAnimationFrame(render);
        };
        render();

        var schedule = [0, 500, 1000, 1500, 2000, 2500, 3000];
        for (var j = 0; j < schedule.length; j++) {
            (function (delay) {
                fwBurstTimer.push(setTimeout(function () {
                    if (!fwActive) return;
                    var x = Math.random() * canvas.width;
                    var y = Math.random() * canvas.height * 0.6;
                    var colors = ['#f9c74f', '#f48fb1', '#ce93d8', '#80deea'];
                    var color = colors[Math.floor(Math.random() * colors.length)];
                    for (var k = 0; k < 60; k++) {
                        var angle = Math.random() * Math.PI * 2;
                        var speed = Math.random() * 6 + 2;
                        fwParticles.push({ x: x, y: y, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed, alpha: 1, color: color });
                    }
                }, delay));
            })(schedule[j]);
        }
    } catch (e) { console.error("fireworks error:", e); }
};

window.closeFwOverlay = function (silent) {
    var overlay = document.getElementById('fw-overlay');
    if (overlay) overlay.classList.remove('fw-active');
    fwActive = false;
    fwParticles = [];
    if (fwAnimFrame) cancelAnimationFrame(fwAnimFrame);
    for (var i = 0; i < fwBurstTimer.length; i++) clearTimeout(fwBurstTimer[i]);
    fwBurstTimer = [];
};

// ── 2. INITIALIZATION (Wrapped in Try-Catch) ──────────────────
window.addEventListener('load', function () {
    try { initFloatingHearts(); } catch (e) { }
    try { initParticles(); } catch (e) { }
    try { initCountdown(); } catch (e) { }
    try { initLoveDuration(); } catch (e) { }
    try { initScrollAnimations(); } catch (e) { }
    try { initHeroSparkle(); } catch (e) { }

    var st = document.getElementById('statusText');
    if (st) st.textContent = 'Cloud: Menghubungkan...';

    setTimeout(function () {
        if (typeof window.loadSavedMedia === 'function') window.loadSavedMedia();
    }, 1500);
});

// ── 3. ANNIVERSARY & COUNTDOWN ──────────────────────────────
function initLoveDuration() {
    var start = new Date(2025, 8, 21); // 21 Sept 2025
    var update = function () {
        var now = new Date();
        var y = now.getFullYear() - start.getFullYear();
        var m = now.getMonth() - start.getMonth();
        var d = now.getDate() - start.getDate();
        if (d < 0) { m--; d += new Date(now.getFullYear(), now.getMonth(), 0).getDate(); }
        if (m < 0) { y--; m += 12; }
        var ey = document.getElementById('loveYears');
        var em = document.getElementById('loveMonths');
        var ed = document.getElementById('loveDays');
        if (ey) ey.textContent = Math.max(0, y);
        if (em) em.textContent = Math.max(0, m);
        if (ed) ed.textContent = Math.max(0, d);
    };
    update(); setInterval(update, 60000);
}

function initCountdown() {
    var update = function () {
        var now = new Date();
        var target = new Date(now.getFullYear(), 1, 14); // 14 Feb
        if (now > target) target.setFullYear(target.getFullYear() + 1);
        var diff = target - now;
        var ed = document.getElementById('days');
        var eh = document.getElementById('hours');
        var em = document.getElementById('minutes');
        var es = document.getElementById('seconds');
        var ea = document.getElementById('ageNumber');
        if (ed) ed.textContent = String(Math.floor(diff / 864e5)).padStart(3, '0');
        if (eh) eh.textContent = String(Math.floor((diff % 864e5) / 36e5)).padStart(2, '0');
        if (em) em.textContent = String(Math.floor((diff % 36e5) / 6e4)).padStart(2, '0');
        if (es) es.textContent = String(Math.floor((diff % 6e4) / 1e3)).padStart(2, '0');
        if (ea) ea.textContent = now.getFullYear() - 2008;
    };
    update(); setInterval(update, 1000);
}

// ── 4. GALLERY & UPLOAD ─────────────────────────────────────
window.handlePhotoUpload = function (e) {
    try {
        var file = e.target.files[0];
        if (!file) return;
        var reader = new FileReader();
        reader.onload = function (ev) {
            var item = { url: ev.target.result, type: file.type, date: new Date().toLocaleDateString('id-ID') };
            renderMediaCard(item, true);
            var statusText = document.getElementById('statusText');
            if (window.supabase) {
                var supabase = window.supabase;
                var fileName = "feed_" + Date.now() + "_" + file.name;
                supabase.storage.from('photos').upload(fileName, file).then(function (res) {
                    if (res.error) { if (statusText) statusText.textContent = '❌ Cloud Error'; return; }
                    var urlRes = supabase.storage.from('photos').getPublicUrl(fileName);
                    supabase.from('memories').insert([{ url: urlRes.data.publicUrl, type: file.type, date: item.date }]).then(function (dbRes) {
                        if (dbRes.error) { if (statusText) statusText.textContent = '❌ Cloud DB Error'; }
                        else { if (statusText) statusText.textContent = '✅ Kenangan tersimpan!'; }
                    });
                }).catch(function () { if (statusText) statusText.textContent = '❌ Cloud Failure'; });
            }
        };
        reader.readAsDataURL(file);
    } catch (err) { console.error(err); }
};

window.loadSavedMedia = function () {
    try {
        var statusDot = document.getElementById('statusDot');
        var statusText = document.getElementById('statusText');
        var grid = document.getElementById('sharedGalleryGrid');
        if (!window.supabase) return;
        var supabase = window.supabase;

        supabase.from('memories').select('*').order('created_at', { ascending: false }).then(function (res) {
            if (res.error) {
                if (statusText) statusText.textContent = '❌ Error Cloud: ' + res.error.message;
                return;
            }
            if (statusDot) statusDot.classList.add('active');
            if (statusText) statusText.textContent = 'Cloud: Sinkron Berhasil ✨';

            if (grid) grid.innerHTML = '';
            var data = res.data;
            var slotsFound = {};

            for (var i = 0; i < data.length; i++) {
                var item = data[i];
                // Jika ini adalah slot galeri utama (slot_id)
                if (item.slot_id) {
                    if (!slotsFound[item.slot_id]) { // Ambil yang paling baru saja
                        var img = document.getElementById(item.slot_id);
                        if (img) {
                            img.src = item.url;
                            img.classList.remove('hidden');
                            var ph = document.getElementById('ph' + item.slot_id.replace('img', ''));
                            if (ph) ph.style.display = 'none';
                        }
                        slotsFound[item.slot_id] = true;
                    }
                } else {
                    // Masuk ke feed bersama
                    renderMediaCard(item, false);
                }
            }

            if (grid && grid.children.length === 0) {
                grid.innerHTML = '<div class="empty-gallery-msg">Belum ada kenangan di feed. Ayo tambah kenangan kalian! 🌹</div>';
            }
        });
    } catch (e) { }
};

function renderMediaCard(item, isNew) {
    var grid = document.getElementById('sharedGalleryGrid');
    if (!grid) return;
    var div = document.createElement('div');
    div.className = 'shared-photo-card';
    var isVideo = item.type && item.type.indexOf('video/') === 0;
    var mediaHtml = isVideo
        ? '<video src="' + item.url + '" class="shared-photo-img" controls></video>'
        : '<img src="' + item.url + '" class="shared-photo-img" alt="Memori">';
    div.innerHTML = mediaHtml + '<div class="shared-photo-info">Kenangan abadi! 💖<span class="shared-photo-date">' + (item.date || 'Baru saja') + '</span></div>';
    grid.insertBefore(div, grid.firstChild);
}

// ── 5. OTHER PLAIN FUNCTIONS ────────────────────────────────
window.loadPhoto = function (input, imgId) {
    try {
        var f = input.files[0]; if (!f) return;
        var r = new FileReader();
        var statusText = document.getElementById('statusText');

        r.onload = function (e) {
            // Preview lokal langsung
            var img = document.getElementById(imgId);
            if (img) {
                img.src = e.target.result;
                img.classList.remove('hidden');
            }
            var ph = document.getElementById('ph' + imgId.replace('img', ''));
            if (ph) ph.style.display = 'none';

            // Upload ke Cloud sebagai "Eternal Slot"
            if (window.supabase) {
                if (statusText) statusText.textContent = 'Cloud: Mengamankan foto abadi...';
                var supabase = window.supabase;
                var fileName = "slot_" + imgId + "_" + Date.now() + "_" + f.name;

                supabase.storage.from('photos').upload(fileName, f).then(function (res) {
                    if (res.error) return;
                    var urlRes = supabase.storage.from('photos').getPublicUrl(fileName);
                    supabase.from('memories').insert([{
                        url: urlRes.data.publicUrl,
                        type: f.type,
                        slot_id: imgId, // Identifier slot
                        date: new Date().toLocaleDateString('id-ID')
                    }]).then(function (dbRes) {
                        if (!dbRes.error && statusText) statusText.textContent = 'Cloud: Foto slot ' + imgId + ' abadi! ✨';
                    });
                });
            }
        };
        r.readAsDataURL(f);
    } catch (err) { console.error(err); }
}

window.loadVideo = function (i, v, p) {
    var f = i.files[0]; if (!f) return;
    var el = document.getElementById(v); el.src = URL.createObjectURL(f); el.classList.remove('hidden');
    var ph = document.getElementById(p); if (ph) {
        var lb = ph.querySelector('.video-upload-label'); if (lb) lb.style.display = 'none';
    }
}

function initFloatingHearts() {
    var c = document.getElementById('floating-hearts');
    setInterval(function () {
        if (!c || c.children.length > 20) return;
        var e = document.createElement('span'); e.className = 'heart-float';
        var ems = ['❤️', '💖', '🌹', '✨'];
        e.textContent = ems[Math.floor(Math.random() * 4)];
        e.style.left = Math.random() * 100 + 'vw'; e.style.animationDuration = (5 + Math.random() * 5) + 's';
        c.appendChild(e); setTimeout(function () { e.remove(); }, 10000);
    }, 1500);
}

function initParticles() {
    var cv = document.getElementById('particles-canvas'); if (!cv) return;
    var ctx = cv.getContext('2d');
    cv.width = window.innerWidth; cv.height = window.innerHeight;
    var parts = [];
    for (var i = 0; i < 50; i++) parts.push({ x: Math.random() * cv.width, y: Math.random() * cv.height, v: Math.random() * 0.5 + 0.2 });
    var anim = function () {
        ctx.clearRect(0, 0, cv.width, cv.height); ctx.fillStyle = 'white'; ctx.globalAlpha = 0.3;
        for (var j = 0; j < parts.length; j++) {
            var p = parts[j]; p.y -= p.v; if (p.y < 0) p.y = cv.height;
            ctx.beginPath(); ctx.arc(p.x, p.y, 1, 0, 7); ctx.fill();
        }
        requestAnimationFrame(anim);
    };
    anim();
}

function initScrollAnimations() {
    if (typeof IntersectionObserver === 'undefined') return;
    var obs = new IntersectionObserver(function (ents) {
        for (var i = 0; i < ents.length; i++) { if (ents[i].isIntersecting) ents[i].target.classList.add('visible'); }
    }, { threshold: 0.1 });
    var secs = document.querySelectorAll('section');
    for (var j = 0; j < secs.length; j++) { secs[j].classList.add('fade-in-section'); obs.observe(secs[j]); }
}

function initHeroSparkle() {
    var h = document.querySelector('.hero-title'); if (!h) return;
    setInterval(function () { h.style.textShadow = '0 0 ' + (20 + Math.random() * 20) + 'px rgba(233,30,99,0.5)'; }, 1000);
}

// ── 6. SUPABASE CONFIG ──────────────────────────────────────
var SUPABASE_URL = 'https://lasbelwjsatzfaczinks.supabase.co';
var SUPABASE_KEY = 'sb_publishable_f8OCZCVbS31zv1Zhg51vfg_OdwjqsVu';
if (typeof window.supabase !== 'undefined') {
    window.supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
}
