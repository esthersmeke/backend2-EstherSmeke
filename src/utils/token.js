import jwt from "jsonwebtoken";
import config from "../config/config.js";

const { jwtSecret } = config.auth;

// Generar un token JWT
export const generateToken = (user) => {
  console.log("Clave usada en generateToken:", jwtSecret);

  return jwt.sign(
    {
      id: user._id,
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      age: user.age,
      role: user.role,
      cart: user.cart, // Asegúrate de incluir el cartId
    },
    jwtSecret,
    { expiresIn: "24h" }
  );
};

// Función para generar un token de recuperación de contraseña
export const generatePasswordResetToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      email: user.email,
    },
    jwtSecret,
    { expiresIn: "24h" } // Token de recuperación con expiración de 24 horas
  );
};

// Verificar un token JWT
export const verifyToken = (token) => {
  try {
    if (!token || typeof token !== "string" || token.split(".").length !== 3) {
      throw new Error("Token malformado");
    }

    const decoded = jwt.verify(token, jwtSecret);
    return decoded;
  } catch (error) {
    console.error("Error en verifyToken:", error.message);
    throw new Error(
      "Error al obtener el usuario actual: Token inválido o expirado."
    );
  }
};
