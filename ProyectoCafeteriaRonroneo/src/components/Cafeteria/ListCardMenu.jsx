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
import { CalendarMonth, CheckCircle, Cancel, Info } from '@mui/icons-material';
import Chip from '@mui/material/Chip';
import PropTypes from 'prop-types';

ListCardMenu.propTypes = {
  data: PropTypes.array,
};

export function ListCardMenu({ data }) {
  const BASE_URL = import.meta.env.VITE_BASE_URL + 'uploads';

  const estaDisponiblePorHorario = (horaInicio, horaFin) => {
    if (!horaInicio || !horaFin) return true;

    const ahora = new Date();
    const minutosActuales = ahora.getHours() * 60 + ahora.getMinutes();
    const [inicioHora, inicioMinuto] = horaInicio.split(':').map(Number);
    const [finHora, finMinuto] = horaFin.split(':').map(Number);
    const minutosInicio = inicioHora * 60 + inicioMinuto;
    const minutosFin = finHora * 60 + finMinuto;

    if (minutosInicio <= minutosFin) {
      return minutosActuales >= minutosInicio && minutosActuales <= minutosFin;
    }

    return minutosActuales >= minutosInicio || minutosActuales <= minutosFin;
  };

  const formatoFecha = (fecha) => {
  if (!fecha) return '';
  const [anio, mes, dia] = fecha.split('-');
  return `${dia}-${mes}-${anio}`;
};

const formatoHora = (hora) => {
  if (!hora) return '';
  const [h, m] = hora.split(':').map(Number);
  const periodo = h < 12 ? 'a.m.' : 'p.m.';
  const hora12 = h === 0 ? 12 : h > 12 ? h - 12 : h;
  return `${hora12}:${String(m).padStart(2, '0')} ${periodo}`;
};

  return (
    <Grid container sx={{ p: { xs: 2, md: 4 } }} spacing={3}>
      {data &&
        data.map((item) => {
          const disponiblePorHorario = estaDisponiblePorHorario(item.HoraInicio, item.HoraFin);

          return (
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
                    {formatoFecha(item.FechaInicio)} - {formatoFecha(item.FechaFin)}
                  </Typography>
                </Box>
                {item.HoraInicio && item.HoraFin && (
                  <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 1 }}>
                    Horario: {formatoHora(item.HoraInicio)} - {formatoHora(item.HoraFin)}
                  </Typography>
                )}
                {item.DiasDisponibles && (
                  <Typography variant="caption" color="text.secondary" component="div" sx={{ mt: 0.5 }}>
                    Dias: {item.DiasDisponibles}
                  </Typography>
                )}
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 2 }}>
                  <Chip label={item.Estado ? 'Activo' : 'Inactivo'} color={item.Estado ? 'success' : 'error'} size="small" />
                  <Chip
                    icon={disponiblePorHorario ? <CheckCircle /> : <Cancel />}
                    label={disponiblePorHorario ? 'Menu disponible por horario' : 'Menu no disponible por horario'}
                    color={disponiblePorHorario ? 'success' : 'default'}
                    variant={disponiblePorHorario ? 'filled' : 'outlined'}
                    size="small"
                  />
                </Box>
              </CardContent>
              <CardActions sx={{ p: 2, pt: 0 }}>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<Info />}
                  component={Link}
                  to={`/menu/${item.IdMenu}`}
                >
                  Ver menu
                </Button>
              </CardActions>
            </Card>
          </Grid>
          );
        })}
    </Grid>
  );
}
