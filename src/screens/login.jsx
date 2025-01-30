import React from 'react';
import {LoginForm} from '../components/LoginVal'; // Importamos el formulario con lógica

function LoginScreen() {
  return (
    <div className="login-screen flex justify-center items-center ">
      <div className="login-container max-w-sm mx-auto mt-10 p-6 border rounded-lg shadow-lg ">
        <h1 className=" font-semibold mb-4 text-center text-3xl">Iniciar sesión</h1>
        <LoginForm /> 
      </div>
    </div>
  );
}

export default LoginScreen;
