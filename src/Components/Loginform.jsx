import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import './Loginform.css'; 

function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:3000/api/login", {
        username,
        password,
      });
      const token = response.data.token;
      localStorage.setItem("jwtToken", token); 
      navigate("/"); 
    } catch (err) {
      setError("Credenciales incorrectas");
      console.error("Error al iniciar sesión:", err);
    }
  };

  const handleBackClick = () => {
    navigate("/");  
  };

  return (
    <div className="login-container">
     
      <img src="/src/Imagenes/logo.png" alt="Logo" className="logo" /> 

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="input"
          placeholder="Usuario"  
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="input"
          placeholder="Contraseña"  
          required
        />
        {error && <p>{error}</p>}
        <button type="submit" className="login-button">
          Iniciar sesión
        </button>
      </form>
      <button className="atras" onClick={handleBackClick}>
        Atrás
      </button>
    </div>
  );
}

export default LoginForm;
