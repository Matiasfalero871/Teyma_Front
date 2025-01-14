import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './RegisterForm.css';

function RegisterForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:3000/api/register', { username, password, email });
      alert('Usuario registrado con éxito');
      navigate('/login'); // Redirigir al login
    } catch (err) {
      setError('Error al registrar el usuario: ' + (err.response?.data || 'Error desconocido'));
    }
  };

  return (
    <div className="register-container">
      <form className="register-form" onSubmit={handleRegister}>
        <input
          type="text"
          placeholder="Usuario"
          className="input-field"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Contraseña"
          className="input-field"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <input
          type="email"
          placeholder="Correo electrónico"
          className="input-field"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button type="submit" className="register-button">
          Registrarse
        </button>
        {error && <p className="error-message">{error}</p>}
      </form>
    </div>
  );
}

export default RegisterForm;
