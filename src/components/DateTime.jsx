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
    <div className='
      flex items-center gap-2
      px-3 py-1.5
      rounded-lg
      text-white
      text-[13px]
      font-medium
      tracking-tight
      font-[-apple-system,BlinkMacSystemFont,sans-serif]
    '>

      <p>{formattedDate}</p>

      <p>{formattedTime}</p>

    </div>
  )
}

export default DateTime