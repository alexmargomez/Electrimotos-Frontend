import React, { useEffect, useState } from 'react';
import DateTimeDisplay from '../components/DateTimeDisplay';

const Inventory = () => {
  const API_URL = import.meta.env.VITE_API_URL; // Estado para cambiar la vista
  const [products, setProducts] = useState([]); // Estado para los productos
  const token = localStorage.getItem('authToken');
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [category_id, setCategory] = useState('');
  const [stock , setStock] = useState('');

  const fetchProducts = async () => {
    try {
      const response = await fetch(`${API_URL}/products`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });
      const resultproducts = await response.json();

      if (!response.ok) {
        throw new Error(`Error fetching products: ${response.statusText}`);
      }
      setProducts(resultproducts);
      console.log('Productos:', resultproducts);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  }

  const addProduct = async (name, price,  stock) => {
    try {
      const productData = { name, price };
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

        const inventoryData = {stock, product_id: newProduct.id};
        const inventoryResponse = await fetch(`${API_URL}/inventory`, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(inventoryData),
        });
        if (!inventoryResponse.ok) {
          console.error('Error al hacer la solicitud', inventoryResponse.statusText);
        }
        alert('Producto añadido correctamente');
        fetchProducts();
         // limpiar datos de los inputs
        setName('');
        setPrice('');
        setStock('');
      } else {
        console.error('Error al hacer la solicitud', response.statusText);
      }
    } catch (error) {
      console.error('Error al hacer la solicitud', error);
    }
  };

  const handleAddProducts = (event) => {
    event.preventDefault();
    if (name && price  && stock) {
      addProduct(name, price, stock);  
    }else{
      console.log('Por favor, llena todos los campos');
    }

  }

  useEffect(() => {  
    fetchProducts();
  }, [token]);
  
  const Add = async (productId) => {
    try {
      const response = await fetch(`${API_URL}/inventory/${productId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });
      if (!response.ok) {
        throw new Error(`Error fetching inventory: ${response.statusText}`);
      }
      const data = await response.json();
      const currentStock = data.stock;

      const updateResponse = await fetch(`${API_URL}/inventory/${productId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({stock: currentStock + 1}),
      });
      if (updateResponse.ok) {
        fetchProducts();
      }
    } catch (error) {
      console.error('Error fetching inventory:', error);
    } 
  }

  const Remove = async (productId) => {
    try {
      const response = await fetch(`${API_URL}/inventory/${productId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });
      if (!response.ok) {
        throw new Error(`Error fetching inventory: ${response.statusText}`);
      }
      const data = await response.json();
      const currentStock = data.stock;

      const updateResponse = await fetch(`${API_URL}/inventory/${productId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({stock: currentStock - 1}),
      });
      if (updateResponse.ok) {
        fetchProducts();
      }
    } catch (error) {
      console.error('Error fetching inventory:', error);
    }
  }

  const formatPrice = (price) => {
    return price.toLocaleString('es-CO');
  }

  return (
    <div className='h-screen w-full flex flex-col bg-gray-200'>
      <div className='m-4 mb-0 flex justify-between'>
        <h1 className='text-left font-bold text-gray-600'>INVENTARIO</h1>
        <DateTimeDisplay className="flex justify-between" />
      </div>
      <div className="m-4 h-full bg-white rounded-sm shadow-xl border-t-3 border-[#FFD700] flex">
        <div className='flex flex-col w-full h-full'>
          <section className="p-4 h-20% shadow-xl">
            <h2 className="text-xl font-bold pb-4">Crear Producto</h2>
            <form onSubmit={handleAddProducts} className="space-x-4 flex">
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
              <input 
                type="number" 
                value={stock} 
                placeholder="Cantidad" 
                className="w-full p-2 border rounded" 
                onChange={(e) => setStock(e.target.value)}
              />
              <button type="submit" className="blue text-white px-4 py-2 rounded">Guardar</button>
            </form>
          </section>
            
          <section className="p-4 h-full  overflow-auto">
            <h2 className="text-xl font-bold mb-4">Busqueda...</h2>
            <div className="grid grid-cols-10 gap-4 font-bold p-2 border-b-2">
              <div className="col-span-1">Código</div>
              <div className="col-span-3">Nombre del producto</div>
              <div className="col-span-2">Precio</div>
              <div className='col-span-1'>Stock</div>
              <div className="col-span-3 text-center">Modificar Stock</div>
            </div>
            <div>
              {products.length === 0 ? (
                <p>No hay productos registrados.</p>
              ) : (
                products.map((product) => (
                  <div key={product.id} className="grid grid-cols-10 gap-4 p-2 border-t-1 justify-center items-center">
                    <div className="col-span-1">{product.id}</div>
                    <div className="col-span-3">{product.name}</div>
                    <div className="col-span-2">$ {formatPrice(product.price)}</div>
                    <div className="col-span-1">{product.stock || 0}</div>
                    <div className="col-span-3 flex space-x-8 justify-center">
                      <button 
                        className="rojo text-white px-4 py-2 rounded"
                        onClick={() => Add(product.id)}
                      >
                        Agregar
                      </button>
                      <button 
                        className="rojo text-white px-4 py-2 rounded"
                        onClick={() => Remove(product.id)}
                      >
                        Quitar
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>
        </div>
      </div> 
    </div>
  );
};

export default Inventory;
