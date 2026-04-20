import React, { useState, useEffect, useCallback, useRef } from 'react';

type Point = { x: number; y: number };

const GRID_SIZE = 20;
const INITIAL_SNAKE = [{ x: 10, y: 10 }];
const INITIAL_DIR = { x: 0, y: -1 };
const INITIAL_SPEED = 120;

export default function SnakeGame() {
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [dir, setDir] = useState<Point>(INITIAL_DIR);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  
  const dirRef = useRef(dir);
  
  const generateFood = useCallback((currentSnake: Point[]) => {
      let newFood;
      while (true) {
          newFood = {
              x: Math.floor(Math.random() * GRID_SIZE),
              y: Math.floor(Math.random() * GRID_SIZE)
          };
          const collision = currentSnake.some(segment => segment.x === newFood.x && segment.y === newFood.y);
          if (!collision) break;
      }
      return newFood;
  }, []);

  const resetGame = () => {
      setSnake(INITIAL_SNAKE);
      setDir(INITIAL_DIR);
      dirRef.current = INITIAL_DIR;
      setScore(0);
      setGameOver(false);
      setFood(generateFood(INITIAL_SNAKE));
      setHasStarted(false);
  };
  
  useEffect(() => {
      const handleKeyDown = (e: KeyboardEvent) => {
          if (["Space", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.code)) {
              e.preventDefault();
          }
          
          if (e.code === 'Space') {
             if (gameOver) {
                 resetGame();
             } else {
                 setHasStarted(true);
                 setIsPaused(p => !p);
             }
             return;
          }
          
          if (!hasStarted || isPaused || gameOver) return;
          
          const keyDir: Record<string, Point> = {
              ArrowUp: { x: 0, y: -1 },
              ArrowDown: { x: 0, y: 1 },
              ArrowLeft: { x: -1, y: 0 },
              ArrowRight: { x: 1, y: 0 },
              KeyW: { x: 0, y: -1 },
              KeyS: { x: 0, y: 1 },
              KeyA: { x: -1, y: 0 },
              KeyD: { x: 1, y: 0 },
          };
          
          const newDir = keyDir[e.code];
          if (newDir) {
              const currentDir = dirRef.current;
              // Prevent 180 reversing
              if (newDir.x !== 0 && currentDir.x === -newDir.x) return;
              if (newDir.y !== 0 && currentDir.y === -newDir.y) return;
              
              setDir(newDir);
              dirRef.current = newDir;
          }
      };
      
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
  }, [hasStarted, isPaused, gameOver]);

  useEffect(() => {
      if (!hasStarted || isPaused || gameOver) return;
      
      const moveSnake = () => {
          setSnake(prevSnake => {
              const head = prevSnake[0];
              const newHead = { x: head.x + dirRef.current.x, y: head.y + dirRef.current.y };
              
              const isCollision = 
                newHead.x < 0 || newHead.x >= GRID_SIZE || 
                newHead.y < 0 || newHead.y >= GRID_SIZE ||
                prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y);

              if (isCollision) {
                  setGameOver(true);
                  return prevSnake;
              }
              
              const newSnake = [newHead, ...prevSnake];
              
              if (newHead.x === food.x && newHead.y === food.y) {
                  setScore(s => s + 1);
                  setFood(generateFood(newSnake));
              } else {
                  newSnake.pop();
              }
              return newSnake;
          });
      };
      
      const currentSpeed = Math.max(40, INITIAL_SPEED - score * 2);
      const interval = setInterval(moveSnake, currentSpeed);
      return () => clearInterval(interval);
  }, [hasStarted, isPaused, gameOver, food, score, generateFood]);

  return (
      <div className="flex flex-col items-center w-full">
         
         <div className="flex justify-between w-full mb-2 bg-[#f0f] text-black px-2 py-1 uppercase font-pixel text-[10px]">
             <span>{gameOver ? 'ERR: CRITICAL' : (isPaused ? 'HALT' : (hasStarted ? 'SYS.ACTIVE' : 'AWAIT_INIT'))}</span>
             <span>CYCLES: {score.toString().padStart(4, '0')}</span>
         </div>
         
         {/* Game Grid */}
         <div className="relative border-4 border-[#0ff] bg-black w-full aspect-square overflow-hidden">
             
             {/* Aggressive Grid Pattern */}
             <div className="absolute inset-0 z-0 opacity-20 pointer-events-none"
                  style={{
                      backgroundImage: `linear-gradient(to right, #0ff 1px, transparent 1px), linear-gradient(to bottom, #0ff 1px, transparent 1px)`,
                      backgroundSize: `${100/GRID_SIZE}% ${100/GRID_SIZE}%`
                  }}
             />
             
             <div className="relative w-full h-full z-10">
                 {/* Snake */}
                 {snake.map((segment, i) => (
                     <div 
                         key={i}
                         className="absolute"
                         style={{
                             left: `${segment.x * (100 / GRID_SIZE)}%`,
                             top: `${segment.y * (100 / GRID_SIZE)}%`,
                             width: `${100 / GRID_SIZE}%`,
                             height: `${100 / GRID_SIZE}%`,
                             backgroundColor: i === 0 ? '#fff' : '#f0f',
                             border: '1px solid #000'
                         }}
                     />
                 ))}
                 
                 {/* Food / Data Packet */}
                 <div 
                     className="absolute"
                     style={{
                         left: `${food.x * (100 / GRID_SIZE)}%`,
                         top: `${food.y * (100 / GRID_SIZE)}%`,
                         width: `${100 / GRID_SIZE}%`,
                         height: `${100 / GRID_SIZE}%`,
                         backgroundColor: '#0ff',
                         animation: 'pulse 0.5s steps(2, start) infinite'
                     }}
                 />
             </div>
             
             {/* Overlays */}
             {(!hasStarted || isPaused || gameOver) && (
                 <div className="absolute inset-0 z-30 bg-black/80 flex flex-col justify-center items-center text-center p-4">
                     {gameOver ? (
                         <>
                            <h2 className="text-[#f0f] font-pixel text-xl sm:text-2xl mb-4 text-glitch" data-text="FATAL_EXCEPTION">FATAL_EXCEPTION</h2>
                            <p className="text-[#0ff] mb-8 uppercase text-lg">Data Packet Loss: {score}</p>
                            <div className="border-2 border-[#fff] text-[#fff] px-4 py-2 uppercase animate-[pulse_1s_steps(2)_infinite]">
                               [PRESS SPACE TO REBOOT]
                            </div>
                         </>
                     ) : !hasStarted ? (
                         <>
                            <h2 className="text-[#0ff] font-pixel text-lg sm:text-xl mb-6 text-glitch" data-text="EXECUTE MAIN()">EXECUTE MAIN()</h2>
                            <div className="bg-[#f0f] text-black px-4 py-2 uppercase mb-4 text-sm font-bold">
                               W/A/S/D or ARROWS == NAVIGATE
                            </div>
                            <div className="border-2 border-[#0ff] text-[#0ff] px-4 py-2 uppercase animate-[pulse_1s_steps(2)_infinite]">
                               [PRESS SPACE TO INIT]
                            </div>
                         </>
                     ) : (
                         <h2 className="text-[#0ff] font-pixel text-2xl uppercase bg-[#f0f] text-black p-2 animate-[pulse_2s_steps(2)_infinite]">
                            HALTED_BY_USER
                         </h2>
                     )}
                 </div>
             )}
         </div>
      </div>
  );
}
