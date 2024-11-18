class CartDTO {
  constructor(cart) {
    this.id = cart._id; // Convertir el ID de MongoDB
    this.products = cart.products.map((item) => ({
      productId: item.product._id, // ID del producto
      title: item.product.title, // Título del producto
      quantity: item.quantity, // Cantidad en el carrito
    }));
    this.totalItems = this.products.reduce(
      (sum, item) => sum + item.quantity,
      0
    );
  }
}

export default CartDTO;
