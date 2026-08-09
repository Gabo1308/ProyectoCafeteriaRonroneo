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
import UsuarioService from "../../services/UsuarioServices";
import toast from "react-hot-toast";

export function Login() {
  const navigate = useNavigate();

  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");

  const login = (event) => {
    event?.preventDefault();

    if (!correo.trim() || !contrasena) {
      toast.error("Ingresa el correo y la contraseña");
      return;
    }

    const usuario = {
      Correo: correo.trim(),
      Contrasena: contrasena,
    };

    UsuarioService.login(usuario)
      .then((response) => {
        if (!response.data?.usuario) {
          throw new Error("El servidor no devolvió los datos del usuario");
        }

        localStorage.setItem("user", JSON.stringify(response.data.usuario));

        window.location.href = "/";
      })
      .catch((error) => {
        console.error(error);

        if (error.response) {
          toast.error(error.response.data.mensaje || error.response.data.message || "Correo o contraseña incorrectos");
        } else if (error.message) {
          toast.error(error.message);
        } else {
          toast.error("Error al conectar con el servidor");
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
            Iniciar Sesión
          </Typography>

          <Stack component="form" spacing={3} onSubmit={login}>
            <TextField
              label="Correo"
              fullWidth
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
            />

            <TextField
              label="Contraseña"
              type="password"
              fullWidth
              value={contrasena}
              onChange={(e) => setContrasena(e.target.value)}
            />

            <Button
              type="submit"
              variant="contained"
            >
              Ingresar
            </Button>
          </Stack>
        </Paper>
      </Box>
    </Container>
  );
}

export default Login;
