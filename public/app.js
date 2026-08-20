const API_URL = "https://app-recompensas-3.onrender.com";
const USER_ID = "DANI123";
const USD_PER_POINT = 0.0005;

const UNITY_GAME_ID = "800359230";
const UNITY_PLACEMENT_ID = "Rewarded_Android";

let isUnityReady = false;

async function loadUserData() {
  try {
    const res = await fetch(`${API_URL}/user/${USER_ID}`);
    const data = await res.json();
    if (data.success) updateUI(data.points);
  } catch (err) {
    console.error("Error conectando con el servidor:", err);
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
  return window.unityads || (window.cordova && window.cordova.plugins && window.cordova.plugins.unityads);
}

function initUnityAds() {
  const unity = getUnityPlugin();
  if (unity) {
    // Inicializar el SDK de Unity Ads en cuanto carga la app
    unity.unityAdsInit(UNITY_GAME_ID, false);
    
    // Escuchar cuando el anuncio esté cargado y listo
    unity.unityAdsReady(UNITY_PLACEMENT_ID, function(ready) {
      if (ready) {
        isUnityReady = true;
      }
    });
  }
}

async function startAdVideo() {
  const unity = getUnityPlugin();

  if (unity) {
    showUnityAd(unity);
  } else {
    // Si no es un entorno nativo (ej. navegador web PC), usa la simulación
    runWebSimulatedAd();
  }
}

function showUnityAd(unity) {
  // Intentar mostrar el anuncio
  unity.showUnityAd(UNITY_PLACEMENT_ID, {
    onComplete: function() {
      claimReward();
    },
    onFail: function() {
      alert("No se pudo completar la visualización del anuncio.");
    }
  });
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
