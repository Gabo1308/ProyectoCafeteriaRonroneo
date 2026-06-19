import React from 'react';
import { useState, useEffect } from 'react';
import PreparacionService from '../../services/PreparacionServices';

export function CatalogPreparacion() {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    PreparacionService.getPreparaciones()
      .then((response) => {
        console.log(response);
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
    {data && data.map((item) => (
      <p key={item.IdPreparacion}>Pedido #{item.IdPedido} — {item.Observaciones}</p>
    ))}
  </>
}