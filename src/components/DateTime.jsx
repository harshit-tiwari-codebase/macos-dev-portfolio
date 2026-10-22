import React, { useEffect, useState } from 'react'

const DateTime = () => {
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date())
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  const formattedDate = time.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  })

  const formattedTime = time.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  })

  return (
    <div className='flex items-center gap-1.5 px-1.5 sm:px-3 py-1 rounded-lg text-white text-[11px] sm:text-[13px] font-medium tracking-tight font-[-apple-system,BlinkMacSystemFont,sans-serif] shrink-0'>
      <p className="hidden sm:inline">{formattedDate}</p>
      <p>{formattedTime}</p>
    </div>
  )
}

export default DateTime
