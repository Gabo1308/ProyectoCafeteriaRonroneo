import React, { createContext, useState } from "react";
import PropTypes from "prop-types";
import toast from "react-hot-toast";

export const CartContext = createContext();

CartProvider.propTypes = {
  children: PropTypes.node,
};

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);


  const generarKey = (item) => `${item.Tipo}-${item.Id}`;

  const addItem = (producto, tipo) => {
    const nuevoItem = {
      Tipo: tipo,
      Id: tipo === "producto" ? producto.IdProducto : producto.IdCombo,
      Nombre: producto.Nombre,
      Precio: parseFloat(producto.Precio),
      Imagen: producto.Imagen,
      Cantidad: 1,
    };

    setCart((actual) => {
      const key = generarKey(nuevoItem);
      const existe = actual.find((item) => generarKey(item) === key);

      if (existe) {
        return actual.map((item) =>
          generarKey(item) === key ? { ...item, Cantidad: item.Cantidad + 1 } : item
        );
      }

      return [...actual, nuevoItem];
    });

    toast.success(`${producto.Nombre} agregado al carrito`);
  };

  const removeItem = (itemBuscado) => {
    const key = generarKey(itemBuscado);
    setCart((actual) => actual.filter((item) => generarKey(item) !== key));
  };

  const updateCantidad = (itemBuscado, nuevaCantidad) => {
    if (nuevaCantidad < 1) return;

    const key = generarKey(itemBuscado);
    setCart((actual) =>
      actual.map((item) => (generarKey(item) === key ? { ...item, Cantidad: nuevaCantidad } : item))
    );
  };

  const cleanCart = () => {
    setCart([]);
  };

  const getTotal = (listaCarrito = cart) => {
    return Math.round(listaCarrito.reduce((total, item) => total + item.Precio * item.Cantidad, 0));
  };

  const getCantidadItems = () => {
    return cart.reduce((total, item) => total + item.Cantidad, 0);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addItem,
        removeItem,
        updateCantidad,
        cleanCart,
        getTotal,
        getCantidadItems,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}