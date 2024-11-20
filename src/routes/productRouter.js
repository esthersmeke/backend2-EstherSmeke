import { Router } from "express";
import {
  isAuthenticated,
  authorizeRole,
} from "../middlewares/accessControl.js";
import {
  createProduct,
  getAllProducts,
  getProductByID,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";

const router = Router();

// Rutas públicas
router.get("/", getAllProducts); // Obtener todos los productos
router.get("/:pid", getProductByID); // Obtener producto por ID

// Rutas protegidas (solo admin)
router.post("/", isAuthenticated, authorizeRole("admin"), createProduct); // Crear un producto
router.put("/:pid", isAuthenticated, authorizeRole("admin"), updateProduct); // Actualizar un producto
router.delete("/:pid", isAuthenticated, authorizeRole("admin"), deleteProduct); // Eliminar un producto

export default router;
