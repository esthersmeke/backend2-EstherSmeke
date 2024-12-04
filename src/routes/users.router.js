import { Router } from "express";
import { validateRegister, validateLogin } from "../middlewares/validations.js";
import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  registerUser,
  loginUser,
  forgotPassword,
  resetPassword,
  logoutUser,
} from "../controllers/users.controller.js";
import { renderResetPasswordView } from "../controllers/views.controller.js"; // Importa la función desde views.controller.js

const router = Router();

// Registrar un nuevo usuario
router.post("/register", validateRegister, registerUser);

// Iniciar sesión
router.post("/login", validateLogin, loginUser);

// Recuperación de contraseña
router.post("/forgot-password", forgotPassword);
router.get("/reset-password/:token", renderResetPasswordView);
router.post("/reset-password/:token", resetPassword);

// Obtener todos los usuarios
router.get("/", getAllUsers);

// Obtener un usuario por ID
router.get("/:id", getUserById);

// Crear un nuevo usuario
router.post("/", createUser);

// Actualizar un usuario por ID
router.put("/:id", updateUser);

// Eliminar un usuario por ID
router.delete("/:id", deleteUser);

router.post("/logout", logoutUser);

export default router;
