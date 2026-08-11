import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Chip from '@mui/material/Chip';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import ProductoService from '../../services/ProductosServices';
import ComboService from '../../services/CombosServices';
import MenuService from '../../services/MenuServices';
import FondoRonroneo from '../../assets/fondoRonroneo.png';

const BASE_URL = import.meta.env.VITE_BASE_URL + 'uploads';

function Carrusel({ titulo, verTodoLink, items, renderCard }) {
  const { t } = useTranslation();

  if (!items || items.length === 0) return null;

  return (
    <Box sx={{ mb: 6 }}>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{ mb: 2 }}
      >
        {titulo}

        <Button
          component={Link}
          to={verTodoLink}
          endIcon={<ArrowForwardIcon />}
          sx={{ fontWeight: 700 }}
        >
          {t('home.viewAll')}
        </Button>
      </Stack>

      <Box
        sx={{
          display: 'flex',
          gap: 2,
          overflowX: 'auto',
          pb: 1,
          scrollSnapType: 'x mandatory',
          '&::-webkit-scrollbar': { height: 8 },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: 'primary.light',
            borderRadius: 4,
          },
        }}
      >
        {items.map((item) => renderCard(item))}
      </Box>
    </Box>
  );
}

export function Home() {
  const { t } = useTranslation();

  const [productos, setProductos] = useState([]);
  const [combos, setCombos] = useState([]);
  const [menus, setMenus] = useState([]);

  useEffect(() => {
    ProductoService.getProductos()
      .then((response) =>
        setProductos((response.data || []).slice(0, 8))
      )
      .catch(() => setProductos([]));

    ComboService.getCombos()
      .then((response) =>
        setCombos((response.data || []).slice(0, 6))
      )
      .catch(() => setCombos([]));

    MenuService.getMenus()
      .then((response) =>
        setMenus((response.data || []).slice(0, 4))
      )
      .catch(() => setMenus([]));
  }, []);

  return (
    <Box
      sx={{
        backgroundImage: `url(${FondoRonroneo})`,
        backgroundRepeat: 'repeat',
        backgroundSize: '260px',
        width: '100vw',
        position: 'relative',
        left: '50%',
        marginLeft: '-50vw',
        marginTop: '-1vw',
        marginBottom: '-4vw',
      }}
    >
      <Container sx={{ py: 6, textAlign: 'center' }}>
        <Typography variant="h3" fontWeight={700} sx={{ mb: 1 }}>
          {t('home.title')}
        </Typography>

        <Typography
          variant="h5"
          color="text.secondary"
          sx={{ mb: 4 }}
        >
          {t('home.subtitle')}
        </Typography>

        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={2}
          justifyContent="center"
          sx={{ mb: 6 }}
        >
          <Button
            component={Link}
            to="/catalog-productos/"
            variant="contained"
            color="secondary"
            size="large"
            sx={{ fontWeight: 700 }}
          >
            {t('home.viewProducts')}
          </Button>

          <Button
            component={Link}
            to="/catalog-menu/"
            variant="outlined"
            color="secondary"
            size="large"
            sx={{ fontWeight: 700 }}
          >
            {t('home.viewMenus')}
          </Button>
        </Stack>
      </Container>

      <Container sx={{ pb: 4 }}>
        <Carrusel
          titulo={
            <Typography variant="h5" fontWeight={700}>
              {t('home.featuredProducts')}
            </Typography>
          }
          verTodoLink="/catalog-productos/"
          items={productos}
          renderCard={(producto) => (
            <Card
              key={producto.IdProducto}
              variant="outlined"
              sx={{
                minWidth: 240,
                maxWidth: 240,
                flexShrink: 0,
                borderRadius: 2,
                scrollSnapAlign: 'start',
              }}
            >
              <CardActionArea
                component={Link}
                to={`/producto/${producto.IdProducto}`}
              >
                <CardMedia
                  component="img"
                  image={`${BASE_URL}/${producto.Imagen}`}
                  alt={producto.Nombre}
                  sx={{ height: 140, objectFit: 'cover' }}
                />

                <CardContent>
                  <Chip
                    label={producto.Categoria}
                    size="small"
                    color="secondary"
                    sx={{ mb: 1 }}
                  />

                  <Typography
                    variant="subtitle1"
                    fontWeight={700}
                    noWrap
                  >
                    {producto.Nombre}
                  </Typography>

                  <Typography
                    variant="body2"
                    color="primary.main"
                    fontWeight={700}
                  >
                    ₡{Math.round(producto.Precio)}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          )}
        />

        <Carrusel
          titulo={
            <Typography variant="h5" fontWeight={700}>
              {t('home.popularCombos')}
            </Typography>
          }
          verTodoLink="/catalog-combos/"
          items={combos}
          renderCard={(combo) => (
            <Card
              key={combo.IdCombo}
              variant="outlined"
              sx={{
                minWidth: 260,
                maxWidth: 260,
                flexShrink: 0,
                borderRadius: 2,
                scrollSnapAlign: 'start',
              }}
            >
              <CardActionArea
                component={Link}
                to={`/combo/${combo.IdCombo}`}
              >
                <CardMedia
                  component="img"
                  image={`${BASE_URL}/${combo.Imagen}`}
                  alt={combo.Nombre}
                  sx={{ height: 140, objectFit: 'cover' }}
                />

                <CardContent>
                  <Chip
                    label={t('cards.combo')}
                    size="small"
                    color="secondary"
                    sx={{ mb: 1 }}
                  />

                  <Typography
                    variant="subtitle1"
                    fontWeight={700}
                    noWrap
                  >
                    {combo.Nombre}
                  </Typography>

                  <Typography
                    variant="body2"
                    color="primary.main"
                    fontWeight={700}
                  >
                    ₡{Math.round(combo.Precio)}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          )}
        />

        <Carrusel
          titulo={
            <Typography variant="h5" fontWeight={700}>
              {t('home.availableMenus')}
            </Typography>
          }
          verTodoLink="/catalog-menu/"
          items={menus}
          renderCard={(menu) => (
            <Card
              key={menu.IdMenu}
              variant="outlined"
              sx={{
                minWidth: 260,
                maxWidth: 260,
                flexShrink: 0,
                borderRadius: 2,
                scrollSnapAlign: 'start',
              }}
            >
              <CardActionArea
                component={Link}
                to={`/menu/${menu.IdMenu}`}
              >
                <CardMedia
                  component="img"
                  image={`${BASE_URL}/${menu.Imagen}`}
                  alt={menu.Nombre}
                  sx={{ height: 140, objectFit: 'cover' }}
                />

                <CardContent>
                  <Typography
                    variant="subtitle1"
                    fontWeight={700}
                    noWrap
                  >
                    {menu.Nombre}
                  </Typography>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                    noWrap
                  >
                    {menu.Descripcion}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          )}
        />
      </Container>
    </Box>
  );
}
