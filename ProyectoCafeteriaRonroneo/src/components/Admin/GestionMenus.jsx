import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Checkbox from '@mui/material/Checkbox';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import FormControlLabel from '@mui/material/FormControlLabel';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import toast from 'react-hot-toast';
import MenuService from '../../services/MenuServices';
import ProductoService from '../../services/ProductosServices';

const menuVacio = {
  IdMenu: null,
  Nombre: '',
  Descripcion: '',
  FechaInicio: '',
  FechaFin: '',
  HoraInicio: '07:00',
  HoraFin: '12:00',
  DiasDisponibles: 'Lunes a domingo',
  Estado: 1,
};

export function GestionMenus() {
  const [menus, setMenus] = useState([]);
  const [productos, setProductos] = useState([]);
  const [form, setForm] = useState(menuVacio);
  const [productosMenu, setProductosMenu] = useState([]);
  const [loaded, setLoaded] = useState(false);

  const cargarDatos = () => {
    Promise.all([MenuService.getMenus(), ProductoService.getProductos()])
      .then(([menusResponse, productosResponse]) => {
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
    setForm(menuVacio);
    setProductosMenu([]);
  };

  const editarMenu = (menu) => {
    setForm({
      IdMenu: menu.IdMenu,
      Nombre: menu.Nombre,
      Descripcion: menu.Descripcion || '',
      FechaInicio: menu.FechaInicio || '',
      FechaFin: menu.FechaFin || '',
      HoraInicio: (menu.HoraInicio || '07:00').slice(0, 5),
      HoraFin: (menu.HoraFin || '12:00').slice(0, 5),
      DiasDisponibles: menu.DiasDisponibles || 'Lunes a domingo',
      Estado: menu.Estado ?? 1,
    });
    MenuService.getProductosMenu(menu.IdMenu).then((response) => {
      setProductosMenu((response.data || []).map((producto) => String(producto.IdProducto)));
    });
  };

  const alternarProducto = (idProducto) => {
    const id = String(idProducto);
    setProductosMenu((actual) => (actual.includes(id) ? actual.filter((item) => item !== id) : [...actual, id]));
  };

  const guardarMenu = (event) => {
    event.preventDefault();
    const payload = { ...form, productos: productosMenu };
    const accion = form.IdMenu ? MenuService.updateMenu(payload) : MenuService.createMenu(payload);

    accion
      .then(() => {
        toast.success(form.IdMenu ? 'Menu actualizado' : 'Menu creado');
        limpiarFormulario();
        cargarDatos();
      })
      .catch((err) => toast.error(`No se pudo guardar: ${err.message}`));
  };

  const eliminarMenu = (idMenu) => {
    MenuService.deleteMenu(idMenu)
      .then(() => {
        toast.success('Menu eliminado');
        cargarDatos();
      })
      .catch((err) => toast.error(`No se pudo eliminar: ${err.message}`));
  };

  if (!loaded) return <p>Cargando...</p>;

  return (
    <Box sx={{ py: 2 }}>
      <Typography variant="h4" color="primary.main" gutterBottom>
        CRUD de menus
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 3 }}>
        Define disponibilidad, horarios y productos que pertenecen a cada menu.
      </Typography>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 5 }}>
          <Card variant="outlined" sx={{ borderRadius: 2 }}>
            <CardContent component="form" onSubmit={guardarMenu}>
              <Stack spacing={2}>
                <Typography variant="h6">{form.IdMenu ? 'Editar menu' : 'Nuevo menu'}</Typography>
                <TextField label="Nombre" name="Nombre" value={form.Nombre} onChange={actualizarCampo} required fullWidth />
                <TextField label="Descripcion" name="Descripcion" value={form.Descripcion} onChange={actualizarCampo} multiline minRows={2} fullWidth />
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField label="Fecha inicio" name="FechaInicio" value={form.FechaInicio} onChange={actualizarCampo} type="date" InputLabelProps={{ shrink: true }} required fullWidth />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField label="Fecha fin" name="FechaFin" value={form.FechaFin} onChange={actualizarCampo} type="date" InputLabelProps={{ shrink: true }} required fullWidth />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField label="Hora inicio" name="HoraInicio" value={form.HoraInicio} onChange={actualizarCampo} type="time" InputLabelProps={{ shrink: true }} required fullWidth />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField label="Hora fin" name="HoraFin" value={form.HoraFin} onChange={actualizarCampo} type="time" InputLabelProps={{ shrink: true }} required fullWidth />
                  </Grid>
                </Grid>
                <TextField label="Dias disponibles" name="DiasDisponibles" value={form.DiasDisponibles} onChange={actualizarCampo} fullWidth />
                <Divider>
                  <Chip label="Productos del menu" />
                </Divider>
                <Stack spacing={1} sx={{ maxHeight: 310, overflowY: 'auto', pr: 1 }}>
                  {productos.map((producto) => (
                    <Box
                      key={producto.IdProducto}
                      sx={{
                        border: '1px solid',
                        borderColor: 'divider',
                        borderRadius: 1,
                        px: 1,
                      }}
                    >
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={productosMenu.includes(String(producto.IdProducto))}
                            onChange={() => alternarProducto(producto.IdProducto)}
                          />
                        }
                        label={`${producto.Nombre} - ${producto.Categoria}`}
                      />
                    </Box>
                  ))}
                </Stack>
                <Stack direction="row" spacing={1}>
                  <Button type="submit" variant="contained" startIcon={<SaveIcon />} fullWidth>
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
          <Grid container spacing={2}>
            {menus.map((menu) => (
              <Grid size={{ xs: 12, sm: 6 }} key={menu.IdMenu}>
                <Card sx={{ height: '100%', borderRadius: 2 }}>
                  <CardContent>
                    <Typography variant="h6">{menu.Nombre}</Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                      {menu.Descripcion}
                    </Typography>
                    <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap" sx={{ mt: 2 }}>
                      <Chip label={`${menu.FechaInicio} / ${menu.FechaFin}`} size="small" />
                      <Chip label={`${menu.HoraInicio} - ${menu.HoraFin}`} size="small" color="secondary" />
                      <Chip label={menu.DiasDisponibles || 'Sin dias'} size="small" color="primary" variant="outlined" />
                    </Stack>
                  </CardContent>
                  <CardActions sx={{ px: 2, pb: 2 }}>
                    <Button variant="outlined" startIcon={<EditIcon />} onClick={() => editarMenu(menu)}>
                      Editar
                    </Button>
                    <Button color="error" variant="outlined" startIcon={<DeleteIcon />} onClick={() => eliminarMenu(menu.IdMenu)}>
                      Eliminar
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
}
