import React, { useState } from "react";
import axios from "../services/axiosConfig";
import { TextField, Button, Typography, Paper } from "@mui/material";

export default function LoginPage({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = () => {
    axios
      .post("http://localhost:8000/api/accounts/login/", {
        username,
        password,
      })
      .then((res) => {
        localStorage.setItem("token", res.data.access);
        localStorage.setItem("refresh", res.data.refresh);
        localStorage.setItem("user", JSON.stringify(res.data.user)); // <- guarda el usuario completo
        localStorage.setItem("role", res.data.user.role);
        onLogin(res.data.user); // <- pasa el user completo, no solo username y role
      })

      .catch(() => {
        setError("Credenciales inválidas");
      });
  };

  return (
    <Paper elevation={3} style={{ padding: 32, maxWidth: 400, margin: "auto", marginTop: 100 }}>
      <Typography variant="h5" gutterBottom>Iniciar sesión</Typography>
      <TextField
        label="Usuario"
        fullWidth
        margin="normal"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <TextField
        label="Contraseña"
        fullWidth
        type="password"
        margin="normal"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      {error && <Typography color="error">{error}</Typography>}
      <Button fullWidth variant="contained" onClick={handleLogin} sx={{ mt: 2 }}>
        Entrar
      </Button>
    </Paper>
  );
}
