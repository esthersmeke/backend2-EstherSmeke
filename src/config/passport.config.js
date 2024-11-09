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
        clientID: "Iv23lidnoRx7hBFgSOAM",
        clientSecret: "b127d0144c6a761b246decb162d767fc9386289e",
        callbackURL: "http://localhost:8080/api/sessions/github/callback",
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
      token = req.cookies["jwt"]; // Cambia 'jwt' por el nombre que le hayas dado a la cookie
    }
    return token;
  };

  // Estrategia JWT para autenticación de token
  passport.use(
    new JwtStrategy(
      {
        jwtFromRequest: cookieExtractor,
        secretOrKey: process.env.JWT_SECRET, // Clave secreta desde .env
      },
      async (jwt_payload, done) => {
        try {
          const user = await User.findById(jwt_payload.id);
          if (user) {
            return done(null, user);
          } else {
            return done(null, false);
          }
        } catch (error) {
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
