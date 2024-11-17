import { Router } from "express";
import passport from "passport";
import { uploader } from "../utils/multerUtil.js";
import { requireAdminRole } from "../middlewares/accessControl.js";
import * as productController from "../controllers/productController.js";

const router = Router();

// Ruta para obtener todos los productos
router.get("/", productController.getAllProducts);

// Ruta para obtener un producto por ID
router.get("/:pid", productController.getProductByID);

// Ruta para crear un nuevo producto
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  requireAdminRole,
  uploader.array("thumbnails", 3),
  productController.createProduct
);

// Ruta para actualizar un producto
router.put(
  "/:pid",
  passport.authenticate("jwt", { session: false }),
  requireAdminRole,
  uploader.array("thumbnails", 3),
  productController.updateProduct
);

// Ruta para eliminar un producto
router.delete(
  "/:pid",
  passport.authenticate("jwt", { session: false }),
  requireAdminRole,
  productController.deleteProduct
);

export default router;
