import React from "react";
import PropTypes from "prop-types";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import RemoveIcon from "@mui/icons-material/Remove";
import RemoveShoppingCartIcon from "@mui/icons-material/RemoveShoppingCart";
import ShoppingCartCheckoutIcon from "@mui/icons-material/ShoppingCartCheckout";
import {
  Box,
  Button,
  IconButton,
  MenuItem,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useCart } from "../../hooks/useCart";
import PedidoService from "../../services/PedidoServices";

CartItem.propTypes = {
  item: PropTypes.object.isRequired,
  removeItem: PropTypes.func.isRequired,
  updateCantidad: PropTypes.func.isRequired,
  updateObservaciones: PropTypes.func.isRequired,
};

const celdaCuerpo = { fontSize: 14 };

function CartItem({ item, removeItem, updateCantidad, updateObservaciones }) {
  const subtotal = Math.round(item.Precio * item.Cantidad);

  return (
    <TableRow sx={{ "&:nth-of-type(odd)": { backgroundColor: "action.hover" } }}>
      <TableCell component="th" scope="row" sx={celdaCuerpo}>
        {item.Nombre}
        <Typography variant="caption" color="text.secondary" sx={{ display: "block" }}>
          {item.Tipo === "producto" ? "Producto" : "Combo"}
        </Typography>
      </TableCell>
      <TableCell sx={celdaCuerpo}>₡{Math.round(item.Precio)}</TableCell>
      <TableCell sx={celdaCuerpo}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
          <IconButton
            size="small"
            onClick={() => updateCantidad(item, item.Cantidad - 1)}
            disabled={item.Cantidad <= 1}
            aria-label={`Restar ${item.Nombre}`}
          >
            <RemoveIcon fontSize="small" />
          </IconButton>
          <Typography sx={{ minWidth: 24, textAlign: "center" }}>{item.Cantidad}</Typography>
          <IconButton
            size="small"
            onClick={() => updateCantidad(item, item.Cantidad + 1)}
            aria-label={`Sumar ${item.Nombre}`}
          >
            <AddIcon fontSize="small" />
          </IconButton>
        </Box>
      </TableCell>
      <TableCell sx={celdaCuerpo}>₡{subtotal}</TableCell>
      <TableCell sx={{ minWidth: 220 }}>
        <TextField
          label="Observaciones"
          size="small"
          value={item.Observaciones || ""}
          onChange={(event) => updateObservaciones(item, event.target.value)}
          fullWidth
        />
      </TableCell>
      <TableCell align="right" sx={celdaCuerpo}>
        <Tooltip title={`Quitar ${item.Nombre}`}>
          <IconButton color="error" onClick={() => removeItem(item)} aria-label={`Quitar ${item.Nombre}`}>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      </TableCell>
    </TableRow>
  );
}

export function Cart() {
  const { cart, carritoSolicitud, removeItem, cleanCart, getTotal, updateCantidad, updateObservaciones } = useCart();
  const navigate = useNavigate();
  const [enviando, setEnviando] = React.useState(false);
  const [metodoEntrega, setMetodoEntrega] = React.useState("Recogida en tienda");
  const [direccionEntrega, setDireccionEntrega] = React.useState("");
  const [metodoPago, setMetodoPago] = React.useState("Efectivo");

  const userStr = localStorage.getItem("user");
  const usuario = userStr && userStr !== "undefined" ? JSON.parse(userStr) : null;
  const esPersonal = usuario?.Rol === "Encargado" || usuario?.Rol === "Administrador";

  const enviarCarrito = () => {
    if (metodoEntrega === "Entrega a domicilio" && !direccionEntrega.trim()) {
      toast.error("Debe indicar la dirección de entrega");
      return;
    }

    const items = cart.map((item) => ({
      IdProducto: item.Tipo === "producto" ? item.Id : null,
      IdCombo: item.Tipo === "combo" ? item.Id : null,
      Cantidad: item.Cantidad,
      Observaciones: item.Observaciones || "",
    }));

    setEnviando(true);
    PedidoService.enviarCarrito({
      IdUsuario: usuario.IdUsuario,
      MetodoEntrega: metodoEntrega,
      DireccionEntrega: metodoEntrega === "Entrega a domicilio" ? direccionEntrega.trim() : "",
      MetodoPago: metodoPago,
      items,
    })
      .then(() => {
        toast.success("Carrito enviado al encargado");
        cleanCart();
      })
      .catch((error) => toast.error(`No se pudo enviar el carrito: ${error.message}`))
      .finally(() => setEnviando(false));
  };

  return (
    <Box sx={{ py: 2 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
        <Typography variant="h4">Carrito</Typography>
        {cart.length > 0 && (
          <Tooltip title="Vaciar carrito">
            <IconButton color="error" onClick={cleanCart} aria-label="Vaciar carrito">
              <RemoveShoppingCartIcon />
            </IconButton>
          </Tooltip>
        )}
      </Box>

      {cart.length === 0 ? (
        <Typography color="text.secondary">El carrito está vacío.</Typography>
      ) : (
        <>
          <TableContainer component={Paper} variant="outlined">
            <Table sx={{ minWidth: 800 }} aria-label="Carrito de compras">
              <TableHead>
                <TableRow>
                  {['Ítem', 'Precio', 'Cantidad', 'Subtotal', 'Observaciones', 'Acciones'].map((titulo) => (
                    <TableCell key={titulo} sx={{ backgroundColor: "primary.light", fontWeight: 700 }}>
                      {titulo}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {cart.map((item) => (
                  <CartItem
                    key={`${item.Tipo}-${item.Id}`}
                    item={item}
                    removeItem={removeItem}
                    updateCantidad={updateCantidad}
                    updateObservaciones={updateObservaciones}
                  />
                ))}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TableCell colSpan={3} align="right">
                    <Typography variant="subtitle1" fontWeight={700}>Total</Typography>
                  </TableCell>
                  <TableCell colSpan={3}>
                    <Typography variant="subtitle1" fontWeight={700}>₡{getTotal(cart)}</Typography>
                  </TableCell>
                </TableRow>
              </TableFooter>
            </Table>
          </TableContainer>

          {esPersonal ? (
            <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
              <Button
                variant="contained"
                color="secondary"
                size="large"
                startIcon={<ShoppingCartCheckoutIcon />}
                onClick={() => navigate("/registrar-pedido", { state: carritoSolicitud })}
              >
                Continuar con el pedido
              </Button>
            </Box>
          ) : (
            <Box sx={{ mt: 2, px: 2, py: 1.5, backgroundColor: "#ead8bd", borderRadius: 2 }}>
              <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", mb: 2 }}>
                <TextField
                  label="Método de entrega"
                  select
                  size="small"
                  value={metodoEntrega}
                  onChange={(event) => setMetodoEntrega(event.target.value)}
                  sx={{ minWidth: 220 }}
                >
                  <MenuItem value="Recogida en tienda">Recogida en tienda</MenuItem>
                  <MenuItem value="Entrega a domicilio">Entrega a domicilio</MenuItem>
                </TextField>
                <TextField
                  label="Método de pago"
                  select
                  size="small"
                  value={metodoPago}
                  onChange={(event) => setMetodoPago(event.target.value)}
                  sx={{ minWidth: 200 }}
                >
                  <MenuItem value="Efectivo">Efectivo</MenuItem>
                  <MenuItem value="Tarjeta">Tarjeta</MenuItem>
                </TextField>
              </Box>
              {metodoEntrega === "Entrega a domicilio" && (
                <TextField
                  label="Dirección de entrega"
                  value={direccionEntrega}
                  onChange={(event) => setDireccionEntrega(event.target.value)}
                  fullWidth
                  multiline
                  minRows={2}
                  sx={{ mb: 2 }}
                />
              )}
              <Typography color="text.secondary" sx={{ mb: 1 }}>
                Un encargado recibirá el carrito y confirmará el pedido.
              </Typography>
              <Button variant="contained" color="secondary" onClick={enviarCarrito} disabled={enviando}>
                {enviando ? "Confirmando..." : "Confirmar carrito"}
              </Button>
            </Box>
          )}
        </>
      )}
    </Box>
  );
}
