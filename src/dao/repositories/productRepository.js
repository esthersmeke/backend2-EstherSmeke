import mongoose from "mongoose";
import productModel from "../models/productModel.js";

export const findAll = async (filters = {}) => {
  try {
    return await productModel.find(filters).lean(); // Usar lean para eficiencia
  } catch (error) {
    throw new Error("Error al obtener los productos: " + error.message);
  }
};

export const getProductById = async (id) => {
  try {
    const product = await productModel.findById(id).lean();
    if (!product) {
      throw new Error(`Producto con ID ${id} no encontrado.`);
    }
    return product;
  } catch (error) {
    throw new Error(`Error al obtener el producto por ID: ${error.message}`);
  }
};

export const getProductByCode = async (code) => {
  try {
    return await productModel.findOne({ code }).lean(); // Buscar por código único
  } catch (error) {
    throw new Error(`Error al buscar producto por código: ${error.message}`);
  }
};

export const createProduct = async (productData) => {
  try {
    return await productModel.create(productData); // Crear producto directamente
  } catch (error) {
    throw new Error(`Error al crear producto: ${error.message}`);
  }
};

export const updateProduct = async (id, productData) => {
  try {
    const updatedProduct = await productModel.findByIdAndUpdate(
      id,
      productData,
      {
        new: true, // Retornar el producto actualizado
      }
    );
    if (!updatedProduct) {
      throw new Error(`Producto con ID ${id} no encontrado.`);
    }
    return updatedProduct;
  } catch (error) {
    throw new Error(
      `Error al actualizar el producto con ID ${id}: ${error.message}`
    );
  }
};

export const deleteProduct = async (id) => {
  try {
    const deletedProduct = await productModel.findByIdAndDelete(id);
    if (!deletedProduct) {
      throw new Error(`Producto con ID ${id} no encontrado.`);
    }
    return deletedProduct;
  } catch (error) {
    throw new Error(
      `Error al eliminar el producto con ID ${id}: ${error.message}`
    );
  }
};
