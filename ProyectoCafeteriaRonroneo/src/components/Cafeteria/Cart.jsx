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
import { useTranslation } from "react-i18next";
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
  const { t } = useTranslation();
  const subtotal = Math.round(item.Precio * item.Cantidad);

  return (
    <TableRow sx={{ "&:nth-of-type(odd)": { backgroundColor: "action.hover" } }}>
      <TableCell component="th" scope="row" sx={celdaCuerpo}>
        {item.Nombre}
        <Typography variant="caption" color="text.secondary" sx={{ display: "block" }}>
          {item.Tipo === "producto" ? t("cart.product") : t("cart.combo")}
        </Typography>
      </TableCell>
      <TableCell sx={celdaCuerpo}>₡{Math.round(item.Precio)}</TableCell>
      <TableCell sx={celdaCuerpo}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
          <IconButton
            size="small"
            onClick={() => updateCantidad(item, item.Cantidad - 1)}
            disabled={item.Cantidad <= 1}
            aria-label={t("cart.subtract", { name: item.Nombre })}
          >
            <RemoveIcon fontSize="small" />
          </IconButton>
          <Typography sx={{ minWidth: 24, textAlign: "center" }}>{item.Cantidad}</Typography>
          <IconButton
            size="small"
            onClick={() => updateCantidad(item, item.Cantidad + 1)}
            aria-label={t("cart.add", { name: item.Nombre })}
          >
            <AddIcon fontSize="small" />
          </IconButton>
        </Box>
      </TableCell>
      <TableCell sx={celdaCuerpo}>₡{subtotal}</TableCell>
      <TableCell sx={{ minWidth: 220 }}>
        <TextField
          label={t("cart.observationsLabel")}
          size="small"
          value={item.Observaciones || ""}
          onChange={(event) => updateObservaciones(item, event.target.value)}
          fullWidth
        />
      </TableCell>
      <TableCell align="right" sx={celdaCuerpo}>
        <Tooltip title={t("cart.remove", { name: item.Nombre })}>
          <IconButton color="error" onClick={() => removeItem(item)} aria-label={t("cart.remove", { name: item.Nombre })}>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      </TableCell>
    </TableRow>
  );
}

export function Cart() {
  const { t } = useTranslation();
  const { cart, carritoSolicitud, removeItem, cleanCart, getTotal, updateCantidad, updateObservaciones } = useCart();
  const navigate = useNavigate();
  const [enviando, setEnviando] = React.useState(false);
  const [metodoEntrega, setMetodoEntrega] = React.useState("Recogida en tienda");
  const [direccionEntrega, setDireccionEntrega] = React.useState("");
  const [metodoPago, setMetodoPago] = React.useState("Efectivo");
  const [montoRecibido, setMontoRecibido] = React.useState("");
  const [numeroTarjeta, setNumeroTarjeta] = React.useState("");
  const [fechaExpiracion, setFechaExpiracion] = React.useState("");
  const [cvv, setCvv] = React.useState("");

  const userStr = localStorage.getItem("user");
  const usuario = userStr && userStr !== "undefined" ? JSON.parse(userStr) : null;
  const esPersonal = usuario?.Rol === "Encargado" || usuario?.Rol === "Administrador";
  const impuestos = cart.reduce((total, item) => {
    const impuesto = Math.round(((item.Precio * item.Cantidad) * 0.13) / 5) * 5;
    return total + impuesto;
  }, 0);
  const totalDomicilio = getTotal(cart) + impuestos + 1500;

  const enviarCarrito = () => {
    if (metodoEntrega === "Entrega a domicilio" && !direccionEntrega.trim()) {
      toast.error(t("cart.errorAddress"));
      return;
    }
    if (metodoEntrega === "Entrega a domicilio" && metodoPago === "Efectivo" && Number(montoRecibido) < totalDomicilio) {
      toast.error(t("cart.errorInsufficientAmount"));
      return;
    }
    if (
      metodoEntrega === "Entrega a domicilio" &&
      metodoPago === "Tarjeta" &&
      (numeroTarjeta.replace(/\D/g, "").length !== 16 || !/^(0[1-9]|1[0-2])\/\d{2}$/.test(fechaExpiracion) || !/^\d{3,4}$/.test(cvv))
    ) {
      toast.error(t("cart.errorCardData"));
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
      MontoRecibido: metodoEntrega === "Entrega a domicilio" && metodoPago === "Efectivo" ? Number(montoRecibido) : null,
      NumeroTarjeta: metodoEntrega === "Entrega a domicilio" && metodoPago === "Tarjeta" ? numeroTarjeta : "",
      FechaExpiracion: metodoEntrega === "Entrega a domicilio" && metodoPago === "Tarjeta" ? fechaExpiracion : "",
      Cvv: metodoEntrega === "Entrega a domicilio" && metodoPago === "Tarjeta" ? cvv : "",
      items,
    })
      .then(() => {
        toast.success(t("cart.successSent"));
        cleanCart();
      })
      .catch((error) => toast.error(t("cart.errorSend", { message: error.message })))
      .finally(() => setEnviando(false));
  };

  return (
    <Box sx={{ py: 2 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
        <Typography variant="h4">{t("cart.title")}</Typography>
        {cart.length > 0 && (
          <Tooltip title={t("cart.emptyCart")}>
            <IconButton color="error" onClick={cleanCart} aria-label={t("cart.emptyCart")}>
              <RemoveShoppingCartIcon />
            </IconButton>
          </Tooltip>
        )}
      </Box>

      {cart.length === 0 ? (
        <Typography color="text.secondary">{t("cart.empty")}</Typography>
      ) : (
        <>
          <TableContainer component={Paper} variant="outlined">
            <Table sx={{ minWidth: 800 }} aria-label={t("cart.tableLabel")}>
              <TableHead>
                <TableRow>
                  {[
                    t("cart.columnItem"),
                    t("cart.columnPrice"),
                    t("cart.columnQuantity"),
                    t("cart.columnSubtotal"),
                    t("cart.columnObservations"),
                    t("cart.columnActions"),
                  ].map((titulo) => (
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
                    <Typography variant="subtitle1" fontWeight={700}>{t("cart.total")}</Typography>
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
                {t("cart.continueOrder")}
              </Button>
            </Box>
          ) : (
            <Box sx={{ mt: 2, px: 2, py: 1.5, backgroundColor: "#ead8bd", borderRadius: 2 }}>
              <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", mb: 2 }}>
                <TextField
                  label={t("cart.deliveryMethod")}
                  select
                  size="small"
                  value={metodoEntrega}
                  onChange={(event) => setMetodoEntrega(event.target.value)}
                  sx={{ minWidth: 220 }}
                >
                  <MenuItem value="Recogida en tienda">{t("cart.pickup")}</MenuItem>
                  <MenuItem value="Entrega a domicilio">{t("cart.homeDelivery")}</MenuItem>
                </TextField>
                <TextField
                  label={t("cart.paymentMethod")}
                  select
                  size="small"
                  value={metodoPago}
                  onChange={(event) => setMetodoPago(event.target.value)}
                  sx={{ minWidth: 200 }}
                >
                  <MenuItem value="Efectivo">{t("cart.cash")}</MenuItem>
                  <MenuItem value="Tarjeta">{t("cart.card")}</MenuItem>
                </TextField>
              </Box>
              {metodoEntrega === "Entrega a domicilio" && (
                <Box sx={{ mb: 2 }}>
                  <TextField
                    label={t("cart.deliveryAddress")}
                    value={direccionEntrega}
                    onChange={(event) => setDireccionEntrega(event.target.value)}
                    fullWidth
                    multiline
                    minRows={2}
                    sx={{ mb: 2 }}
                  />
                  {metodoPago === "Tarjeta" ? (
                    <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                      <TextField
                        label={t("cart.cardNumber")}
                        name="numero-tarjeta-nuevo"
                        autoComplete="new-password"
                        value={numeroTarjeta}
                        onChange={(event) => setNumeroTarjeta(event.target.value.replace(/[^0-9 ]/g, ""))}
                        inputProps={{ maxLength: 19 }}
                        sx={{ flex: "1 1 300px" }}
                      />
                      <TextField
                        label={t("cart.expirationDate")}
                        name="fecha-expiracion-nueva"
                        autoComplete="new-password"
                        placeholder="MM/AA"
                        value={fechaExpiracion}
                        onChange={(event) => setFechaExpiracion(event.target.value)}
                        sx={{ width: 190 }}
                      />
                      <TextField
                        label="CVV"
                        name="codigo-seguridad-nuevo"
                        autoComplete="new-password"
                        type="password"
                        value={cvv}
                        onChange={(event) => setCvv(event.target.value.replace(/\D/g, ""))}
                        inputProps={{ maxLength: 4 }}
                        sx={{ width: 140 }}
                      />
                    </Box>
                  ) : (
                    <TextField
                      label={t("cart.amountToPay")}
                      type="number"
                      value={montoRecibido}
                      onChange={(event) => setMontoRecibido(event.target.value)}
                      helperText={t("cart.totalWithTaxes", { amount: totalDomicilio })}
                      sx={{ minWidth: 300 }}
                    />
                  )}
                </Box>
              )}
              <Typography color="text.secondary" sx={{ mb: 1 }}>
                {t("cart.managerNotice")}
              </Typography>
              <Button variant="contained" color="secondary" onClick={enviarCarrito} disabled={enviando}>
                {enviando ? t("cart.confirming") : t("cart.confirmCart")}
              </Button>
            </Box>
          )}
        </>
      )}
    </Box>
  );
}