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

        // ==================== BATCH 2: Execution & Scaling ====================

        case 'EXECUTE_SCALE':
            // 比例处决 - Damage scales with enemy missing HP (Garen R)
            updates.executeScale = value; // Scale factor (e.g., 0.5 = 50%)
            break;

        case 'EXECUTE_THRESHOLD':
            // 阈值处决 - Execute if below HP %
            updates.executeThreshold = value; // HP percentage
            break;

        case 'BLEED':
            // 流血 - Bleed DOT
            updates.enemyStatus = {
                ...(updates.enemyStatus || enemyStatus),
                bleed: ((updates.enemyStatus?.bleed || enemyStatus.bleed) || 0) + value
            };
            break;

        case 'BLEED_VULN':
            // 流血+易伤 - Apply both
            updates.enemyStatus = {
                ...(updates.enemyStatus || enemyStatus),
                bleed: ((updates.enemyStatus?.bleed || enemyStatus.bleed) || 0) + value,
                vulnerable: ((updates.enemyStatus?.vulnerable || enemyStatus.vulnerable) || 0) + 1
            };
            break;

        case 'BLEED_EXECUTE':
            // 流血处决 - Execute based on bleed stacks (Darius R)
            updates.bleedExecute = value; // Stack threshold
            break;

        // ==================== BATCH 2: Conditional Mechanics ====================

        case 'CONDITIONAL_DOUBLE':
            // 条件双倍 - Double damage if condition met (Lux R)
            updates.conditionalDouble = value;
            break;

        case 'BONUS_PER_EXTRA_MANA':
            // 法力加成 - Damage scales with extra mana (Lux E)
            updates.bonusPerMana = value;
            break;

        case 'MARK_TRIGGER':
            // 标记触发 - Trigger when mark consumed
            updates.markTriggerDamage = value;
            break;

        case 'STUN_IF_WEAK':
            // 虚弱眩晕 - Stun if enemy is weak (Vayne E)
            updates.stunIfWeak = value;
            break;

        case 'CRIT_CHANCE':
            // 暴击率 - Chance to crit
            updates.playerStatus = {
                ...(updates.playerStatus || playerStatus),
                critChance: ((updates.playerStatus?.critChance || playerStatus.critChance) || 0) + value
            };
            break;

        case 'CRIT_IF_VULN':
            // 易伤必暴 - Guaranteed crit on vulnerable
            updates.critIfVuln = value;
            break;

        case 'CRIT_25':
            // 25%暴击 - Fixed 25% crit chance
            updates.playerStatus = {
                ...(updates.playerStatus || playerStatus),
                critChance: ((updates.playerStatus?.critChance || playerStatus.critChance) || 0) + 25
            };
            break;

        case 'CRIT_UP':
            // 提升暴击率 - Increase crit chance
            updates.playerStatus = {
                ...(updates.playerStatus || playerStatus),
                critChance: ((updates.playerStatus?.critChance || playerStatus.critChance) || 0) + value
            };
            break;

        // ==================== BATCH 2: Lifesteal & Healing ====================

        case 'LIFESTEAL':
            // 生命偷取 - Heal for damage dealt
            updates.playerStatus = {
                ...(updates.playerStatus || playerStatus),
                lifesteal: ((updates.playerStatus?.lifesteal || playerStatus.lifesteal) || 0) + value
            };
            break;

        case 'LIFELINK':
            // 生命链接 - Heal and damage simultaneously (Sylas W)
            updates.lifelinkAmount = value;
            break;

        case 'LIFESTEAL_BUFF':
            // 生命偷取增益 - Gain lifesteal status
            updates.playerStatus = {
                ...(updates.playerStatus || playerStatus),
                lifesteal: ((updates.playerStatus?.lifesteal || playerStatus.lifesteal) || 0) + value
            };
            break;

        case 'HEAL_AND_DAMAGE':
            // 治疗+伤害 - Heal self and damage enemy (Ekko R)
            updates.healAmount = value;
            updates.damageAmount = value;
            break;

        case 'DAMAGE_IF_HURT':
            // 受伤反击 - Damage based on HP lost
            const hpLost = maxHp - playerHp;
            updates.bonusDamage = Math.floor(hpLost * (value / 100));
            break;

        // ==================== BATCH 2: Counter & Reflect ====================

        case 'COUNTER':
            // 反制 - Counter enemy attack
            updates.playerStatus = {
                ...(updates.playerStatus || playerStatus),
                counter: value
            };
            break;

        case 'REFLECT_BUFF':
            // 反弹增益 - Reflect buffs to enemy
            updates.reflectBuff = true;
            break;

        case 'IMMUNE_ONCE':
            // 免疫一次 - Immune to next damage (Yasuo W)
            updates.playerStatus = {
                ...(updates.playerStatus || playerStatus),
                immuneOnce: true
            };
            break;

        case 'DOUBLE_IF_ATTACKED':
            // 受击翻倍 - 2x damage if attacked (Yasuo E)
            updates.doubleIfAttacked = true;
            break;

        case 'IGNORE_BLOCK':
            // 无视格挡 - Bypass enemy block
            updates.ignoreBlock = true;
            break;

        // ==================== BATCH 3: Mana Effects ====================

        case 'GAIN_MANA':
            // 获得法力 - Restore mana immediately
            updates.manaChange = (updates.manaChange || 0) + value;
            break;

        case 'REGEN_MANA':
            // 法力回复 - Regenerate mana over time
            updates.playerStatus = {
                ...(updates.playerStatus || playerStatus),
                manaRegen: ((updates.playerStatus?.manaRegen || playerStatus.manaRegen) || 0) + value
            };
            break;

        case 'TEMP_MANA':
            // 临时法力 - Gain temporary mana this turn
            updates.tempMana = value;
            break;

        case 'GAIN_MANA_NEXT_TURN':
            // 下回合法力 - Gain mana next turn
            updates.playerStatus = {
                ...(updates.playerStatus || playerStatus),
                nextTurnMana: ((updates.playerStatus?.nextTurnMana || playerStatus.nextTurnMana) || 0) + value
            };
            break;

        case 'MANA_IF_LOW_HAND':
            // 低手牌法力 - Conditional mana (needs hand size check in BattleScene)
            updates.manaIfLowHand = value;
            break;

        case 'DRAW_MANA':
            // 抽牌+法力 - Draw and gain mana (Sona E)
            updates.drawCount += 1;
            updates.manaChange = (updates.manaChange || 0) + value;
            break;

        case 'NEXT_COST_REDUCE':
            // 下张减费 - Reduce next card cost (Ekko E)
            updates.playerStatus = {
                ...(updates.playerStatus || playerStatus),
                nextCostReduce: ((updates.playerStatus?.nextCostReduce || playerStatus.nextCostReduce) || 0) + value
            };
            break;

        // ==================== BATCH 3: Draw Effects ====================

        case 'DRAW_ON_USE':
            // 使用时抽牌 - Draw when card played
            updates.drawCount += value;
            break;

        case 'DRAW_ON_HIT':
            // 命中时抽牌 - Draw when attack hits (needs BattleScene trigger)
            updates.drawOnHit = value;
            break;

        case 'DRAW_IF_KILL':
            // 击杀抽牌 - Draw on enemy kill (needs BattleScene trigger)
            updates.drawIfKill = value;
            break;

        case 'DRAW_START':
            // 回合开始抽牌 - Draw at turn start (passive)
            updates.playerStatus = {
                ...(updates.playerStatus || playerStatus),
                drawPerTurn: ((updates.playerStatus?.drawPerTurn || playerStatus.drawPerTurn) || 0) + value
            };
            break;

        case 'DRAW_AT_START':
            // 战斗开始抽牌 - Draw at battle start (relic effect)
            updates.playerStatus = {
                ...(updates.playerStatus || playerStatus),
                battleStartDraw: ((updates.playerStatus?.battleStartDraw || playerStatus.battleStartDraw) || 0) + value
            };
            break;

        case 'PERMA_DRAW_ON_KILL':
            // 永久击杀抽牌 - Permanent draw on kill (relic)
            updates.playerStatus = {
                ...(updates.playerStatus || playerStatus),
                permaDraw: true
            };
            break;

        case 'NEXT_DRAW_PLUS':
            // 强化下次抽牌 - Draw extra next time
            updates.playerStatus = {
                ...(updates.playerStatus || playerStatus),
                nextDrawBonus: ((updates.playerStatus?.nextDrawBonus || playerStatus.nextDrawBonus) || 0) + value
            };
            break;

        case 'DRAW_AND_SCOUT':
            // 抽牌+侦查 - Draw and scout deck (Card Master R)
            updates.drawCount += value;
            updates.scoutCount = 3; // Scout top 3 cards
            break;

        // ==================== BATCH 3: Card Manipulation ====================

        case 'SCOUT':
            // 侦查 - Look at top X cards
            updates.scoutCount = value;
            break;

        case 'SEE_ENEMY_ACTION':
            // 预知敌意 - Reveal enemy intent
            updates.revealEnemyIntent = true;
            break;

        case 'TRANSFORM':
            // 变形 - Transform into another card (needs UI)
            updates.transformCard = true;
            break;

        case 'RECYCLE':
            // 回收 - Return card from discard (needs deck manipulation)
            updates.recycleCard = true;
            break;

        case 'DEBUFF_CARD':
            // 诅咒卡牌 - Add cursed card to deck
            updates.addCursedCard = true;
            break;

        case 'UPGRADE_CARD':
            // 升级卡牌 - Upgrade a card (needs UI)
            updates.upgradeCard = true;
            break;

        case 'PERMA_UPGRADE_CARD':
            // 永久升级 - Permanently upgrade card (relic)
            updates.permaUpgrade = true;
            break;

        case 'DISCOUNT_ONE_CARD':
            // 单卡减费 - Reduce one card cost
            updates.discountCard = value;
            break;

        // ==================== Placeholder for Future Effects ====================
        // TODO: Implement Batch 4-5 (62 more effects)
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
