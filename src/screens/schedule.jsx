import React, { useState, useEffect } from 'react';
import DateTimeDisplay from '../components/DateTimeDisplay';
import DatesRegister from '../components/DatesRegister';
import Ready from '../components/Ready';
import DatesWorker from '../services/DatesWorker';
import { FaPlus } from "react-icons/fa6";


const Schedule = () => {
  const API_URL = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem('authToken');
  const [showModal, setShowModal] = useState(false);
  const [worker, setWorker] = useState([]);
  const [selectedWorker, setSelectedWorker] = useState('')
  const [services, setServices] = useState([]);
  const [serviceInput, setServiceInput] = useState('');
  const [clientValues, setClientValues] = useState({
    name: '',
    id: '',
    phone: '',
    email: ''
  });
  const [vehicleValues, setVehicleValues] = useState({
    id: '',
    plate: '',
    make: '',
    model: ''
  });
  const [clientData, setClientData] = useState([]); 
  const [vehicleData, setVehicleData] = useState([]); 

  const addService = () => {
    if (serviceInput.trim() !== '') {
      setServices(prevServices => [...prevServices, serviceInput.trim()]);
      setServiceInput('');
    }
  };

  const removeService = (index) => {
    setServices(prevServices => prevServices.filter((_, i) => i !== index));
  };

  const handleSchedule = async (clientValues, vehicleValues) => {
    let customerId = clientValues.id;
    let vehicleId = vehicleValues.id;
    console.log('customerId:', customerId);
    console.log('vehicleId:', vehicleId);
    const existingClient = clientData.find(client => client.id === customerId);
    
    if (!existingClient) {
      const cliente = await fetch(`${API_URL}/customers/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          "name": clientValues.name,
          "phone": clientValues.phone,
          "email": clientValues.email,
        }),
      });
      if (!cliente.ok) {
        const errorData = await cliente.text();
        console.error('Error creating customer:', errorData);
        throw new Error('Error creando el cliente');
      }
      
    }
    
    try {

      const vehicleExists = vehicleData.find(vehicle => vehicle.id === vehicleValues.id);
      console.log('vehicleValues:', vehicleId);
      if (!vehicleExists) {
        const vehicleResponse = await fetch(`${API_URL}/vehicles/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({
            "plate": vehicleValues.plate,
            "make": vehicleValues.make,
            "model": vehicleValues.model,
            "customer_id": customerId,
          }),
        });

        if (!vehicleResponse.ok) {
          const errorData = await vehicleResponse.json();
          console.error('Error response data:', errorData);
          throw new Error('Error creando el vehículo');
        } 
        const vehicleData = await vehicleResponse.json();
        vehicleId = vehicleData.id; // Asigna el nuevo vehicleId
      }

      const scheduleExists = await fetch(`${API_URL}/schedules/${customerId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const response= await scheduleExists.json();
      console.log('responseDatos:', response.length);
      console.log('select:', selectedWorker);
      if(response.length > 0){
        const responsePendiente = response.find(schedule => schedule.state === "Pendiente" );
        
        if(responsePendiente){
          console.log('responsePendiente:', responsePendiente.id);
          
          const scheduleResponse = await fetch(`${API_URL}/schedules/${responsePendiente.id}`,{
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({
              "servicios": services,
              "state": "Pendiente",
              "worker_id": selectedWorker,
            }),
          });
          
        }else{
          const scheduleResponse = await fetch(`${API_URL}/schedules/`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({
              "vehicle_id": vehicleId,
              "customer_id": customerId,
              "servicios": services,
              "state": "Pendiente",
              "worker_id": selectedWorker,
              
            }),
          });
          alert('Agendamiento creado exitosamente');
        }
        
      }else{
        const scheduleResponse = await fetch(`${API_URL}/schedules/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({
            "vehicle_id": vehicleId,
            "customer_id": customerId,
            "servicios": services,
            "state": "Pendiente",
            "worker_id": selectedWorker,
          }),
        });
  
        if (!scheduleResponse.ok) {
          const errorData = await scheduleResponse.json();
          console.error('Error response data:', errorData);
          throw new Error('Error creando el agendamiento');
        }
        
      }
      setShowModal(true);
    } catch (error) {
      console.error('Error creando el agendamiento:', error);
      alert(error.message);
    }
  };
  const handleCloseModal = () => {
    console.log('Cerrando modal');
    setShowModal(false);
    window.location.reload();
  };
  // Llamar al servicio que obtiene los empleados
  DatesWorker(API_URL, token, setWorker);

  const handleChange = (e) => {
    setSelectedWorker(e.target.value); // Guardar el ID seleccionado en el estado
  };

  const newWindow = () => window.open(window.location.href, '_blank' );

  return (
    <div className="h-screen w-full flex flex-col bg-gray-200">
      <div className="m-4 mb-0 flex justify-between">
        <h1 className="text-left font-bold text-gray-600">AGENDAMIENTO</h1>
        <DateTimeDisplay className="flex justify-between" />
      </div>
      <div className={`p-5 m-4 h-full bg-white rounded-sm shadow-xl mt-0 border-t-3 border-[#FFD700] ${showModal ? 'animate-border' : ''}`}>
        
        <div className="flex flex-wrap h-full w-full justify-center items-center">
          <div onClick={newWindow} className='absolute right-10 top-15 m-2 cursor-pointer bg-[#023047] text-white rounded-full p-2'>
            <FaPlus />
          </div>
          <section className="h-3/11 w-full flex flex-col shadow-2xl mb-2 rounded-lg">
            <DatesRegister 
              token={token}
              API_URL={API_URL}
              pent={setSelectedWorker}
              setClientData={setClientData}
              setVehicleData={setVehicleData}
              setClientValues={setClientValues}
              setVehicleValues={setVehicleValues}
              setServices={setServices} // Asegurarse de pasar setServices correctamente
            />
            <div className='flex justify-center items-center w-full space-x-2'>
              <h2 className="text-lg font-bold text-[#023047]">Empleado: </h2>
              <select 
                name="worker" 
                id="worker"
                value={selectedWorker}  // Sincronizar el estado
                onChange={handleChange}
              >
                <option value="">Seleccionar empleado: </option>
                {worker.map((worker) => (
                  <option key={worker.id} value={worker.id}>
                    {worker.name}
                  </option>
                ))}
              </select>
            </div>
          </section>
          {/* Servicios */}
          <section className="flex w-full h-7/11 space-x-2">
            <div className="flex flex-col justify-center items-center w-1/2 h-full border-2 border-[#023047] rounded-sm">
              <div className="flex h-1/10 space-x-10 bg-[#023047] w-full justify-center items-center">
                <h2 className="text-white text-2xl">Servicios</h2>
              </div>
              <div className="flex flex-col items-center justify-center p-4 space-y-5 h-9/10 w-full">
                <textarea
                  placeholder="Descripción del servicio"
                  className="w-full h-5/6 border-1 rounded-sm border-gray-500 outline-none placeholder-gray-500 resize-none p-2"
                  rows="3"
                  value={serviceInput}
                  onChange={(e) => setServiceInput(e.target.value)}
                />
                <button
                  className="button-Date cursor-pointer  h-1/6 w-full flex justify-center items-center rounded-md text-white text-2xl"
                  onClick={addService}
                >
                  Agregar
                </button>
              </div>
            </div>

            {/* Servicios Agregados */}
            <div className="w-1/2 h-full border-2 border-[#023047] rounded-sm">
              <div className="flex h-1/10 bg-[#023047] justify-center items-center">
                <h2 className="text-white text-2xl">Servicios Agregados</h2>
              </div>
              <div className="flex flex-col flex-grow h-9/10 overflow-hidden">
                <div className="flex flex-col items-center justify-start p-4 space-y-2 h-full w-full overflow-y-auto max-h-[400px]">
                  {Array.isArray(services) && services.length > 0 ? (
                    services.map((service, index) => (
                      <div key={index} className="p-1 pr-3 pl-3 flex justify-between items-center w-full border-1 rounded-sm">
                        <h3 className="text-2xl">{service}</h3>
                        <button className="rojo text-white rounded-md p-1" onClick={() => removeService(index)}>
                          Eliminar
                        </button>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500">No hay servicios agregados.</p>
                  )}
                </div>
              </div>
            </div>
          </section>
          {/* Botón de Agendar */}
          <section className="w-full pt-2">
            <button  
              className="button-Date h-12 w-full flex justify-center items-center rounded-md  cursor-pointer"
              onClick={() => handleSchedule(clientValues, vehicleValues)}
            >
              Agendar
            </button>
            <Ready show={showModal} onClose={handleCloseModal} Date="AGENDADOS"/>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Schedule;