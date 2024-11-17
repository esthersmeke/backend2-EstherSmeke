import * as productRepository from "../repositories/productRepository.js";
import productModel from "../dao/models/productModel.js"; // Asegúrate de que esta ruta sea correcta

export const getAllProducts = async (query) => {
  try {
    // Extracción de parámetros con valores predeterminados
    const { page = 1, limit = 10, sort, order = "asc", ...filters } = query;

    // Validar y configurar la opción de orden
    const sortOption =
      sort === "price" ? { price: order === "desc" ? -1 : 1 } : {};

    // Configuración de paginación y filtros
    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      lean: true, // Devuelve objetos JSON en lugar de documentos de Mongoose
      sort: sortOption,
    };

    // Realizar la consulta con filtros, paginación y orden
    const products = await productModel.paginate(filters, options);
    return products;
  } catch (error) {
    throw new Error("Error al obtener los productos: " + error.message);
  }
};

// Obtener un producto por ID
export const getProductByID = async (id) => {
  try {
    const product = await productRepository.getProductByID(id);
    if (!product) {
      throw new Error(`El producto con ID ${id} no existe`);
    }
    return product;
  } catch (error) {
    if (error.message.includes("Cast to ObjectId failed")) {
      throw new Error(`El ID ${id} es inválido`);
    }
    throw new Error("El ID del producto es inexistente");
  }
};

// Crear un nuevo producto
export const createProduct = async (productData) => {
  try {
    return await productRepository.createProduct(productData);
  } catch (error) {
    throw new Error("Error al crear el producto: " + error.message);
  }
};

// Actualizar un producto por ID
export const updateProduct = async (id, productData) => {
  try {
    return await productRepository.updateProduct(id, productData);
  } catch (error) {
    throw new Error("Error al actualizar el producto: " + error.message);
  }
};

// Eliminar un producto por ID
export const deleteProduct = async (id) => {
  try {
    return await productRepository.deleteProduct(id);
  } catch (error) {
    throw new Error("Error al eliminar el producto: " + error.message);
  }
};
