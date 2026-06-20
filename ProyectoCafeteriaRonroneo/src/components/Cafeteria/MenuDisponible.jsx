import React, { useEffect, useMemo, useState } from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import MenuService from '../../services/MenuServices';

export function MenuDisponible() {
  const [menu, setMenu] = useState(null);
  const [productos, setProductos] = useState([]);
  const [combos, setCombos] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([
      MenuService.getMenuDisponible(),
      MenuService.getProductosMenu(),
    ])
      .then(([menuResponse, productosResponse]) => {
        const menuActual = menuResponse.data;
        setMenu(menuActual);
        setProductos(productosResponse.data);
        if (!menuActual?.IdMenu) {
          setCombos([]);
          setLoaded(true);
          return;
        }
        MenuService.getCombosByMenu(menuActual.IdMenu)
          .then((combosResponse) => {
            setCombos(combosResponse.data || []);
            setLoaded(true);
          })
          .catch((err) => {
            setError(err);
            setLoaded(true);
          });
      })
      .catch((err) => {
        setError(err);
        setLoaded(true);
      });
  }, []);

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

  return (
    <Container sx={{ mt: 5, mb: 6 }}>
      {!menu && (
        <Box sx={{ textAlign: 'center', p: 4 }}>
          <Typography variant="h5" color="primary.main">
            No hay un menu disponible para hoy.
          </Typography>
        </Box>
      )}

      {menu && (
        <Box
          sx={{
            textAlign: 'center',
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 2,
            p: { xs: 3, md: 4 },
            mb: 4,
            backgroundColor: 'primaryLight.main',
          }}
        >
          <RestaurantMenuIcon color="primary" sx={{ fontSize: 44, mb: 1 }} />
          <Typography variant="h3" component="h1" gutterBottom color="primary.main">
            {menu.Nombre}
          </Typography>
          <Typography color="text.secondary" gutterBottom>
            {menu.Descripcion}
          </Typography>
          <Chip
            label={`Disponible del ${menu.FechaInicio} al ${menu.FechaFin}`}
            color="primary"
            variant="outlined"
            sx={{ mt: 1 }}
          />
        </Box>
      )}

      <Stack spacing={4}>
        {Object.entries(productosPorCategoria).map(([categoria, items]) => (
          <Box key={categoria}>
            <Divider sx={{ mb: 2 }}>
              <Chip label={categoria} color="primary" />
            </Divider>
            <Grid container spacing={2}>
              {items.map((producto) => (
                <Grid size={{ xs: 12, sm: 6 }} key={producto.IdProducto}>
                  <Card variant="outlined" sx={{ height: '100%', borderRadius: 2 }}>
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
                        <Box>
                          <Typography variant="h6">{producto.Nombre}</Typography>
                          <Typography variant="body2" color="text.secondary">
                            {producto.Categoria}
                          </Typography>
                        </Box>
                        <Typography variant="h6" color="primary.main" sx={{ whiteSpace: 'nowrap' }}>
                          &cent;{producto.Precio}
                        </Typography>
                      </Box>
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
              <Grid size={{ xs: 12, sm: 6 }} key={combo.IdCombo}>
                <Card variant="outlined" sx={{ height: '100%', borderRadius: 2 }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
                      <Box>
                        <Typography variant="h6">{combo.Nombre}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          {combo.Descripcion}
                        </Typography>
                      </Box>
                      <Typography variant="h6" color="primary.main" sx={{ whiteSpace: 'nowrap' }}>
                        &cent;{combo.Precio}
                      </Typography>
                    </Box>
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
