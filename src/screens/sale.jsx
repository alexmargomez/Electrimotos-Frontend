import React from 'react'
import DateTimeDisplay from '../components/DateTimeDisplay';
import { useState } from 'react';

const Sale = () => {
  const [activeTab, setActiveTab] = React.useState('producto');

  const handleTabClick = (tab) => {
    setActiveTab(tab);  
  };

  return (
    <div className='h-screen w-full flex flex-col bg-gray-200'>
      <div className='m-4 mb-0 flex justify-between '>
        <h1 className='text-left font-bold text-gray-600'>FACTURAR</h1>
        <DateTimeDisplay className="flex justify-between"  />
      </div>
      <div className="p-5 m-4 h-full bg-white rounded-sm shadow-xl mt-0 border-t-3 border-[#FFD700] flex flex-wrap">

        <section className='h-3/11 w-full flex shadow-2xl mb-2 rounded-lg'> {/* datos de factura */}
          <div className='w-1/2 flex flex-col'>
            <h2 className='text-2xl h-1/4 pt-3 text-[#494A8A] font-bold'>Cliente</h2>
            <div className=' h-3/4 pl-10 pr-10 flex flex-col justify-center items-center pb-5'>
              <input type="text" placeholder="Nombre" className='w-full border-b-1 border-gray-500 outline-none placeholder-gray-500 pl-1' />
              <input type="text" placeholder="C.C" className='w-full border-b-1 border-gray-500 outline-none placeholder-gray-500 pl-1' />
              <input type="text" placeholder="Número" className='w-full border-b-1 border-gray-500 outline-none placeholder-gray-500 pl-1' />
              <input type="email" placeholder="Email" className='w-full border-b-1 border-gray-500 outline-none placeholder-gray-500 pl-1' />
            
            </div>
          </div>
          <div className='w-1/2'>
            <h2 className='text-2xl h-1/4 pt-3 text-[#494A8A] font-bold'>Vehiculo</h2>
            <div className=' h-3/4 pl-10 pr-10 flex flex-col justify-center items-center pb-5'>
              <input type="text" placeholder="Placa" className='w-full border-b-1 border-gray-500 outline-none placeholder-gray-500 pl-1' />
              <input type="text" placeholder="Marca" className='w-full border-b-1 border-gray-500 outline-none placeholder-gray-500 pl-1' />
              <input type="text" placeholder="Modelo" className='w-full border-b-1 border-gray-500 outline-none placeholder-gray-500 pl-1' />
            
            </div>
          </div>
        </section>

        <section className='flex justify-center items-center w-full h-7/11 space-x-2 '> {/*Busqueda de producto o servicio y factura*/}
          <div className='w-1/2 h-full border-2 border-[#494A8A] rounded-sm'> {/*Busqueda de producto o servicio*/}
            <div className='flex h-1/10 bg-[#494A8A] '> {/*Barra de busqueda*/}
              <div 
                className={' px-4 py-2 cursor-pointer w-1/2 flex justify-end items-center hover:bg-white text-white hover:text-[#494A8A] border-r-2 border-white hover:rounded-tl-sm'}  
                onClick={() => handleTabClick('producto')}
              >
                <h2 className=' text-2xl '>Productos</h2>
              </div>

              <div
                className={'px-4 py-2 cursor-pointer w-1/2 flex justify-between items-center hover:bg-white text-white hover:text-[#494A8A] hover:rounded-tr-sm'} 
                onClick={() => handleTabClick('servicio')}
              >
                <h2 className=' text-2xl'>Servicio</h2>
              </div>
              
            </div>
            <div className='p-4 h-9/10 w-full '> {/*Contenido de producto o servicio*/}
              {activeTab === 'producto' ? (
                <div className='flex flex-col space-y-2 w-full h-full'>
                  <div className='flex justify-center items-center h-1/7 w-full pr-6 pl-6'>
                    <input 
                      type="text"
                      placeholder='Buscar...'  
                      className=' focus:outline-none w-full border-b-1 border-gray-500 outline-none placeholder-gray-500'
                    />
                  </div>
                  <div className='p-2 flex items-start h-6/7 w-full rounded-sm shadow-sm'>
                    <div className='p-1 pr-3 pl-3 flex justify-between items-center w-full border-1 rounded-sm'>
                      <h3 className='text-2xl'>Productos</h3>
                      <div className='flex items-center space-x-2'>
                        <label htmlFor='unidades' className='text-lg'>Unidades:</label>
                        <input 
                          type='number' 
                          id='unidades' 
                          name='unidades' 
                          min='1' 
                          className='border-2 border-gray-300 rounded-md p-1 w-12 text-center'
                          placeholder='0'
                        />

                        <button className='rojo text-white rounded-md p-1'>Agregar</button>
                      </div>
                      
                    </div>
                  </div>
                </div>

              ) : (
                <div className='flex flex-col items-center justify-center space-y-5 h-full w-full'>
                  <textarea 
                    placeholder="Descripción del servicio" 
                    className='w-full h-5/6 border-1 rounded-sm border-gray-500 outline-none placeholder-gray-500 resize-none p-2' rows="3"
                  />       
                  <input 
                  type="text " 
                  placeholder="Valor"
                  className='w-full border-b-1 border-gray-500 outline-none placeholder-gray-500 pl-1'
                  />       
                  <div className=' bg-[#494A8A] h-1/6 w-full flex justify-center items-center rounded-md text-white text-2xl'>
                    Agregar
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className='w-1/2 h-full border-2 border-[#494A8A] rounded-sm'> {/*Factura*/}
            <div className='flex justify-center items-center h-1/10  space-x-10 bg-[#494A8A] '>
              <h2 className='text-white text-2xl'>Facturación</h2>
            </div>
            <div className='flex flex-col items-center justify-baseline p-4 space-y-2  h-9/10 w-full'>

            </div>
          </div>
          
        </section>

        <section className=' h-1/11 flex w-full pt-2 '> {/*Total y botones de facturar y cancelar*/}
          
          <div className='h-full w-1/2 flex justify-end items-center pr-6'>
            <h3 className='text-[#494A8A] text-5xl font-extrabold pr-3'>Total: </h3>
            <h3 className='text-[#494A8A] text-5xl font-extrabold'>$ 0</h3>
          </div>
          
          <div className=' bg-[#494A8A] h-full w-1/2 flex justify-center items-center rounded-md text-white text-2xl'>
            Facturar
          </div>
        </section>
        
      </div>
        
    </div>

  )
}

export default Sale