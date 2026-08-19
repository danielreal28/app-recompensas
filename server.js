const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, 'public')));

// Estado inicial del usuario
let userData = {
  id: "DANI123",
  points: 100,
  balance: 0.10
};

// Obtener datos del usuario
app.get('/user/:id', (req, res) => {
  res.json({
    success: true,
    points: userData.points,
    pts: userData.points,
    puntos: userData.points,
    balance: userData.balance,
    usdt: userData.balance,
    user: {
      ...userData,
      pts: userData.points,
      puntos: userData.points,
      usdt: userData.balance
    }
  });
});

// Recompensa al ver el video (+10 puntos)
app.post('/watch-ad', (req, res) => {
  userData.points += 10;
  userData.balance = (userData.points / 1000); // 1000 pts = $1.00 USDT

  res.json({
    success: true,
    message: "¡Anuncio completado!",
    points: userData.points,
    pts: userData.points,
    puntos: userData.points,
    balance: userData.balance,
    usdt: userData.balance,
    user: {
      ...userData,
      pts: userData.points,
      puntos: userData.points,
      usdt: userData.balance
    }
  });
});

// Solicitud de retiro
app.post('/withdraw', (req, res) => {
  res.json({ success: true, message: "Solicitud de retiro enviada con éxito" });
});

// Enrutado genérico
app.get(/(.*)/, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Servidor iniciado en puerto ${PORT}`);
});
