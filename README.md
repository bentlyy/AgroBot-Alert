# AgroBot-Alert

**AgroBot-Alert** es un sistema web diseñado para la obtención, almacenamiento, análisis y notificación de datos provenientes del servicio **Wialon**. Su propósito principal es facilitar la toma de decisiones en entornos agrícolas mediante la automatización de alertas basadas en sensores instalados en unidades de monitoreo, como estaciones estáticas o tractores en movimiento.

## Objetivo del Proyecto

Desarrollar un sistema de software que permita obtener datos desde Wialon, almacenarlos, analizarlos mediante criterios definidos, y notificar de forma automática a los usuarios, minimizando la necesidad de interacción constante con la plataforma.

## Problema Detectado

Aunque la plataforma permite visualizar información detallada sobre unidades agrícolas (estaciones y tractores), el uso constante requería que los agricultores revisaran manualmente la web. Esto generaba ineficiencias, retrasos y dependencias de terceros para interpretar los datos y tomar decisiones.

## Solución Propuesta

AgroBot-Alert automatiza el proceso de análisis de datos y envía alertas relevantes a los agricultores vía **WhatsApp**, basándose en criterios preestablecidos.

- Elimina la necesidad de ingresar frecuentemente al sistema
- Permite a los agricultores recibir solo la información crítica
- Utiliza un canal de comunicación universal (WhatsApp)
- Mejora la eficiencia y reacción ante eventos detectados por sensores

## Tecnologías Utilizadas

### Backend
- **Node.js** con **Express**
- **MySQL** con **mysql2**
- **JWT** para autenticación
- **Wialon API** (telemática)
- **SendPulse / SendGrid** (notificaciones)

### Frontend
- **React 18** con **Vite**
- **React Router DOM v6**
- **SCSS**
- **Axios**

## Estructura del Proyecto

```
AgroBot-Alert/
├── backend/               # API REST (Express)
│   ├── src/
│   │   ├── app.js         # Punto de entrada
│   │   ├── controllers/   # Lógica de negocio
│   │   ├── models/        # Modelos de datos
│   │   ├── routes/        # Definición de rutas
│   │   └── utils/         # Utilidades (DB, email, Wialon API)
│   └── package.json
├── frontend/              # SPA (React + Vite)
│   └── src/
│       ├── Components/    # Componentes React
│       ├── Assets/        # Recursos estáticos
│       └── App.jsx        # Componente raíz
├── .env.example           # Variables de entorno (ejemplo)
├── package.json           # Orquestador (monorepo)
└── README.md
```

## Base de Datos

### Opción 1: MySQL (recomendado)

El proyecto usa MySQL. Para crear la base de datos y poblarla con datos de ejemplo:

```bash
# 1. Crear las tablas
mysql -u root -p < database/schema.sql

# 2. Poblar con datos de ejemplo
npm run seed
```

Esto creará:
- **8 tablas**: usuarios, users, unidades, sensores, mediciones, criterios, alertas, campos
- **Usuarios de prueba**:
  - Admin: `admin@agrobot.com` / `admin123`
  - Demo: `demo@agrobot.com` / `admin123`
- **5 unidades de monitoreo** con sensores y mediciones
- **5 criterios** y **3 alertas** de ejemplo

### Esquema de tablas

| Tabla | Descripción |
|-------|-------------|
| `usuarios` | Usuarios del sistema (login, roles) |
| `users` | Recuperación de contraseñas (tabla separada) |
| `unidades` | Unidades de monitoreo (estaciones, tractores) |
| `sensores` | Sensores asociados a cada unidad |
| `mediciones` | Mediciones históricas de los sensores |
| `criterios` | Reglas para generación de alertas |
| `alertas` | Alertas generadas automáticamente |
| `campos` | Campos agrícolas registrados |

## Modo Desarrollo sin Wialon

Si perdiste el token de la API de Wialon, activa el **mock**:

```bash
# En backend/.env:
USE_MOCK_API=true
```

Esto genera datos simulados realistas para poder desarrollar y probar sin conexión a Wialon.

## Instalación

```bash
# 1. Instalar todas las dependencias
npm run install:all

# 2. Configurar variables de entorno
cp .env.example backend/.env
# Editar backend/.env con tus credenciales

# 3. Crear la base de datos
mysql -u root -p < database/schema.sql

# 4. Poblar con datos de ejemplo
npm run seed

# 5. Iniciar en modo desarrollo
npm run dev
```

## Scripts Disponibles

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Inicia frontend y backend simultáneamente |
| `npm run dev:backend` | Solo backend (puerto 3000) |
| `npm run dev:frontend` | Solo frontend (puerto 5173) |
| `npm run build` | Build de producción del frontend |
| `npm start` | Inicia solo el backend en producción |
| `npm run seed` | Puebla la BD con datos de ejemplo |
| `npm run schema` | Muestra comando para crear tablas |

## Licencia

MIT
