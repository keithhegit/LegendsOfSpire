import React, { useMemo } from 'react';
import { Heart } from 'lucide-react';
import { CHAMPION_POOL } from '../data/champions';
import { shuffle } from '../utils/gameLogic';

const ChampionSelect = ({ onChampionSelect }) => {
    const allChamps = Object.values(CHAMPION_POOL);
    const availableChamps = useMemo(() => {
        const nonGarenChamps = allChamps.filter(c => c.name !== '盖伦');
        const randomTwo = shuffle(nonGarenChamps).slice(0, 2);
        return shuffle([allChamps.find(c => c.name === '盖伦'), ...randomTwo]);
    }, []);
    return (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/95">
            <h1 className="text-5xl font-bold text-[#C8AA6E] mb-4 uppercase tracking-widest">选择你的英雄</h1>
            <p className="text-[#F0E6D2] mb-12">选择一位英雄开始你的符文之地冒险</p>
            <div className="flex gap-10">
                {availableChamps.map(champ => (
                    <button key={champ.name} onClick={() => onChampionSelect(champ)} className="w-72 h-96 bg-[#1E2328] border-2 border-[#C8AA6E] rounded-xl overflow-hidden hover:scale-105 transition-all shadow-[0_0_20px_rgba(200,170,110,0.5)] cursor-pointer relative group">
                        <img src={champ.img} className="w-full h-full object-cover object-top opacity-70 group-hover:opacity-100 transition-opacity" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-6">
                            <h2 className="text-3xl font-bold text-[#F0E6D2]">{champ.name}</h2>
                            <p className="text-sm text-[#C8AA6E] mb-2">{champ.title}</p>
                            <p className="text-xs text-[#A09B8C] line-clamp-2">{champ.description}</p>
                            <div className="mt-3 flex items-center text-sm font-bold text-red-400"><Heart size={14} className="mr-1" /> HP: {champ.maxHp}</div>
                            <div className="text-xs text-blue-400 mt-1">法力: {champ.maxMana}</div>
                            <div className="text-xs text-[#C8AA6E] mt-2 bg-black/50 p-1 rounded">被动: {champ.passive}</div>
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default ChampionSelect;

