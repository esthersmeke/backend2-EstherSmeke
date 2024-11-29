import { Router } from "express";
import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/products.controller.js";
import {
  authenticateUser,
  authorizeRole,
} from "../middlewares/auth.middleware.js";
import {
  validateProductCreation,
  validateProductUpdate,
} from "../middlewares/validations.js";

const router = Router();

// Obtener todos los productos
router.get("/", getAllProducts);

// Obtener un producto por ID
router.get("/:id", getProductById);

// Crear un producto
if (process.env.NODE_ENV === "production") {
  router.post(
    "/",
    authenticateUser,
    authorizeRole("admin"),
    validateProductCreation, // Valida los datos enviados en producción
    createProduct
  );
} else {
  router.post(
    "/",
    authenticateUser,
    authorizeRole("admin"),
    createProduct // Permite probar datos generados automáticamente en desarrollo
  );
}
// Actualizar un producto por ID
router.put(
  "/:id",
  authenticateUser,
  authorizeRole("admin"),
  validateProductUpdate,
  updateProduct
);

// Eliminar un producto por ID
router.delete("/:id", authenticateUser, authorizeRole("admin"), deleteProduct);

export default router;
