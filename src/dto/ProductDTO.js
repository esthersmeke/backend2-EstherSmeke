class ProductDTO {
  constructor(product) {
    this.id = product._id; // Convierte el ID de MongoDB
    this.title = product.title;
    this.description = product.description;
    this.price = product.price;
    this.stock = product.stock;
    this.category = product.category;
    this.thumbnails = product.thumbnails || [];
  }
}

export default ProductDTO;
