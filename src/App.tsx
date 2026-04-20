import React, { useEffect, useState } from 'react';
import SnakeGame from './components/SnakeGame';
import MusicPlayer from './components/MusicPlayer';

export default function App() {
  const [glitching, setGlitching] = useState(false);

  useEffect(() => {
    // Random systemic glitches
    const interval = setInterval(() => {
      if (Math.random() > 0.8) {
        setGlitching(true);
        setTimeout(() => setGlitching(false), 150 + Math.random() * 200);
      }
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-black font-mono selection:bg-[#f0f] selection:text-[#0ff] relative overflow-hidden">
      {/* Background Overlays */}
      <div className="absolute inset-0 static-noise z-[100]" />
      <div className="absolute inset-0 scanlines z-[90]" />

      <div className={`relative z-10 w-full h-screen flex flex-col container mx-auto p-4 ${glitching ? 'screen-tear' : ''}`}>
        
        {/* Terminal Header */}
        <header className="absolute top-4 left-4 z-50 border-2 border-[#0ff] bg-black p-2 sm:p-4 brutal-border">
          <h1 
            className="font-pixel text-lg sm:text-2xl text-[#f0f] uppercase mb-1 text-glitch" 
            data-text="SYS.OVERRIDE_ACTIVE"
          >
            SYS.OVERRIDE_ACTIVE
          </h1>
          <p className="text-[#0ff] text-xs sm:text-sm animate-[pulse_2s_steps(2)_infinite]">
            {`> KERNEL_PANIC_PREVENTED = false`}
          </p>
        </header>

        {/* Desktop Layout Matrix */}
        <main className="flex-1 w-full h-full flex flex-col items-center justify-center gap-8 relative mt-24 sm:mt-0">
          
          {/* Main Module (Snake) */}
          <div className="w-full max-w-[500px] z-20">
            <div className="bg-black brutal-border p-2 sm:p-4">
              <div className="border-b-4 border-[#0ff] mb-4 pb-2 flex justify-between items-end">
                 <span className="font-pixel text-[#0ff] text-[10px] animate-pulse">PID: 9942</span>
                 <span className="text-[#f0f] text-sm uppercase">Executable // SNK_BIN</span>
              </div>
              <SnakeGame />
            </div>
          </div>
          
          {/* Sub Module (Music Player) */}
          <div className="fixed bottom-4 sm:bottom-8 right-4 sm:right-8 z-50 w-[calc(100%-2rem)] sm:w-[400px]">
             <div className="bg-black brutal-border p-2 sm:p-4 shadow-[-8px_8px_0_0_#0ff]">
               <div className="border-b-4 border-[#f0f] mb-4 pb-2">
                 <span className="font-pixel text-[#f0f] text-[10px] text-glitch" data-text="A U D I O _ S T R E A M">A U D I O _ S T R E A M</span>
               </div>
               <MusicPlayer />
             </div>
          </div>

        </main>
      </div>
    </div>
  );
}
