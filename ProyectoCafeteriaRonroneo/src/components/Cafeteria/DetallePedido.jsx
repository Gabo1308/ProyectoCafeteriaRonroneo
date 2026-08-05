import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import { useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import PedidoService from '../../services/PedidoServices';

const colorEstado = (estado) => {
  switch (estado) {
    case 'Entregada':
      return 'success';
    case 'Pendiente de pago':
      return 'warning';
    case 'Procesando':
    case 'Preparación':
      return 'info';
    default:
      return 'default';
  }
};

const formatoFecha = (fecha) => {
  if (!fecha) return '';
  return new Date(fecha).toLocaleDateString('es-CR');
};

const campoFactura = (etiqueta, valor) => (
  <Box>
    <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
      {etiqueta}
    </Typography>
    <Typography variant="body1">{valor || '—'}</Typography>
  </Box>
);

export function DetallePedido() {
  const { id } = useParams();
  const [pedido, setPedido] = useState(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    PedidoService.getPedido(id)
      .then((response) => {
        setPedido(response.data);
        setLoaded(true);
      })
      .catch((err) => {
        toast.error(`No se pudo cargar el pedido: ${err.message}`);
        setLoaded(true);
      });
  }, [id]);

  if (!loaded) return <p>Cargando...</p>;

  if (!pedido) {
    return (
      <Box sx={{ py: 4 }}>
        <Typography color="text.secondary">No se encontró el pedido solicitado.</Typography>
      </Box>
    );
  }

  const totalConImpuesto = Math.round(pedido.Total);
  const totalSinImpuesto = Math.round(pedido.TotalSinImpuesto);
  const totalImpuestos = totalConImpuesto - totalSinImpuesto - Math.round(pedido.CostoEnvio || 0);

  return (
    <Box sx={{ py: 2 }}>
      <Typography variant="h4" color="primary.main" gutterBottom>
        Factura del pedido #{pedido.IdPedido}
      </Typography>

      <Paper variant="outlined" sx={{ p: 3, borderRadius: 2, mb: 3 }}>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>{campoFactura('Fecha', formatoFecha(pedido.FechaPedido))}</Grid>
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            {campoFactura('Cliente', `${pedido.ClienteNombre} — ${pedido.ClienteCorreo}`)}
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            {campoFactura('Encargado', `${pedido.EncargadoNombre} ${pedido.EncargadoApellido}`)}
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>{campoFactura('Método de entrega', pedido.MetodoEntrega)}</Grid>
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>{campoFactura('Método de pago', pedido.MetodoPago)}</Grid>
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
              Estado
            </Typography>
            <Chip label={pedido.Estado} color={colorEstado(pedido.Estado)} sx={{ mt: 0.5 }} />
          </Grid>
          {pedido.MetodoEntrega === 'Entrega a domicilio' && (
            <Grid size={{ xs: 12 }}>{campoFactura('Dirección de entrega', pedido.DireccionEntrega)}</Grid>
          )}
        </Grid>
      </Paper>

      <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2 }}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: 'primaryLight.main' }}>
              <TableCell>Producto / Combo</TableCell>
              <TableCell align="right">Precio</TableCell>
              <TableCell align="right">Cantidad</TableCell>
              <TableCell align="right">Subtotal</TableCell>
              <TableCell align="right">Impuesto</TableCell>
              <TableCell>Observaciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {pedido.Detalle.map((linea) => (
              <TableRow key={linea.IdDetalle}>
                <TableCell>
                  {linea.Nombre}
                  <Chip label={linea.Tipo} size="small" variant="outlined" sx={{ ml: 1 }} />
                </TableCell>
                <TableCell align="right">₡{Math.round(linea.PrecioUnitario)}</TableCell>
                <TableCell align="right">{linea.Cantidad}</TableCell>
                <TableCell align="right">₡{Math.round(linea.Subtotal)}</TableCell>
                <TableCell align="right">₡{Math.round(linea.Impuesto)}</TableCell>
                <TableCell>{linea.Observaciones || '—'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Paper variant="outlined" sx={{ p: 3, borderRadius: 2, mt: 3, maxWidth: 400, ml: 'auto' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography>Total sin impuesto</Typography>
          <Typography>₡{totalSinImpuesto}</Typography>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography>Impuestos (13%)</Typography>
          <Typography>₡{totalImpuestos}</Typography>
        </Box>
        {pedido.CostoEnvio > 0 && (
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography>Costo de envío</Typography>
            <Typography>₡{Math.round(pedido.CostoEnvio)}</Typography>
          </Box>
        )}
        <Divider sx={{ my: 1 }} />
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="h6">Total</Typography>
          <Typography variant="h6" color="primary.main">
            ₡{totalConImpuesto}
          </Typography>
        </Box>
        {pedido.MetodoPago === 'Efectivo' && pedido.MontoRecibido != null && (
          <>
            <Divider sx={{ my: 1 }} />
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="body2">Monto recibido</Typography>
              <Typography variant="body2">₡{Math.round(pedido.MontoRecibido)}</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="body2">Vuelto</Typography>
              <Typography variant="body2">₡{Math.round(pedido.Vuelto)}</Typography>
            </Box>
          </>
        )}
      </Paper>
    </Box>
  );
}