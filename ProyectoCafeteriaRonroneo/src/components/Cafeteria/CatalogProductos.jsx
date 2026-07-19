import React from 'react';
import { useState } from 'react';
import ProductoService from '../../services/ProductosServices';
import { useEffect } from 'react';
import { ListCardProductos } from './ListCardProductos';

export function CatalogProductos() {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [loaded, setLoaded] = useState(false);


  const token = localStorage.getItem('token');
  const isShopping = Boolean(token);

  useEffect(() => {
    ProductoService.getProductos()
      .then((response) => {
        setData(response.data);
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

  if(!loaded) return <p>Cargando..</p>
  if(error) return <p>Error: {error.message}</p>
  return <>
    {data && <ListCardProductos data={data} isShopping={isShopping} />}
  </>
}