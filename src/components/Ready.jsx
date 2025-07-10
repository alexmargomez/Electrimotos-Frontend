import React, { useEffect } from 'react';
import { FaCheck } from "react-icons/fa";
import '../styles/ModalReady.css';

const ModalReady = ({ show, onClose, Date }) => {
  useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    let timer;
    if (show) {
      window.addEventListener('keydown', handleEsc);
      timer = setTimeout(() => {
        onClose();
      }, 2000);
      
       // Cerrar el modal después de 2 segundos
    }
    
    return () => {
      window.removeEventListener('keydown', handleEsc);
      clearTimeout(timer); // Limpiar el temporizador si el modal se cierra antes de los 2 segundos
    };
  }, [show, onClose]);

  if (!show) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-gray-700/10 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-lg relative w-[25%] h-[25%] flex justify-center items-center flex-col ">
        <FaCheck className='text-7xl pb-3 icon-check'/>
        <h1 className='text-2xl'>SERVICIOS {Date}</h1>
      </div>
    </div>
  );
};

export default ModalReady;