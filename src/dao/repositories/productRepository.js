import productModel from "../models/productModel.js";

export const getProductByCode = async (code) => {
  try {
    const product = await productModel.findOne({ code });
    return product;
  } catch (error) {
    throw new Error("Error al buscar producto por código: " + error.message);
  }
};

export const findAll = async (filters, options) => {
  try {
    const products = await productModel.paginate(filters, options);
    return products;
  } catch (error) {
    throw new Error("Error al obtener los productos: " + error.message);
  }
};

export const getProductById = async (id) => {
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

export const createProduct = async (productData) => {
  try {
    const newProduct = await productModel.create(productData);
    return newProduct;
  } catch (error) {
    if (error.code === 11000) {
      throw new Error("El código del producto ya existe. Intenta con otro.");
    }
    throw new Error("Error al crear el producto: " + error.message);
  }
};

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
