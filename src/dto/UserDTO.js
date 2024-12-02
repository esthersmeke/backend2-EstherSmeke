class UserDTO {
  constructor(user) {
    this.id = user.id || user._id; // Asegura que siempre haya un ID
    this.first_name = user.first_name || "Nombre no disponible"; // Valor por defecto
    this.last_name = user.last_name || "Apellido no disponible"; // Valor por defecto
    this.email = user.email || "Email no disponible"; // Valor por defecto
    this.age = user.age || "Edad no disponible"; // Valor por defecto
    this.role = user.role || "user"; // Valor por defecto

    // Asignar el cartId
    if (user.cart && user.cart._id) {
      this.cartId = user.cart._id.toString();
    } else if (typeof user.cart === "string") {
      this.cartId = user.cart;
    } else {
      this.cartId = "Carrito no disponible";
    }

    console.log("CartId asignado en UserDTO:", this.cartId); // Log para depuración
  }
}

export default UserDTO;
