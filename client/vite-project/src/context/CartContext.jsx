import { createContext, useState } from "react";
import { useEffect } from "react";



export const CartContext =
  createContext();

export const CartProvider = ({
  children,
}) => {
  const [cart, setCart] = useState(() => {
  const saved =
    localStorage.getItem("cart");

  return saved
    ? JSON.parse(saved)
    : [];
});
useEffect(() => {
  localStorage.setItem(
    "cart",
    JSON.stringify(cart)
  );
}, [cart]);
const clearCart = () => {
  setCart([]);
  localStorage.removeItem("cart");
};

  const addToCart = (product) => {
    if (!product) return;
    if (product.inStock === false || (product.stock !== undefined && Number(product.stock) <= 0)) {
      console.warn("Cannot add out of stock product to cart:", product.name);
      return false;
    }
    const exists = cart.find(
      (item) =>
        item._id === product._id
    );

    if (exists) {
      setCart(
        cart.map((item) =>
          item._id === product._id
            ? {
                ...item,
                quantity:
                  item.quantity + 1,
              }
            : item
        )
      );
    } else {
      setCart([
        ...cart,
        {
          ...product,
          quantity: 1,
        },
      ]);
    }
  };

  const removeFromCart = (id) => {
    setCart(
      cart.filter(
        (item) => item._id !== id
      )
    );
  };
  const increaseQuantity = (id) => {
  setCart(
    cart.map((item) =>
      item._id === id
        ? {
            ...item,
            quantity:
              item.quantity + 1,
          }
        : item
    )
  );
};

const decreaseQuantity = (id) => {
  setCart(
    cart
      .map((item) =>
        item._id === id
          ? {
              ...item,
              quantity:
                item.quantity - 1,
            }
          : item
      )
      .filter(
        (item) => item.quantity > 0
      )
  );
};

  
    return (
  <CartContext.Provider
    value={{
      cart,
      addToCart,
      removeFromCart,
      increaseQuantity,
      decreaseQuantity,
      clearCart,
    }}
  >
      {children}
    </CartContext.Provider>
  );
};

