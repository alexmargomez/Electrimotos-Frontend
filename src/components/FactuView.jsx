import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import Electrimotos from '../assets/electrimotosSm.svg';
import FactuPrint from './FactuPrint';

const FactuView = ({ id, customerID, vehicleID, total }) => {
    const token = localStorage.getItem('authToken');
    const API_URL = import.meta.env.VITE_API_URL;
    const [factura, setFactura] = useState(null);
    const [customer, setCustomer] = useState(null);
    const [products, setProducts] = useState([]);
    const [saleDetails, setSaleDetails] = useState([]);
    const [vehicle, setVehicle] = useState(null);
    const [services, setServices] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [printId, setPrintId] = useState(null);


    useEffect(() => {
        const fetchFactura = async () => {
            try {
                const response = await fetch(`${API_URL}/invoices/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });
                const result = await response.json();
                setFactura(result[0]);
            } catch (error) {
                console.error('Error fetching factura:', error);
            }
        };

        const fetchCustomer = async () => {
            if (!customerID) {
                console.error('customerID is undefined');
                return;
            }
            try {
                const response = await fetch(`${API_URL}/customers/${customerID}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });
                const result = await response.json();
                setCustomer(result);
            } catch (error) {
                console.error('Error fetching customer:', error);
            }
        };

        const fetchVehicle = async () => {
            if (!vehicleID) {
                console.error('vehicleID is undefined');
                return;
            }
            try {
                const response = await fetch(`${API_URL}/vehicles/${vehicleID}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });
                const result = await response.json();
                setVehicle(result);
            } catch (error) {
                console.error('Error fetching vehicle:', error);
            }
        };

        const fetchServices = async () => {
            try {
                const response = await fetch(`${API_URL}/services/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });
                const result = await response.json();
                setServices(result);
            } catch (error) {
                console.error('Error fetching services:', error);
            }
        };
        const fetchSaleDetails = async () => {
            try {
                const response = await fetch(`${API_URL}/sale-details/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });
                const result = await response.json();
                setSaleDetails(result);
                result.forEach(async (saleDetail) => {
                    const productName = await fetchProducts(saleDetail.product_id);
                    setProducts(prevProducts => ({
                        ...prevProducts,
                        [saleDetail.product_id]: productName
                    }));
                });
            } catch (error) {
                console.error('Error fetching services:', error);
            }
        };

        fetchFactura();
        fetchVehicle();
        fetchCustomer();
        fetchServices();
        fetchSaleDetails();
    }, [id, customerID, vehicleID, API_URL, token]);

    const fetchProducts = async (id) => {
        try {
            const responseProduct = await fetch(`${API_URL}/products/${id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            });
            const resultProduct = await responseProduct.json();
            console.log("name: ", resultProduct.name);
            return(resultProduct.name);
            
        } catch (error) {
            console.error('Error fetching products:', error);
        }
        
    };
    const fetchInvoices = async (id) => {
        try {
            const responseProduct = await fetch(`${API_URL}/invoices/pdf/${id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            });
            const resultProduct = await responseProduct.json();
            console.log("name: ", resultProduct.name);
            return(resultProduct.name);
            
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

    
    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const handlePrint = (num) => {
        setPrintId(num);
    };

    if (!factura || !customer || !vehicle) {
        return <p>Loading...</p>;
    }

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

    return (
        <>
            <div
                className='text-blue-500 underline hover:text-amber-300'
                onClick={openModal}
            >
                {factura.invoice_number}
            </div>
            
            <Modal show={isModalOpen} onClose={closeModal}>
                <div className='flex flex-col h-full w-full '>
                    <div className='pr-5 pl-5 font-bold text-2xl h-1/10 justify-between items-center flex w-[100%] shadow-sm bg-[#494A8A] rounded-t-xl text-white'>
                        <h1>Factura N° {factura.invoice_number}</h1>
                        
                    </div>

                    <div className='flex space-x-4 h-2/10 items-center w-[100%] shadow-sm'>
                        <div className='flex w-1/3 justify-center items-center'>
                            <img src={Electrimotos} alt="Electrimotos Icon" />
                        </div>
                        <div className='w-2/3 flex justify-baseline items-center '>
                            <div className='flex flex-col space-y-1 w-2/3'>
                                <p className='flex justify-baseline'>Nombre: {customer.name}</p>
                                <p className='flex justify-baseline'>Telefono: {customer.phone}</p>
                                <p className='flex justify-baseline'>Correo: {customer.email}</p>
                            </div>
                            <div className='flex flex-col space-y-1 w-1/3'>
                                <p className='flex justify-baseline'>Placa: {vehicle.plate}</p>
                                <p className='flex justify-baseline'>Marca: {vehicle.make}</p>
                                <p className='flex justify-baseline'>Modelo: {vehicle.model}</p>
                            </div>
                        </div>
                    </div>

                    <div className='flex h-5/10 shadow-sm justify-center items-center w-[100%]'>
                        <div className='w-1/2 h-full'>
                            <div className='h-1/5 flex justify-center items-center bg-[#494A8A] text-white'>
                                <h2 className='text-2xl font-bold'>Servicios</h2>
                            </div>
                            <div className='h-4/5 overflow-y-scroll'>
                                <div className='grid grid-cols-4 border-b-2 border-gray-600 shadow-lg p-1'>
                                    <div className='col-span-2 font-bold text-lg'>Servicio</div>
                                    <div className='col-span-2 font-bold text-lg'>Precio</div>
                                </div>
                                
                                {services.length === 0 ? (
                                    <p>No hay servicios registrados</p>
                                ):(
                                    services.map((service) => (
                                        <div
                                        key={service.id}
                                        className='grid grid-cols-4 space-x-2 justify-center items-center p-1 border-b-1 border-gray-300 shadow-sm'
                                        >
                                            <div className='col-span-2'>{service.date}</div>
                                            <div className='col-span-2'>$ {formatPrice(service.price)}</div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                        <div className='w-1/2 h-full'>
                            <div className='h-1/5 flex justify-center items-center bg-[#494A8A] text-white'>
                                <h2 className='text-2xl font-bold'>Productos</h2>
                            </div>
                            <div className='h-4/5 overflow-y-scroll'>
                                <div className='grid grid-cols-5 border-b-2 border-gray-600 shadow-lg p-1'>
                                    <div className='col-span-2 font-bold text-lg'>Producto</div>
                                    <div className='col-span-1 font-bold text-lg'>Unidades</div>
                                    <div className='col-span-2 font-bold text-lg'>Precio</div>
                                </div>
                                {saleDetails.length === 0 ? (
                                    <p>No hay productos registrados</p>
                                ):(
                                    saleDetails.map((product, index) => (
                                        <div
                                            key={index}
                                            className='grid grid-cols-5 space-x-2 justify-center items-center p-1 border-b-1 border-gray-300 shadow-sm'
                                        >
                                            <div className='col-span-2'>{products[product.product_id] || 'Loading...'}</div>
                                            <div className='col-span-1'>{product.quantity}</div>
                                            <div className='col-span-2'>$ {formatPrice(product.price_total)}</div>
                                        </div>
                                    ))
                                )}
                            
                            </div>
                        </div>
                        
                    </div>
                    <div className='flex justify-between space-x-4 h-1/10 bg-blue-100 items-center w-[100%] rounded-b-xl pr-10 pl-10 '>
                        <div className='text-2xl font-bold'>
                            <p>{formatDateTime(factura.created_at)}</p>
                        </div>
                        <div className='flex space-x-4'>
                            <h3 className='text-2xl font-bold'>Total: </h3>
                            <p className='text-2xl font-bold'>$ {formatPrice(total)}</p>
                        </div>
                        
                        
                    </div>
                    <div className='flex justify-center items-center h-1/10 w-[100%] space-x-10'>
                        <button
                            className='blue p-2 rounded-lg hover:bg-blue-300'
                            onClick={() => handlePrint(1)}
                        >
                            Imprimir 
                        </button>
                        {printId && <FactuPrint id={factura.id} />}
                        <button className='rojo' onClick={closeModal}>Salir</button>
                    </div>
                </div>
            </Modal>
        </>
    );
};

export default FactuView;