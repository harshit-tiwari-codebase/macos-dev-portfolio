import React from 'react'
import Wallpaper from './components/Wallpaper'
import Dock from './components/Dock'
import Navbar from './components/Navbar'
import MacWindow from './components/Windows/MacWindow'
import GitHubWindow from './components/Windows/GitHubWindow'
import SpotifyWindow from './components/Windows/SpotifyWindow'

const App = () => {
  return (
    <div className='w-full h-screen relative bg-zinc-800' >

      <Wallpaper/>
      <Navbar/>
      <Dock/>
      <SpotifyWindow/>
    </div>
  )
}

export default App
