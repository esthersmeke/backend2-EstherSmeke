import * as productRepository from "../dao/repositories/productRepository.js";
import ProductDTO from "../dto/ProductDTO.js"; // DTO para estructurar los datos de producto
import { faker } from "@faker-js/faker";

// Obtener todos los productos con filtros aplicados
export const getAllProducts = async (filter = {}) => {
  try {
    const products = await productRepository.findAll(filter);
    return products.map((product) => new ProductDTO(product)); // Transformar productos a DTO
  } catch (error) {
    throw new Error(`Error al obtener los productos: ${error.message}`);
  }
};

// Obtener un producto por su ID
export const getProductById = async (id) => {
  try {
    const product = await productRepository.getProductById(id);
    if (!product) {
      throw new Error(`El producto con ID ${id} no existe`);
    }
    return new ProductDTO(product); // Estructurar el producto con ProductDTO
  } catch (error) {
    throw new Error("Error al obtener el producto por ID: " + error.message);
  }
};

// Crear un nuevo producto
export const createProduct = async (productData) => {
  try {
    // Generar datos automáticos si no se proporcionan
    const generatedProduct = {
      title: productData.title || faker.commerce.productName(),
      description:
        productData.description || faker.commerce.productDescription(),
      code: productData.code || faker.string.alphanumeric(10),
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

    return new ProductDTO(product); // Estructurar el producto con ProductDTO
  } catch (error) {
    throw new Error("Error al crear el producto: " + error.message);
  }
};

// Actualizar un producto existente
export const updateProduct = async (id, productData) => {
  try {
    const updatedProduct = await productRepository.updateProduct(
      id,
      productData
    );
    if (!updatedProduct) {
      throw new Error(`Producto con ID ${id} no encontrado.`);
    }
    return new ProductDTO(updatedProduct); // Estructurar el producto con ProductDTO
  } catch (error) {
    throw new Error("Error al actualizar el producto: " + error.message);
  }
};

// Eliminar un producto por su ID
export const deleteProduct = async (id) => {
  try {
    const deletedProduct = await productRepository.deleteProduct(id);
    if (!deletedProduct) {
      throw new Error(`Producto con ID ${id} no encontrado.`);
    }
    return { message: "Producto eliminado correctamente." };
  } catch (error) {
    throw new Error("Error al eliminar el producto: " + error.message);
  }
};

// Agregar producto al carrito
export const addProductToCart = async (cid, pid) => {
  try {
    const product = await productRepository.getProductById(pid);

    if (!product || product.status === false) {
      throw new Error(
        `El producto con ID ${pid} no está disponible o no existe.`
      );
    }

    const cart = await cartRepository.addProductToCart(cid, pid);
    return cart; // Transformar si es necesario en niveles superiores
  } catch (error) {
    throw new Error(
      `Error al agregar el producto al carrito: ${error.message}`
    );
  }
};
