const API_URL = "https://app-recompensas-3.onrender.com";
const USER_ID = "DANI123";
const USD_PER_POINT = 0.0005;
const MIN_WITHDRAWAL_USD = 5.00;

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

async function watchAd() {
  const btn = document.getElementById('btn-watch-ad');
  if (btn) {
    btn.disabled = true;
    btn.innerText = "Cargando anuncio...";
  }

  setTimeout(async () => {
    try {
      const res = await fetch(`${API_URL}/watch-ad`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: USER_ID })
      });
      const data = await res.json();
      if (data.success) {
        const updatedPoints = data.newPoints !== undefined ? data.newPoints : data.points;
        updateUI(updatedPoints);
        alert("¡Anuncio completado! +10 puntos acreditados.");
      } else {
        alert(data.message || "Error al acreditar puntos");
      }
    } catch (err) {
      console.error("Error al procesar recompensa:", err);
      alert("Error al conectar con el servidor.");
    } finally {
      if (btn) {
        btn.disabled = false;
        btn.innerText = "Ver Video (+10 pts)";
      }
    }
  }, 2000);
}

function copyRefCode() {
  const elemCode = document.getElementById('ref-code');
  if (!elemCode) return;
  const code = elemCode.innerText;
  navigator.clipboard.writeText(`https://tuapp.com/signup?ref=${code}`);
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
      const remaining = data.remainingPoints !== undefined ? data.remainingPoints : data.points;
      alert(`Solicitud enviada con éxito!`);
      if (remaining !== undefined) updateUI(remaining);
    } else {
      alert(data.message || "Error al procesar el retiro.");
    }
  } catch (err) {
    console.error("Error en retiro:", err);
    alert("Error procesando el retiro.");
  }
}

// Cargar datos del usuario al cargar la interfaz
document.addEventListener('DOMContentLoaded', loadUserData);
