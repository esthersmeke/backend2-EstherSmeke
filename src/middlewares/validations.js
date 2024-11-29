import { body, validationResult, param } from "express-validator";

// Middleware genérico para manejar errores de validación
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Validaciones para registro
export const validateRegister = [
  body("first_name").notEmpty().withMessage("El nombre es obligatorio"),
  body("last_name").notEmpty().withMessage("El apellido es obligatorio"),
  body("email").isEmail().withMessage("El correo no es válido"),
  body("password")
    .isLength({ min: 3 })
    .withMessage("La contraseña debe tener al menos 3 caracteres"),
  body("age")
    .isInt({ min: 0 })
    .withMessage("La edad debe ser un número positivo"),
  handleValidationErrors,
];

// Validaciones para login
export const validateLogin = [
  body("email").isEmail().withMessage("El correo no es válido"),
  body("password").notEmpty().withMessage("La contraseña es obligatoria"),
  handleValidationErrors,
];

// Validaciones para creación de productos (activar en Producción para usar sin Faker)
export const validateProductCreation = [
  body("title")
    .notEmpty()
    .withMessage("El título es obligatorio")
    .isLength({ min: 5, max: 100 })
    .withMessage("El título debe tener entre 5 y 100 caracteres"),
  body("description")
    .notEmpty()
    .withMessage("La descripción es obligatoria")
    .isLength({ min: 10, max: 500 })
    .withMessage("La descripción debe tener entre 10 y 500 caracteres"),
  body("code")
    .notEmpty()
    .withMessage("El código es obligatorio")
    .isString()
    .withMessage("El código debe ser un texto"),
  body("price")
    .notEmpty()
    .withMessage("El precio es obligatorio")
    .isFloat({ min: 0 })
    .withMessage("El precio debe ser un número positivo"),
  body("stock")
    .notEmpty()
    .withMessage("El stock es obligatorio")
    .isInt({ min: 0 })
    .withMessage("El stock debe ser un número entero positivo"),
  body("category").notEmpty().withMessage("La categoría es obligatoria"),
  body("thumbnails")
    .optional()
    .isArray()
    .withMessage("Thumbnails debe ser un arreglo de URLs")
    .custom((urls) => {
      const isValid = urls.every((url) =>
        /^https?:\/\/[^\s$.?#].[^\s]*$/.test(url)
      );
      if (!isValid)
        throw new Error("Todos los thumbnails deben ser URLs válidas");
      return true;
    }),
  handleValidationErrors,
];

export const validateProductUpdate = [
  param("id").isMongoId().withMessage("El ID del producto no es válido"),
  body("title")
    .optional()
    .isLength({ min: 5, max: 100 })
    .withMessage("El título debe tener entre 5 y 100 caracteres"),
  body("description")
    .optional()
    .isLength({ min: 10, max: 500 })
    .withMessage("La descripción debe tener entre 10 y 500 caracteres"),
  body("code").optional().isString().withMessage("El código debe ser un texto"),
  body("price")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("El precio debe ser un número positivo"),
  body("stock")
    .optional()
    .isInt({ min: 0 })
    .withMessage("El stock debe ser un número entero positivo"),
  body("category")
    .optional()
    .isString()
    .withMessage("La categoría debe ser un texto"),
  body("thumbnails")
    .optional()
    .isArray()
    .withMessage("Thumbnails debe ser un arreglo de URLs")
    .custom((urls) => {
      const isValid = urls.every((url) =>
        /^https?:\/\/[^\s$.?#].[^\s]*$/.test(url)
      );
      if (!isValid)
        throw new Error("Todos los thumbnails deben ser URLs válidas");
      return true;
    }),
  handleValidationErrors,
];

export const validateCreateCart = [
  body("userId")
    .optional()
    .isMongoId()
    .withMessage("El ID del usuario debe ser válido"),
  handleValidationErrors,
];

export const validateAddProductToCart = [
  param("cid").isMongoId().withMessage("El ID del carrito no es válido"),
  param("pid").isMongoId().withMessage("El ID del producto no es válido"),
  body("quantity")
    .optional()
    .isInt({ min: 1 })
    .withMessage("La cantidad debe ser un número entero positivo"),
  handleValidationErrors,
];

// **Validación para la ruta de compra de carrito**
export const validateCartPurchase = [
  param("cid")
    .isMongoId()
    .withMessage("El ID del carrito debe ser un ID válido."),
  body("products")
    .optional()
    .isArray()
    .withMessage("El carrito debe ser un array de productos."),
  body("products.*.pid")
    .optional()
    .notEmpty()
    .withMessage("Cada producto debe tener un pid."),
  body("products.*.quantity")
    .optional()
    .isInt({ min: 1 })
    .withMessage(
      "La cantidad de cada producto debe ser un número entero positivo."
    ),
  handleValidationErrors,
];
