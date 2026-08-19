const API_URL = "https://app-recompensas-3.onrender.com";
const USER_ID = "DANI123";
const USD_PER_POINT = 0.0005;

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
  document.getElementById('user-points').innerText = points;
  document.getElementById('user-usd').innerText = `≈ $${currentUSD} USDT`;
}

function startAdVideo() {
  const modal = document.getElementById('ad-modal');
  const timerBox = document.getElementById('video-timer');
  const btn = document.getElementById('btn-watch-ad');
  
  btn.disabled = true;
  modal.style.display = 'flex';
  let timeLeft = 15;

  timerBox.innerText = `⏱️ ${timeLeft}s`;

  const countdown = setInterval(async () => {
    timeLeft--;
    timerBox.innerText = `⏱️ ${timeLeft}s`;

    if (timeLeft <= 0) {
      clearInterval(countdown);
      modal.style.display = 'none';
      btn.disabled = false;
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
      alert("¡Anuncio completado! Se han acreditado +10 puntos.");
    }
  } catch (err) {
    alert("Error al conectar con el servidor para acreditar la recompensa.");
  }
}

document.addEventListener('DOMContentLoaded', loadUserData);
