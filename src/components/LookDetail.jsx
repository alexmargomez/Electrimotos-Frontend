import React, { useState, useEffect } from 'react';

const LookDetail = () => {
    const [customers, setCustomers] = useState([]);  // Estado para los clientes
    const [loading, setLoading] = useState(true);   // Estado para manejar la carga de datos
    const token = localStorage.getItem('authToken');

    useEffect(() => {
      const fetchCustomers = async () => {
        try {
          const response = await fetch('http://localhost:8000/api/customers/', {
            headers: {
              'Authorization': `Bearer ${token}`,  // Corregido 'Authorization'
            }
          });

          const data = await response.json();  // Convierte la respuesta en JSON
          console.log(data); 
          setCustomers(data);  // Guarda los clientes en el estado
          setLoading(false);  // Cambia el estado de carga a false
        } catch (error) {
          console.error('Error al obtener los clientes:', error);
          setLoading(false);
        }
      };
      
      fetchCustomers();
    }, [token]);  // Añadido 'token' al array de dependencias de useEffect
  
    // Si está cargando, muestra un mensaje
    if (loading) {
      return <div>Cargando clientes...</div>;
    }
  
    // Si no hay clientes, muestra un mensaje
    if (customers.length === 0) {
      return <div>No hay clientes disponibles.</div>;
    }
  
    return (
      <div className="flex flex-wrap justify-between gap-4">
        {/* Recorremos los clientes y los mostramos en tarjetas */}
        {customers.map((customer) => (
          <div key={customer.id} className="flex flex-col w-full sm:w-1/2 lg:w-1/3 xl:w-1/4 border p-4">
            <h3 className="text-xl font-semibold">{customer.name}</h3>
            <p>{customer.phone}</p>
            <p className="text-green-500">{customer.email}</p>
          </div>
        ))}
      </div>
    );
};

export default LookDetail;
