const starCanvas = document.getElementById('starfield');
const galaxyCanvas = document.getElementById('galaxy-spiral');
const ctxS = starCanvas.getContext('2d');
const ctxG = galaxyCanvas.getContext('2d');
const minion = document.getElementById('minion-toy');
const pupil = document.querySelector('.pupil');

let currentStage = 0;
let idleTimer;
let roamInterval;

function init() {
    starCanvas.width = galaxyCanvas.width = window.innerWidth;
    starCanvas.height = galaxyCanvas.height = window.innerHeight;
    drawStars();
    drawGalaxy();
    startRoaming();
}

function drawStars() {
    for (let i = 0; i < 3000; i++) {
        ctxS.fillStyle = `rgba(255, 255, 255, ${Math.random()})`;
        ctxS.beginPath();
        ctxS.arc(Math.random() * starCanvas.width, Math.random() * starCanvas.height, Math.random() * 1.5, 0, Math.PI * 2);
        ctxS.fill();
    }
}

function drawGalaxy() {
    const cx = galaxyCanvas.width / 2;
    const cy = galaxyCanvas.height / 2;
    for (let j = 0; j < 5; j++) {
        for (let i = 0; i < 500; i++) {
            const angle = 0.1 * i;
            const dist = 0.7 * i * 2;
            const x = cx + dist * Math.cos(angle + (j * Math.PI * 2 / 5));
            const y = cy + dist * Math.sin(angle + (j * Math.PI * 2 / 5));
            ctxG.fillStyle = `hsla(${200 + i/2}, 70%, 80%, ${1 - i/500})`;
            ctxG.beginPath();
            ctxG.arc(x + Math.random()*20, y + Math.random()*20, Math.random()*2, 0, Math.PI * 2);
            ctxG.fill();
        }
    }
}

// RANDOM ROAMING: Moves minion every 4 seconds
function startRoaming() {
    roamInterval = setInterval(() => {
        // Only roam if cards aren't open
        if (!document.getElementById('cards-fan').classList.contains('active')) {
            const randomX = Math.random() * (window.innerWidth - 100) + 50;
            const randomY = Math.random() * (window.innerHeight - 150) + 75;
            minion.style.left = `${randomX}px`;
            minion.style.top = `${randomY}px`;
        }
    }, 4000);
}

// MOUSE INTERACTION: Eye tracking + 3s Follow
window.addEventListener('mousemove', (e) => {
    clearTimeout(idleTimer);
    
    // Pupil calculation
    const rect = minion.getBoundingClientRect();
    const minionX = rect.left + rect.width / 2;
    const minionY = rect.top + rect.height / 2;
    const angle = Math.atan2(e.clientY - minionY, e.clientX - minionX);
    const distance = 6; 
    pupil.style.transform = `translate(${Math.cos(angle) * distance}px, ${Math.sin(angle) * distance}px)`;

    // Follow logic: Move to mouse after 3s of stillness
    idleTimer = setTimeout(() => {
        if (!document.getElementById('cards-fan').classList.contains('active')) {
            minion.style.left = `${e.clientX}px`;
            minion.style.top = `${e.clientY}px`;
        }
    }, 3000);
});

// ZOOM SYSTEM
document.getElementById('main-viewport').addEventListener('click', (e) => {
    if (e.target.closest('#minion-toy')) return;
    currentStage = (currentStage + 1) % 3;
    updateZoom();
});

function updateZoom() {
    const star = document.getElementById('starfield');
    const gal = document.getElementById('galaxy-container');
    const sol = document.getElementById('solar-system');
    const label = document.getElementById('stage-label');

    if (currentStage === 0) {
        star.style.transform = "scale(1)"; gal.style.opacity = "0"; sol.style.opacity = "0";
        label.innerText = "Deep Space";
    } else if (currentStage === 1) {
        star.style.transform = "scale(3)"; gal.style.opacity = "1"; gal.style.transform = "scale(1)";
        label.innerText = "Andromeda Galaxy";
    } else if (currentStage === 2) {
        gal.style.transform = "scale(5)"; gal.style.opacity = "0"; sol.style.opacity = "1";
        label.innerText = "Solar System";
    }
}

// MINION CLICK: Toggle Menu
minion.addEventListener('click', (e) => {
    e.stopPropagation();
    document.getElementById('cards-fan').classList.toggle('active');
});

window.addEventListener('resize', init);
init();