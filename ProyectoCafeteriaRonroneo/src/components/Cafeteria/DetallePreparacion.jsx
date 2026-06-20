import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PreparacionService from '../../services/PreparacionServices';

export function DetallePreparacion() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    PreparacionService.getPreparacionById(id)
      .then((response) => {
        setData(response.data);
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
    <Container sx={{ mt: 6, mb: 4 }}>
      {data && (
        <>
          <Typography variant="h4" component="h1" gutterBottom>
            Proceso de preparacion: {data.Producto}
          </Typography>
          <Typography color="text.secondary" gutterBottom>
            Estaciones ordenadas del proceso
          </Typography>
          <List>
            {data.Estaciones.map((estacion) => (
              <ListItem key={`${estacion.Orden}-${estacion.Estacion}`}>
                <ListItemText primary={`Paso ${estacion.Orden}: ${estacion.Estacion}`} />
              </ListItem>
            ))}
          </List>
        </>
      )}
      <Box sx={{ mt: 4, textAlign: 'center' }}>
        <Button variant="contained" startIcon={<ArrowBackIcon />} onClick={() => navigate(-1)}>
          Regresar
        </Button>
      </Box>
    </Container>
  );
}
