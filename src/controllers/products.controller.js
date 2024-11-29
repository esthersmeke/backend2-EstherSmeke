import * as ProductService from "../services/productService.js";
import ProductDTO from "../dto/ProductDTO.js";

// Obtener todos los productos con paginación y filtros
export const getAllProducts = async (req, res) => {
  try {
    const { page = 1, limit = 10, sort, category } = req.query;
    const filters = {};

    if (category) filters.category = category;

    const products = await ProductService.getAllProducts(filters, {
      page,
      limit,
      sort,
    });

    if (!products.docs || products.docs.length === 0) {
      return res.status(404).json({
        status: "error",
        message: "No se encontraron productos para los criterios aplicados",
      });
    }

    const payload = products.docs.map((product) => new ProductDTO(product));
    res
      .status(200)
      .json({ status: "success", payload, totalPages: products.totalPages });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Error al obtener los productos: " + error.message,
    });
  }
};

// Obtener un producto por ID
export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await ProductService.getProductById(id);

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
      message: "Error al obtener el producto: " + error.message,
    });
  }
};

// Crear un nuevo producto
export const createProduct = async (req, res) => {
  try {
    const productData = req.body;

    // Delegamos completamente al servicio
    const newProduct = await ProductService.createProduct(productData);

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

// Actualizar un producto por ID
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const updatedProduct = await ProductService.updateProduct(id, updates);

    if (!updatedProduct) {
      return res
        .status(404)
        .json({ status: "error", message: "Producto no encontrado" });
    }

    res
      .status(200)
      .json({ status: "success", payload: new ProductDTO(updatedProduct) });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: "Error al actualizar el producto: " + error.message,
    });
  }
};

// Eliminar un producto por ID
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedProduct = await ProductService.deleteProduct(id);

    if (!deletedProduct) {
      return res
        .status(404)
        .json({ status: "error", message: "Producto no encontrado" });
    }

    res
      .status(200)
      .json({ status: "success", payload: new ProductDTO(deletedProduct) });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Error al eliminar el producto: " + error.message,
    });
  }
};
