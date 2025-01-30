import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function LoginForm() {
  const [name, setName] = useState(''); // Usamos 'name' para coincidir con la API
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate(); // Hook para navegación

  const login = async (name, password) => {
    const loginData = { name, password }; // Enviamos 'name' tal cual lo espera la API
    try {
      const response = await fetch('http://127.0.0.1:8000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginData),
      });

      const data = await response.json();
      console.log('Respuesta de la API:', data);
      if (response.ok) {
        const token = data.access_token;
        localStorage.setItem('authToken', token); // Guardamos el token en localStorage
        console.log('Token guardado en localStorage:', localStorage.getItem('authToken'));
        navigate('/dashboard'); // Redirigimos a la página de dashboard

      }
       else {
        setError(data.message || 'Error de inicio de sesión');
      }
    } catch (error) {
      console.error('Error al hacer la solicitud', error);
      setError('Hubo un problema con la conexión');
    }
    
  };

  const handleLogin = (event) => {
    event.preventDefault();
    if (name && password) {
      login(name, password); // Usamos el estado 'name' y 'password' para la API
    } else {
      setError('Por favor, ingresa tu usuario y contraseña');
    }
  };

  return (
    
    <div className="login-form">
      <form onSubmit={handleLogin}>
        <div className="mb-4">
          <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-700">Nombre de usuario</label>
          <input
            type="text"
            id="name"
            name="name"
            value={name} // Usamos 'name' para mantener la consistencia
            onChange={(e) => setName(e.target.value)} // Usamos 'setName' para actualizar el estado
            className="w-full p-2 border border-gray-300 rounded-lg"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-700">Contraseña</label>
          <input
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg"
            required
          />
        </div >
        <button type="submit" className="w-full py-2 bg-blue-500 text-gray-800 rounded-lg hover:bg-blue-600">
          Ingresar
        </button>
      </form>
      {error && <p className="mt-4 text-red-500">{error}</p>}
    </div>
  );
}

const Logout = (navigate) => async() =>{
    const token = localStorage.getItem('authToken');
    
    // Verificamos si el token existe antes de intentar hacer la solicitud
    if (!token) {
      console.error('No se encontró el token en localStorage');
      return;
    }

    try {
      const response = await fetch('http://127.0.0.1:8000/api/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // Enviar el token en la cabecera
        },
      });

      // Verificamos si la respuesta fue exitosa
      if (response.ok) {
        localStorage.removeItem('authToken'); // Eliminar el token
        navigate('/'); // Redirigir a la página de inicio de sesión
      } else {
        const errorData = await response.json();
        console.error('Error al cerrar sesión:', errorData);
      }
    } catch (error) {
      console.error('Error en la solicitud:', error);
    }
};
  

export { LoginForm, Logout };
