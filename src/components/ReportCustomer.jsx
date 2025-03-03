import React from 'react'
import Modal from './Modal';
import { FaEye, FaRegEye } from "react-icons/fa";
import { useState, useEffect } from 'react';
import { TbHourglassEmpty } from "react-icons/tb";

const ReporCustomer = ({id, name, phone, email}) => {
    const token = localStorage.getItem('authToken');
    const API_URL = import.meta.env.VITE_API_URL;
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [dateServices, setDateServices] = useState([]);
    useEffect(() => {
        const dateService= async () => {

            const responseService = await fetch(`${API_URL}/services/customer/${id}`, {
                method: 'GET',
                headers: {
                    'Authorization' : `Bearer ${token}`
                }
                });
                const resultService = await responseService.json();
                setDateServices(resultService);
        }       
        dateService();
        
    },[token, API_URL, id]);
    
    const openModal = () => {
        setIsModalOpen(true);
    }
    const closeModal = () => {
        setIsModalOpen(false);
    }
    const formatDateTime = (dateTime) => {
        const date = new Date(dateTime);
        return isNaN(date) ? 'Fecha inválida' : date.toLocaleDateString('es-CO');
    }
  return (
    <div>
        <div onClick={openModal} className=' underline hover:text-blue-30 cursor-pointer'>
            <FaEye />
        </div>
        <Modal show={isModalOpen} onClose={closeModal}>
            {dateServices.length > 0 ? (
                <div className='flex flex-col justify-between items-center h-full w-full '>
                    <div className='font-bold text-2xl h-1/8 justify-center items-center grid grid-cols-11 bg-[#494A8A] rounded-t-xl w-full text-white'>
                        <div className='shadow-xl col-span-2 justify-center items-center w-full'>
                            <h1 >ID:</h1>
                            <p> {id}</p>
                        </div>
                        <div className='col-span-4  justify-center items-center w-full'>
                            <h1 >Nombre:</h1>
                            <p> {name}</p>
                        </div>
                        <div className=' col-span-2  justify-center items-center w-full'>
                            <h1 >Phone:</h1>
                            <p>{phone}</p>
                        </div>
                        <div className='col-span-3 justify-center items-center w-full'>
                            <h1 >Email:</h1>
                            <p> {email}</p>
                        </div>
                    </div>                
                    <div className=' h-7/8 shadow-xl w-full rounded-b-xl overflow-y-scroll' > 
                        <div className='grid grid-cols-5 shadow-lg border-b-2 border-gray-600 p-2'>
                            <div className='col-span-1 text-xl font-bold'>Vehiculo</div>
                            <div className='col-span-2 text-xl font-bold'>Servicio</div>
                            <div className='col-span-1 text-xl font-bold'>Valor Cobrado</div>
                            <div className='col-span-1 text-xl font-bold'>Fecha</div>
                        </div>
                        {dateServices.map((service) => (
                            <div key={service.id} className='grid grid-cols-5 justify-center items-center p-2 border-b-1 border-gray-300 shadow-sm'>
                                <div className='col-span-1 '>Vehiculo</div>
                                <div className='col-span-2 '>{service.date}</div>
                                <div className='col-span-1 '>$ {service.price}</div>
                                <div className='col-span-1 '>{formatDateTime(service.created_at)}</div>
                                
                            </div>
                        ))
                        }
                    </div>
                    <button className='rojo mt-4' onClick={closeModal}>Salir</button>
                </div>
            ) : (
                <div className='flex flex-col p-20 justify-center items-center h-full w-full space-y-5'>
                    <div className='flex flex-col justify-center items-center '>
                        <TbHourglassEmpty className='text-6xl'/>
                            <h1>No hay servicios registrados</h1>
                    </div>
                                
                    <button className='rojo mt-4' onClick={closeModal}>Salir</button>
                </div>
            
            )}
        </Modal>
    </div>
  )
}

export default ReporCustomer