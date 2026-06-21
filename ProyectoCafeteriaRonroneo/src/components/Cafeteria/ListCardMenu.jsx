import React from 'react';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { Link } from 'react-router-dom';
import { CalendarMonth, Info } from '@mui/icons-material';
import Chip from '@mui/material/Chip';
import PropTypes from 'prop-types';

ListCardMenu.propTypes = {
  data: PropTypes.array,
};

export function ListCardMenu({ data }) {
  const BASE_URL = import.meta.env.VITE_BASE_URL + 'uploads';

  return (
    <Grid container sx={{ p: { xs: 2, md: 4 } }} spacing={3}>
      {data &&
        data.map((item) => (
          <Grid size={{ xs: 12, sm: 6, md: 4 }} key={item.IdMenu}>
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
                sx={{ width: '100%', height: 180, objectFit: 'cover' }}
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {item.Descripcion}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 2 }}>
                  <CalendarMonth fontSize="small" color="primary" />
                  <Typography variant="caption">
                    {item.FechaInicio} - {item.FechaFin}
                  </Typography>
                </Box>
                {item.HoraInicio && item.HoraFin && (
                  <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 1 }}>
                    Horario: {item.HoraInicio} - {item.HoraFin}
                  </Typography>
                )}
                <Chip label={item.Estado ? 'Activo' : 'Inactivo'} color={item.Estado ? 'success' : 'error'} size="small" sx={{ mt: 2 }} />
              </CardContent>
              <CardActions sx={{ p: 2, pt: 0 }}>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<Info />}
                  component={Link}
                  to="/menu-disponible/"
                >
                  Ver menu disponible
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
    </Grid>
  );
}
