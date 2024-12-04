document.addEventListener("DOMContentLoaded", () => {
  // Obtener el ID del carrito desde un elemento oculto en el DOM
  const cartId = document.getElementById("cart-id")?.value;

  if (!cartId) {
    console.error("Error: No se pudo cargar el carrito.");
    return;
  }

  // Seleccionar todos los botones de "Añadir al carrito"
  const addToCartButtons = document.querySelectorAll(".btn-add-to-cart");

  // Añadir evento a cada botón para manejar la acción de agregar al carrito
  addToCartButtons.forEach((button) => {
    button.addEventListener("click", async (event) => {
      event.preventDefault(); // Evitar el comportamiento predeterminado del botón
      const productId = button.getAttribute("data-id"); // Obtener el ID del producto

      try {
        // Enviar solicitud al servidor para añadir el producto al carrito
        const response = await fetch(
          `/api/carts/${cartId}/products/${productId}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ quantity: 1 }), // Cantidad fija en 1 al añadir
            credentials: "include",
          }
        );

        if (response.ok) {
          alert("¡Producto añadido al carrito!"); // Confirmación al usuario
        } else {
          const errorData = await response.json();
          alert(errorData.message || "Error al añadir el producto."); // Error del servidor
        }
      } catch (error) {
        console.error("Error al conectar con el servidor:", error.message); // Error de conexión
        alert("Error de conexión.");
      }
    });
  });
});
