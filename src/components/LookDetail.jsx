import React, { useState, useEffect } from "react";
import FactuView from "./FactuView";
import Modalmini from "./Modalmini";
import ReportCustomer from "./ReportCustomer";
import ReportVehicle from "./ReportVehicle";

const LookDetail = ({ selectedOption, searchTerm, setNumber }) => {
  const API_URL = import.meta.env.VITE_API_URL;
  const [data, setData] = useState([]); // Estado para los clientes
  const [customerName, setCustomerName] = useState({});
  const [invoiceNumber, setInvoiceNumber] = useState({});
  const [loading, setLoading] = useState(true); // Estado para manejar la carga de datos
  const [error, setError] = useState(null); // Estado para manejar errores
  const token = localStorage.getItem("authToken");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [productUpdate, setProductUpdate] = useState({
    id: "",
    name: "",
    price: "",
  });
  const [customerUpdate, setCustomerUpdate] = useState({
    id: "",
    name: "",
    phone: "",
    email: "",
  });
  const [vehicleUpdate, setVehicleUpdate] = useState({
    id: "",
    plate: "",
    make: "",
    model: "",
  });
  const filteredData = data.filter((item) => {
    switch (selectedOption) {
      case "Productos":
        return item.name?.toLowerCase().includes(searchTerm.toLowerCase());
      case "Clientes":
        return item.name?.toLowerCase().includes(searchTerm.toLowerCase());
      case "Vehiculos":
        return (
          item.plate?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.make?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.model?.toLowerCase().includes(searchTerm.toLowerCase())
        );
      case "Ventas":
        return customerName[item.customer_id]
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase());
      case "Pendientes":
        return (
          item.customer_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.vehicle_id?.toLowerCase().includes(searchTerm.toLowerCase())
        );
      default:
        return true;
    }
  });
  const fetchData = async () => {
    setLoading(true);
    try {
      let endpoint = "";

      // Determinar la API según la opción seleccionada
      switch (selectedOption) {
        case "Productos":
          endpoint = "products";
          setNumber(0);
          break;
        case "Clientes":
          endpoint = "customers";
          setNumber(1);
          break;
        case "Vehiculos":
          endpoint = "vehicles";
          setNumber(2);
          break;
        case "Ventas":
          endpoint = "sales";
          setNumber(3);
          break;
        case "Pendientes":
          endpoint = "schedules";
          setNumber(4);
          break;
        case "Movimientos":
          endpoint = "inventory-movements";
          setNumber(5);
          break;

        default:
          throw new Error(`Opción no válida: ${selectedOption}`);
      }

      const response = await fetch(`${API_URL}/${endpoint}/`, {
        headers: {
          Authorization: `Bearer ${token}`, // Corregido 'Authorization'
        },
      });

      if (!response.ok) {
        throw new Error(
          `Error al obtener los ${selectedOption.toLowerCase()}: ${
            response.statusText
          }`
        );
      }

      const result = await response.json(); // Convierte la respuesta en JSON
      if (selectedOption === "Pendientes") {
        const updatedResult = await Promise.all(
          result
            .filter((item) => item.state === "Pendiente")
            .map(async (item) => {
              try {
                const serviciosArray = JSON.parse(item.servicios);
                const responseCustomer = await fetch(
                  `${API_URL}/customers/${item.customer_id}`,
                  {
                    headers: {
                      Authorization: `Bearer ${token}`,
                    },
                  }
                );
                const responseVehicle = await fetch(
                  `${API_URL}/vehicles/${item.vehicle_id}`,
                  {
                    headers: {
                      Authorization: `Bearer ${token}`,
                    },
                  }
                );
                const resultVehicle = await responseVehicle.json();
                const customerPlate = resultVehicle.plate;
                const resultCustomer = await responseCustomer.json();
                const CustomerName = resultCustomer.name;
                if (Array.isArray(serviciosArray)) {
                  return {
                    ...item,
                    servicios: serviciosArray,
                    customer_id: CustomerName,
                    vehicle_id: customerPlate,
                  };
                } else {
                  console.error("Servicios no es un array:", item.servicios);
                  return item;
                }
              } catch (e) {
                console.error("Error al parsear servicios:", item.servicios, e);
                return item;
              }
            })
        );
        setData(updatedResult);
      } else {
        setData(result);
      }
      console.log(result);
      if (selectedOption === "Ventas") {
        const customerNames = {};
        const invoiceNumbers = {};
        await Promise.all(
          result.map(async (item) => {
            if (!invoiceNumbers[item.id]) {
              const response = await fetch(`${API_URL}/invoices/${item.id}/`, {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              });
              const resultInvoice = await response.json();
              invoiceNumbers[item.id] = resultInvoice[0].invoice_number;
            }

            if (!customerNames[item.customer_id]) {
              const response = await fetch(
                `${API_URL}/customers/${item.customer_id}/`,
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                }
              );
              const resultCustomer = await response.json();
              customerNames[item.customer_id] = resultCustomer.name;
            }
          })
        );
        setCustomerName(customerNames);
        setInvoiceNumber(invoiceNumbers);
      }
    } catch (error) {
      console.error(
        `Error al obtener los ${selectedOption.toLowerCase()}:`,
        error
      );
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchData();
  }, [selectedOption, token]); // Añadido 'token' al array de dependencias de useEffect

  const handleDelete = async (id) => {
    try {
      let endpoint = "";

      switch (selectedOption) {
        case "Productos":
          endpoint = "products";
          break;
        case "Clientes":
          endpoint = "customers";
          break;
        case "Vehiculos":
          endpoint = "vehicles";
          break;
        case "Ventas":
          endpoint = "sales";
          break;
        case "Pendientes":
          endpoint = "schedules";
          break;
        default:
          throw new Error(`Opción no válida: ${selectedOption}`);
      }

      const response = await fetch(`${API_URL}/${endpoint}/${id}/`, {
        method: "DELETE",
        headers: {
          // Corregido 'Authorization'
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        // Eliminar el elemento del estado
        setData(data.filter((item) => item.id !== id));
        console.log(`${selectedOption} eliminado con éxito`);
      } else {
        throw new Error(
          `Error al eliminar ${selectedOption.toLowerCase()}: ${
            response.status
          }`
        );
      }
    } catch (error) {
      console.error(`Error al eliminar el elemento:`, error);
      setError(error.message);
    }
  };

  const openModal = (item) => {
    setProductUpdate(item);
    setCustomerUpdate(item);
    setVehicleUpdate(item);
    setIsModalOpen(true);
  };
  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleChangeProduct = (e) => {
    const { name, value } = e.target;
    setProductUpdate((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleChangeCustomer = (e) => {
    const { name, value } = e.target;
    setCustomerUpdate((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleChangeVehicle = (e) => {
    const { name, value } = e.target;
    setVehicleUpdate((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSaveProduct = async () => {
    const response = await fetch(`${API_URL}/products/${productUpdate.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(productUpdate),
    });

    if (response.ok) {
      // Handle successful update here, e.g., refresh the data or update the state
      closeModal();
      await fetchData();
    } else {
      // Handle error here
      console.error("Failed to update product");
    }
  };
  const handleSaveCustomer = async () => {
    const response = await fetch(`${API_URL}/customers/${customerUpdate.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(customerUpdate),
    });

    if (response.ok) {
      // Handle successful update here, e.g., refresh the data or update the state
      closeModal();
      await fetchData();
    } else {
      // Handle error here
      console.error("Failed to update customer");
    }
  };
  const handleSaveVehicle = async () => {
    const response = await fetch(`${API_URL}/vehicles/${vehicleUpdate.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(vehicleUpdate),
    });

    if (response.ok) {
      // Handle successful update here, e.g., refresh the data or update the state
      closeModal();
      await fetchData();
    } else {
      // Handle error here
      console.error("Failed to update customer");
    }
  };

  if (loading) {
    return <div>Cargando {selectedOption}...</div>;
  }

  // Si hay un error, muestra un mensaje de error
  if (error) {
    return <div>Error: {error}</div>;
  }

  // Si no hay datos, muestra un mensaje
  if (data.length === 0) {
    return <div>No hay {selectedOption.toLowerCase()} disponibles.</div>;
  }

  const formatPrice = (price) => {
    if (price == null || isNaN(price)) {
      return "N/A";
    }
    return price.toLocaleString("es-CO");
  };

  const formatDateTime = (dateTime) => {
    const date = new Date(dateTime);
    return isNaN(date) ? "Fecha inválida" : date.toLocaleDateString("es-CO");
  };

  // Renderizado para Productos
  if (selectedOption === "Productos") {
    return (
      <div className="flex flex-col w-full">
        <div className="grid grid-cols-10 gap-4 font-bold p-1 border-b-1">
          <div className="col-span-2">Código</div>
          <div className="col-span-2">Nombre</div>
          <div className="col-span-2">Precio</div>
          <div className="col-span-1">Stock</div>
          <div className="col-span-3">Acciones</div>
        </div>
        {filteredData.map((item) => (
          <div
            key={item.id}
            className="grid grid-cols-10 gap-4 p-1 border-t-1 justify-center items-center"
          >
            <div className="col-span-2">{item.id}</div>
            <div className="col-span-2">{item.name}</div>
            <div className="col-span-2">{`$ ${formatPrice(item.price)}`}</div>
            <div className="col-span-1">{item.stock}</div>
            <div className="col-span-3 flex space-x-5 justify-center">
              <button
                type="button"
                className="rojo"
                onClick={() => handleDelete(item.id)}
              >
                Eliminar
              </button>
              <button
                type="button"
                onClick={() => openModal(item)}
                className="blue"
              >
                Modificar
              </button>
              <Modalmini show={isModalOpen} onClose={closeModal}>
                <div className="flex flex-col justify-center items-center h-full w-full ">
                  <div className="font-bold text-2xl justify-center items-center flex flex-col h-1/10">
                    <h1>MODIFICAR PRODUCTO</h1>
                    <h2>{productUpdate.name}</h2>
                  </div>
                  <div className="flex flex-col justify-center items-center h-8/10 space-y-5 w-full">
                    <div className="flex w-full">
                      <label className="font-bold text-xl bg-[#023047] text-white rounded-l-sm w-1/2">
                        Nombre:
                      </label>
                      <input
                        type="text"
                        name="name"
                        placeholder="Nuevo nombre"
                        onChange={handleChangeProduct}
                        className="border-1 shadow-xl rounded-r-sm border-[#023047] text-center w-1/2"
                      />
                    </div>

                    <div className="flex w-full">
                      <label className="font-bold text-xl bg-[#023047] text-white rounded-l-sm w-1/2">
                        Precio:
                      </label>
                      <input
                        type="number"
                        name="price"
                        placeholder="Nuevo Precio"
                        onChange={handleChangeProduct}
                        className="border-1 shadow-xl rounded-r-sm border-[#023047] text-center w-1/2"
                      />
                    </div>
                    <div className="flex w-full">
                      <label className="font-bold text-xl bg-[#023047] text-white rounded-l-sm w-1/2">
                        Stock:
                      </label>
                      <input
                        type="number"
                        placeholder="Modificar Stock"
                        className="border-1 shadow-xl rounded-r-sm border-[#023047] text-center w-1/2"
                      />
                    </div>
                  </div>
                  <div className="h-1/10 flex justify-center items-center space-x-2">
                    <button
                      type="button"
                      className="blue hover:celest"
                      onClick={handleSaveProduct}
                    >
                      Guardar
                    </button>
                    <button className="rojo " onClick={closeModal}>
                      Salir
                    </button>
                  </div>
                </div>
              </Modalmini>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Renderizado para Clientes
  if (selectedOption === "Clientes") {
    return (
      <div className="flex flex-col w-full">
        <div className="grid grid-cols-13 gap-4 font-bold p-1 border-b-1">
          <div className="col-span-1">Vista</div>
          <div className="col-span-2">Identificación</div>
          <div className="col-span-3">Nombre</div>
          <div className="col-span-2">Teléfono</div>
          <div className="col-span-2">Email</div>
          <div className="col-span-3">Acciones</div>
        </div>
        {filteredData.map((item) => (
          <div
            key={item.id}
            className="grid grid-cols-13 gap-4 p-1 border-t-1 justify-center items-center"
          >
            <div className="col-span-1 flex justify-center items-center space-x-5 ">
              <div className="flex justify-center items-center ">
                <ReportCustomer
                  id={item.id}
                  name={item.name}
                  phone={item.phone}
                  email={item.email}
                />
              </div>
            </div>
            <div className="col-span-2">{item.id}</div>
            <div className="col-span-3">{item.name}</div>
            <div className="col-span-2">{item.phone}</div>
            <div className="col-span-2">{item.email}</div>
            <div className="col-span-3 flex space-x-5 justify-center">
              <button
                type="button"
                className="rojo"
                onClick={() => handleDelete(item.id)}
              >
                Eliminar
              </button>
              <button
                type="button"
                onClick={() => openModal(item)}
                className="blue"
              >
                Modificar
              </button>
              <Modalmini show={isModalOpen} onClose={closeModal}>
                <div className="flex flex-col justify-center items-center h-full w-full ">
                  <div className="font-bold text-2xl justify-center items-center flex flex-col h-1/10">
                    <h1>MODIFICAR CLIENTE</h1>
                    <h2>c.c. {customerUpdate.id}</h2>
                  </div>
                  <div className="flex flex-col justify-center items-center h-8/10 space-y-5 w-full">
                    <div className="flex w-full">
                      <label className="font-bold text-xl bg-[#023047] text-white rounded-l-sm w-1/2">
                        Nombre:
                      </label>
                      <input
                        type="text"
                        name="name"
                        placeholder="Nuevo nombre"
                        onChange={handleChangeCustomer}
                        className="border-1 shadow-xl rounded-r-sm border-[#023047] text-center w-1/2"
                      />
                    </div>

                    <div className="flex w-full">
                      <label className="font-bold text-xl bg-[#023047] text-white rounded-l-sm w-1/2">
                        Telefono:
                      </label>
                      <input
                        type="text"
                        name="phone"
                        placeholder="Nuevo telefono"
                        onChange={handleChangeCustomer}
                        className="border-1 shadow-xl rounded-r-sm border-[#023047] text-center w-1/2"
                      />
                    </div>
                    <div className="flex w-full">
                      <label className="font-bold text-xl bg-[#023047] text-white rounded-l-sm w-1/2">
                        Email:
                      </label>
                      <input
                        type="email"
                        name="email"
                        placeholder="Nuevo email"
                        onChange={handleChangeCustomer}
                        className="border-1 shadow-xl rounded-r-sm border-[#023047] text-center w-1/2"
                      />
                    </div>
                  </div>
                  <div className="h-1/10 flex justify-center items-center space-x-2">
                    <button
                      type="button"
                      className="blue hover:celest"
                      onClick={handleSaveCustomer}
                    >
                      Guardar
                    </button>
                    <button className="rojo" onClick={closeModal}>
                      Salir
                    </button>
                  </div>
                </div>
              </Modalmini>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Renderizado para Vehiculos
  if (selectedOption === "Vehiculos") {
    return (
      <div className="flex flex-col w-full">
        <div className="grid grid-cols-11 gap-4 font-bold p-1 border-b-1">
          <div className="col-span-1">Vista</div>
          <div className="col-span-2">Placa</div>
          <div className="col-span-3">Marca</div>
          <div className="col-span-2">Modelo</div>
          <div className="col-span-3">Acciones</div>
        </div>
        {filteredData.map((item) => (
          <div
            key={item.id}
            className="grid grid-cols-11 gap-4 p-1 border-t-1 justify-center items-center"
          >
            <div className="col-span-1 flex justify-center items-center space-x-5">
              <div className="flex justify-center items-center ">
                <ReportVehicle
                  id={item.id}
                  plate={item.plate}
                  make={item.make}
                  model={item.model}
                  idCustomer={item.customer_id}
                />
              </div>
            </div>
            <div className="col-span-2">{item.plate}</div>
            <div className="col-span-3">{item.make}</div>
            <div className="col-span-2">{item.model}</div>
            <div className="col-span-3 flex space-x-5 justify-center">
              <button
                type="button"
                className="rojo"
                onClick={() => handleDelete(item.id)}
              >
                Eliminar
              </button>
              <button
                type="button"
                onClick={() => openModal(item)}
                className="blue"
              >
                Modificar
              </button>
              <Modalmini show={isModalOpen} onClose={closeModal}>
                <div className="flex flex-col justify-center items-center h-full w-full ">
                  <div className="font-bold text-2xl justify-center items-center flex flex-col h-1/10">
                    <h1>MODIFICAR VEHICULO</h1>
                  </div>
                  <div className="flex flex-col justify-center items-center h-8/10 space-y-5 w-full">
                    <div className="flex w-full">
                      <label className="font-bold text-xl bg-[#023047] text-white rounded-l-sm w-1/2">
                        Placa:
                      </label>
                      <input
                        type="text"
                        name="plate"
                        placeholder="Nueva placa"
                        onChange={handleChangeVehicle}
                        className="border-1 shadow-xl rounded-r-sm border-[#023047] text-center w-1/2"
                      />
                    </div>

                    <div className="flex w-full">
                      <label className="font-bold text-xl bg-[#023047] text-white rounded-l-sm w-1/2">
                        Modelo:
                      </label>
                      <input
                        type="text"
                        name="model"
                        placeholder="Nuevo modelo"
                        onChange={handleChangeVehicle}
                        className="border-1 shadow-xl rounded-r-sm border-[#023047] text-center w-1/2"
                      />
                    </div>
                    <div className="flex w-full">
                      <label className="font-bold text-xl bg-[#023047] text-white rounded-l-sm w-1/2">
                        Marca:
                      </label>
                      <input
                        type="text"
                        name="make"
                        placeholder="Nueva marca"
                        onChange={handleChangeVehicle}
                        className="border-1 shadow-xl rounded-r-sm border-[#023047] text-center w-1/2"
                      />
                    </div>
                  </div>
                  <div className="h-1/10 flex justify-center items-center space-x-2">
                    <button
                      type="button"
                      className="blue hover:celest"
                      onClick={handleSaveVehicle}
                    >
                      Guardar
                    </button>
                    <button className="rojo " onClick={closeModal}>
                      Salir
                    </button>
                  </div>
                </div>
              </Modalmini>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Renderizado para Ventas
  if (selectedOption === "Ventas") {
    return (
      <div className="flex flex-col w-full">
        <div className="grid grid-cols-12 gap-4 font-bold p-1 border-b-1">
          <div className="col-span-3 ">Factura</div>
          <div className="col-span-3">Cliente</div>
          <div className="col-span-2">Fecha</div>
          <div className="col-span-1">Total</div>
          <div className="col-span-3">Acciones</div>
        </div>
        {filteredData.map((item) => (
          <div
            key={item.id}
            className="grid grid-cols-12 gap-4 p-1 border-t-1 justify-center items-center"
          >
            <div className="col-span-3 cursor-pointer ">
              <FactuView
                id={item.id}
                customerID={item.customer_id}
                vehicleID={item.vehicle_id}
                total={item.total}
              />
            </div>
            <div className="col-span-3 ">{customerName[item.customer_id]}</div>
            <div className="col-span-2 ">{formatDateTime(item.created_at)}</div>
            <div className="col-span-1">{`$ ${formatPrice(item.total)}`}</div>
            <div className="col-span-3 flex space-x-5 justify-center">
              <button
                type="button"
                className="rojo"
                onClick={() => handleDelete(item.id)}
              >
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Renderizado para Movimientos de Inventario
  if (selectedOption === "Pendientes") {
    return (
      <div className="flex flex-col w-full">
        <div className="grid grid-cols-10 gap-4 font-bold p-1 border-b-1">
          <div className="col-span-1">Fecha</div>
          <div className="col-span-3">Cliente</div>
          <div className="col-span-1">vehiculo</div>
          <div className="col-span-3">Servicios</div>
          <div className="col-span-2">Acciones</div>
        </div>
        {filteredData.map((item) => (
          <div
            key={item.id}
            className="grid grid-cols-10 gap-4 p-1 border-t-1 justify-center items-center"
          >
            <div className="col-span-1 flex justify-center items-center space-x-5">
              <div>{formatDateTime(item.created_at)}</div>
            </div>
            <div className="col-span-3">{item.customer_id}</div>
            <div className="col-span-1">{item.vehicle_id}</div>
            <div className="col-span-3">
              {Array.isArray(item.servicios)
                ? item.servicios.map((servicio, index) => (
                    <div
                      key={index}
                      className="flex flex-col space-y-1 border-b-1 border-gray-300"
                    >
                      {servicio}
                    </div>
                  ))
                : `N/A`}
            </div>
            <div className="col-span-2 flex space-x-5 justify-center">
              <button
                type="button"
                className="rojo"
                onClick={() => handleDelete(item.id)}
              >
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>
    );
  }
  if (selectedOption === "Movimientos") {
    <div className="flex flex-col w-full"></div>;
  }
  // Renderizado por defecto
  return <div>No hay datos disponibles.</div>;
};

export default LookDetail;
