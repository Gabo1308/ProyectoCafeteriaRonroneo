import React, { useState } from "react";
import { useTranslation } from "react-i18next";

import {
  Box,
  Button,
  Container,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import UsuarioService from "../../services/UsuarioServices";
import toast from "react-hot-toast";

export function Login() {
  const { t } = useTranslation();

  const navigate = useNavigate();

  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");

  const login = (event) => {
    event?.preventDefault();

    if (!correo.trim() || !contrasena) {
      toast.error(t("auth.enterCredentials"));
      return;
    }

    const usuario = {
      Correo: correo.trim(),
      Contrasena: contrasena,
    };

    UsuarioService.login(usuario)
      .then((response) => {
        if (!response.data?.usuario) {
          throw new Error(
            response.data?.mensaje ||
              response.data?.message ||
              t("auth.serverDidNotReturnUser"),
          );
        }

        localStorage.setItem("user", JSON.stringify(response.data.usuario));

        window.location.href = "/";
      })
      .catch((error) => {
        console.error(error);

        if (error.response) {
          toast.error(t("auth.invalidCredentials"));
        } else if (error.message) {
          toast.error(error.message);
        } else {
          toast.error(t("auth.connectionError"));
        }
      });
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          mt: 8,
        }}
      >
        <Paper
          elevation={4}
          sx={{
            width: "100%",
            p: 4,
            borderRadius: 3,
          }}
        >
          <Typography
            variant="h4"
            align="center"
            gutterBottom
          >
            {t("auth.loginTitle")}
          </Typography>

          <Stack component="form" spacing={3} onSubmit={login}>
            <TextField
              label={t("auth.email")}
              fullWidth
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
            />

            <TextField
              label={t("auth.password")}
              type="password"
              fullWidth
              value={contrasena}
              onChange={(e) => setContrasena(e.target.value)}
            />

            <Button
              type="submit"
              variant="contained"
            >
              {t("auth.loginButton")}
            </Button>
          </Stack>
        </Paper>
      </Box>
    </Container>
  );
}

export default Login;
