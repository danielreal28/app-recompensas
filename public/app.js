const API_URL = "https://app-recompensas-3.onrender.com";
const USER_ID = "DANI123";
const USD_PER_POINT = 0.0005;

// Credenciales de Unity Ads
const UNITY_GAME_ID = "800359230";
const UNITY_PLACEMENT_ID = "Rewarded_Android";

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

async function startAdVideo() {
  const isCapacitor = window.Capacitor && window.Capacitor.isNativePlatform();

  if (isCapacitor && window.unityads) {
    showUnityAd();
  } else {
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

function showUnityAd() {
  const unity = window.unityads;

  unity.unityAdsReady(UNITY_PLACEMENT_ID, function(ready) {
    if (ready) {
      unity.showUnityAd(UNITY_PLACEMENT_ID, {
        onComplete: function() {
          claimReward();
        },
        onFail: function() {
          alert("No se pudo reproducir el video completo.");
        }
      });
    } else {
      alert("El anuncio aún se está cargando. Inténtalo de nuevo en unos segundos.");
    }
  });
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

function copyRefCode() {
  const elemCode = document.getElementById('ref-code');
  if (!elemCode) return;
  navigator.clipboard.writeText(`https://tuapp.com/signup?ref=${elemCode.innerText}`);
  alert("¡Enlace copiado!");
}

async function requestWithdrawal() {
  const inputBinance = document.getElementById('binance-id');
  if (!inputBinance) return;
  const binanceId = inputBinance.value.trim();
  if (!binanceId) return alert("Ingresa tu Binance Pay ID o correo.");

  try {
    const res = await fetch(`${API_URL}/withdraw`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: USER_ID, binanceId, amountUSD: 5.00 })
    });
    const data = await res.json();
    if (data.success) {
      alert("¡Solicitud enviada con éxito!");
    } else {
      alert(data.message || "Error al procesar el retiro.");
    }
  } catch (err) {
    alert("Error procesando el retiro.");
  }
}

document.addEventListener('DOMContentLoaded', () => {
  loadUserData();
  if (window.Capacitor && window.Capacitor.isNativePlatform() && window.unityads) {
    window.unityads.unityAdsInit(UNITY_GAME_ID, false);
  }
});
