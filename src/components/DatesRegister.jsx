import React, { useEffect, useState } from 'react';

const DatesRegister = ({pent, token, API_URL, setClientData, setVehicleData, setClientValues, setVehicleValues, setServices}) => {
  const [clientValues, updateClientValues] = useState({
    name: '',
    phone: '',
    email: ''
  });
  const [clientOptions, setClientOptions] = useState({
    name: [],
    phone: [],
    email: []
  });
  const [clientData, setClientDataLocal] = useState([]); // Estado para almacenar los datos completos de los clientes
  const [vehicleValues, updateVehicleValues] = useState({
    plate: '',
    make: '',
    model: ''
  });
  const [vehicleOptions, setVehicleOptions] = useState({
    plate: [],
    make: [],
    model: []
  });
  const [vehicleData, setVehicleDataLocal] = useState([]); 

  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        const response = await fetch(`${API_URL}/customers`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          }
        });
        const result = await response.json();
        const clientOpts = {
          id: result.map(client => client.id),
          name: result.map(client => client.name),          
          phone: result.map(client => client.phone),
          email: result.map(client => client.email)
        };
        setClientOptions(clientOpts);
        setClientData(result); // Almacenamos los datos completos de los clientes
        setClientDataLocal(result);
        console.log('Clientes:', result);
      } catch (error) {
        console.error('Error fetching customers:', error);
      }
    };

    const fetchVehicle = async () => {
      try {
        const response = await fetch(`${API_URL}/vehicles`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          }
        });
        const result = await response.json();
        setVehicleData(result);
        setVehicleDataLocal(result);
        console.log('Vehículos:', result);
      } catch (error) {
        console.error('Error fetching vehicles:', error);
      }
    };

    fetchCustomer();
    fetchVehicle();
  }, [token, API_URL, setClientData, setVehicleData]);

  useEffect(() => {
    const flVehicles = async () => {
      if (clientValues.id) {
        const filterVehicles = vehicleData.filter(vehicle => vehicle.customer_id === clientValues.id);
        const vehicleOpts = {
          id: filterVehicles.map(vehicle => vehicle.id),
          plate: filterVehicles.map(vehicle => vehicle.plate),
          make: filterVehicles.map(vehicle => vehicle.make),
          model: filterVehicles.map(vehicle => vehicle.model),
        };
        setVehicleOptions(vehicleOpts);

        console.log('clientoptions:', vehicleOpts);

        const response = await fetch(`${API_URL}/schedules/${clientValues.id}`, {
          headers: {
                'Authorization': `Bearer ${token}`,
            },
        });
        const result = await response.json();
        
        if (result.length > 0) {
          const schedulePendiente = result.find(schedule => schedule.state === "Pendiente");
          if (schedulePendiente) {
            pent(schedulePendiente.worker_id);
            console.log('Pendiente:', schedulePendiente.worker_id);
            const vehicle = vehicleData.find(vehicle => vehicle.id === schedulePendiente.vehicle_id);
            if (vehicle) {
              updateVehicleValues({
                id: vehicle.id,
                plate: vehicle.plate,
                make: vehicle.make,
                model: vehicle.model
              });
              setVehicleValues({
                id: vehicle.id,
                plate: vehicle.plate,
                make: vehicle.make,
                model: vehicle.model
              });
            }
            try {
              const serviciosArray = JSON.parse(schedulePendiente.servicios);
              if (Array.isArray(serviciosArray)) {
                setServices(serviciosArray); // Establece los servicios del Schedule pendiente
              } else {
                console.error('Servicios no es un array:', schedule.servicios);
              }
            } catch (e) {
                    console.error('Error al parsear servicios como JSON:', e);
            }
          }   
        }
      }
    };
    flVehicles();
  }, [clientValues.id, vehicleData, API_URL, token, setVehicleValues, setServices]); 

  const handleVehicleChange = (field, value) => {
    updateVehicleValues(prev => ({ ...prev, [field]: value }));
    setVehicleValues(prev => ({ ...prev, [field]: value }));

    if (field === 'plate' ) {
      const vehicle = vehicleData.find(vehicle => vehicle[field].toString() === value.toString());
      if (vehicle) {
        updateVehicleValues({
            id: vehicle.id,
            plate: vehicle.plate,
            make: vehicle.make,
            model: vehicle.model,
        });
        setVehicleValues({
            id: vehicle.id,
            plate: vehicle.plate,
            make: vehicle.make,
            model: vehicle.model,
        });
      }
    }
  };

  const handleClientChange = (field, value) => {
    updateClientValues(prev => ({ ...prev, [field]: value }));
    setClientValues(prev => ({ ...prev, [field]: value }));
    if ( field === 'name') {
      const client = clientData.find(client => client[field].toString() === value.toString());
      if (client) {
        updateClientValues({
          name: client.name,
          id: client.id,
          phone: client.phone.toString(),
          email: client.email,
        });
        setClientValues({
          name: client.name,
          id: client.id,
          phone: client.phone.toString(),
          email: client.email,
        });
      }
    }
  };

  return (
    <div className='flex'>
      <div className="w-1/2 flex flex-col">
        <h2 className="text-2xl h-1/4 p-3 text-[#023047] font-bold">Cliente</h2>
        <div className="h-3/4 pl-10 pr-10 flex flex-col justify-center items-center pb-5">
          {Object.keys(clientValues).map((field, index) => (
            <div key={index} className="relative w-full">
              {field !== 'id' && (
              <input
                type={field === "email" ? "email" : "text"}
                placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                list={field}
                value={clientValues[field]}
                onChange={(e) => handleClientChange(field, e.target.value)}
                onInput={(e) => handleClientChange(field, e.target.value)}
                className="w-full border-b-1 border-gray-500 outline-none placeholder-gray-500 pl-1"
              />
              )}
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
        <h2 className="text-2xl h-1/4 p-3 text-[#023047] font-bold">Vehículo</h2>
        <div className="h-3/4 pl-10 pr-10 flex flex-col justify-center items-center pb-5">
        {Object.keys(vehicleValues).map((field, index) => (
            <div key={index} className="relative w-full">
              {field !== 'id' && (
                <input
                type="text"
                placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                list={field}
                value={vehicleValues[field]}
                onChange={(e) => handleVehicleChange(field, e.target.value)}
                onInput={(e) => handleVehicleChange(field, e.target.value)}
                className="w-full border-b-1 border-gray-500 outline-none placeholder-gray-500 pl-1"
                />
              )}
              <datalist id={field}>
                {Array.isArray(vehicleOptions[field]) && vehicleOptions[field].map((option, id) => (
                  <option key={id} value={option} />
                ))}
              </datalist>
            </div>
        ))}
        </div>
      </div>
    </div>
  );
};

export default DatesRegister;