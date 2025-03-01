import React, { useState, useEffect } from 'react'
import Modal from './Modal';
import { FaEye, FaRegEye } from "react-icons/fa";


const FactuPrint = ({id}) => {
    const token = localStorage.getItem('authToken');
    const API_URL = import.meta.env.VITE_API_URL;
    const [factura, setFactura] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    useEffect(() => { 
        const fetchFactura = async () => {
            try {
                const response = await fetch(`${API_URL}/invoices/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    }
                });
                const result = await response.json();
                setFactura(result[0]);
                console.log("Resultados",result);
            }
            catch (error) {
                console.error('Error fetching factura:', error);
            }
        }
        fetchFactura();
     },[id, API_URL, token]);

     const openModal = () => {
        setIsModalOpen(true);
      };
    
      const closeModal = () => {
        setIsModalOpen(false);
      };
  return (
    <>
        {factura ? (
            <div
                className='text-blue-500 underline hover:text-amber-300' 
                onClick={openModal}
            >
                {factura.invoice_number}
            </div>
            
        ) : (
            <p>Loading...</p>
        )}
        <Modal show={isModalOpen} onClose={closeModal}>
            <div className='flex flex-col justify-center items-center h-full w-full '>
                <div className='font-bold text-2xl h-1/10 justify-center items-center flex bg-amber-200 w-[70%]'>
                    <h1 >Factura</h1>
                </div>                
                <div className='flex space-x-4 h-1/10 bg-amber-300 justify-center items-center w-[70%]' > 
                    <p>Numero de Factura:</p>
                    <p>Fecha de Factura: </p>

                </div>
                <div className='flex space-x-4 h-3/10 bg-amber-700 justify-center items-center w-[70%]'>
                    <div>
                        <p>DNI: </p>
                        <p>Nombre: </p>
                        <p>Telefono: </p>
                        <p>Correo: </p>
                        
                    </div>
                    <div>
                        <p>vehiculo</p>
                        <p>Placa: </p>
                        <p>Marca: </p>
                        <p>Modelo: </p>
                    </div>
                    
                </div>

                <div className='flex flex-col space-y-4 h-4/10 bg-red-400 justify-center items-center w-[70%]'>
                    <p>servicios y productos</p>
                    <p>servicios y productos</p>
                    <p>servicios y productos</p>
                    <p>servicios y productos</p>
                    <p>servicios y productos</p>
                    <p>servicios y productos</p>
                    
                </div>
                <div className='flex space-x-4 h-1/10 bg-blue-100 justify-center items-center w-[70%]'>
      
                    <p>Subtotal: </p>
                    <p>IVA: </p>
                    <p>Total: </p>
                    <div
                        onMouseEnter={() => setIsOpen(true)}
                        onMouseLeave={() => setIsOpen(false)}
                        onClick={ () => window.print()}
                    >
                    {isOpen ?(
                        <FaEye className="text-black text-3xl" />
                    ):(
                        <FaRegEye className="text-black text-3xl" />
                    )}

                    </div>
                </div>
            </div>
        </Modal>
    </>
  )
}

export default FactuPrint;