/**
 * HexagonNode.jsx - 六边形节点组件 (Performance Optimized)
 * 
 * 用于渲染单个地图节点，支持：
 * - SVG六边形形状
 * - 节点状态样式（LOCKED/AVAILABLE/COMPLETED）
 * - 节点类型图标（战斗/商店/事件/休息/宝箱/BOSS）
 * - 动画效果（hover/click）
 * 
 * 性能优化：
 * - React.memo with custom comparison
 * - Memoized hexPath calculation
 * - CSS animations instead of JS
 * - Reduced motion for static nodes
 */

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { generateHexagonPath } from '../utils/hexagonGrid';

// ===========================
// Pure Functions (outside component for performance)
// ===========================

const CDN_URL = 'https://ddragon.leagueoflegends.com/cdn/13.24.1';
const ITEM_URL = `${CDN_URL}/img/item`;
const PROFILEICON_URL = `${CDN_URL}/img/profileicon`;

// 节点状态样式 - Pure function
const getNodeStyle = (node, isHighlighted, isFogged) => {
  const { type, status } = node;

  // 基础颜色（根据节点类型）
  let fillColor = '#1E2328'; // 默认深灰
  let strokeColor = '#3C3C3C'; // 默认边框
  let strokeWidth = 2;

  switch (type) {
    case 'START':
      fillColor = '#0A7B83';
      strokeColor = '#0BC5DE';
      break;
    case 'BOSS':
      fillColor = '#8B0000';
      strokeColor = '#FF0000';
      strokeWidth = 3;
      break;
    case 'BATTLE':
      fillColor = '#4A2F2F';
      strokeColor = '#FF6B35';
      break;
    case 'SHOP':
      fillColor = '#2F4A2F';
      strokeColor = '#F4C430';
      break;
    case 'REST':
      fillColor = '#2F2F4A';
      strokeColor = '#00CED1';
      break;
    case 'CHEST':
      fillColor = '#4A3C2F';
      strokeColor = '#FFD700';
      break;
    case 'EVENT':
      fillColor = '#3C2F4A';
      strokeColor = '#9370DB';
      break;
    default:
      break;
  }

  // 状态修饰
  if (status === 'COMPLETED') {
    fillColor = '#0F1419'; // 深色（已完成）
    strokeColor = '#555555';
  }

  if (isHighlighted) {
    strokeColor = '#C8AA6E'; // LOL金色高亮
    strokeWidth = 4;
  }

  // 迷雾效果
  const opacity = isFogged ? 0.3 : 1;

  return {
    fill: fillColor,
    stroke: strokeColor,
    strokeWidth,
    opacity
  };
};

// 获取节点图标URL - Pure function
const getNodeIcon = (node, isFogged) => {
  if (isFogged && node.status !== 'COMPLETED') {
    return null; // 迷雾中不显示图标
  }

  switch (node.type) {
    case 'BOSS':
      // 根据act显示不同BOSS头像
      const bossNames = { 1: 'Darius', 2: 'Viego', 3: 'Belveth' };
      return `${CDN_URL}/img/champion/${bossNames[node.act] || 'Darius'}.png`;
    case 'REST':
      return `${ITEM_URL}/2003.png`; // 血瓶
    case 'SHOP':
      return `${ITEM_URL}/3400.png`; // 金币
    case 'EVENT':
      return `${ITEM_URL}/3340.png`; // 问号
    case 'CHEST':
      return `${PROFILEICON_URL}/2065.png`; // 宝箱
    case 'BATTLE':
      if (node.enemyId) {
        // 显示敌人头像
        return `${CDN_URL}/img/champion/${node.enemyId.split('_')[0]}.png`;
      }
      return `${ITEM_URL}/1055.png`; // 剑（默认战斗图标）
    case 'START':
      return `${ITEM_URL}/2055.png`; // 起点标记
    default:
      return null;
  }
};

// ===========================
// Main Component
// ===========================

const HexagonNode = ({
  node,
  position,
  size = 50,
  isClickable = false,
  isHighlighted = false,
  isFogged = false,
  onClick
}) => {
  if (!node) return null;

  const { x, y } = position;

  // Memoize hexPath - only recalculate if position/size changes
  const hexPath = useMemo(
    () => generateHexagonPath(x, y, size),
    [x, y, size]
  );

  // Memoize node style
  const nodeStyle = useMemo(
    () => getNodeStyle(node, isHighlighted, isFogged),
    [node.type, node.status, isHighlighted, isFogged]
  );

  // Memoize icon URL
  const iconUrl = useMemo(
    () => getNodeIcon(node, isFogged),
    [node.type, node.enemyId, node.act, node.status, isFogged]
  );

  // Optimize animation props - only animate interactive nodes
  const motionProps = isClickable ? {
    whileHover: { scale: 1.1 },
    whileTap: { scale: 0.95 },
    transition: { type: "spring", stiffness: 400, damping: 17 }
  } : {};

  return (
    <motion.g
      className={isClickable ? 'cursor-pointer' : ''}
      onClick={isClickable ? onClick : undefined}
      {...motionProps}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: nodeStyle.opacity, scale: 1 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      style={{ willChange: isClickable ? 'transform' : 'auto' }}
    >
      {/* 定义裁剪路径 - only if needed */}
      {iconUrl && (
        <defs>
          <clipPath id={`hexClip-${node.id}`}>
            <path d={hexPath} />
          </clipPath>
        </defs>
      )}

      {/* 六边形背景 */}
      <path
        d={hexPath}
        fill={nodeStyle.fill}
        stroke={nodeStyle.stroke}
        strokeWidth={nodeStyle.strokeWidth}
        shapeRendering="optimizeSpeed"
      />

      {/* 节点图标 */}
      {iconUrl && (
        <image
          href={iconUrl}
          x={x - size * 0.6}
          y={y - size * 0.6}
          width={size * 1.2}
          height={size * 1.2}
          clipPath={`url(#hexClip-${node.id})`}
          opacity={node.status === 'COMPLETED' ? 0.5 : 0.9}
        />
      )}

      {/* 已完成标记 */}
      {node.status === 'COMPLETED' && (
        <text
          x={x}
          y={y + 5}
          textAnchor="middle"
          fill="#C8AA6E"
          fontSize="24"
          fontWeight="bold"
          style={{ textShadow: '0 2px 4px rgba(0,0,0,0.8)', pointerEvents: 'none' }}
        >
          ✓
        </text>
      )}

      {/* 高亮光效 - CSS animation instead of JS */}
      {isHighlighted && (
        <path
          d={hexPath}
          fill="none"
          stroke="#C8AA6E"
          strokeWidth="3"
          className="highlighted-glow"
          style={{
            filter: 'drop-shadow(0 0 6px #C8AA6E)',
            animation: 'pulse-glow 2s ease-in-out infinite'
          }}
        />
      )}
    </motion.g>
  );
};

// ===========================
// React.memo with custom comparison for performance
// ===========================
export default React.memo(HexagonNode, (prevProps, nextProps) => {
  // Only re-render if these critical props change
  return (
    prevProps.node.id === nextProps.node.id &&
    prevProps.node.status === nextProps.node.status &&
    prevProps.node.type === nextProps.node.type &&
    prevProps.isClickable === nextProps.isClickable &&
    prevProps.isHighlighted === nextProps.isHighlighted &&
    prevProps.isFogged === nextProps.isFogged &&
    prevProps.position.x === nextProps.position.x &&
    prevProps.position.y === nextProps.position.y
  );
});
