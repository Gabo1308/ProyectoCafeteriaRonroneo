import React, { useEffect, useState } from "react";
import { Box, Button, Card, CardContent, Grid, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useCart } from "../../hooks/useCart";
import PedidoService from "../../services/PedidoServices";

export function CarritosPendientes() {
  const [carritos, setCarritos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [atendiendo, setAtendiendo] = useState(null);
  const { cargarCarrito } = useCart();
  const navigate = useNavigate();

  const usuario = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    PedidoService.getCarritosPendientes(usuario.IdUsuario)
      .then((response) => setCarritos(response.data || []))
      .catch((error) => toast.error(`No se pudieron cargar los carritos: ${error.message}`))
      .finally(() => setCargando(false));
  }, []);

  const atenderCarrito = (idCarrito) => {
    setAtendiendo(idCarrito);
    PedidoService.atenderCarrito({ IdCarrito: idCarrito, IdUsuario: usuario.IdUsuario })
      .then((response) => {
        const solicitud = {
          IdCarrito: response.data.IdCarrito,
          IdCliente: response.data.IdCliente,
          MetodoEntrega: response.data.MetodoEntrega,
          DireccionEntrega: response.data.DireccionEntrega,
          CostoEnvio: response.data.CostoEnvio,
          MetodoPago: response.data.MetodoPago,
          MontoRecibido: response.data.MontoRecibido,
          TarjetaUltimos4: response.data.TarjetaUltimos4,
          PagoConfirmado: Number(response.data.PagoConfirmado),
        };
        cargarCarrito(response.data.Items || [], solicitud);
        navigate("/carrito", {
          state: solicitud,
        });
      })
      .catch((error) => toast.error(`No se pudo atender el carrito: ${error.message}`))
      .finally(() => setAtendiendo(null));
  };

  if (cargando) {
    return <Typography sx={{ py: 2 }}>Cargando carritos...</Typography>;
  }

  return (
    <Box sx={{ py: 2 }}>
      <Typography variant="h4" sx={{ mb: 2 }}>Carritos recibidos</Typography>

      {carritos.length === 0 ? (
        <Typography color="text.secondary">No hay carritos pendientes.</Typography>
      ) : (
        <Grid container spacing={2}>
          {carritos.map((carrito) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={carrito.IdCarrito}>
              <Card variant="outlined" sx={{ borderRadius: 2 }}>
                <CardContent>
                  <Typography variant="h6">Carrito #{carrito.IdCarrito}</Typography>
                  <Typography>Cliente: {carrito.ClienteNombre}</Typography>
                  {carrito.Combos && (
                    <Box sx={{ mt: 1.5 }}>
                      <Typography variant="subtitle2" fontWeight={700}>Combo(s)</Typography>
                      {carrito.Combos.split('|').map((combo) => (
                        <Typography variant="body2" key={combo}>• {combo}</Typography>
                      ))}
                    </Box>
                  )}
                  {carrito.Productos && (
                    <Box sx={{ mt: 1.5 }}>
                      <Typography variant="subtitle2" fontWeight={700}>Producto(s)</Typography>
                      {carrito.Productos.split('|').map((producto) => (
                        <Typography variant="body2" key={producto}>• {producto}</Typography>
                      ))}
                    </Box>
                  )}
                  <Button
                    variant="contained"
                    color="secondary"
                    fullWidth
                    sx={{ mt: 2 }}
                    disabled={atendiendo === carrito.IdCarrito}
                    onClick={() => atenderCarrito(carrito.IdCarrito)}
                  >
                    {atendiendo === carrito.IdCarrito
                      ? "Cargando..."
                      : carrito.EstadoSolicitud === "En revision" ? "Continuar" : "Atender carrito"}
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}
