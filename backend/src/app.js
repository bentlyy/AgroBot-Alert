require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const express = require('express');
const morgan = require('morgan');
const session = require('express-session');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes');
const recuperacionRoutes = require('./routes/recuperacionContrasenaRoutes');
const alertasRoutes = require('./routes/alertasRoutes');
const camposRoutes = require('./routes/camposRoutes');
const criteriosRoutes = require('./routes/criteriosRoutes');
const mapRoutes = require('./routes/mapRoutes');
const medicionesRoutes = require('./routes/medicionesRoutes');
const sensoresRoutes = require('./routes/sensoresRoutes');
const unidadesRoutes = require('./routes/unidadesRoutes');
const usuariosRoutes = require('./routes/usuariosRoutes');

const UnidadesController = require('./controllers/unidadesController');
const SensoresController = require('./controllers/sensoresController');
const UnidadesModel = require('./models/unidadesModel');
const SensoresModel = require('./models/sensorModel');
const pool = require('./utils/dbConnection');
const wialon = require('./utils/wialonService');

const app = express();

app.use(cors());
app.set('port', process.env.PORT || 3000);
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(session({
  secret: process.env.JWT_SECRET || 'secret',
  resave: true,
  saveUninitialized: true
}));

app.use('/api/auth', authRoutes);
app.use('/api/auth', recuperacionRoutes);
app.use('/api/alertas', alertasRoutes);
app.use('/api/campos', camposRoutes);
app.use('/api/criterios', criteriosRoutes);
app.use('/api/mapa', mapRoutes);
app.use('/api/mediciones', medicionesRoutes);
app.use('/api/sensores', sensoresRoutes);
app.use('/api/unidades', unidadesRoutes);
app.use('/api/usuarios', usuariosRoutes);

const unidadesModel = new UnidadesModel(pool);
const sensoresModel = new SensoresModel(pool);

async function seedearDesdeWialon() {
  try {
    const unidadesExistentes = await unidadesModel.obtenerUnidades();
    if (unidadesExistentes.length > 0) {
      console.log(`BD ya tiene ${unidadesExistentes.length} unidades. Omitiendo seed desde API.`);
      return;
    }

    console.log('Obteniendo unidades desde Wialon...');
    const session = await wialon.login();
    const units = await wialon.searchUnits(session.eid);

    for (const unit of units) {
      await unidadesModel.guardarUnidad({
        id_unidad: unit.id,
        nombre: unit.nm || unit.name,
        id_usuario: null,
      });

      console.log(`Cargando sensores para unidad ${unit.id}...`);
      const messages = await wialon.loadMessages(unit.id);
      for (const msg of messages) {
        await sensoresModel.guardarSensor({
          id_unidad: unit.id,
          temperatura_s1: msg.Parameters.Temperature_S1,
          temperatura_s2: msg.Parameters.Temperature_S2,
          humedad_s1: msg.Parameters.Humidity_S1,
          humedad_s2: msg.Parameters.Humidity_S2,
          electroconductividad_s1: msg.Parameters.Electroconductivity_S1,
          electroconductividad_s2: msg.Parameters.Electroconductivity_S2,
          gps_energia: msg.Parameters.GPS_Energy,
          energia_externa: msg.Parameters.External_Energy,
        });
      }
    }
    console.log('Seed desde Wialon completado.');
  } catch (error) {
    console.error('Error en seed desde Wialon:', error.message);
    console.log('El sistema arrancará igual. Usa npm run seed si tienes BD.');
  }
}

pool.ready.then(seedearDesdeWialon);

app.listen(app.get('port'), () => {
  console.log(`Servidor escuchando en el puerto ${app.get('port')}`);
});

module.exports = app;
