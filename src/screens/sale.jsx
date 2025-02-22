import React from 'react'
import DateTimeDisplay from '../components/DateTimeDisplay';
import { useState, useEffect } from 'react';
import LookProduct from '../components/LookProduct';  

const Sale = () => {
  const token = localStorage.getItem('authToken');
  const [services, setServices] = React.useState([]); // Estado para los servicios  
  const [serviceInput, setServiceInput] = React.useState(''); // Estado para el input de servicio
  const [serviceValue, setServiceValue] = React.useState(''); // Estado para el valor del servicio
  const [activeTab, setActiveTab] = React.useState('producto');
  const [clientValues, setClientValues] = useState({
    name: '',
    cc: '',
    phone: '',
    email: ''
  });
  const [clientOptions, setClientOptions] = useState({
    name: [],
    cc: [], 
    phone: [],
    email: []
  });
  const [vehicleValues, setVehicleValues] = useState({
    plate: '',  
    make: '',
    model: ''
  });
  const [vehicleOptions, setVehicleOptions] = useState({  
    plate: [],
    make: [],
    model: []
  });
  
  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        const response = await fetch('http://api.factupos.me:8000/api/customers', {
          headers: {
            'Authorization': `Bearer ${token}`,
          }
        });
        const result = await response.json();
        // Almacena los productos en el estado
        const clientOpts = {
          name: result.map(client => client.name),
          cc: result.map(client => client.id),
          phone: result.map(client => client.phone),
          email: result.map(client => client.email)
        };
        setClientOptions(clientOpts);
        console.log('Clientes:', result);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };
    
    const fetchVehicle = async () => {
      try {
        const response = await fetch('http://api.factupos.me:8000/api/vehicles', {
          headers: {
          'Authorization': `Bearer ${token}`,
          }
        });
        const result = await response.json();
        const vehicleOpts = {
          plate: result.map(vehicle => vehicle.plate),
          make: result.map(vehicle => vehicle.make),
          model: result.map(vehicle => vehicle.model)
        };
        setVehicleOptions(vehicleOpts);
        console.log('Vehículos:', result);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };
  
    fetchVehicle();
    fetchCustomer();
  }, [token]);
  
  const handleVehicleChange = (field, value) => { 
    setVehicleValues((prev) => ({ ...prev, [field]: value }));
  }
  const handleVehicleBlur = (field) => {  
    if (vehicleValues[field] && !vehicleOptions[field].includes(vehicleValues[field])) {
      setVehicleOptions((prev) => ({  
        ...prev,
        [field]: [...prev[field], vehicleValues[field]]
      }));
    }
  }
  
  const handleClientChange = (field, value) => {
    setClientValues((prev) => ({ ...prev, [field]: value }));
  };
  const handleClientBlur = (field) => {
    if (clientValues[field] && !clientOptions[field].includes(clientValues[field])) {
      setClientOptions((prev) => ({
        ...prev,
        [field]: [...prev[field], clientValues[field]]
      }));
    }
  };

  
  const handleTabClick = (tab) => {
    setActiveTab(tab);  
  };

  const addService = () => {
    if (serviceInput.trim() !== '' && serviceValue.trim() !== '') {
      const newService = { description: serviceInput, value: serviceValue };
      setServices([...services, newService]);
      setServiceInput('');
      setServiceValue('');
    }
  }

  const removeService = (index) => {
    setServices(services.filter((service, i) => i !== index));
  }

  const addProduct = (product) => {
    setServices([...services, product]);
  }

  return (
    <div className='h-screen w-full flex flex-col bg-gray-200'>
      <div className='m-4 mb-0 flex justify-between '>
        <h1 className='text-left font-bold text-gray-600'>FACTURAR</h1>
        <DateTimeDisplay className="flex justify-between"  />
      </div>
      <div className="p-5 m-4 h-full bg-white rounded-sm shadow-xl mt-0 border-t-3 border-[#FFD700] flex flex-wrap">

      <section className='h-3/11 w-full flex shadow-2xl mb-2 rounded-lg'>
            <div className='w-1/2 flex flex-col'>
              <h2 className='text-2xl h-1/4 p-3 text-[#494A8A] font-bold'>Cliente</h2>
              <div className='h-3/4 pl-10 pr-10 flex flex-col justify-center items-center pb-5'>
                {Object.keys(clientValues).map((field, index) => (
                  <div key={index} className='relative w-full'>
                    <input
                      type={field === "email" ? "email" : "text"}
                      placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                      list={field}
                      value={clientValues[field]}
                      onChange={(e) => handleClientChange(field, e.target.value)}
                      onBlur={() => handleClientBlur(field)}
                      className='w-full border-b-1 border-gray-500 outline-none placeholder-gray-500 pl-1'
                    />
                    <datalist id={field} >
                      {clientOptions[field].map((option, id) => (
                        <option key={id} value={option} />
                      ))}
                    </datalist>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Datos del Vehículo */}
            <div className='w-1/2'>
              <h2 className='text-2xl h-1/4 p-3 text-[#494A8A] font-bold'>Vehículo</h2>
              <div className='h-3/4 pl-10 pr-10 flex flex-col justify-center items-center pb-5'>
                {Object.keys(vehicleValues).map((field, index) => (
                  <div key={index} className='relative w-full'>
                    <input
                      type="text"
                      placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                      list={field}
                      value={vehicleValues[field]}
                      onChange={(e) => handleVehicleChange(field, e.target.value)}  
                      onBlur={() => handleVehicleBlur(field)}
                      className='w-full border-b-1 border-gray-500 outline-none placeholder-gray-500 pl-1'
                    />
                    <datalist id={field} >
                      {vehicleOptions[field].map((option, id) => (
                        <option key={id} value={option} />
                      ))}
                    </datalist>
                  </div>
                ))}
              </div>
            </div>
          </section>

        <section className='flex justify-center items-center w-full h-7/11 space-x-2 '> {/*Busqueda de producto o servicio y factura*/}
          <div className='w-1/2 h-full border-2 border-[#494A8A] rounded-sm'> {/*Busqueda de producto o servicio*/}
            <div className='flex h-1/10 bg-[#494A8A] '> {/*Barra de busqueda*/}
              <div 
                className={`px-4 py-2 cursor-pointer w-1/2 flex justify-end items-center border-r-2 border-white rounded-tl-sm ${activeTab === 'producto' ? 'bg-white text-[#494A8A]' : 'hover:bg-white hover:text-[#494A8A] text-white'}`}
                onClick={() => handleTabClick('producto')}
              >
                <h2 className=' text-2xl '>Productos</h2>
              </div>

              <div
                className={`px-4 py-2 cursor-pointer w-1/2 flex justify-between items-center rounded-tr-sm ${activeTab === 'servicio' ? 'bg-white text-[#494A8A]' : 'hover:bg-white hover:text-[#494A8A] text-white'}`}
                onClick={() => handleTabClick('servicio')}
              >
                <h2 className=' text-2xl'>Servicio</h2>
              </div>
              
            </div>
            <div className='p-4 h-9/10 w-full '> {/*Contenido de producto o servicio*/}
              {activeTab === 'producto' ? (
                <div className='flex flex-col space-y-2 w-full h-full '>
                  <div className='flex justify-center items-center h-1/7 w-full pr-6 pl-6'>
                    <input 
                      type="text"
                      placeholder='Buscar...'  
                      className=' focus:outline-none w-full border-b-1 border-gray-500 outline-none placeholder-gray-500'
                    />
                  </div>
                  <div className='p-2 flex justify-center items-start m-4 mt-2 bg-white overflow-y-auto max-h-[300px] h-6/7  w-full rounded-sm shadow-sm'>
                    <LookProduct addProduct={addProduct}/>
                  </div>
                </div>

              ) : (
                <div className='flex flex-col items-center justify-center space-y-5 h-full w-full'>
                  <textarea 
                    placeholder="Descripción del servicio" 
                    className='w-full h-5/6 border-1 rounded-sm border-gray-500 outline-none placeholder-gray-500 resize-none p-2' rows="3"
                    value={serviceInput}
                    onChange={(e) => setServiceInput(e.target.value)}
                  />       
                  <input 
                  type="text " 
                  placeholder="Valor"
                  className='w-full border-b-1 border-gray-500 outline-none placeholder-gray-500 pl-1'
                  value={serviceValue}
                  onChange={(e) => setServiceValue(e.target.value)}
                  />       
                  <div 
                  className=' bg-[#494A8A] h-1/6 w-full flex justify-center items-center rounded-md text-white text-2xl cursor-pointer'
                  onClick={addService}
                  >
                    Agregar
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className='w-1/2 h-full border-2 border-[#494A8A] rounded-sm'> {/*Factura*/}
            <div className='flex justify-center items-center h-1/10  space-x-10 bg-[#494A8A] '>
              <h2 className='text-white text-2xl'>Facturación</h2>
            </div>
            <div className='flex flex-col items-center justify-baseline p-4 space-y-2  h-9/10 w-full'>
              {services.map((service, index) => (
                <div key={index} className='p-1 pr-3 pl-3 flex justify-between items-center w-full border-1 rounded-sm '>
                  <h3 className='text-2xl'>{service.name ? `${service.name} - ${service.price}` : `${service.description} - ${service.value}`}</h3>
                  <button className='rojo text-white rounded-md p-1' onClick={() => removeService(index)}>Eliminar</button>
                </div>
              ))}
            </div>
          </div>
          
        </section>

        <section className=' h-1/11 flex w-full pt-2 '> {/*Total y botones de facturar y cancelar*/}
          
          <div className='h-full w-1/2 flex justify-end items-center pr-6'>
            <h3 className='text-[#494A8A] text-5xl font-extrabold pr-3'>Total: </h3>
            <h3 className='text-[#494A8A] text-5xl font-extrabold'>$ 0</h3>
          </div>
          
          <div className=' bg-[#494A8A] h-full w-1/2 flex justify-center items-center rounded-md text-white text-2xl'>
            Facturar
          </div>
        </section>
        
      </div>
        
    </div>

  )
}

export default Sale