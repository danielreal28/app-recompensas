const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, 'public')));

// 1. Datos del usuario
app.get('/user/:id', (req, res) => {
  res.json({
    id: req.params.id,
    points: 100,
    balance: 0.10
  });
});

// 2. Recompensa por ver anuncio
app.post('/watch-ad', (req, res) => {
  res.json({
    success: true,
    message: "¡Anuncio completado!",
    pointsGained: 50
  });
});

// 3. Solicitud de retiro
app.post('/withdraw', (req, res) => {
  res.json({
    success: true,
    message: "Solicitud de retiro enviada con éxito"
  });
});

// Redirección para el resto de rutas estáticas
app.get(/(.*)/, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Servidor activo en el puerto ${PORT}`);
});
