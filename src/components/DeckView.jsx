import React from 'react';
import { X, Layers } from 'lucide-react';
import { CARD_DATABASE } from '../data/cards';
import { getCardWithUpgrade } from '../utils/cardUtils';

const DeckView = ({ deck, onClose, gmConfig }) => {
    // 统计卡牌数量
    const deckCounts = deck.reduce((acc, cardId) => {
        acc[cardId] = (acc[cardId] || 0) + 1;
        return acc;
    }, {});

    return (
        <div 
            className="absolute inset-0 z-[90] bg-black/90 flex items-center justify-center p-4 sm:p-10" 
            onClick={onClose}
        >
            <div 
                className="bg-[#1E2328] border-2 border-[#C8AA6E] w-full max-w-4xl h-3/4 rounded-xl flex flex-col overflow-hidden shadow-2xl" 
                onClick={e => e.stopPropagation()}
            >
                <div className="p-4 border-b border-[#C8AA6E]/30 flex justify-between items-center bg-[#091428]">
                    <div className="flex items-center gap-2 text-[#C8AA6E] text-lg sm:text-xl font-bold">
                        <Layers size={24} /> 
                        当前牌组 ({deck.length} 张)
                    </div>
                    <button 
                        onClick={onClose}
                        className="p-2 hover:bg-red-900/50 rounded-full transition-colors"
                    >
                        <X className="text-slate-400 hover:text-white" size={20} />
                    </button>
                </div>
                
                {gmConfig?.enabled && (
                    <div className="px-4 py-3 border-b border-emerald-500/30 bg-emerald-900/20 text-emerald-100 text-xs tracking-widest">
                        GM 模式：注入 {gmConfig.extraCards.length ? gmConfig.extraCards.join(', ') : '无'}
                        <span className="mx-2">|</span>
                        起手 {gmConfig.forceTopCards.length ? gmConfig.forceTopCards.join(', ') : '无'}
                    </div>
                )}
                <div className="flex-1 overflow-y-auto p-4 sm:p-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 content-start">
                    {Object.entries(deckCounts).map(([cardId, count]) => {
                        const card = getCardWithUpgrade(cardId) || CARD_DATABASE[cardId];
                        if (!card) return null;

                        return (
                            <div key={cardId} className="relative group cursor-help">
                                {/* 简易卡牌样式 */}
                                <div className="w-full aspect-[2/3] bg-black border border-slate-600 rounded overflow-hidden relative hover:border-[#C8AA6E] transition-colors">
                                    {card.hammerBonus > 0 && (
                                        <div className="absolute top-1 left-1 px-2 py-0.5 rounded-full bg-amber-500/80 text-[10px] font-bold text-black shadow">
                                            匠魂+{card.hammerBonus}
                                        </div>
                                    )}
                                    <img 
                                        src={card.img} 
                                        className="w-full h-full object-cover opacity-80" 
                                        alt={card.name}
                                        onError={(e) => {
                                            e.target.src = 'https://ddragon.leagueoflegends.com/cdn/13.1.1/img/profileicon/29.png';
                                        }}
                                    />
                                    <div className="absolute inset-0 flex flex-col justify-end p-2 bg-gradient-to-t from-black/90 to-transparent">
                                        <div className="text-xs font-bold text-[#F0E6D2]">{card.name}</div>
                                        <div className="text-[10px] text-[#A09B8C] line-clamp-2">{card.description}</div>
                                        <div className="text-[9px] text-slate-500 mt-1">{card.type}</div>
                                    </div>
                                    {/* 数量角标 */}
                                    {count > 1 && (
                                        <div className="absolute top-1 right-1 w-5 h-5 sm:w-6 sm:h-6 bg-[#C8AA6E] text-black font-bold rounded-full flex items-center justify-center text-[10px] sm:text-xs border border-white">
                                            x{count}
                                        </div>
                                    )}
                                    {/* 费用显示 */}
                                    <div className="absolute top-1 left-1 w-5 h-5 sm:w-6 sm:h-6 bg-[#091428] rounded-full border border-[#C8AA6E] flex items-center justify-center text-[#C8AA6E] font-bold text-[10px] sm:text-xs">
                                        {card.cost}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default DeckView;

