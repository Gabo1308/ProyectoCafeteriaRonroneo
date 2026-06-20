import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Button from '@mui/material/Button';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
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
    <Container component="main" sx={{ mt: 6, mb: 4 }}>
      {combo && (
        <Grid container spacing={3}>
          <Grid size={5}>
            <Box
              component="img"
              src={`${import.meta.env.VITE_BASE_URL}uploads/${combo.Imagen}`}
              alt={combo.Nombre}
              sx={{ width: '100%', borderRadius: 2 }}
            />
          </Grid>
          <Grid size={7}>
            <Typography variant="h4" component="h1" gutterBottom>
              {combo.Nombre}
            </Typography>
            <Typography color="text.secondary" gutterBottom>
              {combo.Descripcion}
            </Typography>
            <Typography variant="subtitle1" gutterBottom>
              Menu: {combo.MenuNombre}
            </Typography>
            <Typography variant="h5" gutterBottom>
              Precio: &cent;{combo.Precio}
            </Typography>
            <Card sx={{ mt: 2 }}>
              <CardContent>
                <Typography variant="h6">Productos del combo</Typography>
                <List>
                  {productos.map((producto) => (
                    <ListItem key={producto.IdProducto} disablePadding>
                      <ListItemText
                        primary={`${producto.Cantidad} x ${producto.Nombre}`}
                        secondary={`Precio individual: \u00a2${producto.Precio}`}
                      />
                    </ListItem>
                  ))}
                </List>
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
