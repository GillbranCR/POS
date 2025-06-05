import React, { useEffect, useState } from "react";
import LoginPage from "./pages/LoginPage";
import DashboardLayoutBasic from "./layouts/DashboardLayoutBasic";
import axios from "./services/axiosConfig";

function App() {
  const [user, setUser] = useState(null);

  // Verifica si el token sigue siendo válido al cargar la app
  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
  
    if (token && storedUser) {
      console.log("Token encontrado. Verificando usuario...");
      axios.get("/accounts/me/")
        .then(() => {
          setUser(JSON.parse(storedUser));
          console.log("Usuario verificado y sesión restaurada");
        })
        .catch((err) => {
          console.error("Token inválido:", err);
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          setUser(null);
        });
    } else {
      console.log("No se encontró token");
    }
  }, []);
  

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  if (!user) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return <DashboardLayoutBasic user={user} onLogout={handleLogout} />;
}

export default App;


