class ProductDTO {
  constructor(product) {
    this._id = product._id;
    this.title = product.title || "Título no disponible"; // Valor por defecto
    this.description = product.description || "Descripción no disponible"; // Valor por defecto
    this.price = product.price || 0; // Si el precio no está disponible, se asigna 0
    this.stock = product.stock || 0; // Si el stock no está disponible, se asigna 0
    this.category = product.category || "Categoría no disponible"; // Valor por defecto
    this.thumbnails =
      product.thumbnails && product.thumbnails.length > 0
        ? product.thumbnails
        : ["default-thumbnail.jpg"]; // Valor por defecto
  }
}

export default ProductDTO;
