import { ENEMY_POOL } from '../data/enemies';
import { shuffle } from './gameLogic';

export const generateMap = (usedEnemyIds) => {
  const map = [];
  const allEnemyIds = Object.keys(ENEMY_POOL).filter(id => ENEMY_POOL[id].difficultyRank < 99); 
  let availableEnemyIds = allEnemyIds.filter(id => !usedEnemyIds.includes(id));
  if (availableEnemyIds.length < 8) availableEnemyIds = shuffle(allEnemyIds); 

  const getUniqueEnemy = (minRank, maxRank) => {
    let availablePool = availableEnemyIds.filter(id => {
        const r = ENEMY_POOL[id].difficultyRank;
        return r >= minRank && r <= maxRank;
    });
    if (availablePool.length === 0) {
        availablePool = shuffle(allEnemyIds.filter(id => {
             const r = ENEMY_POOL[id].difficultyRank;
             return r >= minRank && r <= maxRank;
        }));
    }
    const selectedId = availablePool.length > 0 ? availablePool.pop() : allEnemyIds[0];
    availableEnemyIds = availableEnemyIds.filter(id => id !== selectedId);
    return selectedId;
  };
  
  const createNode = (id, type, minRank, maxRank) => {
      const node = { id, type, status: 'LOCKED', next: [] };
      if (type === 'BATTLE') node.enemyId = getUniqueEnemy(minRank, maxRank);
      return node;
  };

  map.push([{ ...createNode('1-0', 'BATTLE', 1, 1), status: 'AVAILABLE', next: ['2-0', '2-1'] }]);
  for (let i = 2; i <= 8; i++) {
    const minRank = i < 4 ? 1 : (i < 7 ? 2 : 3);
    const maxRank = i < 4 ? 1 : (i < 7 ? 2 : 3);
    const nodeType1 = shuffle(['BATTLE', 'REST', 'SHOP'])[0];
    const nodeType2 = shuffle(['BATTLE', 'EVENT', 'CHEST'])[0];
    const nodes = [createNode(`${i}-0`, nodeType1, minRank, maxRank), createNode(`${i}-1`, nodeType2, minRank, maxRank)];
    const nextFloorIndex = i + 1;
    if (nextFloorIndex <= 9) { nodes[0].next = [`${nextFloorIndex}-0`]; nodes[1].next = [`${nextFloorIndex}-0`]; }
    if (i === 3 || i === 6) { nodes[0].next = [`${nextFloorIndex}-0`]; nodes[1].next = [`${nextFloorIndex}-1`]; }
    map.push(nodes);
  }
  map.push([{ ...createNode('9-0', 'REST', 1, 1), next: ['10-0'] }]);
  map.push([{ id: '10-0', type: 'BOSS', enemyId: 'Darius_BOSS', status: 'LOCKED', next: [] }]);
  return { map, finalEnemyIds: allEnemyIds.filter(id => !availableEnemyIds.includes(id)) };
};

