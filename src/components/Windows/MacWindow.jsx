import React from "react";
import { Rnd } from "react-rnd";

const MacWindow = () => {
  return (
    <Rnd
      default={{
        x: 300,
        y: 120,
        width: 700,
        height: 450,
      }}
      minWidth={350}
      minHeight={200}
      dragHandleClassName="nav"
    >
      <div
        className="window  bg-zinc-900/80
                backdrop-blur-2xl
                border border-white/10
                shadow-[0_20px_60px_rgba(0,0,0,0.55)] w-full h-full  rounded-2xl"
      >
        <div
          className="nav   bg-white/5
                    border-b border-white/10
                    cursor-move w-full px-3 py-1 flex items-center gap-4"
        >
          <div className="dots flex gap-2">
            <div className="dot bg-[#ff5f57] h-3 w-3 rounded-full"></div>
            <div className="dot bg-[#28c840] h-3 w-3 rounded-full"></div>
            <div className="dot bg-[#ffbd2e] h-3 w-3 rounded-full"></div>
          </div>
          <p className="text-sm text-white">harshitOS</p>
        </div>
        <div className='
  content
  w-full
  h-[calc(100%-40px)]
  p-5
  text-white
  overflow-auto
  font-[-apple-system,BlinkMacSystemFont,sans-serif]
'>

        </div>
      </div>
    </Rnd>
  );
};

export default MacWindow;
