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
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import toast from 'react-hot-toast';
import ComboService from '../../services/CombosServices';
import MenuService from '../../services/MenuServices';
import ProductoService from '../../services/ProductosServices';

const comboVacio = {
  IdCombo: null,
  IdMenu: '',
  Nombre: '',
  Descripcion: '',
  Precio: '',
  Estado: 1,
};

export function GestionCombos() {
  const [combos, setCombos] = useState([]);
  const [menus, setMenus] = useState([]);
  const [productos, setProductos] = useState([]);
  const [form, setForm] = useState(comboVacio);
  const [productosCombo, setProductosCombo] = useState({});
  const [loaded, setLoaded] = useState(false);

  const cargarDatos = () => {
    Promise.all([ComboService.getCombos(), MenuService.getMenus(), ProductoService.getProductos()])
      .then(([combosResponse, menusResponse, productosResponse]) => {
        setCombos(combosResponse.data || []);
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

  const editarCombo = (combo) => {
    setForm({
      IdCombo: combo.IdCombo,
      IdMenu: combo.IdMenu,
      Nombre: combo.Nombre,
      Descripcion: combo.Descripcion || '',
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

  const alternarProducto = (idProducto) => {
    setProductosCombo((actual) => {
      const copia = { ...actual };
      if (copia[idProducto]) {
        delete copia[idProducto];
      } else {
        copia[idProducto] = 1;
      }
      return copia;
    });
  };

  const cambiarCantidad = (idProducto, cantidad) => {
    setProductosCombo((actual) => ({ ...actual, [idProducto]: cantidad }));
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

  if (!loaded) return <p>Cargando...</p>;

  return (
    <Box sx={{ py: 2 }}>
      <Typography variant="h4" color="primary.main" gutterBottom>
        CRUD de combos
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 3 }}>
        Crea combos con productos, cantidades, menu asociado y precio especial.
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
                <TextField label="Precio" name="Precio" value={form.Precio} onChange={actualizarCampo} type="number" required fullWidth />
                <Divider>
                  <Chip label="Productos del combo" />
                </Divider>
                <Stack spacing={1} sx={{ maxHeight: 330, overflowY: 'auto', pr: 1 }}>
                  {productos.map((producto) => {
                    const seleccionado = productosCombo[producto.IdProducto] !== undefined;
                    return (
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
                          px: 1,
                        }}
                      >
                        <FormControlLabel
                          control={<Checkbox checked={seleccionado} onChange={() => alternarProducto(producto.IdProducto)} />}
                          label={producto.Nombre}
                        />
                        <TextField
                          label="Cant."
                          type="number"
                          size="small"
                          value={productosCombo[producto.IdProducto] || 1}
                          onChange={(event) => cambiarCantidad(producto.IdProducto, event.target.value)}
                          disabled={!seleccionado}
                        />
                      </Box>
                    );
                  })}
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
            {combos.map((combo) => (
              <Grid size={{ xs: 12, sm: 6 }} key={combo.IdCombo}>
                <Card sx={{ height: '100%', borderRadius: 2 }}>
                  <CardContent>
                    <Chip label={combo.MenuNombre} size="small" color="secondary" sx={{ mb: 1 }} />
                    <Typography variant="h6">{combo.Nombre}</Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                      {combo.Descripcion}
                    </Typography>
                    <Typography variant="h5" color="primary.main" sx={{ mt: 2 }}>
                      &cent;{combo.Precio}
                    </Typography>
                  </CardContent>
                  <CardActions sx={{ px: 2, pb: 2 }}>
                    <Button variant="outlined" startIcon={<EditIcon />} onClick={() => editarCombo(combo)}>
                      Editar
                    </Button>
                    <Button color="error" variant="outlined" startIcon={<DeleteIcon />} onClick={() => eliminarCombo(combo.IdCombo)}>
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
