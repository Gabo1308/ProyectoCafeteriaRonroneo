import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
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
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import toast from 'react-hot-toast';
import PreparacionService from '../../services/PreparacionServices';
import ProductoService from '../../services/ProductosServices';

const filaVacia = () => ({ IdEstacion: '', Orden: 1 });

const formVacio = {
  IdProducto: '',
  Estaciones: [filaVacia()],
  esNueva: true,
};

export function GestionPreparacion() {
  const [preparaciones, setPreparaciones] = useState([]);
  const [preparacionesEliminadas, setPreparacionesEliminadas] = useState([]);
  const [productos, setProductos] = useState([]);
  const [estacionesDisponibles, setEstacionesDisponibles] = useState([]);
  const [form, setForm] = useState(formVacio);
  const [loaded, setLoaded] = useState(false);

  const cargarDatos = () => {
    Promise.all([
      PreparacionService.getPreparaciones(),
      PreparacionService.getPreparacionesDesactivadas(),
      ProductoService.getProductos(),
      PreparacionService.getEstaciones(),
    ])
      .then(([preparacionesResponse, desactivadasResponse, productosResponse, estacionesResponse]) => {
        setPreparaciones(preparacionesResponse.data || []);
        setPreparacionesEliminadas(desactivadasResponse.data || []);
        setProductos(productosResponse.data || []);
        setEstacionesDisponibles(estacionesResponse.data || []);
        setLoaded(true);
      })
      .catch((err) => {
        setLoaded(true);
        toast.error(`Error al cargar datos: ${err.message}`);
      });
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const limpiarFormulario = () => {
    setForm(formVacio);
  };

  const cambiarProducto = (event) => {
    setForm((actual) => ({ ...actual, IdProducto: event.target.value }));
  };

  const agregarEstacion = () => {
    setForm((actual) => ({
      ...actual,
      Estaciones: [...actual.Estaciones, filaVacia()],
    }));
  };

  const quitarEstacion = (index) => {
    setForm((actual) => ({
      ...actual,
      Estaciones: actual.Estaciones.filter((_, i) => i !== index),
    }));
  };

  const cambiarEstacion = (index, campo, valor) => {
    setForm((actual) => ({
      ...actual,
      Estaciones: actual.Estaciones.map((fila, i) => (i === index ? { ...fila, [campo]: valor } : fila)),
    }));
  };

  const editarPreparacion = (preparacion) => {
    PreparacionService.getPreparacionById(preparacion.IdPreparacion).then((response) => {
      const data = response.data;
      setForm({
        IdProducto: data.IdProducto,
        Estaciones: (data.Estaciones || []).map((estacion) => ({
          IdEstacion: estacion.IdEstacion,
          Orden: estacion.Orden,
        })),
        esNueva: false,
      });
    });
  };

  const guardarPreparacion = (event) => {
    event.preventDefault();

    if (!form.IdProducto) {
      toast.error('Debe seleccionar un producto');
      return;
    }
    if (form.Estaciones.some((fila) => !fila.IdEstacion)) {
      toast.error('Todas las filas deben tener una estacion seleccionada');
      return;
    }

    PreparacionService.guardarPreparacion(form)
      .then(() => {
        toast.success('Preparacion guardada');
        limpiarFormulario();
        cargarDatos();
      })
      .catch((err) => toast.error(`No se pudo guardar: ${err.message}`));
  };

  const eliminarPreparacion = (idProducto) => {
    PreparacionService.deletePreparacion(idProducto)
      .then(() => {
        toast.success('Preparacion eliminada');
        cargarDatos();
      })
      .catch((err) => toast.error(`No se pudo eliminar: ${err.message}`));
  };

  const restaurarPreparacion = (idProducto) => {
    PreparacionService.restorePreparacion(idProducto)
      .then(() => {
        toast.success('Preparacion restaurada');
        cargarDatos();
      })
      .catch((err) => toast.error(`No se pudo restaurar: ${err.message}`));
  };

  if (!loaded) return <p>Cargando...</p>;

  return (
    <Box sx={{ py: 2 }}>
      <Typography variant="h4" color="primary.main" gutterBottom>
        Mantenimiento de preparación
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 3 }}>
        Define la ruta de estaciones y el orden en que pasa cada producto durante su preparación.
      </Typography>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 5 }}>
          <Card variant="outlined" sx={{ borderRadius: 2 }}>
            <CardContent component="form" onSubmit={guardarPreparacion}>
              <Stack spacing={2}>
                <Typography variant="h6">
                  {form.esNueva ? 'Nueva ruta de preparación' : 'Editar ruta de preparación'}
                </Typography>

                <TextField
                  label="Producto"
                  value={form.IdProducto}
                  onChange={cambiarProducto}
                  select
                  required
                  fullWidth
                  disabled={!form.esNueva}
                  helperText={!form.esNueva ? 'El producto no se puede cambiar al editar' : ''}
                >
                  {productos.map((producto) => (
                    <MenuItem key={producto.IdProducto} value={producto.IdProducto}>
                      {producto.Nombre}
                    </MenuItem>
                  ))}
                </TextField>

                <Typography variant="subtitle2">Estaciones en orden</Typography>

                <Stack spacing={1}>
                  {form.Estaciones.map((fila, index) => (
                    <Box
                      key={index}
                      sx={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 90px 40px',
                        gap: 1,
                        alignItems: 'center',
                      }}
                    >
                      <TextField
                        label="Estación"
                        select
                        size="small"
                        value={fila.IdEstacion}
                        onChange={(event) => cambiarEstacion(index, 'IdEstacion', event.target.value)}
                        required
                        fullWidth
                      >
                        {estacionesDisponibles.map((estacion) => (
                          <MenuItem key={estacion.IdEstacion} value={estacion.IdEstacion}>
                            {estacion.Nombre}
                          </MenuItem>
                        ))}
                      </TextField>
                      <TextField
                        label="Orden"
                        type="number"
                        size="small"
                        value={fila.Orden}
                        onChange={(event) => cambiarEstacion(index, 'Orden', event.target.value)}
                        required
                      />
                      <IconButton
                        color="error"
                        onClick={() => quitarEstacion(index)}
                        disabled={form.Estaciones.length === 1}
                        aria-label="Quitar estación"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  ))}
                </Stack>

                <Button variant="outlined" startIcon={<AddIcon />} onClick={agregarEstacion}>
                  Agregar estación
                </Button>

                <Stack direction="row" spacing={1}>
                  <Button type="submit" variant="contained" color="secondary" startIcon={<SaveIcon />} fullWidth sx={{ fontWeight: 700 }}>
                    Guardar
                  </Button>
                  <Button variant="outlined" onClick={limpiarFormulario} fullWidth>
                    Nuevo
                  </Button>
                </Stack>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 7 }}>
          <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2 }}>
            <Table size="small">
              <TableHead>
                <TableRow sx={{ backgroundColor: 'primaryLight.main' }}>
                  <TableCell>Producto</TableCell>
                  <TableCell>Cant. de pasos</TableCell>
                  <TableCell align="right">Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {preparaciones.map((preparacion) => (
                  <TableRow key={preparacion.IdPreparacion} hover>
                    <TableCell>
                      <Typography variant="subtitle2">{preparacion.Producto}</Typography>
                    </TableCell>
                    <TableCell>
                      <Chip label={preparacion.CantidadPasos} size="small" color="secondary" />
                    </TableCell>
                    <TableCell align="right">
                      <Stack direction="row" spacing={1} justifyContent="flex-end">
                        <Button
                          size="small"
                          variant="outlined"
                          startIcon={<EditIcon />}
                          onClick={() => editarPreparacion(preparacion)}
                        >
                          Editar
                        </Button>
                        <Button
                          size="small"
                          color="error"
                          variant="outlined"
                          startIcon={<DeleteIcon />}
                          onClick={() => eliminarPreparacion(preparacion.IdPreparacion)}
                        >
                          Eliminar
                        </Button>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Typography variant="h5" sx={{ mt: 5, mb: 2 }}>
            Preparaciones desactivadas
          </Typography>

          <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2 }}>
            <Table size="small">
              <TableHead>
                <TableRow sx={{ backgroundColor: 'primaryLight.main' }}>
                  <TableCell>Producto</TableCell>
                  <TableCell>Cant. de pasos</TableCell>
                  <TableCell align="right">Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {preparacionesEliminadas.map((preparacion) => (
                  <TableRow key={preparacion.IdPreparacion} hover>
                    <TableCell>
                      <Typography variant="subtitle2">{preparacion.Producto}</Typography>
                    </TableCell>
                    <TableCell>
                      <Chip label={preparacion.CantidadPasos} size="small" color="default" />
                    </TableCell>
                    <TableCell align="right">
                      <Button
                        size="small"
                        color="success"
                        variant="contained"
                        onClick={() => restaurarPreparacion(preparacion.IdPreparacion)}
                      >
                        Restaurar
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
    </Box>
  );
}