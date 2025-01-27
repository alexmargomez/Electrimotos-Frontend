import React from 'react'
import { MdOutlinePointOfSale } from "react-icons/md";
import { AiFillProduct } from "react-icons/ai";
import { FaUsersRays } from "react-icons/fa6";
import { PiMotorcycleFill } from "react-icons/pi";
import { HiDocumentReport } from "react-icons/hi";
import { HiOutlineDocumentMagnifyingGlass } from "react-icons/hi2";
import { GrCloudlinux } from "react-icons/gr";


const NavBar = () => {
  return (
    <div className="bg-[#494A8A]  h-screen w-1/17 flex flex-col">
        <div className='flex flex-col h-1/10 items-center justify-center'>    
            <GrCloudlinux className="text-white text-2xl" /> {/*Logo*/}
        </div>
        <div className='flex flex-col items-center justify-center space-y-10  h-9/10'>
            <HiOutlineDocumentMagnifyingGlass className="text-white text-2xl" /> {/*Buscar*/}
            <MdOutlinePointOfSale className="text-white text-2xl" /> {/*Ventas*/}
            <AiFillProduct className="text-white text-2xl" /> {/*Inventario*/}
            <FaUsersRays className="text-white text-2xl" /> {/*Clientes*/}
            <PiMotorcycleFill className="text-white text-2xl" /> {/*Vehiculos*/}
            <HiDocumentReport className="text-white text-2xl" /> {/*Reportes*/}
        </div>
        
    </div>
  )
}

export default NavBar