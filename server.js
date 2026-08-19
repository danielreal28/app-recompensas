const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, 'public')));

// Estado inicial del usuario
let userState = {
  id: "DANI123",
  points: 100,
  balance: 0.10
};

// Obtener datos del usuario
app.get('/user/:id', (req, res) => {
  res.json(userState);
});

// Recompensa del video
app.post('/watch-ad', (req, res) => {
  userState.points += 10;
  userState.balance = (userState.points / 1000); // Ejemplo: 1000 pts = $1 USDT

  res.json({
    success: true,
    message: "¡Anuncio completado!",
    points: userState.points,
    balance: userState.balance,
    user: userState
  });
});

// Retiro
app.post('/withdraw', (req, res) => {
  res.json({ success: true, message: "Solicitud de retiro enviada con éxito" });
});

app.get(/(.*)/, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Servidor iniciado en puerto ${PORT}`);
});
