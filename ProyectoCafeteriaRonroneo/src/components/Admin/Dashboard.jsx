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
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import DashboardServices from "../../services/DashboardServices";

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
                <Typography color="text.secondary">{t("dashboard.sinDatos")}</Typography>
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={topProductos}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="nombre" tick={{ fontSize: 12 }} />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Bar dataKey="cantidad" fill="#8d6e63" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
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
                <Typography color="text.secondary">{t("dashboard.sinDatos")}</Typography>
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={pedidosPorEstado}
                      dataKey="cantidad"
                      nameKey="estado"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      label
                    >
                      {pedidosPorEstado.map((_, index) => (
                        <Cell key={index} fill={coloresEstado[index % coloresEstado.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}