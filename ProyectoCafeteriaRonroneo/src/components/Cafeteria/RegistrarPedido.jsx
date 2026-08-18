import React, { useEffect, useMemo, useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import MenuItem from '@mui/material/MenuItem';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import DeleteIcon from '@mui/icons-material/Delete';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import { useCart } from '../../hooks/useCart';
import PedidoService from '../../services/PedidoServices';

const Impuesto = 0.13;
const CostoEnvio = 1500;
const redondearCinco = (monto) => Math.round(monto / 5) * 5;

const formatoFechaHoy = () => new Date().toLocaleDateString('es-CR');

function FilaDetalle({ item, onCantidadCommit, onEliminar, onObservaciones }) {
  const { t } = useTranslation();
  const [textoCantidad, setTextoCantidad] = useState(String(item.Cantidad));

  const confirmarCantidad = () => {
    if (textoCantidad.trim() === '') {
      setTextoCantidad(String(item.Cantidad));
      return;
    }

    const numero = Number(textoCantidad);

    if (!Number.isInteger(numero) || numero < 0) {
      toast.error(t('registerOrder.errorInvalidQuantity'));
      setTextoCantidad(String(item.Cantidad));
      return;
    }

    onCantidadCommit(item, numero);
  };

  const subtotal = item.Precio * item.Cantidad;
  const impuesto = redondearCinco(subtotal * Impuesto);

  return (
    <TableRow>
      <TableCell>
        {item.Nombre}
        <Chip
          label={item.Tipo === 'producto' ? t('registerOrder.product') : t('registerOrder.combo')}
          size="small"
          variant="outlined"
          sx={{ ml: 1 }}
        />
      </TableCell>
      <TableCell align="right">₡{Math.round(item.Precio)}</TableCell>
      <TableCell align="center" sx={{ width: 110 }}>
        <TextField
          size="small"
          value={textoCantidad}
          onChange={(e) => {
            const valor = e.target.value;
            if (valor === '' || /^[0-9]*$/.test(valor)) {
              setTextoCantidad(valor);
            }
          }}
          onBlur={confirmarCantidad}
          onKeyDown={(e) => {
            if (e.key === 'Enter') e.target.blur();
          }}
          inputProps={{ inputMode: 'numeric', style: { textAlign: 'center' } }}
          sx={{ width: 80 }}
        />
      </TableCell>
      <TableCell align="right">₡{Math.round(subtotal)}</TableCell>
      <TableCell align="right">₡{impuesto}</TableCell>
      <TableCell sx={{ minWidth: 180 }}>
        <TextField
          size="small"
          placeholder={t('registerOrder.observationsPlaceholder')}
          fullWidth
          value={item.Observaciones || ''}
          onChange={(e) => onObservaciones(item, e.target.value)}
        />
      </TableCell>
      <TableCell align="right">
        <IconButton color="error" onClick={() => onEliminar(item)} aria-label={t('registerOrder.columnRemove') + ' ' + item.Nombre}>
          <DeleteIcon />
        </IconButton>
      </TableCell>
    </TableRow>
  );
}

export function RegistrarPedido() {
  const { t } = useTranslation();
  const { cart, carritoSolicitud, removeItem, updateCantidad, updateObservaciones, cleanCart } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const carritoRecibido = location.state || carritoSolicitud;

  const userStr = localStorage.getItem('user');
  const usuario = userStr && userStr !== 'undefined' ? JSON.parse(userStr) : null;
  const esEncargadoOAdmin = usuario?.Rol === 'Encargado' || usuario?.Rol === 'Administrador';

  const [clientes, setClientes] = useState([]);
  const [idClienteSeleccionado, setIdClienteSeleccionado] = useState('');
  const [clientePropio, setClientePropio] = useState(null);

  const [metodoEntrega, setMetodoEntrega] = useState('Recogida en tienda');
  const [direccionEntrega, setDireccionEntrega] = useState('');

  const [metodoPago, setMetodoPago] = useState('Efectivo');
  const [montoRecibido, setMontoRecibido] = useState('');
  const [numeroTarjeta, setNumeroTarjeta] = useState('');
  const [fechaExpiracion, setFechaExpiracion] = useState('');
  const [cvv, setCvv] = useState('');
  const [pagoConfirmado, setPagoConfirmado] = useState(false);
  const [tarjetaUltimos4, setTarjetaUltimos4] = useState('');

  const [enviando, setEnviando] = useState(false);

  useEffect(() => {
    if (!usuario) return;

    if (esEncargadoOAdmin) {
      PedidoService.getClientes()
        .then((response) => setClientes(response.data || []))
        .catch((err) => toast.error(t('registerOrder.errorLoadClients', { message: err.message })));
    } else {
      PedidoService.getClientePropio(usuario.IdUsuario)
        .then((response) => setClientePropio(response.data))
        .catch((err) => toast.error(t('registerOrder.errorLoadOwnData', { message: err.message })));
    }
  }, []);

  useEffect(() => {
    if (carritoRecibido?.IdCliente) {
      setIdClienteSeleccionado(String(carritoRecibido.IdCliente));
    }
    if (carritoRecibido?.MetodoEntrega) {
      setMetodoEntrega(carritoRecibido.MetodoEntrega);
      setDireccionEntrega(carritoRecibido.DireccionEntrega || '');
    }
    if (carritoRecibido?.MetodoPago) {
      setMetodoPago(carritoRecibido.MetodoPago);
    }
    if (carritoRecibido?.MontoRecibido) {
      setMontoRecibido(String(carritoRecibido.MontoRecibido));
    }
    if (carritoRecibido?.PagoConfirmado) {
      setPagoConfirmado(true);
      setTarjetaUltimos4(carritoRecibido.TarjetaUltimos4 || '');
    }
  }, [carritoRecibido]);

  const totales = useMemo(() => {
    let totalSinImpuesto = 0;
    let totalImpuestos = 0;

    cart.forEach((item) => {
      const subtotal = item.Precio * item.Cantidad;
      totalSinImpuesto += subtotal;
      totalImpuestos += redondearCinco(subtotal * Impuesto);
    });

    const costoEnvio = metodoEntrega === 'Entrega a domicilio' ? CostoEnvio : 0;
    const totalFinal = totalSinImpuesto + totalImpuestos + costoEnvio;

    return { totalSinImpuesto, totalImpuestos, costoEnvio, totalFinal };
  }, [cart, metodoEntrega]);

  const vuelto = useMemo(() => {
    const recibido = Number(montoRecibido);
    if (metodoPago !== 'Efectivo' || !montoRecibido || Number.isNaN(recibido)) return null;
    return recibido - totales.totalFinal;
  }, [montoRecibido, metodoPago, totales.totalFinal]);

  const registrarPedido = () => {
    if (!usuario) {
      toast.error(t('registerOrder.errorLogin'));
      navigate('/login');
      return;
    }
    if (cart.length === 0) {
      toast.error(t('registerOrder.errorEmptyCart'));
      return;
    }
    if (esEncargadoOAdmin && !idClienteSeleccionado) {
      toast.error(t('registerOrder.errorSelectClient'));
      return;
    }
    if (metodoEntrega === 'Entrega a domicilio' && !direccionEntrega.trim()) {
      toast.error(t('registerOrder.errorAddress'));
      return;
    }
    if (metodoPago === 'Tarjeta' && !pagoConfirmado && (!numeroTarjeta || !fechaExpiracion || !cvv)) {
      toast.error(t('registerOrder.errorCardData'));
      return;
    }
    if (metodoPago === 'Efectivo') {
      const recibido = Number(montoRecibido);
      if (!montoRecibido || Number.isNaN(recibido) || recibido < totales.totalFinal) {
        toast.error(t('registerOrder.errorInsufficientAmount'));
        return;
      }
    }

    const items = cart.map((item) => ({
      IdProducto: item.Tipo === 'producto' ? item.Id : null,
      IdCombo: item.Tipo === 'combo' ? item.Id : null,
      Cantidad: item.Cantidad,
      PrecioUnitario: item.Precio,
      Observaciones: item.Observaciones || '',
    }));

    const payload = {
      IdUsuario: usuario.IdUsuario,
      EsEncargado: esEncargadoOAdmin,
      IdClienteSeleccionado: esEncargadoOAdmin ? Number(idClienteSeleccionado) : undefined,
      Nombre: usuario.Nombre,
      Correo: usuario.Correo,
      Telefono: clientePropio?.Telefono || '',
      Direccion: clientePropio?.Direccion || '',
      MetodoEntrega: metodoEntrega,
      DireccionEntrega: metodoEntrega === 'Entrega a domicilio' ? direccionEntrega : '',
      CostoEnvio: totales.costoEnvio,
      MetodoPago: metodoPago,
      MontoRecibido: metodoPago === 'Efectivo' ? Number(montoRecibido) : null,
      IdCarritoSolicitud: carritoRecibido?.IdCarrito,
      items,
    };

    setEnviando(true);
    PedidoService.crearPedido(payload)
      .then((response) => {
        toast.success(t('registerOrder.successRegistered'));
        cleanCart();
        navigate(`/pedido/${response.data.IdPedido}`);
      })
      .catch((err) => toast.error(t('registerOrder.errorRegister', { message: err.message })))
      .finally(() => setEnviando(false));
  };

  if (!usuario) {
    return (
      <Box sx={{ py: 4 }}>
        <Typography color="text.secondary">{t('registerOrder.mustLogin')}</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ py: 2 }}>
      <Typography variant="h4" color="primary.main" gutterBottom>
        {t('registerOrder.title')}
      </Typography>

      <Paper variant="outlined" sx={{ p: 3, borderRadius: 2, mb: 3 }}>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <TextField label={t('registerOrder.date')} value={formatoFechaHoy()} fullWidth disabled />
          </Grid>

          {esEncargadoOAdmin ? (
            <Grid size={{ xs: 12, sm: 6, md: 5 }}>
              <TextField
                label={t('registerOrder.client')}
                select
                fullWidth
                required
                value={idClienteSeleccionado}
                onChange={(e) => setIdClienteSeleccionado(e.target.value)}
              >
                {clientes.map((cliente) => (
                  <MenuItem key={cliente.IdCliente} value={cliente.IdCliente}>
                    {cliente.Nombre} — {cliente.Correo}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
          ) : (
            <Grid size={{ xs: 12, sm: 6, md: 5 }}>
              <TextField
                label={t('registerOrder.client')}
                value={clientePropio ? `${clientePropio.Nombre} — ${clientePropio.Correo}` : `${usuario.Nombre} — ${usuario.Correo}`}
                fullWidth
                disabled
              />
            </Grid>
          )}

          {esEncargadoOAdmin && (
            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <TextField label={t('registerOrder.manager')} value={`${usuario.Nombre} ${usuario.Apellido || ''}`} fullWidth disabled />
            </Grid>
          )}

          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <TextField
              label={t('registerOrder.deliveryMethod')}
              select
              fullWidth
              value={metodoEntrega}
              onChange={(e) => setMetodoEntrega(e.target.value)}
            >
              <MenuItem value="Recogida en tienda">{t('registerOrder.pickup')}</MenuItem>
              <MenuItem value="Entrega a domicilio">{t('registerOrder.homeDelivery')} (+₡{CostoEnvio})</MenuItem>
            </TextField>
          </Grid>

          {metodoEntrega === 'Entrega a domicilio' && (
            <Grid size={{ xs: 12, sm: 8, md: 5 }}>
              <TextField
                label={t('registerOrder.deliveryAddress')}
                fullWidth
                required
                value={direccionEntrega}
                onChange={(e) => setDireccionEntrega(e.target.value)}
              />
            </Grid>
          )}

          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <TextField label={t('registerOrder.status')} value={t('registerOrder.statusPendingPayment')} fullWidth disabled />
          </Grid>
        </Grid>
      </Paper>
      {cart.length === 0 ? (
        <Typography color="text.secondary" sx={{ mb: 3 }}>
          {t('registerOrder.noItems')}
        </Typography>
      ) : (
        <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2, mb: 3 }}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: 'primaryLight.main' }}>
                <TableCell>{t('registerOrder.columnProduct')}</TableCell>
                <TableCell align="right">{t('registerOrder.columnPrice')}</TableCell>
                <TableCell align="center">{t('registerOrder.columnQuantity')}</TableCell>
                <TableCell align="right">{t('registerOrder.columnSubtotal')}</TableCell>
                <TableCell align="right">{t('registerOrder.columnTax')}</TableCell>
                <TableCell>{t('registerOrder.columnObservations')}</TableCell>
                <TableCell align="right">{t('registerOrder.columnRemove')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {cart.map((item) => (
                <FilaDetalle
                  key={`${item.Tipo}-${item.Id}`}
                  item={item}
                  onCantidadCommit={updateCantidad}
                  onEliminar={removeItem}
                  onObservaciones={updateObservaciones}
                />
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper variant="outlined" sx={{ p: 3, borderRadius: 2, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              {t('registerOrder.payment')}
            </Typography>
            <Stack spacing={2}>
              <TextField label={t('registerOrder.paymentMethod')} select value={metodoPago} onChange={(e) => setMetodoPago(e.target.value)}>
                <MenuItem value="Efectivo">{t('registerOrder.cash')}</MenuItem>
                <MenuItem value="Tarjeta">{t('registerOrder.card')}</MenuItem>
              </TextField>

              {metodoPago === 'Tarjeta' ? (
                pagoConfirmado ? (
                  <TextField
                    label={t('registerOrder.card')}
                    value={t('registerOrder.cardPaymentDone', { last4: tarjetaUltimos4 })}
                    disabled
                  />
                ) : (
                  <>
                    <TextField
                      label={t('registerOrder.cardNumber')}
                      value={numeroTarjeta}
                      onChange={(e) => setNumeroTarjeta(e.target.value)}
                      placeholder="•••• •••• •••• ••••"
                    />
                    <Stack direction="row" spacing={2}>
                      <TextField
                        label={t('registerOrder.expirationDate')}
                        value={fechaExpiracion}
                        onChange={(e) => setFechaExpiracion(e.target.value)}
                        placeholder="MM/AA"
                        fullWidth
                      />
                      <TextField label="CVV" value={cvv} onChange={(e) => setCvv(e.target.value)} placeholder="123" fullWidth />
                    </Stack>
                  </>
                )
              ) : (
                <>
                  <TextField
                    label={t('registerOrder.amountReceived')}
                    type="number"
                    value={montoRecibido}
                    onChange={(e) => setMontoRecibido(e.target.value)}
                  />
                  {vuelto !== null && (
                    <Typography color={vuelto < 0 ? 'error' : 'text.primary'}>
                      {vuelto < 0 ? t('registerOrder.insufficientAmount') : t('registerOrder.change', { amount: Math.round(vuelto) })}
                    </Typography>
                  )}
                </>
              )}
            </Stack>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Paper variant="outlined" sx={{ p: 3, borderRadius: 2, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              {t('registerOrder.summary')}
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography>{t('registerOrder.totalWithoutTax')}</Typography>
            <Typography>₡{Math.round(totales.totalSinImpuesto).toLocaleString('en-US')}</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography>{t('registerOrder.taxes')}</Typography>
              <Typography>₡{Math.round(totales.totalImpuestos).toLocaleString('en-US')}</Typography>
            </Box>
            {totales.costoEnvio > 0 && (
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography>{t('registerOrder.shippingCost')}</Typography>
                <Typography>₡{totales.costoEnvio.toLocaleString('en-US')}</Typography>
              </Box>
            )}
            <Divider sx={{ my: 1 }} />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="h6">{t('registerOrder.total')}</Typography>
              <Typography variant="h6" color="primary.main">
                ₡{Math.round(totales.totalFinal).toLocaleString('en-US')}
              </Typography>
            </Box>
            <Button
              variant="contained"
              color="secondary"
              size="large"
              fullWidth
              startIcon={<ReceiptLongIcon />}
              disabled={enviando || cart.length === 0}
              onClick={registrarPedido}
              sx={{ fontWeight: 700 }}
            >
              {enviando ? t('registerOrder.registering') : t('registerOrder.registerButton')}
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}