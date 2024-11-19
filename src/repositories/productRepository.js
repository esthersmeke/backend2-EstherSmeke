import productModel from "../dao/models/productModel.js";

// Obtener todos los productos con filtros, paginación y orden
export const getAllProducts = async (filters, options) => {
  try {
    const products = await productModel.paginate(filters, options);
    return products;
  } catch (error) {
    throw new Error("Error al obtener los productos: " + error.message);
  }
};

// Obtener un producto por ID
export const getProductByID = async (id) => {
  try {
    const product = await productModel.findById(id);
    if (!product) {
      throw new Error("Producto no encontrado");
    }
    return product;
  } catch (error) {
    throw new Error("Error al obtener el producto por ID: " + error.message);
  }
};

// Crear un nuevo producto
export const createProduct = async (productData) => {
  try {
    const newProduct = await productModel.create(productData);
    return newProduct;
  } catch (error) {
    if (error.code === 11000) {
      // Código de error de MongoDB para duplicados
      throw new Error("El código del producto ya existe. Intenta con otro.");
    }
    throw new Error("Error al crear el producto: " + error.message);
  }
};

// Actualizar un producto por ID
export const updateProduct = async (id, productData) => {
  try {
    const updatedProduct = await productModel.findByIdAndUpdate(
      id,
      productData,
      { new: true }
    );
    if (!updatedProduct) {
      throw new Error("Producto no encontrado");
    }
    return updatedProduct;
  } catch (error) {
    throw new Error("Error al actualizar el producto: " + error.message);
  }
};

// Eliminar un producto por ID
export const deleteProduct = async (id) => {
  try {
    const deletedProduct = await productModel.findByIdAndDelete(id);
    if (!deletedProduct) {
      throw new Error("Producto no encontrado");
    }
    return deletedProduct;
  } catch (error) {
    throw new Error("Error al eliminar el producto: " + error.message);
  }
};
