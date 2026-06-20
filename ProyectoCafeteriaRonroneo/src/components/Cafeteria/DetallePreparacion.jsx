import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import KitchenIcon from '@mui/icons-material/Kitchen';
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
    <Container sx={{ mt: 6, mb: 5 }}>
      {data && (
        <>
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <KitchenIcon color="primary" sx={{ fontSize: 44, mb: 1 }} />
            <Typography variant="h4" component="h1" gutterBottom color="primary.main">
              {data.Producto}
            </Typography>
            <Typography color="text.secondary">
              Proceso de preparacion por estaciones
            </Typography>
          </Box>
          <Stack spacing={2}>
            {data.Estaciones.map((estacion) => (
              <Card key={`${estacion.Orden}-${estacion.Estacion}`} variant="outlined" sx={{ borderRadius: 2 }}>
                <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Chip label={`Paso ${estacion.Orden}`} color="primary" />
                  <Typography variant="h6">{estacion.Estacion}</Typography>
                </CardContent>
              </Card>
            ))}
          </Stack>
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
