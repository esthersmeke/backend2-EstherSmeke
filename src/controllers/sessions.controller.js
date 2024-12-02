import { generateToken } from "../utils/token.js";
import * as UserService from "../services/userService.js";
import UserDTO from "../dto/UserDTO.js";

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
