require('dotenv').config();
const app = require('./src/app');
const PORT = process.env.PORT || 8080;

console.log('MONGODB_URI:', process.env.MONGODB_URI ? 'definida ✅' : 'undefined ❌');

app.listen(PORT, () => {
  console.log(`El servicio de reportes esta corriendo en el puerto ${PORT}`);
});