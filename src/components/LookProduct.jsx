import React, { useState, useEffect } from 'react';

const LookProduct = ({ addProduct }) => {
  const API_URL = import.meta.env.VITE_API_URL;
  const [products, setProducts] = useState([]);  // Estado para los productos
  const [categoryNames, setCategoryNames] = useState({}); // Estado para los nombres de las categorías
  const [units, setUnits] = useState({});
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

  const handleUnitChange = (productId, value) => {
    setUnits(prevState => ({ ...prevState, [productId]: value }));
    
    setProducts(prevProducts => 
      prevProducts.map(product => 
        product.id === productId ? { ...product, und: value } : product
      )
    );
  };

  if (products.length === 0) {
    return <div>No hay Productos disponibles.</div>;
  }

  const formatPrice = (price) => {
    return price.toLocaleString('es-CO');
  }

  return (
    <div className='flex flex-col w-full '>
      <div className="grid grid-cols-12 gap-4 font-bold p-1 border-b-1">
        <div className="col-span-2">Código</div>
        <div className="col-span-2">Nombre</div>
        <div className="col-span-2">Categoría</div>
        <div className="col-span-2">Precio</div>
        <div className='col-span-1'>Und</div>
      </div>
      {products.map((product) => (
        <div key={product.id} className="grid grid-cols-12 gap-4 p-1 border-t-1 justify-center items-center"> 
          <div className="col-span-2 ">{product.id}</div>
            <div className="col-span-2">{product.name}</div>
            <div className="col-span-2">{product.category_id}</div>
            <div className="col-span-2">$ {formatPrice(product.price)}</div>
            <div className="col-span-1">
              <input 
                type="number"
                value={units[product.id] || 0} 
                onChange={(e) => handleUnitChange(product.id, parseInt(e.target.value))}
                min="0"
                className="w-full text-center"
              />
            </div>         
          <div className="col-span-3 flex space-x-8 justify-center">
            <button 
              type='button' 
              className='rojo'
              onClick={() => addProduct(product)}
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