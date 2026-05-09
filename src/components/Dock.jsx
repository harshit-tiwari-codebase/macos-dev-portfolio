import React from 'react'

const Dock = ({ WindowState, setWindowState }) => {

  const openWindow = (windowName)=>{
    setWindowState(state => ({ ...state, [windowName]: true }))

  }
  return (
    <div className='absolute bottom-0 left-1/2 translate-x-[-50%] flex gap-2 py-2 mb-2 px-2 items-center rounded-2xl
        bg-white/10
        backdrop-blur-xl
        border border-white/20
        shadow-2xl' >
      <div onClick={() => { openWindow("github") }} className='icon p-2 rounded-2xl bg-black flex justify-center items-center hover:scale-105 hover:-translate-y-2 transition-all duration-300'><img src="public\doc-icons\github.svg" alt="" /></div>
      <div onClick={() => { openWindow("note") }} className='icon  p-2 rounded-2xl bg-yellow-900 flex justify-center items-center'><img src="public\doc-icons\note.svg" alt="" /></div>
      <div onClick={() => { openWindow("resume") }}  className='icon  p-2 rounded-2xl bg-red-900 flex justify-center items-center'><img src="public\doc-icons\pdf.svg" alt="" /></div>
      <div onClick={() => { openWindow("spotify") }}  className='icon  p-2 rounded-2xl bg-green-900 flex justify-center items-center'><img src="public\doc-icons\spotify.svg" alt="" /></div>
      <div onClick={() => { openWindow("") }}  className='icon  p-2 rounded-2xl bg-blue-900 flex justify-center items-center'><img src="public\doc-icons\link.svg" alt="" /></div>
      <div onClick={() => { openWindow("cli") }}  className='icon  p-2 rounded-2xl bg-neutral-800 flex justify-center items-center'><img src="public\doc-icons\cli.svg" alt="" /></div>
      <div onClick={() => { openWindow("") }}  className='icon  p-2 rounded-2xl bg-orange-900 flex justify-center items-center'><img src="public\doc-icons\calender.svg" alt="" /></div>
      <div onClick={() => { openWindow("") }}  className='icon  p-2 rounded-2xl bg-cyan-900 flex justify-center items-center'><img src="public\doc-icons\mail.svg" alt="" /></div>
    </div>
  )
}

export default Dock
