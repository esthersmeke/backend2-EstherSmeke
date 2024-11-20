class CartDTO {
  constructor(cart) {
    this.id = cart._id;
    this.products = cart.products.map((item) => ({
      productId: item.product?._id || null, // Verifica si el producto existe
      title: item.product?.title || "Producto no disponible", // Valor por defecto
      quantity: item.quantity,
    }));
    this.totalItems = this.products.reduce(
      (sum, item) => sum + (item.quantity || 0),
      0
    );
  }
}

export default CartDTO;
