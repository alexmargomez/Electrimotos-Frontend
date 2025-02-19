import React, { useState, useEffect } from 'react';

const LookDetail = ({ selectedOption }) => {
    const [data, setData] = useState([]);  // Estado para los clientes
    const [loading, setLoading] = useState(true);   // Estado para manejar la carga de datos
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
            return;
        }
          const response = await fetch(`http://api.factupos.me:8000/api/${endpoint}/`, {
            headers: {
              'Authorization': `Bearer ${token}`,  // Corregido 'Authorization'
            }
          });
          const result = await response.json();  // Convierte la respuesta en JSON
          setData(result);  // Guarda los clientes en el estado
          console.log(`Datos de ${selectedOption}:`, result);
        } catch (error) {
          console.error(`Error al obtener los ${selectedOption.toLowerCase()}:`, error);
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
            return;
        }

        const response = await fetch(`http://api.factupos.me:8000/api/${endpoint}/${id}/`, {
          method: 'DELETE',
          headers: {  // Corregido 'Authorization'
            'Authorization': `Bearer ${token}`,
          }
        });
        if (response.status === 204) {
          // Eliminar el elemento del estado
          setData(data.filter(item => item.id !== id));
          console.log(`${selectedOption} eliminado con éxito`);
        } else {
            console.error(`Error al eliminar ${selectedOption.toLowerCase()}:`, response.status);
        }
      }
      catch (error) { // Añadido manejo de errores
        console.error(`Error al eliminar el elemento:`, error);
      }
    };

    // Si está cargando, muestra un mensaje
    if (loading) {
      return <div>Cargando {selectedOption}...</div>;
    }
  
    // Si no hay clientes, muestra un mensaje
    if (data.length === 0) {
      return <div>No hay {selectedOption.toLowerCase()} disponibles.</div>;
    }
  


    return (
      <div className="flex flex-col gap-4 ">
        {/* Recorremos los clientes y los mostramos en tarjetas */}
        {data.map((item) => (
          <div key={item.id} className="flex w-full border p-2 justify-between pl-8 pr-8">
            <div className='flex justify-center items-center space-x-10 '>
            
              <h3 className="text-xl font-semibold">{item.name ? `Nombre: ${item.name}` :item.make ? `Marca: ${item.make}`  : `ID: ${item.id}`}</h3>
              <p>{item.phone ? `Telefono: ${item.phone}`: item.price ? `Precio: ${item.price}` : item.plate ? `Placa: ${item.plate}` : ' '}</p>
              <p className="text-green-500">{item.email ? `Email: ${item.email}` : item.model ? ` Modelo: ${item.model}` : ' '}</p>
            </div>
            <div className='flex justify-center items-center space-x-5'>
                <button type='button' className='rojo ' onClick={() => handleDelete(item.id)}>Eliminar</button>
                <button type="button">Modificar</button>
                
            </div>
            
          </div>
        ))}
      </div>
    );
};

export default LookDetail;
