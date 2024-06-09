require('dotenv').config(); // Asegúrate de que esto esté al inicio del archivo

const express = require('express');
const morgan = require('morgan');
const session = require('express-session');
const bodyParser = require('body-parser');
const cors = require('cors');
const unidadesRoutes = require('./routes/unidadesRoutes');
const sensoresRoutes = require('./routes/sensoresRoutes');
const recuperacionContraseñaRoutes = require('./routes/recuperacionContraseñaRoutes');
const authRoutes = require('./routes/authRoutes');
const mapRoutes = require('./routes/mapRoutes');
const alertasRoutes = require('./routes/alertasRoutes');
const UnidadesController = require('./controllers/unidadesController');
const SensoresController = require('./controllers/sensoresController');

const app = express(); // Inicializa Express

app.use(cors());
app.set('port', process.env.PORT || 3000);
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true
}));

// Define tus rutas
app.use('/api/units', unidadesRoutes);
app.use('/api/sensores', sensoresRoutes);
app.use('/api/auth', recuperacionContraseñaRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/map', mapRoutes);
app.use('/api/alertas', alertasRoutes);

// Crea instancias de tus controladores
const unidadesController = new UnidadesController();
const sensoresController = new SensoresController();

// Define tus funciones asincrónicas para obtener y guardar unidades y sensores
async function obtenerYGuardarUnidades() {
  try {
    const unidades = await unidadesController.obtenerTodasLasUnidades();
    await unidadesController.guardarUnidadesDeAPI(unidades);
    console.log('Operación completada: unidades obtenidas y guardadas correctamente.');
  } catch (error) {
    console.error('Error:', error);
  }
}

async function obtenerYGuardarSensores() {
  try {
    const sensores = await sensoresController.obtenerTodosLosSensores();
    await sensoresController.guardarSensoresDeApi(sensores);
    console.log('Operación completada: sensores obtenidos y guardados correctamente.');
  } catch (error) {
    console.error('Error:', error);
  }
}

// Ejecuta tus funciones asincrónicas
obtenerYGuardarUnidades();
//obtenerYGuardarSensores();

// Inicia el servidor
app.listen(app.get('port'), () => {   
  console.log(`Servidor escuchando en el puerto ${app.get('port')}`);
});

// Exporta app para ser utilizado en otros archivos si es necesario
module.exports = app;
