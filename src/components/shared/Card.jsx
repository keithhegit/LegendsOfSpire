import React from 'react';
import { motion } from 'framer-motion';
import { getCardWithUpgrade } from '../../utils/cardUtils';

const Card = ({ cardId, index, totalCards, canPlay, onPlay, discountAmount = 0 }) => {
  const card = getCardWithUpgrade(cardId);

  if (!card) {
    console.warn(`Card not found: ${cardId}`);
    return null;
  }

  const { baseId, upgradeLevel, hammerBonus = 0 } = card;
  const isUpgraded = upgradeLevel > 0;

  const isUltimate = card.hero && card.hero !== 'Neutral' && baseId.endsWith('R');
  
  // 堆叠逻辑计算
  const overlap = totalCards > 5 ? -40 : 10; 
  const rotation = (index - (totalCards - 1) / 2) * 3; // 扇形展开角度
  const yOffset = Math.abs(index - (totalCards - 1) / 2) * 5; // 扇形弧度
  
  return (
    <motion.div
      layout
      initial={{ y: 100, opacity: 0, scale: 0.5 }}
      animate={{ y: yOffset, opacity: 1, scale: 1, rotate: rotation }}
      exit={{ y: -100, opacity: 0, scale: 0.5 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      style={{ 
        marginLeft: index === 0 ? 0 : `${overlap}px`, 
        zIndex: index,
        transformOrigin: "bottom center",
        position: 'relative'
      }}
      drag={canPlay ? "y" : false}
      dragConstraints={{ top: -300, bottom: 0 }}
      dragSnapToOrigin={true}
      onDragEnd={(event, info) => { 
        if (info.offset.y < -150 && canPlay) { 
          onPlay(index); 
        } 
      }}
      whileHover={canPlay ? { 
        scale: 1.2, 
        y: -80, 
        zIndex: 100, 
        rotate: 0
      } : {}}
      className={`
        w-40 h-60 bg-[#1E2328] border-2 rounded-lg flex flex-col items-center overflow-hidden shadow-2xl relative
        ${canPlay ? 'border-[#C8AA6E] cursor-grab active:cursor-grabbing' : 'border-slate-700 opacity-60 cursor-not-allowed'}
        ${isUltimate ? 'border-yellow-300/90 shadow-[0_0_28px_rgba(255,215,0,0.55)]' : ''}
      `}
    >
      {isUltimate && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-lg border border-yellow-200/80 ring-1 ring-yellow-400/40 shadow-[0_0_35px_rgba(255,215,0,0.8)] animate-pulse"
        >
          <div className="absolute inset-[-4px] rounded-xl bg-gradient-to-r from-yellow-200/15 via-transparent to-yellow-200/15 blur-sm" />
        </div>
      )}
      {/* 卡牌图片 */}
      <div className="w-full h-40 bg-black overflow-hidden relative pointer-events-none">
        <img src={card.img} className="w-full h-full object-cover opacity-90" alt={card.name} />
        <div className="absolute top-2 left-2 w-8 h-8 bg-[#091428] rounded-full border border-[#C8AA6E] flex items-center justify-center text-[#C8AA6E] font-bold text-lg shadow-md">
          {card.cost}
        </div>
        {hammerBonus > 0 && (
          <div
            className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-amber-600/80 border border-amber-300 text-[10px] font-bold text-amber-100 shadow-sm"
            aria-label={`匠魂加成 ${hammerBonus}`}
          >
            匠魂+{hammerBonus}
          </div>
        )}
        {discountAmount > 0 && (
          <div
            className="absolute top-2 left-11 px-1 py-0.5 rounded bg-sky-900/80 border border-sky-400 text-xs font-bold text-sky-200 animate-pulse"
            aria-label={`Mana discount ${discountAmount}`}
          >
            -{discountAmount}
          </div>
        )}
      </div>
      
      {/* 卡牌文本 */}
      <div className={`flex-1 p-2 text-center flex flex-col w-full pointer-events-none bg-[#1E2328] ${isUpgraded ? 'border-t border-green-500' : ''}`}>
        <div className={`text-sm font-bold mb-1 line-clamp-1 ${isUpgraded ? 'text-green-400' : 'text-[#F0E6D2]'}`}>{card.name}</div>
        <div className="text-[10px] text-[#A09B8C] leading-tight font-medium line-clamp-2">
          {card.description}
        </div>
        <div className="mt-auto text-[9px] text-slate-500 uppercase font-bold tracking-wider">
          {card.type}
        </div>
      </div>
    </motion.div>
  );
};

export default Card;

