import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import PedidoService from '../../services/PedidoServices';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';

const formatoFecha = (fecha) => {
  if (!fecha) return '';
  const soloFecha = String(fecha).split('T')[0];
  const [anio, mes, dia] = soloFecha.split('-');
  return `${dia}/${mes}/${anio}`;
};

export function DetallePedido() {
  const { t } = useTranslation();
  const { id } = useParams();
  const [pedido, setPedido] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const [despachando, setDespachando] = useState(false);

  const colorEstado = (estado) => {
    switch (estado) {
      case 'Entregada':
        return 'success';
      case 'Pendiente de pago':
        return 'warning';
      case 'Procesando':
      case 'Preparación':
        return 'info';
      default:
        return 'default';
    }
  };

  const traducirEstado = (estado) => {
    switch (estado) {
      case 'Pendiente de pago':
        return t('orderDetail.pendingPayment');
      case 'Preparación':
        return t('orderDetail.preparation');
      default:
        return estado;
    }
  };

  const campoFactura = (etiqueta, valor) => (
    <Box>
      <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
        {etiqueta}
      </Typography>
      <Typography variant="body1">{valor || '—'}</Typography>
    </Box>
  );

  const userStr = localStorage.getItem('user');
  const usuario = userStr && userStr !== 'undefined' ? JSON.parse(userStr) : null;
  const puedeDespachar = usuario?.Rol === 'Encargado' || usuario?.Rol === 'Administrador';

  useEffect(() => {
    PedidoService.getPedido(id)
      .then((response) => {
        setPedido(response.data);
        setLoaded(true);
      })
      .catch((err) => {
        toast.error(t('orderDetail.loadError', { message: err.message }));
        setLoaded(true);
      });
  }, [id]);

  const despacharPedido = () => {
    setDespachando(true);
    PedidoService.despacharPedido(id)
      .then((response) => {
        toast.success(t('orderDetail.delivered'));
        setPedido(response.data);
      })
      .catch((err) => toast.error(t('orderDetail.dispatchError', { message: err.message })))
      .finally(() => setDespachando(false));
  };

  const generarPDF = (pedido, totalSinImpuesto, totalImpuestos, totalConImpuesto) => {
    const doc = new jsPDF();

    doc.text(`${t('orderDetail.titlePrefix')} #${pedido.IdPedido}`, 14, 20);

    const tableColumn = [
      t('orderDetail.columnProduct'),
      t('orderDetail.price'),
      t('orderDetail.quantity'),
      t('orderDetail.columnSubtotal'),
      t('orderDetail.tax'),
      t('orderDetail.observations'),
    ];
    const tableRows = [];

    pedido.Detalle.forEach((linea) => {
      const dataLinea = [
        linea.Nombre,
        `${Math.round(linea.PrecioUnitario).toLocaleString('en-US')} Colones`,
        linea.Cantidad,
        `${Math.round(linea.Subtotal).toLocaleString('en-US')} Colones`,
        `${Math.round(linea.Impuesto).toLocaleString('en-US')} Colones`,
        linea.Observaciones || '-',
      ];
      tableRows.push(dataLinea);
    });

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 30,
      headStyles: { fillColor: [169, 118, 79] },
    });

    const finalY = doc.lastAutoTable.finalY + 10;
    doc.text(`${t('orderDetail.date')}: ${formatoFecha(pedido.FechaPedido)}`, 14, finalY);
    doc.text(`${t('commonExtra.client')}: ${pedido.ClienteNombre} - ${pedido.ClienteCorreo}`, 14, finalY + 6);
    doc.text(`${t('orderDetail.paymentMethod')}: ${pedido.MetodoPago}`, 14, finalY + 12);
    doc.text(`${t('orderDetail.totalWithoutTax')}: ${totalSinImpuesto.toLocaleString('en-US')} Colones`, 14, finalY + 20);
    doc.text(`${t('orderDetail.taxes')}: ${totalImpuestos.toLocaleString('en-US')} Colones`, 14, finalY + 26);
    doc.setFontSize(13);
    doc.text(`${t('orderDetail.total')}: ${totalConImpuesto.toLocaleString('en-US')} Colones`, 196, finalY + 34, { align: 'right' });

    doc.save(`factura_pedido_${pedido.IdPedido}.pdf`);
  };

  if (!loaded) return <p>{t('commonExtra.loading')}</p>;

  if (!pedido) {
    return (
      <Box sx={{ py: 4 }}>
        <Typography color="text.secondary">{t('orderDetail.notFound')}</Typography>
      </Box>
    );
  }

  const totalConImpuesto = Math.round(pedido.Total);
  const totalSinImpuesto = Math.round(pedido.TotalSinImpuesto);
  const totalImpuestos = totalConImpuesto - totalSinImpuesto - Math.round(pedido.CostoEnvio || 0);

  return (
    <Box sx={{ py: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 1 }}>
        <Typography variant="h4" color="primary.main" gutterBottom>
          {t('orderDetail.titlePrefix')} #{pedido.IdPedido}
        </Typography>
        <Button
          variant="contained"
          startIcon={<PictureAsPdfIcon />}
          sx={{ backgroundColor: '#642714', '&:hover': { backgroundColor: '#4f1e10' } }}
          onClick={() => generarPDF(pedido, totalSinImpuesto, totalImpuestos, totalConImpuesto)}
        >
          {t('orderDetail.generateReport')}
        </Button>
      </Box>

      <Paper variant="outlined" sx={{ p: 3, borderRadius: 2, mb: 3 }}>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>{campoFactura(t('orderDetail.date'), formatoFecha(pedido.FechaPedido))}</Grid>
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            {campoFactura(t('commonExtra.client'), `${pedido.ClienteNombre} — ${pedido.ClienteCorreo}`)}
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            {campoFactura(t('orderDetail.manager'), `${pedido.EncargadoNombre} ${pedido.EncargadoApellido}`)}
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>{campoFactura(t('orderDetail.deliveryMethod'), pedido.MetodoEntrega)}</Grid>
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>{campoFactura(t('orderDetail.paymentMethod'), pedido.MetodoPago)}</Grid>
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
              {t('history.status')}
            </Typography>
            <Chip label={traducirEstado(pedido.Estado)} color={colorEstado(pedido.Estado)} sx={{ mt: 0.5 }} />
            {puedeDespachar && pedido.Estado === 'Procesando' && (
              <Button
                variant="contained"
                color="secondary"
                size="small"
                sx={{ mt: 1, display: 'block' }}
                disabled={despachando}
                onClick={despacharPedido}
              >
                {despachando ? t('orderDetail.dispatching') : t('orderDetail.markDelivered')}
              </Button>
            )}
          </Grid>
          {pedido.MetodoEntrega === 'Entrega a domicilio' && (
            <Grid size={{ xs: 12 }}>{campoFactura(t('orderDetail.deliveryAddress'), pedido.DireccionEntrega)}</Grid>
          )}
        </Grid>
      </Paper>

      <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2 }}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: 'primaryLight.main' }}>
              <TableCell>{t('orderDetail.columnProduct')}</TableCell>
              <TableCell align="right">{t('orderDetail.price')}</TableCell>
              <TableCell align="right">{t('orderDetail.quantity')}</TableCell>
              <TableCell align="right">{t('orderDetail.columnSubtotal')}</TableCell>
              <TableCell align="right">{t('orderDetail.tax')}</TableCell>
              <TableCell>{t('orderDetail.observations')}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {pedido.Detalle.map((linea) => (
              <TableRow key={linea.IdDetalle}>
                <TableCell>
                  {linea.Nombre}
                  <Chip label={linea.Tipo} size="small" variant="outlined" sx={{ ml: 1 }} />
                </TableCell>
                <TableCell align="right">₡{Math.round(linea.PrecioUnitario).toLocaleString('en-US')}</TableCell>
                <TableCell align="right">{linea.Cantidad}</TableCell>
                <TableCell align="right">₡{Math.round(linea.Subtotal).toLocaleString('en-US')}</TableCell>
                <TableCell align="right">₡{Math.round(linea.Impuesto).toLocaleString('en-US')}</TableCell>
                <TableCell>{linea.Observaciones || '—'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Paper variant="outlined" sx={{ p: 3, borderRadius: 2, mt: 3, maxWidth: 400, ml: 'auto' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography>{t('orderDetail.totalWithoutTax')}</Typography>
          <Typography>₡{totalSinImpuesto.toLocaleString('en-US')}</Typography>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography>{t('orderDetail.taxes')}</Typography>
          <Typography>₡{totalImpuestos.toLocaleString('en-US')}</Typography>
        </Box>
        {pedido.CostoEnvio > 0 && (
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography>{t('orderDetail.shippingCost')}</Typography>
            <Typography>₡{Math.round(pedido.CostoEnvio).toLocaleString('en-US')}</Typography>
          </Box>
        )}
        <Divider sx={{ my: 1 }} />
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="h6">{t('orderDetail.total')}</Typography>
          <Typography variant="h6" color="primary.main">
            ₡{totalConImpuesto.toLocaleString('en-US')}
          </Typography>
        </Box>
        {pedido.MetodoPago === 'Efectivo' && pedido.MontoRecibido != null && (
          <>
            <Divider sx={{ my: 1 }} />
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="body2">{t('orderDetail.amountReceived')}</Typography>
              <Typography variant="body2">₡{Math.round(pedido.MontoRecibido).toLocaleString('en-US')}</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="body2">{t('orderDetail.change')}</Typography>
              <Typography variant="body2">₡{Math.round(pedido.Vuelto).toLocaleString('en-US')}</Typography>
            </Box>
          </>
        )}
      </Paper>
    </Box>
  );
}