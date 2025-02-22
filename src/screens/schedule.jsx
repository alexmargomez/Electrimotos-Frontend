import React, { useEffect, useState } from 'react';
import DateTimeDisplay from '../components/DateTimeDisplay';

const Schedule = () => {
  const token = localStorage.getItem('authToken');
  const [services, setServices] = useState([]);
  const [serviceInput, setServiceInput] = useState('');
  const [clientValues, setClientValues] = useState({
    name: '',
    id: '',
    phone: '',
    email: ''
  });
  const [clientOptions, setClientOptions] = useState({
    name: [],
    id: [], 
    phone: [],
    email: []
  });
  const [clientData, setClientData] = useState([]); // Estado para almacenar los datos completos de los clientes
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
  const [vehicleData, setVehicleData] = useState([]); 

  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/customers', {
          headers: {
            'Authorization': `Bearer ${token}`,
          }
        });
        const result = await response.json();
        // Almacena los productos en el estado
        const clientOpts = {
          name: result.map(client => client.name),
          id: result.map(client => client.id),
          phone: result.map(client => client.phone),
          email: result.map(client => client.email)
        };
        setClientOptions(clientOpts);
        setClientData(result); // Almacenamos los datos completos de los clientes
        console.log('Clientes:', result);
      } catch (error) {
        console.error('Error fetching customers:', error);
      }
    };
  
    const fetchVehicle = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/vehicles', {
          headers: {
            'Authorization': `Bearer ${token}`,
          }
        });
        const result = await response.json();
        const vehicleOpts = {
          plate: result.map(vehicle => vehicle.plate),
          make: result.map(vehicle => vehicle.make),
          model: result.map(vehicle => vehicle.model),
        };
        setVehicleOptions(vehicleOpts);
        console.log('Vehículos:', result);
      } catch (error) {
        console.error('Error fetching vehicles:', error);
      }
    };

    fetchCustomer();
    fetchVehicle();
  }, [token]);

  const handleVehicleChange = (field, value) => {
    setVehicleValues(prev => ({ ...prev, [field]: value }));
    const vehicle = vehicleData.find(vehicle => vehicle[field].toString() === value.toString());
    if (vehicle) {
      setVehicleValues({
        plate: vehicle.plate,
        make: vehicle.make,
        model: vehicle.model,
      });
    }
  };

  const handleClientChange = (field, value) => {
    setClientValues(prev => ({ ...prev, [field]: value }));
    if (field === 'id' || field === 'name') {
      const client = clientData.find(client => client[field].toString() === value.toString());
      if (client) {
        setClientValues({
          name: client.name,
          id: client.id.toString(),
          phone: client.phone.toString(),
          email: client.email,
        });
      }
    }
  };

  const addService = () => {
    if (serviceInput.trim() !== '') {
      setServices([...services, serviceInput]);
      setServiceInput('');
    }
  };

  const removeService = (index) => {
    setServices(services.filter((_, i) => i !== index));
  };

  const handleSchedule = async () => {
    let customerId = clientValues.id;

    if (!customerId ) {
      const cliente = await fetch('http://localhost:8000/api/customers/', {
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
        throw new Error('Error creando el cliente');  
      }
    }
    

    const vehicle = await fetch('http://localhost:8000/api/vehicles/', {
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

    if (!vehicle.ok) {
      throw new Error('Error creando el vehículo');
    }

    try {
        const scheduleResponse = await fetch('http://localhost:8000/api/schedules/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({
                "customer_id": customerId,
                "servicios": services,
            }),
        });

        if (!scheduleResponse.ok) {
            throw new Error('Error creando el agendamiento');
        }

        alert('Agendamiento creado exitosamente'); 
        window.location.reload();
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

          {/* Datos de Cliente */}
          <section className="h-3/11 w-full flex shadow-2xl mb-2 rounded-lg">
            <div className="w-1/2 flex flex-col">
              <h2 className="text-2xl h-1/4 p-3 text-[#494A8A] font-bold">Cliente</h2>
              <div className="h-3/4 pl-10 pr-10 flex flex-col justify-center items-center pb-5">
                {Object.keys(clientValues).map((field, index) => (
                  <div key={index} className="relative w-full">
                    <input
                      type={field === "email" ? "email" : "text"}
                      placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                      list={field}
                      value={clientValues[field]}
                      onChange={(e) => handleClientChange(field, e.target.value)}
                      onInput={(e) => handleClientChange(field, e.target.value)}
                      className="w-full border-b-1 border-gray-500 outline-none placeholder-gray-500 pl-1"
                    />
                    <datalist id={field}>
                      {clientOptions[field].map((option, id) => (
                        <option key={id} value={option} />
                      ))}
                    </datalist>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Datos del Vehículo */}
            <div className="w-1/2">
              <h2 className="text-2xl h-1/4 p-3 text-[#494A8A] font-bold">Vehículo</h2>
              <div className="h-3/4 pl-10 pr-10 flex flex-col justify-center items-center pb-5">
                {Object.keys(vehicleValues).map((field, index) => (
                  <div key={index} className="relative w-full">
                    <input
                      type="text"
                      placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                      list={field}
                      value={vehicleValues[field]}
                      onChange={(e) => handleVehicleChange(field, e.target.value)}
                      onBlur={(e) => handleVehicleChange(field, e.target.value)}
                      className="w-full border-b-1 border-gray-500 outline-none placeholder-gray-500 pl-1"
                    />
                    <datalist id={field}>
                      {vehicleOptions[field].map((option, id) => (
                        <option key={id} value={option} />
                      ))}
                    </datalist>
                  </div>
                ))}
              </div>
            </div>
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
                  {services.map((service, index) => (
                    <div key={index} className="p-1 pr-3 pl-3 flex justify-between items-center w-full border-1 rounded-sm">
                      <h3 className="text-2xl">{service}</h3>
                      <button className="rojo text-white rounded-md p-1" onClick={() => removeService(index)}>
                        Eliminar
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Botón de Agendar */}
          <section className="w-full pt-2">
            <div 
              className="bg-[#494A8A] h-12 w-full flex justify-center items-center rounded-md text-white text-2xl cursor-pointer"
              onClick={handleSchedule}

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