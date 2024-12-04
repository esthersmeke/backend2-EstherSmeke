import dotenv from "dotenv";

// Cargar las variables de entorno desde .env
dotenv.config();

const config = {
  app: {
    port: process.env.PORT || 3000, // Puerto de la aplicación
    env: process.env.NODE_ENV || "development", // Entorno de la aplicación
  },
  db: {
    username: process.env.DB_USERNAME || "defaultUser", // Nombre de usuario de la base de datos
    password: process.env.DB_PASSWORD || "defaultPassword", // Contraseña de la base de datos
    uri: `mongodb+srv://${process.env.DB_USERNAME || "defaultUser"}:${
      process.env.DB_PASSWORD || "defaultPassword"
    }@cluster0.ayouo.mongodb.net/entrega-final?retryWrites=true&w=majority`, // URI de conexión a MongoDB
  },
  auth: {
    jwtSecret: process.env.JWT_SECRET || "defaultJwtSecret", // Clave secreta para JWT
  },
  github: {
    clientId: process.env.GITHUB_CLIENT_ID || "", // ID del cliente de GitHub
    clientSecret: process.env.GITHUB_CLIENT_SECRET || "", // Secreto del cliente de GitHub
    callbackUrl:
      process.env.GITHUB_CALLBACK_URL ||
      "http://localhost:3000/auth/github/callback", // URL de callback para GitHub OAuth
  },
  mail: {
    host: process.env.MAIL_HOST || "sandbox.smtp.mailtrap.io", // Host del servidor de correo
    port: process.env.MAIL_PORT || 587, // Puerto para el servidor de correo
    user: process.env.MAIL_USER || "defaultUser", // Usuario del servidor de correo
    pass: process.env.MAIL_PASS || "defaultPass", // Contraseña del servidor de correo
  },
};

export default config;
