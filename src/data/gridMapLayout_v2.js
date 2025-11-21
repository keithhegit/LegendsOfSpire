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
  
  // BOSS：最后一层，随机选择列（增加变化性）
  // ACT1/2: 边缘或角落，ACT3: 任意列
  let bossCol;
  if (act <= 2) {
    bossCol = [0, 1, 5, 6][Math.floor(Math.random() * 4)];
  } else {
    bossCol = Math.floor(Math.random() * GRID_COLS);
  }
  
  const bossRow = totalFloors - 1;
  const bossNode = createNode(bossRow, bossCol, 'BOSS', act, usedEnemies);
  grid[bossRow][bossCol] = bossNode;
  nodes.push(bossNode);
  
  return { nodes, startNode, bossNode };
}

/**
 * 阶段3: 生成主路径（确保可达）
 * 新算法：生成多条交织路径，增加横向扩展
 */
function generateMainPath(grid, startNode, bossNode, totalFloors, act, usedEnemies, nodes) {
  const mainPath = [startNode];
  
  // 策略：生成2-3条起始路径，增加横向覆盖
  const numInitialPaths = Math.min(3, GRID_COLS - 2); // 最多3条路径
  const startingCols = [
    startNode.col - 1, // 左侧
    startNode.col,     // 中间
    startNode.col + 1  // 右侧
  ].filter(col => col >= 0 && col < GRID_COLS);
  
  let currentLevelNodes = [startNode];
  
  // 逐层生成，确保每层至少1个节点，最多3-4个节点
  for (let floor = 1; floor < totalFloors - 1; floor++) {
    const newLevelNodes = [];
    
    // 根据楼层调整节点密度（前期少，中期多，后期收敛）
    const densityFactor = Math.sin((floor / totalFloors) * Math.PI); // 0 -> 1 -> 0 的曲线
    const targetNodesThisFloor = Math.floor(2 + densityFactor * 2); // 2-4个节点
    
    // 为当前层的每个节点生成1-2个子节点
    const usedColsThisFloor = new Set();
    let attempts = 0;
    const maxAttempts = 20; // 防止无限循环
    
    for (const parentNode of currentLevelNodes) {
      if (newLevelNodes.length >= targetNodesThisFloor) break;
      
      const childrenCount = Math.random() < 0.6 ? 2 : 1; // 60%概率生成2个子节点
      
      for (let i = 0; i < childrenCount; i++) {
        if (newLevelNodes.length >= targetNodesThisFloor) break;
        attempts++;
        if (attempts > maxAttempts) break;
        
        // 随机偏移（允许更大的横向移动）
        const colOffset = Math.floor(Math.random() * 5) - 2; // -2 to +2
        let targetCol = parentNode.col + colOffset;
        targetCol = Math.max(0, Math.min(GRID_COLS - 1, targetCol));
        
        // 避免同一层重复列
        if (usedColsThisFloor.has(targetCol) || grid[floor][targetCol]) {
          // 尝试找附近空位
          let found = false;
          for (let offset = 1; offset < GRID_COLS; offset++) {
            const testCol1 = (targetCol + offset) % GRID_COLS;
            const testCol2 = (targetCol - offset + GRID_COLS) % GRID_COLS;
            
            if (!usedColsThisFloor.has(testCol1) && !grid[floor][testCol1]) {
              targetCol = testCol1;
              found = true;
              break;
            }
            if (!usedColsThisFloor.has(testCol2) && !grid[floor][testCol2]) {
              targetCol = testCol2;
              found = true;
              break;
            }
          }
          if (!found) continue; // 跳过这个子节点
        }
        
        // 如果仍然被占用，跳过
        if (grid[floor][targetCol]) continue;
        
        // 创建节点
        const nodeType = getRandomNodeType();
        const newNode = createNode(floor, targetCol, nodeType, act, usedEnemies);
        grid[floor][targetCol] = newNode;
        nodes.push(newNode);
        newLevelNodes.push(newNode);
        usedColsThisFloor.add(targetCol);
        
        // 建立连接
        parentNode.next.push(newNode.id);
        newNode.prev.push(parentNode.id);
        mainPath.push(newNode);
      }
    }
    
    // 如果这一层没有生成任何节点（异常情况），强制生成至少1个
    if (newLevelNodes.length === 0) {
      console.warn(`[MainPath] Floor ${floor}: No nodes generated, forcing at least one`);
      
      // 尝试所有列，找到第一个空位
      for (let col = 0; col < GRID_COLS; col++) {
        if (!grid[floor][col]) {
          const fallbackNode = createNode(floor, col, getRandomNodeType(), act, usedEnemies);
          grid[floor][col] = fallbackNode;
          nodes.push(fallbackNode);
          newLevelNodes.push(fallbackNode);
          
          // 随机连接到上一层的某个节点
          const randomParent = currentLevelNodes[Math.floor(Math.random() * currentLevelNodes.length)];
          randomParent.next.push(fallbackNode.id);
          fallbackNode.prev.push(randomParent.id);
          mainPath.push(fallbackNode);
          
          break;
        }
      }
    }
    
    currentLevelNodes = newLevelNodes;
  }
  
  // 连接最后一层所有节点到BOSS
  for (const node of currentLevelNodes) {
    node.next.push(bossNode.id);
    bossNode.prev.push(node.id);
  }
  mainPath.push(bossNode);
  
  console.log(`[MainPath] Generated: ${nodes.length} nodes across ${totalFloors} floors`);
  
  return mainPath;
}

/**
 * 阶段4: 生成横向连接（增加路径多样性）
 * 新策略：在同一层节点之间创建横向连接，形成"之字形"路径
 */
function generateBranches(grid, nodes, totalFloors, act, config, usedEnemies) {
  let totalNodes = nodes.length;
  const targetMaxSteps = config.maxSteps;
  
  console.log(`[Branches] Adding cross-floor connections to increase path diversity`);
  
  // 策略1: 为每个节点确保至少2个next节点（三选一的前提）
  for (let floor = 0; floor < totalFloors - 2; floor++) {
    const currentFloorNodes = nodes.filter(n => n.row === floor);
    
    for (const node of currentFloorNodes) {
      // 如果next数量 < 2，尝试连接到下一层的其他节点
      while (node.next.length < 2) {
        const nextFloorNodes = nodes.filter(n => n.row === floor + 1 && !node.next.includes(n.id));
        
        if (nextFloorNodes.length === 0) {
          // 如果下一层没有可连接的节点，创建一个新节点
          const randomCol = Math.floor(Math.random() * GRID_COLS);
          if (!grid[floor + 1][randomCol]) {
            const newNode = createNode(floor + 1, randomCol, getRandomNodeType(), act, usedEnemies);
            grid[floor + 1][randomCol] = newNode;
            nodes.push(newNode);
            totalNodes++;
            
            node.next.push(newNode.id);
            newNode.prev.push(node.id);
          } else {
            // 如果位置被占用，连接到该节点
            const existingNode = grid[floor + 1][randomCol];
            if (!node.next.includes(existingNode.id)) {
              node.next.push(existingNode.id);
              if (!existingNode.prev.includes(node.id)) {
                existingNode.prev.push(node.id);
              }
            }
          }
          break;
        }
        
        // 随机连接到下一层的一个节点
        const targetNode = nextFloorNodes[Math.floor(Math.random() * nextFloorNodes.length)];
        node.next.push(targetNode.id);
        if (!targetNode.prev.includes(node.id)) {
          targetNode.prev.push(node.id);
        }
      }
    }
  }
  
  // 策略2: 在同一层节点之间创建"横向跳跃"连接（增加之字形路径）
  // 这会显著增加最长路径
  for (let floor = 1; floor < totalFloors - 2; floor++) {
    const currentFloorNodes = nodes.filter(n => n.row === floor).sort((a, b) => a.col - b.col);
    
    if (currentFloorNodes.length >= 2) {
      // 随机选择相邻的节点对，创建"回流"连接
      for (let i = 0; i < currentFloorNodes.length - 1; i++) {
        const node1 = currentFloorNodes[i];
        const node2 = currentFloorNodes[i + 1];
        
        // 30%概率创建横向连接
        if (Math.random() < 0.3) {
          // node1 连接到 node2 的子节点
          const node2Children = node2.next.map(id => nodes.find(n => n.id === id)).filter(Boolean);
          if (node2Children.length > 0) {
            const randomChild = node2Children[Math.floor(Math.random() * node2Children.length)];
            if (!node1.next.includes(randomChild.id)) {
              node1.next.push(randomChild.id);
              if (!randomChild.prev.includes(node1.id)) {
                randomChild.prev.push(node1.id);
              }
              console.log(`[Branches] Cross-connection: (${node1.row},${node1.col}) -> (${randomChild.row},${randomChild.col})`);
            }
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
  
  // 只在节点数合理时计算最长路径（避免ACT3崩溃）
  let maxSteps = minSteps;
  if (nodes.length < 100) {
    try {
      maxSteps = countMaxSteps(nodes, startNode, bossNode);
    } catch (error) {
      console.warn(`[Validation] Failed to calculate max steps:`, error);
      maxSteps = minSteps; // 降级到最短路径
    }
  } else {
    console.warn(`[Validation] Skipping max steps calculation (too many nodes: ${nodes.length})`);
  }
  
  console.log(`[Validation] Steps range: ${minSteps} - ${maxSteps} (target: ${config.minSteps} - ${config.maxSteps})`);
  
  if (minSteps < config.minSteps) {
    console.warn(`[Validation] ⚠️ Minimum steps too short: ${minSteps} (expected: ${config.minSteps}+)`);
  }
  if (maxSteps > config.maxSteps) {
    console.warn(`[Validation] ⚠️ Maximum steps too long: ${maxSteps} (expected: <${config.maxSteps})`);
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
 * DFS计算最长路径（修复版：正确的回溯逻辑）
 * 使用记忆化搜索避免重复计算
 */
function countMaxSteps(nodes, startNode, bossNode) {
  const memo = new Map(); // 记忆化：存储每个节点到BOSS的最长路径
  
  function dfs(nodeId) {
    // 如果已经计算过，直接返回
    if (memo.has(nodeId)) {
      return memo.get(nodeId);
    }
    
    const node = nodes.find(n => n.id === nodeId);
    if (!node) return 0;
    
    // 如果是BOSS，距离为0
    if (nodeId === bossNode.id) {
      memo.set(nodeId, 0);
      return 0;
    }
    
    // 如果没有子节点（死路），距离为-Infinity（标记为不可达）
    if (node.next.length === 0) {
      memo.set(nodeId, -Infinity);
      return -Infinity;
    }
    
    // 递归计算所有子节点到BOSS的最长路径
    let maxDistance = -Infinity;
    for (const nextId of node.next) {
      const distance = dfs(nextId);
      if (distance !== -Infinity) {
        maxDistance = Math.max(maxDistance, distance + 1);
      }
    }
    
    memo.set(nodeId, maxDistance);
    return maxDistance;
  }
  
  const result = dfs(startNode.id);
  return result === -Infinity ? 0 : result;
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

