import React from 'react'
import Modal from './Modal';
import { FaEye, FaRegEye } from "react-icons/fa";
import { useState, useEffect } from 'react';

const ReportVehicle = ({id, plate, make, model, idCustomer}) => {
    const token = localStorage.getItem('authToken');
    const API_URL = import.meta.env.VITE_API_URL;
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [dateServices, setDateServices] = useState([]);
    const [nameCustomer, setNameCustomer] = useState('');

    useEffect(() => {
        const dateService= async () => {
            const responseService = await fetch(`${API_URL}/services/vehicle/${id}`, {
                method: 'GET',
                headers: {
                    'Authorization' : `Bearer ${token}`
                }
            });
            const resultService = await responseService.json();
            setDateServices(resultService);            
        }        
        dateService();
        const fetchCustomer = async () => {
            const response = await fetch(`${API_URL}/customers/${idCustomer}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            });
            const result = await response.json();
            setNameCustomer(result.name);
        }
        fetchCustomer();
        
    },[token, API_URL, id]);
    const openModal = () => {
        setIsModalOpen(true);
    }
    const closeModal = () => {
        setIsModalOpen(false);
    }
  return (
    <div>
        <div onClick={openModal} className=' underline hover:text-blue-30 cursor-pointer'>
            <FaEye />
        </div>
        <Modal show={isModalOpen} onClose={closeModal}>
        {dateServices.length > 0 ? (
            <div className='flex flex-col justify-between items-center h-full w-full '>
                <div className='grid grid-cols-10 font-bold text-2xl h-1/8 justify-center items-center  bg-[#494A8A] rounded-t-xl w-full text-white'>
                    
                    <div className='col-span-2  justify-center items-center w-full'>
                        <h1 >Placa:</h1>
                        <p> {plate}</p>
                    </div>
                    <div className=' col-span-2  justify-center items-center w-full'>
                        <h1 >Marca:</h1>
                        <p>{make}</p>
                    </div>
                    <div className='col-span-2 justify-center items-center w-full'>
                        <h1 >Modelo:</h1>
                        <p> {model}</p>
                    </div>
                    <div className='col-span-4 justify-center items-center w-full'>
                        <h1 >Dueño:</h1>
                        <p> {nameCustomer}</p>
                    </div>
                </div>                
                <div className=' h-7/8 shadow-xl w-full rounded-b-xl overflow-y-scroll' > 
                    {dateServices.map((service) => (
                        <div key={service.id} className='space-x-2 flex justify-center items-center p-1 border-b-1 border-gray-300 shadow-sm'>
                            <div className=''>Servicio: {service.date}</div>
                            <div className=''>Valor Cobrado: $ {service.price}</div>
                            <div className=''>Vehiculo: {service.customer_id}</div>
                            <div className=''>Fecha: {service.created_at}</div>
                            
                        </div>
                    ))

                    }
                </div>
            </div>
        ) : (
            <div className='flex justify-center items-center h-full w-full'>
                <h1>No hay servicios registrados</h1>
            </div>
        
        )}
            
        </Modal>
    </div>
  )
}

export default ReportVehicle