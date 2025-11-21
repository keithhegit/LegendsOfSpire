/**
 * 六边形网格地图生成器 v3 - 距离圈算法 + 串行绕路链
 * 
 * 核心改变：
 * - 放弃"层级"概念，改用"距离圈"
 * - 允许横向/对角线移动，创造真正的Z型路径
 * - 串行绕路链：避免重叠，确保路径长度叠加
 * - 最短路径：直线 (minSteps)
 * - 最长路径：绕圈探索 (maxSteps)
 * 
 * 设计目标：
 * - ACT1: 最短10步，最长15-20步 (100%成功率)
 * - ACT2: 最短20步，最长30-45步 (100%成功率)
 * - ACT3: 最短30步，最长60-80步 (95%+成功率)
 * 
 * 保底机制：
 * - 最多重试3次，确保生成可达地图
 */

import { getHexNeighbors, offsetToPixel, hexDistance, areHexagonsAdjacent } from '../utils/hexagonGrid';
import { ENEMY_POOL } from './enemies';

// 网格配置
export const GRID_COLS = 9; // 增加列数以支持横向探索
const GRID_ROWS_BASE = 15; // 基础行数

// ACT配置
const ACT_CONFIG = {
  1: { minSteps: 10, maxSteps: 20, totalNodes: 20 },
  2: { minSteps: 20, maxSteps: 50, totalNodes: 50 },
  3: { minSteps: 30, maxSteps: 80, totalNodes: 80 }
};

// 节点类型权重
const NODE_WEIGHTS = {
  BATTLE: 0.5,
  EVENT: 0.2,
  SHOP: 0.15,
  REST: 0.1,
  CHEST: 0.05
};

function getRandomNodeType(excludeTypes = []) {
  const rand = Math.random();
  let cumulative = 0;
  
  const types = Object.entries(NODE_WEIGHTS).filter(([type]) => !excludeTypes.includes(type));
  
  for (const [type, weight] of types) {
    cumulative += weight;
    if (rand < cumulative) return type;
  }
  
  return 'BATTLE';
}

function getBossId(act) {
  if (act === 1) return 'Darius_BOSS';
  if (act === 2) return 'Viego_BOSS';
  return 'BelVeth_BOSS';
}

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

function createNode(row, col, type, act, distance, usedEnemies = []) {
  const id = `${row}-${col}`;
  const position = offsetToPixel(row, col);
  
  const node = {
    id,
    row,
    col,
    type,
    status: 'LOCKED',
    distance, // 从START的距离（步数）
    next: [],
    prev: [],
    position,
    enemyId: null
  };
  
  if (type === 'BATTLE') {
    node.enemyId = getRandomEnemy(act, usedEnemies);
    usedEnemies.push(node.enemyId);
  } else if (type === 'BOSS') {
    node.enemyId = getBossId(act);
  }
  
  return node;
}

/**
 * 内部生成函数（不含重试逻辑）
 */
function generateGridMapInternal(act = 1, usedEnemies = []) {
  console.log(`\n=== Generating Map for ACT ${act} (Distance-Based Algorithm) ===`);
  
  const config = ACT_CONFIG[act];
  const { minSteps, maxSteps, totalNodes: targetNodeCount } = config;
  
  const gridRows = Math.max(GRID_ROWS_BASE, maxSteps); // 确保足够的行数
  const grid = Array.from({ length: gridRows }, () => 
    Array.from({ length: GRID_COLS }, () => null)
  );
  
  const nodes = [];
  const nodesByDistance = new Map(); // distance -> [nodes]
  
  // 阶段1: 放置START
  const startRow = 0;
  const startCol = Math.floor(GRID_COLS / 2);
  const startNode = createNode(startRow, startCol, 'START', act, 0, usedEnemies);
  startNode.status = 'AVAILABLE';
  grid[startRow][startCol] = startNode;
  nodes.push(startNode);
  nodesByDistance.set(0, [startNode]);
  
  console.log(`[Init] START at (${startRow}, ${startCol})`);
  
  // 阶段2: 生成最短路径（直线）- 使用正确的六边形邻居逻辑
  let currentNode = startNode;
  const mainPath = [startNode];
  
  for (let step = 1; step <= minSteps; step++) {
    const targetRow = currentNode.row + 1; // 总是向下一行
    
    // 使用正确的六边形邻居计算
    const isOddRow = currentNode.row % 2 === 1;
    
    // 随机选择：左前、正前、右前
    const directions = ['forward-left', 'forward', 'forward-right'];
    const randomDir = directions[Math.floor(Math.random() * directions.length)];
    
    let targetCol;
    switch (randomDir) {
      case 'forward-left':
        targetCol = isOddRow ? currentNode.col : currentNode.col - 1;
        break;
      case 'forward':
        targetCol = currentNode.col;
        break;
      case 'forward-right':
        targetCol = isOddRow ? currentNode.col + 1 : currentNode.col;
        break;
    }
    
    // 边界检查
    targetCol = Math.max(0, Math.min(GRID_COLS - 1, targetCol));
    
    // 如果位置被占用，尝试其他方向
    if (grid[targetRow][targetCol]) {
      for (const dir of directions) {
        let testCol;
        switch (dir) {
          case 'forward-left':
            testCol = isOddRow ? currentNode.col : currentNode.col - 1;
            break;
          case 'forward':
            testCol = currentNode.col;
            break;
          case 'forward-right':
            testCol = isOddRow ? currentNode.col + 1 : currentNode.col;
            break;
        }
        testCol = Math.max(0, Math.min(GRID_COLS - 1, testCol));
        
        if (!grid[targetRow][testCol]) {
          targetCol = testCol;
          break;
        }
      }
    }
    
    const nodeType = step === minSteps ? 'BOSS' : getRandomNodeType();
    const newNode = createNode(targetRow, targetCol, nodeType, act, step, usedEnemies);
    grid[targetRow][targetCol] = newNode;
    nodes.push(newNode);
    mainPath.push(newNode);
    
    currentNode.next.push(newNode.id);
    newNode.prev.push(currentNode.id);
    
    nodesByDistance.set(step, [newNode]);
    currentNode = newNode;
  }
  
  const bossNode = currentNode;
  console.log(`[MainPath] BOSS at (${bossNode.row}, ${bossNode.col}), shortest path=${minSteps} steps`);
  
  // 阶段3: 生成Z型绕路链（关键！）
  // 新策略：生成长链绕路，每条链有3-6个节点
  let currentNodeCount = nodes.length;
  
  // 计算需要多少条绕路链（ACT3特殊处理！）
  let targetDetourChains = Math.ceil((maxSteps - minSteps) / 3); // 目标增加的步数 / 每条链平均长度
  let chainLengthMin = 3;
  let chainLengthMax = 6;
  let nodesPerStepProb = 0.6; // 60%概率每步生成2个节点
  
  // ACT3特殊优化：增加绕路密度
  if (act === 3) {
    targetDetourChains = Math.ceil((maxSteps - minSteps) / 2.5); // 更多的链
    chainLengthMin = 4; // 更长的链
    chainLengthMax = 8;
    nodesPerStepProb = 0.75; // 75%概率每步生成2个节点
    console.log(`[ACT3 BOOST] Increased detour density: longer chains (${chainLengthMin}-${chainLengthMax}), more nodes per step (${nodesPerStepProb * 100}%)`);
  }
  
  const numDetourChains = Math.min(targetDetourChains, Math.floor(minSteps / 2)); // 不超过主路径长度的一半
  const detourChains = []; // 存储 { startNode, endNode, nodes, startStep, endStep }
  
  console.log(`[Detours] Targeting ${numDetourChains} detour chains to add ${maxSteps - minSteps} extra steps`);
  
  // 跟踪已被绕路覆盖的主路径区段（避免重叠）
  const coveredSteps = new Set();
  
  for (let chain = 0; chain < numDetourChains && currentNodeCount < targetNodeCount; chain++) {
    // 找到未被覆盖的主路径区段
    let chainStartStep = -1;
    let chainEndStep = -1;
    let actualChainLength = 0; // 记录实际链长度
    
    // 尝试多次找到合适的区段
    for (let attempt = 0; attempt < 20; attempt++) {
      const maxStart = Math.max(2, minSteps - (chainLengthMax + 2));
      const tryStartStep = 2 + Math.floor(Math.random() * maxStart);
      const tryChainLength = chainLengthMin + Math.floor(Math.random() * (chainLengthMax - chainLengthMin + 1));
      const tryEndStep = Math.min(tryStartStep + tryChainLength, minSteps - 2);
      
      // 检查这个区段是否已被覆盖
      let isOverlap = false;
      for (let s = tryStartStep; s <= tryEndStep; s++) {
        if (coveredSteps.has(s)) {
          isOverlap = true;
          break;
        }
      }
      
      if (!isOverlap) {
        chainStartStep = tryStartStep;
        chainEndStep = tryEndStep;
        actualChainLength = tryChainLength; // 保存实际链长度
        // 标记这个区段为已覆盖
        for (let s = chainStartStep; s <= chainEndStep; s++) {
          coveredSteps.add(s);
        }
        break;
      }
    }
    
    // 如果找不到合适区段，跳过这条链
    if (chainStartStep === -1) {
      console.log(`  [DetourChain ${chain}] Skipped - no available segment`);
      continue;
    }
    
    const chainStartNode = mainPath[chainStartStep];
    const chainEndNode = mainPath[chainEndStep];
    
    // 决定绕路方向（左侧或右侧）
    const direction = Math.random() < 0.5 ? -1 : 1;
    const baseColOffset = direction * (3 + Math.floor(Math.random() * 2)); // ±3 或 ±4
    
    // 生成绕路链节点（每个step生成1-2个节点，增加链的实际长度）
    const detourChainNodes = [];
    let prevDetourNode = null;
    
    for (let i = 0; i < actualChainLength && currentNodeCount < targetNodeCount; i++) {
      const step = chainStartStep + i;
      const correspondingMainNode = mainPath[step];
      
      // 关键改进：每个step生成1-2个节点（使用动态概率）
      const nodesPerStep = Math.random() < nodesPerStepProb ? 2 : 1;
      
      for (let nodeIdx = 0; nodeIdx < nodesPerStep && currentNodeCount < targetNodeCount; nodeIdx++) {
      
        // 横向偏移（远离主路径）
        let targetCol = correspondingMainNode.col + baseColOffset;
        // 添加一些随机变化（Z型效果）
        targetCol += Math.floor(Math.random() * 3) - 1; // ±1
        // 内层节点额外偏移
        if (nodeIdx > 0) {
          targetCol += direction * 1; // 进一步远离
        }
        targetCol = Math.max(0, Math.min(GRID_COLS - 1, targetCol));
        
        // 行数：只能向前（row + 1）或同行，不能向后
        // 修复：确保绕路节点不会在主路径之前的行
        let targetRow = correspondingMainNode.row; // 默认同行
        // 50%概率向前一行（使绕路链向BOSS方向延伸）
        if (Math.random() < 0.5 && correspondingMainNode.row < gridRows - 1) {
          targetRow = correspondingMainNode.row + 1;
        }
        targetRow = Math.max(1, Math.min(gridRows - 2, targetRow));
        
        // 检查是否被占用
        if (grid[targetRow][targetCol]) {
          // 尝试附近位置
          let found = false;
          for (let offset = 1; offset <= 3; offset++) {
            for (let rowOff = -1; rowOff <= 1; rowOff++) {
              const testRow = targetRow + rowOff;
              const testCol = targetCol + offset * direction;
              if (testRow >= 1 && testRow < gridRows - 1 && 
                  testCol >= 0 && testCol < GRID_COLS && 
                  !grid[testRow][testCol]) {
                targetRow = testRow;
                targetCol = testCol;
                found = true;
                break;
              }
            }
            if (found) break;
          }
          if (!found) continue; // 跳过这个节点
        }
        
        // 创建绕路节点
        const detourNode = createNode(targetRow, targetCol, getRandomNodeType(), act, step, usedEnemies);
        grid[targetRow][targetCol] = detourNode;
        nodes.push(detourNode);
        detourChainNodes.push(detourNode);
        currentNodeCount++;
        
        // 连接到前一个绕路节点
        if (prevDetourNode) {
          prevDetourNode.next.push(detourNode.id);
          detourNode.prev.push(prevDetourNode.id);
        }
        
        prevDetourNode = detourNode;
      }
    }
    
    // 如果成功创建了绕路链
    if (detourChainNodes.length >= 2) {
      // 连接起点：主路径 -> 绕路链第一个节点
      chainStartNode.next.push(detourChainNodes[0].id);
      detourChainNodes[0].prev.push(chainStartNode.id);
      
      // 连接终点：绕路链最后一个节点 -> 主路径
      const lastDetourNode = detourChainNodes[detourChainNodes.length - 1];
      lastDetourNode.next.push(chainEndNode.id);
      chainEndNode.prev.push(lastDetourNode.id);
      
      // 保存绕路链信息（包含主路径的起点和终点）
      detourChains.push({
        startNode: chainStartNode,
        endNode: chainEndNode,
        nodes: detourChainNodes,
        startStep: chainStartStep,
        endStep: chainEndStep
      });
      
      console.log(`[DetourChain ${chain}] Created chain with ${detourChainNodes.length} nodes: ${chainStartNode.id} -> [${detourChainNodes.map(n => n.id).join(' -> ')}] -> ${chainEndNode.id}`);
      console.log(`  Chain adds ${detourChainNodes.length} extra steps compared to direct path`);
    }
  }
  
  console.log(`[Detours] Generated ${detourChains.length} detour chains, total nodes: ${currentNodeCount} (target: ${targetNodeCount})`);
  
  // 阶段4: 断开主路径部分连接（强制走绕路！）
  // 新策略：只断开被绕路链"跨越"的主路径连接，不断开所有中间连接
  let brokenConnections = 0;
  
  for (const detourChain of detourChains) {
    if (detourChain.nodes.length < 2) continue;
    
    const { startNode, endNode, startStep, endStep } = detourChain;
    
    // 只断开起点到终点的**直接连接**（如果存在）
    // 不断开中间所有连接，保留部分捷径
    const stepsToBreak = endStep - startStep;
    
    if (stepsToBreak <= 1) continue; // 跨度太小，不断开
    
    // 新策略：ACT3强制断开所有链，ACT1/2保守
    const shouldBreak = act === 3 ? true : Math.random() < 0.25; // ACT3: 100%, ACT1/2: 25%
    
    if (shouldBreak) {
      // ACT3: 断开更多连接，ACT1/2: 只断开1个
      const numToBreak = act === 3 ? Math.min(3, Math.max(1, Math.floor(stepsToBreak / 2))) : 1;
      
      for (let i = 0; i < numToBreak; i++) {
        // 随机选择一个要断开的步骤
        const stepToBreak = startStep + 1 + Math.floor(Math.random() * (stepsToBreak - 1));
        const currentNode = mainPath[stepToBreak];
        const nextNode = mainPath[stepToBreak + 1];
        
        if (!currentNode || !nextNode) continue;
        
        // 移除连接
        const nextIdx = currentNode.next.indexOf(nextNode.id);
        if (nextIdx !== -1) {
          currentNode.next.splice(nextIdx, 1);
          const prevIdx = nextNode.prev.indexOf(currentNode.id);
          if (prevIdx !== -1) {
            nextNode.prev.splice(prevIdx, 1);
          }
          brokenConnections++;
          console.log(`  [ForceDetour] Disconnected main path ${currentNode.id} -X-> ${nextNode.id} (forces detour)`);
        }
      }
    }
  }
  
  console.log(`[ForceDetour] Broken ${brokenConnections} main path connections (30% chance per chain)`);
  
  // 阶段5: 验证可达性
  const { reachable, distance: minDistance } = bfsCheck(nodes, startNode, bossNode);
  const maxDistance = dfsMaxDistance(nodes, startNode, bossNode);
  
  console.log(`[Validation] BOSS reachable: ${reachable}`);
  console.log(`[Validation] Distance range: ${minDistance} - ${maxDistance} (target: ${minSteps} - ${maxSteps})`);
  
  if (!reachable) {
    console.error(`[Validation] BOSS not reachable! Force connecting...`);
    // 强制连接最近的节点到BOSS
    const nearbyNodes = nodes.filter(n => 
      n.row === bossNode.row - 1 && Math.abs(n.col - bossNode.col) <= 2
    );
    if (nearbyNodes.length > 0) {
      const nearest = nearbyNodes[0];
      nearest.next.push(bossNode.id);
      bossNode.prev.push(nearest.id);
    }
  }
  
  console.log(`=== Map Generation Complete ===\n`);
  
  return {
    grid,
    nodes,
    startNode,
    bossNode,
    stats: {
      minSteps: minDistance,
      maxSteps: maxDistance,
      reachable,
      totalNodes: nodes.length
    },
    act,
    totalFloors: gridRows
  };
}

/**
 * BFS最短路径
 */
function bfsCheck(nodes, startNode, bossNode) {
  const visited = new Set();
  const queue = [[startNode, 0]];
  
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
 * DFS最长路径（记忆化搜索）
 */
function dfsMaxDistance(nodes, startNode, bossNode) {
  const memo = new Map();
  
  function dfs(nodeId) {
    if (memo.has(nodeId)) return memo.get(nodeId);
    
    const node = nodes.find(n => n.id === nodeId);
    if (!node) return -Infinity;
    
    if (nodeId === bossNode.id) {
      memo.set(nodeId, 0);
      return 0;
    }
    
    if (node.next.length === 0) {
      memo.set(nodeId, -Infinity);
      return -Infinity;
    }
    
    let maxDist = -Infinity;
    for (const nextId of node.next) {
      const dist = dfs(nextId);
      if (dist !== -Infinity) {
        maxDist = Math.max(maxDist, dist + 1);
      }
    }
    
    memo.set(nodeId, maxDist);
    return maxDist;
  }
  
  return dfs(startNode.id);
}

/**
 * 带重试保底的地图生成器（对外接口）
 * 
 * @param {number} act - 当前章节 (1/2/3)
 * @param {Array<string>} usedEnemies - 已使用的敌人ID
 * @param {number} maxRetries - 最大重试次数（默认3次）
 * @returns {Object} 地图数据
 */
export function generateGridMap(act = 1, usedEnemies = [], maxRetries = 3) {
  let attempt = 0;
  let lastError = null;
  
  while (attempt < maxRetries) {
    attempt++;
    
    try {
      console.log(`\n=== Map Generation Attempt ${attempt}/${maxRetries} for ACT${act} ===`);
      
      const mapData = generateGridMapInternal(act, usedEnemies);
      
      // 验证地图有效性
      if (!mapData.stats.reachable) {
        throw new Error('BOSS is not reachable');
      }
      
      if (mapData.nodes.length === 0) {
        throw new Error('No nodes generated');
      }
      
      // 成功生成
      console.log(`✅ Map generation successful on attempt ${attempt}`);
      return mapData;
      
    } catch (error) {
      lastError = error;
      console.warn(`⚠️ Attempt ${attempt} failed: ${error.message}`);
      
      if (attempt >= maxRetries) {
        console.error(`❌ All ${maxRetries} attempts failed. Returning fallback map.`);
        // 返回一个简单的线性地图作为保底
        return generateFallbackMap(act, usedEnemies);
      }
      
      console.log(`🔄 Retrying...`);
    }
  }
  
  // 理论上不会到达这里，但为了类型安全
  console.error(`❌ Unexpected error: All retries exhausted`);
  return generateFallbackMap(act, usedEnemies);
}

/**
 * 生成保底线性地图（当所有重试失败时）
 */
function generateFallbackMap(act, usedEnemies) {
  console.log(`[Fallback] Generating simple linear map for ACT${act}`);
  
  const config = ACT_CONFIG[act];
  const { minSteps } = config;
  const gridRows = Math.max(GRID_ROWS_BASE, minSteps + 2);
  const grid = Array.from({ length: gridRows }, () => 
    Array.from({ length: GRID_COLS }, () => null)
  );
  
  const nodes = [];
  const middleCol = Math.floor(GRID_COLS / 2);
  
  // 生成简单的直线路径
  let prevNode = null;
  for (let row = 0; row <= minSteps; row++) {
    const nodeType = row === 0 ? 'START' : (row === minSteps ? 'BOSS' : getRandomNodeType());
    const node = createNode(row, middleCol, nodeType, act, row, usedEnemies);
    
    if (row === 0) {
      node.status = 'AVAILABLE';
    }
    
    grid[row][middleCol] = node;
    nodes.push(node);
    
    if (prevNode) {
      prevNode.next.push(node.id);
      node.prev.push(prevNode.id);
    }
    
    prevNode = node;
  }
  
  const startNode = nodes[0];
  const bossNode = nodes[nodes.length - 1];
  
  console.log(`[Fallback] Generated ${nodes.length} nodes in a straight line`);
  
  return {
    grid,
    nodes,
    startNode,
    bossNode,
    stats: {
      minSteps,
      maxSteps: minSteps,
      reachable: true,
      totalNodes: nodes.length
    },
    act,
    totalFloors: gridRows
  };
}

