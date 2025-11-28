/**
 * ===========================
 * 六边形自由探索地图视图 v3
 * ===========================
 * 
 * 核心特性：
 * 1. 基于六边形邻接规则，不依赖DAG的next数组
 * 2. 战争迷雾：只显示已探索+相邻的节点
 * 3. 玩家可以向任意相邻方向移动
 * 4. 清晰的可选节点高亮
 */

import React, { useState, useRef, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { ITEM_URL, PROFILEICON_URL, CDN_URL } from '../data/constants';
import { ENEMY_POOL } from '../data/enemies';
import { getHexNeighbors, offsetToPixel, offsetToPixelRotated } from '../utils/hexagonGrid';

const GridMapView_v3 = ({ mapData, onNodeSelect, activeNode, currentFloor, act, lockedChoices = new Set() }) => {
  const containerRef = useRef(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [exploredNodes, setExploredNodes] = useState(new Set());
  const [showLoading, setShowLoading] = useState(false);

  // Enforce minimum 1s loading screen display
  useEffect(() => {
    if (!mapData || !mapData.grid) {
      setShowLoading(true);
    } else {
      const timer = setTimeout(() => {
        setShowLoading(false);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [mapData]);

  const HEX_SIZE = 45;
  const ICON_SCALE = 1.15;
  const MIN_VIEW_WIDTH = 1200;
  const MIN_VIEW_HEIGHT = 800;
  const PADDING = 120;

  const { positionMap, bounds, contentWidth, contentHeight } = useMemo(() => {
    if (!mapData) {
      return {
        positionMap: new Map(),
        bounds: { minX: 0, minY: 0, maxX: 0, maxY: 0 },
        contentWidth: MIN_VIEW_WIDTH,
        contentHeight: MIN_VIEW_HEIGHT,


      };
    }

    const map = new Map();
    const b = { minX: Infinity, maxX: -Infinity, minY: Infinity, maxY: -Infinity };

    const GRID_COLS = mapData.grid?.[0]?.length || 11;
    mapData.nodes.forEach(node => {
      // 使用旋转后的坐标（横版布局：左边起点，右边终点）
      const pos = offsetToPixelRotated(node.row, node.col, mapData.totalFloors, GRID_COLS, HEX_SIZE);
      map.set(`${node.row}-${node.col}`, pos);
      b.minX = Math.min(b.minX, pos.x);
      b.maxX = Math.max(b.maxX, pos.x);
      b.minY = Math.min(b.minY, pos.y);
      b.maxY = Math.max(b.maxY, pos.y);
    });

    if (map.size === 0) {
      b.minX = b.minY = 0;
      b.maxX = b.maxY = 1;
    }

    const width = b.maxX - b.minX + HEX_SIZE * 2;
    const height = b.maxY - b.minY + HEX_SIZE * 2;

    return {
      positionMap: map,
      bounds: b,
      contentWidth: width,
      contentHeight: height,
    };
  }, [mapData]);

  const VIEW_WIDTH = Math.max(MIN_VIEW_WIDTH, contentWidth + PADDING * 2);
  const VIEW_HEIGHT = Math.max(MIN_VIEW_HEIGHT, contentHeight + PADDING * 2);

  const previewOffset = useMemo(() => {
    const offsetX = VIEW_WIDTH / 2 - (contentWidth / 2 + PADDING);
    const offsetY = VIEW_HEIGHT / 2 - (contentHeight / 2 + PADDING);
    return { x: offsetX, y: offsetY };
  }, [VIEW_WIDTH, VIEW_HEIGHT, contentWidth, contentHeight]);

  // 初始化已探索节点（起点）
  useEffect(() => {
    if (mapData && mapData.startNode && exploredNodes.size === 0) {
      setExploredNodes(new Set([`${mapData.startNode.row}-${mapData.startNode.col}`]));
    }
  }, [mapData]);

  // 更新已探索节点
  useEffect(() => {
    if (activeNode) {
      setExploredNodes(prev => new Set([...prev, `${activeNode.row}-${activeNode.col}`]));
    }
  }, [activeNode]);

  if (!mapData || !mapData.grid || showLoading) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black">
        <div className="absolute inset-0 bg-cover bg-center opacity-60" style={{ backgroundImage: `url(https://pub-c98d5902eedf42f6a9765dfad981fd88.r2.dev/LoL/lolloading.jpg)` }}></div>
        <div className="relative z-10 flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-[#C8AA6E] border-t-transparent rounded-full animate-spin"></div>
          <div className="text-[#C8AA6E] text-2xl font-bold tracking-widest uppercase">Generating Map...</div>
          <div className="w-64 h-2 bg-gray-800 rounded-full overflow-hidden border border-[#C8AA6E]/30">
            <div className="h-full bg-[#C8AA6E] animate-[loading_2s_ease-in-out_infinite]" style={{ width: '100%' }}></div>
          </div>
        </div>
      </div>
    );
  }

  const { grid, totalFloors, startNode, bossNode } = mapData;
  const GRID_COLS = grid[0]?.length || 11;

  // ===========================
  // 获取可探索的相邻节点（三选一逻辑）
  // ===========================
  const getAvailableNodes = () => {
    if (!activeNode) return [];

    const neighbors = getHexNeighbors(activeNode.row, activeNode.col, totalFloors, GRID_COLS);
    const allAvailable = [];

    // 收集所有未探索的邻居，排除已锁定的选项
    for (const [r, c] of neighbors) {
      const neighbor = grid[r][c];
      if (!neighbor) continue;

      const nodeKey = `${r}-${c}`;
      // 排除已探索的节点
      if (exploredNodes.has(nodeKey)) continue;

      // 排除已锁定的选项（永久锁定，不能选择）
      if (lockedChoices.has(nodeKey)) continue;

      allAvailable.push(neighbor);
    }

    // 三选一逻辑：如果可用节点≤3个，全部显示；如果>3个，随机选择3个
    if (allAvailable.length <= 3) {
      return allAvailable;
    }

    // 随机选择3个（使用稳定的随机种子，基于节点位置）
    // 为了确保每次渲染时选择相同的3个节点，我们使用节点位置作为排序依据
    const shuffled = [...allAvailable].sort((a, b) => {
      const seedA = `${a.row}-${a.col}`;
      const seedB = `${b.row}-${b.col}`;
      return seedA.localeCompare(seedB);
    });

    // 使用简单的哈希函数基于activeNode位置生成"随机"索引
    const hash = (activeNode.row * 1000 + activeNode.col) % shuffled.length;
    const selected = [];
    for (let i = 0; i < 3; i++) {
      selected.push(shuffled[(hash + i) % shuffled.length]);
    }

    return selected;
  };

  // ===========================
  // 获取已锁定的选项（三选一中被排除的选项）
  // ===========================
  const getLockedNodes = () => {
    if (!activeNode) return new Set();

    const neighbors = getHexNeighbors(activeNode.row, activeNode.col, totalFloors, GRID_COLS);
    const allAvailable = [];

    // 收集所有未探索的邻居
    for (const [r, c] of neighbors) {
      const neighbor = grid[r][c];
      if (neighbor && !exploredNodes.has(`${r}-${c}`)) {
        allAvailable.push(neighbor);
      }
    }

    // 如果可用节点≤3个，没有锁定的选项
    if (allAvailable.length <= 3) {
      return new Set();
    }

    // 获取已选择的3个选项
    const selected = getAvailableNodes();
    const selectedSet = new Set(selected.map(n => `${n.row}-${n.col}`));

    // 返回被锁定的选项（所有可用节点中，不在selectedSet中的）
    const locked = new Set();
    for (const node of allAvailable) {
      const key = `${node.row}-${node.col}`;
      if (!selectedSet.has(key)) {
        locked.add(key);
      }
    }

    return locked;
  };

  // ===========================
  // 获取可见节点（战争迷雾）
  // ===========================
  const getVisibleNodes = () => {
    const visible = new Set();

    // 所有已探索的节点都可见
    for (const key of exploredNodes) {
      visible.add(key);

      // 获取该节点的相邻节点（战争迷雾边缘）
      const [row, col] = key.split('-').map(Number);
      const neighbors = getHexNeighbors(row, col, totalFloors, GRID_COLS);

      for (const [r, c] of neighbors) {
        if (grid[r][c]) {
          visible.add(`${r}-${c}`);
        }
      }
    }

    return visible;
  };

  const availableNodes = getAvailableNodes();
  const availableSet = new Set(availableNodes.map(n => `${n.row}-${n.col}`));
  const lockedSet = getLockedNodes();
  // 合并lockedChoices（从App.jsx传入的已锁定选项）
  const allLockedSet = new Set([...lockedSet, ...Array.from(lockedChoices).map(key => typeof key === 'string' ? key : `${key.row}-${key.col}`)]);
  const visibleSet = getVisibleNodes();

  // ===========================
  // 获取节点图标
  // ===========================
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
    if (node.type === 'CHEST') return `${PROFILEICON_URL}/2065.png`;
    if (node.type === 'BATTLE' && node.enemyId) {
      return ENEMY_POOL[node.enemyId]?.avatar || `${PROFILEICON_URL}/29.png`;
    }
    return null;
  };

  // ===========================
  // 获取节点颜色
  // ===========================
  const getNodeColor = (node) => {
    if (node.row === startNode.row && node.col === startNode.col) return '#4ade80';
    if (node.row === bossNode.row && node.col === bossNode.col) return '#ef4444';

    switch (node.type) {
      case 'BATTLE': return '#dc2626';
      case 'SHOP': return '#f59e0b';
      case 'EVENT': return '#3b82f6';
      case 'REST': return '#10b981';
      case 'CHEST': return '#8b5cf6';
      default: return '#6b7280';
    }
  };

  // ===========================
  // 居中地图
  // ===========================
  const centerMap = () => {
    if (!activeNode) return;

    const pos = positionMap.get(`${activeNode.row}-${activeNode.col}`);
    if (!pos) return;
    const nodeX = pos.x - bounds.minX + PADDING;
    const nodeY = pos.y - bounds.minY + PADDING;
    setDragOffset({
      x: VIEW_WIDTH / 2 - nodeX,
      y: VIEW_HEIGHT / 2 - nodeY
    });
  };

  // 预览全图 - 回到初始全图视图
  const handlePreviewAll = () => {
    setDragOffset(previewOffset);
  };

  // ===========================
  // 渲染六边形节点
  // ===========================
  const renderHexNode = (node) => {
    const key = `${node.row}-${node.col}`;
    const pos = positionMap.get(key);
    if (!pos) return null;

    const isExplored = exploredNodes.has(key);
    const isAvailable = availableSet.has(key);
    const isLocked = allLockedSet.has(key);
    const isCurrent = activeNode && node.row === activeNode.row && node.col === activeNode.col;
    const isVisible = visibleSet.has(key);

    // 战争迷雾：不可见的节点显示为迷雾状态
    // if (!isVisible) return null;
    const isFogged = !isVisible;

    const x = pos.x - bounds.minX + PADDING + dragOffset.x;
    const y = pos.y - bounds.minY + PADDING + dragOffset.y;

    const color = getNodeColor(node);
    const icon = getMapIcon(node);

    // 六边形路径
    const hexPath = Array.from({ length: 6 }, (_, i) => {
      const angle = Math.PI / 3 * i;
      const hx = HEX_SIZE * 0.85 * Math.cos(angle);
      const hy = HEX_SIZE * 0.85 * Math.sin(angle);
      return `${hx},${hy}`;
    }).join(' ');

    return (
      <g key={key} transform={`translate(${x}, ${y})`}>
        {/* 连接线（只显示已探索节点之间的连接） */}
        {isExplored && (() => {
          const neighbors = getHexNeighbors(node.row, node.col, totalFloors, GRID_COLS);
          return neighbors.map(([r, c]) => {
            const neighbor = grid[r][c];
            if (!neighbor || !exploredNodes.has(`${r}-${c}`)) return null;

            const nPos = positionMap.get(`${r}-${c}`);
            if (!nPos) return null;
            const nx = nPos.x - bounds.minX + PADDING + dragOffset.x;
            const ny = nPos.y - bounds.minY + PADDING + dragOffset.y;

            return (
              <line
                key={`${key}-${r}-${c}`}
                x1={0}
                y1={0}
                x2={nx - x}
                y2={ny - y}
                stroke="rgba(200, 170, 110, 0.3)"
                strokeWidth="2"
              />
            );
          });
        })()}

        {/* 六边形背景 */}
        <polygon
          points={hexPath}
          fill={isFogged ? 'url(#fogGradient)' : (isExplored ? 'rgba(255,255,255,0.1)' : color)}
          fillOpacity={isFogged ? 0.8 : (isExplored ? 1 : (isAvailable ? 0.8 : (isLocked ? 0.2 : 0.3)))}
          stroke={
            isFogged ? 'rgba(255,255,255,0.05)' :
              isCurrent ? '#fff' :
                isAvailable ? '#C8AA6E' :
                  isLocked ? 'rgba(100,100,100,0.5)' :
                    'rgba(255,255,255,0.2)'
          }
          strokeWidth={isCurrent ? 4 : (isAvailable ? 3 : 1)}
          style={{ cursor: (isAvailable && !isLocked && !isFogged) ? 'pointer' : 'default' }}
          onClick={() => {
            if (isAvailable && !isLocked && !isFogged) {
              onNodeSelect(node);
            }
          }}
        />

        {/* 节点图标 */}
        {icon && (
          <image
            href={icon}
            x={-HEX_SIZE * ICON_SCALE * 0.5}
            y={-HEX_SIZE * ICON_SCALE * 0.5}
            width={HEX_SIZE * ICON_SCALE}
            height={HEX_SIZE * ICON_SCALE}
            clipPath="url(#hexClip)"
            opacity={isFogged ? 0 : (isExplored ? 0.6 : (isAvailable ? 1 : (isLocked ? 0.2 : 0.4)))}
            pointerEvents="none"
          />
        )}

        {/* 锁定标记（三选一中被排除的选项） */}
        {isLocked && !isExplored && !isFogged && (
          <text
            x="0"
            y="0"
            fill="rgba(150,150,150,0.8)"
            fontSize="20"
            fontWeight="bold"
            textAnchor="middle"
            dominantBaseline="central"
          >
            ✕
          </text>
        )}

        {/* 已探索标记 */}
        {isExplored && node !== activeNode && (
          <text
            x="0"
            y="0"
            fill="#C8AA6E"
            fontSize="24"
            fontWeight="bold"
            textAnchor="middle"
            dominantBaseline="central"
          >
            ✓
          </text>
        )}
      </g>
    );
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full overflow-hidden"
      style={{
        width: VIEW_WIDTH,
        height: VIEW_HEIGHT,
        margin: '0 auto',
        background: 'radial-gradient(circle at center, #1a1f35 0%, #0a0e27 100%)'
      }}
    >
      {/* SVG地图 */}
      <svg
        width={VIEW_WIDTH}
        height={VIEW_HEIGHT}
        style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
        onMouseDown={(e) => {
          setIsDragging(true);
          e.currentTarget.dataset.startX = e.clientX - dragOffset.x;
          e.currentTarget.dataset.startY = e.clientY - dragOffset.y;
        }}
        onMouseMove={(e) => {
          if (!isDragging) return;
          const startX = parseFloat(e.currentTarget.dataset.startX);
          const startY = parseFloat(e.currentTarget.dataset.startY);
          setDragOffset({
            x: e.clientX - startX,
            y: e.clientY - startY
          });
        }}
        onMouseUp={() => setIsDragging(false)}
        onMouseLeave={() => setIsDragging(false)}
      >
        <defs>
          <linearGradient id="fogGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1a1a2e" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#131325" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#0a0e27" stopOpacity="0.98" />
          </linearGradient>
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2.5" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <clipPath id="hexClip">
            <polygon points={Array.from({ length: 6 }, (_, i) => {
              const angle = Math.PI / 3 * i;
              const hx = HEX_SIZE * 0.5 * Math.cos(angle);
              const hy = HEX_SIZE * 0.5 * Math.sin(angle);
              return `${hx},${hy}`;
            }).join(' ')} />
          </clipPath>
        </defs>

        {/* 渲染所有可见节点 */}
        {mapData.nodes.map(node => renderHexNode(node))}
      </svg>

      {/* 居中按钮 */}
      {/* 按钮组 */}
      <div className="absolute bottom-4 right-4 flex flex-col gap-2">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handlePreviewAll}
          className="bg-[#C8AA6E] text-[#0a0e27] px-4 py-2 rounded-lg font-bold shadow-lg"
        >
          预览全图
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={centerMap}
          className="bg-[#C8AA6E] text-[#0a0e27] px-4 py-2 rounded-lg font-bold shadow-lg"
        >
          居中节点
        </motion.button>
      </div>

      {/* 探索信息 */}
      <div className="absolute top-4 left-4 bg-black/80 px-4 py-2 rounded-lg border border-[#C8AA6E]/30">
        <div className="text-[#C8AA6E] text-sm">
          <div>已探索: {exploredNodes.size} / {mapData.nodes.length}</div>
          <div>可选方向: {availableNodes.length}</div>
        </div>
      </div>
    </div>
  );
};

export default GridMapView_v3;

