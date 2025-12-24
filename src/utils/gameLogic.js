export const shuffle = (array) => {
  const newArr = [...array];
  for (let i = newArr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
  }
  return newArr;
};

export const scaleEnemyStats = (baseStats, floorIndex, act = 1, ascensionLevel = 0) => {
  const difficultyMultiplier = 1 + 0.1 * floorIndex;
  const actMultiplier = 1 + (act - 1) * 0.5; // ACT加成改为每章+50%
  const ascensionMultiplier = 1 + (ascensionLevel * 0.1); // 周目加成每级+10%
  
  const scaledHp = Math.floor(baseStats.maxHp * difficultyMultiplier * actMultiplier * ascensionMultiplier);
  const scaledActions = baseStats.actions.map(action => {
    let scaledAction = { ...action };
    const isAttack = scaledAction.type === 'ATTACK' || scaledAction.actionType === 'Attack';
    if (isAttack) {
      const baseDmg = scaledAction.type === 'ATTACK' ? scaledAction.value : scaledAction.dmgValue;
      // 基础公式：(基础 + 楼层 + 章节) * 缩放 * 周目
      const scaledDmg = Math.floor((baseDmg + floorIndex * 0.5 + (act - 1) * 2) * 0.8 * ascensionMultiplier);
      if (scaledAction.type === 'ATTACK') scaledAction.value = scaledDmg;
      if (scaledAction.actionType === 'Attack') scaledAction.dmgValue = scaledDmg;
    }
    if (action.effect && ['WEAK', 'VULNERABLE', 'STRENGTH', 'BLOCK'].includes(action.effect)) {
      scaledAction.effectValue = Math.floor((action.effectValue + Math.floor(floorIndex / 5)) * ascensionMultiplier);
    }
    return scaledAction;
  });
  return { maxHp: scaledHp, actions: scaledActions };
};

/**
 * Calculate Expected Value (EV) for a card based on Plan A formula.
 * EV = [Base × (1 + Str/6 + Vuln*0.485 - Weak*0.252) + EffectEV] / Cost × Scale
 * Scale = (T>5 ? 1.3 : 1) × (T10 ? 1.48 : 1)
 */
export const calculateEV = (card, playerState, enemyState, turn) => {
  if (!card) return 0;

  const cost = Math.max(1, card.cost); // Avoid division by zero, min cost 1 for EV calc
  const baseValue = card.value || (card.block || 0);

  // Player Stats
  const str = playerState.strength || 0;

  // Enemy Stats (for Attack)
  const vuln = enemyState.vulnerable || 0;
  const weak = playerState.weak || 0; // Weak applies to player

  // Multipliers
  const strMod = str / 6;
  const vulnMod = vuln > 0 ? 0.485 : 0; // Simplified from formula: Vuln*0.485 (assuming binary or scaled? Plan A says Vuln*0.485, likely binary presence or scaled by stack. Let's assume presence for now as stacks decay)
  const weakMod = weak > 0 ? 0.252 : 0;

  // Effect EV (Simplified estimation)
  let effectEV = 0;
  if (card.effect === 'DRAW') effectEV += (card.effectValue || 1) * 4; // Draw = 4 EV
  if (card.effect === 'GAIN_MANA') effectEV += (card.effectValue || 1) * 3; // Mana = 3 EV
  if (card.effect === 'VULNERABLE') effectEV += (card.effectValue || 1) * 2;
  if (card.effect === 'WEAK') effectEV += (card.effectValue || 1) * 2;
  if (card.effect === 'STRENGTH') effectEV += (card.effectValue || 1) * 5; // Strength is valuable

  // Core Formula
  let rawValue = baseValue * (1 + strMod + vulnMod - weakMod) + effectEV;

  // Scale Factors
  let scale = 1;
  if (turn > 5) scale *= 1.3;
  if (turn > 10) scale *= 1.48;

  // Final EV
  return (rawValue / cost) * scale;
};
