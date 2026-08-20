const API_URL = "https://app-recompensas-3.onrender.com";
const USER_ID = "DANI123";
const USD_PER_POINT = 0.0005;

const UNITY_GAME_ID = "800359230";
const UNITY_PLACEMENT_ID = "Rewarded_Android";

function logDebug(msg) {
  console.log(msg);
  const logDiv = document.getElementById('debug-log');
  if (logDiv) {
    logDiv.innerHTML += "<br>> " + msg;
    logDiv.scrollTop = logDiv.scrollHeight;
  }
}

async function loadUserData() {
  try {
    const res = await fetch(`${API_URL}/user/${USER_ID}`);
    const data = await res.json();
    if (data.success) updateUI(data.points);
  } catch (err) {
    logDebug("Error API: " + err.message);
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

function getUnityPlugin() {
  if (window.unityads) return window.unityads;
  if (window.cordova && window.cordova.plugins && window.cordova.plugins.unityads) {
    return window.cordova.plugins.unityads;
  }
  return null;
}

function initUnityAds() {
  logDebug("Evento deviceready detectado.");
  const unity = getUnityPlugin();
  
  if (unity) {
    logDebug("Inicializando SDK Game ID: " + UNITY_GAME_ID);
    // Inicializar en modo prueba para forzar descarga del anuncio
    unity.unityAdsInit(UNITY_GAME_ID, true);
  } else {
    logDebug("Plugin no detectado.");
  }
}

async function startAdVideo() {
  logDebug("Boton Ver Video presionado.");
  const unity = getUnityPlugin();

  if (unity) {
    logDebug("Llamando showUnityAd directamente...");
    
    // Forzar la re-inicializacion en caso de perdida de contexto
    unity.unityAdsInit(UNITY_GAME_ID, true);

    unity.showUnityAd(UNITY_PLACEMENT_ID, {
      onComplete: function() {
        logDebug("Anuncio completado.");
        claimReward();
      },
      onFail: function() {
        logDebug("Fallo la reproduccion.");
        alert("El anuncio no esta listo todavia. Reintenta en 3 segundos.");
      }
    });
  } else {
    logDebug("Ejecutando simulador web.");
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
      alert("¡Anuncio completado! +10 puntos acreditados.");
    }
  } catch (err) {
    alert("Error al conectar con el servidor.");
  }
}

document.addEventListener('DOMContentLoaded', loadUserData);
document.addEventListener('deviceready', initUnityAds, false);
