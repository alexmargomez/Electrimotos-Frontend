import React from 'react';
import {LoginForm} from '../components/LoginVal'; // Importamos el formulario con lógica
import Factupos from '../assets/factupos.svg'; // Importamos la imagen de Factupos
import Electrimotos from '../assets/electrimotos.svg'; // Importamos la imagen de Electrimotos
function LoginScreen() {
  return (
    <div className=" h-screen w-full bg-[#494A8A]">
      <main className='flex justify-center items-center h-19/20 w-full'>
        <div className="w-1/2 h-full flex flex-col items-center justify-center ">
          <div className='relative w-3/4 h-3/4 bg-white flex flex-col items-center justify-center shadow-xl rounded-lg'>
            <div className="absolute -top-20 w-40 h-40  text-white flex items-center justify-center rounded-full text-2xl font-bold">
              <img src={Factupos} alt="Factupos Icon"/>
            </div>
            <h1 className=" font-semibold mb-4 text-center text-5xl">Iniciar sesión</h1>
            <LoginForm className="h-full w-full  "/> 
          </div>
          
        </div>
        <div className=' w-1/2 h-full flex flex-col items-center justify-center'> 
          <div>
            <img src={Electrimotos} alt="Electrimotos Icon"/>
          </div>
        </div>
      </main>
      <footer className='h-1/20'>
        <p className="text-white text-center">© 2025 Alexmar Gómez Software. Todos los derechos reservados. | Plataforma de facturación POS - FACTUPOS.</p>
      </footer>
    </div>
  );
}

export default LoginScreen;
