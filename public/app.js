const API_URL = "https://app-recompensas-3.onrender.com";
const USER_ID = "DANI123";
const USD_PER_POINT = 0.0005;

function logDebug(msg) {
  const box = document.getElementById('debug-log');
  if (box) {
    box.innerHTML += `<br>> ${msg}`;
    box.scrollTop = box.scrollHeight;
  }
  console.log(msg);
}

// Crear la referencia al plugin nativo mediante el puente global de Capacitor
function getUnityAdsPlugin() {
  if (window.Capacitor && typeof window.Capacitor.registerPlugin === 'function') {
    return window.Capacitor.registerPlugin('UnityAdsNative');
  }
  if (window.Capacitor && window.Capacitor.Plugins && window.Capacitor.Plugins.UnityAdsNative) {
    return window.Capacitor.Plugins.UnityAdsNative;
  }
  return null;
}

async function loadUserData() {
  try {
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
  logDebug("Solicitando video nativo de Unity Ads...");

  const UnityNative = getUnityAdsPlugin();

  if (UnityNative) {
    try {
      logDebug("Ejecutando método nativo showRewardVideo...");
      const result = await UnityNative.showRewardVideo({ placementId: "Rewarded_Android" });
      
      if (result && result.completed) {
        logDebug("Anuncio completado con éxito.");
        await claimReward();
      } else {
        logDebug("El anuncio finalizó sin completarse.");
      }
    } catch (e) {
      logDebug(`Error devuelto por Unity: ${e.message || e}`);
      logDebug("Ejecutando respaldo temporizado...");
      runWebSimulatedAd();
    }
  } else {
    logDebug("No se pudo obtener el puente nativo, ejecutando respaldo.");
    runWebSimulatedAd();
  }
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
    const res = await fetch(`${API_URL}/watch-ad`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: USER_ID })
    });
    const data = await res.json();
    if (data.success) {
      updateUI(data.points);
      logDebug("¡Puntos acreditados correctamente!");
    }
  } catch (err) {
    logDebug(`Error al reclamar: ${err.message}`);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  logDebug("Aplicación cargada correctamente.");
  loadUserData();
});
