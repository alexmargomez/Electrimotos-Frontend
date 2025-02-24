import React, { useState } from 'react';
import DateTimeDisplay from '../components/DateTimeDisplay';

const Inventory = () => {
  const API_URL = import.meta.env.VITE_API_URL;
  const [view, setView] = useState('main'); // Estado para cambiar la vista
  const [products, setProducts] = useState([]); // Estado para los productos
  const token = localStorage.getItem('authToken');
  

  const renderContent = () => {
    const [name, setName] = useState('');  
    const [price, setPrice] = useState('');
    //const [quantity, setQuantity] = useState('');
    const [category_id, setCategory] = useState('');

    const addProduct = async (name, price, category_id) => {
      try {
        const productData = { name, price,  category_id };
        const response = await fetch(`${API_URL}/products`, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(productData),
        });
        if (response.ok) {
          const newProduct = await response.json();
          setProducts([...products, newProduct]);
          alert('Producto añadido correctamente');
          window.location.reload(); // Cambia la vista después de añadir el producto
        } else {
          console.error('Error al hacer la solicitud', response.statusText);
        }
      } catch (error) {
        console.error('Error al hacer la solicitud', error);
      }
    };
    const datesProducts = (event) => {
      event.preventDefault();
      if (name && price && category_id) {
        addProduct(name, price, category_id);  
      }else{
        console.log('Por favor, llena todos los campos');
      }

    };

    switch (view) {
      case 'create':
        return (
          <div className="p-4 ]">
            <h2 className="text-xl font-bold mb-4">Crear Producto</h2>
            <form onSubmit={datesProducts} className="space-y-4">
              <input 
                type="text" 
                value={name} 
                placeholder="Nombre del producto" 
                className="w-full p-2 border rounded" 
                onChange={(e) => setName(e.target.value)} 
              />
              <input 
                type="number" 
                value={price} 
                placeholder="Precio" 
                className="w-full p-2 border rounded"
                onChange={(e) => setPrice(e.target.value)}
              />
              {/*
              <input 
                type="number" 
                value={quantity} 
                placeholder="Cantidad" 
                className="w-full p-2 border rounded" 
                onChange={(e) => setQuantity(e.target.value)}
              />
              */}
              <input 
                type="number" 
                value={category_id} 
                placeholder="Categoria" 
                className="w-full p-2 border rounded"
                onChange={(e) => setCategory(e.target.value)} 
              />
              <button type="submit" className="rojo text-white px-4 py-2 rounded">Guardar</button>
            </form>
            <button onClick={() => setView('main')} className="mt-4 text-blue-600">Volver</button>
          </div>
        );
      case 'review':
        return (
          <div className="p-4">
            <h2 className="text-xl font-bold mb-4">Revisar Inventarios</h2>
            <ul>
              {products.length === 0 ? (
                <p>No hay productos registrados.</p>
              ) : (
                products.map((product, index) => (
                  <li key={index} className="p-2 border-b">{product}</li>
                ))
              )}
            </ul>
            <button onClick={() => setView('main')} className="mt-4 text-blue-600">Volver</button>
          </div>
        );
      default:
        return (
          <>
            <div className='w-full h-full flex flex-wrap justify-center items-center bg-white rounded-l-sm'>
              <div 
                className='p-4 bg-[#494A8A] rounded-sm text-white cursor-pointer hover:bg-[#FFD700] hover:text-[#494A8A]'
                onClick={() => setView('create')}
              >
                Crear producto
              </div>
            </div>
            <div className='w-full h-full flex flex-wrap justify-center items-center bg-[#494A8A] rounded-r-sm'>
              <div 
                className='text-[#494A8A] p-4 bg-white rounded-sm cursor-pointer hover:bg-[#FFD700]'
                onClick={() => setView('review')}
              >
                Revisar inventarios
              </div>
            </div>
          </>
        );
    }
  };

  return (
    <div className='h-screen w-full flex flex-col bg-gray-200'>
      <div className='m-4 mb-0 flex justify-between'>
        <h1 className='text-left font-bold text-gray-600'>INVENTARIO</h1>
        <DateTimeDisplay className="flex justify-between" />
      </div>
      <div className="m-4 h-full bg-white rounded-sm shadow-xl border-t-3 border-[#FFD700] flex">
        <div className='flex justify-center items-center w-full h-full'>
          {renderContent()}
        </div>
        
      </div>
      
    </div>
  );
};

export default Inventory;
