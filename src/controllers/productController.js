import * as productService from "../services/productService.js";
import ProductDTO from "../dto/ProductDTO.js";
import jwt from "jsonwebtoken";

// Obtener todos los productos (pública)
export const getAllProducts = async (req, res) => {
  try {
    const products = await productService.getAllProducts(req.query);

    if (!products.docs || !products.docs.length) {
      return res.status(404).json({
        status: "error",
        message: "No se encontraron productos para los criterios aplicados",
      });
    }

    // Verificar si el usuario está autenticado para personalizar la vista
    let user = null;
    if (req.cookies && req.cookies.currentUser) {
      try {
        const token = req.cookies.currentUser;
        user = jwt.verify(token, process.env.JWT_SECRET);
      } catch (error) {
        console.log("Error al verificar el token:", error.message);
      }
    }

    // Si el cliente solicita JSON (Postman u otra API tool)
    if (req.headers.accept && req.headers.accept.includes("application/json")) {
      return res.status(200).json({
        status: "success",
        payload: products.docs.map((product) => new ProductDTO(product)),
        user,
      });
    }

    // Renderizar vista en caso de navegador
    res.render("products", {
      products: products.docs.map((product) => new ProductDTO(product)),
      user,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Error al obtener los productos: " + error.message,
    });
  }
};

// Obtener producto por ID
export const getProductByID = async (req, res) => {
  try {
    const { pid } = req.params;

    const product = await productService.getProductByID(pid);

    if (!product) {
      return res.status(404).json({
        status: "error",
        message: "Producto no encontrado",
      });
    }

    res
      .status(200)
      .json({ status: "success", payload: new ProductDTO(product) });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Error al obtener el producto por ID: " + error.message,
    });
  }
};

// Crear producto (solo admin)
export const createProduct = async (req, res) => {
  try {
    const newProduct = await productService.createProduct(req.body);

    res
      .status(201)
      .json({ status: "success", payload: new ProductDTO(newProduct) });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: "Error al crear el producto: " + error.message,
    });
  }
};

// Actualizar producto (solo admin)
export const updateProduct = async (req, res) => {
  try {
    const updatedProduct = await productService.updateProduct(
      req.params.pid,
      req.body
    );

    res.status(200).json({
      status: "success",
      payload: new ProductDTO(updatedProduct),
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: "Error al actualizar el producto: " + error.message,
    });
  }
};

// Eliminar producto (solo admin)
export const deleteProduct = async (req, res) => {
  try {
    const deletedProduct = await productService.deleteProduct(req.params.pid);

    res.status(200).json({
      status: "success",
      payload: new ProductDTO(deletedProduct),
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: "Error al eliminar el producto: " + error.message,
    });
  }
};
