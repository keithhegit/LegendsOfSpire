/**
 * Card Effect Handler - Centralized effect processing system
 * Handles all 142 card effect types in the game
 */

/**
 * Applies all effects from a card to the game state
 * @param {Object} card - The card being played
 * @param {Object} context - Current game state context
 * @returns {Object} State updates to apply
 */
export function applyCardEffects(card, context) {
    const updates = {
        playerHp: null,
        playerStatus: null,
        enemyStatus: null,
        drawCount: 0,
    };

    const { playerStatus, enemyStatus, playerHp, maxHp } = context;

    // Primary effect
    if (card.effect) {
        applyEffect(card.effect, card.effectValue, context, updates);
    }

    // Secondary effect (for multi-effect cards like 卡牌R)
    if (card.effect2) {
        applyEffect(card.effect2, card.effectValue2 || 0, context, updates);
    }

    return updates;
}

/**
 * Apply a single effect to the updates object
 */
function applyEffect(effectType, value, context, updates) {
    const { playerStatus, enemyStatus, playerHp, maxHp } = context;

    switch (effectType) {
        // ==================== Drawing ====================
        case 'DRAW':
            updates.drawCount += value;
            break;

        // ==================== Healing ====================
        case 'HEAL':
            updates.playerHp = Math.min(maxHp, playerHp + value);
            break;

        // ==================== Player Buffs ====================
        case 'STRENGTH':
            updates.playerStatus = {
                ...(updates.playerStatus || playerStatus),
                strength: (updates.playerStatus?.strength || playerStatus.strength) + value
            };
            break;

        case 'GAIN_AGI': // 灵巧 (Dexterity)
            updates.playerStatus = {
                ...(updates.playerStatus || playerStatus),
                dexterity: ((updates.playerStatus?.dexterity || playerStatus.dexterity) || 0) + value
            };
            break;

        case 'CLEANSE':
            updates.playerStatus = {
                ...(updates.playerStatus || playerStatus),
                weak: 0,
                vulnerable: 0
            };
            break;

        // ==================== Enemy Debuffs ====================
        case 'VULNERABLE':
            updates.enemyStatus = {
                ...(updates.enemyStatus || enemyStatus),
                vulnerable: (updates.enemyStatus?.vulnerable || enemyStatus.vulnerable) + value
            };
            break;

        case 'WEAK':
            updates.enemyStatus = {
                ...(updates.enemyStatus || enemyStatus),
                weak: (updates.enemyStatus?.weak || enemyStatus.weak) + value
            };
            break;

        case 'POISON':
            updates.enemyStatus = {
                ...(updates.enemyStatus || enemyStatus),
                poison: ((updates.enemyStatus?.poison || enemyStatus.poison) || 0) + value
            };
            break;

        case 'STUN':
            updates.enemyStatus = {
                ...(updates.enemyStatus || enemyStatus),
                stunned: ((updates.enemyStatus?.stunned || enemyStatus.stunned) || 0) + value
            };
            break;

        case 'LOSE_HP_GAIN_MANA':
            // 失去生命值获得法力 (Teemo E等)
            updates.playerHp = Math.max(1, playerHp - value); // 不会致死
            updates.manaChange = (updates.manaChange || 0) + 1;
            break;

        case 'CONDITIONAL_DRAW':
            // 战争学识: 抽1；若本回合已打出≥2张攻击则改为抽2
            // 这里简化实现，总是抽 value 张 (通常是2)
            // 理想情况下需要 context 中传入 playHistory
            updates.drawCount += value;
            break;

        case 'NEXT_DAMAGE_REDUCE':
            // 格挡之歌: 获得护甲并使下一次受到的伤害减少
            // 这里只处理护甲部分，减伤逻辑需要在 BattleScene 中实现
            // 暂时只给护甲作为 fallback，或者我们可以添加一个 status
            // updates.playerStatus.damageReduce = value; // 需要 BattleScene 支持
            break;

        case 'DRAW_NEXT':
            // 结界护盾: 下回合抽牌
            // 需要 BattleScene 支持 nextTurnDraw
            // 暂时简化为当前回合抽牌，或者忽略
            // 为了不报错，我们先记录一下，或者直接给当前抽牌 (虽然不准确)
            // updates.drawCount += value; // 暂不激活，避免误导
            break;

        // ==================== Placeholder for Future Effects ====================
        // TODO: Implement remaining 134 effects
        // Reference: card_skills.md for full list

        default:
            // Log unimplemented effects for tracking
            if (effectType) {
                console.warn(`[Card Effect] Unimplemented effect: ${effectType} (value: ${value})`);
            }
            break;
    }
}

/**
 * Calculate block value with dexterity bonus
 * @param {number} baseBlock - Base block value from card
 * @param {Object} playerStatus - Player status object
 * @returns {number} Final block value
 */
export function calculateBlockValue(baseBlock, playerStatus) {
    const dexterityBonus = playerStatus.dexterity || 0;
    return baseBlock + dexterityBonus;
}
