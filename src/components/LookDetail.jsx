import React, { useState, useEffect } from 'react';
import FactuPrint from './FactuPrint';
import { FaEye, FaRegEye } from "react-icons/fa";
import Modalmini from './Modalmini';

const LookDetail = ({ selectedOption }) => {
  const API_URL = import.meta.env.VITE_API_URL;
  const [data, setData] = useState([]);  // Estado para los clientes
  const [customerName, setCustomerName] = useState({});
  const [invoiceNumber, setInvoiceNumber] = useState({});
  const [loading, setLoading] = useState(true);   // Estado para manejar la carga de datos
  const [error, setError] = useState(null); // Estado para manejar errores
  const token = localStorage.getItem('authToken');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [productUpdate, setProductUpdate] = useState({ id: '', name: '', price: '' });

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
          case 'Pendientes':
            endpoint = 'schedules';
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

        if(selectedOption === 'Ventas'){
          const customerNames = {};
          const invoiceNumbers = {};
          await Promise.all(result.map(async (item) => {
            if(!invoiceNumbers[item.id]){
              const response = await fetch(`${API_URL}/invoices/${item.id}/`, {
                headers: {
                  'Authorization': `Bearer ${token}`,
                }
              });
              const resultInvoice = await response.json();
              invoiceNumbers[item.id] = resultInvoice[0].invoice_number;
              
            }

            if(!customerNames[item.customer_id]){
              const response = await fetch(`${API_URL}/customers/${item.customer_id}/`, {
                headers: { 
                  'Authorization': `Bearer ${token}`,
                }
              });
              const resultCustomer = await response.json();
              customerNames[item.customer_id] = resultCustomer.name;
            }
          }));
          setCustomerName(customerNames);
          setInvoiceNumber(invoiceNumbers);
        
        }
        console.log("customerName: ", customerName);
        console.log("invoiceNumber: ", invoiceNumber);
      } catch (error) {
        console.error(`Error al obtener los ${selectedOption.toLowerCase()}:`, error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
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
        case 'Pendientes':
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

  const formatDateTime = (dateTime) => {
    const date = new Date(dateTime);
    return isNaN(date) ? 'Fecha inválida' : date.toLocaleDateString('es-CO');
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
  
  const openModal = (item) => {
    setProductUpdate(item);
    setIsModalOpen(true);
  };
  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductUpdate((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    console.log("xd: ", productUpdate)
    const response = await fetch(`${API_URL}/products/${productUpdate.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      
      body: JSON.stringify(productUpdate),

    });

    if (response.ok) {
      // Handle successful update here, e.g., refresh the data or update the state
      closeModal();
      window.location.reload();
    } else {
      // Handle error here
      console.error('Failed to update product');
    }
  };

  // Renderizado para Productos
  if (selectedOption === 'Productos') {
    return (
      <div className="flex flex-col w-full">
        <div className="grid grid-cols-10 gap-4 font-bold p-1 border-b-1">
          <div className="col-span-2">Código</div>
          <div className="col-span-2">Nombre</div>
          <div className="col-span-2">Precio</div>
          <div className="col-span-1">Stock</div>
          <div className="col-span-3">Acciones</div>
        </div>
        {data.map((item) => (
          <div key={item.id} className="grid grid-cols-10 gap-4 p-1 border-t-1 justify-center items-center">
            <div className="col-span-2">{item.id}</div>
            <div className="col-span-2">{item.name}</div>
            <div className="col-span-2">{`$ ${formatPrice(item.price)}`}</div>
            <div className="col-span-1">{item.stock}</div>
            <div className="col-span-3 flex space-x-5 justify-center">
              <button type="button" className="rojo" onClick={() => handleDelete(item.id)}>Eliminar</button>
              <button 
                type="button"
                onClick={() => openModal(item)}
                className='blue'
              >
                Modificar
              </button>
              <Modalmini show={isModalOpen} onClose={closeModal} >
                <div className='flex flex-col justify-center items-center h-full w-full '>
                    <div className='font-bold text-2xl justify-center items-center flex h-1/10'>
                        <h1 >MODIFICAR PRODUCTO</h1>
                    </div>
                    <div className='flex flex-col justify-center items-center h-8/10 space-y-5 w-full' >
                        <div className='flex w-full'>
                            <label className='font-bold text-xl bg-[#494A8A] text-white rounded-l-sm w-1/2'>Nombre:</label>
                            <input type="text" name="name" placeholder='Nuevo nombre' onChange={handleChange}  className='border-1 shadow-xl rounded-r-sm border-[#494A8A] text-center w-1/2'/>
                        </div>
                        
                        <div className='flex w-full'>
                            <label className='font-bold text-xl bg-[#494A8A] text-white rounded-l-sm w-1/2'>Precio:</label>
                            <input type="number" name="price" placeholder='Nuevo Precio' onChange={handleChange}  className='border-1 shadow-xl rounded-r-sm border-[#494A8A] text-center w-1/2'/>
                        </div>
                        <div className='flex w-full'>
                            <label className='font-bold text-xl bg-[#494A8A] text-white rounded-l-sm w-1/2'>Stock:</label>
                            <input type="number" placeholder='Modificar Stock' className='border-1 shadow-xl rounded-r-sm border-[#494A8A] text-center w-1/2'/>
                        </div>
                    </div>
                    <div className='h-1/10 flex justify-center items-center'>
                        <button type='button' className='blue hover:celest' onClick={handleSave}>Guardar</button>
                    </div>
                </div>
              </Modalmini>
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
          <div className="col-span-2">Identificación</div>
          <div className="col-span-3">Nombre</div>
          <div className="col-span-2">Teléfono</div>
          <div className="col-span-2">Email</div>
          <div className="col-span-3">Acciones</div>
        </div>
        {data.map((item) => (
          <div key={item.id} className="grid grid-cols-12 gap-4 p-1 border-t-1 justify-center items-center">
            <div className="col-span-2">{item.id}</div>
            <div className="col-span-3">{item.name}</div>            
            <div className="col-span-2">{item.phone}</div>
            <div className="col-span-2">{item.email}</div>
            <div className="col-span-3 flex space-x-5 justify-center">
              <button type="button" className="rojo" onClick={() => handleDelete(item.id)}>Eliminar</button>
              <button 
                type="button"
                onClick={openModal}
                className='blue'
              >
                Modificar
              </button>
              <div className='flex justify-center items-center '>
                <FaEye className='cursor-pointer'/>
              </div>
              <Modalmini show={isModalOpen} onClose={closeModal} className=''>
                <div className='flex flex-col justify-center items-center h-full w-full '>
                    <div className='font-bold text-2xl h-1/10 justify-center items-center flex bg-amber-200 w-[70%]'>
                        <h1 >Producto</h1>
                    </div>
                    <div className='flex space-x-4 h-1/10 bg-amber-300 justify-center items-center w-[70%]' >
                        <p>Nombre: {item.name}</p>
                        <p>Stock: {item.stock}</p>
                    </div>
                </div>
              </Modalmini>
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
        <div className="col-span-2">ID</div>
        <div className="col-span-2">Placa</div>
          <div className="col-span-3">Marca</div>          
          <div className="col-span-2">Modelo</div>
          <div className="col-span-3">Acciones</div>
        </div>
        {data.map((item) => (
          <div key={item.id} className="grid grid-cols-12 gap-4 p-1 border-t-1 justify-center items-center">
            <div className="col-span-2">{item.id}</div>
            <div className="col-span-2">{item.plate}</div>
            <div className="col-span-3">{item.make}</div>            
            <div className="col-span-2">{item.model}</div>
            <div className="col-span-3 flex space-x-5 justify-center">
              <button type="button" className="rojo" onClick={() => handleDelete(item.id)}>Eliminar</button>
              <button 
                type="button"
                className='blue'
              >
                Modificar
              </button>
              <div className='flex justify-center items-center '>
                <FaEye className='cursor-pointer'/>
              </div>
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
          <div className="col-span-3 ">Factura</div>
          <div className="col-span-3">Cliente</div>
          <div className="col-span-2">Fecha</div>
          <div className="col-span-1">Total</div>
          <div className="col-span-3">Acciones</div>
        </div>
        {data.map((item) => (
          <div key={item.id} className="grid grid-cols-12 gap-4 p-1 border-t-1 justify-center items-center">
            <div className="col-span-3 cursor-pointer " >
                <FactuPrint id={item.id} />        
            </div>
            <div className="col-span-3 ">{customerName[item.customer_id]}</div>
            <div className="col-span-2 ">{formatDateTime(item.created_at)}</div>
            <div className="col-span-1">{`$ ${formatPrice(item.total)}`}</div>
            <div className="col-span-3 flex space-x-5 justify-center">
              <button type="button" className="rojo" onClick={() => handleDelete(item.id)}>Eliminar</button>
              
            </div>
          </div>
        ))}

      </div>
    );
  }

  // Renderizado para Movimientos de Inventario
  if (selectedOption === 'Pendientes') {
    return (
      <div className="flex flex-col w-full">
        <div className="grid grid-cols-12 gap-4 font-bold p-1 border-b-1">
          <div className="col-span-2">ID</div>
          <div className="col-span-3">Cliente</div>
          <div className="col-span-2">Vehiculo</div>
          <div className="col-span-2">Fecha</div>
          <div className="col-span-3">Acciones</div>
        </div>
        {data.map((item) => (
          <div key={item.id} className="grid grid-cols-12 gap-4 p-1 border-t-1 justify-center items-center">
            <div className="col-span-2">{item.id}</div>
            <div className="col-span-3">{item.customer_id}</div>
            <div className="col-span-2">{item.vehicle_id}</div>
            <div className="col-span-2">{formatDateTime(item.created_at)}</div>
            <div className="col-span-3 flex space-x-5 justify-center">
              <button type="button" className="rojo" onClick={() => handleDelete(item.id)}>Eliminar</button>
              <div className='flex justify-center items-center '>
                <FaEye className='cursor-pointer'/>
              </div>
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