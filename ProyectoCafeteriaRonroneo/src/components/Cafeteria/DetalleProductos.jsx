import React from "react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import ProductoService from "../../services/ProductosServices";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import LocalCafeIcon from "@mui/icons-material/LocalCafe";
import RestaurantIcon from "@mui/icons-material/Restaurant";

export function DetalleProductos() {
  const routeParams = useParams();
  const navigate = useNavigate();
  const BASE_URL = import.meta.env.VITE_BASE_URL + "uploads";
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    ProductoService.getProductoById(routeParams.id)
      .then((response) => {
        setData(response.data);
        setError(response.error);
        setLoaded(true);
      })
      .catch((err) => {
        setError(err);
        setLoaded(true);
      });
  }, [routeParams.id]);

  if (!loaded) return <p>Cargando...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const ingredientes = Array.isArray(data?.Ingredientes)
    ? data.Ingredientes
    : [];

  return (
    <Container component="main" sx={{ mt: 6, mb: 5 }}>
      {data && (
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 5 }}>
            <Box
              component="img"
              sx={{
                borderRadius: 2,
                width: "100%",
                maxHeight: 380,
                objectFit: "cover",
              }}
              alt={data.Nombre}
              src={`${BASE_URL}/${data.Imagen}`}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 7 }}>
            <Chip
              icon={<LocalCafeIcon />}
              label={data.Categoria}
              color="secondary"
              sx={{ mb: 2 }}
            />
            <Typography
              variant="h4"
              component="h1"
              gutterBottom
              color="primary.main"
            >
              {data.Nombre}
            </Typography>
            <Typography color="text.secondary" gutterBottom>
              {data.Descripcion}
            </Typography>
            <Typography variant="h5" gutterBottom color="primary.main">
              ₡{data.Precio}
            </Typography>
            {ingredientes.length > 0 && (
              <Card variant="outlined" sx={{ mt: 2, borderRadius: 2 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Ingredientes
                  </Typography>
                  <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
                    {ingredientes.map((ingrediente) => (
                      <Chip
                        key={ingrediente.IdIngrediente}
                        icon={<RestaurantIcon />}
                        label={ingrediente.Nombre}
                        variant="outlined"
                        color="primary"
                      />
                    ))}
                  </Stack>
                </CardContent>
              </Card>
            )}
          </Grid>
        </Grid>
      )}
      <Box
        sx={{
          mt: 4,
          display: "flex",
          justifyContent: "center",
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
