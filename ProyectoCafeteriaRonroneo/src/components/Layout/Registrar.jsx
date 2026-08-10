import React, { useState } from "react";
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
import toast from "react-hot-toast";
import UsuarioService from "../../services/UsuarioServices";
import { useTranslation } from "react-i18next";

export function Registrar() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [confirmarContrasena, setConfirmarContrasena] = useState("");

  const registrar = () => {
    if (!nombre || !apellido || !correo || !contrasena) {
      toast.error(t("auth.requiredFields"));
      return;
    }

    if (contrasena.length < 15) {
      toast.error(t("auth.passwordLength"));
      return;
    }

    const mayusculas = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const simbolos = "!@#$%^&*+-_=?.";

    let tieneMayuscula = false;
    let tieneSimbolo = false;

    for (let i = 0; i < contrasena.length; i++) {
      const caracter = contrasena[i];

      if (mayusculas.includes(caracter)) {
        tieneMayuscula = true;
      }

      if (simbolos.includes(caracter)) {
        tieneSimbolo = true;
      }
    }

    if (!tieneMayuscula) {
      toast.error(t("auth.passwordUppercase"));
      return;
    }

    if (!tieneSimbolo) {
      toast.error(t("auth.passwordSymbol"));
      return;
    }

    if (contrasena !== confirmarContrasena) {
      toast.error(t("auth.passwordMismatch"));
      return;
    }

    const usuario = {
      Nombre: nombre,
      Apellido: apellido,
      Correo: correo,
      Contrasena: contrasena,
    };

    UsuarioService.registrar(usuario)
      .then(() => {
        toast.success(t("auth.registrationSuccess"));
        navigate("/login");
      })
      .catch((error) => {
        console.log("ERROR:", error);
        console.log("RESPUESTA:", error.response);
        console.log("DATA:", error.response?.data);

        toast.error(t("auth.registrationError"));
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
          <Typography variant="h4" align="center" gutterBottom>
            {t("auth.registerTitle")}
          </Typography>

          <Stack spacing={3}>
            <TextField
              label={t("auth.firstName")}
              fullWidth
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
            />

            <TextField
              label={t("auth.lastName")}
              fullWidth
              value={apellido}
              onChange={(e) => setApellido(e.target.value)}
            />

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

            <TextField
              label={t("auth.confirmPassword")}
              type="password"
              fullWidth
              value={confirmarContrasena}
              onChange={(e) => setConfirmarContrasena(e.target.value)}
            />

            <Button variant="contained" onClick={registrar}>
              {t("auth.createAccount")}
            </Button>
          </Stack>
        </Paper>
      </Box>
    </Container>
  );
}

export default Registrar;