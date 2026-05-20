# AGENTS.md — AgroBot-Alert

## Stack

- **Backend:** Node.js + Express + MySQL 8 (Docker)
- **Frontend:** React 18 + Vite + Recharts + Leaflet + Framer Motion
- **DB:** MySQL 8 corriendo en Docker compose

## Arranque rápido

```powershell
docker compose up -d         # Inicia MySQL + Backend + Frontend
```

- Frontend: http://localhost:5173
- Backend API: http://localhost:3000
- MySQL: localhost:3306 (root / root123)

## Credenciales de prueba

| Email | Password | Rol |
|---|---|---|
| admin@agrobot.com | admin123 | admin |
| demo@agrobot.com | admin123 | usuario |

## Estructura del proyecto

```
AgroBot-Alert/
├── docker-compose.yml          # MySQL + Backend + Frontend
├── database/
│   ├── init.sql                # Schema + seed (se ejecuta auto al crear el contenedor)
│   ├── schema.sql              # Solo DDL
│   ├── seed.js                 # Seed alternativo con bcrypt (Node)
│   └── seed.sql                # Seed plano (SQL)
├── backend/
│   ├── Dockerfile
│   └── src/
│       ├── app.js
│       ├── config/
│       ├── controllers/
│       ├── models/
│       ├── routes/
│       └── utils/              # dbConnection, wialonMock, wialonService, etc.
├── frontend/
│   ├── Dockerfile              # Multi-stage: build + nginx
│   ├── nginx.conf              # Proxy reverso /api -> backend
│   └── src/
│       ├── App.jsx             # Rutas
│       ├── App.scss            # Sistema de diseño completo
│       ├── Components/
│       │   ├── Login/          # Login con glassmorphism
│       │   ├── Register/       # Registro
│       │   ├── RecuperarContrasena/
│       │   ├── ProtectedRoute/ # Guard de autenticación
│       │   └── Dashboard/
│       │       ├── Dashboard.jsx
│       │       └── Components/
│       │           ├── TopBar/        # Barra superior con fecha/hora
│       │           ├── StatsCards/    # 4 cards con datos reales
│       │           ├── MapView/       # Mapa Leaflet con sensores
│       │           ├── ChartsPanel/   # Gráficos Recharts
│       │           ├── AlertsPanel/   # Lista de alertas animada
│       │           └── UnitsPanel/    # Unidades + modal detalle
│       └── Assets/            # logos, video.mp4
```

## API Endpoints

### Auth
- `POST /api/auth/login` — `{ LoginNombre, LoginContrasena }` → `{ token, usuario }`
- `POST /api/auth/register` — `{ Email, Nombre, Contrasena, Rol }`
- `POST /api/auth/solicitar-recuperacion` — `{ email }`

### Datos
- `GET /api/usuarios` — lista usuarios
- `GET /api/unidades` — lista unidades con lat/lng
- `GET /api/sensores` — lista sensores con mediciones
- `GET /api/alertas` — lista alertas ordenadas por fecha
- `GET /api/mediciones/sensor/:id` — mediciones por sensor
- `GET /api/mediciones/unidad/:id` — mediciones por unidad
- `GET /api/campos` — lista campos agrícolas
- `GET /api/criterios` — lista criterios de alerta
- `GET /api/mapa` — datos para mapa (endpoint tiene columnas incorrectas en la query)

## Convenciones

- **No JWT middleware** — los endpoints no están protegidos (solo el frontend verifica token en localStorage)
- **Mock API** — `USE_MOCK_API=true` en `.env` genera datos falsos sin Wialon real
- **Reintento DB** — `dbConnection.js` tiene retry exponencial hasta conectar
- **Seed automático** — `init.sql` se ejecuta al crear el contenedor MySQL por primera vez
- **Encoding** — usar solo ASCII (sin tildes/ñ) en SQL para evitar corrupción al pipear desde Windows → Docker

## Comandos útiles

```powershell
# Reconstruir todo desde cero
docker compose down -v; docker compose up -d --build

# Ver logs
docker logs agrobot-backend
docker logs agrobot-frontend
docker logs agrobot-mysql

# Ejecutar seed manual
$env:NODE_PATH="backend\node_modules"; node database/seed.js

# Entrar a MySQL
docker exec -it agrobot-mysql mysql -uroot -proot123 agro5

# Listar tablas
docker exec agrobot-mysql mysql -uroot -proot123 -e "USE agro5; SHOW TABLES;"
```

## Notas

- El frontend se sirve como build estático via nginx (production mode, no dev server)
- Las rutas del sidebar en Dashboard.jsx cambian `activeSection` con useState (no React Router)
- El mapa usa OpenStreetMap tiles (requiere internet)
- Los gráficos de Recharts usan datos mock + sensores reales combinados
- `react-icons` importa individualmente (NO usar `react-icons/all`)
