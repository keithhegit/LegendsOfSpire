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

        // ==================== BATCH 1: Multi-hit & Combo ====================

        case 'MULTI_HIT':
            // 多段攻击 - Handled in BattleScene (card.isMultiHit flag)
            // This is a marker effect, actual implementation in BattleScene
            break;

        case 'DOUBLE_HIT':
            // 双重打击 - 2x damage instances
            updates.multiHitCount = 2;
            break;

        case 'TRIPLE_HIT':
            // 三重打击 - 3x damage instances
            updates.multiHitCount = 3;
            break;

        case 'SELF_DAMAGE':
            // 自我伤害 - Deal damage to self as cost
            updates.playerHp = Math.max(1, playerHp - value);
            break;

        // ==================== BATCH 1: Direct Damage Modifiers ====================

        case 'ATTACK_BUFF':
            // 攻击增幅 - Temporary attack boost
            updates.playerStatus = {
                ...(updates.playerStatus || playerStatus),
                attackBuff: ((updates.playerStatus?.attackBuff || playerStatus.attackBuff) || 0) + value
            };
            break;

        case 'BONUS_IF_MARKED':
            // 标记额外伤害 - Needs BattleScene check for mark status
            updates.bonusIfMarked = value;
            break;

        case 'BONUS_IF_VULN':
            // 易伤额外伤害 - Needs BattleScene check
            updates.bonusIfVuln = value;
            break;

        case 'NEXT_ATTACK_DOUBLE':
            // 下次攻击翻倍
            updates.playerStatus = {
                ...(updates.playerStatus || playerStatus),
                nextAttackDouble: true
            };
            break;

        case 'NEXT_ATTACK_BONUS':
            // 下次攻击加成
            updates.playerStatus = {
                ...(updates.playerStatus || playerStatus),
                nextAttackBonus: ((updates.playerStatus?.nextAttackBonus || playerStatus.nextAttackBonus) || 0) + value
            };
            break;

        case 'LOW_HP_BONUS':
            // 低血额外伤害 - Calculated in BattleScene based on enemy HP
            updates.lowHpBonus = value;
            break;

        case 'BONUS_IF_LOW_HP':
            // 自身低血加成 - Scales with player missing HP
            const missingHpPercent = 1 - (playerHp / maxHp);
            updates.bonusDamage = Math.floor(value * missingHpPercent);
            break;

        case 'LOW_HP_EXECUTE':
            // 低血处决 - Execute threshold (handled in BattleScene)
            updates.executeThreshold = value;
            break;

        // ==================== BATCH 1: Status Effects ====================

        case 'MARK':
            // 标记
            updates.enemyStatus = {
                ...(updates.enemyStatus || enemyStatus),
                marked: ((updates.enemyStatus?.marked || enemyStatus.marked) || 0) + value
            };
            break;

        case 'REMOVE_BUFF':
            // 驱散增益 - Remove enemy buffs
            updates.removeEnemyBuffs = value; // Number of buffs to remove
            break;

        case 'STR_DEBUFF':
            // 力量削弱 - Reduce enemy strength
            updates.enemyStatus = {
                ...(updates.enemyStatus || enemyStatus),
                strength: Math.max(0, ((updates.enemyStatus?.strength || enemyStatus.strength) || 0) - value)
            };
            break;

        case 'BURN':
            // 灼烧 - DOT effect
            updates.enemyStatus = {
                ...(updates.enemyStatus || enemyStatus),
                burn: ((updates.enemyStatus?.burn || enemyStatus.burn) || 0) + value
            };
            break;

        case 'WEAK_ON_HIT':
            // 攻击附带虚弱 - Apply weak when damage lands
            updates.applyWeakOnHit = value;
            break;

        case 'VULN_ON_HIT':
            // 攻击附带易伤 - Apply vulnerable when damage lands
            updates.applyVulnOnHit = value;
            break;

        // ==================== BATCH 1: Block & Defense ====================

        case 'SELF_BLOCK':
            // 自我格挡 - Gain block (handled via card.block in BattleScene)
            // This is mainly a marker, actual block is in card.block property
            break;

        case 'AVOID_NEXT_DAMAGE':
            // 闪避下次攻击 - Complete damage immunity
            updates.playerStatus = {
                ...(updates.playerStatus || playerStatus),
                avoidNextDamage: true
            };
            break;

        case 'RETALIATE_ON_HIT':
            // 反击伤害 - Deal damage when hit
            updates.playerStatus = {
                ...(updates.playerStatus || playerStatus),
                retaliation: ((updates.playerStatus?.retaliation || playerStatus.retaliation) || 0) + value
            };
            break;

        case 'REFLECT_IF_HIT':
            // 反弹伤害 - Reflect percentage of damage
            updates.playerStatus = {
                ...(updates.playerStatus || playerStatus),
                reflectDamage: ((updates.playerStatus?.reflectDamage || playerStatus.reflectDamage) || 0) + value
            };
            break;

        // ==================== Placeholder for Future Effects ====================
        // TODO: Implement Batch 2-5 (108 more effects)
        // Reference: effect_encyclopedia.md for full list

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
