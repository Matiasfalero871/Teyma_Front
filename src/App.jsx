import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; 
import './App.css';

function App() {
  const [searchTerm, setSearchTerm] = useState("");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newData, setNewData] = useState({
    nombre: "",
    celular: "",
    interno: "",
    departamento: "",
  });
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false); 

  const navigate = useNavigate();

  // Fetch all users' data from the backend
  const fetchAllData = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:3000/api/search", {
        params: { searchTerm: "" },
      });
      const sortedData = response.data.sort((a, b) =>
        a.nombre.localeCompare(b.nombre)
      );
      setData(sortedData);
    } catch (error) {
      console.error("Error al obtener los datos: ", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("jwtToken");
    if (token) {
      setIsAuthenticated(true); 
    }
    fetchAllData(); 
  }, []);

 
  const handleSearchChange = async (event) => {
    const searchTerm = event.target.value;
    setSearchTerm(searchTerm);
    setLoading(true);

    try {
      if (searchTerm === "") {
        fetchAllData();
      } else {
        const response = await axios.get("http://localhost:3000/api/search", {
          params: { searchTerm: searchTerm },
        });
        const sortedData = response.data.sort((a, b) =>
          a.nombre.localeCompare(b.nombre)
        );
        setData(sortedData);
      }
    } catch (error) {
      console.error("Error al obtener los datos: ", error);
    } finally {
      setLoading(false);
    }
  };

  
  const handleAddClick = () => {
    if (!isAuthenticated) {
      alert("Debes iniciar sesión para agregar o editar usuarios.");
      return;
    }
    setIsEditMode(false);
    setSelectedUser(null);
    setNewData({
      nombre: "",
      celular: "",
      interno: "",
      departamento: "",
    });
    setIsModalOpen(true);
  };

  
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
    setNewData({
      nombre: "",
      celular: "",
      interno: "",
      departamento: "",
    });
  };

 
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewData({ ...newData, [name]: value });
  };

 
  const handleEditClick = (user) => {
    if (!isAuthenticated) {
      alert("Debes iniciar sesión para editar usuarios.");
      return;
    }
    setIsEditMode(true);
    setSelectedUser(user);
    setNewData({
      nombre: user.nombre,
      celular: user.celular,
      interno: user.interno,
      departamento: user.departamento,
    });
    setIsModalOpen(true);
  };

  // Maneja el envío del formulario para agregar o editar
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditMode && selectedUser) {
        await axios.post(`http://localhost:3000/api/save`, { ...newData, id: selectedUser.id });
      } else {
        await axios.post("http://localhost:3000/api/save", newData);
      }
      setNewData({
        nombre: "",
        celular: "",
        interno: "",
        departamento: "",
      });
      setIsModalOpen(false);
      fetchAllData();
    } catch (error) {
      console.error("Error al agregar/editar los datos: ", error);
    }
  };

  // Maneja la eliminación de un usuario
  const handleDeleteClick = async () => {
    try {
      await axios.delete(`http://localhost:3000/api/delete/${selectedUser.id}`);
      setIsModalOpen(false);
      fetchAllData();
    } catch (error) {
      console.error("Error al eliminar el usuario: ", error);
    }
  };

  // Redirige al formulario de inicio de sesión
  const handleLoginClick = () => {
    navigate("/loginform");
  };

  // Renderiza la interfaz
  return (
    <div className="container">
      <header>
        <img src="/src/Imagenes/Logo.png" alt="Logo" />
        <div className="search-container">
          <input
            type="text"
            placeholder="Buscar"
            value={searchTerm}
            onChange={handleSearchChange}
            className="search-input"
          />
          {isAuthenticated && (
            <button onClick={handleAddClick} className="add-button">
              Agregar
            </button>
          )}
        </div>

        {/* Botón de Iniciar Sesión o Cerrar Sesión */}
        {isAuthenticated ? (
          <button className="Logout" onClick={() => { 
            localStorage.removeItem("jwtToken");
            setIsAuthenticated(false);
          }}>
            Cerrar sesión
          </button>
        ) : (
          <button className="Login" onClick={handleLoginClick}>
            Iniciar sesión
          </button>
        )}
      </header>

      <main>
        <table>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Número celular</th>
              <th>Interno</th>
              <th>Departamento</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="4" style={{ padding: "8px", textAlign: "center" }}>
                  Cargando...
                </td>
              </tr>
            ) : data.length > 0 ? (
              data.map((row, index) => (
                <tr
                  key={index}
                  onClick={() => handleEditClick(row)}
                  className={`table-row ${selectedUser?.id === row.id ? "selected" : ""}`}
                >
                  <td>{row.nombre}</td>
                  <td>{row.celular}</td>
                  <td>{row.interno}</td>
                  <td>{row.departamento}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" style={{ padding: "8px", textAlign: "center" }}>
                  No hay usuarios de la búsqueda
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </main>

      
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2 className="modal-header">{isEditMode ? "Editar Usuario" : "Agregar Usuario"}</h2>
            <form onSubmit={handleSubmit} className="modal-form">
              <label>
                Nombre:
                <input
                  type="text"
                  name="nombre"
                  value={newData.nombre}
                  onChange={handleInputChange}
                  required
                />
              </label>
              <label>
                Celular:
                <input
                  type="text"
                  name="celular"
                  value={newData.celular}
                  onChange={handleInputChange}
                  required
                />
              </label>
              <label>
                Interno:
                <input
                  type="text"
                  name="interno"
                  value={newData.interno}
                  onChange={handleInputChange}
                  required
                />
              </label>
              <label>
                Departamento:
                <input
                  type="text"
                  name="departamento"
                  value={newData.departamento}
                  onChange={handleInputChange}
                  required
                />
              </label>
              <button type="submit" className="modal-button">
                {isEditMode ? "Actualizar" : "Agregar"}
              </button>
              {isEditMode && (
                <button type="button" onClick={handleDeleteClick} className="modal-delete-button">
                  Eliminar
                </button>
              )}
            </form>
            <button onClick={handleCloseModal} className="modal-close-button">
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
