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
import bcrypt from "bcryptjs";
import User from "./dao/models/userModel.js";

process.loadEnvFile();
const app = express();
const PORT = process.env.PORT;

// Configuración de conexión a MongoDB Atlas
mongoose
  .connect(
    "mongodb+srv://esthersmeke:coder@cluster0.ayouo.mongodb.net/entrega-final?retryWrites=true&w=majority",
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

// Función para crear el usuario administrador si no existe
async function createAdminUser() {
  try {
    const existingAdmin = await User.findOne({ email: "adminCoder@coder.com" });

    if (!existingAdmin) {
      const hashedPassword = bcrypt.hashSync("adminCod3r123", 10);
      const newAdmin = new User({
        first_name: "Admin",
        last_name: "Coder",
        email: "adminCoder@coder.com",
        age: 30,
        password: hashedPassword,
        role: "admin",
      });

      await newAdmin.save();
      console.log("Usuario admin creado exitosamente.");
    } else {
      console.log("El usuario admin ya existe.");
    }
  } catch (error) {
    console.error("Error al crear el usuario admin:", error);
  }
}

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
      mongoUrl:
        "mongodb+srv://esthersmeke:coder@cluster0.ayouo.mongodb.net/entrega-final?retryWrites=true&w=majority",
    }),
  })
);

// Inicialización de Passport
initializePassport();
app.use(passport.initialize());
app.use(passport.session());

// Configuración de rutas
app.use("/api/sessions", sessionsRouter);
app.use("/", viewsRouter);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
