import React from 'react'
import DateTimeDisplay from '../components/DateTimeDisplay';
import { useState, useEffect } from 'react';
import LookProduct from '../components/LookProduct';  
import DatesRegister from '../components/DatesRegister';

const Sale = () => {
  const API_URL = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem('authToken');
  const [services, setServices] = React.useState([]); // Estado para los servicios  
  const [serviceInput, setServiceInput] = React.useState(''); // Estado para el input de servicio
  const [serviceValue, setServiceValue] = React.useState(''); // Estado para el valor del servicio
  const [activeTab, setActiveTab] = React.useState('producto');
  const [clientValues, setClientValues] = useState({
      name: '',
      id: '',
      phone: '',
      email: ''
    });
    const [vehicleValues, setVehicleValues] = useState({
      plate: '',
      make: '',
      model: ''
    });
    const [clientData, setClientData] = useState([]); // Estado para almacenar los datos completos de los clientes
    const [vehicleData, setVehicleData] = useState([]);

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
        <DatesRegister 
            token={token}
            API_URL={API_URL}
            setClientData={setClientData}
            setVehicleData={setVehicleData}
            setClientValues={setClientValues}
            setVehicleValues={setVehicleValues}
          />
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