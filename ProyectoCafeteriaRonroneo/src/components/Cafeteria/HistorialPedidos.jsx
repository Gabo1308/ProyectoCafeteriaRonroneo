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

const ESTADOS = ['Pendiente de pago', 'Aceptada', 'Preparación', 'Procesando', 'Entregada'];

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

export function HistorialPedidos() {
  const [pedidos, setPedidos] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [fechaFiltro, setFechaFiltro] = useState('');
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
      ? { fecha: fechaFiltro || undefined, estado: estadoFiltro || undefined }
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
  }, [fechaFiltro, estadoFiltro]);

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
            label="Filtrar por fecha"
            type="date"
            size="small"
            value={fechaFiltro}
            onChange={(e) => setFechaFiltro(e.target.value)}
            InputLabelProps={{ shrink: true }}
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
            {ESTADOS.map((estado) => (
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
                <TableCell>Pedido</TableCell>
                <TableCell>Fecha</TableCell>
                {esEncargadoOAdmin && <TableCell>Cliente</TableCell>}
                <TableCell>Estado</TableCell>
                <TableCell align="right">Total</TableCell>
                <TableCell align="right">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {pedidos.map((pedido) => (
                <TableRow key={pedido.IdPedido} hover>
                  <TableCell>#{pedido.IdPedido}</TableCell>
                  <TableCell>{formatoFecha(pedido.FechaPedido)}</TableCell>
                  {esEncargadoOAdmin && <TableCell>{pedido.ClienteNombre}</TableCell>}
                  <TableCell>
                    <Chip label={pedido.Estado} size="small" color={colorEstado(pedido.Estado)} />
                  </TableCell>
                  <TableCell align="right">₡{Math.round(pedido.Total)}</TableCell>
                  <TableCell align="right">
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