import * as productRepository from "../repositories/productRepository.js";
import productModel from "../dao/models/productModel.js";
import ProductDTO from "../dto/ProductDTO.js"; // Importa el DTO si es necesario

export const getAllProducts = async (query) => {
  try {
    const { page = 1, limit = 10, sort, order = "asc", ...filters } = query;

    // Validación de parámetros
    if (isNaN(page) || page <= 0) {
      throw new Error("El parámetro 'page' debe ser un número mayor a 0.");
    }
    if (isNaN(limit) || limit <= 0) {
      throw new Error("El parámetro 'limit' debe ser un número mayor a 0.");
    }

    const sortOption =
      sort === "price" ? { price: order === "desc" ? -1 : 1 } : {};

    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      lean: true,
      sort: sortOption,
    };

    const products = await productModel.paginate(filters, options);

    // Aplicar DTO antes de devolver los productos
    return {
      ...products,
      docs: products.docs.map((product) => new ProductDTO(product)),
    };
  } catch (error) {
    throw new Error("Error al obtener los productos: " + error.message);
  }
};

export const getProductByID = async (id) => {
  try {
    const product = await productRepository.getProductByID(id);
    if (!product) {
      throw new Error("Producto no encontrado o ID inválido.");
    }
    return new ProductDTO(product); // Aplica el DTO aquí
  } catch (error) {
    throw new Error("Error al obtener el producto: " + error.message);
  }
};

export const createProduct = async (productData) => {
  try {
    const product = await productRepository.createProduct(productData);
    return new ProductDTO(product); // Aplica el DTO aquí
  } catch (error) {
    throw new Error("Error al crear el producto: " + error.message);
  }
};

export const updateProduct = async (id, productData) => {
  try {
    const product = await productRepository.updateProduct(id, productData);
    return new ProductDTO(product); // Aplica el DTO aquí
  } catch (error) {
    throw new Error("Error al actualizar el producto: " + error.message);
  }
};

export const deleteProduct = async (id) => {
  try {
    const product = await productRepository.deleteProduct(id);
    return new ProductDTO(product); // Aplica el DTO aquí
  } catch (error) {
    throw new Error("Error al eliminar el producto: " + error.message);
  }
};
