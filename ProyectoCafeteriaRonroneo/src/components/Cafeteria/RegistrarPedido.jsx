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
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useCart } from '../../hooks/useCart';
import PedidoService from '../../services/PedidoServices';

const Impuesto = 0.13;
const CostoEnvio = 1500;

const formatoFechaHoy = () => new Date().toLocaleDateString('es-CR');

function FilaDetalle({ item, onCantidadCommit, onEliminar, onObservaciones }) {
  const [textoCantidad, setTextoCantidad] = useState(String(item.Cantidad));

  const confirmarCantidad = () => {
    if (textoCantidad.trim() === '') {
      setTextoCantidad(String(item.Cantidad));
      return;
    }

    const numero = Number(textoCantidad);

    if (!Number.isInteger(numero) || numero < 0) {
      toast.error('La cantidad debe ser un número entero válido');
      setTextoCantidad(String(item.Cantidad));
      return;
    }

    onCantidadCommit(item, numero);
  };

  const subtotal = item.Precio * item.Cantidad;
  const impuesto = Math.round(subtotal * Impuesto);

  return (
    <TableRow>
      <TableCell>
        {item.Nombre}
        <Chip label={item.Tipo === 'producto' ? 'Producto' : 'Combo'} size="small" variant="outlined" sx={{ ml: 1 }} />
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
          placeholder="Observaciones"
          fullWidth
          value={item.Observaciones || ''}
          onChange={(e) => onObservaciones(item, e.target.value)}
        />
      </TableCell>
      <TableCell align="right">
        <IconButton color="error" onClick={() => onEliminar(item)} aria-label={'Quitar ' + item.Nombre}>
          <DeleteIcon />
        </IconButton>
      </TableCell>
    </TableRow>
  );
  
}

export function RegistrarPedido() {
  const { cart, removeItem, updateCantidad, updateObservaciones, cleanCart } = useCart();
  const navigate = useNavigate();

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

  const [enviando, setEnviando] = useState(false);

  useEffect(() => {
    if (!usuario) return;

    if (esEncargadoOAdmin) {
      PedidoService.getClientes()
        .then((response) => setClientes(response.data || []))
        .catch((err) => toast.error(`No se pudo cargar la lista de clientes: ${err.message}`));
    } else {
      PedidoService.getClientePropio(usuario.IdUsuario)
        .then((response) => setClientePropio(response.data))
        .catch((err) => toast.error(`No se pudieron cargar tus datos: ${err.message}`));
    }
  }, []);

const totales = useMemo(() => {
    let totalSinImpuesto = 0;
    let totalImpuestos = 0;

    cart.forEach((item) => {
      const subtotal = item.Precio * item.Cantidad;
      totalSinImpuesto += subtotal;
      totalImpuestos += Math.round(subtotal * Impuesto);
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
      toast.error('Debes iniciar sesión');
      navigate('/login');
      return;
    }
    if (cart.length === 0) {
      toast.error('Se debe agregar un producto o un combo antes de registrar el pedido');
      return;
    }
    if (esEncargadoOAdmin && !idClienteSeleccionado) {
      toast.error('Debe seleccionar un cliente');
      return;
    }
    if (metodoEntrega === 'Entrega a domicilio' && !direccionEntrega.trim()) {
      toast.error('Debe indicar la dirección de entrega');
      return;
    }
    if (metodoPago === 'Tarjeta' && (!numeroTarjeta || !fechaExpiracion || !cvv)) {
      toast.error('Por favor complete los datos de la tarjeta');
      return;
    }
    if (metodoPago === 'Efectivo') {
      const recibido = Number(montoRecibido);
      if (!montoRecibido || Number.isNaN(recibido) || recibido < totales.totalFinal) {
        toast.error('El monto recibido insuficiente');
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
      items,
    };

    setEnviando(true);
    PedidoService.crearPedido(payload)
      .then((response) => {
        toast.success('Pedido registrado con éxito');
        cleanCart();
        navigate(`/pedido/${response.data.IdPedido}`);
      })
      .catch((err) => toast.error(`No se pudo registrar el pedido: ${err.message}`))
      .finally(() => setEnviando(false));
  };

  if (!usuario) {
    return (
      <Box sx={{ py: 4 }}>
        <Typography color="text.secondary">Debes iniciar sesión para registrar un pedido.</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ py: 2 }}>
      <Typography variant="h4" color="primary.main" gutterBottom>
        Registrar pedido
      </Typography>

      <Paper variant="outlined" sx={{ p: 3, borderRadius: 2, mb: 3 }}>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <TextField label="Fecha" value={formatoFechaHoy()} fullWidth disabled />
          </Grid>

          {esEncargadoOAdmin ? (
            <Grid size={{ xs: 12, sm: 6, md: 5 }}>
              <TextField
                label="Cliente"
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
                label="Cliente"
                value={clientePropio ? `${clientePropio.Nombre} — ${clientePropio.Correo}` : `${usuario.Nombre} — ${usuario.Correo}`}
                fullWidth
                disabled
              />
            </Grid>
          )}

          {esEncargadoOAdmin && (
            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <TextField label="Encargado" value={`${usuario.Nombre} ${usuario.Apellido || ''}`} fullWidth disabled />
            </Grid>
          )}

          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <TextField
              label="Método de entrega"
              select
              fullWidth
              value={metodoEntrega}
              onChange={(e) => setMetodoEntrega(e.target.value)}
            >
              <MenuItem value="Recogida en tienda">Recogida en tienda</MenuItem>
              <MenuItem value="Entrega a domicilio">Entrega a domicilio (+₡{CostoEnvio})</MenuItem>
            </TextField>
          </Grid>

          {metodoEntrega === 'Entrega a domicilio' && (
            <Grid size={{ xs: 12, sm: 8, md: 5 }}>
              <TextField
                label="Dirección de entrega"
                fullWidth
                required
                value={direccionEntrega}
                onChange={(e) => setDireccionEntrega(e.target.value)}
              />
            </Grid>
          )}

          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <TextField label="Estado" value="Pendiente de pago" fullWidth disabled />
          </Grid>
        </Grid>
      </Paper>