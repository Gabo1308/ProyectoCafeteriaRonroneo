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
import { Info, LocalOffer, AddShoppingCart } from '@mui/icons-material';
import PropTypes from 'prop-types';
import { useCart } from '../../hooks/useCart';

ListCardCombos.propTypes = {
  data: PropTypes.array,
  isShopping: PropTypes.bool,
};

export function ListCardCombos({ data, isShopping = false }) {
  const BASE_URL = import.meta.env.VITE_BASE_URL + 'uploads';
  const { addItem } = useCart();

  return (
    <Grid container sx={{ p: { xs: 2, md: 4 } }} spacing={3}>
      {data &&
        data.map((item) => (
          <Grid size={{ xs: 12, sm: 6, md: 4 }} key={item.IdCombo}>
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
                <Chip
                  icon={<LocalOffer />}
                  label="Combo"
                  size="small"
                  color="secondary"
                  sx={{ mb: 1 }}
                />
                <Typography variant="body2" color="text.secondary" sx={{ minHeight: 42 }}>
                  {item.Descripcion}
                </Typography>
                <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                  <Typography variant="h6" color="primary.main">
                    ₡{Math.round(item.Precio)}
                  </Typography>
                </Box>
              </CardContent>
              <CardActions sx={{ p: 2, pt: 0, gap: 1 }}>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<Info />}
                  component={Link}
                  to={`/combo/${item.IdCombo}`}
                >
                  Ver detalle
                </Button>
                {isShopping && (
                  <Button
                    fullWidth
                    variant="contained"
                    startIcon={<AddShoppingCart />}
                    onClick={() => addItem(item, 'combo')}
                  >
                    Ordenar
                  </Button>
                )}
              </CardActions>
            </Card>
          </Grid>
        ))}
    </Grid>
  );
}
