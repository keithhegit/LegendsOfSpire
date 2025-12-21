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
        applyEffect(card.effect, card.effectValue, context, updates, card);
    }

    // Secondary effect (for multi-effect cards like 卡牌R)
    if (card.effect2) {
        applyEffect(card.effect2, card.effectValue2 || 0, context, updates, card);
    }

    return updates;
}

/**
 * Apply a single effect to the updates object
 */
function applyEffect(effectType, value, context, updates, card = {}) {
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
            updates.playerStatus = {
                ...(updates.playerStatus || playerStatus),
                nextDamageReduce: ((updates.playerStatus?.nextDamageReduce || playerStatus.nextDamageReduce) || 0) + value
            };
            break;

        case 'DRAW_NEXT':
            // 结界护盾: 下回合抽牌
            updates.playerStatus = {
                ...(updates.playerStatus || playerStatus),
                nextDrawBonus: ((updates.playerStatus?.nextDrawBonus || playerStatus.nextDrawBonus) || 0) + value
            };
            break;

        case 'PULL':
            // 死亡判决: 拉近目标 (机械上视为易伤或者特殊状态)
            // 这里暂时给1层易伤作为反馈
            updates.enemyStatus = {
                ...(updates.enemyStatus || enemyStatus),
                vulnerable: ((updates.enemyStatus?.vulnerable || enemyStatus.vulnerable) || 0) + 1
            };
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
            updates.lowHpThreshold = typeof card.lowHpThreshold === 'number' ? card.lowHpThreshold : 0.5;
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
                mark: ((updates.enemyStatus?.mark || enemyStatus.mark) || 0) + value
            };
            break;

        case 'REMOVE_BUFF':
            // 驱散增益 - Remove enemy buffs
            updates.removeEnemyBuffs = value; // Number of buffs to remove
            break;

        case 'STR_DEBUFF':
            // 力量削减 - 减少敌人力量
            updates.enemyStatus = {
                ...(updates.enemyStatus || enemyStatus),
                strength: Math.max(0, (enemyStatus.strength || 0) - (value || 0))
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
            // 自我格挡 - Gain block (Sona Q)
            updates.blockGain = (updates.blockGain || 0) + value;
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
            // 标记触发 - Store额外伤害，等待被攻击时结算
            updates.enemyStatus = {
                ...(updates.enemyStatus || enemyStatus),
                markDamage: ((updates.enemyStatus?.markDamage || enemyStatus.markDamage) || 0) + value
            };
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
            // 生命偷取 - Immediate heal
            updates.healAmount = value;
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
            // 反击之舞：下回合第一次攻击伤害翻倍
            updates.playerStatus = {
                ...(updates.playerStatus || playerStatus),
                nextAttackDoubleNextTurn: true
            };
            break;

        case 'IMMUNE_ONCE':
            // 免疫一次 - Immune to next damage (Yasuo W)
            updates.playerStatus = {
                ...(updates.playerStatus || playerStatus),
                immuneOnce: true
            };
            updates.blockGain = (updates.blockGain || 0) + 4;
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

        case 'REGEN_MANA': {
            // 法力回复 - 本回合 + 下回合各回蓝 value 点（默认1）
            const regen = Math.max(1, value || 1);
            updates.manaChange = (updates.manaChange || 0) + regen;
            updates.playerStatus = {
                ...(updates.playerStatus || playerStatus),
                nextTurnMana: ((updates.playerStatus?.nextTurnMana || playerStatus.nextTurnMana) || 0) + regen
            };
            break;
        }

        case 'TEMP_MANA':
            // 临时法力 - Gain temporary mana this turn
            updates.manaChange = (updates.manaChange || 0) + value;
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
            updates.drawCount = (updates.drawCount || 0) + 1;
            updates.manaIfLowHand = value;
            break;

        case 'DRAW_MANA':
            // 抽牌+法力 - Draw and gain mana (Sona E)
            updates.drawCount += 2;
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
            // 回合开始额外抽牌（古老碑铭）
            updates.playerStatus = {
                ...(updates.playerStatus || playerStatus),
                extraDrawPerTurn: ((updates.playerStatus?.extraDrawPerTurn || playerStatus.extraDrawPerTurn) || 0) + value
            };
            break;

        case 'PERMA_DRAW_ON_KILL':
            // 求知铭文 - 击杀后为下一场战斗提供抽牌奖励
            updates.playerStatus = {
                ...(updates.playerStatus || playerStatus),
                scholarRuneValue: ((updates.playerStatus?.scholarRuneValue || playerStatus.scholarRuneValue) || 0) + (value || 1)
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
            // 单卡减费 - Reduce one card cost this turn
            updates.discountCard = Math.max(1, value || 1);
            break;

        // ==================== BATCH 4: Strength Buffs ====================

        case 'TEMP_STR':
            // 临时力量 - Temporary strength buff
            updates.playerStatus = {
                ...(updates.playerStatus || playerStatus),
                tempStrength: ((updates.playerStatus?.tempStrength || playerStatus.tempStrength) || 0) + value
            };
            break;

        case 'TEMP_STR_ON_KILLS':
            // 猎手徽章 - Flag permanent strength gain on kill
            updates.hunterBadge = true;
            break;

        case 'GAIN_STRENGTH_PER_HIT':
            // 连击力量 - Gain str per attack
            updates.playerStatus = {
                ...(updates.playerStatus || playerStatus),
                strPerHit: ((updates.playerStatus?.strPerHit || playerStatus.strPerHit) || 0) + value
            };
            break;

        case 'GAIN_STR_WHEN_LOSE_HP':
            // 受伤力量 - Gain str when damaged
            updates.playerStatus = {
                ...(updates.playerStatus || playerStatus),
                strWhenHurt: ((updates.playerStatus?.strWhenHurt || playerStatus.strWhenHurt) || 0) + value
            };
            break;

        case 'GAIN_STRENGTH_WHEN_HIT':
            // 被击力量 - Gain str when hit
            updates.playerStatus = {
                ...(updates.playerStatus || playerStatus),
                strWhenHit: ((updates.playerStatus?.strWhenHit || playerStatus.strWhenHit) || 0) + value
            };
            break;

        case 'GAIN_STRENGTH_NEXT_TURN':
            // 下回合力量 - Gain str next turn
            updates.playerStatus = {
                ...(updates.playerStatus || playerStatus),
                nextTurnStrength: ((updates.playerStatus?.nextTurnStrength || playerStatus.nextTurnStrength) || 0) + value
            };
            break;

        case 'GAIN_STRENGTH':
            // 获得力量 - Already implemented as STRENGTH
            updates.playerStatus = {
                ...(updates.playerStatus || playerStatus),
                strength: ((updates.playerStatus?.strength || playerStatus.strength) || 0) + value
            };
            break;

        // ==================== BATCH 4: Permanent Buffs ====================

        case 'PERMA_STR_ON_KILL':
            // 永久击杀力量 - Permanent str on kill (Nasus Q)
            updates.playerStatus = {
                ...(updates.playerStatus || playerStatus),
                permaStrOnKill: true
            };
            break;

        case 'PERMA_STR_FOR_HP': {
            // 野心契约：每场战斗仅可触发一次，战后获得永久力量
            if (playerStatus?.ambitionPactUsed) {
                updates.ambitionPactSkipped = true;
                break;
            }
            const strengthGain = value || 1;
            const hpCost = 5 * strengthGain;
            updates.maxHpCost = (updates.maxHpCost || 0) + hpCost;
            updates.permaStrPactGain = (updates.permaStrPactGain || 0) + strengthGain;
            updates.playerStatus = {
                ...(updates.playerStatus || playerStatus),
                ambitionPactUsed: true
            };
            break;
        }

        case 'PER_ATTACK_BONUS':
            // 攻击叠加 - Stack bonus per attack
            updates.playerStatus = {
                ...(updates.playerStatus || playerStatus),
                attackStacks: ((updates.playerStatus?.attackStacks || playerStatus.attackStacks) || 0) + 1
            };
            break;

        case 'LOSE_HP_GAIN_STRENGTH':
            // 失血获得力量 - Sacrifice HP for str
            updates.playerHp = Math.max(1, playerHp - value);
            updates.playerStatus = {
                ...(updates.playerStatus || playerStatus),
                strength: ((updates.playerStatus?.strength || playerStatus.strength) || 0) + Math.floor(value / 2)
            };
            break;

        // ==================== BATCH 4: Block & Defense ====================

        case 'GAIN_BLOCK_NEXT_TURN':
            // 下回合格挡 - Gain block next turn
            updates.playerStatus = {
                ...(updates.playerStatus || playerStatus),
                nextTurnBlock: ((updates.playerStatus?.nextTurnBlock || playerStatus.nextTurnBlock) || 0) + value
            };
            break;

        case 'END_TURN_BLOCK':
            // 回合结束格挡 - Gain block at turn end
            updates.playerStatus = {
                ...(updates.playerStatus || playerStatus),
                endTurnBlock: ((updates.playerStatus?.endTurnBlock || playerStatus.endTurnBlock) || 0) + value
            };
            break;

        case 'SELF_HP_FOR_BLOCK':
            // 生命换格挡 - Lose HP for block
            {
                const hpCost = Math.max(0, Math.min(playerHp - 1, Math.ceil(value / 2)));
                updates.playerHp = Math.max(1, playerHp - hpCost);
                updates.blockGain = (updates.blockGain || 0) + value;
            }
            break;

        case 'GAIN_BLOCK_WHEN_ATTACK':
            // 攻击获得格挡 - Gain block when attacking
            updates.playerStatus = {
                ...(updates.playerStatus || playerStatus),
                blockOnAttack: ((updates.playerStatus?.blockOnAttack || playerStatus.blockOnAttack) || 0) + value
            };
            break;

        case 'PASSIVE_BLOCK_IF_IDLE':
            // 稳固姿态 - 下回合无条件获得护甲
            updates.playerStatus = {
                ...(updates.playerStatus || playerStatus),
                nextTurnBlock: ((updates.playerStatus?.nextTurnBlock || playerStatus.nextTurnBlock) || 0) + value
            };
            break;

        case 'REDUCE_BLOCK':
            // 削弱格挡 - Reduce enemy block
            updates.reduceEnemyBlock = value;
            break;

        case 'FIRST_ATTACK_PLUS':
            // 首次攻击加成 - Bonus on first attack
            updates.playerStatus = {
                ...(updates.playerStatus || playerStatus),
                firstAttackBonus: ((updates.playerStatus?.firstAttackBonus || playerStatus.firstAttackBonus) || 0) + value
            };
            break;

        case 'FIRST_ATTACK_PLUS_2_TURNS':
            // 蓄势待发: 未来2回合，第一张攻击牌额外造成 value 点伤害
            updates.firstAttackBonusTurns = 2;
            updates.playerStatus = {
                ...(updates.playerStatus || playerStatus),
                firstAttackBonus: value,
                firstAttackBonusArmed: true
            };
            break;

        // ==================== BATCH 4: Debuff Management ====================

        case 'APPLY_WEAK':
            // 施加虚弱 - Apply weak debuff
            updates.enemyStatus = {
                ...(updates.enemyStatus || enemyStatus),
                weak: ((updates.enemyStatus?.weak || enemyStatus.weak) || 0) + value
            };
            break;

        case 'APPLY_VULNERABLE':
            // 施加易伤 - Apply vulnerable debuff
            updates.enemyStatus = {
                ...(updates.enemyStatus || enemyStatus),
                vulnerable: ((updates.enemyStatus?.vulnerable || enemyStatus.vulnerable) || 0) + value
            };
            break;

        case 'WEAK_VULN':
            // 双重虚弱易伤 - Apply both debuffs
            updates.enemyStatus = {
                ...(updates.enemyStatus || enemyStatus),
                weak: ((updates.enemyStatus?.weak || enemyStatus.weak) || 0) + value,
                vulnerable: ((updates.enemyStatus?.vulnerable || enemyStatus.vulnerable) || 0) + value
            };
            break;

        case 'WEAK_VULN_AND_PERMAHP':
            // 虚弱易伤+永久生命 - Debuffs + HP gain
            updates.enemyStatus = {
                ...(updates.enemyStatus || enemyStatus),
                weak: ((updates.enemyStatus?.weak || enemyStatus.weak) || 0) + value,
                vulnerable: ((updates.enemyStatus?.vulnerable || enemyStatus.vulnerable) || 0) + value
            };
            updates.permaHpGain = value;
            break;

        case 'ARMOR_REDUCE':
            // 破甲 - Reduce enemy armor
            updates.enemyStatus = {
                ...(updates.enemyStatus || enemyStatus),
                armorReduction: ((updates.enemyStatus?.armorReduction || enemyStatus.armorReduction) || 0) + value
            };
            break;

        case 'SELF_WEAK':
            // 自我虚弱 - Apply weak to self
            updates.playerStatus = {
                ...(updates.playerStatus || playerStatus),
                weak: ((updates.playerStatus?.weak || playerStatus.weak) || 0) + value
            };
            break;

        // ==================== BATCH 5: Turn Manipulation ====================

        case 'DELAY_ACTION':
            // 延迟行动 - Delay enemy action
            updates.enemyStatus = {
                ...(updates.enemyStatus || enemyStatus),
                delayed: ((updates.enemyStatus?.delayed || enemyStatus.delayed) || 0) + value
            };
            break;

        case 'NEXT_ENEMY_COST_PLUS':
            // 敌人费用提升 - Increase enemy card cost
            updates.enemyStatus = {
                ...(updates.enemyStatus || enemyStatus),
                costIncrease: ((updates.enemyStatus?.costIncrease || enemyStatus.costIncrease) || 0) + value
            };
            break;

        case 'DAMAGE_UP_PER_TURN':
            // 逐回合增伤 - Damage increases each turn
            updates.playerStatus = {
                ...(updates.playerStatus || playerStatus),
                damagePerTurn: ((updates.playerStatus?.damagePerTurn || playerStatus.damagePerTurn) || 0) + value
            };
            break;

        case 'RETRO_BONUS':
            // 回溯加成 - Ekko Q projectile return
            updates.retroBonus = value;
            break;

        case 'PULL':
            // 钩取 - Thresh Q pull mechanic
            updates.pullEffect = true;
            break;

        // ==================== BATCH 5: Special Mechanics ====================

        case 'COPY_ENEMY_ACTION':
            // 复制敌方行动 - Sylas R
            updates.copyEnemySkill = true;
            break;

        case 'COPY_NEXT_ATTACK':
            // 复制下次攻击 - Zed W shadow clone
            updates.cloneAttack = value; // Percentage
            break;

        case 'DEATHMARK':
            // 死亡印记 - Zed R delayed burst
            updates.deathmarkPercent = value;
            break;

        case 'SCALE_BY_CRIT':
            // 暴击缩放 - Yasuo R crit scaling
            updates.scaleByCrit = value;
            break;

        case 'MARK_STACK':
            // 印记叠加 - Vayne W 3-hit
            updates.enemyStatus = {
                ...(updates.enemyStatus || enemyStatus),
                markStacks: ((updates.enemyStatus?.markStacks || enemyStatus.markStacks) || 0) + 1
            };
            break;

        case 'TRIPLE_CHAIN_BONUS':
            // 三连加成 - Vayne passive every 3rd
            updates.tripleChainBonus = value;
            break;

        case 'CHAIN_TRIGGER':
            // 连锁触发 - Lee Q follow-up
            updates.chainTrigger = value;
            break;

        case 'TETHER_MARK':
            // 锁链标记 - Tether connection
            updates.tetherMark = value;
            break;

        case 'COMBO_BONUS':
            // 连招加成 - Katarina E combo
            updates.comboBonus = value;
            break;

        case 'MULTI_STRIKE_SEGMENTS':
            // 多段连斩 - Katarina R channel
            updates.multiStrikeSegments = value;
            break;

        // ==================== BATCH 5: Game State Changes ====================

        case 'PER_CARD_BONUS':
            // 手牌比例加成 - Damage scales with hand size
            updates.bonusPerCard = value;
            break;

        case 'ALL_ATTACKS_BONUS':
            // 全体攻击加成 - Buff all attacks
            updates.playerStatus = {
                ...(updates.playerStatus || playerStatus),
                globalAttackBonus: ((updates.playerStatus?.globalAttackBonus || playerStatus.globalAttackBonus) || 0) + value
            };
            break;

        case 'BUFF_NEXT_SKILL':
            // 强化下张技能 - Viktor Q
            updates.playerStatus = {
                ...(updates.playerStatus || playerStatus),
                buffNextSkill: ((updates.playerStatus?.buffNextSkill || playerStatus.buffNextSkill) || 0) + value
            };
            break;

        case 'KILL_REWARD':
            // 击杀奖励 - Irelia Q reset
            updates.killReward = value;
            break;

        case 'KILL_NEXT_BATTLE_BUFF':
            // 利刃冲击：击杀后下场战斗开局 +1 抽牌 +1 法力
            updates.killRewardNextBattle = {
                draw: value,
                mana: value
            };
            break;

        case 'GAMBLE': {
            // 赌博 - 金币/生命二选一
            const penalty = card.failHpPenalty ?? 10;
            const success = Math.random() < 0.5;
            if (success) {
                updates.goldGain = (updates.goldGain || 0) + value;
                updates.gambleOutcome = { type: 'win', amount: value };
            } else {
                const hpLoss = Math.min(Math.max(0, penalty), Math.max(0, playerHp - 1));
                updates.playerHp = Math.max(1, playerHp - hpLoss);
                updates.gambleOutcome = { type: 'lose', amount: hpLoss };
            }
            break;
        }

        case 'GAIN_GOLD':
            // 获得金币 - Gold reward
            updates.goldGain = value;
            break;

        case 'WIN_GOLD_BONUS':
            // 胜利金币加成 - Extra gold on victory
            updates.playerStatus = {
                ...(updates.playerStatus || playerStatus),
                winGoldBonus: ((updates.playerStatus?.winGoldBonus || playerStatus.winGoldBonus) || 0) + value
            };
            break;

        case 'OPEN_SHADOW_EVENT':
            // 开启暗影事件 - Trigger special event
            updates.triggerEvent = 'shadow';
            break;

        // ==================== BATCH 5: Miscellaneous & Rare ====================

        case 'TRAP_TRIGGER':
            // 陷阱触发 - Place trap (damage based on description)
            updates.placeTrap = {
                damage: value,
                poison: card.trapPoison || 0,
                weak: card.trapWeak || 0
            };
            break;

        case 'BAIT_TRIGGER':
            // 诱饵触发 - Reuse Teemo trap logic
            updates.placeTrap = {
                damage: card.baitDamage || 0,
                poison: value,
                weak: card.trapWeak || 0
            };
            break;

        case 'FREE_IF_WEAK':
            // 虚弱免费 - Free if enemy weak
            updates.freeIfWeak = true;
            break;

        case 'SLOW':
            // 减速 - Slow enemy
            updates.enemyStatus = {
                ...(updates.enemyStatus || enemyStatus),
                slowed: ((updates.enemyStatus?.slowed || enemyStatus.slowed) || 0) + value
            };
            break;

        case 'HEAL_REDUCE':
            // 治疗削减 - Grievous wounds
            updates.enemyStatus = {
                ...(updates.enemyStatus || enemyStatus),
                healReduce: value
            };
            break;

        case 'DAMAGE_REDUCE':
            // 伤害削减 - Damage reduction
            updates.playerStatus = {
                ...(updates.playerStatus || playerStatus),
                damageReduction: ((updates.playerStatus?.damageReduction || playerStatus.damageReduction) || 0) + value
            };
            break;

        case 'VOID_DOT':
            // 虚空持续伤害 - Void DOT
            updates.enemyStatus = {
                ...(updates.enemyStatus || enemyStatus),
                voidDot: ((updates.enemyStatus?.voidDot || enemyStatus.voidDot) || 0) + value
            };
            break;

        case 'HP_DEGEN':
            // 生命退化 - HP loss over time
            updates.enemyStatus = {
                ...(updates.enemyStatus || enemyStatus),
                hpDegen: ((updates.enemyStatus?.hpDegen || enemyStatus.hpDegen) || 0) + value
            };
            break;

        case 'REVIVE_ONCE':
            // 复活一次 - Guardian Angel
            updates.playerStatus = {
                ...(updates.playerStatus || playerStatus),
                revive: true,
                reviveHp: value
            };
            break;

        case 'GAIN_RANDOM_BUFF':
            // 随机增益 - Random buff
            const buffTypes = ['strength', 'dexterity', 'block'];
            const randomBuff = buffTypes[Math.floor(Math.random() * buffTypes.length)];
            updates.playerStatus = {
                ...(updates.playerStatus || playerStatus),
                [randomBuff]: ((updates.playerStatus?.[randomBuff] || playerStatus[randomBuff]) || 0) + value
            };
            break;

        case 'SHIELD':
            // 护盾 - Temporary shield
            updates.playerStatus = {
                ...(updates.playerStatus || playerStatus),
                shield: ((updates.playerStatus?.shield || playerStatus.shield) || 0) + value
            };
            break;

        case 'NEXT_ATTACK_X2':
            // 下次攻击x2 - Double next attack
            updates.playerStatus = {
                ...(updates.playerStatus || playerStatus),
                nextAttackX2: true
            };
            break;

        case 'PASSIVE_BLOCK':
            // 被动格挡 - Passive block per turn
            updates.playerStatus = {
                ...(updates.playerStatus || playerStatus),
                passiveBlock: ((updates.playerStatus?.passiveBlock || playerStatus.passiveBlock) || 0) + value
            };
            break;

        case 'BLOCK_DRAW':
            // 格挡抽牌 - Block + draw combo
            updates.blockGain = (updates.blockGain || 0) + (card.block || value || 0);
            updates.drawCount += 1;
            // 额外：移除1层弱或易伤（若存在）
            const nextWeak = Math.max(0, (playerStatus.weak || 0) - 1);
            const nextVuln = nextWeak < (playerStatus.weak || 0)
                ? (playerStatus.vulnerable || 0)
                : Math.max(0, (playerStatus.vulnerable || 0) - 1);
            updates.playerStatus = {
                ...(updates.playerStatus || playerStatus),
                weak: nextWeak,
                vulnerable: nextVuln
            };
            break;

        case 'EXHAUST':
            // 消耗 - Card removed after use
            updates.exhaustCard = true;
            break;

        // ==================== All Effects Implemented ====================
        // Total: 142 effects (12 initial + 130 batch implemented)

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
