import mongoose from "mongoose";
import express from "express";
import passport from "passport";
import initializePassport from "./config/passport.config.js";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import { engine } from "express-handlebars";
import usersRouter from "./routes/users.router.js";
import productsRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";
import sessionsRouter from "./routes/sessions.router.js";
import viewsRouter from "./routes/views.router.js";
import ticketRouter from "./routes/ticket.router.js";
import { createAdminUser } from "./config/adminSetup.js";
import config from "./config/config.js";
import dotenv from "dotenv";
import session from "express-session"; // Importar express-session

dotenv.config();

const { port } = config.app;

const app = express();

// Conexión a MongoDB
mongoose
  .connect(config.db.uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Conectado a MongoDB Atlas");
    createAdminUser(); // Crear usuario admin si no existe
  })
  .catch((error) => console.error("Error al conectar a MongoDB Atlas:", error));

// Configuración de Helpers Handlebars
const hbsHelpers = {
  eq: (a, b) => a === b,
  and: (...args) => args.every(Boolean),
  add: (a, b) => a + b,
  subtract: (a, b) => a - b,
  multiply: (a, b) => a * b,
  toFixed: (value, decimals) => parseFloat(value).toFixed(decimals),
};

// Configuración de Handlebars
app.engine(
  "handlebars",
  engine({
    extname: "handlebars",
    defaultLayout: "main",
    runtimeOptions: {
      allowProtoPropertiesByDefault: true,
      allowProtoMethodsByDefault: true,
    },
    helpers: hbsHelpers, // Aquí registras los helpers
  })
);
app.set("view engine", "handlebars");
app.set("views", "./src/views");

// Configuración de la sesión
app.use(
  session({
    secret: process.env.SESSION_SECRET || "mi_clave_secreta", // Usa una variable de entorno para mayor seguridad
    resave: false,
    saveUninitialized: false,
    secure: process.env.NODE_ENV === "production", // Solo seguro en producción
    httpOnly: true, // Prevenir acceso desde JavaScript del cliente
  })
);

// Inicialización de Passport
initializePassport();
app.use(passport.initialize());
app.use(passport.session()); // Esta línea es crucial para manejar la sesión de Passport

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());

// Rutas
app.use("/api/users", usersRouter);
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/api/sessions", sessionsRouter);
app.use("/api/tickets", ticketRouter);
app.use("/", viewsRouter);

// Middleware global de manejo de errores
app.use((err, req, res, next) => {
  if (process.env.NODE_ENV === "development") {
    console.error("Error capturado por el middleware global:", err.stack);
    return res.status(500).json({ message: err.message, stack: err.stack });
  }

  // Producción: No exponer detalles del error
  console.error("Error capturado:", err.message);
  res.status(500).json({ message: "Error interno del servidor" });
});

// Iniciar servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en el puerto ${port}`);
});
