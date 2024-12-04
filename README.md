# Proyecto Final: Backend E-commerce

Este proyecto implementa un servidor backend para un sistema de e-commerce, incluyendo autenticación, autorización, gestión de usuarios, carritos de compras, productos y generación de tickets de compra. Sigue una arquitectura basada en capas.

## Estructura del Proyecto

src/
├── config/ # Configuración y manejo de variables de entorno
├── controllers/ # Lógica de negocio para manejar las solicitudes
├── dao/ # Acceso a datos (DAO) y repositorios
├── dto/ # Objetos de transferencia de datos (DTO)
├── middlewares/ # Middlewares de autenticación y validación
├── routes/ # Definición de rutas
├── services/ # Servicios para lógica específica
├── utils/ # Funciones y utilidades generales
├── views/ # Plantillas Handlebars
└── app.js # Archivo principal de la aplicación

## Configuración de las Variables de Entorno

- Crea un archivo .env basado en el archivo .env.example.

### Requisitos

- Node.js: Plataforma principal para el desarrollo backend.
- Express: Framework para la creación de APIs y servidor web.
- MongoDB: Base de datos NoSQL para la persistencia de datos.
- Handlebars: Motor de plantillas para vistas dinámicas.
- Passport.js: Middleware para autenticación (incluido GitHub OAuth).
- JWT: Mecanismo para autenticar usuarios de forma segura.

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

## Rutas Disponibles

**Rutas de Usuarios**

- **POST /api/users/register**: Registro de usuario.
- **POST /api/users/login**: Inicio de sesión.
- **POST /api/users/logout**: Cierre de sesión.
- **POST /api/users/forgot-password**: Solicitud de recuperación de contraseña.
- **POST/api/users/reset-password/:token**: Restablecimiento de contraseña.
- **GET /api/sessions/current**: Devuelve los datos del usuario autenticado.

  **Rutas de Productos**

- **GET /api/products**: Lista todos los productos.
- **GET /api/products/:id**: Detalles de un producto.
- **POST /api/products**: Crear un producto (solo admin).
- **PUT /api/products/:id**: Actualizar un producto (solo admin).
- **DELETE /api/products/:id**: Eliminar un producto (solo admin).

  **Rutas de Carritos**

- **GET /api/carts/:cid**: Obtiene el carrito por ID.
- **POST /api/carts/:cid/products/:pid**: Agrega un producto al carrito.
- **PUT /api/carts/:cid/products/:pid**: Actualiza la cantidad de un producto en el carrito.
- **DELETE /api/carts/:cid/products/:pid**: Elimina un producto del carrito.
- **POST /api/carts/:cid/purchase**: Finaliza la compra de un carrito.

  **Rutas de Tickets**

- **GET /api/tickets**: Lista todos los tickets (solo admin).
- **GET /api/tickets/:id**: Detalles de un ticket.

  **Rutas de Vistas**

- **/login**: - Página de inicio de sesión.
- **/register**: - Página de registro.
- **/forgot-password**: - Página de recuperación de contraseña.
- **/reset-password/:token**: - Página para restablecer contraseña.
- **/products**: - Página principal con todos los productos.
- **/cart**: - Página para ver el carrito del usuario.
- **/checkout**: - Página para finalizar compra.
- **/ticket/:id**: - Página de detalles del ticket.
- **/current**: - Página del perfil del usuario autenticado.
- **/logout**: - Funcionalidad para cerrar sesión.
