import passport from "passport";
import local from "passport-local";
import { createHash, isValidpassword } from "../utils/hash.js";
import User from "../dao/models/userModel.js";
import { Strategy as GitHubStrategy } from "passport-github2"; // GitHub Strategy
import { Strategy as JwtStrategy } from "passport-jwt";
import config from "./config.js"; // Para usar las variables de configuración

const LocalStrategy = local.Strategy;

const initializePassport = () => {
  // Estrategia de Registro Local

  // Estrategia de Inicio de Sesión Local
  passport.use(
    "login",
    new LocalStrategy(
      { usernameField: "email" },
      async (username, password, done) => {
        try {
          const user = await User.findOne({ email: username });
          if (!user || !isValidpassword(user, password)) {
            return done(null, false);
          }
          return done(null, user);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  // Estrategia de autenticación con GitHub
  passport.use(
    new GitHubStrategy(
      {
        clientID: config.github.clientId,
        clientSecret: config.github.clientSecret,
        callbackURL: config.github.callbackUrl,
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          let user = await User.findOne({ email: profile.emails[0].value });
          if (!user) {
            // Crear el usuario si no existe
            user = await User.create({
              first_name: profile.displayName || "GitHub User",
              last_name: "",
              email: profile.emails[0].value,
              age: null,
              password: "", // Contraseña vacía según la consigna
              role: req.user.role || "user",
            });
          }
          return done(null, user);
        } catch (error) {
          console.error("Error en autenticación de GitHub:", error);
          return done(error);
        }
      }
    )
  );
  // CookieExtractor para JWT
  const cookieExtractor = (req) => {
    let token = null;
    if (req && req.cookies) {
      token = req.cookies["currentUser"]; // Cambia 'jwt' por el nombre que le hayas dado a la cookie
    }
    return token;
  };

  // Estrategia JWT
  passport.use(
    new JwtStrategy(
      {
        jwtFromRequest: cookieExtractor,
        secretOrKey: process.env.JWT_SECRET,
      },
      async (jwt_payload, done) => {
        try {
          const user = await User.findById(jwt_payload.id);
          if (user) {
            return done(null, user);
          }
          return done(null, false);
        } catch (error) {
          return done(error, false);
        }
      }
    )
  );

  // Serialización y deserialización de usuarios
  passport.serializeUser((user, done) => {
    done(null, user._id); // Serializamos el _id del usuario
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id); // Deserializamos usando el _id
      done(null, user);
    } catch (error) {
      done(error, null);
    }
  });
};
export default initializePassport;
