import passport from "passport";
import local from "passport-local";
import { createHash, isValidpassword } from "../utils/utils.js";
import User from "../dao/models/userModel.js";
import { Strategy as GitHubStrategy } from "passport-github2";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";

const LocalStrategy = local.Strategy;

const initializePassport = () => {
  // Estrategia de Registro Local
  passport.use(
    "register",
    new LocalStrategy(
      { passReqToCallback: true, usernameField: "email" },
      async (req, username, password, done) => {
        const { first_name, last_name, age } = req.body;

        try {
          let user = await User.findOne({ email: username });
          if (user) {
            console.log("Usuario ya existe");
            return done(null, false);
          }

          const newUser = {
            first_name,
            last_name,
            email: username,
            age,
            password: createHash(password),
          };

          let result = await User.create(newUser);
          return done(null, result);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  // Estrategia de Inicio de Sesión Local
  passport.use(
    "login",
    new LocalStrategy(
      { usernameField: "email" },
      async (username, password, done) => {
        try {
          const user = await User.findOne({ email: username });
          if (!user) {
            console.log("Usuario no encontrado");
            return done(null, false);
          }
          if (!isValidpassword(user, password)) {
            console.log("Contraseña incorrecta");
            return done(null, false);
          }
          return done(null, user);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  // Estrategia de Autenticación con GitHub
  passport.use(
    new GitHubStrategy(
      {
        clientID: process.env.GITHUB_CLIENT_ID, // Se reemplaza el valor hardcodeado por una variable de entorno
        clientSecret: process.env.GITHUB_CLIENT_SECRET, // Se reemplaza por una variable de entorno
        callbackURL: process.env.GITHUB_CALLBACK_URL, // Se reemplaza por una variable de entorno
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          console.log("GitHub Profile:", profile); // Log para ver los datos de GitHub
          let user = await User.findOne({ email: profile.emails[0].value });
          if (!user) {
            // Crear el usuario si no existe
            user = await User.create({
              first_name: profile.displayName || "GitHub User",
              last_name: "",
              email: profile.emails[0].value,
              age: null,
              password: "", // Contraseña vacía según la consigna
            });
          }
          console.log("Usuario autenticado con GitHub:", user); // Log para confirmar usuario
          return done(null, user);
        } catch (error) {
          console.error("Error en autenticación de GitHub:", error);
          return done(error);
        }
      }
    )
  );
  const cookieExtractor = (req) => {
    let token = null;
    if (req && req.cookies) {
      token = req.cookies["currentUser"]; // Asegúrate de que coincide con el nombre de la cookie
      console.log("Token extraído de la cookie 'currentUser':", token); // Log para depuración
    } else {
      console.log("No se encontró la cookie 'currentUser'.");
    }
    return token;
  };

  // Estrategia JWT para autenticación de token
  passport.use(
    new JwtStrategy(
      {
        jwtFromRequest: cookieExtractor,
        secretOrKey: process.env.JWT_SECRET,
      },
      async (jwt_payload, done) => {
        console.log("JWT Payload decodificado:", jwt_payload); // Log para depuración
        console.log(
          `JWT Payload: ${JSON.stringify(
            jwt_payload
          )}, Tiempo actual: ${Math.floor(Date.now() / 1000)}`
        );
        try {
          const user = await User.findById(jwt_payload.id);
          if (user) {
            console.log("Usuario encontrado:", user); // Confirma si el usuario fue encontrado
            return done(null, user);
          } else {
            console.log("Usuario no encontrado con el ID:", jwt_payload.id);
            return done(null, false);
          }
        } catch (error) {
          console.error("Error al procesar el JWT:", error);
          return done(error, false);
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user._id); // Serializa solo el ID
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id); // Recupera al usuario
      done(null, user);
    } catch (error) {
      done(error, null);
    }
  });
};

export default initializePassport;
