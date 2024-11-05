# Proyecto Ecommerce Backend

Este proyecto es una implementación backend para un sistema de ecommerce, desarrollado en Node.js y Express. Incluye autenticación y autorización de usuarios, así como un sistema de roles y protección de rutas.

## Características

- CRUD de Usuarios.
- Autenticación y Autorización mediante Passport y JWT.
- Integración con MongoDB Atlas.
- Soporte para inicio de sesión a través de GitHub.
- Encriptación de contraseñas con bcryptjs.
- Rutas protegidas y gestión de sesiones.

## Configuración e Instalación

### Requisitos

- Node.js v14 o superior.
- MongoDB Atlas.
- Variables de entorno configuradas en un archivo `.env` (ver sección Variables de Entorno).

### Instalación

1. Clona el repositorio:

    ```bash
    git clone https://github.com/esthersmeke/backend2-EstherSmeke.git
    ```

2. Instala las dependencias:

    ```bash
    npm install
    ```

3. Configura las variables de entorno en un archivo `.env` en la raíz del proyecto.

4. Inicia el servidor:

    ```bash
    npm start
    ```

## Variables de Entorno

Asegúrate de incluir un archivo `.env` con las siguientes variables:

JWT_SECRET=tu_jwt_secret 
SESSION_SECRET=tu_session_secret

  (( JWT_SECRET=clavecoderjwt ))
  (( SESSION_SECRET=clavecodersession ))


## Uso

- **Registro de Usuarios**: `/register`
- **Inicio de Sesión**: `/login`
- **Cierre de Sesión**: `/logout`
- **Perfil de Usuario**: `/profile` (requiere autenticación)
- **Autenticación con GitHub**: `/api/sessions/github`

## Rutas API

- **GET /api/sessions/current**: Devuelve los datos del usuario autenticado a partir del token JWT.
