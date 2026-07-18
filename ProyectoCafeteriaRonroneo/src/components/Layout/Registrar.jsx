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

export function Registrar() {
  const navigate = useNavigate();

  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [confirmarContrasena, setConfirmarContrasena] = useState("");

  const registrar = () => {
    if (!nombre || !apellido || !correo || !contrasena) {
      toast.error("Todos los campos son obligatorios");
      return;
    }

    if (contrasena.length < 15) {
      toast.error("La contraseña debe tener al menos 15 caracteres");
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
      toast.error("La contraseña debe tener al menos una mayúscula");
      return;
    }

    if (!tieneSimbolo) {
      toast.error("La contraseña debe tener al menos un símbolo especial (+, *, !, @, etc.)");
      return;
    }

    if (contrasena !== confirmarContrasena) {
      toast.error("Las contraseñas no coinciden");
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
        toast.success("Usuario registrado con éxito");
        navigate("/login");
      })
      .catch((error) => {
        console.log("ERROR:", error);
        console.log("RESPUESTA:", error.response);
        console.log("DATA:", error.response?.data);

        toast.error("No se pudo registrar el usuario");
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
            Registrarse
          </Typography>

          <Stack spacing={3}>
            <TextField
              label="Nombre"
              fullWidth
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
            />

            <TextField
              label="Apellido"
              fullWidth
              value={apellido}
              onChange={(e) => setApellido(e.target.value)}
            />

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

            <TextField
              label="Confirmar contraseña"
              type="password"
              fullWidth
              value={confirmarContrasena}
              onChange={(e) => setConfirmarContrasena(e.target.value)}
            />

            <Button variant="contained" onClick={registrar}>
              Crear cuenta
            </Button>
          </Stack>
        </Paper>
      </Box>
    </Container>
  );
}

export default Registrar;