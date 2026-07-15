import React from 'react';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { Link } from 'react-router-dom';
import { Info } from '@mui/icons-material';
import PropTypes from 'prop-types';

ListCardProductos.propTypes = {
  data: PropTypes.array,
};

export function ListCardProductos({ data }) {
  const BASE_URL = import.meta.env.VITE_BASE_URL + 'uploads';
  const resumir = (texto = '', limite = 82) => {
    if (!texto || texto.length <= limite) return texto;
    return `${texto.slice(0, limite).trim()}...`;
  };

  return (
    <Grid container sx={{ p: { xs: 2, md: 4 } }} spacing={3}>
      {data &&
        data.map((item) => (
          <Grid size={{ xs: 12, sm: 6, md: 4 }} key={item.IdProducto}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 2,
                overflow: 'hidden',
              }}
            >
              <CardHeader
                sx={{
                  py: 1.5,
                  backgroundColor: 'primary.main',
                  color: 'common.white',
                }}
                style={{ textAlign: 'center' }}
                title={item.Nombre}
                titleTypographyProps={{ variant: 'h6' }}
              />
              <CardMedia
                component="img"
                image={`${BASE_URL}/${item.Imagen}`}
                alt={item.Nombre}
                sx={{ width: '100%', height: 185, objectFit: 'cover' }}
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Chip
                  label={item.Categoria}
                  size="small"
                  color="secondary"
                  sx={{ mb: 1 }}
                />
                <Typography variant="body2" color="text.secondary" sx={{ minHeight: 42 }}>
                  {resumir(item.Descripcion)}
                </Typography>
                <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                  <Typography variant="h6" color="primary.main">
                    &cent;{item.Precio}
                  </Typography>
                </Box>
              </CardContent>
              <CardActions sx={{ p: 2, pt: 0 }}>
                <Button
                  fullWidth
                  variant="contained"
                  startIcon={<Info />}
                  component={Link}
                  to={`/producto/${item.IdProducto}`}
                >
                  Ver detalle
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
    </Grid>
  );
}
