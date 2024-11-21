import { Router } from "express";
import passport from "passport";
import {
  createProduct,
  getAllProducts,
  getProductByID,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";
import { authorizeRole } from "../middlewares/accessControl.js";

const router = Router();

// Rutas públicas
router.get("/", getAllProducts); // Obtener todos los productos
router.get("/:pid", getProductByID); // Obtener producto por ID

// Rutas protegidas (solo admin)
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  authorizeRole("admin"),
  createProduct
); // Crear un producto

router.put(
  "/:pid",
  passport.authenticate("jwt", { session: false }),
  authorizeRole("admin"),
  updateProduct
); // Actualizar un producto

router.delete(
  "/:pid",
  passport.authenticate("jwt", { session: false }),
  authorizeRole("admin"),
  deleteProduct
); // Eliminar un producto

export default router;
