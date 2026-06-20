import React from 'react';
import { useState, useEffect } from 'react';
import PreparacionService from '../../services/PreparacionServices';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import { Link } from 'react-router-dom';
import { Info } from '@mui/icons-material';

export function CatalogPreparacion() {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    PreparacionService.getPreparaciones()
      .then((response) => {
        setData(response.data);
        setError(response.error);
        setLoaded(true);
      })
      .catch((error) => {
        setError(error);
        setLoaded(false);
      });
  }, []);

  if (!loaded) return <p>Cargando...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <Grid container sx={{ p: 2 }} spacing={3}>
      {data &&
        data.map((item) => (
          <Grid size={4} key={item.IdPreparacion}>
            <Card>
              <CardContent>
                <Typography variant="h6">{item.Producto}</Typography>
                <Typography color="text.secondary">
                  Cantidad de pasos: {item.CantidadPasos}
                </Typography>
              </CardContent>
              <CardActions>
                <IconButton
                  component={Link}
                  to={`/preparacion/${item.IdPreparacion}`}
                  aria-label="Detalle"
                  sx={{ ml: 'auto' }}
                >
                  <Info />
                </IconButton>
              </CardActions>
            </Card>
          </Grid>
        ))}
    </Grid>
  );
}
