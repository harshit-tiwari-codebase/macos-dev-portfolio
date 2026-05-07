import React from 'react'
import Wallpaper from './components/Wallpaper'
import Dock from './components/Dock'
import Navbar from './components/Navbar'
import MacWindow from './components/Windows/MacWindow'

const App = () => {
  return (
    <div className='w-full h-screen relative bg-zinc-800' >

      <Wallpaper/>
      <Navbar/>
      <Dock/>
      <MacWindow/>
    </div>
  )
}

export default App
