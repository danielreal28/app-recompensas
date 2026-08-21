const API_URL = "https://app-recompensas-3.onrender.com";
const USER_ID = "DANI123";
const USD_PER_POINT = 0.0005;

function logDebug(msg) {
  const box = document.getElementById('debug-log');
  if (box) {
    box.innerHTML += `<br>> ${msg}`;
    box.scrollTop = box.scrollHeight;
  }
}

window.onerror = function(msg, url, line) {
  logDebug(`ERROR: ${msg} (línea ${line})`);
};

async function loadUserData() {
  try {
    logDebug("Cargando datos de usuario...");
    const res = await fetch(`${API_URL}/user/${USER_ID}`);
    const data = await res.json();
    if (data.success) updateUI(data.points);
  } catch (err) {
    logDebug(`Error servidor: ${err.message}`);
  }
}

function updateUI(points) {
  if (points === undefined || points === null) return;
  const currentUSD = (points * USD_PER_POINT).toFixed(2);
  
  const elemPoints = document.getElementById('user-points');
  const elemUsd = document.getElementById('user-usd');
  
  if (elemPoints) elemPoints.innerText = points;
  if (elemUsd) elemUsd.innerText = `≈ $${currentUSD} USDT`;
}

async function startAdVideo() {
  logDebug("Iniciando solicitud de video...");
  
  // Detectar si existen plugins cargados
  if (window.Capacitor && window.Capacitor.Plugins) {
    logDebug(`Plugins disponibles: ${Object.keys(window.Capacitor.Plugins).join(', ')}`);
  } else {
    logDebug("Capacitor Plugins no detectados en WebView.");
  }

  runWebSimulatedAd();
}

function runWebSimulatedAd() {
  const modal = document.getElementById('ad-modal');
  const timerBox = document.getElementById('video-timer');
  const btn = document.getElementById('btn-watch-ad');
  
  if (btn) btn.disabled = true;
  if (modal) modal.style.display = 'flex';
  let timeLeft = 15;

  if (timerBox) timerBox.innerText = `⏱️ ${timeLeft}s`;

  const countdown = setInterval(async () => {
    timeLeft--;
    if (timerBox) timerBox.innerText = `⏱️ ${timeLeft}s`;

    if (timeLeft <= 0) {
      clearInterval(countdown);
      if (modal) modal.style.display = 'none';
      if (btn) btn.disabled = false;
      await claimReward();
    }
  }, 1000);
}

async function claimReward() {
  try {
    logDebug("Enviando reclamo de recompensa...");
    const res = await fetch(`${API_URL}/watch-ad`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: USER_ID })
    });
    const data = await res.json();
    if (data.success) {
      updateUI(data.points);
      logDebug("Recompensa acreditada +10 pts");
    }
  } catch (err) {
    logDebug(`Error al reclamar: ${err.message}`);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  logDebug("App iniciada.");
  loadUserData();
});
