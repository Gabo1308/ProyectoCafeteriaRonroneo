import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
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
import Button from '@mui/material/Button';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import PedidoService from '../../services/PedidoServices';

const Estados = ['Pendiente de pago', 'Aceptada', 'Preparación', 'Procesando', 'Entregada'];

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
  const soloFecha = String(fecha).split('T')[0];
  const [anio, mes, dia] = soloFecha.split('-');
  return `${dia}/${mes}/${anio}`;
};

export function HistorialPedidos() {
  const [pedidos, setPedidos] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [fechaDesde, setFechaDesde] = useState('');
  const [fechaHasta, setFechaHasta] = useState('');
  const [estadoFiltro, setEstadoFiltro] = useState('');

  const userStr = localStorage.getItem('user');
  const usuario = userStr && userStr !== 'undefined' ? JSON.parse(userStr) : null;
  const esEncargadoOAdmin = usuario?.Rol === 'Encargado' || usuario?.Rol === 'Administrador';

  const cargarPedidos = () => {
    if (!usuario) {
      setLoaded(true);
      return;
    }

    const filtros = esEncargadoOAdmin
  ? {
      fechaDesde: fechaDesde || undefined,
      fechaHasta: fechaHasta || undefined,
      estado: estadoFiltro || undefined,
    }
  : {};

    const peticion = esEncargadoOAdmin
      ? PedidoService.getHistorialTodos(filtros)
      : PedidoService.getHistorialCliente(usuario.IdUsuario, filtros);

    peticion
      .then((response) => {
        setPedidos(response.data || []);
        setLoaded(true);
      })
      .catch((err) => {
        toast.error(`No se pudo cargar el historial: ${err.message}`);
        setLoaded(true);
      });
  };

  useEffect(() => {
  cargarPedidos();
}, [fechaDesde, fechaHasta, estadoFiltro]);

  if (!usuario) {
    return (
      <Box sx={{ py: 4 }}>
        <Typography color="text.secondary">Debes iniciar sesión para ver tu historial de pedidos.</Typography>
      </Box>
    );
  }

  if (!loaded) return <p>Cargando...</p>;

  return (
    <Box sx={{ py: 2 }}>
      <Typography variant="h4" color="primary.main" gutterBottom>
        {esEncargadoOAdmin ? 'Historial de pedidos' : 'Mis pedidos'}
      </Typography>

      {esEncargadoOAdmin && (
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 3, mt: 2 }}>
          <TextField
            id="filtro-fecha-desde"
            label="Desde"
            type="date"
            size="small"
            value={fechaDesde}
            onChange={(e) => setFechaDesde(e.target.value)}
            slotProps={{ inputLabel: { shrink: true } }}
            sx={{ minWidth: 170 }}
          />
          <TextField
            id="filtro-fecha-hasta"
            label="Hasta"
            type="date"
            size="small"
            value={fechaHasta}
            onChange={(e) => setFechaHasta(e.target.value)}
            slotProps={{ inputLabel: { shrink: true } }}
            sx={{ minWidth: 170 }}
          />
          <TextField
            label="Filtrar por estado"
            select
            size="small"
            value={estadoFiltro}
            onChange={(e) => setEstadoFiltro(e.target.value)}
            sx={{ minWidth: 200 }}
          >
            <MenuItem value="">Todos los estados</MenuItem>
            {Estados.map((estado) => (
              <MenuItem key={estado} value={estado}>
                {estado}
              </MenuItem>
            ))}
          </TextField>
        </Stack>
      )}

      {pedidos.length === 0 ? (
        <Typography color="text.secondary" sx={{ mt: 3 }}>
          No hay pedidos para mostrar.
        </Typography>
      ) : (
        <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2, mt: 2 }}>
          <Table>
            <TableHead>
            <TableRow sx={{ backgroundColor: 'primaryLight.main' }}>
                <TableCell align="center">Pedido</TableCell>
                <TableCell align="center">Fecha</TableCell>
                {esEncargadoOAdmin && <TableCell align="center">Cliente</TableCell>}
                <TableCell align="center">Estado</TableCell>
                <TableCell align="center">Total</TableCell>
                <TableCell align="center">Acciones</TableCell>
              </TableRow>
              </TableHead>
            <TableBody>
              {pedidos.map((pedido) => (
                <TableRow key={pedido.IdPedido} hover>
                  <TableCell align="center">#{pedido.IdPedido}</TableCell>
                  <TableCell align="center">{formatoFecha(pedido.FechaPedido)}</TableCell>
                  {esEncargadoOAdmin && <TableCell align="center">{pedido.ClienteNombre}</TableCell>}
                  <TableCell align="center">
                    <Chip label={pedido.Estado} size="small" color={colorEstado(pedido.Estado)} />
                  </TableCell>
                  <TableCell align="center">₡{Math.round(pedido.Total)}</TableCell>
                  <TableCell align="center">
                    <Button
                      size="small"
                      variant="outlined"
                      startIcon={<VisibilityIcon />}
                      component={Link}
                      to={`/pedido/${pedido.IdPedido}`}
                    >
                      Ver detalle
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
}
