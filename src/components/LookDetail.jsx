import React, { useState, useEffect } from 'react';

const LookDetail = ({ selectedOption }) => {
  const API_URL = import.meta.env.VITE_API_URL;
  const [data, setData] = useState([]);  // Estado para los clientes
  const [loading, setLoading] = useState(true);   // Estado para manejar la carga de datos
  const [error, setError] = useState(null); // Estado para manejar errores
  const token = localStorage.getItem('authToken');

  useEffect(() => {
    const fetchData = async () => {
      try {
        let endpoint = '';

        // Determinar la API según la opción seleccionada
        switch (selectedOption) {
          case 'Productos':
            endpoint = 'products';
            break;
          case 'Clientes':
            endpoint = 'customers';
            break;
          case 'Vehiculos':
            endpoint = 'vehicles';
            break;
          case 'Ventas':
            endpoint = 'sales';
            break;
          case 'Movimientos':
            endpoint = 'inventory-movements';
            break;
          default:
            throw new Error(`Opción no válida: ${selectedOption}`);
        }

        const response = await fetch(`${API_URL}/${endpoint}/`, {
          headers: {
            'Authorization': `Bearer ${token}`,  // Corregido 'Authorization'
          }
        });

        if (!response.ok) {
          throw new Error(`Error al obtener los ${selectedOption.toLowerCase()}: ${response.statusText}`);
        }

        const result = await response.json();  // Convierte la respuesta en JSON
        setData(result);  // Guarda los clientes en el estado
        console.log(`Datos de ${selectedOption}:`, result);
      } catch (error) {
        console.error(`Error al obtener los ${selectedOption.toLowerCase()}:`, error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 100);

    return () => clearInterval(interval);
  }, [selectedOption, token]);  // Añadido 'token' al array de dependencias de useEffect

  const handleDelete = async (id) => {
    try {
      let endpoint = '';

      switch (selectedOption) {
        case 'Productos':
          endpoint = 'products';
          break;
        case 'Clientes':
          endpoint = 'customers';
          break;
        case 'Vehiculos':
          endpoint = 'vehicles';
          break;
        case 'Ventas':
          endpoint = 'sales';
          break;
        case 'Movimientos':
          endpoint = 'inventory-movements';
          break;
        default:
          throw new Error(`Opción no válida: ${selectedOption}`);
      }

      const response = await fetch(`${API_URL}/${endpoint}/${id}/`, {
        method: 'DELETE',
        headers: {  // Corregido 'Authorization'
          'Authorization': `Bearer ${token}`,
        }
      });

      if (response.ok) {
        // Eliminar el elemento del estado
        setData(data.filter(item => item.id !== id));
        console.log(`${selectedOption} eliminado con éxito`);
      } else {
        throw new Error(`Error al eliminar ${selectedOption.toLowerCase()}: ${response.status}`);
      }
    } catch (error) {
      console.error(`Error al eliminar el elemento:`, error);
      setError(error.message);
    }
  };

  const formatPrice = (price) => {
    if (price == null || isNaN(price)) {
      return 'N/A';
    }
    return price.toLocaleString('es-CO');
  }

  // Si está cargando, muestra un mensaje
  if (loading) {
    return <div>Cargando {selectedOption}...</div>;
  }

  // Si hay un error, muestra un mensaje de error
  if (error) {
    return <div>Error: {error}</div>;
  }

  // Si no hay datos, muestra un mensaje
  if (data.length === 0) {
    return <div>No hay {selectedOption.toLowerCase()} disponibles.</div>;
  }

  // Renderizado para Productos
  if (selectedOption === 'Productos') {
    return (
      <div className="flex flex-col w-full">
        <div className="grid grid-cols-12 gap-4 font-bold p-1 border-b-1">
          <div className="col-span-2">Código</div>
          <div className="col-span-2">Nombre</div>
          <div className="col-span-2">Categoría</div>
          <div className="col-span-2">Precio</div>
          <div className="col-span-2">Stock</div>
          <div className="col-span-2">Acciones</div>
        </div>
        {data.map((item) => (
          <div key={item.id} className="grid grid-cols-12 gap-4 p-1 border-t-1 justify-center items-center">
            <div className="col-span-2">{item.id}</div>
            <div className="col-span-2">{item.name}</div>
            <div className="col-span-2">{item.category_id}</div>
            <div className="col-span-2">{`$ ${formatPrice(item.price)}`}</div>
            <div className="col-span-2">{item.stock}</div>
            <div className="col-span-2 flex space-x-5 justify-center">
              <button type="button" className="rojo" onClick={() => handleDelete(item.id)}>Eliminar</button>
              <button type="button">Modificar</button>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Renderizado para Clientes
  if (selectedOption === 'Clientes') {
    return (
      <div className="flex flex-col w-full">
        <div className="grid grid-cols-12 gap-4 font-bold p-1 border-b-1">
          <div className="col-span-3">Nombre</div>
          <div className="col-span-2">Identificación</div>
          <div className="col-span-2">Teléfono</div>
          <div className="col-span-2">Email</div>
          <div className="col-span-2">Acciones</div>
        </div>
        {data.map((item) => (
          <div key={item.id} className="grid grid-cols-12 gap-4 p-1 border-t-1 justify-center items-center">
            <div className="col-span-3">{item.name}</div>
            <div className="col-span-2">{item.id}</div>
            <div className="col-span-2">{item.phone}</div>
            <div className="col-span-2">{item.email}</div>
            <div className="col-span-2 flex space-x-5 justify-center">
              <button type="button" className="rojo" onClick={() => handleDelete(item.id)}>Eliminar</button>
              <button type="button">Modificar</button>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Renderizado para Vehiculos
  if (selectedOption === 'Vehiculos') {
    return (
      <div className="flex flex-col w-full">
        <div className="grid grid-cols-12 gap-4 font-bold p-1 border-b-1">
          <div className="col-span-3">Marca</div>
          <div className="col-span-2">ID</div>
          <div className="col-span-2">Placa</div>
          <div className="col-span-2">Modelo</div>
          <div className="col-span-2">Acciones</div>
        </div>
        {data.map((item) => (
          <div key={item.id} className="grid grid-cols-12 gap-4 p-1 border-t-1 justify-center items-center">
            <div className="col-span-3">{item.make}</div>
            <div className="col-span-2">{item.id}</div>
            <div className="col-span-2">{item.plate}</div>
            <div className="col-span-2">{item.model}</div>
            <div className="col-span-2 flex space-x-5 justify-center">
              <button type="button" className="rojo" onClick={() => handleDelete(item.id)}>Eliminar</button>
              <button type="button">Modificar</button>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Renderizado para Ventas
  if (selectedOption === 'Ventas') {
    return (
      <div className="flex flex-col w-full">
        <div className="grid grid-cols-12 gap-4 font-bold p-1 border-b-1">
          <div className="col-span-3">ID</div>
          <div className="col-span-2">Cliente</div>
          <div className="col-span-2">Fecha</div>
          <div className="col-span-2">Total</div>
          <div className="col-span-2">Acciones</div>
        </div>
        {data.map((item) => (
          <div key={item.id} className="grid grid-cols-12 gap-4 p-1 border-t-1 justify-center items-center">
            <div className="col-span-3">{item.id}</div>
            <div className="col-span-2">{item.customer_name}</div>
            <div className="col-span-2">{item.date}</div>
            <div className="col-span-2">{`$ ${formatPrice(item.total)}`}</div>
            <div className="col-span-2 flex space-x-5 justify-center">
              <button type="button" className="rojo" onClick={() => handleDelete(item.id)}>Eliminar</button>
              <button type="button">Modificar</button>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Renderizado para Movimientos de Inventario
  if (selectedOption === 'Movimientos') {
    return (
      <div className="flex flex-col w-full">
        <div className="grid grid-cols-12 gap-4 font-bold p-1 border-b-1">
          <div className="col-span-3">ID</div>
          <div className="col-span-2">Producto</div>
          <div className="col-span-2">Cantidad</div>
          <div className="col-span-2">Fecha</div>
          <div className="col-span-2">Acciones</div>
        </div>
        {data.map((item) => (
          <div key={item.id} className="grid grid-cols-12 gap-4 p-1 border-t-1 justify-center items-center">
            <div className="col-span-3">{item.id}</div>
            <div className="col-span-2">{item.product_name}</div>
            <div className="col-span-2">{item.quantity}</div>
            <div className="col-span-2">{item.date}</div>
            <div className="col-span-2 flex space-x-5 justify-center">
              <button type="button" className="rojo" onClick={() => handleDelete(item.id)}>Eliminar</button>
              <button type="button">Modificar</button>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Renderizado por defecto
  return <div>No hay datos disponibles.</div>;
};

export default LookDetail;