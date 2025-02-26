import React, { useState, useEffect } from 'react';
import DateTimeDisplay from '../components/DateTimeDisplay';
import DatesRegister from '../components/DatesRegister';

const Schedule = () => {
  const API_URL = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem('authToken');
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
  const [clientData, setClientData] = useState([]); // Estado para almacenar los datos completos de los clientes
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
    
    const existingClient = clientData.find(client => client.id.toString() === customerId);
    
    if (!existingClient) {
      const cliente = await fetch(`${API_URL}/customers/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          "id": clientValues.id,
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
      const response = await scheduleExists.json();
      console.log('response:', response);

      if(response.length > 0){
        
        const scheduleResponse = await fetch(`${API_URL}/schedules/${customerId}`,{
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({
            "servicios": services,
            "state": "Pendiente",
          }),
        });
        
        alert('Agendamiento actualizado exitosamente'); 
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
          }),
        });
  
        if (!scheduleResponse.ok) {
          const errorData = await scheduleResponse.json();
          console.error('Error response data:', errorData);
          throw new Error('Error creando el agendamiento');
        }
        alert('Agendamiento creado exitosamente'); 
      }

      
    } catch (error) {
      console.error('Error creando el agendamiento:', error);
      alert(error.message);
    }
  };

  return (
    <div className="h-screen w-full flex flex-col bg-gray-200">
      <div className="m-4 mb-0 flex justify-between">
        <h1 className="text-left font-bold text-gray-600">AGENDAMIENTO</h1>
        <DateTimeDisplay className="flex justify-between" />
      </div>
      <div className="p-5 m-4 h-full bg-white rounded-sm shadow-xl mt-0 border-t-3 border-[#FFD700]">
        <div className="flex flex-wrap h-full w-full justify-center items-center">
          <section className="h-3/11 w-full flex shadow-2xl mb-2 rounded-lg">
            <DatesRegister 
              token={token}
              API_URL={API_URL}
              setClientData={setClientData}
              setVehicleData={setVehicleData}
              setClientValues={setClientValues}
              setVehicleValues={setVehicleValues}
              setServices={setServices} // Asegurarse de pasar setServices correctamente
            />
          </section>
          {/* Servicios */}
          <section className="flex w-full h-7/11 space-x-2">
            <div className="flex flex-col justify-center items-center w-1/2 h-full border-2 border-[#494A8A] rounded-sm">
              <div className="flex h-1/10 space-x-10 bg-[#494A8A] w-full justify-center items-center">
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
                <div
                  className="cursor-pointer bg-[#494A8A] h-1/6 w-full flex justify-center items-center rounded-md text-white text-2xl"
                  onClick={addService}
                >
                  Agregar
                </div>
              </div>
            </div>

            {/* Servicios Agregados */}
            <div className="w-1/2 h-full border-2 border-[#494A8A] rounded-sm">
              <div className="flex h-1/10 bg-[#494A8A] justify-center items-center">
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
            <div 
              className="bg-[#494A8A] h-12 w-full flex justify-center items-center rounded-md text-white text-2xl cursor-pointer"
              onClick={() => handleSchedule(clientValues, vehicleValues)}
            >
              Agendar
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Schedule;