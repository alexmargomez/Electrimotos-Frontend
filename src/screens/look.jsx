import React from 'react'
import { useState, useEffect} from  "react";
import LookDetail from '../components/LookDetail';
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";


const Look = () => {
  const [number, setNumber] = useState(() => {
    const savedNumber = localStorage.getItem('number');
    return savedNumber !== null ? parseInt(savedNumber, 10) : 0;
  });
  const [isOpen, setIsOpen] = useState(false); // Estado para controlar la visibilidad del menú
  const options = ["Productos", "Clientes", "Vehiculos", "Ventas", "Pendientes", "Movimientos"]; // Opciones del menú
  const [selectedOption, setSelectedOption] = useState( options[number]); // Estado para la opción seleccionada
  const [searchTerm, setSearchTerm] = useState('');
  
  // Opciones del menú
  useEffect(() => {
    localStorage.setItem('number', number);
  }, [number]);

  const handleOptionClick = (option) => {
    setSelectedOption(option); // Actualiza la opción seleccionada
    setIsOpen(false); // Cierra el menú
  };
  console.log(number);
  return (
    // Barra de busqueda 
    <div className='flex flex-col h-screen w-full bg-gray-100'>
      <div className=' h-1/15 m-3 flex space-x-10 mr-4 ml-4'>
        <div className='rounded-xl border border-gray-500 shadow-lg flex flex-row  w-full  relative'>
          <div
            onClick={() => setIsOpen(!isOpen)} // Alternar la visibilidad del menú
            className="w-2/10 border-r cursor-pointer flex justify-evenly items-center"
          >
            {isOpen ? (
              <>
              {selectedOption}
              <IoIosArrowUp />
              </>
            ) : (
              <>
              {selectedOption}
              <IoIosArrowDown />
              </>
            )}
          </div>

          {isOpen && (
            <div className="absolute top-full left-0 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg z-10">
              {options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleOptionClick(option)} // Maneja la selección de la opción
                  className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 text-left"
                >
                  {option}
                </button>
              ))}
            </div>
          )}

          <input 
            type="text"
            placeholder='Buscar...'  
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className='focus:outline-none w-8/10 p-2 '
          />
        </div>
        
      </div>
      <div className=' h-screen  m-4 mt-2 rounded-sm bg-white shadow-2xl p-4 overflow-y-auto'>
        <LookDetail selectedOption={selectedOption} searchTerm={searchTerm} setNumber={setNumber}/>
      </div>
    </div>
  )
}

export default Look