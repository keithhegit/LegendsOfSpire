import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';
import { BGM_URL } from '../../data/constants';

const AudioPlayer = () => {
    const audioRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [volume, setVolume] = useState(0.3);
    useEffect(() => { if(audioRef.current) { audioRef.current.volume = volume; const p = audioRef.current.play(); if(p !== undefined) p.then(()=>setIsPlaying(true)).catch(()=>setIsPlaying(false)); } }, []);
    const togglePlay = () => { if (isPlaying) { audioRef.current.pause(); setIsPlaying(false); } else { audioRef.current.play(); setIsPlaying(true); } };
    return (
        <div className="fixed top-4 right-4 z-[100] flex items-center gap-2 bg-black/50 p-2 rounded-full border border-[#C8AA6E]/50 hover:bg-black/80 transition-all">
            <audio ref={audioRef} src={BGM_URL} loop />
            <button onClick={togglePlay} className="text-[#C8AA6E] hover:text-white">{isPlaying ? <Pause size={16} /> : <Play size={16} />}</button>
            <button onClick={()=>{const v=volume===0?0.3:0; setVolume(v); if(audioRef.current) audioRef.current.volume=v;}} className="text-[#C8AA6E] hover:text-white">{volume===0 ? <VolumeX size={16} /> : <Volume2 size={16} />}</button>
        </div>
    );
};

export default AudioPlayer;

