import React from 'react';
import {LoginForm} from '../components/LoginVal'; // Importamos el formulario con lógica

function LoginScreen() {
  return (
    <div className="login-screen flex justify-center items-center ">
      <div className="login-container max-w-sm mx-auto mt-10 p-6 border rounded-lg shadow-lg ">
        <h2 className="text-2xl font-semibold mb-4 text-center">Iniciar sesión</h2>
        <LoginForm /> 
      </div>
    </div>
  );
}

export default LoginScreen;
