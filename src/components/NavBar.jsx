import React from 'react'
import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { AiFillProduct } from "react-icons/ai";
import { FaUsersRays } from "react-icons/fa6";
import { PiMotorcycleFill } from "react-icons/pi";
import { HiDocumentReport } from "react-icons/hi";
import { HiOutlineDocumentMagnifyingGlass } from "react-icons/hi2";
import { FaDoorClosed, FaDoorOpen } from "react-icons/fa";
import { Logout } from './LoginVal';
import { MdDashboard, MdOutlineDashboard, MdOutlinePointOfSale } from "react-icons/md";
import { HiOutlineClipboardDocumentList } from "react-icons/hi2";



const NavBar = () => {
  const [isDashboardOpen, setIsDashboardOpen] = useState(false);
  const [isLookOpen, setIsLookOpen] = useState(false);
  const [isSalesOpen, setIsSalesOpen] = useState(false);
  const [isInventoryOpen, setIsInventoryOpen] = useState(false);
  const [isClientsOpen, setIsClientsOpen] = useState(false);
  const [isVehiclesOpen, setIsVehiclesOpen] = useState(false);
  const [isReportsOpen, setIsReportsOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const handleLogout = Logout(navigate) 
  
  const handleClick = () => {
    navigate('/dashboard');
  };
  const handleClick2 = () => {
    navigate('/look');
  };

  

  return (
    <div className="bg-[#494A8A]  h-screen w-1/17 flex flex-col">
        <div 
          className='flex flex-col h-2/10 items-center justify-center'
          onMouseEnter={() => setIsDashboardOpen(true)}
          onMouseLeave={() => setIsDashboardOpen(false)}
          onClick= {handleClick}
        >    
          {isDashboardOpen ? (
            <MdDashboard className="text-white text-3xl" /> 
            
          ):(
            <MdOutlineDashboard className="text-white text-3xl" />
          )}
        </div>

        <div className="flex flex-col items-center justify-center space-y-10 h-9/10">

          {/* Look Icon */}
          <div
            onMouseEnter={() => setIsLookOpen(true)}
            onMouseLeave={() => setIsLookOpen(false)}
            onClick={handleClick2}
          >
            <div className={`transition-all duration-100 transform p-1 rounded-full ${isLookOpen ? 'bg-yellow-500 border-2 border-yellow-500' : 'bg-transparent'}`}>
              {isLookOpen ? (
                <HiOutlineClipboardDocumentList className="text-white text-2xl" />
              ) : (
                <HiOutlineDocumentMagnifyingGlass className="text-white text-2xl" />
              )}
            </div>
          </div>

          {/* Sales Icon */}
          <div
            onMouseEnter={() => setIsSalesOpen(true)}
            onMouseLeave={() => setIsSalesOpen(false)}
          >
            <div className={`transition-all duration-100 transform p-1 rounded-full ${isSalesOpen ? 'bg-yellow-500 border-2 border-yellow-500' : 'bg-transparent'}`}>
              {isSalesOpen ? (
                <MdOutlinePointOfSale className="text-white text-2xl" />
              ) : (
                <MdOutlinePointOfSale className="text-white text-2xl" /> // El mismo icono para el estado "no hover"
              )}
            </div>
          </div>

          {/* Inventory Icon */}
          <div
            onMouseEnter={() => setIsInventoryOpen(true)}
            onMouseLeave={() => setIsInventoryOpen(false)}
          >
            <div className={`transition-all duration-100 transform p-1 rounded-full ${isInventoryOpen ? 'bg-yellow-500 border-2 border-yellow-500' : 'bg-transparent'}`}>
              {isInventoryOpen ? (
                <AiFillProduct className="text-white text-2xl" />
              ) : (
                <AiFillProduct className="text-white text-2xl" /> // El mismo icono para el estado "no hover"
              )}
            </div>
          </div>

          {/* Clients Icon */}
          <div
            onMouseEnter={() => setIsClientsOpen(true)}
            onMouseLeave={() => setIsClientsOpen(false)}
          >
            <div className={`transition-all duration-100 transform p-1 rounded-full ${isClientsOpen ? 'bg-yellow-500 border-2 border-yellow-500' : 'bg-transparent'}`}>
              {isClientsOpen ? (
                <FaUsersRays className="text-white text-2xl" />
              ) : (
                <FaUsersRays className="text-white text-2l" /> // El mismo icono para el estado "no hover"
              )}
            </div>
          </div>

          {/* Vehicles Icon */}
          <div
            onMouseEnter={() => setIsVehiclesOpen(true)}
            onMouseLeave={() => setIsVehiclesOpen(false)}
          >
            <div className={`transition-all duration-100 transform p-1 rounded-full ${isVehiclesOpen ? 'bg-yellow-500 border-2 border-yellow-500' : 'bg-transparent'}`}>
              {isVehiclesOpen ? (
                <PiMotorcycleFill className="text-white text-2xl" />
              ) : (
                <PiMotorcycleFill className="text-white text-2xl" /> // El mismo icono para el estado "no hover"
              )}
            </div>
          </div>

          {/* Reports Icon */}
          <div
            onMouseEnter={() => setIsReportsOpen(true)}
            onMouseLeave={() => setIsReportsOpen(false)}
          >
            <div className={`transition-all duration-100 transform p-1 rounded-full ${isReportsOpen ? 'bg-yellow-500 border-2 border-yellow-500' : 'bg-transparent'}`}>
              {isReportsOpen ? (
                <HiDocumentReport className="text-white text-2xl" />
              ) : (
                <HiDocumentReport className="text-white text-2xl" /> // El mismo icono para el estado "no hover"
              )}
            </div>
          </div>

        </div>


        <div
          className="flex flex-col h-2/10 items-center justify-center transition-all duration-300"
          onMouseEnter={() => setIsOpen(true)}
          onMouseLeave={() => setIsOpen(false)}
          onClick={handleLogout}
        >
          {isOpen ? (
            <FaDoorOpen className="text-white text-2xl transition-all duration-300" />
          ) : (
            <FaDoorClosed className="text-white text-2xl transition-all duration-300" />
          )}
         
        </div>
    </div>
  )
}

export default NavBar