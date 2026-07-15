import React from 'react';
import { useState, useEffect } from 'react';
import MenuService from '../../services/MenuServices';
import { ListCardMenu } from './ListCardMenu';
import { MenuDisponible } from './MenuDisponible';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

export function CatalogMenu() {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    MenuService.getMenus()
      .then((response) => {
        setData(response.data.data ?? response.data);
        setError(response.error);
        setLoaded(true);
      })
      .catch((error) => {
        console.log(error);
        if (error instanceof SyntaxError) {
          setError(error);
          setLoaded(false);
        }
      });
  }, []);

  if (!loaded) return <p>Cargando..</p>;
  if (error) return <p>Error: {error.message}</p>;
  return (
    <>
      <MenuDisponible />
      <Divider sx={{ my: 2 }}>
        <Box sx={{ px: 2 }}>
          <Typography variant="h6" color="text.secondary">
            Todos los menús
          </Typography>
        </Box>
      </Divider>
      {data && <ListCardMenu data={data} />}
    </>
  );
}