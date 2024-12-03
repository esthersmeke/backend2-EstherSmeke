document.addEventListener("DOMContentLoaded", () => {
  const cartId = document.getElementById("cart-id")?.value;
  if (!cartId) {
    console.error("Error: No se pudo cargar el carrito.");
    return;
  }

  const addToCartButtons = document.querySelectorAll(".btn-add-to-cart");

  addToCartButtons.forEach((button) => {
    button.addEventListener("click", async (event) => {
      event.preventDefault();
      const productId = button.getAttribute("data-id");

      try {
        const response = await fetch(
          `/api/carts/${cartId}/products/${productId}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ quantity: 1 }),
            credentials: "include",
          }
        );

        if (response.ok) {
          alert("¡Producto añadido al carrito!");
        } else {
          const errorData = await response.json();
          alert(errorData.message || "Error al añadir el producto.");
        }
      } catch (error) {
        console.error("Error al conectar con el servidor:", error.message);
        alert("Error de conexión.");
      }
    });
  });
});
