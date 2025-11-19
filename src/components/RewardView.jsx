import React, { useMemo } from 'react';
import { Coins } from 'lucide-react';
import { shuffle } from '../utils/gameLogic';
import { CARD_DATABASE } from '../data/cards';

const RewardView = ({ onSkip, onCardSelect, goldReward, championName }) => {
  const rewards = useMemo(() => {
    const allCards = Object.values(CARD_DATABASE).filter(c => c.rarity !== 'BASIC' && c.rarity !== 'PASSIVE');
    const heroCards = allCards.filter(c => c.hero === championName || c.hero === 'Neutral');
    return shuffle(heroCards).slice(0, 3);
  }, [championName]);
  
  return (
    <div className="absolute inset-0 z-50 bg-black/90 flex flex-col items-center justify-center animate-in fade-in zoom-in duration-300">
       <h2 className="text-4xl font-bold text-[#C8AA6E] mb-2">胜利!</h2>
       <p className="text-[#F0E6D2] mb-8 flex items-center gap-2 text-xl"><Coins className="text-yellow-400"/> +{goldReward} 金币</p>
       <h3 className="text-xl text-white mb-6 uppercase tracking-widest">选择战利品</h3>
       <div className="flex gap-6 mb-10">
          {rewards.map((card, idx) => (
             <div key={idx} onClick={() => onCardSelect(card.id)} className="w-48 h-72 bg-[#1E2328] border-2 border-[#C8AA6E] rounded-xl hover:scale-105 transition-transform cursor-pointer flex flex-col overflow-hidden group shadow-xl">
                <div className="h-32 bg-black relative"><img src={card.img} className="w-full h-full object-cover opacity-80 group-hover:opacity-100" /></div>
                <div className="p-4 flex-1 flex flex-col items-center text-center">
                    <h4 className="font-bold text-[#F0E6D2] mb-2">{card.name}</h4>
                    <p className="text-xs text-[#A09B8C]">{card.description}</p>
                    <div className="mt-auto text-xs font-bold text-[#C8AA6E] uppercase">{card.rarity}</div>
                </div>
             </div>
          ))}
       </div>
       <button onClick={onSkip} className="px-8 py-3 border border-slate-600 text-slate-400 hover:text-white hover:border-white rounded uppercase tracking-widest">跳过</button>
    </div>
  );
};

export default RewardView;

