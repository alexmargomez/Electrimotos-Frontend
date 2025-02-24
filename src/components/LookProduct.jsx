import React, { useState, useEffect } from 'react';

const LookProduct = ({ addProduct }) => {
  const API_URL = import.meta.env.VITE_API_URL;
  const [products, setProducts] = useState([]);  // Estado para los productos
  const [categoryNames, setCategoryNames] = useState({}); // Estado para los nombres de las categorías
  const token = localStorage.getItem('authToken');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${API_URL}/products`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          }
        });
        const result = await response.json();
        setProducts(result);
        console.log(result);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };
    
    fetchProducts();
  }, [token]);

  const fetchCategoryName = async (categoryId) => {
    try {
      if (!categoryNames[categoryId]) {
        const response = await fetch(`${API_URL}/categories/${categoryId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          }
        });
        const result = await response.json();
        setCategoryNames(prevState => ({ ...prevState, [categoryId]: result.name }));
      }
    } catch (error) {
      console.error(`Error fetching category name for ID ${categoryId}:`, error);
    }
  };

  useEffect(() => {
    products.forEach(product => {
      fetchCategoryName(product.category_id);
    });
  }, [products]);

  if (products.length === 0) {
    return <div>No hay Productos disponibles.</div>;
  }

  return (
    <div className='flex flex-col gap-2 w-full '>
      {products.map((item) => (
        <div key={item.id} className='flex w-full border p-2 justify-between '>
          <div className='flex space-x-4'>
            <div>Nombre: {item.name}</div>
            <div>Precio: {item.price}</div>
            <div>Categoria: {categoryNames[item.category_id] || 'Cargando...'}</div>
          </div>
          <div>
            <button 
              type='button' 
              className='rojo'
              onClick={() => addProduct(item)}
            >
              Agregar
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default LookProduct;