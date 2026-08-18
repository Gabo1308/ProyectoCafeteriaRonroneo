import React, { useEffect, useState } from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
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
import { useTranslation } from 'react-i18next';
import MenuService from '../../services/MenuServices';
import ProductoService from '../../services/ProductosServices';
import ComboService from '../../services/CombosServices';

const formatoHora = (hora) => {
  if (!hora) return '';
  const [h, m] = hora.split(':').map(Number);
  const periodo = h < 12 ? 'a.m.' : 'p.m.';
  const hora2 = h === 0 ? 12 : h > 12 ? h - 12 : h;
  return `${hora2}:${String(m).padStart(2, '0')} ${periodo}`;
};

const formatoFecha = (fecha) => {
  if (!fecha) return '';
  const soloFecha = String(fecha).split('T')[0];
  const [anio, mes, dia] = soloFecha.split('-');
  return `${dia}/${mes}/${anio}`;
};

const menuVacio = {
  IdMenu: null,
  Nombre: '',
  Descripcion: '',
  FechaInicio: '',
  FechaFin: '',
  HoraInicio: '07:00',
  HoraFin: '12:00',
  DiasDisponibles: 'Lunes a domingo',
  Imagen: '',
  Estado: 1,
};

export function GestionMenus() {
  const { t } = useTranslation();
  const [menus, setMenus] = useState([]);
  const [menusEliminados, setMenusEliminados] = useState([]);
  const [productos, setProductos] = useState([]);
  const [combos, setCombos] = useState([]);
  const [form, setForm] = useState(menuVacio);
  const [productosMenu, setProductosMenu] = useState([]);
  const [combosMenu, setCombosMenu] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [subiendoImagen, setSubiendoImagen] = useState(false);
  const BASE_URL = import.meta.env.VITE_BASE_URL + 'uploads';

  const cargarDatos = () => {
    Promise.all([MenuService.getMenus(), MenuService.getMenusDesactivados(), ProductoService.getProductos(), ComboService.getCombos(),
    ])
      .then(([menusResponse, desactivadosResponse, productosResponse, combosResponse]) => {
        setMenus(menusResponse.data || []);
        setMenusEliminados(desactivadosResponse.data || []);
        setProductos(productosResponse.data || []);
        setCombos(combosResponse.data || []);
        setLoaded(true);
      })
      .catch((err) => {
        setLoaded(true);
        toast.error(t('admin.loadError', { message: err.message }));
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
    setCombosMenu([]);
  };

  const subirImagen = (event) => {
    const archivo = event.target.files?.[0];
    if (!archivo) return;
    setSubiendoImagen(true);
    MenuService.uploadImagenMenu(archivo)
      .then(async (response) => {
        setForm((actual) => ({ ...actual, Imagen: response.data.fileName }));
        toast.success(t('adminMenus.imageUploaded'));
      })
      .catch((err) => toast.error(t('admin.uploadError', { message: err.message })))
      .finally(() => {
        setSubiendoImagen(false);
        event.target.value = '';
      });
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
      Imagen: menu.Imagen || '',
      Estado: menu.Estado ?? 1,
    });
    MenuService.getProductosMenu(menu.IdMenu).then((response) => {
      setProductosMenu((response.data || []).map((producto) => String(producto.IdProducto)));
    });
    MenuService.getCombosByMenu(menu.IdMenu).then((response) => {
      setCombosMenu((response.data || []).map((combo) => String(combo.IdCombo)));
    });
  };

  const productosSeleccionados = productos.filter((producto) => productosMenu.includes(String(producto.IdProducto)));
  const combosSeleccionados = combos.filter((combo) => combosMenu.includes(String(combo.IdCombo)));

  const actualizarProductosSeleccionados = (_, nuevosProductos) => {
    setProductosMenu(nuevosProductos.map((producto) => String(producto.IdProducto)));
  };

  const actualizarCombosSeleccionados = (_, nuevosCombos) => {
    setCombosMenu(nuevosCombos.map((combo) => String(combo.IdCombo)));
  };

  const guardarMenu = (event) => {
    event.preventDefault();

    if (form.FechaInicio > form.FechaFin) {
      toast.error(t('adminMenus.invalidDates'));
      return;
    }
    if (form.HoraInicio >= form.HoraFin) {
      toast.error(t('adminMenus.invalidHours'));
      return;
    }

    const payload = { ...form, productos: productosMenu, combos: combosMenu };
    const accion = form.IdMenu ? MenuService.updateMenu(payload) : MenuService.createMenu(payload);

    accion
      .then(() => {
        toast.success(form.IdMenu ? t('adminMenus.updated') : t('adminMenus.created'));
        limpiarFormulario();
        cargarDatos();
      })
      .catch((err) => toast.error(t('admin.saveError', { message: err.message })));
  };

  const eliminarMenu = (idMenu) => {
    MenuService.deleteMenu(idMenu)
      .then(() => {
        toast.success(t('adminMenus.deleted'));
        cargarDatos();
      })
      .catch((err) => toast.error(t('admin.deleteError', { message: err.message })));
  };

  const restaurarMenu = (idMenu) => {
    MenuService.restoreMenu(idMenu)
      .then(() => {
        toast.success(t('adminMenus.restored'));
        cargarDatos();
      })
      .catch((err) => toast.error(t('admin.restoreError', { message: err.message })));
  };

  if (!loaded) return <p>{t('commonExtra.loading')}</p>;

  return (
    <Box sx={{ py: 2 }}>
      <Typography variant="h4" color="primary.main" gutterBottom>
        {t('adminMenus.pageTitle')}
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 3 }}>
        {t('adminMenus.subtitle')}
      </Typography>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 5 }}>
          <Card variant="outlined" sx={{ borderRadius: 2 }}>
            <CardContent component="form" onSubmit={guardarMenu}>
              <Stack spacing={2}>
                <Typography variant="h6">{form.IdMenu ? t('adminMenus.editMenu') : t('adminMenus.newMenu')}</Typography>
                <TextField label={t('adminUsers.name')} name="Nombre" value={form.Nombre} onChange={actualizarCampo} required fullWidth />
                <TextField label={t('common.description')} name="Descripcion" value={form.Descripcion} onChange={actualizarCampo} multiline minRows={2} fullWidth />
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      label={t('adminMenus.startDate')}
                      name="FechaInicio"
                      value={form.FechaInicio}
                      onChange={actualizarCampo}
                      type="date"
                      InputLabelProps={{ shrink: true }}
                      slotProps={{ inputLabel: { shrink: true } }}
                      required
                      fullWidth
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      label={t('adminMenus.endDate')}
                      name="FechaFin"
                      value={form.FechaFin}
                      onChange={actualizarCampo}
                      type="date"
                      InputLabelProps={{ shrink: true }}
                      slotProps={{ inputLabel: { shrink: true } }}
                      required
                      fullWidth
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField label={t('adminMenus.startTime')} name="HoraInicio" value={form.HoraInicio} onChange={actualizarCampo} type="time" InputLabelProps={{ shrink: true }} required fullWidth />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField label={t('adminMenus.endTime')} name="HoraFin" value={form.HoraFin} onChange={actualizarCampo} type="time" InputLabelProps={{ shrink: true }} required fullWidth />
                  </Grid>
                </Grid>
                <TextField label={t('adminMenus.availableDays')} name="DiasDisponibles" value={form.DiasDisponibles} onChange={actualizarCampo} fullWidth />
                <Stack spacing={1}>
                  <Button variant="outlined" component="label" startIcon={<UploadFileIcon />} disabled={subiendoImagen}>
                    {subiendoImagen ? t('adminProducts.uploading') : t('admin.image')}
                    <input type="file" hidden accept="image/*" onChange={subirImagen} />
                  </Button>
                  <TextField label={t('adminProducts.imageInUploads')} name="Imagen" value={form.Imagen} onChange={actualizarCampo} fullWidth />
                  {form.Imagen && (
                    <Box component="img" src={`${BASE_URL}/${form.Imagen}`} alt={form.Nombre} sx={{ width: '100%', height: 130, objectFit: 'cover', borderRadius: 2 }} />
                  )}
                </Stack>
                <Divider>
                  <Chip label={t('adminMenus.menuProducts')} />
                </Divider>
                <Autocomplete
                  multiple
                  options={productos}
                  value={productosSeleccionados}
                  onChange={actualizarProductosSeleccionados}
                  getOptionLabel={(producto) => `${producto.Nombre} - ${producto.Categoria}`}
                  isOptionEqualToValue={(option, value) => option.IdProducto === value.IdProducto}
                  renderInput={(params) => <TextField {...params} label={t('adminMenus.searchProducts')} />}
                />
                <Divider>
                  <Chip label={t('adminMenus.menuCombos')} />
                </Divider>
                <Autocomplete
                  multiple
                  options={combos}
                  value={combosSeleccionados}
                  onChange={actualizarCombosSeleccionados}
                  getOptionLabel={(combo) => `${combo.Nombre} - ${combo.MenuNombre}`}
                  isOptionEqualToValue={(option, value) => option.IdCombo === value.IdCombo}
                  renderInput={(params) => <TextField {...params} label={t('adminMenus.searchCombos')} />}
                />
                <Stack direction="row" spacing={1}>
                  <Button type="submit" variant="contained" color="secondary" startIcon={<SaveIcon />} fullWidth sx={{ fontWeight: 700 }}>
                    {t('admin.save')}
                  </Button>
                  <Button variant="outlined" startIcon={<AddIcon />} onClick={limpiarFormulario} fullWidth>
                    {t('admin.new')}
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
                  <TableCell>{t('adminProducts.image')}</TableCell>
                  <TableCell>{t('adminMenus.title')}</TableCell>
                  <TableCell>{t('adminMenus.schedule')}</TableCell>
                  <TableCell>{t('adminMenus.validity')}</TableCell>
                  <TableCell>{t('commonExtra.status')}</TableCell>
                  <TableCell align="right">{t('admin.actions')}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {menus.map((menu) => (
                  <TableRow key={menu.IdMenu} hover>
                    <TableCell sx={{ width: 88 }}>
                      <Box component="img" src={`${BASE_URL}/${menu.Imagen}`} alt={menu.Nombre} sx={{ width: 64, height: 48, objectFit: 'cover', borderRadius: 1 }} />
                    </TableCell>
                    <TableCell>
                      <Typography variant="subtitle2">{menu.Nombre}</Typography>
                      <Typography variant="caption" color="text.secondary" noWrap sx={{ display: 'block', maxWidth: 260 }}>
                        {menu.Descripcion}
                      </Typography>
                    </TableCell>
                    <TableCell>{formatoHora(menu.HoraInicio)} - {formatoHora(menu.HoraFin)}</TableCell>
                    <TableCell>
                      {formatoFecha(menu.FechaInicio)} / {formatoFecha(menu.FechaFin)}
                    </TableCell>
                    <TableCell>
                      <Chip label={menu.Estado ? t('admin.active') : t('admin.inactive')} size="small" color={menu.Estado ? 'success' : 'default'} />
                    </TableCell>
                    <TableCell align="right">
                      <Stack direction="row" spacing={1} justifyContent="flex-end">
                        <Button size="small" variant="outlined" startIcon={<EditIcon />} onClick={() => editarMenu(menu)}>
                          {t('admin.edit')}
                        </Button>
                        <Button size="small" color="error" variant="outlined" startIcon={<DeleteIcon />} onClick={() => eliminarMenu(menu.IdMenu)}>
                          {t('admin.delete')}
                        </Button>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Typography variant="h5" sx={{ mt: 5, mb: 2 }}>
            {t('adminMenus.disabledMenus')}
          </Typography>

          <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2 }}>
            <Table size="small">
              <TableHead>
                <TableRow sx={{ backgroundColor: 'primaryLight.main' }}>
                  <TableCell>{t('adminProducts.image')}</TableCell>
                  <TableCell>{t('adminMenus.title')}</TableCell>
                  <TableCell>{t('adminMenus.schedule')}</TableCell>
                  <TableCell>{t('adminMenus.validity')}</TableCell>
                  <TableCell>{t('commonExtra.status')}</TableCell>
                  <TableCell align="right">{t('admin.actions')}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {menusEliminados.map((menu) => (
                  <TableRow key={menu.IdMenu} hover>
                    <TableCell sx={{ width: 88 }}>
                      <Box component="img" src={`${BASE_URL}/${menu.Imagen}`} alt={menu.Nombre} sx={{ width: 64, height: 48, objectFit: 'cover', borderRadius: 1 }} />
                    </TableCell>
                    <TableCell>
                      <Typography variant="subtitle2">{menu.Nombre}</Typography>
                      <Typography variant="caption" color="text.secondary" noWrap sx={{ display: 'block', maxWidth: 260 }}>
                        {menu.Descripcion}
                      </Typography>
                    </TableCell>
                     <TableCell>{formatoHora(menu.HoraInicio)} - {formatoHora(menu.HoraFin)}</TableCell>
                    <TableCell>{formatoFecha(menu.FechaInicio)} / {formatoFecha(menu.FechaFin)}</TableCell>
                    <TableCell>
                      <Chip label={t('admin.inactive')} size="small" color="default" />
                    </TableCell>
                    <TableCell align="right">
                      <Button size="small" color="success" variant="contained" onClick={() => restaurarMenu(menu.IdMenu)}>
                        {t('admin.restore')}
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
