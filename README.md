# Agribot-Alert

**Agribot-Alert** es un sistema web diseñado para la obtención, almacenamiento, análisis y notificación de datos provenientes del servicio Wialon. Su propósito principal es facilitar la toma de decisiones en entornos agrícolas mediante la automatización de alertas basadas en sensores instalados en unidades de monitoreo, como estaciones estáticas o tractores en movimiento.

## 🎯 Objetivo del Proyecto

Desarrollar un sistema de software que permita obtener datos desde Wialon, almacenarlos, analizarlos mediante criterios definidos, y notificar de forma automática a los usuarios, minimizando la necesidad de interacción constante con la plataforma.

## 📌 Problema Detectado

Aunque la plataforma permite visualizar información detallada sobre unidades agrícolas (estaciones y tractores), el uso constante requería que los agricultores revisaran manualmente la web. Esto generaba ineficiencias, retrasos y dependencias de terceros para interpretar los datos y tomar decisiones. El sistema se estaba convirtiendo en una carga más que en una solución útil.

## ✅ Solución Propuesta

Agribot-Alert automatiza el proceso de análisis de datos y envía alertas relevantes a los agricultores vía **WhatsApp**, basándose en criterios preestablecidos. Esto:

- Elimina la necesidad de ingresar frecuentemente al sistema.
- Permite a los agricultores recibir solo la información crítica.
- Utiliza un canal de comunicación universal (WhatsApp).
- Mejora la eficiencia y reacción ante eventos detectados por sensores.

## 🛠️ Tecnologías Utilizadas

### Backend

- **Node.js**
- **Express**
- **MySQL**
- **Axios**
- **Wialon API**
- **SendPulse API (para notificaciones WhatsApp)**

### Frontend

- **React**
- **SCSS / CSS Modules**
- **Vite**

## 📂 Estructura del Proyecto

### Backend (`/src`)
