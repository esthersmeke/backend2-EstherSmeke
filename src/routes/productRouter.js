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

// Rutas públicas
router.get("/", getAllProducts);
router.get("/:pid", getProductByID);

// Rutas protegidas para admin
router.post(
  "/",
  passport.authenticate("jwt", { session: false }), // Autenticación con JWT
  authorizeRole("admin"), // Autorización para administradores
  createProduct
);

router.put(
  "/:pid",
  passport.authenticate("jwt", { session: false }), // Autenticación con JWT
  authorizeRole("admin"), // Autorización para administradores
  updateProduct
);

router.delete(
  "/:pid",
  passport.authenticate("jwt", { session: false }), // Autenticación con JWT
  authorizeRole("admin"), // Autorización para administradores
  deleteProduct
);

export default router;
