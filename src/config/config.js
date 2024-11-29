import dotenv from "dotenv";

// Cargar las variables de entorno desde .env
dotenv.config();

const config = {
  app: {
    port: process.env.PORT || 3000,
    env: process.env.NODE_ENV || "development",
  },
  db: {
    username: process.env.DB_USERNAME || "defaultUser",
    password: process.env.DB_PASSWORD || "defaultPassword",
    uri: `mongodb+srv://${process.env.DB_USERNAME || "defaultUser"}:${
      process.env.DB_PASSWORD || "defaultPassword"
    }@cluster0.ayouo.mongodb.net/entrega-final?retryWrites=true&w=majority`,
  },
  auth: {
    jwtSecret: process.env.JWT_SECRET || "defaultJwtSecret",
  },
  github: {
    clientId: process.env.GITHUB_CLIENT_ID || "",
    clientSecret: process.env.GITHUB_CLIENT_SECRET || "",
    callbackUrl:
      process.env.GITHUB_CALLBACK_URL ||
      "http://localhost:8080/api/sessions/github/callback",
  },
  mail: {
    host: process.env.MAIL_HOST || "sandbox.smtp.mailtrap.io",
    port: process.env.MAIL_PORT || 587,
    user: process.env.MAIL_USER || "defaultUser",
    pass: process.env.MAIL_PASS || "defaultPass",
  },
};

export default config;
