import React, { createContext, useState } from "react";
import PropTypes from "prop-types";
import toast from "react-hot-toast";

export const CartContext = createContext();

CartProvider.propTypes = {
  children: PropTypes.node,
};

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [carritoSolicitud, setCarritoSolicitud] = useState(null);


  const generarKey = (item) => `${item.Tipo}-${item.Id}`;

  const addItem = (producto, tipo) => {
    const nuevoItem = {
      Tipo: tipo,
      Id: tipo === "producto" ? producto.IdProducto : producto.IdCombo,
      Nombre: producto.Nombre,
      Precio: parseFloat(producto.Precio),
      Imagen: producto.Imagen,
      Cantidad: 1,
      Observaciones: "",
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
    const key = generarKey(itemBuscado);

    if (nuevaCantidad === 0) {
      removeItem(itemBuscado);
      return;
    }

    setCart((actual) =>
      actual.map((item) => (generarKey(item) === key ? { ...item, Cantidad: nuevaCantidad } : item))
    );
  };

  const updateObservaciones = (itemBuscado, observaciones) => {
    const key = generarKey(itemBuscado);
    setCart((actual) =>
      actual.map((item) => (generarKey(item) === key ? { ...item, Observaciones: observaciones } : item))
    );
  };

  const cleanCart = () => {
    setCart([]);
    setCarritoSolicitud(null);
  };

  const cargarCarrito = (items, solicitud = null) => {
    setCart(items.map((item) => ({
      Tipo: item.Tipo,
      Id: item.Tipo === "producto" ? Number(item.Id) : Number(item.IdCombo),
      Nombre: item.Nombre,
      Precio: Number(item.Precio),
      Cantidad: Number(item.Cantidad),
      Observaciones: item.Observaciones || "",
    })));
    setCarritoSolicitud(solicitud);
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
        carritoSolicitud,
        addItem,
        removeItem,
        updateCantidad,
        updateObservaciones,
        cleanCart,
        cargarCarrito,
        getTotal,
        getCantidadItems,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
