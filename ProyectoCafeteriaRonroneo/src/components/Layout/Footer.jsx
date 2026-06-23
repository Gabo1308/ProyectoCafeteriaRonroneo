import React from "react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import CoffeeIcon from "@mui/icons-material/Coffee";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import AlternateEmailIcon from "@mui/icons-material/AlternateEmail";
import PhoneIcon from "@mui/icons-material/Phone";

export function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        mt: 5,
        py: 3,
        backgroundColor: "primary.main",
        color: "common.white",
      }}
    >
      <Container maxWidth="xl">
        <Grid container spacing={3} alignItems="center">
          <Grid size={{ xs: 12, md: 4 }}>
            <Stack direction="row" spacing={1.5} alignItems="center">
              <CoffeeIcon />
              <Box>
                <Typography variant="h6">Cafeteria Ronroneo</Typography>
                <Typography variant="body2" sx={{ opacity: 0.85 }}>
                  Cafe, postres, combos y menus por horario.
                </Typography>
              </Box>
            </Stack>
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <Stack spacing={0.5}>
              <Stack direction="row" spacing={1} alignItems="center">
                <AccessTimeIcon fontSize="small" />
                <Typography variant="body2">Desayuno 7:00 a. m. - 12:00 m.</Typography>
              </Stack>
              <Typography variant="body2" sx={{ pl: 4, opacity: 0.85 }}>
                Almuerzo 1:00 p. m. - 6:00 p. m. | Cena 7:00 p. m. - 12:00 a. m.
              </Typography>
            </Stack>
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <Stack spacing={0.5} alignItems={{ xs: "flex-start", md: "flex-end" }}>
              <Stack direction="row" spacing={1} alignItems="center">
                <PhoneIcon fontSize="small" />
                <Typography variant="body2">8888-0000</Typography>
              </Stack>
              <Stack direction="row" spacing={1} alignItems="center">
                <AlternateEmailIcon fontSize="small" />
                <Typography variant="body2">contacto@ronroneo.com</Typography>
              </Stack>
              <Stack direction="row" spacing={1}>
                <Link href="#" color="inherit" underline="hover" variant="body2">
                  Instagram
                </Link>
                <Typography variant="body2">|</Typography>
                <Link href="#" color="inherit" underline="hover" variant="body2">
                  Facebook
                </Link>
              </Stack>
            </Stack>
          </Grid>

          <Grid size={12}>
            <Typography align="center" variant="caption" sx={{ display: "block", opacity: 0.8 }}>
              {new Date().getFullYear()} Cafeteria Ronroneo. Todos los derechos reservados.
            </Typography>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
