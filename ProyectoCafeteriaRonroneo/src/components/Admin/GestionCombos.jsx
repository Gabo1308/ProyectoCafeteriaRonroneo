import React, { useEffect, useState } from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
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
import UploadFileIcon from '@mui/icons-material/UploadFile';
import toast from 'react-hot-toast';
import ComboService from '../../services/CombosServices';
import MenuService from '../../services/MenuServices';
import ProductoService from '../../services/ProductosServices';

const comboVacio = {
  IdCombo: null,
  IdMenu: '',
  Nombre: '',
  Descripcion: '',
  Imagen: '',
  Precio: '',
  Estado: 1,
};

export function GestionCombos() {
  const [combos, setCombos] = useState([]);
  const [combosEliminados, setCombosEliminados] = useState([]);
  const [menus, setMenus] = useState([]);
  const [productos, setProductos] = useState([]);
  const [form, setForm] = useState(comboVacio);
  const [productosCombo, setProductosCombo] = useState({});
  const [loaded, setLoaded] = useState(false);
  const [subiendoImagen, setSubiendoImagen] = useState(false);
  const BASE_URL = import.meta.env.VITE_BASE_URL + 'uploads';

  const cargarDatos = () => {
    Promise.all([
      ComboService.getCombos(), ComboService.getCombosDesactivados(), MenuService.getMenus(), ProductoService.getProductos(),])
      .then(([combosResponse, desactivadosResponse, menusResponse, productosResponse]) => {
        setCombos(combosResponse.data || []);
        setCombosEliminados(desactivadosResponse.data || []);
        setMenus(menusResponse.data || []);
        setProductos(productosResponse.data || []);
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

  const actualizarCampo = (event) => {
    const { name, value } = event.target;
    setForm((actual) => ({ ...actual, [name]: value }));
  };

  const limpiarFormulario = () => {
    setForm(comboVacio);
    setProductosCombo({});
  };

  const subirImagen = (event) => {
    const archivo = event.target.files?.[0];
    if (!archivo) return;

    setSubiendoImagen(true);
    ComboService.uploadImagenCombo(archivo)
      .then((response) => {
        setForm((actual) => ({ ...actual, Imagen: response.data.fileName }));
        toast.success('Imagen copiada en uploads');
      })
      .catch((err) => toast.error(`No se pudo subir la imagen: ${err.message}`))
      .finally(() => {
        setSubiendoImagen(false);
        event.target.value = '';
      });
  };

  const editarCombo = (combo) => {
    setForm({
      IdCombo: combo.IdCombo,
      IdMenu: combo.IdMenu,
      Nombre: combo.Nombre,
      Descripcion: combo.Descripcion || '',
      Imagen: combo.Imagen || '',
      Precio: combo.Precio,
      Estado: combo.Estado ?? 1,
    });
    ComboService.getProductosByCombo(combo.IdCombo).then((response) => {
      const seleccion = {};
      (response.data || []).forEach((producto) => {
        seleccion[producto.IdProducto] = producto.Cantidad || 1;
      });
      setProductosCombo(seleccion);
    });
  };

  const cambiarCantidad = (idProducto, cantidad) => {
    setProductosCombo((actual) => ({ ...actual, [idProducto]: cantidad }));
  };

  const productosSeleccionados = productos.filter((producto) => productosCombo[producto.IdProducto] !== undefined);

  const actualizarProductosSeleccionados = (_, nuevosProductos) => {
    setProductosCombo((actual) => {
      const seleccion = {};
      nuevosProductos.forEach((producto) => {
        seleccion[producto.IdProducto] = actual[producto.IdProducto] || 1;
      });
      return seleccion;
    });
  };

  const guardarCombo = (event) => {
    event.preventDefault();
    const productosSeleccionados = Object.entries(productosCombo).map(([IdProducto, Cantidad]) => ({
      IdProducto,
      Cantidad,
    }));
    const payload = { ...form, productos: productosSeleccionados };
    const accion = form.IdCombo ? ComboService.updateCombo(payload) : ComboService.createCombo(payload);

    accion
      .then(() => {
        toast.success(form.IdCombo ? 'Combo actualizado' : 'Combo creado');
        limpiarFormulario();
        cargarDatos();
      })
      .catch((err) => toast.error(`No se pudo guardar: ${err.message}`));
  };

  const eliminarCombo = (idCombo) => {
    ComboService.deleteCombo(idCombo)
      .then(() => {
        toast.success('Combo eliminado');
        cargarDatos();
      })
      .catch((err) => toast.error(`No se pudo eliminar: ${err.message}`));
  };

  const restaurarCombo = (idCombo) => {
    ComboService.restoreCombo(idCombo)
      .then(() => {
        toast.success('Combo restaurado');
        cargarDatos();
      })
      .catch((err) => toast.error(`No se pudo restaurar: ${err.message}`));
  };

  if (!loaded) return <p>Cargando...</p>;

  return (
    <Box sx={{ py: 2 }}>
      <Typography variant="h4" color="primary.main" gutterBottom>
        Mantenimiento de combos
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 3 }}>
        Crea combos con productos, cantidades, menú asociado y precio especial.
      </Typography>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 5 }}>
          <Card variant="outlined" sx={{ borderRadius: 2 }}>
            <CardContent component="form" onSubmit={guardarCombo}>
              <Stack spacing={2}>
                <Typography variant="h6">{form.IdCombo ? 'Editar combo' : 'Nuevo combo'}</Typography>
                <TextField label="Nombre" name="Nombre" value={form.Nombre} onChange={actualizarCampo} required fullWidth />
                <TextField label="Menu" name="IdMenu" value={form.IdMenu} onChange={actualizarCampo} required select fullWidth>
                  {menus.map((menu) => (
                    <MenuItem key={menu.IdMenu} value={menu.IdMenu}>
                      {menu.Nombre}
                    </MenuItem>
                  ))}
                </TextField>
                <TextField label="Descripcion" name="Descripcion" value={form.Descripcion} onChange={actualizarCampo} multiline minRows={2} fullWidth />
                <Stack spacing={1}>
                  <Button variant="outlined" component="label" startIcon={<UploadFileIcon />} disabled={subiendoImagen}>
                    {subiendoImagen ? 'Subiendo imagen...' : 'Seleccionar imagen'}
                    <input type="file" hidden accept="image/*" onChange={subirImagen} />
                  </Button>
                  <TextField label="Imagen en uploads" name="Imagen" value={form.Imagen} onChange={actualizarCampo} fullWidth />
                  {form.Imagen && (
                    <Box component="img" src={`${BASE_URL}/${form.Imagen}`} alt={form.Nombre} sx={{ width: '100%', height: 130, objectFit: 'cover', borderRadius: 2 }} />
                  )}
                </Stack>
                <TextField label="Precio" name="Precio" value={form.Precio} onChange={actualizarCampo} type="number" required fullWidth />
                <Divider>
                  <Chip label="Productos del combo" />
                </Divider>
                <Autocomplete
                  multiple
                  options={productos}
                  value={productosSeleccionados}
                  onChange={actualizarProductosSeleccionados}
                  getOptionLabel={(producto) => `${producto.Nombre} - ${producto.Categoria}`}
                  isOptionEqualToValue={(option, value) => option.IdProducto === value.IdProducto}
                  renderInput={(params) => <TextField {...params} label="Buscar productos por nombre" />}
                />
                <Stack spacing={1} sx={{ maxHeight: 260, overflowY: 'auto', pr: 1 }}>
                  {productosSeleccionados.map((producto) => (
                    <Box
                      key={producto.IdProducto}
                      sx={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 90px',
                        gap: 1,
                        alignItems: 'center',
                        border: '1px solid',
                        borderColor: 'divider',
                        borderRadius: 1,
                        p: 1,
                      }}
                    >
                      <Typography variant="body2">{producto.Nombre}</Typography>
                      <TextField
                        label="Cant."
                        type="number"
                        size="small"
                        value={productosCombo[producto.IdProducto] || 1}
                        onChange={(event) => cambiarCantidad(producto.IdProducto, event.target.value)}
                      />
                    </Box>
                  ))}
                </Stack>
                <Stack direction="row" spacing={1}>
                  <Button type="submit" variant="contained" color="secondary" startIcon={<SaveIcon />} fullWidth sx={{ fontWeight: 700 }}>
                    Guardar
                  </Button>
                  <Button variant="outlined" startIcon={<AddIcon />} onClick={limpiarFormulario} fullWidth>
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
                  <TableCell>Imagen</TableCell>
                  <TableCell>Combo</TableCell>
                  <TableCell>Menu</TableCell>
                  <TableCell align="right">Precio</TableCell>
                  <TableCell>Estado</TableCell>
                  <TableCell align="right">Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {combos.map((combo) => (
                  <TableRow key={combo.IdCombo} hover>
                    <TableCell sx={{ width: 88 }}>
                      <Box component="img" src={`${BASE_URL}/${combo.Imagen}`} alt={combo.Nombre} sx={{ width: 64, height: 48, objectFit: 'cover', borderRadius: 1 }} />
                    </TableCell>
                    <TableCell>
                      <Typography variant="subtitle2">{combo.Nombre}</Typography>
                      <Typography variant="caption" color="text.secondary" noWrap sx={{ display: 'block', maxWidth: 260 }}>
                        {combo.Descripcion}
                      </Typography>
                    </TableCell>
                    <TableCell>{combo.MenuNombre}</TableCell>
                    <TableCell align="right">₡{Math.round(combo.Precio)}</TableCell>
                    <TableCell>
                      <Chip label={combo.Estado ? 'Activo' : 'Inactivo'} size="small" color={combo.Estado ? 'success' : 'default'} />
                    </TableCell>
                    <TableCell align="right">
                      <Stack direction="row" spacing={1} justifyContent="flex-end">
                        <Button size="small" variant="outlined" startIcon={<EditIcon />} onClick={() => editarCombo(combo)}>
                          Editar
                        </Button>
                        <Button size="small" color="error" variant="outlined" startIcon={<DeleteIcon />} onClick={() => eliminarCombo(combo.IdCombo)}>
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
            Combos desactivados
          </Typography>

          <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2 }}>
            <Table size="small">
              <TableHead>
                <TableRow sx={{ backgroundColor: 'primaryLight.main' }}>
                  <TableCell>Imagen</TableCell>
                  <TableCell>Combo</TableCell>
                  <TableCell>Menu</TableCell>
                  <TableCell align="right">Precio</TableCell>
                  <TableCell>Estado</TableCell>
                  <TableCell align="right">Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {combosEliminados.map((combo) => (
                  <TableRow key={combo.IdCombo} hover>
                    <TableCell sx={{ width: 88 }}>
                      <Box component="img" src={`${BASE_URL}/${combo.Imagen}`} alt={combo.Nombre} sx={{ width: 64, height: 48, objectFit: 'cover', borderRadius: 1 }} />
                    </TableCell>
                    <TableCell>
                      <Typography variant="subtitle2">{combo.Nombre}</Typography>
                      <Typography variant="caption" color="text.secondary" noWrap sx={{ display: 'block', maxWidth: 260 }}>
                        {combo.Descripcion}
                      </Typography>
                    </TableCell>
                    <TableCell>{combo.MenuNombre}</TableCell>
                    <TableCell align="right">₡{Math.round(combo.Precio)}</TableCell>
                    <TableCell>
                      <Chip label="Inactivo" size="small" color="default" />
                    </TableCell>
                    <TableCell align="right">
                      <Button size="small" color="success" variant="contained" onClick={() => restaurarCombo(combo.IdCombo)}>
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
