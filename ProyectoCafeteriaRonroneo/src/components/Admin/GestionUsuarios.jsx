import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
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
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import toast from 'react-hot-toast';
import UsuarioService from '../../services/UsuarioServices';
import PreparacionService from '../../services/PreparacionServices';

const Roles = [
  { id: 1, nombre: 'Administrador' },
  { id: 2, nombre: 'Cliente' },
  { id: 3, nombre: 'Encargado' },
  { id: 4, nombre: 'Cocina' },
];

const formVacio = { IdUsuario: null, Nombre: '', Apellido: '', Correo: '', IdRol: 3, Contrasena: '', IdEstacion: '' };

export function GestionUsuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [usuariosEliminados, setUsuariosEliminados] = useState([]);
  const [estaciones, setEstaciones] = useState([]);
  const [form, setForm] = useState(formVacio);
  const [loaded, setLoaded] = useState(false);

  const cargarDatos = () => {
    Promise.all([UsuarioService.getUsuarios(), UsuarioService.getUsuariosDesactivados(), PreparacionService.getEstaciones()])
      .then(([activosResponse, desactivadosResponse, estacionesResponse]) => {
        setUsuarios(activosResponse.data || []);
        setUsuariosEliminados(desactivadosResponse.data || []);
        setEstaciones(estacionesResponse.data || []);
        setLoaded(true);
      })
      .catch((err) => {
        setLoaded(true);
        toast.error(`Error al cargar usuarios: ${err.message}`);
      });
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const actualizarCampo = (e) => {
    setForm((actual) => ({ ...actual, [e.target.name]: e.target.value }));
  };

  const limpiarFormulario = () => setForm(formVacio);

  const editarUsuario = (usuario) => {
    setForm({
      IdUsuario: usuario.IdUsuario,
      Nombre: usuario.Nombre,
      Apellido: usuario.Apellido,
      Correo: usuario.Correo,
      IdRol: usuario.IdRol,
      Contrasena: '',
      IdEstacion: usuario.IdEstacion || '',
    });
  };

  const guardarUsuario = (event) => {
    event.preventDefault();

    if (!form.IdUsuario && !form.Contrasena) {
      toast.error('La contraseña es obligatoria al crear un usuario');
      return;
    }

    if (form.Contrasena) {
      if (form.Contrasena.length < 15) {
        toast.error('La contraseña debe tener al menos 15 caracteres');
        return;
      }

      const simbolos = '!@#$%^&*+-_=?.';
      let tieneSimbolo = false;

      for (let i = 0; i < form.Contrasena.length; i++) {
        if (simbolos.includes(form.Contrasena[i])) {
          tieneSimbolo = true;
          break;
        }
      }

      if (!tieneSimbolo) {
        toast.error('La contraseña debe tener al menos un carácter especial (+, *, !, @, etc.)');
        return;
      }
    }

    const accion = form.IdUsuario ? UsuarioService.actualizarUsuario(form) : UsuarioService.crearUsuario(form);

    accion
      .then(() => {
        toast.success(form.IdUsuario ? 'El usuario fue actualizado' : 'El usuario fue creado');
        limpiarFormulario();
        cargarDatos();
      })
      .catch((err) => toast.error(`No se pudo guardar el usuario: ${err.message}`));
  };

  const eliminarUsuario = (idUsuario) => {
    UsuarioService.deleteUsuario(idUsuario)
      .then(() => {
        toast.success('El usuario eliminado');
        cargarDatos();
      })
      .catch((err) => toast.error(`No se pudo eliminar: ${err.message}`));
  };

  const restaurarUsuario = (idUsuario) => {
    UsuarioService.restoreUsuario(idUsuario)
      .then(() => {
        toast.success('Usuario restaurado');
        cargarDatos();
      })
      .catch((err) => toast.error(`No se pudo restaurar: ${err.message}`));
  };

  if (!loaded) return <p>Cargando...</p>;

  return (
    <Box sx={{ py: 2 }}>
      <Typography variant="h4" color="primary.main" gutterBottom>
        Mantenimiento de usuarios
      </Typography>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 5 }}>
          <Card variant="outlined" sx={{ borderRadius: 2 }}>
            <CardContent component="form" onSubmit={guardarUsuario}>
              <Stack spacing={2}>
                <Typography variant="h6">{form.IdUsuario ? 'Editar usuario' : 'Nuevo usuario'}</Typography>

                <TextField label="Nombre" name="Nombre" value={form.Nombre} onChange={actualizarCampo} required fullWidth />
                <TextField label="Apellido" name="Apellido" value={form.Apellido} onChange={actualizarCampo} required fullWidth />
                <TextField label="Correo" name="Correo" value={form.Correo} onChange={actualizarCampo} required fullWidth />
                <TextField label="Rol" name="IdRol" select value={form.IdRol} onChange={actualizarCampo} required fullWidth>
                  {Roles.map((rol) => (
                    <MenuItem key={rol.id} value={rol.id}>
                      {rol.nombre}
                    </MenuItem>
                  ))}
                </TextField>

                {form.IdRol === 4 && (
                  <TextField
                    label="Estación asignada"
                    name="IdEstacion"
                    select
                    value={form.IdEstacion}
                    onChange={actualizarCampo}
                    required
                    fullWidth
                  >
                    {estaciones.map((estacion) => (
                      <MenuItem key={estacion.IdEstacion} value={estacion.IdEstacion}>
                        {estacion.Nombre}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
                <TextField
                  label={form.IdUsuario ? 'Nueva contraseña (opcional)' : 'Contraseña'}
                  name="Contrasena"
                  type="password"
                  value={form.Contrasena}
                  onChange={actualizarCampo}
                  fullWidth
                  required={!form.IdUsuario}
                  helperText={form.IdUsuario ? 'Déjalo en blanco para no cambiarla' : ''}
                />

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
                  <TableCell align="center">Nombre</TableCell>
                  <TableCell align="center">Correo</TableCell>
                  <TableCell align="center">Rol</TableCell>
                  <TableCell align="center">Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {usuarios.map((usuario) => (
                  <TableRow key={usuario.IdUsuario} hover>
                    <TableCell align="center">{usuario.Nombre} {usuario.Apellido}</TableCell>
                    <TableCell align="center">{usuario.Correo}</TableCell>
                    <TableCell align="center">
                      <Chip label={usuario.Rol} size="small" color="secondary" />
                    </TableCell>
                    <TableCell align="right">
                      <Stack direction="row" spacing={1} justifyContent="flex-end">
                        <Button size="small" variant="outlined" startIcon={<EditIcon />} onClick={() => editarUsuario(usuario)}>
                          Editar
                        </Button>
                        <Button size="small" color="error" variant="outlined" startIcon={<DeleteIcon />} onClick={() => eliminarUsuario(usuario.IdUsuario)}>
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
            Usuarios desactivados
          </Typography>

          <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2 }}>
            <Table size="small">
              <TableHead>
                <TableRow sx={{ backgroundColor: 'primaryLight.main' }}>
                  <TableCell align="center">Nombre</TableCell>
                  <TableCell align="center">Correo</TableCell>
                  <TableCell align="center">Rol</TableCell>
                  <TableCell align="center">Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {usuariosEliminados.map((usuario) => (
                  <TableRow key={usuario.IdUsuario} hover>
                    <TableCell align="center">{usuario.Nombre} {usuario.Apellido}</TableCell>
                    <TableCell align="center">{usuario.Correo}</TableCell>
                    <TableCell align="center">
                      <Chip label={usuario.Rol} size="small" color="default" />
                    </TableCell>
                    <TableCell align="right">
                      <Button size="small" color="success" variant="contained" onClick={() => restaurarUsuario(usuario.IdUsuario)}>
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