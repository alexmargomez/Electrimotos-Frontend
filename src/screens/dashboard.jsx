import { FaFileInvoiceDollar } from "react-icons/fa";
import { MdOutlineInventory } from "react-icons/md";
import { FaUsersViewfinder } from "react-icons/fa6";
import { MdShoppingCartCheckout } from "react-icons/md";
import { TbReportAnalytics } from "react-icons/tb";
import { PiMotorcycleFill } from "react-icons/pi";
import DateTimeDisplay from "../components/DateTimeDisplay";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();
  const blocks = [
    {
      bgColor: "#219ebc ",
      number: "3",
      name: "Ventas",
      icon: <FaFileInvoiceDollar />,
    },
    {
      bgColor: "#8ecae6 ",
      number: "0",
      name: "Productos",
      icon: <MdOutlineInventory />,
    },
    {
      bgColor: "#219ebc ",
      number: "1",
      name: "Clientes",
      icon: <FaUsersViewfinder />,
    },
    {
      bgColor: "#8ecae6 ",
      number: "2",
      name: "Vehiculos",
      icon: <PiMotorcycleFill />,
    },
    {
      bgColor: "#219ebc",
      number: "4",
      name: "Pendientes",
      icon: <MdShoppingCartCheckout />,
    },
    {
      bgColor: "#8ecae6 ",
      number: "5",
      name: "Movimientos",
      icon: <TbReportAnalytics />,
    },
  ];

  const handleOptionClick = (number) => {
    localStorage.setItem("number", number);
    navigate(`/look`);
  };

  return (
    <div className="h-screen w-full flex flex-col bg-gray-200">
      <div className="m-4 mb-0 flex justify-between ">
        <h1 className="text-left font-bold text-gray-600">
          ELECTRIMOTOS ZAPATOCA
        </h1>
        <DateTimeDisplay className="flex justify-between" />
      </div>
      <div className="grid grid-cols-3 grid-rows-2 gap-4 p-5 m-4 h-full bg-white rounded-sm shadow-xl mt-0 border-t-3 border-[#FFD700]">
        {blocks.map((block, index) => (
          <div
            key={index}
            style={{ backgroundColor: block.bgColor }}
            className={"flex flex-row items-center justify-center"}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = "#FFA500")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = block.bgColor)
            }
            onClick={() => handleOptionClick(block.number)}
          >
            {/* Primera mitad */}
            <div className="w-full flex flex-col items-center justify-center">
              <div className="text-3xl items-center justify-center text-white">
                {block.name}
              </div>
            </div>

            {/* Segunda mitad */}
            <div className="w-full flex items-center justify-center text-white">
              <div className="text-8xl">{block.icon}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
