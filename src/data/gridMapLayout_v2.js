/**
 * 六边形网格地图生成器 v2
 * 支持动态层数和步数约束
 * 
 * 设计目标：
 * - ACT1: 10层，10-15步到BOSS
 * - ACT2: 20层，20-40步到BOSS
 * - ACT3: 30层，30-60步到BOSS
 */

import { getNeighborInDirection, offsetToPixel, hexDistance } from '../utils/hexagonGrid';
import { ENEMY_POOL } from './enemies';

// 网格配置
export const GRID_COLS = 7; // 列数固定

// ACT配置
const ACT_CONFIG = {
  1: { floors: 10, minSteps: 10, maxSteps: 15 },
  2: { floors: 20, minSteps: 20, maxSteps: 40 },
  3: { floors: 30, minSteps: 30, maxSteps: 60 }
};

// 节点类型权重
const NODE_WEIGHTS = {
  BATTLE: 0.5,  // 50% 战斗
  EVENT: 0.2,   // 20% 事件
  SHOP: 0.15,   // 15% 商店
  REST: 0.1,    // 10% 休息
  CHEST: 0.05   // 5% 宝箱
};

/**
 * 根据权重随机选择节点类型
 */
function getRandomNodeType(excludeTypes = []) {
  const rand = Math.random();
  let cumulative = 0;
  
  const types = Object.entries(NODE_WEIGHTS).filter(([type]) => !excludeTypes.includes(type));
  
  for (const [type, weight] of types) {
    cumulative += weight;
    if (rand < cumulative) return type;
  }
  
  return 'BATTLE'; // 默认
}

/**
 * 获取BOSS ID
 */
function getBossId(act) {
  if (act === 1) return 'Darius_BOSS';
  if (act === 2) return 'Viego_BOSS';
  return 'BelVeth_BOSS';
}

/**
 * 获取随机敌人（避免重复）
 */
function getRandomEnemy(act, usedEnemies = []) {
  const actEnemies = Object.entries(ENEMY_POOL)
    .filter(([id, enemy]) => enemy.act === act && enemy.difficultyRank < 99)
    .map(([id]) => id);
  
  const availableEnemies = actEnemies.filter(id => !usedEnemies.includes(id));
  
  if (availableEnemies.length === 0) {
    return actEnemies[Math.floor(Math.random() * actEnemies.length)] || 'Katarina';
  }
  
  return availableEnemies[Math.floor(Math.random() * availableEnemies.length)];
}

/**
 * 创建节点对象
 */
function createNode(row, col, type, act, usedEnemies = []) {
  const id = `${row}-${col}`;
  const position = offsetToPixel(row, col);
  
  const node = {
    id,
    row,
    col,
    type,
    status: 'LOCKED',
    next: [],
    prev: [],
    position,
    enemyId: null
  };
  
  // 为战斗节点分配敌人
  if (type === 'BATTLE') {
    node.enemyId = getRandomEnemy(act, usedEnemies);
    usedEnemies.push(node.enemyId);
  } else if (type === 'BOSS') {
    node.enemyId = getBossId(act);
  }
  
  return node;
}

/**
 * 阶段1: 初始化网格
 */
function initializeGrid(act) {
  const config = ACT_CONFIG[act];
  const totalFloors = config.floors;
  
  // 创建空网格（totalFloors x GRID_COLS）
  const grid = Array.from({ length: totalFloors }, () => 
    Array.from({ length: GRID_COLS }, () => null)
  );
  
  return { grid, totalFloors, config };
}

/**
 * 阶段2: 放置关键节点（起点 + BOSS）
 */
function placeKeyNodes(grid, totalFloors, act, usedEnemies) {
  const nodes = [];
  
  // 起点：第0层，中间列（col = 3）
  const startCol = Math.floor(GRID_COLS / 2);
  const startNode = createNode(0, startCol, 'START', act, usedEnemies);
  startNode.status = 'AVAILABLE'; // 起点默认可用
  grid[0][startCol] = startNode;
  nodes.push(startNode);
  
  // BOSS：最后一层，随机选择边缘或角落（col = 0, 1, 5, 6）
  const bossCol = [0, 1, 5, 6][Math.floor(Math.random() * 4)];
  const bossRow = totalFloors - 1;
  const bossNode = createNode(bossRow, bossCol, 'BOSS', act, usedEnemies);
  grid[bossRow][bossCol] = bossNode;
  nodes.push(bossNode);
  
  return { nodes, startNode, bossNode };
}

/**
 * 阶段3: 生成主路径（确保可达）
 * 使用随机游走算法，从起点走到BOSS
 */
function generateMainPath(grid, startNode, bossNode, totalFloors, act, usedEnemies, nodes) {
  let currentNode = startNode;
  const mainPath = [startNode];
  
  // 从第1层开始，一直到BOSS前一层
  for (let floor = 1; floor < totalFloors - 1; floor++) {
    // 获取当前节点的"前方"邻居（3个方向）
    const directions = ['forward-left', 'forward', 'forward-right'];
    const candidates = directions
      .map(dir => {
        const neighbor = getNeighborInDirection(currentNode.row, currentNode.col, dir, totalFloors, GRID_COLS);
        return neighbor ? { row: neighbor[0], col: neighbor[1], dir } : null;
      })
      .filter(Boolean)
      .filter(({ row, col }) => !grid[row][col]); // 过滤已占用的格子
    
    if (candidates.length === 0) {
      console.warn(`[MainPath] Floor ${floor}: No candidates available. Forcing fallback.`);
      // 强制选择一个空位（向BOSS方向偏移）
      const targetCol = currentNode.col + (bossNode.col > currentNode.col ? 1 : -1);
      const clampedCol = Math.max(0, Math.min(GRID_COLS - 1, targetCol));
      
      if (grid[floor][clampedCol]) {
        // 如果目标位置被占用，随机选择附近空位
        for (let offset = 0; offset < GRID_COLS; offset++) {
          const testCol = (clampedCol + offset) % GRID_COLS;
          if (!grid[floor][testCol]) {
            candidates.push({ row: floor, col: testCol });
            break;
          }
        }
      } else {
        candidates.push({ row: floor, col: clampedCol });
      }
    }
    
    // 随机选择一个候选位置
    const chosen = candidates[Math.floor(Math.random() * candidates.length)];
    
    // 创建节点
    const nodeType = floor === totalFloors - 2 
      ? getRandomNodeType(['BOSS']) // 倒数第二层不放BOSS
      : getRandomNodeType();
    
    const newNode = createNode(chosen.row, chosen.col, nodeType, act, usedEnemies);
    grid[chosen.row][chosen.col] = newNode;
    nodes.push(newNode);
    
    // 建立连接
    currentNode.next.push(newNode.id);
    newNode.prev.push(currentNode.id);
    
    currentNode = newNode;
    mainPath.push(newNode);
  }
  
  // 连接最后一个节点到BOSS
  currentNode.next.push(bossNode.id);
  bossNode.prev.push(currentNode.id);
  mainPath.push(bossNode);
  
  console.log(`[MainPath] Generated: ${mainPath.length} nodes (${totalFloors} floors)`);
  
  return mainPath;
}

/**
 * 阶段4: 生成分支（实现"三选一"）
 * 目标：确保玩家每步有2-3个选择
 */
function generateBranches(grid, nodes, totalFloors, act, config, usedEnemies) {
  let totalNodes = nodes.length;
  const targetMinSteps = config.minSteps;
  const targetMaxSteps = config.maxSteps;
  
  // 计算目标节点数（平均步数 * 1.5，确保有足够分支）
  const avgSteps = (targetMinSteps + targetMaxSteps) / 2;
  const targetNodeCount = Math.floor(avgSteps * 1.3);
  
  console.log(`[Branches] Target: ${targetNodeCount} nodes (current: ${totalNodes})`);
  
  // 遍历每一层（除了起点和BOSS层）
  for (let floor = 0; floor < totalFloors - 1; floor++) {
    if (totalNodes >= targetNodeCount) break; // 已满足节点数
    
    // 找出当前层的所有节点
    const currentFloorNodes = nodes.filter(n => n.row === floor && n.type !== 'START');
    
    for (const node of currentFloorNodes) {
      if (totalNodes >= targetNodeCount) break;
      
      // 如果该节点的next数量 < 3，尝试添加分支
      if (node.next.length < 3) {
        const directions = ['forward-left', 'forward', 'forward-right'];
        
        for (const dir of directions) {
          if (node.next.length >= 3) break; // 已有3个分支
          
          const neighbor = getNeighborInDirection(node.row, node.col, dir, totalFloors, GRID_COLS);
          if (!neighbor) continue;
          
          const [nextRow, nextCol] = neighbor;
          
          // 检查该位置是否已有节点
          if (grid[nextRow][nextCol]) {
            const existingNode = grid[nextRow][nextCol];
            // 如果已有节点，但未连接，则建立连接
            if (!node.next.includes(existingNode.id)) {
              node.next.push(existingNode.id);
              if (!existingNode.prev.includes(node.id)) {
                existingNode.prev.push(node.id);
              }
            }
          } else {
            // 创建新节点
            const nodeType = getRandomNodeType();
            const newNode = createNode(nextRow, nextCol, nodeType, act, usedEnemies);
            grid[nextRow][nextCol] = newNode;
            nodes.push(newNode);
            totalNodes++;
            
            // 建立连接
            node.next.push(newNode.id);
            newNode.prev.push(node.id);
            
            console.log(`[Branches] Added node at (${nextRow}, ${nextCol}) - Type: ${nodeType}`);
            
            if (totalNodes >= targetNodeCount) break;
          }
        }
      }
    }
  }
  
  console.log(`[Branches] Final node count: ${totalNodes}`);
}

/**
 * 阶段5: 验证与修正
 * - BFS检查BOSS可达性
 * - 修正孤立节点
 * - 检查步数是否在范围内
 */
function validateAndFix(grid, nodes, startNode, bossNode, config, totalFloors) {
  // 5.1: BFS检查可达性
  const { reachable, distance } = bfsCheck(nodes, startNode, bossNode);
  
  if (!reachable) {
    console.error('[Validation] BOSS is NOT reachable! Force connecting...');
    // 强制连接：找到最靠近BOSS的节点，连接到BOSS
    const closestNode = nodes
      .filter(n => n.row === bossNode.row - 1)
      .sort((a, b) => hexDistance(a.row, a.col, bossNode.row, bossNode.col) - hexDistance(b.row, b.col, bossNode.row, bossNode.col))[0];
    
    if (closestNode) {
      closestNode.next.push(bossNode.id);
      bossNode.prev.push(closestNode.id);
      console.log(`[Validation] Connected ${closestNode.id} -> BOSS`);
    }
  } else {
    console.log(`[Validation] ✅ BOSS reachable! Shortest path: ${distance} steps`);
  }
  
  // 5.2: 修正孤立节点（没有prev的节点，除了起点）
  nodes.forEach(node => {
    if (node.type !== 'START' && node.prev.length === 0 && node.row > 0) {
      console.warn(`[Validation] Orphaned node at ${node.id}. Connecting to previous floor...`);
      
      // 找到上一层的节点，随机连接一个
      const prevFloorNodes = nodes.filter(n => n.row === node.row - 1);
      if (prevFloorNodes.length > 0) {
        const randomParent = prevFloorNodes[Math.floor(Math.random() * prevFloorNodes.length)];
        randomParent.next.push(node.id);
        node.prev.push(randomParent.id);
        console.log(`[Validation] Connected ${randomParent.id} -> ${node.id}`);
      }
    }
  });
  
  // 5.3: 检查步数范围
  const finalCheck = bfsCheck(nodes, startNode, bossNode);
  const minSteps = finalCheck.distance;
  const maxSteps = countMaxSteps(nodes, startNode, bossNode);
  
  console.log(`[Validation] Steps range: ${minSteps} - ${maxSteps} (target: ${config.minSteps} - ${config.maxSteps})`);
  
  if (minSteps < config.minSteps || minSteps > config.maxSteps) {
    console.warn(`[Validation] ⚠️ Minimum steps out of range: ${minSteps} (expected: ${config.minSteps} - ${config.maxSteps})`);
  }
  
  return { minSteps, maxSteps, reachable: finalCheck.reachable };
}

/**
 * BFS检查可达性和最短路径
 */
function bfsCheck(nodes, startNode, bossNode) {
  const visited = new Set();
  const queue = [[startNode, 0]]; // [node, distance]
  
  while (queue.length > 0) {
    const [current, dist] = queue.shift();
    
    if (current.id === bossNode.id) {
      return { reachable: true, distance: dist };
    }
    
    if (visited.has(current.id)) continue;
    visited.add(current.id);
    
    current.next.forEach(nextId => {
      const nextNode = nodes.find(n => n.id === nextId);
      if (nextNode && !visited.has(nextId)) {
        queue.push([nextNode, dist + 1]);
      }
    });
  }
  
  return { reachable: false, distance: -1 };
}

/**
 * DFS计算最长路径（估算maxSteps）
 */
function countMaxSteps(nodes, startNode, bossNode) {
  const visited = new Set();
  
  function dfs(node, steps) {
    if (node.id === bossNode.id) return steps;
    
    visited.add(node.id);
    let maxSteps = steps;
    
    node.next.forEach(nextId => {
      if (!visited.has(nextId)) {
        const nextNode = nodes.find(n => n.id === nextId);
        if (nextNode) {
          maxSteps = Math.max(maxSteps, dfs(nextNode, steps + 1));
        }
      }
    });
    
    visited.delete(node.id);
    return maxSteps;
  }
  
  return dfs(startNode, 0);
}

/**
 * 主生成函数
 * @param {number} act - 当前章节 (1/2/3)
 * @param {Array} usedEnemies - 已使用的敌人ID（避免重复）
 * @returns {Object} - { grid, nodes, startNode, bossNode, stats }
 */
export function generateGridMap(act = 1, usedEnemies = []) {
  console.log(`\n=== Generating Map for ACT ${act} ===`);
  
  // 阶段1: 初始化
  const { grid, totalFloors, config } = initializeGrid(act);
  console.log(`[Init] Grid: ${totalFloors} floors x ${GRID_COLS} cols`);
  
  // 阶段2: 放置关键节点
  const { nodes, startNode, bossNode } = placeKeyNodes(grid, totalFloors, act, usedEnemies);
  console.log(`[KeyNodes] Start: ${startNode.id}, Boss: ${bossNode.id}`);
  
  // 阶段3: 生成主路径
  const mainPath = generateMainPath(grid, startNode, bossNode, totalFloors, act, usedEnemies, nodes);
  
  // 阶段4: 生成分支
  generateBranches(grid, nodes, totalFloors, act, config, usedEnemies);
  
  // 阶段5: 验证与修正
  const stats = validateAndFix(grid, nodes, startNode, bossNode, config, totalFloors);
  
  console.log(`=== Map Generation Complete ===\n`);
  console.log(`Stats:`, {
    totalNodes: nodes.length,
    minSteps: stats.minSteps,
    maxSteps: stats.maxSteps,
    reachable: stats.reachable
  });
  
  return {
    grid,
    nodes,
    startNode,
    bossNode,
    stats,
    act,
    totalFloors
  };
}

