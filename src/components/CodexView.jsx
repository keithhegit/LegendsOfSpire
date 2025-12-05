import React, { useState } from 'react';
import { X } from 'lucide-react';
import { CARD_DATABASE } from '../data/cards';
import { ENEMY_POOL } from '../data/enemies';
import { RELIC_DATABASE } from '../data/relics';

const CodexView = ({ onClose }) => {
    const [activeTab, setActiveTab] = useState('CARDS'); // CARDS, ENEMIES, RELICS

    const renderContent = () => {
        switch (activeTab) {
            case 'CARDS':
                return (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 p-4 overflow-y-auto h-full">
                        {Object.values(CARD_DATABASE).map(card => {
                            if (!card) return null;
                            return (
                            <div key={card.id} className="bg-[#1E2328] border border-slate-600 p-2 rounded flex flex-col items-center hover:border-[#C8AA6E] transition-colors">
                                <img 
                                    src={card?.img || 'https://ddragon.leagueoflegends.com/cdn/13.1.1/img/profileicon/29.png'} 
                                    className="w-16 h-16 object-cover rounded mb-2" 
                                    alt={card?.name || 'card'}
                                    onError={(e) => {
                                        e.target.src = 'https://ddragon.leagueoflegends.com/cdn/13.1.1/img/profileicon/29.png';
                                    }}
                                />
                                <div className="text-xs text-[#F0E6D2] font-bold text-center mb-1">{card?.name}</div>
                                <div className="text-[10px] text-[#A09B8C] text-center line-clamp-2">{card?.description}</div>
                                <div className="text-[8px] text-slate-500 mt-1">{card?.type}</div>
                            </div>
                            );
                        })}
                    </div>
                );

            case 'ENEMIES':
                return (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4 overflow-y-auto h-full">
                        {Object.values(ENEMY_POOL).map(enemy => (
                            <div key={enemy.id} className="bg-[#1E2328] border border-slate-600 p-3 rounded flex items-center gap-3 hover:border-red-500 transition-colors">
                                <img 
                                    src={enemy.avatar || enemy.img} 
                                    className="w-12 h-12 rounded-full border border-red-500 object-cover" 
                                    alt={enemy.name}
                                    onError={(e) => {
                                        e.target.src = 'https://ddragon.leagueoflegends.com/cdn/13.1.1/img/profileicon/29.png';
                                    }}
                                />
                                <div className="flex-1">
                                    <div className="text-sm text-red-400 font-bold">{enemy.name}</div>
                                    <div className="text-[10px] text-[#A09B8C]">HP: {enemy.maxHp}</div>
                                    {enemy.act && (
                                        <div className="text-[9px] text-slate-500">Act {enemy.act}</div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                );

            case 'RELICS':
                return (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 p-4 overflow-y-auto h-full">
                        {Object.values(RELIC_DATABASE).map(relic => {
                            if (!relic) return null;
                            return (
                            <div key={relic.id} className="bg-[#1E2328] border border-slate-600 p-2 rounded flex flex-col items-center hover:border-[#C8AA6E] transition-colors">
                                <img 
                                    src={relic.img || 'https://ddragon.leagueoflegends.com/cdn/13.1.1/img/profileicon/29.png'} 
                                    className="w-16 h-16 object-cover rounded mb-2" 
                                    alt={relic.name || 'relic'}
                                    onError={(e) => {
                                        e.target.src = 'https://ddragon.leagueoflegends.com/cdn/13.1.1/img/profileicon/29.png';
                                    }}
                                />
                                <div className="text-xs text-[#F0E6D2] font-bold text-center mb-1">{relic.name}</div>
                                <div className="text-[10px] text-[#A09B8C] text-center line-clamp-3">{relic.description}</div>
                                {relic.rarity && (
                                    <div className="text-[8px] text-slate-500 mt-1">{relic.rarity}</div>
                                )}
                            </div>
                            );
                        })}
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <div className="absolute inset-0 z-[100] bg-black/95 flex flex-col animate-in fade-in zoom-in duration-200">
            {/* 顶部导航 */}
            <div className="flex justify-between items-center p-4 border-b border-[#C8AA6E]/30 bg-[#091428]">
                <h2 className="text-2xl text-[#C8AA6E] font-serif tracking-widest">图鉴 (Codex)</h2>
                <div className="flex gap-2 sm:gap-4">
                    {['CARDS', 'ENEMIES', 'RELICS'].map(tab => (
                        <button 
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-3 py-1 rounded border text-sm sm:text-base transition-colors ${
                                activeTab === tab 
                                    ? 'bg-[#C8AA6E] text-black border-[#C8AA6E]' 
                                    : 'text-slate-400 border-slate-600 hover:text-white hover:border-slate-500'
                            }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
                <button 
                    onClick={onClose} 
                    className="p-2 hover:bg-red-900/50 rounded-full transition-colors"
                >
                    <X className="text-slate-400 hover:text-white" size={20} />
                </button>
            </div>

            {/* 内容区 */}
            <div className="flex-1 overflow-hidden relative">
                {renderContent()}
            </div>
        </div>
    );
};

export default CodexView;

