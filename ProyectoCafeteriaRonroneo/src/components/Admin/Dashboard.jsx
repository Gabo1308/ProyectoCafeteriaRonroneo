import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import { Navigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";
import { Bar, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
  Title,
} from 'chart.js';
import DashboardServices from "../../services/DashboardServices";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);
const coloresEstado = ["#8d6e63", "#ffb74d", "#4db6ac", "#e57373", "#64b5f6", "#a1887f"];

export function Dashboard() {
  const { t } = useTranslation();
  const [datos, setDatos] = useState(null);
  const [cargando, setCargando] = useState(true);

  const userStr = localStorage.getItem("user");
  const usuario = userStr && userStr !== "undefined" ? JSON.parse(userStr) : null;
  const autorizado = usuario?.Rol === "Administrador" || usuario?.Rol === "Encargado";

  useEffect(() => {
    if (!autorizado) return;
    DashboardServices.getEstadisticas()
      .then((res) => setDatos(res.data))
      .catch(() => toast.error(t("dashboard.errorCargar")))
      .finally(() => setCargando(false));
  }, []);

  if (!autorizado) {
    return <Navigate to="/" replace />;
  }

  if (cargando) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 6 }}>
        <CircularProgress />
      </Box>
    );
  }

  const topProductos = (datos?.topProductos || []).map((p) => ({
    nombre: p.Nombre,
    cantidad: Number(p.TotalPedidos),
  }));

  const pedidosPorEstado = (datos?.pedidosPorEstado || []).map((p) => ({
    estado: p.Estado,
    cantidad: Number(p.Cantidad),
  }));

  const resumen = datos?.resumen || { PedidosHoy: 0, TotalVentasHoy: 0 };

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      <Typography variant="h4" fontWeight={800} color="primary.dark" gutterBottom>
        {t("dashboard.titulo")}
      </Typography>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <Card variant="outlined" sx={{ borderRadius: 2 }}>
            <CardContent>
              <Typography variant="body2" color="text.secondary">
                {t("dashboard.pedidosHoy")}
              </Typography>
              <Typography variant="h4" fontWeight={800}>
                {resumen.PedidosHoy}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <Card variant="outlined" sx={{ borderRadius: 2 }}>
            <CardContent>
              <Typography variant="body2" color="text.secondary">
                {t("dashboard.ventasHoy")}
              </Typography>
              <Typography variant="h4" fontWeight={800}>
                ₡{Number(resumen.TotalVentasHoy).toLocaleString("es-CR")}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Card variant="outlined" sx={{ borderRadius: 2 }}>
            <CardContent>
              <Typography variant="h6" fontWeight={700} gutterBottom>
                {t("dashboard.topProductos")}
              </Typography>
              {topProductos.length === 0 ? (
              <Typography color="text.secondary">{t('dashboard.sinDatos')}</Typography>
              ) : (
                (() => {
                  const dataProductos = {
                    labels: topProductos.map((p) => p.nombre),
                    datasets: [
                      {
                        label: t('dashboard.topProductos'),
                        data: topProductos.map((p) => p.cantidad),
                        backgroundColor: 'rgba(141, 110, 99, 0.7)',
                        borderColor: 'rgb(141, 110, 99)',
                        borderRadius: 6,
                      },
                    ],
                  };
                  const opcionesProductos = {
                    responsive: true,
                    plugins: {
                      legend: { display: false },
                    },
                    scales: {
                      y: {
                        min: 0,
                        ticks: { precision: 0 },
                      },
                      x: {
                        ticks: { color: 'rgb(0, 0, 0)' },
                      },
                    },
                  };
                  
                  return <Bar data={dataProductos} options={opcionesProductos} />;
                })()
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Card variant="outlined" sx={{ borderRadius: 2 }}>
            <CardContent>
              <Typography variant="h6" fontWeight={700} gutterBottom>
                {t("dashboard.pedidosPorEstado")}
              </Typography>
              {pedidosPorEstado.length === 0 ? (
            <Typography color="text.secondary">{t('dashboard.sinDatos')}</Typography>
            ) : (
              (() => {
                const dataEstados = {
                  labels: pedidosPorEstado.map((p) => p.estado),
                  datasets: [
                    {
                      data: pedidosPorEstado.map((p) => p.cantidad),
                      backgroundColor: [
                        'rgba(141, 110, 99, 0.7)',
                        'rgba(255, 183, 77, 0.7)',
                        'rgba(77, 182, 172, 0.7)',
                        'rgba(229, 115, 115, 0.7)',
                        'rgba(100, 181, 246, 0.7)',
                      ],
                      borderColor: [
                        'rgb(141, 110, 99)',
                        'rgb(255, 183, 77)',
                        'rgb(77, 182, 172)',
                        'rgb(229, 115, 115)',
                        'rgb(100, 181, 246)',
                      ],
                      borderWidth: 1,
                    },
                  ],
                };
                
                const opcionesEstados = {
                  responsive: true,
                  plugins: {
                    legend: { position: 'bottom' },
                  },
                };

                return <Pie data={dataEstados} options={opcionesEstados} />;
              })()
            )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}