import React from 'react';
import DateTimeDisplay from '../components/DateTimeDisplay';

const Schedule = () => {

  const [services, setServices] = React.useState([]); // Estado para los servicios
  const [serviceInput, setServiceInput] = React.useState(''); // Estado para el input de servicio


  const addService = () => {
    if (serviceInput.trim() !== '') {
      setServices([...services, serviceInput]);
      setServiceInput('');
    }
  }

  const removeService = (index) => {
    setServices(services.filter((service, i) => i !== index));
  }

  return (
    <div className='h-screen w-full flex flex-col bg-gray-200'>
      <div className='m-4 mb-0 flex justify-between '>
        <h1 className='text-left font-bold text-gray-600'>AGENDAMIENTO</h1>
        <DateTimeDisplay className="flex justify-between" />
      </div>
      <div className="p-5 m-4 h-full bg-white rounded-sm shadow-xl mt-0 border-t-3 border-[#FFD700]">
        <div className='flex flex-wrap h-full w-full justify-center items-center '>

          <section className='h-3/11 w-full flex  shadow-2xl mb-2 rounded-lg'> {/* datos de factura */}
            <div className='w-1/2 flex flex-col'>
              <h2 className='text-2xl h-1/4 p-3 text-[#494A8A] font-bold'>Cliente</h2>
              <div className=' h-3/4 pl-10 pr-10 flex flex-col justify-center items-center pb-5'>
                <input type="text" placeholder="Nombre" className='w-full border-b-1 border-gray-500 outline-none placeholder-gray-500 pl-1' />
                <input type="text" placeholder="C.C" className='w-full border-b-1 border-gray-500 outline-none placeholder-gray-500 pl-1' />
                <input type="text" placeholder="Número" className='w-full border-b-1 border-gray-500 outline-none placeholder-gray-500 pl-1' />
                <input type="email" placeholder="Email" className='w-full border-b-1 border-gray-500 outline-none placeholder-gray-500 pl-1' />
              
              </div>
            </div>
            <div className='w-1/2'>
              <h2 className='text-2xl h-1/4 p-3 text-[#494A8A] font-bold'>Vehiculo</h2>
              <div className=' h-3/4 pl-10 pr-10 flex flex-col justify-center items-center pb-5'>
                <input type="text" placeholder="Placa" className='w-full border-b-1 border-gray-500 outline-none placeholder-gray-500 pl-1' />
                <input type="text" placeholder="Marca" className='w-full border-b-1 border-gray-500 outline-none placeholder-gray-500 pl-1' />
                <input type="text" placeholder="Modelo" className='w-full border-b-1 border-gray-500 outline-none placeholder-gray-500 pl-1' />
              
              </div>
            </div>
          </section>

        {/*Servicio*/} 
          <section className='flex w-full h-7/11 space-x-2'> 
            <div className=' flex flex-col justify-center items-center w-1/2 h-full border-2 border-[#494A8A] rounded-sm'>
              <div className=' flex h-1/10  space-x-10 bg-[#494A8A] w-full justify-center items-center'>
                <h2 className='text-white text-2xl'>Servicios</h2>
              </div>

              <div className='flex flex-col items-center justify-center p-4 space-y-5  h-9/10 w-full'>
                <textarea 
                  placeholder="Descripción del servicio" 
                  className='w-full h-5/6 border-1 rounded-sm border-gray-500 outline-none placeholder-gray-500 resize-none p-2' rows="3"
                  value={serviceInput}
                  onChange={(e) => setServiceInput(e.target.value)}
                />  
                <div 
                  className='cursor-pointer bg-[#494A8A] h-1/6 w-full flex justify-center items-center rounded-md text-white text-2xl'
                  onClick={addService}
                >
                  Agregar
                </div>
              </div>
            </div>
           
            <div className='w-1/2 h-full border-2 border-[#494A8A] rounded-sm'>
              <div className='flex h-1/10 bg-[#494A8A] justify-center items-center'>
                <h2 className='text-white text-2xl'>Servicios Agregados</h2>
              </div>
              <div className='flex flex-col flex-grow h-9/10 overflow-hidden'>
                <div className='flex flex-col items-center justify-start p-4 space-y-2 h-full w-full overflow-y-auto max-h-[400px]'>
                  {services.map((service, index) => (
                    <div key={index} className='p-1 pr-3 pl-3 flex justify-between items-center w-full border-1 rounded-sm '>
                      <h3 className='text-2xl'>{service}</h3>
                      <button className='rojo text-white rounded-md p-1' onClick={() => removeService(index)}>Eliminar</button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>


          {/* Agendar */}
          <section className="w-full pt-2">
            <div className="bg-[#494A8A] h-12 w-full flex justify-center items-center rounded-md text-white text-2xl cursor-pointer">
              Agendar
            </div>
          </section>

        </div>
      </div>
    </div>
  );
};

export default Schedule;