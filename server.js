require('dotenv').config();
const app = require('./src/app');

const PORT = process.env.PORT || 3004;

app.listen(PORT, () => {
  console.log(`El servicio de reportes está corriendo en el puerto ${PORT}`);
});