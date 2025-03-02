import React from 'react'
import Modal from './Modal';
import { FaEye, FaRegEye } from "react-icons/fa";
import { useState, useEffect } from 'react';

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
  return (
    <div>
        <div onClick={openModal} className=' underline hover:text-blue-30 cursor-pointer'>
            <FaEye />
        </div>
        <Modal show={isModalOpen} onClose={closeModal}>
            <div className='flex flex-col justify-between items-center h-full w-full '>
                <div className='font-bold text-2xl h-1/8 justify-center items-center grid grid-cols-11 bg-[#494A8A] rounded-t-xl w-full text-white'>
                    <div className='col-span-2 justify-center items-center w-full'>
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
                    {dateServices.map((service) => (
                        <div key={service.id} className='space-x-2 flex justify-center items-center p-1 border-b-1 border-gray-300 shadow-sm'>
                            <div className=''>Servicio: {service.date}</div>
                            <div className=''>Valor Cobrado: $ {service.price}</div>
                            <div className=''>Vehiculo: {service.vehicle_id}</div>
                            <div className=''>Fecha: {service.created_at}</div>
                            
                        </div>
                    ))

                    }
                </div>
            </div>
        </Modal>
    </div>
  )
}

export default ReporCustomer