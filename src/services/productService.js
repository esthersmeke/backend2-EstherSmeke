import * as productRepository from "../dao/repositories/productRepository.js";
import productModel from "../dao/models/productModel.js";
import ProductDTO from "../dto/ProductDTO.js"; // Importa el DTO si es necesario
import { faker } from "@faker-js/faker";

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

export const getProductById = async (id) => {
  try {
    const product = await productRepository.getProductById(id);

    if (!product) {
      throw new Error(`El producto con ID ${id} no existe`);
    }

    return product;
  } catch (error) {
    throw new Error("Error al obtener el producto por ID: " + error.message);
  }
};

export const createProduct = async (productData) => {
  try {
    // Generar datos automáticos si no se proporcionan
    const generatedProduct = {
      title: productData.title || faker.commerce.productName(),
      description:
        productData.description || faker.commerce.productDescription(),
      code: productData.code || faker.string.alphanumeric(10), // Genera un code único
      price:
        productData.price ||
        parseFloat(faker.commerce.price({ min: 1, max: 1000, dec: 2 })),
      stock: productData.stock || faker.number.int({ min: 1, max: 100 }),
      category: productData.category || faker.commerce.department(),
      thumbnails: productData.thumbnails || [faker.image.url()],
    };

    // Validar si el código ya existe
    const existingProduct = await productRepository.getProductByCode(
      generatedProduct.code
    );
    if (existingProduct) {
      throw new Error("El código del producto ya existe. Intenta con otro.");
    }

    // Crear producto en la base de datos
    const product = await productRepository.createProduct(generatedProduct);

    return product;
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
