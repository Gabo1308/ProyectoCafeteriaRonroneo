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

export function Login() {
  const navigate = useNavigate();

  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");

  const login = () => {
    const usuario = {
      Correo: correo,
      Contrasena: contrasena,
    };

    UsuarioService.login(usuario)
      .then((response) => {
        localStorage.setItem("token", response.data.token);

        window.location.href = "/";
      })
      .catch((error) => {
        console.log(error);
        
        toast.error("Correo o contraseña incorrectos");
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

          <Stack spacing={3}>
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
              variant="contained"
              onClick={login}
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