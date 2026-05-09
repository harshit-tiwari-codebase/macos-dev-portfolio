import {React , useState} from 'react'
import Wallpaper from './components/Wallpaper'
import Dock from './components/Dock'
import Navbar from './components/Navbar'
import MacWindow from './components/Windows/MacWindow'
import GitHubWindow from './components/Windows/GitHubWindow'
import SpotifyWindow from './components/Windows/SpotifyWindow'
import Note from './components/Windows/Note'
import Resume from './components/Windows/Resume'
import Cli from './components/Windows/Cli'




const App = () => {
  const [WindowState, setWindowState] = useState({github:false , spotify : false , note:false , resume : false ,cli:false})
  return (
    <div className='w-full h-screen relative bg-zinc-800 overflow-hidden' >
      
      <Wallpaper/>
      <Navbar/>
      <Dock  setWindowState = {setWindowState} WindowState = {WindowState}  />
      {WindowState.spotify && <SpotifyWindow windowname = {"spotify"}  setWindowState = {setWindowState} WindowState = {WindowState} /> }
      {WindowState.github &&  <GitHubWindow windowname = {"github"}  setWindowState = {setWindowState} WindowState = {WindowState} /> }
      {WindowState.note &&<Note windowname = {"note"}  setWindowState = {setWindowState} WindowState = {WindowState} /> }
      {WindowState.resume &&   <Resume windowname = {"resume"} setWindowState = {setWindowState} WindowState = {WindowState}  /> }
      {WindowState.cli && <Cli windowname = {"cli"}  setWindowState = {setWindowState} WindowState = {WindowState} /> }
     
      
    
      
    
    </div>
  )
}

export default App
