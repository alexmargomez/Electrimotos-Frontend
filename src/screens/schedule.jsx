import React from 'react';
import DateTimeDisplay from '../components/DateTimeDisplay';

const Schedule = () => {
  return (
    <div className='h-screen w-full flex flex-col bg-gray-200'>
      <div className='m-4 mb-0 flex justify-between '>
        <h1 className='text-left font-bold text-gray-600'>AGENDAMIENTO</h1>
        <DateTimeDisplay className="flex justify-between" />
      </div>
      <div className="p-5 m-4 h-full bg-white rounded-sm shadow-xl mt-0 border-t-3 border-[#FFD700]">
        <div className='flex flex-wrap h-full w-full justify-center items-center '>
          
          <section className='flex w-full h-2/10 border-b-2 border-gray-500 pb-4 shadow-xl'>
            <div className='flex items-center justify-center w-1/5'>
              <h2 className='text-4xl'>Usuario</h2>
            </div>
            <div className='flex flex-col items-center justify-center w-4/5 space-y-2 pr-4' >
              <input type="text" placeholder="Nombre" className='w-full border-b-1 border-gray-500 outline-none placeholder-gray-500 pl-1' />
              <input type="text" placeholder="C.C" className='w-full border-b-1 border-gray-500 outline-none placeholder-gray-500 pl-1' />
              <input type="text" placeholder="Número" className='w-full border-b-1 border-gray-500 outline-none placeholder-gray-500 pl-1' />
              <input type="email" placeholder="Email" className='w-full border-b-1 border-gray-500 outline-none placeholder-gray-500 pl-1' />
            </div>
          </section>

          <section className='flex w-full h-2/10 border-b-2 border-gray-500 shadow-xl'>
            <div className='flex items-center justify-center w-1/5'>
              <h2 className='text-4xl'>Vehículo</h2>
            </div>
            <div className='flex flex-col items-center justify-center w-4/5 space-y-2 pr-4'>
              <input type="text" placeholder="Placa" className='w-full border-b-1 border-gray-500 outline-none placeholder-gray-500 pl-1' />
              <input type="text" placeholder="Marca" className='w-full border-b-1 border-gray-500 outline-none placeholder-gray-500 pl-1' />
              <input type="text" placeholder="Modelo" className='w-full border-b-1 border-gray-500 outline-none placeholder-gray-500 pl-1' />
            </div>
          </section>

          <section className='flex w-full h-2/10 border-b-2 border-gray-500 shadow-xl '>
            <div className='flex items-center justify-center w-1/5 '>
              <h2 className='text-4xl'>Servicio</h2>
            </div>
            <div className='flex flex-col items-center justify-center w-4/5 p-3 pl-0 space-y-1 pr-4'>
              <textarea placeholder="Descripción del servicio" className='w-full h-3/5 border-1 rounded-sm border-gray-500 outline-none placeholder-gray-500 resize-none pl-1' rows="3"></textarea>
              <button className='h-2/5 w-full rounded-sm custom-button'>Agregar</button>
            </div>
          </section>

          <section className=' w-full flex flex-col justify-between items-center h-3/10 shadow-xl'>
            <div className='flex flex-col items-center justify-center w-full h-4/5 '>
              <p>Se mostrarán los servicios agregados</p>
              <ul>
                <li>Servicio 1</li>
                <li>Servicio 2</li>
                <li>Servicio 3</li>
              </ul>
            </div>
            
          </section>
          <section className=' h-1/10 flex justify-center items-center w-full'>
            <button className='w-full shadow-xl custom-button'>Agendar</button>
          </section>
          
        </div>
      </div> 
    </div>
  );
};

export default Schedule;