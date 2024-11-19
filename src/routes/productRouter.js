import express from "express";
import {
  createProduct,
  updateProduct,
  deleteProduct,
  getAllProducts,
  getProductByID,
} from "../controllers/productController.js";
import passport from "passport";
import { authorizeRole } from "../middlewares/accessControl.js";

const router = express.Router();

// Rutas públicas: disponibles para todos, autenticados o no
router.get("/", getAllProducts); // Muestra productos con mensaje opcional para usuarios autenticados
router.get("/:pid", getProductByID); // Obtiene un producto específico por ID

// Rutas protegidas: solo accesibles por usuarios autenticados con rol de administrador
router.post(
  "/",
  passport.authenticate("jwt", { session: false }), // Autenticación con JWT
  authorizeRole("admin"), // Solo administradores pueden crear productos
  createProduct
);

router.put(
  "/:pid",
  passport.authenticate("jwt", { session: false }), // Autenticación con JWT
  authorizeRole("admin"), // Solo administradores pueden actualizar productos
  updateProduct
);

router.delete(
  "/:pid",
  passport.authenticate("jwt", { session: false }), // Autenticación con JWT
  authorizeRole("admin"), // Solo administradores pueden eliminar productos
  deleteProduct
);

export default router;
