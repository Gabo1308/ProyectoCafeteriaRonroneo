import React from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItemText from '@mui/material/ListItemText';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemButton from '@mui/material/ListItemButton';
import Grid from '@mui/material/Grid';
import ProductoService from '../../services/ProductosServices';
import Button from '@mui/material/Button';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';

export function DetalleProductos() {
  const routeParams = useParams();
  console.log(routeParams);
  const navigate = useNavigate();
  const BASE_URL = import.meta.env.VITE_BASE_URL + 'uploads';
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    ProductoService.getProductoById(routeParams.id)
      .then((response) => {
        setData(response.data);
        console.log(response.data);
        setError(response.error);
        setLoaded(true);
      })
      .catch((error) => {
        console.log(error);
        setError(error);
        throw new Error('Respuesta no válida del servidor');
      });
  }, [routeParams.id]);

  if (!loaded) return <p>Cargando...</p>;
  if (error) return <p>Error: {error.message}</p>;
  return (
    <Container component="main" sx={{ mt: 8, mb: 2 }}>
      {data && (
        <Grid container spacing={2}>
          <Grid size={5}>
            <Box
              component="img"
              sx={{
                borderRadius: '4%',
                maxWidth: '100%',
                height: 'auto',
              }}
              alt={data.Nombre}
              src={`${BASE_URL}/${data.Imagen}`}
            />
          </Grid>
          <Grid size={7}>
            <Typography variant="h4" component="h1" gutterBottom>
              {data.Nombre}
            </Typography>
            <Typography component="span" variant="subtitle1" display="block">
                <Box fontWeight="bold" display="inline">
                    Categoría: {data.Categoria}
                </Box>{' '}
            </Typography>
            <Typography component="span" variant="subtitle1" display="block" gutterBottom sx={{ mt: 1 }}>
                {data.Descripcion}
            </Typography>
            <Typography component="span" variant="subtitle1">
              <Box fontWeight="bold">Ingredientes:</Box>
              <List
                sx={{
                  width: '100%',
                  maxWidth: 360,
                  bgcolor: 'background.paper',
                }}
              >
                {data.ingredientes &&
                  data.ingredientes.split(',').map((item, index) => (
                    <ListItemButton key={index}>
                      <ListItemIcon>
                        <RestaurantIcon />
                      </ListItemIcon>
                      <ListItemText primary={item.trim()} />
                    </ListItemButton>
                  ))}
              </List>
            </Typography>
            <Typography variant="h5" sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
                <Box fontWeight="bold" component="span">
                    Precio:
                </Box>{' '}
                &cent;{data.Precio}
            </Typography>
          </Grid>
        </Grid>
      )}
      <Box
        sx={{
          mt: 4,
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <Button
          variant="contained"
          color="primary"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate(-1)}
        >
          Regresar
        </Button>
      </Box>
    </Container>
  );
}