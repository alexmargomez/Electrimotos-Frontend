import React from 'react'
import { Logout } from '../components/LoginVal'
const dashboard = () => {
  return (
    <div className='h-screen w-full bg-gray-200'>
      <h1>Dashboard</h1>
      <Logout />
    </div>
  )
}

export default dashboard