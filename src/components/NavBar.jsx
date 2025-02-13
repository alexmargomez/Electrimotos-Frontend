import React from 'react'
import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { AiFillProduct } from "react-icons/ai";
import { FaBookBookmark } from "react-icons/fa6";
import { HiDocumentReport } from "react-icons/hi";
import { HiOutlineDocumentMagnifyingGlass } from "react-icons/hi2";
import { FaDoorClosed, FaDoorOpen } from "react-icons/fa";
import { Logout } from './LoginVal';
import { MdDashboard, MdOutlineDashboard, MdOutlinePointOfSale } from "react-icons/md";

const NavBar = () => {
  const [isDashboardOpen, setIsDashboardOpen] = useState(false);
  const [hoveredIcon, setHoveredIcon] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  

  const Icons = [
    { icon: FaBookBookmark, route: "/schedule" },
    { icon: MdOutlinePointOfSale, route: "/sales" },
    { icon: AiFillProduct, route: "/inventory" },
    { icon: HiOutlineDocumentMagnifyingGlass, route: "/look" },
    { icon: HiDocumentReport, route: "/reports" },
  ];
  
  return (
    <div className="bg-[#494A8A]  h-screen w-1/17 flex flex-col">
        <div 
          className='flex flex-col h-1/10 items-center justify-center'
          onMouseEnter={() => setIsDashboardOpen(true)}
          onMouseLeave={() => setIsDashboardOpen(false)}
          onClick={ () => navigate("/dashboard")}
        >    
          {isDashboardOpen ? (
            <MdDashboard className="text-white text-3xl" />   
          ):(
            <MdOutlineDashboard className="text-white text-3xl" />
          )}
        </div>

        <div className="flex flex-col items-center justify-center space-y-8 flex-grow h-8/10">
          {Icons.map((item, index) => (
            <div
              key={index}
              onMouseEnter={() => setHoveredIcon(index)}
              onMouseLeave={() => setHoveredIcon(null)}
              onClick={() => navigate(item.route)}
              className="cursor-pointer"
            >
              <div
                className={`transition-all duration-100 p-2 rounded-full ${
                  hoveredIcon === index ? 'bg-[#FFA500]' : 'bg-transparent'
                }`}
              >
                <item.icon className="text-white text-3xl" />
              </div>
            </div>
          ))}
        </div>
          
        <div
          className="flex flex-col h-1/10 items-center justify-center transition-all duration-300"
          onMouseEnter={() => setIsOpen(true)}
          onMouseLeave={() => setIsOpen(false)}
          onClick={Logout(navigate)}
        >
          {isOpen ? (
            <FaDoorOpen className="text-white text-3xl transition-all duration-300" />
          ) : (
            <FaDoorClosed className="text-white text-3xl transition-all duration-300" />
          )}
         
        </div>
    </div>
  )
}

export default NavBar