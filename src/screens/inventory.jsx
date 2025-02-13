import React from 'react'
import DateTimeDisplay from '../components/DateTimeDisplay';

const Inventory = () => {
  return (
    <div className='h-screen w-full flex flex-col bg-gray-200'>
      <div className='m-4 mb-0 flex justify-between '>
        <h1 className='text-left font-bold text-gray-600'>INVENTARIO</h1>
        <DateTimeDisplay className="flex justify-between"  />
      </div>
      <div className="p-5 m-4 h-full bg-white rounded-sm shadow-xl mt-0 border-t-3 border-[#FFD700]">


      </div>
        
    </div>
  )
}

export default Inventory