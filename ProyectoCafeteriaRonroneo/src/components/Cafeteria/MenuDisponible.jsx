import React, { useEffect, useMemo, useState } from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import MenuService from '../../services/MenuServices';
import ComboService from '../../services/CombosServices';

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
      ComboService.getCombos(),
    ])
      .then(([menuResponse, productosResponse, combosResponse]) => {
        setMenu(menuResponse.data);
        setProductos(productosResponse.data);
        setCombos(combosResponse.data);
        setLoaded(true);
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
    <Container sx={{ mt: 5, mb: 5 }}>
      {menu && (
        <>
          <Typography variant="h3" component="h1" textAlign="center" gutterBottom>
            {menu.Nombre}
          </Typography>
          <Typography textAlign="center" color="text.secondary" gutterBottom>
            {menu.Descripcion}
          </Typography>
          <Typography textAlign="center" sx={{ mb: 3 }}>
            Disponible del {menu.FechaInicio} al {menu.FechaFin}
          </Typography>
        </>
      )}

      {Object.entries(productosPorCategoria).map(([categoria, items]) => (
        <React.Fragment key={categoria}>
          <Divider sx={{ my: 3 }}>
            <Chip label={categoria} color="primary" />
          </Divider>
          <Grid container spacing={2}>
            {items.map((producto) => (
              <Grid size={4} key={producto.IdProducto}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="h6">{producto.Nombre}</Typography>
                    <Typography color="text.secondary">{producto.Categoria}</Typography>
                    <Typography variant="subtitle1">&cent;{producto.Precio}</Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </React.Fragment>
      ))}

      <Divider sx={{ my: 4 }}>
        <Chip label="Combos" color="secondary" />
      </Divider>
      <Grid container spacing={2}>
        {combos.map((combo) => (
          <Grid size={4} key={combo.IdCombo}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6">{combo.Nombre}</Typography>
                <Typography color="text.secondary">{combo.Descripcion}</Typography>
                <Typography variant="subtitle1">&cent;{combo.Precio}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
