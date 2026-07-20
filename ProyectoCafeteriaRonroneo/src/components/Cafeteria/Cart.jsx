import React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableFooter from "@mui/material/TableFooter";
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import RemoveShoppingCartIcon from "@mui/icons-material/RemoveShoppingCart";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import PropTypes from "prop-types";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Stack from "@mui/material/Stack";
import PaymentIcon from "@mui/icons-material/Payment";
import Button from "@mui/material/Button";
import { useCart } from "../../hooks/useCart";
import PedidoService from "../../services/PedidoServices";

CartItem.propTypes = {
  item: PropTypes.object,
  removeItem: PropTypes.func,
  updateCantidad: PropTypes.func,
};

const celdaCuerpo = { fontSize: 14 };

function CartItem({ item, removeItem, updateCantidad }) {
  const subtotal = Math.round(item.Precio * item.Cantidad);

  return (
    <TableRow
      sx={{
        "&:nth-of-type(odd)": { backgroundColor: "action.hover" },
        "&:last-child td, &:last-child th": { border: 0 },
      }}
    >
      <TableCell component="th" scope="row" sx={celdaCuerpo}>
        {item.Nombre}
        <Typography variant="caption" color="text.secondary" sx={{ display: "block" }}>
          {item.Tipo === "producto" ? "Producto" : "Combo"}
        </Typography>
      </TableCell>
      <TableCell sx={celdaCuerpo}>₡{item.Precio}</TableCell>
      <TableCell sx={celdaCuerpo}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
          <IconButton
            size="small"
            onClick={() => updateCantidad(item, item.Cantidad - 1)}
            disabled={item.Cantidad <= 1}
            aria-label={"Restar " + item.Nombre}
          >
            <RemoveIcon fontSize="small" />
          </IconButton>
          <Typography sx={{ minWidth: 24, textAlign: "center" }}>{item.Cantidad}</Typography>
          <IconButton
            size="small"
            onClick={() => updateCantidad(item, item.Cantidad + 1)}
            aria-label={"Sumar " + item.Nombre}
          >
            <AddIcon fontSize="small" />
          </IconButton>
        </Box>
      </TableCell>
      <TableCell sx={celdaCuerpo}>&cent;{subtotal}</TableCell>
      <TableCell align="right" sx={celdaCuerpo}>
        <Tooltip title={"Quitar " + item.Nombre}>
          <IconButton
            color="warning"
            onClick={() => removeItem(item)}
            aria-label={"Quitar " + item.Nombre}
            sx={{ ml: "auto" }}
          >
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      </TableCell>
    </TableRow>
  );
}

export function Cart() {
  const { cart, removeItem, cleanCart, getTotal, updateCantidad } = useCart();
  const navigate = useNavigate();

  const [pagoAbierto, setPagoAbierto] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [telefono, setTelefono] = useState("");
  const [direccion, setDireccion] = useState("");
  const [metodoPago, setMetodoPago] = useState("Efectivo");

  const abrirPago = () => setPagoAbierto(true);
  const cerrarPago = () => setPagoAbierto(false);

  const confirmarPedido = () => {
    const userStr = localStorage.getItem("user");

    if (!userStr || userStr === "undefined") {
      toast.error("Debes iniciar sesion para completar el pedido");
      navigate("/login");
      return;
    }

    if (!telefono || !direccion) {
      toast.error("Telefono y direccion son obligatorios");
      return;
    }

    let usuario;
    try {
      usuario = JSON.parse(userStr);
    } catch (error) {
      toast.error("Error al leer sesión");
      return;
    }

    const items = cart.map((item) => ({
      IdProducto: item.Tipo === "producto" ? item.Id : null,
      IdCombo: item.Tipo === "combo" ? item.Id : null,
      Cantidad: item.Cantidad,
      PrecioUnitario: item.Precio,
      Subtotal: item.Precio * item.Cantidad,
    }));

    const pedido = {
      IdUsuario: usuario.IdUsuario,
      Nombre: `${usuario.Nombre} ${usuario.Apellido || ""}`.trim(),
      Correo: usuario.Correo,
      Telefono: telefono,
      Direccion: direccion,
      MetodoPago: metodoPago,
      Total: getTotal(cart),
      items,
    };

    setEnviando(true);
    PedidoService.crearPedido(pedido)
      .then(() => {
        toast.success("Pedido realizado con exito");
        cleanCart();
        cerrarPago();
      })
      .catch((error) => {
        console.log("ERROR:", error);
        toast.error("No se pudo completar el pedido");
      })
      .finally(() => setEnviando(false));
  };

  return (
    <Box sx={{ py: 2 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
        <Typography variant="h5" color="primary.main">
          Mi carrito
        </Typography>
        <Tooltip title="Vaciar carrito">
          <IconButton color="error" onClick={() => cleanCart()} aria-label="Vaciar carrito">
            <RemoveShoppingCartIcon />
          </IconButton>
        </Tooltip>
      </Box>

      <TableContainer component={Paper} variant="outlined">
        <Table sx={{ minWidth: 500 }} aria-label="Carrito de compras">
           <TableHead>
            <TableRow>
              {["Ítem", "Precio", "Cantidad", "Subtotal", "Acciones"].map((titulo, index) => (
                <TableCell
                  key={titulo}
                  align={index === 4 ? "right" : "left"}
                  sx={{ backgroundColor: "primary.light", color: "common.white", fontSize: 16 }}
                >
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
              />
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell
                colSpan={3}
                align="right"
                sx={{ backgroundColor: "primary.main", color: "common.white", fontSize: 16 }}
              >
                <Typography variant="subtitle1" gutterBottom>
                  Total
                </Typography>
              </TableCell>
              <TableCell colSpan={2} sx={{ backgroundColor: "primary.main", color: "common.white", fontSize: 16 }}>
                <Typography variant="subtitle1" gutterBottom>
                  &cent;{getTotal(cart)}
                </Typography>
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
        </TableContainer>

      <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
        <Button variant="contained" color="secondary" size="large" startIcon={<PaymentIcon />} onClick={abrirPago} sx={{ fontWeight: 700 }}>
          Proceder al pago
        </Button>
      </Box>

      <Dialog open={pagoAbierto} onClose={cerrarPago} maxWidth="sm" fullWidth>
        <DialogTitle>Datos de entrega y pago</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="Telefono"
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
              fullWidth
              required
            />
            <TextField
              label="Direccion"
              value={direccion}
              onChange={(e) => setDireccion(e.target.value)}
              fullWidth
              multiline
              minRows={2}
              required
            />
            <TextField
              label="Metodo de pago"
              select
              value={metodoPago}
              onChange={(e) => setMetodoPago(e.target.value)}
              fullWidth
            >
              <MenuItem value="Efectivo">Efectivo</MenuItem>
              <MenuItem value="Tarjeta">Tarjeta</MenuItem>
            </TextField>
            <Typography variant="subtitle1" align="right">
              Total a pagar: &cent;{getTotal(cart)}
            </Typography>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={cerrarPago} color="inherit">
            Cancelar
          </Button>
          <Button onClick={confirmarPedido} variant="contained" color="secondary" disabled={enviando} sx={{ fontWeight: 700 }}>
            {enviando ? "Procesando..." : "Confirmar pedido"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}