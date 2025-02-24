import React from 'react';
import {LoginForm} from '../components/LoginVal'; // Importamos el formulario con lógica

function LoginScreen() {
  return (
    <div className=" flex justify-center items-center h-screen w-full">
      <div className="w-1/2 h-full flex flex-col items-center justify-center ">
        <h1 className=" font-semibold mb-4 text-center text-5xl">Iniciar sesión</h1>
        <LoginForm className="h-full w-full "/> 
      </div>
      <div className=' w-1/2 h-full bg-[#494A8A]'> 

      </div>
    </div>
  );
}

export default LoginScreen;
