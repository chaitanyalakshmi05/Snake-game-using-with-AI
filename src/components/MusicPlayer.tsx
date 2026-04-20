import React, { useState, useRef, useEffect } from 'react';

const TRACKS = [
    {
        id: "X01",
        title: "DATA_LAKE_OVERRUN.WAV",
        artist: "SYS_NULL",
        url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-12.mp3",
    },
    {
        id: "X02",
        title: "MEMORY_LEAK_SYNTH.WAV",
        artist: "HEX_DUMP",
        url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-16.mp3",
    },
    {
        id: "X03",
        title: "CPU_THROTTLING_V5.WAV",
        artist: "CORE_T",
        url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3",
    }
];

export default function MusicPlayer() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [volume, setVolume] = useState(0.8);
    
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const track = TRACKS[currentIndex];
    
    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = volume;
        }
    }, [volume]);
    
    useEffect(() => {
        if (isPlaying && audioRef.current) {
            audioRef.current.play().catch(() => setIsPlaying(false));
        }
    }, [currentIndex, isPlaying]);

    const togglePlay = () => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause();
            } else {
                audioRef.current.play().catch(e => console.log(e));
            }
            setIsPlaying(!isPlaying);
        }
    };
    
    const nextTrack = () => setCurrentIndex((p) => (p + 1) % TRACKS.length);
    const prevTrack = () => setCurrentIndex((p) => (p - 1 + TRACKS.length) % TRACKS.length);

    // Audio frequency visualizer mockup
    const [bars, setBars] = useState<number[]>(Array(10).fill(1));
    useEffect(() => {
        if (!isPlaying) {
            setBars(Array(10).fill(1));
            return;
        }
        const int = setInterval(() => {
            setBars(Array.from({length: 10}, () => Math.floor(Math.random() * 8) + 1));
        }, 100);
        return () => clearInterval(int);
    }, [isPlaying]);

    return (
        <div className="w-full text-white uppercase flex flex-col font-mono text-sm">
            <audio ref={audioRef} src={track.url} onEnded={nextTrack} />
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-4">
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                         <span className="bg-[#0ff] text-black px-1 py-0.5 text-[10px] font-bold">TRK:{track.id}</span>
                         <span className={`text-[10px] ${isPlaying ? 'text-[#f0f] animate-pulse' : 'text-zinc-600'}`}>
                             [{isPlaying ? 'STREAMING' : 'IDLE'}]
                         </span>
                    </div>
                    <div className="text-sm font-bold text-[#f0f] break-all border-l-2 border-[#f0f] pl-2">
                        {track.title}
                    </div>
                    <div className="text-zinc-400 text-xs pl-2.5 mt-1 border-l-2 border-transparent">
                        AUTHOR: {track.artist}
                    </div>
                </div>

                {/* Cyber Visualizer */}
                <div className="flex items-end h-8 gap-1 opacity-80 shrink-0">
                    {bars.map((bar, i) => (
                        <div key={i} className="w-2 bg-[#0ff]" style={{ height: `${bar * 4}px` }} />
                    ))}
                </div>
            </div>
            
            {/* Brutalist Controls */}
            <div className="grid grid-cols-4 gap-2 mb-4 h-10">
                <button 
                    onClick={prevTrack} 
                    className="col-span-1 border-2 border-[#fff] hover:bg-[#fff] hover:text-black transition-colors flex items-center justify-center font-bold"
                >
                    &lt;&lt;
                </button>
                <button 
                    onClick={togglePlay} 
                    className="col-span-2 bg-[#f0f] text-black font-pixel text-xs flex items-center justify-center hover:bg-white transition-colors"
                >
                    {isPlaying ? '[ HALT ]' : '[ EXEC ]'}
                </button>
                <button 
                    onClick={nextTrack} 
                    className="col-span-1 border-2 border-[#fff] hover:bg-[#fff] hover:text-black transition-colors flex items-center justify-center font-bold"
                >
                    &gt;&gt;
                </button>
            </div>
            
            {/* Cypher Volume */}
            <div className="flex items-center gap-2 border-t-2 border-zinc-800 pt-2 text-[#0ff] text-xs">
                 <span>VOL:</span>
                 <input 
                     type="range" 
                     min={0} max={1} step={0.05} 
                     value={volume} 
                     onChange={(e) => setVolume(Number(e.target.value))}
                     className="w-full appearance-none bg-black border border-[#0ff] h-2 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-[#f0f] cursor-crosshair"
                 />
                 <span className="w-8 text-right">{(volume * 100).toFixed(0)}%</span>
            </div>
        </div>
    );
}
