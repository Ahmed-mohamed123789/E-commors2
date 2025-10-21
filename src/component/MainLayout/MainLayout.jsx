import React from 'react'
import NavHome from '../NavHome/NavHome'
import { Outlet } from 'react-router-dom'

export default function MainLayout() {
  return (
    <div>
      <NavHome />
      <Outlet />
    </div>
  )
}
