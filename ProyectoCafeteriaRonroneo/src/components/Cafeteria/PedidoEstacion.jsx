import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import PedidoService from '../../services/PedidoServices';
import PreparacionService from '../../services/PreparacionServices';

function TarjetaLinea({ linea, onGuardar }) {
  const [observaciones, setObservaciones] = useState(linea.Observaciones || '');
  const [guardando, setGuardando] = useState(false);

  const cambiarEstado = (nuevoEstado) => {
    setGuardando(true);
    onGuardar({ IdDetalleEstacion: linea.IdDetalleEstacion, Observaciones: observaciones, Estado: nuevoEstado }).finally(() =>
      setGuardando(false)
    );
  };

  const colorEstadoTarea = linea.EstadoTarea === 'En Preparación' ? 'warning' : 'default';

  return (
    <Card variant="outlined" sx={{ borderRadius: 2 }}>
      <CardContent>
        <Stack spacing={1.5}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="subtitle1" fontWeight={700}>
              Pedido #{linea.IdPedido}
            </Typography>
            <Chip label={linea.EstadoTarea} size="small" color={colorEstadoTarea} />
          </Stack>
          <Typography variant="body2" color="text.secondary">
            Cliente: {linea.ClienteNombre}
          </Typography>
          <Typography>
            {linea.Cantidad}x {linea.Nombre}
          </Typography>
          {linea.ProductosEstacion && (
            <Typography variant="body2" color="primary.main" fontWeight={700}>
              Producto a elaborar: {linea.ProductosEstacion}
            </Typography>
          )}
          <TextField
            label="Observaciones"
            size="small"
            multiline
            minRows={2}
            value={observaciones}
            onChange={(e) => setObservaciones(e.target.value)}
          />

          {linea.EstadoTarea === 'Cola' && (
            <Button variant="contained" color="secondary" fullWidth disabled={guardando} onClick={() => cambiarEstado('En Preparación')}>
              Empezar
            </Button>
          )}
          {linea.EstadoTarea === 'En Preparación' && (
            <Button variant="contained" color="secondary" fullWidth disabled={guardando} onClick={() => cambiarEstado('Completado')}>
              Terminar
            </Button>
          )}

          <Button
            variant="outlined"
            size="small"
            disabled={guardando}
            onClick={() => cambiarEstado(linea.EstadoTarea)}
          >
            Guardar solo la nota
          </Button>

          <Button
            variant="text"
            size="small"
            startIcon={<ReceiptLongIcon />}
            component={Link}
            to={`/pedido/${linea.IdPedido}`}
          >
            Ver factura completa
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
}

export function PedidoEstacion() {
  const [lineas, setLineas] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [estaciones, setEstaciones] = useState([]);
  const [idEstacionVista, setIdEstacionVista] = useState('');

  const userStr = localStorage.getItem('user');
  const usuario = userStr && userStr !== 'undefined' ? JSON.parse(userStr) : null;
  const esAdmin = usuario?.Rol === 'Administrador';

  const idEstacionActiva = esAdmin ? idEstacionVista : usuario?.IdEstacion;

  const cargarLineas = (idEstacion) => {
    if (!idEstacion) {
      setLineas([]);
      setLoaded(true);
      return;
    }
    PedidoService.getPorEstacion(idEstacion)
      .then((response) => {
        setLineas(response.data || []);
        setLoaded(true);
      })
      .catch((err) => {
        toast.error(`No se pudo cargar: ${err.message}`);
        setLoaded(true);
      });
  };

  useEffect(() => {
    if (esAdmin) {
      PreparacionService.getEstaciones()
        .then((response) => {
          const lista = response.data || [];
          setEstaciones(lista);
          if (lista.length > 0) {
            setIdEstacionVista(lista[0].IdEstacion);
            cargarLineas(lista[0].IdEstacion);
          } else {
            setLoaded(true);
          }
        })
        .catch((err) => {
          toast.error(`No se pudieron cargar las estaciones: ${err.message}`);
          setLoaded(true);
        });
    } else {
      cargarLineas(usuario?.IdEstacion);
    }
  }, []);

  const cambiarEstacionVista = (nuevoId) => {
    setIdEstacionVista(nuevoId);
    setLoaded(false);
    cargarLineas(nuevoId);
  };

  const guardarLinea = (datos) => {
    return PedidoService.actualizarLinea(datos)
      .then(() => {
        toast.success('Actualizado');
        cargarLineas(idEstacionActiva);
      })
      .catch((err) => toast.error(`No se pudo actualizar: ${err.message}`));
  };

  if (!esAdmin && !usuario?.IdEstacion) {
    return (
      <Box sx={{ py: 4 }}>
        <Typography color="text.secondary">Tu usuario no tiene una estación asignada.</Typography>
      </Box>
    );
  }

  if (!loaded) return <p>Cargando...</p>;

  return (
    <Box sx={{ py: 2 }}>
      <Typography variant="h4" color="primary.main" gutterBottom>
        {esAdmin ? 'Estaciones' : `Estación: ${usuario.EstacionNombre}`}
      </Typography>

      {esAdmin && (
        <TextField
          label="Ver estación"
          select
          size="small"
          value={idEstacionVista}
          onChange={(e) => cambiarEstacionVista(e.target.value)}
          sx={{ minWidth: 240, mb: 3 }}
        >
          {estaciones.map((estacion) => (
            <MenuItem key={estacion.IdEstacion} value={estacion.IdEstacion}>
              {estacion.Nombre}
            </MenuItem>
          ))}
        </TextField>
      )}

      {lineas.length === 0 ? (
        <Typography color="text.secondary">No hay pendientes en este momento.</Typography>
      ) : (
        <Grid container spacing={2}>
          {lineas.map((linea) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={linea.IdDetalleEstacion}>
              <TarjetaLinea linea={linea} onGuardar={guardarLinea} />
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}
