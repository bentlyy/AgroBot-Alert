<div align="center">
  <img src="frontend/src/Assets/logo.png" alt="AgroBot Alert Logo" width="120"/>
  <h1>AgroBot Alert</h1>
  <p><strong>Sistema inteligente de monitoreo agrícola y alertas automatizadas</strong></p>
  <p>
    <img src="https://img.shields.io/badge/Node.js-18.x-339933?logo=node.js&logoColor=white" alt="Node.js"/>
    <img src="https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white" alt="React"/>
    <img src="https://img.shields.io/badge/Express-4.21-000000?logo=express&logoColor=white" alt="Express"/>
    <img src="https://img.shields.io/badge/MySQL-8.0-4479A1?logo=mysql&logoColor=white" alt="MySQL"/>
    <img src="https://img.shields.io/badge/Docker-2496ED?logo=docker&logoColor=white" alt="Docker"/>
    <img src="https://img.shields.io/badge/Vite-5-646CFF?logo=vite&logoColor=white" alt="Vite"/>
    <img src="https://img.shields.io/badge/Leaflet-1.9-199900?logo=leaflet&logoColor=white" alt="Leaflet"/>
    <img src="https://img.shields.io/badge/Recharts-3.8-22B5BF?logo=recharts&logoColor=white" alt="Recharts"/>
    <img src="https://img.shields.io/badge/Framer_Motion-12-0055FF?logo=framer&logoColor=white" alt="Framer Motion"/>
    <img src="https://img.shields.io/badge/license-MIT-yellow" alt="License"/>
  </p>
  <br/>
</div>

---

## Tabla de Contenidos

- [Descripción General](#descripción-general)
- [Características](#características)
- [Arquitectura](#arquitectura)
- [Tecnologías](#tecnologías)
- [Capturas de Pantalla](#capturas-de-pantalla)
- [Inicio Rápido](#inicio-rápido)
- [API REST](#api-rest)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Flujo de Alertas](#flujo-de-alertas)
- [Desarrollo Local](#desarrollo-local)
- [Roadmap](#roadmap)

---

## Descripción General

**AgroBot Alert** es un sistema full-stack para el monitoreo en tiempo real de unidades agrícolas (estaciones meteorológicas, tractores, sensores de campo) conectadas a la plataforma **Wialon**. El sistema obtiene datos de sensores, los almacena, los evalúa contra criterios configurables y genera alertas automáticas cuando se detectan condiciones anómalas.

Este proyecto resuelve un problema real: los agricultores no pueden estar revisando dashboards constantemente. AgroBot Alert automatiza la vigilancia y notifica solo cuando algo requiere atención.

### Stack

| Capa | Tecnología |
|------|-----------|
| Frontend | React 18 + Vite + SCSS |
| Backend | Node.js + Express 4 |
| Base de Datos | MySQL 8 (Docker) |
| Mapas | Leaflet + OpenStreetMap |
| Gráficos | Recharts |
| Animaciones | Framer Motion |
| Contenedores | Docker Compose |
| API Externa | Wialon (con mock para desarrollo) |

---

## Características

- **Dashboard en tiempo real** con estadísticas, mapa de sensores, gráficos de temperatura/humedad y panel de alertas
- **Motor de alertas automático** que evalúa datos de sensores contra criterios configurables cada 60 segundos
- **Prevención de duplicados** — no genera la misma alerta repetidamente (ventana de 15 min)
- **Mock API** — modo desarrollo con datos simulados realistas sin conexión a Wialon
- **Mapa interactivo** con marcadores Leaflet mostrando ubicación de cada unidad
- **Gráficos históricos** de temperatura y humedad con Recharts
- **Autenticación** — registro, login y recuperación de contraseña
- **Notificaciones multicanal** — alertas por email (Nodemailer) y WhatsApp (Twilio) al usuario propietario
- **Vista por roles** — admin ve todas las alertas con quién está asignado; usuario ve solo las suyas
- **Arquitectura modular** con controladores, modelos y rutas separados
- **Totalmente dockerizado** — despliegue con un solo comando

---

## Arquitectura

```
┌──────────────────────────────────────────────────────────┐
│                    Docker Compose                        │
│                                                          │
│  ┌──────────┐    ┌──────────┐    ┌──────────────────┐   │
│  │  MySQL 8  │◄───│ Backend  │◄───│    Frontend      │   │
│  │  :3306   │    │ :3000    │    │  :5173 (nginx)   │   │
│  └──────────┘    └────┬─────┘    └──────────────────┘   │
│                        │                                 │
│                 ┌──────┴──────┐                          │
│                 │  Wialon API │                          │
│                 │  (o Mock)   │                          │
│                 └─────────────┘                          │
└──────────────────────────────────────────────────────────┘

Flujo interno del backend:

  Wialon/Mock ──► seedearDesdeWialon() ──► DB (unidades + sensores)
                                    │
                                    ▼
                         alertEngine.js (cada 60s)
                                    │
                        ┌───────────┴───────────┐
                        ▼                       ▼
                 refrescarDatos()       evaluarAlertas()
                        │                       │
                        ▼                       ▼
                 INSERT sensores     comparar contra criterios
                                             │
                                       si umbral excedido
                                             │
                                       INSERT alertas
                                             │
                                notificacionService.js
                                             │
                           ┌─────────────────┼─────────────────┐
                           ▼                 ▼                  ▼
                    Email (Gmail)     WhatsApp (Twilio)   GET /api/alertas
                           │                 │                  │
                           ▼                 ▼                  ▼
                    ALERT_EMAIL_TO    número destino      AlertsPanel
```

### Motor de Alertas (`alertEngine.js`)

El motor se ejecuta en un bucle cada 60 segundos:

1. **Refresca datos** — obtiene la última lectura de cada unidad desde Wialon y la guarda como nuevo registro en `sensores`
2. **Evalúa criterios** — para cada sensor, compara sus campos contra todos los criterios configurados en `criterios`
3. **Mapeo inteligente** — asocia automáticamente cada criterio a los campos del sensor según su nombre:
   - *Temperatura* → `temperatura_s1`, `temperatura_s2`
   - *Humedad* → `humedad_s1`, `humedad_s2`
   - *Batería* → `gps_energia`, `energia_externa`
4. **Filtra duplicados** — no crea una alerta si ya existe otra del mismo tipo para la misma unidad en los últimos 15 minutos
5. **Registra alerta** — inserta en `alertas` con mensaje descriptivo, tipo (crítico/advertencia) y referencias a unidad y criterio

### Sistema de Notificaciones (`notificacionService.js`)

Cuando el motor crea una alerta, **identifica al usuario propietario** de la unidad (campo `id_usuario` en la tabla `unidades`), y envía las notificaciones directamente a los datos de contacto de ese usuario:

| Canal | Tecnología | Destino |
|-------|-----------|---------|
| **Email** | Nodemailer (Gmail) | Email del usuario registrado |
| **WhatsApp** | Twilio API | Teléfono del usuario registrado |

### Administrador vs Usuario

| Rol | Unidades | Alertas visibles | Notificaciones |
|-----|----------|-----------------|----------------|
| **admin** | Ninguna asignada | Todas (ve todas las alertas + usuario asignado) | No recibe (sin teléfono/email propio) |
| **usuario** | Sus unidades asignadas | Solo las de sus unidades | Recibe en su email y WhatsApp |

Ambos canales son **opcionales**: si el usuario no tiene email o teléfono configurado, el sistema omite el envío sin errores.

---

## Tecnologías

### Frontend
| Librería | Propósito |
|----------|-----------|
| React 18 | UI declarativa basada en componentes |
| Vite 5 | Build tool ultrarrápido con HMR |
| Framer Motion 12 | Animaciones fluidas en dashboard y alertas |
| Recharts 3 | Gráficos de temperatura y humedad |
| Leaflet + react-leaflet | Mapa interactivo con OpenStreetMap |
| react-icons | Iconos vectoriales (Material Design) |
| react-router-dom | Enrutamiento SPA |
| Axios | Cliente HTTP |
| SCSS (Sass) | Estilos modulares y sistema de diseño |

### Backend
| Librería | Propósito |
|----------|-----------|
| Express 4 | Framework web REST |
| mysql2 | Conexión a MySQL con pool |
| jsonwebtoken | Autenticación JWT |
| bcryptjs | Hashing de contraseñas |
| nodemailer | Envío de correos (alertas + recuperación) |
| twilio | SDK para WhatsApp API |
| axios | Consumo de API Wialon |
| morgan | Logging HTTP |
| express-session | Manejo de sesiones |
| dotenv | Configuración por entorno |

---

## Capturas de Pantalla

> *Agrega aquí capturas de tu dashboard, panel de alertas, mapa y gráficos.*

<details>
<summary>Ver ejemplos de lo que incluye el dashboard</summary>

### Dashboard Principal
- Panel de estadísticas (unidades, sensores, alertas, usuarios)
- Mapa Leaflet con ubicación de sensores
- Gráficos de temperatura y humedad (Recharts)
- Lista de últimas 5 alertas con animaciones
- Sidebar con navegación y badge de alertas en vivo

### Sección de Alertas
- Lista completa con scroll infinito
- Iconos por tipo (crítico, advertencia, info)
- Timestamps relativos ("Hace 5 min")
- Animaciones de entrada con Framer Motion
- Auto-refresh cada 15 segundos

### Mapa de Sensores
- Marcadores por unidad
- Tiles de OpenStreetMap
- Posiciones simuladas (o reales con Wialon)
</details>

---

## Inicio Rápido

### Prerrequisitos
- Docker y Docker Compose instalados
- Git

### Instalación en 1 comando

```bash
git clone https://github.com/tu-usuario/agrobot-alert.git
cd agrobot-alert
docker compose up -d
```

Esto inicia 3 contenedores:
- **MySQL 8** en `localhost:3306` (con schema y seed automático)
- **Backend** en `http://localhost:3000`
- **Frontend** en `http://localhost:5173`

### Credenciales de Prueba

| Email | Contraseña | Rol | Teléfono | Unidades |
|-------|-----------|-----|----------|----------|
| `admin@agrobot.com` | `admin123` | admin | — | ninguna (ve todas) |
| `garayaa0606@gmail.com` | `admin123` | usuario | +56953818617 | 5 unidades |

### Verificar que funciona

```bash
# Revisar contenedores
docker ps

# Ver logs del backend
docker logs agrobot-backend

# Ver logs del frontend
docker logs agrobot-frontend

# Probar API
curl http://localhost:3000/api/alertas
```

---

## API REST

### Autenticación

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/api/auth/login` | Iniciar sesión (`{ LoginNombre, LoginContrasena }`) |
| POST | `/api/auth/register` | Registrar usuario |
| POST | `/api/auth/solicitar-recuperacion` | Solicitar recuperación de contraseña |

### Datos

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/alertas` | Listar todas las alertas (ordenadas por fecha DESC) |
| POST | `/api/alertas` | Crear alerta manualmente |
| GET | `/api/criterios` | Listar criterios de alerta |
| GET | `/api/sensores` | Listar sensores con sus últimas lecturas |
| GET | `/api/unidades` | Listar unidades de monitoreo |
| GET | `/api/usuarios` | Listar usuarios |
| GET | `/api/campos` | Listar campos agrícolas |
| GET | `/api/mapa` | Datos para el mapa |
| GET | `/api/mediciones/sensor/:id` | Mediciones históricas por sensor |
| GET | `/api/mediciones/unidad/:id` | Mediciones históricas por unidad |

---

## Estructura del Proyecto

```
agrobot-alert/
├── docker-compose.yml          # Orquestación MySQL + Backend + Frontend
├── AGENTS.md                   # Documentación técnica del desarrollador
├── database/
│   ├── init.sql                # Schema + seed (ejecutado automáticamente)
│   ├── schema.sql              # DDL (Data Definition Language)
│   ├── seed.sql                # Seed plano
│   └── seed.js                 # Seed alternativo con bcrypt
├── backend/
│   ├── Dockerfile
│   ├── .env
│   └── src/
│       ├── app.js              # Punto de entrada + bootstrap
│       ├── config/             # Configuración de DB y JWT
│       ├── controllers/        # Controladores (lógica de rutas)
│       ├── models/             # Modelos (queries a la BD)
│       ├── routes/             # Definición de rutas Express
│       └── utils/              # Utilidades:
│           ├── dbConnection.js # Pool MySQL con retry exponencial
│           ├── wialonService.js# Adaptador Wialon (real/mock)
│           ├── wialonMock.js   # Datos simulados para desarrollo
│           ├── wialonApiUtils.js # API real de Wialon
│           ├── alertEngine.js  # Motor de alertas automáticas
│           ├── emailService.js # Servicio de correo
│           └── logToFile.js    # Logging a archivo
├── frontend/
│   ├── Dockerfile              # Multi-stage (build → nginx)
│   ├── nginx.conf              # Proxy reverso /api → backend
│   └── src/
│       ├── App.jsx             # Router principal
│       ├── App.scss            # Sistema de diseño (variables, layout)
│       ├── Components/
│       │   ├── Login/          # Login con glassmorphism
│       │   ├── Register/       # Registro de usuario
│       │   ├── RecuperarContrasena/ # Recuperación de contraseña
│       │   ├── ProtectedRoute/ # Guard de autenticación
│       │   └── Dashboard/
│       │       ├── Dashboard.jsx # Layout principal + sidebar
│       │       └── Components/
│       │           ├── TopBar/     # Fecha/hora + usuario
│       │           ├── StatsCards/ # 4 tarjetas con datos en vivo
│       │           ├── MapView/    # Mapa Leaflet interactivo
│       │           ├── ChartsPanel/# Gráficos Recharts
│       │           ├── AlertsPanel/# Lista de alertas animadas
│       │           └── UnitsPanel/ # Unidades + modal detalle
│       └── Assets/             # Logo, imágenes, favicon
```

---

## Flujo de Alertas

```
Sensor Data ──► ¿Excede umbral? ──► ¿Alerta reciente? ──► INSERT alerta
                     │                      │
                    No                     Sí
                     │                      │
                     ▼                      ▼
                  OK                    SKIP (duplicado)
```

### Criterios precargados (seed)

| Criterio | Máx | Mín | Acción |
|----------|-----|-----|--------|
| Temperatura alta | 35°C | — | alerta crítica |
| Temperatura baja | — | 5°C | alerta advertencia |
| Humedad crítica baja | — | 30% | alerta crítica |
| Humedad excesiva | 90% | — | alerta advertencia |
| Batería baja | — | 20% | alerta advertencia |

> Los criterios son configurables desde la base de datos (tabla `criterios`).

---

## Desarrollo Local

### Sin Docker (para desarrollo rápido)

```bash
# 1. Iniciar MySQL en Docker (solo la BD)
docker compose up -d mysql

# 2. Backend
cd backend
cp .env.example .env   # o crear con USE_MOCK_API=true
npm install
npm run dev

# 3. Frontend
cd frontend
npm install
npm run dev
```

### Comandos Útiles

```bash
# Reconstruir todo desde cero
docker compose down -v; docker compose up -d --build

# Ver logs de un servicio específico
docker logs agrobot-backend -f   # follow mode
docker logs agrobot-frontend
docker logs agrobot-mysql

# Ejecutar seed manual
$env:NODE_PATH="backend\node_modules"; node database/seed.js

# Acceder a MySQL
docker exec -it agrobot-mysql mysql -uroot -proot123 agro5

# Listar tablas
docker exec agrobot-mysql mysql -uroot -proot123 -e "USE agro5; SHOW TABLES;"
```

### Variables de Entorno

| Variable | Default | Descripción |
|----------|---------|-------------|
| Variable | Default | Descripción |
|----------|---------|-------------|
| `DB_HOST` | `localhost` | Host de MySQL |
| `DB_USER` | `root` | Usuario MySQL |
| `DB_PASSWORD` | `root123` | Contraseña MySQL |
| `DB_NAME` | `agro5` | Nombre de la base de datos |
| `USE_MOCK_API` | `true` | Usar datos simulados (`true`) o API real de Wialon (`false`) |
| `JWT_SECRET` | `secret` | Secreto para firmar tokens JWT |
| `PORT` | `3000` | Puerto del servidor backend |
| `FRONTEND_URL` | `http://localhost:5173` | URL del frontend para CORS |
| `EMAIL_USER` | — | Correo Gmail para envío de emails |
| `EMAIL_PASS` | — | Contraseña de aplicación de Gmail |
| `ALERT_EMAIL_TO` | — | Fallback si el usuario no tiene email registrado |
| `TWILIO_ACCOUNT_SID` | — | Account SID de Twilio (WhatsApp) |
| `TWILIO_AUTH_TOKEN` | — | Auth Token de Twilio |
| `TWILIO_WHATSAPP_FROM` | `14155238886` | Número de WhatsApp de Twilio (sandbox) |
| `TWILIO_WHATSAPP_TO` | — | Fallback si el usuario no tiene teléfono registrado |

---

## Roadmap

- [x] Login y registro de usuarios
- [x] Dashboard con mapa, gráficos y estadísticas
- [x] Integración con API de Wialon (real y mock)
- [x] Motor de alertas automáticas
- [x] Panel de alertas con auto-refresh
- [x] Badge dinámico en sidebar
- [x] Notificaciones por email (Nodemailer)
- [x] Notificaciones por WhatsApp (Twilio)
- [ ] Historial de alertas con filtros y paginación
- [ ] Rol de administrador con gestión de usuarios
- [ ] Panel de configuración de criterios desde UI
- [ ] Tests automatizados (backend y frontend)
- [ ] Modo offline / PWA
- [ ] Notificaciones push en navegador

---

<div align="center">
  <br/>
  <p>
    <strong>AgroBot Alert</strong> — Monitoreo Agrícola Inteligente
  </p>
  <p>
    <sub>Construido con ❤️ para optimizar la agricultura moderna</sub>
  </p>
</div>
