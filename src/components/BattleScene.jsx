import React, { useState, useEffect, useRef } from 'react';
import { Sword, Shield, Zap, Skull, Activity, AlertTriangle, Droplet, Ghost, Crosshair, Lock, RefreshCw, TrendingDown, Clock, Layers, Flame, Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { CARD_DATABASE } from '../data/cards';
import { RELIC_DATABASE } from '../data/relics';
import { ENEMY_POOL } from '../data/enemies';
import { scaleEnemyStats, shuffle } from '../utils/gameLogic';
import { ACT_BACKGROUNDS } from '../data/constants';
import { playSfx, playChampionVoice } from '../utils/audioManager';
import { applyCardEffects, calculateBlockValue } from '../utils/cardEffectHandler';
import Card from './shared/Card';

const DEX_BLOCK_PER_STACK = 5;

const BattleScene = ({ heroData, enemyId, initialDeck, onWin, onLose, floorIndex, act }) => {
    const getScaledEnemy = (enemyId, floor, currentAct) => {
        const baseEnemy = ENEMY_POOL[enemyId];
        if (!baseEnemy) {
            console.error(`Enemy not found: ${enemyId}`);
            return { maxHp: 50, actions: [{ type: 'ATTACK', value: 5 }] };
        }
        const { maxHp, actions } = scaleEnemyStats(baseEnemy, floor, currentAct);
        return { ...baseEnemy, maxHp, actions };
    };
    const enemyConfig = getScaledEnemy(enemyId, floorIndex, act);
    const initialMana = heroData.maxMana || 3;
    const [gameState, setGameState] = useState('PLAYER_TURN');
    const [playerHp, setPlayerHp] = useState(heroData.currentHp);
    const [playerBlock, setPlayerBlock] = useState(0);
    const [playerMana, setPlayerMana] = useState(initialMana);
    const [enemyHp, setEnemyHp] = useState(enemyConfig.maxHp);
    const [enemyBlock, setEnemyBlock] = useState(0);
    const [nextEnemyAction, setNextEnemyAction] = useState(enemyConfig.actions[0]);

    const deckRef = useRef({ drawPile: [], hand: [], discardPile: [] });
    const [renderTrigger, setRenderTrigger] = useState(0);
    const forceUpdate = () => setRenderTrigger(prev => prev + 1);
    const [dmgOverlay, setDmgOverlay] = useState(null);
    const [heroAnim, setHeroAnim] = useState("");
    const [enemyAnim, setEnemyAnim] = useState("");
    const [playerStatus, setPlayerStatus] = useState({
        strength: heroData.baseStr || 0,
        weak: 0,
        vulnerable: 0,
        dexterity: 0,
        nextTurnBlock: 0,
        nextTurnStrength: 0,
        nextTurnMana: 0,
        nextDrawBonus: 0,
        critChance: 0,
        critDamageMultiplier: 2
    });
    const [enemyStatus, setEnemyStatus] = useState({ strength: 0, weak: 0, vulnerable: 0, mark: 0, markDamage: 0 });

    // 被动技能状态追踪
    const [rivenAttackCount, setRivenAttackCount] = useState(0); // 瑞文：攻击计数
    const [leeSinSkillBuff, setLeeSinSkillBuff] = useState(false); // 盲僧：技能牌buff
    const [vayneHitCount, setVayneHitCount] = useState(0); // 薇恩：连击计数
    const [zedFirstAttack, setZedFirstAttack] = useState(true); // 劫：首次攻击标记
    const [katarinaAttackCount, setKatarinaAttackCount] = useState(0); // 卡特琳娜：攻击计数
    const [lastPlayedCard, setLastPlayedCard] = useState(null); // 追踪最后打出的牌
    const [cardsPlayedCount, setCardsPlayedCount] = useState(0); // 本回合打出的卡牌数量
    const [attacksThisTurn, setAttacksThisTurn] = useState(0); // 本回合打出的攻击牌数量
    // Batch 2: 暴击系统
    const [critCount, setCritCount] = useState(0);
    // Batch 2: 伤害历史追踪
    const [dealtDamageThisTurn, setDealtDamageThisTurn] = useState(false);
    const [dealtDamageLastTurn, setDealtDamageLastTurn] = useState(false);
    // Batch 2: 死亡印记
    const [deathMarkDamage, setDeathMarkDamage] = useState(0);

    useEffect(() => {
        // 战斗开始时播放英雄语音
        if (heroData?.id) {
            playChampionVoice(heroData.id);
        }

        if (!heroData || !initialDeck) return;

        const initialDrawPile = shuffle([...initialDeck]);
        deckRef.current = { drawPile: initialDrawPile, hand: [], discardPile: [] };
        let block = 0; let str = heroData.baseStr || 0;
        (heroData.relics || []).forEach(rid => {
            const relic = RELIC_DATABASE[rid];
            if (relic && relic.onBattleStart) { const newState = relic.onBattleStart({ block, status: { strength: str } }); block = newState.block; str = newState.status.strength; }
            if (rid === heroData.relicId && heroData.relicId === "UrgotPassive") block += 15;
        });
        setPlayerBlock(block); setPlayerStatus(prev => ({ ...prev, strength: str }));
        startTurnLogic();
    }, []);

    const triggerAnim = (target, type) => { if (target === 'HERO') { setHeroAnim(type); setTimeout(() => setHeroAnim(""), 500); } if (target === 'ENEMY') { setEnemyAnim(type); setTimeout(() => setEnemyAnim(""), 500); } };

    const drawCards = (count) => {
        let { drawPile, hand, discardPile } = deckRef.current;
        for (let i = 0; i < count; i++) {
            if (drawPile.length === 0) {
                if (discardPile.length === 0) break;
                drawPile = shuffle([...discardPile]);
                discardPile = [];
            }
            hand.push(drawPile.pop());
        }
        deckRef.current = { drawPile, hand, discardPile };
        forceUpdate();
        playSfx('DRAW');
    };

    const startTurnLogic = () => {
        setGameState('PLAYER_TURN');
        setPlayerMana(initialMana + (heroData.relicId === "LuxPassive" ? 1 : 0));
        // 护甲不清零，累积到下一回合（符合 Slay the Spire 机制）
        // setPlayerBlock(0); // 已移除
        let drawCount = 5; if (heroData.relicId === "JinxPassive") drawCount = 6;
        drawCards(drawCount);
        setCardsPlayedCount(0); // 重置卡牌计数
        setAttacksThisTurn(0); // 重置攻击计数
        setCritCount(0); // Batch 2: 重置暴击计数
        setPlayerStatus(prev => ({
            ...prev,
            critChance: 0,
            lifelink: 0,
            reflectDamage: 0,
            buffNextSkill: 0,
            nextAttackCostReduce: 0,
            critDamageMultiplier: prev.critDamageMultiplier || 2
        }));
        if (heroData.relicId === "ViktorPassive" && Math.random() < 0.5) {
            const basicCard = shuffle(['Strike', 'Defend'])[0];
            let { hand } = deckRef.current;
            hand.push(basicCard);
            forceUpdate();
        }
        setNextEnemyAction(enemyConfig.actions[Math.floor(Math.random() * enemyConfig.actions.length)]);

        // 被动技能：回合开始触发
        // 劫被动：重置首次攻击标记
        if (heroData.relicId === "ZedPassive") {
            setZedFirstAttack(true);
        }
        // 卡特琳娜被动：重置计数器
        if (heroData.relicId === "KatarinaPassive") {
            setKatarinaAttackCount(0);
        }
        // 提莫被动：回合开始给敌人2层虚弱
        if (heroData.relicId === "TeemoPassive") {
            setEnemyStatus(s => ({ ...s, weak: s.weak + 2 }));
        }

        // 添加 null 检查防止 relic 为 undefined
        (heroData.relics || []).forEach(rid => {
            const relic = RELIC_DATABASE[rid];
            if (relic && relic.onTurnStart) {
                const { pState, eState } = relic.onTurnStart({ hp: playerHp, maxHp: heroData.maxHp }, { hp: enemyHp });
                setPlayerHp(pState.hp);
                setEnemyHp(eState.hp);
            }
        });
    };

    const playCard = (index) => {
        if (gameState !== 'PLAYER_TURN') return;
        const { hand, discardPile } = deckRef.current;
        const cardId = hand[index];
        if (!cardId) return; // 防止无效的 cardId

        // 处理升级卡牌 (带 + 后缀)
        const isUpgraded = cardId.endsWith('+');
        const baseId = isUpgraded ? cardId.slice(0, -1) : cardId;
        const baseCard = CARD_DATABASE[baseId];

        if (!baseCard) {
            console.error(`Card not found in database: ${baseId}`);
            return;
        }

        const cardsPlayedBefore = cardsPlayedCount;
        const attackCountBeforeCard = attacksThisTurn;

        // 如果是升级卡牌，增强属性
        let card = {
            ...baseCard,
            value: isUpgraded && baseCard.value ? baseCard.value + 3 : baseCard.value,
            block: isUpgraded && baseCard.block ? baseCard.block + 3 : baseCard.block,
            effectValue: isUpgraded && baseCard.effectValue ? baseCard.effectValue + 1 : baseCard.effectValue
        };

        // 盲僧被动：技能牌后下一张攻击牌-1费
        let actualCost = card.cost;
        if (heroData.relicId === "LeeSinPassive" && card.type === 'ATTACK' && leeSinSkillBuff) {
            actualCost = Math.max(0, card.cost - 1);
            setLeeSinSkillBuff(false); // 消耗buff
        }

        if (playerMana < actualCost) return;
        setPlayerMana(p => p - actualCost);
        const newHand = [...hand]; newHand.splice(index, 1);
        if (!card.exhaust) { deckRef.current = { ...deckRef.current, hand: newHand, discardPile: [...discardPile, cardId] }; }
        else { deckRef.current = { ...deckRef.current, hand: newHand }; }
        forceUpdate();

        // 记录最后打出的牌（用于内瑟斯/艾瑞莉娅被动）
        setLastPlayedCard(card);
        setCardsPlayedCount(prev => prev + 1);

        // 处理卡牌效果
        const effectUpdates = applyCardEffects(card, {
            playerHp,
            maxHp: heroData.maxHp,
            playerStatus,
            enemyStatus
        });
        const mergedPlayerStatus = {
            ...playerStatus,
            ...(effectUpdates.playerStatus || {})
        };
        const mergedEnemyStatus = {
            ...enemyStatus,
            ...(effectUpdates.enemyStatus || {})
        };
        if (effectUpdates.drawCount > 0) drawCards(effectUpdates.drawCount);
        if (effectUpdates.playerHp !== undefined && effectUpdates.playerHp !== null) setPlayerHp(effectUpdates.playerHp);
        if (effectUpdates.manaChange) setPlayerMana(m => Math.min(initialMana, m + effectUpdates.manaChange));
        if (effectUpdates.healAndDamage) {
            setPlayerHp(h => Math.min(heroData.maxHp, h + effectUpdates.healAndDamage));
        }

        // FIX: 金币奖励 (Bug #2)
        if (effectUpdates.goldGain) {
            setGold(gold => gold + effectUpdates.goldGain);
        }

        // FIX: 下回合效果 (Bug #5, #9) - merge status updates
        if (effectUpdates.playerStatus) {
            setPlayerStatus(prev => ({
                ...prev,
                ...effectUpdates.playerStatus
            }));
        }
        if (effectUpdates.enemyStatus) {
            setEnemyStatus(prev => ({
                ...prev,
                ...effectUpdates.enemyStatus
            }));
        }

        // 盲僧被动：技能牌后设置buff
        if (card.type === 'SKILL' && heroData.relicId === "LeeSinPassive") {
            setLeeSinSkillBuff(true);
        }

        if (card.type === 'ATTACK') {
            // 瑞文被动：攻击牌计数
            if (heroData.relicId === "RivenPassive") {
                const newCount = rivenAttackCount + 1;
                if (newCount >= 3) {
                    setPlayerMana(m => Math.min(initialMana, m + 1)); // 恢复1点能量
                    setRivenAttackCount(0);
                } else {
                    setRivenAttackCount(newCount);
                }
            }

            // 卡特琳娜被动：攻击牌计数
            if (heroData.relicId === "KatarinaPassive") {
                setKatarinaAttackCount(prev => prev + 1);
            }
            // 播放攻击挥击音效
            playSfx('ATTACK_SWING');
            triggerAnim('HERO', 'attack');

            // R技能特效 (简单处理)
            if (card.rarity === 'RARE') {
                // 可以添加更华丽的特效逻辑
            }

            setTimeout(() => {
                triggerAnim('ENEMY', 'hit');
                // 延迟播放攻击命中音效
                playSfx('ATTACK_HIT');
            }, 200);
            // FIX Bug #1: MULTI_HIT伤害计算 - 易伤应该加成基础伤害，然后再乘以次数
            let baseDmg = card.value + (mergedPlayerStatus.strength || 0);
            if (mergedPlayerStatus.weak > 0) baseDmg = Math.floor(baseDmg * 0.75);

            // FIX Bug #8: 首次攻击加倍 (耀光)
            if (!mergedPlayerStatus.firstAttackUsed && mergedPlayerStatus.firstAttackBonus) {
                baseDmg += mergedPlayerStatus.firstAttackBonus;
                setPlayerStatus(prev => ({ ...prev, firstAttackUsed: true }));
            }

            // 易伤加成应用于基础伤害 (方案A)
            // if (enemyStatus.vulnerable > 0) {
            //     baseDmg = Math.floor(baseDmg * 1.5);
            // }
            // MOVED TO BELOW to use currentEnemyStatus

            // 卡特琳娜被动：每打出3张攻击牌后，下一张(第4张)攻击牌伤害翻倍
            if (heroData.relicId === "KatarinaPassive" && katarinaAttackCount === 3) {
                baseDmg = baseDmg * 2;
                setKatarinaAttackCount(0); // 重置计数器
            }

            // FIX: 下一次攻击加成 (NEXT_ATTACK_BONUS) - VayneQ
            if ((mergedPlayerStatus.nextAttackBonus || 0) > 0) {
                baseDmg += mergedPlayerStatus.nextAttackBonus;
                setPlayerStatus(prev => ({ ...prev, nextAttackBonus: 0 }));
            }

            // FIX: 斩杀加成 (EXECUTE_SCALE) - GarenR
            if (effectUpdates.executeScale) {
                const missingHp = enemyConfig.maxHp - enemyHp;
                baseDmg += Math.floor(missingHp * effectUpdates.executeScale);
            }

            // FIX: 条件双倍 (CONDITIONAL_DOUBLE) - LuxR
            if (effectUpdates.conditionalDouble && cardsPlayedIncludingCurrent >= effectUpdates.conditionalDouble) {
                baseDmg *= 2; // 满足本回合出牌数量要求后伤害翻倍
            }

            // FIX: 低血加成 (LOW_HP_BONUS) - JinxR
            if (effectUpdates.lowHpBonus && enemyHp < enemyConfig.maxHp * 0.5) {
                baseDmg += effectUpdates.lowHpBonus;
            }

            // Batch 2: 暴击次数缩放 (SCALE_BY_CRIT) - YasuoR
            if (card.effect === 'SCALE_BY_CRIT') {
                baseDmg = baseDmg * Math.max(1, critCount || 0); // 伤害 = 基础值 × 暴击次数
            }

            // Batch 2: 回溯加成 (RETRO_BONUS) - EkkoQ
            if (effectUpdates.retroBonus) {
                if (dealtDamageLastTurn) {
                    baseDmg += effectUpdates.retroBonus; // 如果上回合造成过伤害，增加伤害
                }
            }

            // FIX: 支持 MULTI_HIT from effectUpdates
            const hits = card.isMultiHit ? card.hits : (effectUpdates.multiHitCount || 1);
            let total = 0;
            let isFirstHit = true; // 用于劫被动

            const currentEnemyStatus = mergedEnemyStatus;
            const cardsPlayedIncludingCurrent = cardsPlayedBefore + 1;
            const priorCardsThisTurn = Math.max(0, cardsPlayedIncludingCurrent - 1);
            const totalCritChancePercent = Math.max(0, mergedPlayerStatus.critChance || 0);
            const critChanceDecimal = Math.min(1, totalCritChancePercent / 100);
            const critDamageMultiplier = mergedPlayerStatus.critDamageMultiplier || 2;
            const shouldForceCrit = !!effectUpdates.critIfVuln && (currentEnemyStatus.vulnerable > 0);

            // 易伤加成应用于基础伤害 (方案A) - 使用合并后的状态
            if (currentEnemyStatus.vulnerable > 0) {
                baseDmg = Math.floor(baseDmg * 1.5);
            }

            // 标记额外伤害 (如破绽刺击)
            if (effectUpdates.bonusIfMarked && (currentEnemyStatus.mark || 0) > 0) {
                baseDmg += effectUpdates.bonusIfMarked;
            }

            if (effectUpdates.bonusIfVuln && currentEnemyStatus.vulnerable > 0) {
                baseDmg += effectUpdates.bonusIfVuln;
            }

            // FIX: 下一次攻击翻倍 (NEXT_ATTACK_DOUBLE)
            if (mergedPlayerStatus.nextAttackDouble) {
                baseDmg *= 2;
                setPlayerStatus(prev => ({ ...prev, nextAttackDouble: false }));
            }

            if (effectUpdates.doubleIfAttacked && attackCountBeforeCard > 0) {
                baseDmg *= 2;
            }

            if (effectUpdates.bonusPerCard && priorCardsThisTurn > 0) {
                baseDmg += effectUpdates.bonusPerCard * priorCardsThisTurn;
            }

            // 卡特琳娜被动：每打出3张攻击牌后，下一张(第4张)攻击牌伤害翻倍
            if (heroData.relicId === "KatarinaPassive" && katarinaAttackCount === 3) {
                baseDmg = baseDmg * 2;
                setKatarinaAttackCount(0); // 重置计数器
            }

            const shouldExecute = effectUpdates.executeThreshold && (enemyHp <= enemyConfig.maxHp * (effectUpdates.executeThreshold / 100));

            const processMultiHit = () => {
                for (let i = 0; i < hits; i++) {
                    let finalDmg = baseDmg; // 每次击打使用已计算易伤的基础伤害
                    if (heroData.relicId === "YasuoPassive" && Math.random() < 0.1) finalDmg = Math.floor(finalDmg * 2);
                    if (heroData.relics.includes("InfinityEdge")) finalDmg = Math.floor(finalDmg * 1.5);

                    // 劫被动：首张攻击牌额外50%伤害（只在第一次命中时触发）
                    if (heroData.relicId === "ZedPassive" && zedFirstAttack && isFirstHit) {
                        const bonusDmg = Math.floor(finalDmg * 0.5);
                        finalDmg += bonusDmg;
                        setZedFirstAttack(false); // 标记已使用
                    }

                    const didCrit = shouldForceCrit || (critChanceDecimal > 0 && Math.random() < critChanceDecimal);
                    if (didCrit) {
                        finalDmg = Math.floor(finalDmg * critDamageMultiplier);
                        setCritCount(prev => prev + 1);
                        playSfx('CRIT_HIT');
                        console.debug('[CRIT_DEBUG]', {
                            card: card.id,
                            hitIndex: i,
                            totalCritChancePercent,
                            critChanceDecimal,
                            critDamageMultiplier,
                            forced: shouldForceCrit,
                            finalDmg
                        });
                    }

                    isFirstHit = false;
                    let dmgToHp = finalDmg;
                    if (enemyBlock > 0) {
                        // 敌人格挡时播放格挡音效
                        playSfx('BLOCK_SHIELD');
                        if (enemyBlock >= finalDmg) { setEnemyBlock(b => b - finalDmg); dmgToHp = 0; }
                        else { dmgToHp = finalDmg - enemyBlock; setEnemyBlock(0); }
                    } else if (dmgToHp > 0) {
                        // 敌人受击时播放受击音效
                        setTimeout(() => playSfx('HIT_TAKEN'), 250);
                    }

                    // 薇恩被动：连续命中计数
                    if (heroData.relicId === "VaynePassive" && dmgToHp > 0) {
                        const newHitCount = vayneHitCount + 1;
                        if (newHitCount >= 3) {
                            dmgToHp += 10; // 额外10点伤害
                            setVayneHitCount(0); // 重置计数
                        } else {
                            setVayneHitCount(newHitCount);
                        }
                    }

                    setEnemyHp(h => Math.max(0, h - dmgToHp)); total += dmgToHp;

                    // Batch 2: 记录造成伤害 (用于 RETRO_BONUS)
                    if (dmgToHp > 0) setDealtDamageThisTurn(true);

                    // Batch 2: 累积死亡印记伤害
                    if ((currentEnemyStatus.deathMark || 0) > 0) {
                        setDeathMarkDamage(prev => prev + dmgToHp);
                    }

                    // 标记触发：额外伤害并消耗层数
                    if (dmgToHp > 0 && (currentEnemyStatus.mark || 0) > 0 && (currentEnemyStatus.markDamage || 0) > 0) {
                        const triggerDmg = currentEnemyStatus.markDamage;
                        setEnemyHp(h => Math.max(0, h - triggerDmg));
                        total += triggerDmg;
                        const updatedMark = Math.max(0, (currentEnemyStatus.mark || 0) - 1);
                        currentEnemyStatus.mark = updatedMark;
                        if (updatedMark === 0) {
                            currentEnemyStatus.markDamage = 0;
                        }
                        setEnemyStatus(prev => ({
                            ...prev,
                            mark: updatedMark,
                            markDamage: currentEnemyStatus.markDamage
                        }));
                        setTimeout(() => {
                            setDmgOverlay({ val: `标记 ${triggerDmg}`, target: 'ENEMY', color: 'text-orange-400' });
                            setTimeout(() => setDmgOverlay(null), 250);
                        }, i * 300 + 150);
                    }

                    if (heroData.relics.includes("VampiricScepter")) setPlayerHp(h => Math.min(heroData.maxHp, h + 1));
                    if (heroData.relicId === "DariusPassive") setEnemyStatus(s => ({ ...s, weak: s.weak + 1 }));

                    // FIX: Multi-hit display - Stagger damage numbers
                    const hitDmg = dmgToHp; // Capture current hit damage
                    setTimeout(() => {
                        setDmgOverlay({ val: hitDmg, target: 'ENEMY', isCrit: didCrit });
                        setTimeout(() => setDmgOverlay(null), didCrit ? 600 : 250);
                    }, i * 300);
                }
            };

            if (shouldExecute) {
                setEnemyBlock(0);
                setEnemyHp(0);
                setDmgOverlay({ val: 'EXECUTE!', target: 'ENEMY', color: 'text-amber-300' });
                setTimeout(() => setDmgOverlay(null), 600);
                playSfx('HIT_TAKEN');
            } else {
                processMultiHit();
            }
            // setDmgOverlay({ val: total, target: 'ENEMY' }); setTimeout(() => setDmgOverlay(null), 800);
        }
        if (card.block) {
            // 玩家获得格挡时播放格挡音效
            playSfx('BLOCK_SHIELD');
            setPlayerBlock(b => b + card.block);
        }

        if (card.type === 'ATTACK') {
            setAttacksThisTurn(prev => prev + 1);
        }
    };

    useEffect(() => {
        if (enemyHp <= 0) {
            // 敌人死亡时触发的被动
            let battleResult = {
                finalHp: playerHp,
                gainedStr: 0,
                gainedMaxHp: 0
            };

            // 内瑟斯被动：用攻击牌击杀获得1永久力量
            if (heroData.relicId === "NasusPassive" && lastPlayedCard && lastPlayedCard.type === 'ATTACK') {
                battleResult.gainedStr = 1; // 每次击杀固定+1力量
                setPlayerStatus(s => ({ ...s, strength: s.strength + 1 })); // 局内也显示增长
            }

            // 艾瑞莉娅被动：击杀恢复1法力并抽1牌
            if (heroData.relicId === "IreliaPassive") {
                setPlayerMana(m => Math.min(initialMana, m + 1));
                drawCards(1);
            }

            // 锤石被动：敌人死亡增加2最大生命值（记录增长值，由App.jsx处理）
            if (heroData.relicId === "ThreshPassive") {
                battleResult.gainedMaxHp = 2;
                setPlayerHp(h => h + 2); // 立即恢复2HP作为视觉反馈
            }

            playSfx('WIN');
            setTimeout(() => onWin(battleResult), 1000);
        }
    }, [enemyHp]);

    useEffect(() => {
        if (playerHp <= 0) {
            setTimeout(onLose, 1000);
        }
    }, [playerHp]);

    const endTurn = () => {
        const { hand, discardPile } = deckRef.current;
        deckRef.current = { ...deckRef.current, discardPile: [...discardPile, ...hand], hand: [] };
        forceUpdate();
        setGameState('ENEMY_TURN');

        // Batch 2: 更新伤害历史
        setDealtDamageLastTurn(dealtDamageThisTurn);
        setDealtDamageThisTurn(false);

        // FIX: 回合结束清空敌人格挡 (Slay the Spire 规则)
        setEnemyBlock(0);

        // Player Status Decay
        setPlayerStatus(s => ({ ...s, weak: Math.max(0, s.weak - 1), vulnerable: Math.max(0, s.vulnerable - 1) }));

        // Enemy Status Logic (Poison, Bleed, Void DOT Damage & Decay)
        setEnemyStatus(s => {
            let newStatus = { ...s, weak: Math.max(0, s.weak - 1), vulnerable: Math.max(0, s.vulnerable - 1) };

            // Poison Logic: Deal damage equal to stacks, then decrement
            if (s.poison > 0) {
                const poisonDmg = s.poison;
                setEnemyHp(h => Math.max(0, h - poisonDmg));
                setDmgOverlay({ val: poisonDmg, target: 'ENEMY', color: 'text-green-500' });
                setTimeout(() => setDmgOverlay(null), 800);
                newStatus.poison = Math.max(0, s.poison - 1);
            }

            // Batch 2: 死亡印记爆发 (DEATHMARK) - ZedR
            if (s.deathMark > 0) {
                let newMark = s.deathMark - 1;
                if (newMark === 0) {
                    // 印记倒计时结束，爆发伤害
                    const markDmg = deathMarkDamage;
                    setEnemyHp(h => Math.max(0, h - markDmg));
                    setDmgOverlay({ val: `MARK: ${markDmg}`, target: 'ENEMY', color: 'text-red-600' });
                    setTimeout(() => setDmgOverlay(null), 1200);
                    setDeathMarkDamage(0); // 重置累积伤害
                }
                newStatus.deathMark = newMark;
            }

            // FIX Bug #10: 流血 (Bleed) - 每层造成2伤害
            if (s.bleed > 0) {
                const bleedDmg = s.bleed * 2;
                setEnemyHp(h => Math.max(0, h - bleedDmg));
                setDmgOverlay({ val: bleedDmg, target: 'ENEMY', color: 'text-red-600' });
                setTimeout(() => setDmgOverlay(null), 800);
                newStatus.bleed = Math.max(0, s.bleed - 1);
            }

            // FIX Bug #7: 虚空之砂 DOT
            if (s.voidDot > 0) {
                const voidDmg = s.voidDot;
                setEnemyHp(h => Math.max(0, h - voidDmg));
                setDmgOverlay({ val: voidDmg, target: 'ENEMY', color: 'text-purple-500' });
                setTimeout(() => setDmgOverlay(null), 800);
                newStatus.voidDot = Math.max(0, s.voidDot - 1);
            }

            return newStatus;
        });

        // FIX Bug #9: 回合结束时重置首次攻击标记
        setPlayerStatus(prev => ({ ...prev, firstAttackUsed: false }));

        setTimeout(enemyAction, 1000);
    };

    // FIX: 下回合效果处理函数
    const applyNextTurnEffects = () => {
        setPlayerStatus(prev => {
            const updates = { ...prev };

            // 灵巧：回合开始获得护甲，并清空层数
            if (prev.dexterity > 0) {
                setPlayerBlock(b => b + prev.dexterity * DEX_BLOCK_PER_STACK);
                updates.dexterity = 0;
            }

            // 下回合法力 (蓄能冥想)
            if (prev.nextTurnMana > 0) {
                setPlayerMana(m => m + prev.nextTurnMana);
                updates.nextTurnMana = 0;
            }

            // 下回合抽牌 (结界护盾)
            if (prev.nextDrawBonus > 0) {
                drawCards(prev.nextDrawBonus);
                updates.nextDrawBonus = 0;
            }

            // 下回合格挡
            if (prev.nextTurnBlock > 0) {
                setPlayerBlock(b => b + prev.nextTurnBlock);
                updates.nextTurnBlock = 0;
            }

            // 下回合力量
            if (prev.nextTurnStrength > 0) {
                updates.strength = (prev.strength || 0) + prev.nextTurnStrength;
                updates.nextTurnStrength = 0;
            }

            return updates;
        });
    };

    const enemyAction = () => {
        if (enemyHp <= 0) return;

        // FIX: 眩晕逻辑 (STUN)
        if (enemyStatus.stunned > 0) {
            setEnemyStatus(s => ({ ...s, stunned: s.stunned - 1 }));
            setDmgOverlay({ val: 'STUNNED', target: 'ENEMY', color: 'text-blue-400' });
            setTimeout(() => setDmgOverlay(null), 800);

            // 跳过回合，直接开始玩家回合
            setTimeout(() => {
                // FIX Bug #5, #9: 下回合开始时应用效果
                applyNextTurnEffects();
                startTurnLogic();
            }, 1000);
            return;
        }

        triggerAnim('ENEMY', 'attack');
        const act = nextEnemyAction;
        if (act.type === 'ATTACK' || act.actionType === 'Attack') {
            // 敌人攻击挥击音效
            playSfx('ATTACK_SWING');
            setTimeout(() => {
                triggerAnim('HERO', 'hit');
                // 延迟播放攻击命中音效
                playSfx('ATTACK_HIT');
            }, 200);

            // FIX Bug #6: 中娅沙漏 - 检查免伤
            if (playerStatus.avoidNextDamage || playerStatus.immuneOnce) {
                setPlayerStatus(prev => ({
                    ...prev,
                    avoidNextDamage: false,
                    immuneOnce: false
                }));

                // 显示免疫效果
                setDmgOverlay({ val: 'IMMUNE', target: 'PLAYER', color: 'text-yellow-400' });
                setTimeout(() => setDmgOverlay(null), 800);

                setGameState('PLAYER_TURN');
                setPlayerBlock(0);
                drawCards(5);
                setPlayerMana(initialMana);
                // FIX Bug #5, #9: 下回合开始时应用效果 (免疫时也要触发)
                applyNextTurnEffects();
                return; // 免疫本次伤害
            }

            const baseDmg = act.type === 'ATTACK' ? act.value : act.dmgValue;
            let dmg = baseDmg + enemyStatus.strength;
            if (enemyStatus.weak > 0) dmg = Math.floor(dmg * 0.75);
            let total = 0; let remBlock = playerBlock; let currHp = playerHp;
            const count = act.count || 1;
            for (let i = 0; i < count; i++) {
                let finalDmg = dmg;
                if (playerStatus.vulnerable > 0) finalDmg = Math.floor(finalDmg * 1.5);
                if (remBlock >= finalDmg) {
                    // 玩家格挡时播放格挡音效
                    playSfx('BLOCK_SHIELD');
                    remBlock -= finalDmg;
                } else {
                    let pierce = finalDmg - remBlock;
                    remBlock = 0;
                    currHp -= pierce;
                    // 玩家受击时播放受击音效
                    setTimeout(() => playSfx('HIT_TAKEN'), 250);
                    if (heroData.relics.includes("BrambleVest")) setEnemyHp(h => Math.max(0, h - 3));
                }
                total += finalDmg;
            }
            setPlayerBlock(remBlock); setPlayerHp(currHp); setDmgOverlay({ val: total, target: 'PLAYER' }); setTimeout(() => setDmgOverlay(null), 800);
        }
        if (act.type === 'BUFF') {
            // 敌人获得格挡时播放格挡音效
            playSfx('BLOCK_SHIELD');
            setEnemyBlock(b => b + act.effectValue);
        }
        if (act.type === 'DEBUFF') { if (act.effect === 'WEAK') setPlayerStatus(s => ({ ...s, weak: s.weak + act.effectValue })); if (act.effect === 'VULNERABLE') setPlayerStatus(s => ({ ...s, vulnerable: s.vulnerable + act.effectValue })); }
        // setEnemyBlock(0); // FIX: 移除此处的清零，防止敌人刚获得格挡就被清除
        setTimeout(() => {
            // FIX Bug #5, #9: 下回合开始时应用效果
            applyNextTurnEffects();
            startTurnLogic();
        }, 1000);
    };

    const renderStatus = (status) => (
        <div className="flex gap-1 mt-1 flex-wrap">
            {status.strength > 0 && <div className="flex items-center text-[10px] text-red-400 bg-red-900/40 px-1 rounded border border-red-900 shadow-sm"><Sword size={10} className="mr-1" /> {status.strength}</div>}
            {status.dexterity > 0 && <div className="flex items-center text-[10px] text-green-400 bg-green-900/40 px-1 rounded border border-green-900 shadow-sm"><Shield size={10} className="mr-1" /> 灵巧 {status.dexterity}</div>}
            {status.weak > 0 && <div className="flex items-center text-[10px] text-yellow-400 bg-yellow-900/40 px-1 rounded border border-yellow-900 shadow-sm"><Activity size={10} className="mr-1" /> 虚弱 {status.weak}</div>}
            {status.vulnerable > 0 && <div className="flex items-center text-[10px] text-purple-400 bg-purple-900/40 px-1 rounded border border-purple-900 shadow-sm"><Zap size={10} className="mr-1" /> 易伤 {status.vulnerable}</div>}
            {status.poison > 0 && <div className="flex items-center text-[10px] text-green-500 bg-green-900/40 px-1 rounded border border-green-900 shadow-sm"><Skull size={10} className="mr-1" /> 中毒 {status.poison}</div>}
            {status.bleed > 0 && <div className="flex items-center text-[10px] text-red-600 bg-red-950/40 px-1 rounded border border-red-800 shadow-sm"><Droplet size={10} className="mr-1" /> 流血 {status.bleed}</div>}
            {status.burn > 0 && <div className="flex items-center text-[10px] text-orange-500 bg-orange-950/40 px-1 rounded border border-orange-800 shadow-sm"><Flame size={10} className="mr-1" /> 灼烧 {status.burn}</div>}
            {status.voidDot > 0 && <div className="flex items-center text-[10px] text-purple-300 bg-purple-950/40 px-1 rounded border border-purple-800 shadow-sm"><Ghost size={10} className="mr-1" /> 虚空 {status.voidDot}</div>}
            {status.mark > 0 && <div className="flex items-center text-[10px] text-orange-400 bg-orange-900/40 px-1 rounded border border-orange-900 shadow-sm"><Crosshair size={10} className="mr-1" /> 标记 {status.mark}</div>}
            {(status.immuneOnce || status.avoidNextDamage) && <div className="flex items-center text-[10px] text-yellow-200 bg-yellow-900/40 px-1 rounded border border-yellow-700 shadow-sm"><Lock size={10} className="mr-1" /> 免疫</div>}
            {status.stunned > 0 && <div className="flex items-center text-[10px] text-blue-400 bg-blue-900/40 px-1 rounded border border-blue-900 shadow-sm"><AlertTriangle size={10} className="mr-1" /> 眩晕 {status.stunned}</div>}
            {status.reflect > 0 && <div className="flex items-center text-[10px] text-orange-300 bg-orange-950/40 px-1 rounded border border-orange-800 shadow-sm"><RefreshCw size={10} className="mr-1" /> 反伤 {status.reflect}</div>}
            {status.damageReduce > 0 && <div className="flex items-center text-[10px] text-blue-300 bg-blue-950/40 px-1 rounded border border-blue-800 shadow-sm"><TrendingDown size={10} className="mr-1" /> 减伤 {status.damageReduce}%</div>}
            {status.healReduce > 0 && <div className="flex items-center text-[10px] text-red-300 bg-red-950/40 px-1 rounded border border-red-900 shadow-sm"><Skull size={10} className="mr-1" /> 重伤 {status.healReduce}%</div>}
            {status.lifesteal > 0 && <div className="flex items-center text-[10px] text-pink-400 bg-pink-900/40 px-1 rounded border border-pink-800 shadow-sm"><Heart size={10} className="mr-1" /> 吸血</div>}
            {status.regenMana > 0 && <div className="flex items-center text-[10px] text-blue-400 bg-blue-900/40 px-1 rounded border border-blue-800 shadow-sm"><Zap size={10} className="mr-1" /> 回蓝 {status.regenMana}</div>}
            {status.nextAttackDouble && <div className="flex items-center text-[10px] text-red-400 bg-red-900/40 px-1 rounded border border-red-800 shadow-sm"><Sword size={10} className="mr-1" /> 双倍伤害</div>}

            {/* Next Turn Effects */}
            {status.nextTurnBlock > 0 && <div className="flex items-center text-[10px] text-blue-200 bg-blue-900/40 px-1 rounded border border-blue-800 shadow-sm"><Shield size={10} className="mr-1" /><Clock size={8} className="mr-1" /> +{status.nextTurnBlock}</div>}
            {status.nextTurnStrength > 0 && <div className="flex items-center text-[10px] text-red-200 bg-red-900/40 px-1 rounded border border-red-800 shadow-sm"><Sword size={10} className="mr-1" /><Clock size={8} className="mr-1" /> +{status.nextTurnStrength}</div>}
            {status.nextTurnMana > 0 && <div className="flex items-center text-[10px] text-blue-200 bg-blue-900/40 px-1 rounded border border-blue-800 shadow-sm"><Zap size={10} className="mr-1" /><Clock size={8} className="mr-1" /> +{status.nextTurnMana}</div>}
            {status.nextDrawBonus > 0 && <div className="flex items-center text-[10px] text-gray-200 bg-gray-800/40 px-1 rounded border border-gray-600 shadow-sm"><Layers size={10} className="mr-1" /><Clock size={8} className="mr-1" /> +{status.nextDrawBonus}</div>}
        </div>
    );

    const displayValue = nextEnemyAction.type === 'ATTACK' ? nextEnemyAction.value : (nextEnemyAction.actionType === 'Attack' ? nextEnemyAction.dmgValue : nextEnemyAction.effectValue);
    const IntentIcon = () => { const type = nextEnemyAction.type; const isAttack = type === 'ATTACK' || nextEnemyAction.actionType === 'Attack'; if (isAttack) return <Sword size={20} className="text-red-500" />; if (type === 'BUFF') return <Shield size={20} className="text-blue-400" />; if (type === 'DEBUFF') return <Skull size={20} className="text-purple-400" />; return <AlertTriangle size={20} className="text-gray-400" />; };

    const { drawPile: currentDrawPile = [], discardPile: currentDiscardPile = [], hand = [] } = deckRef.current || {};
    const debugCritChance = ((playerStatus.critChance || 0)).toFixed(1);

    if (!heroData || !enemyConfig) {
        return <div className="w-full h-full flex items-center justify-center text-white">Loading...</div>;
    }

    return (
        <div className="w-full h-full relative flex flex-col overflow-hidden bg-black">
            <div className="absolute inset-0 bg-cover bg-center opacity-40" style={{ backgroundImage: `url(${ACT_BACKGROUNDS[act || 1]})` }}></div>
            <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
                <div className={`absolute left-10 bottom-[42%] w-64 h-[500px] transition-all duration-200 ${heroAnim === 'attack' ? 'translate-x-32' : ''} ${heroAnim === 'hit' ? 'translate-x-[-10px] brightness-50 bg-red-500/30' : ''}`}>
                    <img src={heroData.img} className="w-full h-full object-cover object-top rounded-xl shadow-[0_0_30px_rgba(0,0,0,0.8)] border-2 border-[#C8AA6E]" />
                    <div className="absolute -bottom-24 w-full bg-black/80 border border-[#C8AA6E] p-2 rounded flex flex-col gap-1 shadow-lg z-40"><div className="flex justify-between text-xs text-[#C8AA6E] font-bold"><span>HP {playerHp}/{heroData.maxHp}</span>{playerBlock > 0 && <span className="text-blue-400 flex items-center gap-1"><Shield size={12} />{playerBlock}</span>}</div><div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden"><div className="h-full bg-green-600 transition-all duration-300" style={{ width: `${(playerHp / heroData.maxHp) * 100}%` }}></div></div>{renderStatus(playerStatus)}</div>
                </div>
                <div className="text-6xl font-black text-[#C8AA6E]/20 italic">VS</div>
                <div className={`absolute right-10 bottom-[42%] w-64 h-[500px] transition-all duration-200 ${enemyAnim === 'attack' ? '-translate-x-32' : ''} ${enemyAnim === 'hit' ? 'translate-x-[10px] brightness-50 bg-red-500/30' : ''}`}>
                    <img src={enemyConfig.img} className="w-full h-full object-cover object-top rounded-xl shadow-[0_0_30px_rgba(0,0,0,0.8)] border-2 border-red-800" />
                    <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-black/80 border border-red-600 px-3 py-1 rounded flex items-center gap-2 animate-bounce"><IntentIcon /><span className="text-white font-bold text-lg">{displayValue}{nextEnemyAction.count > 1 ? `x${nextEnemyAction.count}` : ''}</span></div>
                    <div className="absolute -bottom-24 w-full bg-black/80 border border-red-800 p-2 rounded flex flex-col gap-1 shadow-lg z-40"><div className="flex justify-between text-xs text-red-500 font-bold"><span>{enemyConfig.name}</span><span>{enemyHp}/{enemyConfig.maxHp}</span></div><div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden"><div className="h-full bg-red-600 transition-all duration-300" style={{ width: `${(enemyHp / enemyConfig.maxHp) * 100}%` }}></div></div>{enemyBlock > 0 && <div className="text-blue-400 text-xs font-bold flex items-center gap-1"><Shield size={10} /> 格挡 {enemyBlock}</div>}{renderStatus(enemyStatus)}</div>
                </div>
            </div>
            <div className="absolute top-4 left-4 z-50 bg-black/70 border border-yellow-500/60 px-4 py-2 rounded shadow-lg text-xs text-yellow-200 pointer-events-none">
                <div className="font-semibold tracking-wider">Crit Debug</div>
                <div>Chance: {debugCritChance}%</div>
                <div>This turn crits: {critCount}</div>
            </div>
            {dmgOverlay && (
                <div className={`absolute top-1/2 ${dmgOverlay.target === 'ENEMY' ? 'right-1/4' : 'left-1/4'} -translate-y-1/2 z-50 flex flex-col items-center`}>
                    {dmgOverlay.isCrit && (
                        <div className="text-4xl font-black text-red-400 drop-shadow-[0_0_25px_rgba(255,0,0,0.75)] tracking-[0.3em] uppercase animate-bounce">
                            CRITICAL HIT
                        </div>
                    )}
                    <div className={`text-8xl font-black ${dmgOverlay.isCrit ? 'text-yellow-200 drop-shadow-[0_0_25px_rgba(255,255,0,0.8)]' : 'text-white drop-shadow-[0_0_10px_red]'} animate-ping`}>
                        {dmgOverlay.val}
                    </div>
                </div>
            )}
            <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-black via-black/80 to-transparent z-20 flex items-end justify-center pb-6 gap-4 pointer-events-none">
                <div className="absolute left-8 bottom-8 w-24 h-24 rounded-full bg-[#091428] border-4 border-[#C8AA6E] flex items-center justify-center shadow-[0_0_30px_#0066FF] pointer-events-auto text-center">
                    <span className="text-4xl font-bold text-white block">{playerMana}</span>
                    <span className="text-[10px] text-[#C8AA6E] block">MANA</span>
                    <div className="text-[8px] text-gray-400 mt-1">{currentDrawPile.length}/{currentDiscardPile.length}</div>
                </div>
                <div className="flex items-end justify-center pointer-events-auto" style={{ width: '600px', height: '240px', position: 'relative' }}>
                    <AnimatePresence>
                        {hand.map((cid, i) => {
                            const card = CARD_DATABASE[cid];
                            if (!card) {
                                console.warn(`Card not found in database: ${cid}`);
                                return null;
                            }
                            const canPlay = playerMana >= card.cost && gameState === 'PLAYER_TURN';
                            return (
                                <Card
                                    key={`${cid}-${i}`}
                                    cardId={cid}
                                    index={i}
                                    totalCards={hand.length}
                                    canPlay={canPlay}
                                    onPlay={playCard}
                                />
                            )
                        })}
                    </AnimatePresence>
                </div>
                <button onClick={endTurn} disabled={gameState !== 'PLAYER_TURN'} className="absolute right-8 bottom-8 w-24 h-24 rounded-full bg-[#C8AA6E] border-4 border-[#F0E6D2] flex items-center justify-center font-bold text-[#091428] shadow-lg hover:scale-105 hover:bg-white active:scale-95 transition-all pointer-events-auto">结束<br />回合</button>
            </div>
        </div>
    );
};

export default BattleScene;

