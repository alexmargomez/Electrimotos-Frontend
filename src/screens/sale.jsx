import React from 'react'
import DateTimeDisplay from '../components/DateTimeDisplay';
import { useState, useEffect } from 'react';
import LookProduct from '../components/LookProduct';  
import DatesRegister from '../components/DatesRegister';
import FactuPrint from '../components/FactuPrint';
import Ready from '../components/Ready';

const Sale = () => {
  const API_URL = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem('authToken');
  const [showModal, setShowModal] = useState(false);
  const [invoices, setInvoices] = useState(null);
  const [PrintId, setPrintId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [services, setServices] = React.useState([]);
  const [servicesDate, setServicesDate] = React.useState([]);
  const [productsDate, setProductsDate] = React.useState([]);
  const [serviceInput, setServiceInput] = React.useState(''); // Estado para el input de servicio
  const [serviceValue, setServiceValue] = React.useState(''); // Estado para el valor del servicio
  const [activeTab, setActiveTab] = React.useState('producto');
  const [total, setTotal] = React.useState(0);
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
  const [idSale, setIdSale] = useState(null); // Estado para almacenar el id de la venta
  const [vehicleID, setVehicleID] = useState(null); // Estado para almacenar el id del vehículo
  const [customerID, setCustomerID] = useState(null);
  
  const handleTabClick = (tab) => {
    setActiveTab(tab);  
  };

  const addService = () => {
    if (serviceInput.trim() !== '' && serviceValue.trim() !== '') {
      const newService = { date: serviceInput, price: parseInt(serviceValue) };
      setServices([...services, newService]);
      setServiceInput('');
      setServiceValue('');
    }
  }
  const removeService = (index) => {
    setServices(services.filter((service, i) => i !== index));
  }
  
  const handlePriceChange = (index, price) => {
    const updatedServices = services.map((service, i) => 
      i === index ? { ...service, price: parseInt(price) || 0 } : service
    );
    setServices(updatedServices);
  }

  const handleKeyDown = (event, index) => {
    if (event.key === 'Enter') {
      handlePriceChange(index, event.target.value);
    }
  }

  const addProduct = (product) => {
   
    const total = product.price * product.und;

    const updatedProduct ={ ...product, total};
    setProductsDate([...productsDate, updatedProduct]);  
  }


  const removeProduct = (index) => {
    setProductsDate(productsDate.filter((product, i) => i !== index));
  }

  useEffect(() => {
    if (servicesDate.length > 0) {
      const newServices = servicesDate.map((data) => ({
        date: data,
        price: 0,
      }));
      setServices((prevServices) => [...prevServices, ...newServices]);
    }
  }, [servicesDate]);

  

  useEffect(() => {
    const totalServices = services.reduce((acc, service) => acc + service.price, 0);
    const totalProducts = productsDate.reduce((acc, product) => acc + product.total, 0);
    setTotal(totalServices + totalProducts);
  },[services, productsDate ])

  const formatPrice = (price) => {
    return price.toLocaleString('es-CO');
  }
  //Creacion de Factura Sale Sale_details services
  const handleInovice = async (clientValues, vehicleValues) => {
    let customerId = clientValues.id;
    let vehicleId = vehicleValues.id;
    console.log('vehicleId:', vehicleId);
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
      if(response.length > 0){
        const responsePendiente = response.find(schedule => schedule.state === "Pendiente");
        
        if(responsePendiente){
          console.log('responsePendiente:', responsePendiente);
          const scheduleResponse = await fetch(`${API_URL}/schedules/${responsePendiente.id}`,{
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({
              "servicios": services,
              "state": "Completado",
            }),
          });
        }
      }

      const saleCreate = await fetch(`${API_URL}/sales/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          "customer_id": customerId,
          "vehicle_id": vehicleId,
          "total": total,
          "payment_method": "Efectivo",
        }),
      });
      if (!saleCreate.ok) {
        const errorData = await saleCreate.json();
        console.error('Error response data:', errorData);
        throw new Error('Error creando la venta');
      }else{
        const saleData = await saleCreate.json();
        const saleId = saleData.id;
        setIdSale(saleId); // Actualiza el estado con el id de la venta
        setCustomerID(customerId); // Actualiza el estado con el id del cliente
        setVehicleID(vehicleId); // Actualiza el estado con el id del vehículo

        for (const product of productsDate) {
          
          const saleDetail = await fetch(`${API_URL}/sale-details/`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({
              "customer_id": customerId,
              "sale_id": saleId,
              "product_id": product.id,
              "quantity": product.und,
              "price_total": product.total,   
            }),
          });
          if (!saleDetail.ok) {
            const errorData = await saleDetail.json();
            console.error('Error response data:', errorData);
            throw new Error('Error creando el detalle de la venta');
          }
        }
        for (const service of services) {
          const serviceCreate = await fetch(`${API_URL}/services/`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({
              "customer_id": customerId,
              "vehicle_id": vehicleId,
              "sale_id": saleId,
              "date": service.date,
              "price": service.price,
            }),
          });
          if (!serviceCreate.ok) {
            const errorData = await serviceCreate.json();
            console.error('Error response data:', errorData);
            throw new Error('Error creando el servicio');
          }
        }
        const invoiceSale = await fetch(`${API_URL}/invoices/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`, 
          },
          body: JSON.stringify({
            "sale_id": saleId,
          }),
        });
        if (!invoiceSale.ok) {
          const errorData = await invoiceSale.json();
          console.error('Error response data:', errorData);
          throw new Error('Error creando la factura');
        }else{
          const invoiceData = await invoiceSale.json();
          setInvoices(invoiceData.id);
        }
      }
    setShowModal(true); 
    }catch (error) {
      console.error('Error creating Factura', error);
      throw new Error('Error creando el FACTURA');
    }
  }

  const handlePrint = (num) => {
    setPrintId(num);
    
  }

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <div className='h-screen w-full flex flex-col bg-gray-200'>
      <div className='m-4 mb-0 flex justify-between '>
        <h1 className='text-left font-bold text-gray-600'>FACTURAR</h1>
        <DateTimeDisplay className="flex justify-between"  />
      </div>
      <div className={`p-5 m-4 h-full bg-white rounded-sm shadow-xl mt-0 border-t-3 border-[#FFD700]  flex flex-wrap ${showModal ? 'animate-border' : ''}`}>

      <section className='h-3/11 w-full flex shadow-2xl mb-2 rounded-lg'>
        <DatesRegister 
            token={token}
            API_URL={API_URL}
            setClientData={setClientData}
            setVehicleData={setVehicleData}
            setClientValues={setClientValues}
            setVehicleValues={setVehicleValues}
            setServices={setServicesDate} 
            
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
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className=' focus:outline-none w-full border-b-1 border-gray-500 outline-none placeholder-gray-500'
                    />
                  </div>
                  <div className='p-2 flex justify-center items-start mt-2 bg-white overflow-y-auto max-h-[300px] h-6/7  w-full rounded-sm shadow-sm'>
                    <LookProduct addProduct={addProduct} searchTerm={searchTerm}/>
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
                  <button
                  className=' button-Date h-1/6 w-full flex justify-center items-center rounded-md text-white text-2xl cursor-pointer'
                  onClick={addService}
                  >
                    Agregar
                  </button>
                </div>
              )}
            </div>
          </div>
          <div className='w-1/2 h-full border-2 border-[#494A8A] rounded-sm'> {/*Factura*/}
            <div className='flex justify-center items-center h-1/10  space-x-10 bg-[#494A8A] '>
              <h2 className='text-white text-2xl'>Facturación</h2>
            </div>
            <div className='flex flex-col items-center justify-baseline p-4 space-y-2  h-9/10 w-full overflow-y-auto max-h-[400px]'>
              {productsDate.length === 0 && services.length === 0 && (
                <p className=' text-gray-500 text-center'>Aún no hay productos ni servicios agregados</p>
              )}
              {productsDate.map((product, index) => (
                <div key={index} className='p-1 pr-3 pl-3 flex justify-between items-center w-full border-1 rounded-sm '>
                  <div className='text-xl  w-full h-full mr-2 flex justify-evenly items-center'>
                    <div className='flex flex-col items-center'>
                      <h3 className='text-sm'>Nombre:</h3>
                      <p className='font-bold '>{product.name}</p>
                    </div>
                    <div className='flex flex-col  items-center'>
                      <h3 className='text-sm'>Unidades:</h3>
                      <p className='font-bold'>{product.und}</p>
                    </div>
                    <div className='flex flex-col items-center'>
                      <h3 className='text-sm'>Precio:</h3>
                      <p className='font-bold'>$ {formatPrice(product.total)}</p>
                    </div>
                    
                  </div>
                  <button className='rojo text-white rounded-md' onClick={() => removeProduct(index)}>Eliminar</button>
                </div>
              ))}
              {services.map((service, index) => (
                <div key={index} className='p-1 pr-3 pl-3 flex justify-between items-center w-full border-1 rounded-sm '>
                  <div className='text-xl  w-full h-full mr-2 flex justify-evenly items-center'>
                    <div className='flex flex-col items-center'>
                      <h3 className='text-sm'>Descripción: </h3>
                      <p className='font-bold'> {service.date}</p>
                    </div>
                    <div className='flex flex-col items-center'>
                      <h3 className='text-sm'>Precio:</h3>
                      {service.price === 0 ? (
                      <input 
                      type="number"
                      className='w-20 border-b-1 border-gray-500 outline-none placeholder-gray-500 pl-1 text-center'
                      placeholder='valor'
                      onKeyDown={(e) => handleKeyDown(e, index)}
                      min="0"
                      />
                      ) : (
                        <p className='font-bold'>$ {formatPrice(service.price)}</p>
                      )
                      }
                    </div>
                  </div>
                  <button className='rojo text-white rounded-md p-1' onClick={() => removeService(index)}>Eliminar</button>
                </div>
              ))}
            </div>
          </div>
          
        </section>

        <section className=' h-1/11 flex w-full pt-2 '> {/*Total y botones de facturar y cancelar*/}
          
          <div className='h-full w-1/2 flex justify-end items-center pr-6'>
            <h3 className='text-[#494A8A] text-5xl font-extrabold pr-3'>Total: </h3>
            <h3 className='text-[#494A8A] text-5xl font-extrabold'>$ {formatPrice(total)}</h3>
          </div>
          
          <button
            className=' button-Date h-full w-1/2 flex justify-center items-center rounded-md text-white text-2xl cursor-pointer'
            onClick={() => {
              handleInovice(clientValues, vehicleValues);
              handlePrint(1);
            }}
          >
            Facturar
          </button>
          {PrintId && (
              <>
                
                <FactuPrint id={invoices} />
                <Ready show={showModal} onClose={handleCloseModal} Date="FACTURADO"/>
              </>
            )}
          
        </section>
      </div>
        
    </div>

  )
}

export default Sale