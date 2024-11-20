import mongoose from "mongoose";
import express from "express";
import session from "express-session";
import MongoStore from "connect-mongo";
import passport from "passport";
import initializePassport from "./config/passport.config.js";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import { engine } from "express-handlebars";
import sessionsRouter from "./routes/api/sessionsRouter.js";
import viewsRouter from "./routes/viewsRouter.js";
import { createAdminUser } from "./config/adminSetup.js";
import productRouter from "./routes/productRouter.js";
import cartRouter from "./routes/cartRouter.js";
import dotenv from "dotenv";

dotenv.config(); // Esto carga las variables de entorno desde .env
console.log("Node Environment:", process.env.NODE_ENV); // Verifica si está cargando NODE_ENV
console.log("JWT Secret:", process.env.JWT_SECRET); // Verifica si está cargando JWT_SECRET
console.log("MAIL_HOST:", process.env.MAIL_HOST);
console.log("MAIL_PORT:", process.env.MAIL_PORT);
console.log("MAIL_USER:", process.env.MAIL_USER);
console.log("MAIL_PASS:", process.env.MAIL_PASS);

const app = express();
const PORT = process.env.PORT;

// Configuración de conexión a MongoDB Atlas
mongoose
  .connect(
    `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.ayouo.mongodb.net/entrega-final?retryWrites=true&w=majority`,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => {
    console.log("Conectado a MongoDB Atlas");
    createAdminUser(); // Llamar a la función para crear el usuario admin si no existe
  })
  .catch((error) => console.error("Error al conectar a MongoDB Atlas:", error));

// Configuración de handlebars
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

// Configuración de la sesión con almacenamiento en MongoDB Atlas
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
      mongoUrl: `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.ayouo.mongodb.net/entrega-final?retryWrites=true&w=majority`,
    }),
    cookie: {
      httpOnly: true, // Esta cookie no debe ser accesible desde JavaScript.
      secure: process.env.NODE_ENV === "development", // Asegúrate de que solo en producción sea segura.
    },
  })
);

// Inicialización de Passport
initializePassport();
app.use(passport.initialize());
app.use(passport.session());

// Configuración de rutas
app.use("/api/sessions", sessionsRouter);
app.use("/", viewsRouter);
app.use("/api/products", productRouter);
app.use("/api/carts", cartRouter);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
