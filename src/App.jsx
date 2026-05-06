import React from 'react'
import Wallpaper from './components/Wallpaper'
import Dock from './components/Dock'

const App = () => {
  return (
    <div className='w-full h-screen relative bg-zinc-800' >
      <Wallpaper/>
      <Dock/>
    </div>
  )
}

export default App
