import React, { useEffect, useState } from 'react';

const DatesRegister = ({ token, API_URL, setClientData, setVehicleData, setClientValues, setVehicleValues, setServices}) => {
  const [clientValues, updateClientValues] = useState({
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
          name: result.map(client => client.name),
          id: result.map(client => client.id),
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
        const filterVehicles = vehicleData.filter(vehicle => vehicle.customer_id.toString() === clientValues.id);
        const vehicleOpts = {
          plate: filterVehicles.map(vehicle => vehicle.plate),
          make: filterVehicles.map(vehicle => vehicle.make),
          model: filterVehicles.map(vehicle => vehicle.model),
        };
        setVehicleOptions(vehicleOpts);


        const response = await fetch(`${API_URL}/schedules?customer_id=${clientValues.id}&state=Pendiente`, {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });
        const result = await response.json();
        if (result.length > 0) {
            const schedule = result[0];
            if (schedule.state === "Pendiente") {
                const vehicle = vehicleData.find(vehicle => vehicle.id === schedule.vehicle_id);
                if (vehicle) {
                    updateVehicleValues({
                    plate: vehicle.plate,
                    make: vehicle.make,
                    model: vehicle.model
                    });
                    setVehicleValues({
                    plate: vehicle.plate,
                    make: vehicle.make,
                    model: vehicle.model
                    });
                }
                try {
                    const serviciosArray = JSON.parse(schedule.servicios);
                    if (Array.isArray(serviciosArray)) {
                      setServices(serviciosArray);
                      console.log('Servicios:', serviciosArray);
                    } else {
                      console.error('Servicios no es un array:', schedule.servicios);
                    }
                } catch (e) {
                    console.error('Error al parsear servicios como JSON:', e);
                }
            }   
        }
      }else {
        const vehicleOpts = {
          plate: vehicleData.map(vehicle => vehicle.plate),
          make: vehicleData.map(vehicle => vehicle.make),
          model: vehicleData.map(vehicle => vehicle.model),
        };
        setVehicleOptions(vehicleOpts);
      }
    };
    flVehicles();
  }, [clientValues.id, vehicleData, API_URL, token, setVehicleValues, setServices]); 

  const handleVehicleChange = (field, value) => {
    updateVehicleValues(prev => ({ ...prev, [field]: value }));
    setVehicleValues(prev => ({ ...prev, [field]: value }));

    if (field === 'plate' || field === 'make' || field === 'model') {
      const vehicle = vehicleData.find(vehicle => vehicle[field].toString() === value.toString());
      if (vehicle) {
        updateVehicleValues({
            plate: vehicle.plate,
            make: vehicle.make,
            model: vehicle.model,
        });
        setVehicleValues({
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
    if (field === 'id' || field === 'name') {
      const client = clientData.find(client => client[field].toString() === value.toString());
      if (client) {
        updateClientValues({
          name: client.name,
          id: client.id.toString(),
          phone: client.phone.toString(),
          email: client.email,
        });
        setClientValues({
          name: client.name,
          id: client.id.toString(),
          phone: client.phone.toString(),
          email: client.email,
        });
      }
    }
  };

  return (
    <>
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
                onInput={(e) => handleVehicleChange(field, e.target.value)}
                className="w-full border-b-1 border-gray-500 outline-none placeholder-gray-500 pl-1"
                />
                <datalist id={field}>
                {Array.isArray(vehicleOptions[field]) && vehicleOptions[field].map((option, id) => (
                    <option key={id} value={option} />
                ))}
                </datalist>
            </div>
        ))}
        </div>
      </div>
    </>
  );
};

export default DatesRegister;