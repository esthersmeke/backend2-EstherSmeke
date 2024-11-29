import { generateToken } from "../utils/token.js";
import * as UserService from "../services/userService.js";
import UserDTO from "../dto/UserDTO.js";

// Controlador para iniciar sesión
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Autenticar al usuario
    const user = await UserService.authenticateUser(email, password);
    if (!user) {
      return res.status(401).json({ message: "Credenciales incorrectas" });
    }

    // Generar el token JWT
    const token = generateToken({
      id: user._id,
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      age: user.age,
      role: user.role,
    });

    // Configurar la cookie con el token
    res.cookie("currentUser", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Usar cookies seguras solo en producción
      sameSite: "strict",
      maxAge: 60 * 60 * 1000, // 1 hora
    });

    res.status(200).json({
      message: "Inicio de sesión exitoso",
      payload: {
        id: user._id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        age: user.age,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Error en login:", error.message);
    res.status(500).json({ message: "Error en el servidor" });
  }
};

// Controlador para obtener el usuario actual
export const currentUser = (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Usuario no autenticado" });
    }
    // Transformar el usuario con UserDTO
    const userDTO = new UserDTO(req.user);

    res.status(200).json({
      message: "Usuario autenticado correctamente",
      user: userDTO, // Enviar la versión segura del usuario
    });
  } catch (error) {
    console.error("Error en currentUser:", error.message);
    res.status(500).json({ message: "Error en el servidor" });
  }
};
