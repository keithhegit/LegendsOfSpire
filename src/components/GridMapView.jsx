import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { CDN_URL, ITEM_URL, PROFILEICON_URL, ACT_BACKGROUNDS } from '../data/constants';
import { ENEMY_POOL } from '../data/enemies';
import { GRID_ROWS, GRID_COLS } from '../data/gridMapLayout';

const GridMapView = ({ mapData, onNodeSelect, currentFloor, act }) => {
    // 图标获取逻辑
    const getMapIcon = (node) => {
        if (!node) return null;

        if (node.type === 'BOSS') {
            if (act === 1) return `${CDN_URL}/img/champion/Darius.png`;
            if (act === 2) return `${CDN_URL}/img/champion/Viego.png`;
            if (act === 3) return `${CDN_URL}/img/champion/Belveth.png`;
        }
        if (node.type === 'REST') return `${ITEM_URL}/2003.png`; 
        if (node.type === 'SHOP') return `${ITEM_URL}/3400.png`; 
        if (node.type === 'EVENT') return `${ITEM_URL}/3340.png`; 
        if (node.type === 'CHEST') return `${ITEM_URL}/3400.png`; // 使用宝箱图标
        if (node.type === 'BATTLE' && node.enemyId) {
            const enemy = ENEMY_POOL[node.enemyId];
            return enemy?.avatar || enemy?.img || `${PROFILEICON_URL}/29.png`;
        }
        return null; 
    };

    // 判断节点是否被迷雾覆盖
    const isFogged = (node) => {
        if (!node) return true;
        // 如果节点在当前层或下一层，不显示迷雾
        if (node.row <= currentFloor + 1) return false;
        return true;
    };

    // 网格单元格渲染
    const renderCell = (rowIndex, colIndex) => {
        const node = mapData.grid[rowIndex][colIndex];

        if (!node) {
            return <div key={`${rowIndex}-${colIndex}`} className="w-16 h-16" />; // 空占位
        }

        const isAvailable = node.status === 'AVAILABLE';
        const isCompleted = node.status === 'COMPLETED';
        const isLocked = node.status === 'LOCKED';
        const isFog = isFogged(node);
        const iconUrl = getMapIcon(node);

        return (
            <div key={node.id} className="relative flex items-center justify-center w-16 h-16">
                <motion.button
                    whileHover={isAvailable ? { scale: 1.1 } : {}}
                    whileTap={isAvailable ? { scale: 0.9 } : {}}
                    onClick={() => isAvailable && onNodeSelect(node)}
                    disabled={!isAvailable}
                    className={`
                        w-12 h-12 rounded-full border-2 flex items-center justify-center overflow-hidden bg-black shadow-lg transition-all relative
                        ${isAvailable ? 'border-[#C8AA6E] ring-2 ring-[#C8AA6E]/50 z-20 cursor-pointer' : 'border-slate-700 cursor-not-allowed'}
                        ${isCompleted ? 'opacity-40 grayscale' : ''}
                        ${isLocked || isFog ? 'opacity-20 blur-[1px]' : ''}
                    `}
                >
                    {iconUrl && (
                        <img 
                            src={iconUrl} 
                            className="w-full h-full object-cover" 
                            alt={node.type}
                            onError={(e) => {
                                e.target.src = `${PROFILEICON_URL}/29.png`;
                            }}
                        />
                    )}
                    {isCompleted && (
                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-[#C8AA6E] font-bold text-lg">
                            ✓
                        </div>
                    )}
                    {isFog && (
                        <div className="absolute inset-0 bg-black/80 flex items-center justify-center">
                            <span className="text-slate-600 text-xs">?</span>
                        </div>
                    )}
                </motion.button>
            </div>
        );
    };

    return (
        <div className="flex flex-col items-center h-full w-full relative overflow-hidden bg-[#0c0c12]">
            {/* 背景 */}
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-black/50 z-10" />
                <div 
                    className="absolute inset-0 bg-cover bg-center opacity-60" 
                    style={{ backgroundImage: `url('${ACT_BACKGROUNDS[act || 1]}')` }}
                />
            </div>

            {/* 网格容器 */}
            <div className="relative z-20 w-full h-full overflow-y-auto py-10 flex justify-center">
                <div 
                    className="grid gap-4" 
                    style={{ 
                        gridTemplateColumns: `repeat(${GRID_COLS}, minmax(0, 1fr))`,
                        gridTemplateRows: `repeat(${GRID_ROWS}, minmax(0, 1fr))`,
                        width: `${GRID_COLS * 80}px` // 每列80px (64px + 16px gap)
                    }}
                >
                    {/* 渲染每一行、每一列 */}
                    {mapData.grid.map((row, rIndex) => 
                        row.map((_, cIndex) => renderCell(rIndex, cIndex))
                    )}
                </div>
            </div>
            
            {/* 底部状态栏 */}
            <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black to-transparent pointer-events-none z-30 flex justify-center items-end pb-4 text-[#C8AA6E] font-serif">
                当前层数: {currentFloor + 1} / 10
            </div>
        </div>
    );
};

export default GridMapView;

