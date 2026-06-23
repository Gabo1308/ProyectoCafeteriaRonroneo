import React, { useEffect, useMemo, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import MenuService from '../../services/MenuServices';

export function DetalleMenu() {
  const routeParams = useParams();
  const [menu, setMenu] = useState(null);
  const [productos, setProductos] = useState([]);
  const [combos, setCombos] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState('');
  const uploadsUrl = import.meta.env.VITE_BASE_URL + 'uploads';

  const estaDisponiblePorHorario = (horaInicio, horaFin) => {
    if (!horaInicio || !horaFin) return true;

    const ahora = new Date();
    const minutosActuales = ahora.getHours() * 60 + ahora.getMinutes();
    const [inicioHora, inicioMinuto] = horaInicio.split(':').map(Number);
    const [finHora, finMinuto] = horaFin.split(':').map(Number);
    const minutosInicio = inicioHora * 60 + inicioMinuto;
    const minutosFin = finHora * 60 + finMinuto;

    if (minutosInicio <= minutosFin) {
      return minutosActuales >= minutosInicio && minutosActuales <= minutosFin;
    }

    return minutosActuales >= minutosInicio || minutosActuales <= minutosFin;
  };

  useEffect(() => {
    Promise.all([
      MenuService.getMenuById(routeParams.id),
      MenuService.getProductosMenu(routeParams.id),
      MenuService.getCombosByMenu(routeParams.id),
    ])
      .then(([menuResponse, productosResponse, combosResponse]) => {
        setMenu(menuResponse.data);
        setProductos(productosResponse.data || []);
        setCombos(combosResponse.data || []);
        setLoaded(true);
      })
      .catch((err) => {
        setError(err);
        setLoaded(true);
      });
  }, [routeParams.id]);

  const productosPorCategoria = useMemo(() => {
    return productos.reduce((acc, producto) => {
      const categoria = producto.Categoria || 'Otros';
      acc[categoria] = acc[categoria] || [];
      acc[categoria].push(producto);
      return acc;
    }, {});
  }, [productos]);

  if (!loaded) return <p>Cargando...</p>;
  if (error) return <p>Error: {error.message}</p>;
  if (!menu) return <p>No se encontro el menu solicitado.</p>;

  const disponiblePorHorario = estaDisponiblePorHorario(menu.HoraInicio, menu.HoraFin);

  return (
    <Container sx={{ mt: 5, mb: 6 }}>
      <Button component={Link} to="/catalog-menu/" startIcon={<ArrowBackIcon />} sx={{ mb: 3 }}>
        Volver a menus
      </Button>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '1.1fr 0.9fr' },
          gap: 3,
          alignItems: 'stretch',
          mb: 4,
        }}
      >
        <Box
          sx={{
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 2,
            p: { xs: 3, md: 4 },
            backgroundColor: 'primaryLight.main',
          }}
        >
          <RestaurantMenuIcon color="primary" sx={{ fontSize: 44, mb: 1 }} />
          <Typography variant="h3" component="h1" color="primary.main" gutterBottom>
            {menu.Nombre}
          </Typography>
          <Typography color="text.secondary" sx={{ mb: 2 }}>
            {menu.Descripcion}
          </Typography>
          <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
            <Chip label={menu.Estado ? 'Activo' : 'Inactivo'} color={menu.Estado ? 'success' : 'error'} />
            <Chip
              icon={disponiblePorHorario ? <CheckCircleIcon /> : <CancelIcon />}
              label={disponiblePorHorario ? 'Menu disponible por horario' : 'Menu no disponible por horario'}
              color={disponiblePorHorario ? 'success' : 'default'}
              variant={disponiblePorHorario ? 'filled' : 'outlined'}
            />
          </Stack>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            Vigencia: {menu.FechaInicio} - {menu.FechaFin}
          </Typography>
          {menu.HoraInicio && menu.HoraFin && (
            <Typography variant="body2" color="text.secondary">
              Horario: {menu.HoraInicio} - {menu.HoraFin}
            </Typography>
          )}
          {menu.DiasDisponibles && (
            <Typography variant="body2" color="text.secondary">
              Dias: {menu.DiasDisponibles}
            </Typography>
          )}
        </Box>

        <Card sx={{ borderRadius: 2, overflow: 'hidden' }}>
          <CardMedia component="img" image={`${uploadsUrl}/${menu.Imagen}`} alt={menu.Nombre} sx={{ height: '100%', minHeight: 260, objectFit: 'cover' }} />
        </Card>
      </Box>

      <Stack spacing={4}>
        {Object.entries(productosPorCategoria).map(([categoria, items]) => (
          <Box key={categoria}>
            <Divider sx={{ mb: 2 }}>
              <Chip label={categoria} color="primary" />
            </Divider>
            <Grid container spacing={2}>
              {items.map((producto) => (
                <Grid size={{ xs: 12, sm: 6, md: 4 }} key={producto.IdProducto}>
                  <Card variant="outlined" sx={{ height: '100%', borderRadius: 2 }}>
                    {producto.Imagen && (
                      <CardMedia component="img" image={`${uploadsUrl}/${producto.Imagen}`} alt={producto.Nombre} sx={{ height: 150, objectFit: 'cover' }} />
                    )}
                    <CardContent>
                      <Typography variant="h6">{producto.Nombre}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {producto.Categoria}
                      </Typography>
                      <Typography variant="h6" color="primary.main" sx={{ mt: 1 }}>
                        &cent;{producto.Precio}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        ))}

        <Box>
          <Divider sx={{ mb: 2 }}>
            <Chip icon={<LocalOfferIcon />} label="Combos" color="secondary" />
          </Divider>
          <Grid container spacing={2}>
            {combos.map((combo) => (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={combo.IdCombo}>
                <Card variant="outlined" sx={{ height: '100%', borderRadius: 2 }}>
                  {combo.Imagen && (
                    <CardMedia component="img" image={`${uploadsUrl}/${combo.Imagen}`} alt={combo.Nombre} sx={{ height: 150, objectFit: 'cover' }} />
                  )}
                  <CardContent>
                    <Typography variant="h6">{combo.Nombre}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {combo.Descripcion}
                    </Typography>
                    <Typography variant="h6" color="primary.main" sx={{ mt: 1 }}>
                      &cent;{combo.Precio}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Stack>
    </Container>
  );
}
