import React, { useState, useMemo } from 'react';
import { Heart, Lock, RefreshCw } from 'lucide-react';
import { CHAMPION_POOL } from '../data/champions';
import { shuffle } from '../utils/gameLogic';
import { playChampionVoice } from '../utils/audioManager';

const ChampionSelect = ({ onChampionSelect, unlockedIds }) => {
    const allChamps = Object.values(CHAMPION_POOL);
    const [refreshCount, setRefreshCount] = useState(0);
    const [displayChamps, setDisplayChamps] = useState(() => {
        return shuffle([...allChamps]).slice(0, 3);
    });
    
    const handleRefresh = () => {
        if (refreshCount >= 3) {
            alert("基哥觉得你很机车，不许你再挑赶紧开始测");
            return;
        }
        const shuffled = shuffle([...allChamps]);
        setDisplayChamps(shuffled.slice(0, 3));
        setRefreshCount(prev => prev + 1);
    };
    
    return (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/95 overflow-y-auto py-8">
            <div className="mb-6 text-center">
                <h1 className="text-4xl md:text-5xl font-bold text-[#C8AA6E] mb-2 uppercase tracking-widest">选择你的英雄</h1>
                <p className="text-sm md:text-base text-[#F0E6D2] mb-4">选择一位英雄开始你的符文之地冒险</p>
                <button 
                    onClick={handleRefresh} 
                    className="px-6 py-2 bg-[#C8AA6E]/20 hover:bg-[#C8AA6E]/40 border border-[#C8AA6E] text-[#C8AA6E] rounded transition-all flex items-center gap-2 mx-auto"
                >
                    <RefreshCw size={16} />
                    <span>刷新英雄 ({refreshCount}/3)</span>
                </button>
            </div>
            <div className="flex flex-wrap gap-6 justify-center px-4">
                {displayChamps.map(champ => {
                    // 判断解锁逻辑
                    const champId = Object.keys(CHAMPION_POOL).find(key => CHAMPION_POOL[key].name === champ.name);
                    const isUnlocked = unlockedIds && unlockedIds.includes(champId);
                    
                    return (
                        <button 
                            key={champ.name} 
                            onClick={() => {
                                if (isUnlocked) {
                                    // 播放英雄语音
                                    playChampionVoice(champ.id);
                                    onChampionSelect(champ);
                                }
                            }} 
                            disabled={!isUnlocked}
                            className={`
                                w-64 md:w-72 h-[500px] md:h-[600px] bg-[#1E2328] border-2 rounded-xl overflow-hidden transition-all relative group text-left flex flex-col
                                ${isUnlocked ? 'border-[#C8AA6E] hover:scale-105 cursor-pointer shadow-[0_0_20px_rgba(200,170,110,0.5)]' : 'border-slate-700 opacity-60 grayscale cursor-not-allowed'}
                            `}
                        >
                            {/* 立绘区域 - 增加高度以显示脸部 */}
                            <div className="w-full h-[320px] md:h-[400px] overflow-hidden relative">
                                <img src={champ.img} className="w-full h-full object-cover object-top opacity-70 group-hover:opacity-100 transition-opacity" />
                            </div>
                            
                            {/* 锁定遮罩 */}
                            {!isUnlocked && (
                                <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center z-20">
                                    <Lock size={48} className="text-slate-400 mb-2" />
                                    <span className="text-slate-400 font-bold uppercase tracking-widest">Locked</span>
                                </div>
                            )}
                            
                            {/* 信息区域 - 优化文本显示 */}
                            <div className="flex-1 bg-gradient-to-t from-black/95 to-black/80 flex flex-col justify-end p-4 overflow-y-auto">
                                <h2 className="text-2xl md:text-3xl font-bold text-[#F0E6D2] mb-1">{champ.name}</h2>
                                <p className="text-xs md:text-sm text-[#C8AA6E] mb-2">{champ.title}</p>
                                <p className="text-[10px] md:text-xs text-[#A09B8C] mb-3 leading-relaxed line-clamp-3">{champ.description}</p>
                                <div className="flex items-center text-xs md:text-sm font-bold text-red-400 mb-1">
                                    <Heart size={12} className="mr-1" /> HP: {champ.maxHp}
                                </div>
                                <div className="text-[10px] md:text-xs text-blue-400 mb-2">法力: {champ.maxMana}</div>
                                <div className="text-[9px] md:text-xs text-[#C8AA6E] bg-black/50 p-2 rounded leading-tight line-clamp-2">
                                    被动: {champ.passive}
                                </div>
                            </div>
                        </button>
                    )
                })}
            </div>
        </div>
    );
};

export default ChampionSelect;

