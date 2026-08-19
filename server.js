const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, 'public')));

// Ruta de usuario
app.get('/user/:id', (req, res) => {
  res.json({ id: req.params.id, points: 100, balance: 0.10 });
});

// Ruta del anuncio
app.post('/watch-ad', (req, res) => {
  res.json({ success: true, message: "¡Anuncio completado!", pointsGained: 50 });
});

// Ruta de retiro
app.post('/withdraw', (req, res) => {
  res.json({ success: true, message: "Solicitud de retiro enviada con éxito" });
});

// Redirección frontend
app.get(/(.*)/, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Servidor iniciado en puerto ${PORT}`);
});
