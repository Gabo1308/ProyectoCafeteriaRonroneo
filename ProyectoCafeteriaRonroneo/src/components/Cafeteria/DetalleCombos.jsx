import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import ComboService from '../../services/CombosServices';

export function DetalleCombos() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [combo, setCombo] = useState(null);
  const [productos, setProductos] = useState([]);
  const [error, setError] = useState('');
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    Promise.all([
      ComboService.getComboById(id),
      ComboService.getProductosByCombo(id),
    ])
      .then(([comboResponse, productosResponse]) => {
        setCombo(comboResponse.data);
        setProductos(productosResponse.data);
        setLoaded(true);
      })
      .catch((err) => {
        setError(err);
        setLoaded(true);
      });
  }, [id]);

  if (!loaded) return <p>Cargando...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <Container component="main" sx={{ mt: 6, mb: 5 }}>
      {combo && (
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 5 }}>
            <Box
              component="img"
              src={`${import.meta.env.VITE_BASE_URL}uploads/${combo.Imagen}`}
              alt={combo.Nombre}
              sx={{ width: '100%', borderRadius: 2, maxHeight: 360, objectFit: 'cover' }}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 7 }}>
            <Chip icon={<LocalOfferIcon />} label="Combo especial" color="secondary" sx={{ mb: 2 }} />
            <Typography variant="h4" component="h1" gutterBottom color="primary.main">
              {combo.Nombre}
            </Typography>
            <Typography color="text.secondary" gutterBottom>
              {combo.Descripcion}
            </Typography>
            <Typography variant="subtitle1" gutterBottom>
              Menu: {combo.MenuNombre}
            </Typography>
            <Typography variant="h5" gutterBottom color="primary.main">
              Precio: ₡{Math.round(combo.Precio)}
            </Typography>
            <Card variant="outlined" sx={{ mt: 2, borderRadius: 2 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>Productos del combo</Typography>
                <Stack spacing={1}>
                  {productos.map((producto) => (
                    <Box
                      key={producto.IdProducto}
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        borderBottom: '1px solid',
                        borderColor: 'divider',
                        py: 1,
                      }}
                    >
                      <Typography>{producto.Cantidad} x {producto.Nombre}</Typography>
                      <Typography color="text.secondary">₡{producto.Precio}</Typography>
                    </Box>
                  ))}
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}
      <Box sx={{ mt: 4, textAlign: 'center' }}>
        <Button variant="contained" startIcon={<ArrowBackIcon />} onClick={() => navigate(-1)}>
          Regresar
        </Button>
      </Box>
    </Container>
  );
}
