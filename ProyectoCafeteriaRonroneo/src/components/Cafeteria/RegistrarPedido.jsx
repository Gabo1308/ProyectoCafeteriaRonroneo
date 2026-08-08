import React, { useEffect, useMemo, useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import MenuItem from '@mui/material/MenuItem';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import DeleteIcon from '@mui/icons-material/Delete';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useCart } from '../../hooks/useCart';
import PedidoService from '../../services/PedidoServices';

const Impuesto = 0.13;
const CostoEnvio = 1500;

const formatoFechaHoy = () => new Date().toLocaleDateString('es-CR');

function FilaDetalle({ item, onCantidadCommit, onEliminar, onObservaciones }) {
  const [textoCantidad, setTextoCantidad] = useState(String(item.Cantidad));

  const confirmarCantidad = () => {
    if (textoCantidad.trim() === '') {
      setTextoCantidad(String(item.Cantidad));
      return;
    }

    const numero = Number(textoCantidad);

    if (!Number.isInteger(numero) || numero < 0) {
      toast.error('La cantidad debe ser un número entero válido');
      setTextoCantidad(String(item.Cantidad));
      return;
    }

    onCantidadCommit(item, numero);
  };

  const subtotal = item.Precio * item.Cantidad;
  const impuesto = Math.round(subtotal * Impuesto);

  return (
    <TableRow>
      <TableCell>
        {item.Nombre}
        <Chip label={item.Tipo === 'producto' ? 'Producto' : 'Combo'} size="small" variant="outlined" sx={{ ml: 1 }} />
      </TableCell>
      <TableCell align="right">₡{Math.round(item.Precio)}</TableCell>
      <TableCell align="center" sx={{ width: 110 }}>
        <TextField
          size="small"
          value={textoCantidad}
          onChange={(e) => {
            const valor = e.target.value;
            if (valor === '' || /^[0-9]*$/.test(valor)) {
              setTextoCantidad(valor);
            }
          }}
          onBlur={confirmarCantidad}
          onKeyDown={(e) => {
            if (e.key === 'Enter') e.target.blur();
          }}
          inputProps={{ inputMode: 'numeric', style: { textAlign: 'center' } }}
          sx={{ width: 80 }}
        />
      </TableCell>
      <TableCell align="right">₡{Math.round(subtotal)}</TableCell>
      <TableCell align="right">₡{impuesto}</TableCell>
      <TableCell sx={{ minWidth: 180 }}>
        <TextField
          size="small"
          placeholder="Observaciones"
          fullWidth
          value={item.Observaciones || ''}
          onChange={(e) => onObservaciones(item, e.target.value)}
        />
      </TableCell>
      <TableCell align="right">
        <IconButton color="error" onClick={() => onEliminar(item)} aria-label={'Quitar ' + item.Nombre}>
          <DeleteIcon />
        </IconButton>
      </TableCell>
    </TableRow>
  );
  
}