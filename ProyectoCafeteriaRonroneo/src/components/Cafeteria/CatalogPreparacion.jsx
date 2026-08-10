import React from 'react';
import { useState, useEffect } from 'react';
import PreparacionService from '../../services/PreparacionServices';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { Link } from 'react-router-dom';
import { Info, Kitchen, Timer } from '@mui/icons-material';
import { useTranslation } from "react-i18next";

export function CatalogPreparacion() {
  const { t } = useTranslation();

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

  if (!loaded) return <p> {t("common.loading")} </p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      <Typography variant="h4" color="primary.main" gutterBottom>
        {t("preparation.title")}
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 3 }}>
        {t("preparation.description")}
      </Typography>
      <Grid container spacing={3}>
        {data &&
          data.map((item) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={item.IdPreparacion}>
              <Card
                sx={{
                  height: '100%',
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 2,
                }}
              >
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <Kitchen color="primary" />
                    <Typography variant="h6">{item.Producto}</Typography>
                  </Box>
                  <Chip
                    icon={<Timer />}
                    label={t("preparation.steps", {count: Number(item.CantidadPasos),})}
                    color="secondary"
                    sx={{ fontWeight: 700 }}
                  />
                </CardContent>
                <CardActions sx={{ p: 2, pt: 0 }}>
                  <Button
                    fullWidth
                    variant="contained"
                    color="secondary"
                    startIcon={<Info />}
                    component={Link}
                    to={`/preparacion/${item.IdPreparacion}`}
                    sx={{ fontWeight: 700 }}
                  >
                    {t("preparation.viewStations")}
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
      </Grid>
    </Box>
  );
}
