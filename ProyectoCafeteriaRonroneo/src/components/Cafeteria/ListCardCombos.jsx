import React from 'react';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import { Link } from 'react-router-dom';
import { Info } from '@mui/icons-material';
import PropTypes from 'prop-types';

ListCardCombos.propTypes = {
  data: PropTypes.array,
};

export function ListCardCombos({ data }) {
  const BASE_URL = import.meta.env.VITE_BASE_URL + 'uploads';

  return (
    <Grid container sx={{ p: 2 }} spacing={3}>
      {data &&
        data.map((item) => (
          <Grid size={4} key={item.IdCombo}>
            <Card>
              <CardHeader
                sx={{
                  p: 0,
                  backgroundColor: (theme) => theme.palette.secondary.main,
                  color: (theme) => theme.palette.common.white,
                }}
                style={{ textAlign: 'center' }}
                title={item.Nombre}
              />
              <CardMedia
                component="img"
                image={`${BASE_URL}/${item.Imagen}`}
                alt={item.Nombre}
                sx={{ width: 250, height: 160, objectFit: 'cover', mx: 'auto', mt: 1, borderRadius: 1 }}
              />
              <CardContent>
                <Typography variant="body2" color="text.secondary">
                  {item.Descripcion}
                </Typography>
                <Typography variant="h6" align="right" gutterBottom>
                  &cent;{item.Precio}
                </Typography>
              </CardContent>
              <CardActions
                disableSpacing
                sx={{ backgroundColor: (theme) => theme.palette.action.focus }}
              >
                <IconButton
                  component={Link}
                  to={`/combo/${item.IdCombo}`}
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
