const API_URL = "https://app-recompensas-1.onrender.com";
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
  const currentUSD = (points * USD_PER_POINT).toFixed(2);
  document.getElementById('user-points').innerText = points;
  document.getElementById('user-usd').innerText = `≈ $${currentUSD} USDT`;
}

async function watchAd() {
  const btn = document.getElementById('btn-watch-ad');
  btn.disabled = true;
  btn.innerText = "Cargando anuncio...";

  setTimeout(async () => {
    try {
      const res = await fetch(`${API_URL}/watch-ad`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: USER_ID })
      });
      const data = await res.json();
      if (data.success) {
        updateUI(data.newPoints);
        alert("¡Anuncio completado! +10 puntos acreditados.");
      }
    } catch (err) {
      alert("Error al conectar con el servidor.");
    } finally {
      btn.disabled = false;
      btn.innerText = "Ver Video (+10 pts)";
    }
  }, 2000);
}

function copyRefCode() {
  const code = document.getElementById('ref-code').innerText;
  navigator.clipboard.writeText(`https://tuapp.com/signup?ref=${code}`);
  alert("¡Enlace copiado!");
}

async function requestWithdrawal() {
  const binanceId = document.getElementById('binance-id').value.trim();
  if (!binanceId) return alert("Ingresa tu Binance Pay ID o correo.");

  try {
    const res = await fetch(`${API_URL}/withdraw`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: USER_ID, binanceId, amountUSD: 5.00 })
    });
    const data = await res.json();
    if (data.success) {
      alert(`¡Solicitud ${data.withdrawal.id} enviada con éxito!`);
      updateUI(data.remainingPoints);
    } else {
      alert(data.message);
    }
  } catch (err) {
    alert("Error procesando el retiro.");
  }
}

loadUserData();
