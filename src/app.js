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
import viewsRouter from "./routes/viewsRouter.js";
import ticketRouter from "./routes/ticket.router.js";
import { createAdminUser } from "./config/adminSetup.js";
import config from "./config/config.js";
import dotenv from "dotenv";

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
  })
);
app.set("view engine", "handlebars");
app.set("views", "./src/views");

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());

// Inicialización de Passport
initializePassport();
app.use(passport.initialize());

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
  }
  res.status(500).json({ message: "Error interno del servidor" });
});

// Iniciar servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en el puerto ${port}`);
});
