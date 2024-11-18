import passport from "passport";
import local from "passport-local";
import { createHash, isValidpassword } from "../utils/utils.js";
import User from "../dao/models/userModel.js";
import { Strategy as GitHubStrategy } from "passport-github2";
import { Strategy as JwtStrategy } from "passport-jwt";

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
          if (user) return done(null, false);

          const newUser = {
            first_name,
            last_name,
            email: username,
            age,
            password: createHash(password),
          };

          const result = await User.create(newUser);
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

  // CookieExtractor para JWT
  const cookieExtractor = (req) => {
    if (req && req.cookies) {
      const token = req.cookies["currentUser"]; // Obtén el token de la cookie
      console.log("Token extraído:", token); // Log temporal para depuración
      return token;
    }
    return null; // Devuelve null si no se encuentra la cookie
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
          const user = await User.findById(jwt_payload.id).lean();
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

  // Serialización y deserialización
  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id).lean();
      done(null, user);
    } catch (error) {
      done(error, null);
    }
  });
};

export default initializePassport;
