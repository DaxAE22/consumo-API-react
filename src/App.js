import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 5;  // Definimos cuántos usuarios mostrar por página.

  useEffect(() => {
    fetch('https://jsonplaceholder.typicode.com/users')
      .then(response => response.json())
      .then(data => {
        setUsers(data);
        setFilteredUsers(data);  // Inicialmente, los usuarios filtrados serán todos.
      })
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  // Función para manejar la búsqueda.
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    if (e.target.value === '') {
      setFilteredUsers(users);
    } else {
      const filtered = users.filter(user =>
        user.name.toLowerCase().includes(e.target.value.toLowerCase())
      );
      setFilteredUsers(filtered);
    }
  };

  // Paginación: calcular los usuarios que deben mostrarse en la página actual.
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Función para manejar la solicitud POST.
  const handleAddUser = (e) => {
    e.preventDefault();
    const newUser = {
      name: e.target.name.value,
      email: e.target.email.value
    };

    fetch('https://jsonplaceholder.typicode.com/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newUser)
    })
      .then(response => response.json())
      .then(data => {
        setUsers([data, ...users]);  // Añadir el nuevo usuario al estado.
        setFilteredUsers([data, ...users]);
        alert('Usuario añadido correctamente');
      })
      .catch(error => console.error('Error adding user:', error));
  };

  return (
    <div className="container mt-4">
      <h1>Lista de Usuarios</h1>

      {/* Formulario de búsqueda */}
      <input
        type="text"
        className="form-control mb-3"
        placeholder="Buscar usuario por nombre..."
        value={searchTerm}
        onChange={handleSearch}
      />

      {/* Lista de usuarios */}
      <ul className="list-group mb-3">
        {currentUsers.map(user => (
          <li key={user.id} className="list-group-item">
            {user.name} - {user.email}
          </li>
        ))}
      </ul>

      {/* Paginación */}
      <nav>
        <ul className="pagination">
          {Array.from({ length: Math.ceil(filteredUsers.length / usersPerPage) }, (_, index) => (
            <li key={index + 1} className="page-item">
              <button onClick={() => paginate(index + 1)} className="page-link">
                {index + 1}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Formulario para añadir nuevo usuario */}
      <h2>Añadir Nuevo Usuario</h2>
      <form onSubmit={handleAddUser}>
        <div className="form-group">
          <label>Nombre</label>
          <input type="text" name="name" className="form-control" required />
        </div>
        <div className="form-group">
          <label>Email</label>
          <input type="email" name="email" className="form-control" required />
        </div>
        <button type="submit" className="btn btn-primary mt-2">Añadir Usuario</button>
      </form>
    </div>
  );
}

export default App;
