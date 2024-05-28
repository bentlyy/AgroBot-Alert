require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const session = require('express-session');
const bodyParser = require('body-parser');
const sensoresRoutes = require('./routes/sensoresRoutes');
const UnidadesController = require('./controllers/unidadesController');
const SensoresController = require('./controllers/sensoresController');
const authRoutes = require('./routes/authRoutes');
const cors = require('cors');

const app = express();
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

app.use('/api/sensores', sensoresRoutes);

const unidadesController = new UnidadesController();
const sensoresController = new SensoresController();

async function obtenerYGuardarUnidades() {
  try {
    const unidades = await unidadesController.obtenerTodasLasUnidades();
    await unidadesController.guardarUnidadesDeAPI(unidades);
    console.log('Operación completada: unidades obtenidas y guardadas correctamente.');
  } catch (error) {
    console.error('Error:', error);
  }
}
obtenerYGuardarUnidades();

async function obtenerYGuardarSensores() {
  try {
    const sensores = await sensoresController.obtenerTodosLosSensores();
    await sensoresController.guardarSensoresDeApi(sensores);
    console.log('Operación completada: sensores obtenidos y guardados correctamente.');
  } catch (error) {
    console.error('Error:', error);
  }
}
obtenerYGuardarSensores();

app.use('/api/auth', authRoutes);

app.listen(app.get('port'), () => {   
  console.log(`Servidor escuchando en el puerto ${app.get('port')}`);
});
