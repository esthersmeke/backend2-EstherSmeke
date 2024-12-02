import { param, body, validationResult } from "express-validator";

// Middleware para manejar errores de validación
export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      status: "error",
      errors: errors.array().map((err) => ({
        param: err.param,
        message: err.msg,
      })),
    });
  }
  next();
};

// Validar que un parámetro sea un ID de MongoDB válido
export const validateMongoId = (paramName) => [
  param(paramName)
    .isMongoId()
    .withMessage(`${paramName} debe ser un ID de MongoDB válido.`),
  handleValidationErrors,
];

// Validación para el código único de producto
export const validateProductCode = [
  body("code")
    .optional()
    .isAlphanumeric()
    .withMessage("El código debe contener solo caracteres alfanuméricos."),
  handleValidationErrors,
];

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

// Validaciones para creación de productos
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

// Validación para crear un carrito
export const validateCreateCart = [
  body("userId")
    .exists()
    .withMessage("El ID del usuario es obligatorio.")
    .isMongoId()
    .withMessage("El ID del usuario debe ser un ID válido."),
];

// Validación para agregar un producto al carrito
export const validateAddProductToCart = [
  param("pid")
    .exists()
    .withMessage("El ID del producto es obligatorio.")
    .isMongoId()
    .withMessage("El ID del producto debe ser un ID válido."),
  param("cid")
    .exists()
    .withMessage("El ID del carrito es obligatorio.")
    .isMongoId()
    .withMessage("El ID del carrito debe ser un ID válido."),
];

// Validación para actualizar la cantidad de un producto en el carrito
export const validateUpdateProductQuantity = [
  param("cid")
    .exists()
    .withMessage("El ID del carrito es obligatorio.")
    .isMongoId()
    .withMessage("El ID del carrito debe ser un ID válido."),
  param("pid")
    .exists()
    .withMessage("El ID del producto es obligatorio.")
    .isMongoId()
    .withMessage("El ID del producto debe ser un ID válido."),
  body("quantity")
    .exists()
    .withMessage("La cantidad es obligatoria.")
    .isInt({ gt: 0 })
    .withMessage("La cantidad debe ser mayor a 0."),
];

// Validación para procesar la compra de un carrito
export const validateCartPurchase = [
  param("cid")
    .exists()
    .withMessage("El ID del carrito es obligatorio.")
    .isMongoId()
    .withMessage("El ID del carrito debe ser un ID válido."),
];

// Validar creación de un ticket
export const validateCreateTicket = [
  body("amount")
    .exists()
    .withMessage("El monto es obligatorio.")
    .isFloat({ gt: 0 })
    .withMessage("El monto debe ser un número mayor a 0."),
  body("purchaser")
    .exists()
    .withMessage("El correo del comprador es obligatorio.")
    .isEmail()
    .withMessage("El correo debe ser válido."),
  handleValidationErrors,
];

// Validar actualización de un ticket
export const validateUpdateTicket = [
  param("id").isMongoId().withMessage("El ID del ticket no es válido."),
  body("status")
    .optional()
    .isIn(["pendiente", "completada", "cancelada"])
    .withMessage("El estado debe ser válido."),
  handleValidationErrors,
];
