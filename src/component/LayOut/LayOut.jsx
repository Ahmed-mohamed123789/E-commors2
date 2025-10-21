import React, { useState } from 'react'
import NavLogin from '../NavLogin/NavLogin'
import { Outlet } from 'react-router-dom'

export default function LayOut() {
  const [loading, setLoading] = useState(false);

  return (
    <div className="relative">
      <NavLogin />

      {loading && <Loding />}

      <Outlet context={{ setLoading }} />
    </div>
  );
}
