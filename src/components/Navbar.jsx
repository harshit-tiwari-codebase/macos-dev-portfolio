import React from 'react'
import DateTime from './DateTime'

const Navbar = () => {
  return (
    <div className='Navbar w-full absolute top-0 py-1 px-2 flex text-white justify-between   bg-white/10
        backdrop-blur-xl
       
        shadow-2xl'>
      <div className="left flex gap-3 items-center">
        <div className="icon"><img src="public\navbar-icons\apple.svg" alt="" /></div>
        <div className="nav-item"><p>Harshit Tiwari</p></div>
        <div className="nav-item"><p>File</p></div>
        <div className="nav-item"><p>Terminal</p></div>
        <div className="nav-item"><p>Window</p></div>
      </div>
      <div className="right flex gap-3 items-center">
        <div><img src="public\navbar-icons\wifi.svg" alt="" /></div>
        <div className="nav-item"><DateTime/></div>
      </div>


    </div>
  )
}

export default Navbar
