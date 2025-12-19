import React, { useState, useEffect, useRef } from 'react';
import { Sword, Shield, Zap, Skull, Activity, AlertTriangle, Droplet, Ghost, Crosshair, Lock, RefreshCw, TrendingDown, Clock, Layers, Flame, Heart, Link, Users } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { CARD_DATABASE } from '../data/cards';
import { RELIC_DATABASE } from '../data/relics';
import { ENEMY_POOL } from '../data/enemies';
import { scaleEnemyStats, shuffle } from '../utils/gameLogic';
import { ACT_BACKGROUNDS } from '../data/constants';
import { playSfx, playChampionVoice } from '../utils/audioManager';
import { applyCardEffects, calculateBlockValue } from '../utils/cardEffectHandler';
import { achievementTracker } from '../utils/achievementTracker';
import Card from './shared/Card';
import { getBaseCardId, getCardWithUpgrade, getUpgradeLevel, addHammerBonus } from '../utils/cardUtils';

const DEX_BLOCK_PER_STACK = 5;
const PERMA_UPGRADE_TYPES = new Set(['ATTACK', 'SKILL']);
const BASIC_UPGRADE_BASES = new Set(['Strike', 'Defend']);
const HAMMER_TARGET_BASES = ['Strike', 'Defend'];

const BattleScene = ({
    heroData,
    enemyId,
    initialDeck,
    onWin,
    onLose,
    floorIndex,
    act,
    onGoldChange,
    openingDrawBonus = 0,
    onConsumeOpeningDrawBonus,
    openingManaBonus = 0,
    onConsumeOpeningManaBonus
}) => {
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
    const battleDebtRef = useRef({ maxHpCost: 0 });
    const permaStrGainRef = useRef(0);
    const permaUpgradeRef = useRef([]);
    const singleUseCardsRef = useRef([]);
    const hunterBadgeActiveRef = useRef(false);
    const nextBattleBonusRef = useRef({ draw: 0, mana: 0 });
    const ambitionPactPendingRef = useRef(0);
    const discountQueueRef = useRef([]);
    const isFirstTurnRef = useRef(true);
    const jinxEmptyHandGrantedRef = useRef(false);
    const playerDamagedThisTurnRef = useRef(false);
    const sonaSkillCountRef = useRef(0);
    const powerChordReadyRef = useRef(false);
    const ekkoHitRef = useRef(0);
    const sylasEmpowerRef = useRef(false);
    const viktorShardsRef = useRef(0);
    const leeSinStacksRef = useRef(0);
    const vayneHitsRef = useRef(0);
    const teemoIdleRef = useRef(false);
    const cloneAttackPercentRef = useRef(0);
    const [dmgOverlay, setDmgOverlay] = useState(null);
    const [enemyTrap, setEnemyTrap] = useState(null);
    const [enemyBaitDamage, setEnemyBaitDamage] = useState(0);
    const [heroAnim, setHeroAnim] = useState("");
    const [enemyAnim, setEnemyAnim] = useState("");
    const [scoutInfo, setScoutInfo] = useState(null);
    const [idleBlockState, setIdleBlockState] = useState({ value: 0, armed: false, broken: false, sourceCard: null });
    const spawnOverlay = (overlay, duration = 800) => {
        setDmgOverlay(overlay);
        setTimeout(() => setDmgOverlay(null), duration);
    };
    const showPlayerHealOverlay = (value, label = 'HEAL') => {
        if (!value) return;
        spawnOverlay({ val: `${label} +${value}`, target: 'PLAYER', color: 'text-emerald-300' }, 900);
        playSfx('HEAL');
    };
    const updatePlayerHp = (valueOrUpdater, { showHeal = false, label = 'HEAL', clamp = true } = {}) => {
        setPlayerHp(prev => {
            const nextRaw = typeof valueOrUpdater === 'function' ? valueOrUpdater(prev) : valueOrUpdater;
            const bounded = clamp
                ? Math.min(heroData.maxHp, Math.max(0, nextRaw))
                : Math.max(0, nextRaw);
            if (showHeal) {
                const delta = bounded - prev;
                if (delta > 0) {
                    showPlayerHealOverlay(delta, label);
                }
            }
            return bounded;
        });
    };
    const [playerStatus, setPlayerStatus] = useState({
        strength: heroData.baseStr || 0,
        weak: 0,
        vulnerable: 0,
        dexterity: 0,
        nextTurnBlock: 0,
        nextTurnStrength: 0,
        nextTurnMana: 0,
        nextDrawBonus: 0,
        extraDrawPerTurn: 0,
        idleBlock: 0,
        critChance: 0,
        critDamageMultiplier: 2,
        buffNextSkill: 0,
        tempStrength: 0,
        globalAttackBonus: 0,
        winGoldBonus: 0,
        scholarRuneValue: 0,
        ambitionPactUsed: false,
        nextDamageReduce: 0,
        passiveBlock: 0,
        retaliation: 0,
        damageReduction: 0,
        reflectBuff: false,
        strPerHit: 0,
        strWhenHit: 0,
        permaStrOnKill: false,
        nextAttackX2: false,
        nextAttackDoubleNextTurn: false,
        firstAttackBonus: 0,
        firstAttackBonusArmed: false,
        cloneAttackPercent: 0
    });
    const [enemyStatus, setEnemyStatus] = useState({ 
        strength: 0, 
        weak: 0, 
        vulnerable: 0, 
        mark: 0, 
        markDamage: 0, 
        trap: 0,
        slowed: 0,
        tetherMark: 0,
        armorReduction: 0
    });
    const heroBaseCritChance = heroData?.id === 'Yasuo' ? 10 : 0;
    const heroStrengthCritMultiplier = 1; // 所有英雄每点力量统一+1%暴击

    // 被动技能状态追踪
    const [rivenAttackCount, setRivenAttackCount] = useState(0); // 瑞文：攻击计数
    const [leeSinSkillBuff, setLeeSinSkillBuff] = useState(false); // 盲僧：技能牌buff
    const [vayneHitCount, setVayneHitCount] = useState(0); // 薇恩：连击计数
    const [zedFirstAttack, setZedFirstAttack] = useState(true); // 劫：首次攻击标记
    const [katarinaAttackCount, setKatarinaAttackCount] = useState(0); // 卡特琳娜：攻击计数
    const [lastPlayedCard, setLastPlayedCard] = useState(null); // 追踪最后打出的牌
    const [cardsPlayedCount, setCardsPlayedCount] = useState(0); // 本回合打出的卡牌数量
    const [attacksThisTurn, setAttacksThisTurn] = useState(0); // 本回合打出的攻击牌数量
    const [turnDamageTotal, setTurnDamageTotal] = useState(0);
    const [noAttackPlayed, setNoAttackPlayed] = useState(true);
    // Batch 2: 暴击系统
    const [critCount, setCritCount] = useState(0);
    // Batch 2: 伤害历史追踪
    const [dealtDamageThisTurn, setDealtDamageThisTurn] = useState(false);
    const [dealtDamageLastTurn, setDealtDamageLastTurn] = useState(false);
    // Batch 2: 死亡印记
    const [deathMarkDamage, setDeathMarkDamage] = useState(0);

    useEffect(() => {
        achievementTracker.startBattle();
        battleDebtRef.current = { maxHpCost: 0 };
        permaUpgradeRef.current = [];
        singleUseCardsRef.current = [];
        hunterBadgeActiveRef.current = false;
        setIdleBlockState({ value: 0, armed: false, broken: false, sourceCard: null });
        achievementTracker.setBattleFlag('noAttackPlayed', true);
        achievementTracker.recordBattleStat('cardsPlayedInTurn', 0, { setValue: 0 });
        ambitionPactPendingRef.current = 0;
        return () => {
            achievementTracker.cancelBattle();
            clearDiscountQueue();
        };
    }, []);

    useEffect(() => {
        achievementTracker.recordMana(playerMana);
    }, [playerMana]);

    useEffect(() => {
        // 战斗开始时播放英雄语音
        if (heroData?.id) {
            playChampionVoice(heroData.id);
        }

        if (!heroData || !initialDeck) return;

        const initialDrawPile = shuffle([...initialDeck]);
        deckRef.current = { drawPile: initialDrawPile, hand: [], discardPile: [] };
        isFirstTurnRef.current = true;
        clearDiscountQueue();
        ambitionPactPendingRef.current = 0;
        let block = 0; let str = heroData.baseStr || 0;
        (heroData.relics || []).forEach(rid => {
            const relic = RELIC_DATABASE[rid];
            if (relic && relic.onBattleStart) { const newState = relic.onBattleStart({ block, status: { strength: str } }); block = newState.block; str = newState.status.strength; }
            if (rid === heroData.relicId && heroData.relicId === "UrgotPassive") block += 15;
        });
        setPlayerBlock(block);
        setPlayerStatus(prev => ({ ...prev, strength: str, ambitionPactUsed: false }));
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

    const rewriteDeckRef = (hand, drawPile, discardPile) => {
        deckRef.current = { drawPile, hand, discardPile };
        forceUpdate();
    };

    const grantRandomDiscount = (amount = 1) => {
        const { hand } = deckRef.current;
        if (!hand || hand.length === 0) return false;
        const candidates = hand.filter(Boolean);
        if (candidates.length === 0) return false;
        const target = candidates[Math.floor(Math.random() * candidates.length)];
        const baseId = getBaseCardId(target);
        discountQueueRef.current.push({ cardId: target, baseId, amount });
        spawnOverlay({
            val: `减费 ${CARD_DATABASE[baseId]?.name || baseId}`,
            target: 'PLAYER',
            color: 'text-sky-300'
        }, 900);
        forceUpdate();
        return true;
    };

    const consumeDiscountForCard = (cardId) => {
        if (!discountQueueRef.current.length) return 0;
        const baseId = getBaseCardId(cardId);
        let idx = discountQueueRef.current.findIndex(entry => entry.cardId === cardId);
        if (idx === -1) {
            idx = discountQueueRef.current.findIndex(entry => entry.baseId === baseId);
        }
        if (idx === -1) return 0;
        const [entry] = discountQueueRef.current.splice(idx, 1);
        forceUpdate();
        return entry?.amount || 0;
    };

    const clearDiscountQueue = () => {
        discountQueueRef.current = [];
        forceUpdate();
    };

    const getDiscountForCard = (cardId) => {
        if (!discountQueueRef.current.length || !cardId) return 0;
        const baseId = getBaseCardId(cardId);
        const entry = discountQueueRef.current.find(item => item.cardId === cardId) ||
            discountQueueRef.current.find(item => item.baseId === baseId);
        return entry?.amount || 0;
    };

    const applyPermaUpgrade = () => {
        const { hand, drawPile, discardPile } = deckRef.current;
        const pools = {
            hand: [...hand],
            drawPile: [...drawPile],
            discardPile: [...discardPile]
        };
        const candidates = [];
        Object.entries(pools).forEach(([pileKey, cards]) => {
            cards.forEach((cardId, idx) => {
                if (!cardId) return;
                const baseId = getBaseCardId(cardId);
                if (HAMMER_TARGET_BASES.includes(baseId)) {
                    candidates.push({ pileKey, index: idx, baseId });
                }
            });
        });
        if (!candidates.length) {
            setDmgOverlay({ val: '无打击/防御可升级', target: 'PLAYER', color: 'text-red-200' });
            setTimeout(() => setDmgOverlay(null), 900);
            return;
        }
        const pick = candidates[Math.floor(Math.random() * candidates.length)];
        const targetBase = pick.baseId;
        const updateCardId = (id) => {
            if (!id) return id;
            const baseId = getBaseCardId(id);
            if (baseId !== targetBase) return id;
            return addHammerBonus(id, 1);
        };
        const nextHand = pools.hand.map(updateCardId);
        const nextDraw = pools.drawPile.map(updateCardId);
        const nextDiscard = pools.discardPile.map(updateCardId);

        // 记录所有被升级的映射，用于战后写回 masterDeck
        pools.hand.forEach((id, idx) => {
            const updated = nextHand[idx];
            if (id !== updated) permaUpgradeRef.current.push({ from: id, to: updated });
        });
        pools.drawPile.forEach((id, idx) => {
            const updated = nextDraw[idx];
            if (id !== updated) permaUpgradeRef.current.push({ from: id, to: updated });
        });
        pools.discardPile.forEach((id, idx) => {
            const updated = nextDiscard[idx];
            if (id !== updated) permaUpgradeRef.current.push({ from: id, to: updated });
        });

        rewriteDeckRef(nextHand, nextDraw, nextDiscard);
        const upgradedName = CARD_DATABASE[targetBase]?.name || targetBase;
        setDmgOverlay({ val: `匠魂强化 ${upgradedName} 全部`, target: 'PLAYER', color: 'text-amber-200' });
        setTimeout(() => setDmgOverlay(null), 900);
    };

    const upgradeCardsInHand = () => {
        const { hand, drawPile, discardPile } = deckRef.current;
        let upgraded = false;
        const nextHand = hand.map(cardId => {
            if (!cardId || getUpgradeLevel(cardId) > 0) return cardId;
            const baseId = getBaseCardId(cardId);
            const baseCard = CARD_DATABASE[baseId];
            if (!baseCard) return cardId;
            if (!PERMA_UPGRADE_TYPES.has(baseCard.type || '')) return cardId;
            upgraded = true;
            return `${cardId}+`;
        });
        if (upgraded) {
            rewriteDeckRef(nextHand, drawPile, discardPile);
            setDmgOverlay({ val: '手牌强化', target: 'PLAYER', color: 'text-emerald-200' });
            setTimeout(() => setDmgOverlay(null), 900);
        }
        return upgraded;
    };

    const upgradeBasicCardsInHand = () => {
        const { hand, drawPile, discardPile } = deckRef.current;
        let upgraded = false;
        const nextHand = hand.map(cardId => {
            if (!cardId) return cardId;
            if (getUpgradeLevel(cardId) > 0) return cardId;
            const baseId = getBaseCardId(cardId);
            if (!BASIC_UPGRADE_BASES.has(baseId)) return cardId;
            upgraded = true;
            return `${cardId}+`;
        });
        if (upgraded) {
            rewriteDeckRef(nextHand, drawPile, discardPile);
            setDmgOverlay({ val: '基础卡强化', target: 'PLAYER', color: 'text-emerald-200' });
            setTimeout(() => setDmgOverlay(null), 900);
        } else {
            setDmgOverlay({ val: '无基础牌可强化', target: 'PLAYER', color: 'text-red-200' });
            setTimeout(() => setDmgOverlay(null), 900);
        }
        return upgraded;
    };

    const recycleDiscardToHand = () => {
        const { hand, drawPile, discardPile } = deckRef.current;
        if (discardPile.length === 0) return null;
        const randomIndex = Math.floor(Math.random() * discardPile.length);
        const [recovered] = discardPile.splice(randomIndex, 1);
        hand.push(recovered);
        rewriteDeckRef(hand, drawPile, discardPile);
        const recoveredCard = getCardWithUpgrade(recovered);
        setDmgOverlay({ val: `回收 ${recoveredCard?.name || recovered}`, target: 'PLAYER', color: 'text-slate-200' });
        setTimeout(() => setDmgOverlay(null), 800);
        return recovered;
    };

    const transformRandomHandCard = () => {
        const { hand, drawPile, discardPile } = deckRef.current;
        if (hand.length === 0) return false;
        const targetIndex = Math.floor(Math.random() * hand.length);
        const targetCardId = hand[targetIndex];
        const baseId = getBaseCardId(targetCardId);
        const targetCard = CARD_DATABASE[baseId];
        const targetRarity = targetCard?.rarity || 'COMMON';

        const getPoolByRarity = (rarity) =>
            Object.values(CARD_DATABASE)
                .filter(c => c && c.rarity === rarity && c.id !== baseId)
                .map(c => c.id);

        let replacementPool = getPoolByRarity(targetRarity);
        if (replacementPool.length === 0 && targetRarity === 'RARE') {
            replacementPool = getPoolByRarity('UNCOMMON');
        }
        if (replacementPool.length === 0) return false;

        const newCardId = replacementPool[Math.floor(Math.random() * replacementPool.length)];
        if (!newCardId) return false;

        hand[targetIndex] = newCardId;
        rewriteDeckRef(hand, drawPile, discardPile);
        setDmgOverlay({ val: `转换 → ${newCardId}`, target: 'PLAYER', color: 'text-purple-200' });
        setTimeout(() => setDmgOverlay(null), 900);
        return true;
    };

    const revealEnemyIntent = () => {
        if (!nextEnemyAction) return;
        setScoutInfo({
            label: nextEnemyAction.type === 'ATTACK' || nextEnemyAction.actionType === 'Attack'
                ? `攻击 ${nextEnemyAction.value}${nextEnemyAction.count > 1 ? `×${nextEnemyAction.count}` : ''}`
                : nextEnemyAction.type
        });
        setTimeout(() => setScoutInfo(null), 2000);
    };

    const removeEnemyBuffs = (stacks = 1) => {
        if (!stacks) return;
        const buffKeys = ['strength', 'damageReduce', 'reflect', 'reflectDamage', 'lifesteal', 'regenMana'];
        let remaining = stacks;
        setEnemyStatus(prev => {
            if (!prev) return prev;
            const next = { ...prev };
            buffKeys.forEach(key => {
                if (remaining === 0) return;
                if ((next[key] || 0) > 0) {
                    next[key] = 0;
                    remaining -= 1;
                }
            });
            return next;
        });
        if (remaining > 0) {
            setEnemyBlock(prev => {
                if (prev <= 0) return prev;
                remaining = 0;
                return 0;
            });
        }
        setDmgOverlay({ val: 'DISPEL', target: 'ENEMY', color: 'text-emerald-300' });
        setTimeout(() => setDmgOverlay(null), 900);
    };

    const executeCopiedEnemyAction = () => {
        if (!nextEnemyAction) return;
        const act = nextEnemyAction;
        const attackLike = act.type === 'ATTACK' || act.actionType === 'Attack';
        if (attackLike) {
            const baseValue = act.value ?? act.dmgValue ?? 0;
            const perHit = Math.max(0, Math.floor(baseValue * 0.5));
            const hits = act.count || 1;
            for (let i = 0; i < hits; i++) {
                applyDirectDamage(perHit, 'HIJACK');
            }
            setDmgOverlay({ val: `HIJACK ×${hits}`, target: 'ENEMY', color: 'text-emerald-200' });
            setTimeout(() => setDmgOverlay(null), 800);
            return;
        }
        if (act.type === 'BUFF') {
            const value = act.effectValue ?? act.value ?? 0;
            if (act.effect === 'BLOCK') {
                setPlayerBlock(b => b + value);
                setDmgOverlay({ val: `BLOCK +${value}`, target: 'PLAYER', color: 'text-blue-200' });
            } else if (act.effect === 'STRENGTH') {
                setPlayerStatus(prev => ({ ...prev, strength: (prev.strength || 0) + value }));
                setDmgOverlay({ val: `STR +${value}`, target: 'PLAYER', color: 'text-red-200' });
            }
            setTimeout(() => setDmgOverlay(null), 800);
            return;
        }
        if (act.type === 'DEBUFF' && act.effect) {
            const debuffValue = act.effectValue ?? 1;
            setEnemyStatus(prev => ({
                ...prev,
                [act.effect.toLowerCase()]: Math.max(0, (prev?.[act.effect.toLowerCase()] || 0) + debuffValue)
            }));
            setDmgOverlay({ val: `MIRROR ${act.effect}`, target: 'ENEMY', color: 'text-purple-300' });
            setTimeout(() => setDmgOverlay(null), 900);
        }
    };

    const applyDirectDamage = (rawDamage, label = 'DMG') => {
        if (rawDamage <= 0) return;
        setEnemyBlock(prevBlock => {
            const blockAbsorb = Math.min(prevBlock, rawDamage);
            const leftover = rawDamage - blockAbsorb;
            if (leftover > 0) {
                setEnemyHp(prevHp => {
                    const newHp = Math.max(0, prevHp - leftover);
                    setDealtDamageThisTurn(true);
                    if (enemyStatus.deathMark > 0) {
                        setDeathMarkDamage(prev => prev + leftover);
                    }
                    return newHp;
                });
            }
            setDmgOverlay({ val: `${label} ${rawDamage}`, target: 'ENEMY' });
            setTimeout(() => setDmgOverlay(null), 400);
            achievementTracker.recordTurnDamage(rawDamage);
            achievementTracker.recordSingleHit(rawDamage);
            setTurnDamageTotal(prev => prev + rawDamage);
            return prevBlock - blockAbsorb;
        });
    };

    const startTurnLogic = () => {
        setGameState('PLAYER_TURN');
        const startMana = initialMana + (heroData.relicId === "LuxPassive" ? 1 : 0) + (isFirstTurnRef.current ? openingManaBonus : 0);
        if (isFirstTurnRef.current && openingManaBonus > 0) {
            onConsumeOpeningManaBonus?.();
        }
        setPlayerMana(startMana);
        // 护甲不清零，累积到下一回合（符合 Slay the Spire 机制）
        // setPlayerBlock(0); // 已移除
        clearDiscountQueue();
        const baseDraw = heroData.relicId === "JinxPassive" ? 6 : 5;
        const extraDraw = playerStatus?.extraDrawPerTurn || 0;
        let bonusDraw = 0;
        if (isFirstTurnRef.current && openingDrawBonus > 0) {
            bonusDraw = openingDrawBonus;
            onConsumeOpeningDrawBonus?.();
        }
        drawCards(baseDraw + extraDraw + bonusDraw);
        if (isFirstTurnRef.current) {
            isFirstTurnRef.current = false;
        }
        setCardsPlayedCount(0); // 重置卡牌计数
        setAttacksThisTurn(0); // 重置攻击计数
        setCritCount(0); // Batch 2: 重置暴击计数
        setTurnDamageTotal(0);
        setNoAttackPlayed(true);
        achievementTracker.recordBattleStat('cardsPlayedInTurn', 0, { setValue: 0 });
        achievementTracker.setBattleFlag('noAttackPlayed', true);
        setPlayerStatus(prev => ({
            ...prev,
            critChance: 0,
            lifelink: 0,
            reflectDamage: 0,
            buffNextSkill: 0,
            nextAttackCostReduce: 0,
            tempStrength: 0,
            globalAttackBonus: 0,
            critDamageMultiplier: prev.critDamageMultiplier || 2,
            idleBlock: 0,
            firstAttackBonusArmed: true
        }));
        setEnemyStatus(prev => ({
            ...prev,
            slowed: Math.max(0, (prev.slowed || 0) - 1)
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
                if (pState && typeof pState.hp === 'number') {
                    updatePlayerHp(pState.hp, { showHeal: true });
                }
                if (eState && typeof eState.hp === 'number') {
                    setEnemyHp(eState.hp);
                }
            }
        });
    };

    const playCard = (index) => {
        if (gameState !== 'PLAYER_TURN') return;
        const { hand, discardPile } = deckRef.current;
        const cardId = hand[index];
        if (!cardId) return; // 防止无效的 cardId
        if (idleBlockState.armed && cardId !== idleBlockState.sourceCard) {
            setIdleBlockState(prev => ({ ...prev, broken: true }));
        }

        const cardTemplate = getCardWithUpgrade(cardId);
        if (!cardTemplate) {
            console.error(`Card not found in database: ${cardId}`);
            return;
        }
        const baseId = cardTemplate.baseId;

        const cardsPlayedBefore = cardsPlayedCount;
        const attackCountBeforeCard = attacksThisTurn;

        let card = { ...cardTemplate };

        // 盲僧被动：技能牌后下一张攻击牌-1费
        let actualCost = card.cost;
        if (heroData.relicId === "LeeSinPassive" && card.type === 'ATTACK' && leeSinSkillBuff) {
            actualCost = Math.max(0, card.cost - 1);
            setLeeSinSkillBuff(false); // 消耗buff
        }
        if (card.type === 'ATTACK' && (playerStatus.nextCostReduce || 0) > 0) {
            const reduction = playerStatus.nextCostReduce;
            actualCost = Math.max(0, actualCost - reduction);
            setPlayerStatus(prev => ({ ...prev, nextCostReduce: 0 }));
        }
        const discountAmount = consumeDiscountForCard(cardId);
        if (discountAmount > 0) {
            actualCost = Math.max(0, actualCost - discountAmount);
        }

        if (playerMana < actualCost) return;
        setPlayerMana(p => p - actualCost);
        const newHand = [...hand];
        newHand.splice(index, 1);
        const handSizeAfterPlay = newHand.length;
        if (card.singleUse) {
            singleUseCardsRef.current.push(baseId);
        }
        if (!card.exhaust) {
            deckRef.current = { ...deckRef.current, hand: newHand, discardPile: [...discardPile, cardId] };
        } else {
            deckRef.current = { ...deckRef.current, hand: newHand };
        }
        forceUpdate();

        // 记录最后打出的牌（用于内瑟斯/艾瑞莉娅被动）
        setLastPlayedCard(card);
        setCardsPlayedCount(prev => prev + 1);
        const nextCardsPlayed = cardsPlayedBefore + 1;
        achievementTracker.recordBattleStat('cardsPlayed', 1);
        achievementTracker.recordBattleStat('cardsPlayedInTurn', nextCardsPlayed, { setValue: nextCardsPlayed });

        // 处理卡牌效果
        const effectUpdates = applyCardEffects(card, {
            playerHp,
            maxHp: heroData.maxHp,
            playerStatus,
            enemyStatus
        });
        if (effectUpdates.maxHpCost) {
            battleDebtRef.current.maxHpCost += effectUpdates.maxHpCost;
        }
        const globalAttackBonusBefore = playerStatus.globalAttackBonus || 0;
        const mergedPlayerStatus = {
            ...playerStatus,
            ...(effectUpdates.playerStatus || {})
        };
        const mergedEnemyStatus = {
            ...enemyStatus,
            ...(effectUpdates.enemyStatus || {})
        };
        let skillBonusPool = 0;
        if (card.type === 'SKILL' && (playerStatus.buffNextSkill || 0) > 0) {
            skillBonusPool = playerStatus.buffNextSkill;
            setPlayerStatus(prev => ({ ...prev, buffNextSkill: 0 }));
        }

        if (effectUpdates.drawCount > 0) drawCards(effectUpdates.drawCount);
        if (effectUpdates.playerHp !== undefined && effectUpdates.playerHp !== null) {
            updatePlayerHp(effectUpdates.playerHp, { showHeal: true, label: 'HEAL' });
        }
        if (effectUpdates.manaChange) setPlayerMana(m => Math.max(0, m + effectUpdates.manaChange));
        if (effectUpdates.healAmount) {
            const healValue = effectUpdates.healAmount;
            updatePlayerHp(prev => prev + healValue, { showHeal: true, label: 'HEAL' });
        }
        if (effectUpdates.damageAmount) {
            const directDamage = effectUpdates.damageAmount + (card.type === 'SKILL' ? skillBonusPool : 0);
            if (card.type === 'SKILL') skillBonusPool = 0;
            applyDirectDamage(directDamage, 'SKILL');
        }
        if (effectUpdates.enemyBlockChange) {
            setEnemyBlock(b => Math.max(0, b + effectUpdates.enemyBlockChange));
        }
        if (effectUpdates.cloneAttack) {
            setPlayerStatus(prev => ({ ...prev, cloneAttackPercent: effectUpdates.cloneAttack }));
        }
        if (effectUpdates.tetherMark) {
            setEnemyStatus(prev => ({ ...prev, tetherMark: effectUpdates.tetherMark }));
        }
        if (effectUpdates.placeTrap) {
            setEnemyTrap(effectUpdates.placeTrap);
        }
        if (effectUpdates.playerStatus) setPlayerStatus(mergedPlayerStatus);
        if (effectUpdates.enemyStatus) setEnemyStatus(mergedEnemyStatus);

        // FIX: 金币奖励 (Bug #2)
        if (effectUpdates.goldGain && typeof onGoldChange === 'function') {
            onGoldChange(effectUpdates.goldGain);
        }
        if (effectUpdates.gambleOutcome) {
            const outcome = effectUpdates.gambleOutcome;
            const isWin = outcome.type === 'win';
            spawnOverlay({
                val: isWin ? `+${outcome.amount}G` : `HP -${outcome.amount}`,
                target: 'PLAYER',
                color: isWin ? 'text-yellow-300' : 'text-red-400'
            }, 900);
        }

        // FIX: 下回合效果 (Bug #5, #9) - merge status updates
        if (effectUpdates.playerStatus) {
            setPlayerStatus(prev => ({
                ...prev,
                ...effectUpdates.playerStatus
            }));
        }
        if (effectUpdates.enemyStatus) {
            setEnemyStatus(prev => {
                const nextStatus = { ...prev, ...effectUpdates.enemyStatus };
                // Batch 6: 破甲一击 - 减少敌人护甲
                if (effectUpdates.enemyStatus.armorReduction > 0) {
                    setEnemyBlock(b => Math.max(0, b - effectUpdates.enemyStatus.armorReduction));
                    nextStatus.armorReduction = 0; // 立即消耗
                }
                return nextStatus;
            });
        }
        if (effectUpdates.removeEnemyBuffs) {
            removeEnemyBuffs(effectUpdates.removeEnemyBuffs);
        }
        if (effectUpdates.blockGain) {
            setPlayerBlock(b => b + effectUpdates.blockGain);
        }
        if (effectUpdates.manaIfLowHand && handSizeAfterPlay <= 3) {
            setPlayerMana(m => Math.max(0, m + effectUpdates.manaIfLowHand));
        }
        if (effectUpdates.playerStatus?.idleBlock) {
            setIdleBlockState({ value: effectUpdates.playerStatus.idleBlock, armed: true, broken: false, sourceCard: cardId });
        }
        if (effectUpdates.permaUpgrade) {
            applyPermaUpgrade();
        }
        if (effectUpdates.upgradeCard) {
            if (card.id === 'Neutral_026') {
                upgradeBasicCardsInHand();
            } else {
                upgradeCardsInHand();
            }
        }
        if (effectUpdates.recycleCard) {
            recycleDiscardToHand();
        }
        if (effectUpdates.transformCard) {
            transformRandomHandCard();
        }
        if (effectUpdates.hunterBadge) {
            hunterBadgeActiveRef.current = true;
        }
        if (effectUpdates.scoutCount || effectUpdates.revealEnemyIntent) {
            revealEnemyIntent();
        }
        if (effectUpdates.placeTrap) {
            setEnemyTrap(effectUpdates.placeTrap);
            setEnemyStatus(prev => ({
                ...prev,
                trap: (prev.trap || 0) + 1
            }));
        }
        if (effectUpdates.placeBait) {
            setEnemyBaitDamage(effectUpdates.placeBait);
        }
        if (effectUpdates.cloneAttack) {
            cloneAttackPercentRef.current = effectUpdates.cloneAttack;
        }
        if (effectUpdates.tetherMark) {
            setEnemyStatus(prev => ({ ...prev, tetherMark: effectUpdates.tetherMark }));
        }

        if (effectUpdates.permaStrPactGain) {
            ambitionPactPendingRef.current += effectUpdates.permaStrPactGain;
            setDmgOverlay({ val: `战后力量 +${effectUpdates.permaStrPactGain}`, target: 'PLAYER', color: 'text-rose-200' });
            setTimeout(() => setDmgOverlay(null), 900);
        }
        if (effectUpdates.ambitionPactSkipped) {
            setDmgOverlay({ val: '契约已完成', target: 'PLAYER', color: 'text-slate-200' });
            setTimeout(() => setDmgOverlay(null), 700);
        }

        if (effectUpdates.discountCard) {
            grantRandomDiscount(effectUpdates.discountCard);
        }

        if (effectUpdates.copyEnemySkill) {
            executeCopiedEnemyAction();
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
            const tempStrengthBonus = mergedPlayerStatus.tempStrength || 0;
            const globalAttackBonus = globalAttackBonusBefore;
            const multiStrikeSegments = effectUpdates.multiStrikeSegments || 0;
            const baseCardValue = multiStrikeSegments ? Math.max(1, Math.floor(card.value / multiStrikeSegments)) : card.value;
            let baseDmg = baseCardValue + (mergedPlayerStatus.strength || 0) + tempStrengthBonus + globalAttackBonus;
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
            if (effectUpdates.lowHpBonus) {
                const lowHpThreshold = effectUpdates.lowHpThreshold ?? 0.5;
                if (enemyHp < enemyConfig.maxHp * lowHpThreshold) {
                    baseDmg += effectUpdates.lowHpBonus;
                }
            }

            // Batch 2: 暴击次数缩放 (SCALE_BY_CRIT) - YasuoR
            if (card.effect === 'SCALE_BY_CRIT') {
                baseDmg = baseDmg * Math.max(1, critCount || 0); // 伤害 = 基础值 × 暴击次数
            }

            // Batch 6: 蓄势待发 (FIRST_ATTACK_PLUS)
            if (card.type === 'ATTACK' && mergedPlayerStatus.firstAttackBonusArmed) {
                baseDmg += (mergedPlayerStatus.firstAttackBonus || 0);
                setPlayerStatus(prev => ({ ...prev, firstAttackBonusArmed: false }));
            }

            // Batch 6: 闪避突袭 (NEXT_ATTACK_BONUS)
            if (mergedPlayerStatus.nextAttackBonus > 0) {
                baseDmg += mergedPlayerStatus.nextAttackBonus;
                setPlayerStatus(prev => ({ ...prev, nextAttackBonus: 0 }));
            }

            // Batch 2: 回溯加成 (RETRO_BONUS) - EkkoQ
            if (effectUpdates.retroBonus) {
                if (dealtDamageLastTurn) {
                    baseDmg += effectUpdates.retroBonus; // 如果上回合造成过伤害，增加伤害
                }
            }

            // FIX: 支持 MULTI_HIT from effectUpdates
            const hits = multiStrikeSegments || (card.isMultiHit ? card.hits : (effectUpdates.multiHitCount || 1));
            let total = 0;
            let isFirstHit = true; // 用于劫被动
            let drawOnHitCharges = effectUpdates.drawOnHit || 0;

            const currentEnemyStatus = mergedEnemyStatus;
            const cardsPlayedIncludingCurrent = cardsPlayedBefore + 1;
            const priorCardsThisTurn = Math.max(0, cardsPlayedIncludingCurrent - 1);
            const strengthCritBonus = ((mergedPlayerStatus.strength || 0) * heroStrengthCritMultiplier);
            const totalCritChancePercent = Math.max(0, heroBaseCritChance + (mergedPlayerStatus.critChance || 0) + strengthCritBonus);
            const critChanceDecimal = Math.min(1, totalCritChancePercent / 100);
            const critDamageMultiplier = mergedPlayerStatus.critDamageMultiplier || 2;
            const shouldForceCrit = !!effectUpdates.critIfVuln && (currentEnemyStatus.vulnerable > 0);
            if (effectUpdates.comboBonus && dealtDamageThisTurn) {
                baseDmg += effectUpdates.comboBonus;
            }

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
            if (mergedPlayerStatus.nextAttackX2) {
                baseDmg *= 2;
                setPlayerStatus(prev => ({ ...prev, nextAttackX2: false }));
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

            const currentBleedStacks = typeof effectUpdates.bleedExecute === 'number'
                ? currentEnemyStatus.bleed || 0
                : 0;
            const shouldBleedExecute =
                effectUpdates.bleedExecute &&
                currentBleedStacks >= effectUpdates.bleedExecute;
            const shouldExecute = effectUpdates.executeThreshold && (enemyHp <= enemyConfig.maxHp * (effectUpdates.executeThreshold / 100));

            const lifelinkValue = effectUpdates.lifelinkAmount || 0;
            const lifestealFlat = mergedPlayerStatus.lifesteal || 0;
            let blockBuffer = enemyBlock;

            const processMultiHit = () => {
                for (let i = 0; i < hits; i++) {
                    let finalDmg = baseDmg; // 每次击打使用已计算易伤的基础伤害
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
                    if (blockBuffer > 0) {
                        // 敌人格挡时播放格挡音效
                        playSfx('BLOCK_SHIELD');
                        if (blockBuffer >= finalDmg) {
                            blockBuffer = blockBuffer - finalDmg;
                            setEnemyBlock(blockBuffer);
                            dmgToHp = 0;
                        } else {
                            const leftover = finalDmg - blockBuffer;
                            blockBuffer = 0;
                            setEnemyBlock(0);
                            dmgToHp = leftover;
                        }
                    } else if (dmgToHp > 0) {
                        // 敌人受击时播放受击音效
                        setTimeout(() => playSfx('HIT_TAKEN'), 250);
                    }

                    // 薇恩被动：连续命中计数 (圣银弩箭)
                    const hasVaynePassive = heroData.relicId === "VaynePassive" || 
                                           heroData.relics.includes("VaynePassive") ||
                                           (Array.isArray(playerDeck) && playerDeck.some(c => c.id === 'VaynePassive'));
                    
                    if (hasVaynePassive && dmgToHp > 0) {
                        const newHitCount = (vayneHitCount || 0) + 1;
                        if (newHitCount >= 3) {
                            dmgToHp += 12; // 额外12点真实伤害 (根据描述更新)
                            setVayneHitCount(0); // 重置计数
                            console.debug('[VAYNE_PASSIVE] Triggered +12 damage');
                        } else {
                            setVayneHitCount(newHitCount);
                        }
                    }

                    setEnemyHp(h => Math.max(0, h - dmgToHp)); total += dmgToHp;
                    if (lifelinkValue > 0 && dmgToHp > 0) {
                        updatePlayerHp(prev => prev + dmgToHp, { showHeal: true, label: 'LIFE' });
                    }
                    if (lifestealFlat > 0 && dmgToHp > 0) {
                        updatePlayerHp(prev => prev + lifestealFlat, { showHeal: true, label: 'LIFE' });
                    }
                    if (dmgToHp > 0 && drawOnHitCharges > 0) {
                        drawCards(drawOnHitCharges);
                        drawOnHitCharges = 0;
                    }

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

                    if (heroData.relics.includes("VampiricScepter")) {
                        updatePlayerHp(prev => prev + 1, { showHeal: true, label: 'LIFE' });
                    }
                    if (heroData.relicId === "DariusPassive") setEnemyStatus(s => ({ ...s, weak: s.weak + 1 }));

                    // FIX: Multi-hit display - Stagger damage numbers
                    let cloneExtra = 0;
                    if ((enemyStatus.tetherMark || 0) > 0 && dmgToHp > 0) {
                        cloneExtra += enemyStatus.tetherMark;
                        setEnemyStatus(prev => ({ ...prev, tetherMark: 0 }));
                    }
                    if ((cloneAttackPercentRef.current || 0) > 0 && dmgToHp > 0) {
                        cloneExtra += Math.floor(dmgToHp * (cloneAttackPercentRef.current / 100));
                        cloneAttackPercentRef.current = 0;
                    }
                    if (cloneExtra > 0) {
                        applyDirectDamage(cloneExtra, 'CLONE');
                    }
                    const hitDmg = dmgToHp; // Capture current hit damage
                    setTimeout(() => {
                        setDmgOverlay({ val: hitDmg, target: 'ENEMY', isCrit: didCrit });
                        setTimeout(() => setDmgOverlay(null), didCrit ? 600 : 250);
                    }, i * 300);
                }
            const willKill = enemyHp - total <= 0;
            if (willKill) {
                if (effectUpdates.killReward) {
                    const reward = effectUpdates.killReward;
                    setPlayerMana(m => Math.min(initialMana, m + reward));
                    drawCards(reward);
                }
                if (effectUpdates.killRewardNextBattle) {
                    const { draw = 0, mana = 0 } = effectUpdates.killRewardNextBattle;
                    nextBattleBonusRef.current.draw += draw;
                    nextBattleBonusRef.current.mana += mana;
                }
                if (effectUpdates.drawIfKill) {
                    drawCards(effectUpdates.drawIfKill);
                }
                if (playerStatus.permaStrOnKill) {
                    permaStrGainRef.current += 1;
                    setPlayerStatus(prev => ({ ...prev, strength: (prev.strength || 0) + 1 }));
                }
            }
            };

            if (shouldExecute || shouldBleedExecute) {
                setEnemyBlock(0);
                setEnemyHp(0);
                setDmgOverlay({ val: shouldBleedExecute ? 'BLEED EXECUTE!' : 'EXECUTE!', target: 'ENEMY', color: 'text-amber-300' });
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
            let blockGain = card.block;
            if (card.type === 'SKILL' && skillBonusPool > 0) {
                blockGain += skillBonusPool;
                skillBonusPool = 0;
            }
            setPlayerBlock(b => {
                const nextBlock = b + blockGain;
                achievementTracker.recordBattleStat('blockGained', blockGain);
                return nextBlock;
            });
        }

        if (card.type === 'ATTACK') {
            setAttacksThisTurn(prev => prev + 1);
            if (noAttackPlayed) {
                setNoAttackPlayed(false);
                achievementTracker.setBattleFlag('noAttackPlayed', false);
            }
        }
    };

    useEffect(() => {
        if (enemyHp <= 0) {
            // 敌人死亡时触发的被动
            let battleResult = {
                finalHp: playerHp,
                gainedStr: 0,
                gainedMaxHp: 0,
                winGoldBonus: playerStatus.winGoldBonus || 0
            };

            if (nextBattleBonusRef.current.draw > 0 || nextBattleBonusRef.current.mana > 0) {
                if (nextBattleBonusRef.current.draw > 0) {
                    battleResult.nextBattleDrawBonus = (battleResult.nextBattleDrawBonus || 0) + nextBattleBonusRef.current.draw;
                }
                if (nextBattleBonusRef.current.mana > 0) {
                    battleResult.nextBattleManaBonus = (battleResult.nextBattleManaBonus || 0) + nextBattleBonusRef.current.mana;
                }
                nextBattleBonusRef.current = { draw: 0, mana: 0 };
            }

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
                updatePlayerHp(prev => prev + 2, { showHeal: true, label: 'HP', clamp: false });
            }
            if (hunterBadgeActiveRef.current) {
                battleResult.gainedStr += 1;
                hunterBadgeActiveRef.current = false;
            }
            if (permaUpgradeRef.current.length > 0) {
                battleResult.permaUpgrades = permaUpgradeRef.current.map(entry => ({ ...entry }));
                permaUpgradeRef.current = [];
            }
            if ((playerStatus.scholarRuneValue || 0) > 0) {
                battleResult.nextBattleDrawBonus = (battleResult.nextBattleDrawBonus || 0) + playerStatus.scholarRuneValue;
            }
            if (ambitionPactPendingRef.current > 0) {
                battleResult.gainedStr += ambitionPactPendingRef.current;
                ambitionPactPendingRef.current = 0;
            }
            if (permaStrGainRef.current > 0) {
                battleResult.gainedStr += permaStrGainRef.current;
                permaStrGainRef.current = 0;
            }

            playSfx('WIN');
            const resultPayload = {
                ...battleResult,
                maxHpCost: battleDebtRef.current.maxHpCost
            };
            if (singleUseCardsRef.current.length > 0) {
                resultPayload.consumedCards = [...singleUseCardsRef.current];
                singleUseCardsRef.current = [];
            }
            setTimeout(() => onWin(resultPayload), 1000);
        }
    }, [enemyHp]);

    useEffect(() => {
        if (playerHp <= 0) {
            achievementTracker.cancelBattle();
            setTimeout(onLose, 1000);
        }
    }, [playerHp, onLose]);

    const endTurn = () => {
        const { hand, discardPile } = deckRef.current;
        clearDiscountQueue();
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
        if (idleBlockState.armed) {
            if (!idleBlockState.broken && idleBlockState.value > 0) {
                setPlayerStatus(prev => ({
                    ...prev,
                    nextTurnBlock: (prev.nextTurnBlock || 0) + idleBlockState.value
                }));
            }
            setIdleBlockState({ value: 0, armed: false, broken: false, sourceCard: null });
        }
        achievementTracker.recordBattleStat('cardsPlayedInTurn', 0, { setValue: 0 });
        setTurnDamageTotal(0);

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

            // 下回合首次攻击翻倍 (反击之舞)
            if (prev.nextAttackDoubleNextTurn) {
                updates.nextAttackDouble = true;
                updates.nextAttackDoubleNextTurn = false;
            }

            // 清理一次性防守状态
            updates.retaliation = 0;
            updates.damageReduction = 0;

            // 下回合力量
            if (prev.nextTurnStrength > 0) {
                updates.strength = (prev.strength || 0) + prev.nextTurnStrength;
                updates.nextTurnStrength = 0;
            }

            // 每回合开始的被动格挡
            if (prev.passiveBlock > 0) {
                setPlayerBlock(b => b + prev.passiveBlock);
            }

            return updates;
        });
    };

    const enemyAction = () => {
        if (enemyHp <= 0) return;

        if (enemyTrap) {
            setEnemyTrap(null);
            setEnemyStatus(prev => ({
                ...prev,
                weak: (prev.weak || 0) + (enemyTrap.weak || 0),
                poison: (prev.poison || 0) + (enemyTrap.poison || 0),
                trap: Math.max((prev.trap || 1) - 1, 0)
            }));
            if (enemyTrap.damage > 0) {
                applyDirectDamage(enemyTrap.damage, 'TRAP');
            }
            setDmgOverlay({ val: 'TRAP!', target: 'ENEMY', color: 'text-green-400' });
            playSfx('HIT_TAKEN');
        }
        if (enemyBaitDamage > 0) {
            applyDirectDamage(enemyBaitDamage, 'BAIT');
            setEnemyBaitDamage(0);
        }

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
        const wasImmune = playerStatus.immuneOnce;
        if (playerStatus.avoidNextDamage || wasImmune) {
                setPlayerStatus(prev => ({
                    ...prev,
                    avoidNextDamage: false,
                    immuneOnce: false
                }));

                // 显示免疫效果
                setDmgOverlay({ val: 'IMMUNE', target: 'PLAYER', color: 'text-yellow-400' });
                setTimeout(() => setDmgOverlay(null), 800);

                setGameState('PLAYER_TURN');
            if (!wasImmune) {
                setPlayerBlock(0);
            }
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
                if (enemyStatus.slowed > 0) {
                    finalDmg = Math.max(0, Math.floor(finalDmg * 0.75));
                    setEnemyStatus(s => ({ ...s, slowed: Math.max(0, (s.slowed || 1) - 1) }));
                }
                if (playerStatus.damageReduction > 0) {
                    finalDmg = Math.max(0, Math.floor(finalDmg * (1 - playerStatus.damageReduction / 100)));
                }
                if (playerStatus.nextDamageReduce > 0) {
                    finalDmg = Math.max(0, finalDmg - playerStatus.nextDamageReduce);
                    setPlayerStatus(prev => ({ ...prev, nextDamageReduce: 0 }));
                }
                if (playerStatus.vulnerable > 0) finalDmg = Math.floor(finalDmg * 1.5);
                if (remBlock >= finalDmg) {
                    // 玩家格挡时播放格挡音效
                    playSfx('BLOCK_SHIELD');
                    remBlock -= finalDmg;
                    if (playerStatus.reflectDamage > 0) {
                        applyDirectDamage(playerStatus.reflectDamage, 'REFLECT');
                    }
                } else {
                    let pierce = finalDmg - remBlock;
                    remBlock = 0;
                    currHp -= pierce;
                    // 玩家受击时播放受击音效
                    setTimeout(() => playSfx('HIT_TAKEN'), 250);
                    if (heroData.relics.includes("BrambleVest")) setEnemyHp(h => Math.max(0, h - 3));
                    if (playerStatus.reflectDamage > 0) {
                        applyDirectDamage(playerStatus.reflectDamage, 'REFLECT');
                    }
                }
                total += finalDmg;
            }
            const damageTaken = Math.max(0, playerHp - currHp);
            setPlayerBlock(remBlock); setPlayerHp(currHp); setDmgOverlay({ val: total, target: 'PLAYER' }); setTimeout(() => setDmgOverlay(null), 800);
            if (damageTaken > 0) {
                achievementTracker.recordPlayerDamage(damageTaken);
                if (playerStatus.retaliation > 0) {
                    applyDirectDamage(playerStatus.retaliation, 'RETALIATE');
                }
                if ((playerStatus.strPerHit || 0) > 0) {
                    setPlayerStatus(prev => ({ ...prev, strength: (prev.strength || 0) + playerStatus.strPerHit }));
                    setDmgOverlay({ val: `力量 +${playerStatus.strPerHit}`, target: 'PLAYER', color: 'text-red-300' });
                    setTimeout(() => setDmgOverlay(null), 700);
                }
                if ((playerStatus.strWhenHit || 0) > 0) {
                    setPlayerStatus(prev => ({ ...prev, strength: (prev.strength || 0) + playerStatus.strWhenHit }));
                }
                if (playerStatus.reflectBuff) {
                    setPlayerStatus(prev => ({ ...prev, reflectBuff: false, nextAttackDouble: true }));
                }
            }
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
            {status.tempStrength > 0 && <div className="flex items-center text-[10px] text-red-300 bg-red-900/30 px-1 rounded border border-red-700 shadow-sm"><Sword size={10} className="mr-1" /> 临时 +{status.tempStrength}</div>}
            {status.globalAttackBonus > 0 && <div className="flex items-center text-[10px] text-orange-200 bg-orange-900/30 px-1 rounded border border-orange-700 shadow-sm"><Sword size={10} className="mr-1" /> 全攻 +{status.globalAttackBonus}</div>}
            {status.dexterity > 0 && <div className="flex items-center text-[10px] text-green-400 bg-green-900/40 px-1 rounded border border-green-900 shadow-sm"><Shield size={10} className="mr-1" /> 灵巧 {status.dexterity}</div>}
            {status.weak > 0 && <div className="flex items-center text-[10px] text-yellow-400 bg-yellow-900/40 px-1 rounded border border-yellow-900 shadow-sm"><Activity size={10} className="mr-1" /> 虚弱 {status.weak}</div>}
            {status.vulnerable > 0 && <div className="flex items-center text-[10px] text-purple-400 bg-purple-900/40 px-1 rounded border border-purple-900 shadow-sm"><Zap size={10} className="mr-1" /> 易伤 {status.vulnerable}</div>}
            {status.poison > 0 && <div className="flex items-center text-[10px] text-green-500 bg-green-900/40 px-1 rounded border border-green-900 shadow-sm"><Skull size={10} className="mr-1" /> 中毒 {status.poison}</div>}
            {status.bleed > 0 && <div className="flex items-center text-[10px] text-red-600 bg-red-950/40 px-1 rounded border border-red-800 shadow-sm"><Droplet size={10} className="mr-1" /> 流血 {status.bleed}</div>}
            {status.burn > 0 && <div className="flex items-center text-[10px] text-orange-500 bg-orange-950/40 px-1 rounded border border-orange-800 shadow-sm"><Flame size={10} className="mr-1" /> 灼烧 {status.burn}</div>}
            {status.voidDot > 0 && <div className="flex items-center text-[10px] text-purple-300 bg-purple-950/40 px-1 rounded border border-purple-800 shadow-sm"><Ghost size={10} className="mr-1" /> 虚空 {status.voidDot}</div>}
            {status.mark > 0 && <div className="flex items-center text-[10px] text-orange-400 bg-orange-900/40 px-1 rounded border border-orange-900 shadow-sm"><Crosshair size={10} className="mr-1" /> 标记 {status.mark}</div>}
            {status.trap > 0 && <div className="flex items-center text-[10px] text-green-200 bg-green-900/40 px-1 rounded border border-green-700 shadow-sm"><Layers size={10} className="mr-1" /> 陷阱 {status.trap}</div>}
            {status.tetherMark > 0 && <div className="flex items-center text-[10px] text-blue-300 bg-blue-900/40 px-1 rounded border border-blue-700 shadow-sm"><Link size={10} className="mr-1" /> 牵绊 {status.tetherMark}</div>}
            {(status.immuneOnce || status.avoidNextDamage) && <div className="flex items-center text-[10px] text-yellow-200 bg-yellow-900/40 px-1 rounded border border-yellow-700 shadow-sm"><Lock size={10} className="mr-1" /> 免疫</div>}
            {status.stunned > 0 && <div className="flex items-center text-[10px] text-blue-400 bg-blue-900/40 px-1 rounded border border-blue-900 shadow-sm"><AlertTriangle size={10} className="mr-1" /> 眩晕 {status.stunned}</div>}
            {status.reflect > 0 && <div className="flex items-center text-[10px] text-orange-300 bg-orange-950/40 px-1 rounded border border-orange-800 shadow-sm"><RefreshCw size={10} className="mr-1" /> 反伤 {status.reflect}</div>}
            {status.damageReduce > 0 && <div className="flex items-center text-[10px] text-blue-300 bg-blue-950/40 px-1 rounded border border-blue-800 shadow-sm"><TrendingDown size={10} className="mr-1" /> 减伤 {status.damageReduce}%</div>}
            {status.damageReduction > 0 && <div className="flex items-center text-[10px] text-blue-300 bg-blue-950/40 px-1 rounded border border-blue-800 shadow-sm"><TrendingDown size={10} className="mr-1" /> 减伤 {status.damageReduction}%</div>}
            {status.retaliation > 0 && <div className="flex items-center text-[10px] text-orange-400 bg-orange-950/40 px-1 rounded border border-orange-800 shadow-sm"><Activity size={10} className="mr-1" /> 反弹 {status.retaliation}</div>}
            {status.firstAttackBonus > 0 && <div className="flex items-center text-[10px] text-amber-300 bg-amber-900/30 px-1 rounded border border-amber-700 shadow-sm"><Sword size={10} className="mr-1" /> 蓄势 +{status.firstAttackBonus}</div>}
            {status.healReduce > 0 && <div className="flex items-center text-[10px] text-red-300 bg-red-950/40 px-1 rounded border border-red-900 shadow-sm"><Skull size={10} className="mr-1" /> 重伤 {status.healReduce}%</div>}
            {status.lifesteal > 0 && <div className="flex items-center text-[10px] text-pink-400 bg-pink-900/40 px-1 rounded border border-pink-800 shadow-sm"><Heart size={10} className="mr-1" /> 吸血</div>}
            {status.regenMana > 0 && <div className="flex items-center text-[10px] text-blue-400 bg-blue-900/40 px-1 rounded border border-blue-800 shadow-sm"><Zap size={10} className="mr-1" /> 回蓝 {status.regenMana}</div>}
            {status.nextAttackBonus > 0 && <div className="flex items-center text-[10px] text-amber-200 bg-amber-900/30 px-1 rounded border border-amber-700 shadow-sm"><Sword size={10} className="mr-1" /> 下一击 +{status.nextAttackBonus}</div>}
            {status.nextAttackDouble && <div className="flex items-center text-[10px] text-red-400 bg-red-900/40 px-1 rounded border border-red-800 shadow-sm"><Sword size={10} className="mr-1" /> 双倍伤害</div>}
            {status.nextAttackX2 && <div className="flex items-center text-[10px] text-red-300 bg-red-900/30 px-1 rounded border border-red-700 shadow-sm"><Sword size={10} className="mr-1" /> 下一击 x2</div>}
            {status.cloneAttackPercent > 0 && <div className="flex items-center text-[10px] text-gray-300 bg-gray-900/40 px-1 rounded border border-gray-700 shadow-sm"><Users size={10} className="mr-1" /> 影分身 {status.cloneAttackPercent}%</div>}

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
    const strengthCritBonus = ((playerStatus.strength || 0) * heroStrengthCritMultiplier);
    const buffCritChance = (playerStatus.critChance || 0);
    const totalCritChanceValue = Math.max(0, heroBaseCritChance + strengthCritBonus + buffCritChance);
    const displayCritChance = `${totalCritChanceValue.toFixed(0)}%`;
    const displayBaseChance = `${heroBaseCritChance.toFixed(0)}%`;
    const displayStrChance = `${strengthCritBonus.toFixed(0)}%`;
    const displayBuffChance = `${buffCritChance.toFixed(0)}%`;

    if (!heroData || !enemyConfig) {
        return <div className="w-full h-full flex items-center justify-center text-white">Loading...</div>;
    }

    return (
        <div className="w-full h-full relative flex flex-col overflow-hidden bg-black">
            <div className="absolute inset-0 bg-cover bg-center opacity-40" style={{ backgroundImage: `url(${ACT_BACKGROUNDS[act || 1]})` }}></div>
            <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
                <div className={`absolute left-10 bottom-[42%] w-64 h-[500px] transition-all duration-200 ${heroAnim === 'attack' ? 'translate-x-32' : ''} ${heroAnim === 'hit' ? 'translate-x-[-10px] brightness-50 bg-red-500/30' : ''}`}>
                    <img src={heroData.img} className="w-full h-full object-cover object-top rounded-xl shadow-[0_0_30px_rgba(0,0,0,0.8)] border-2 border-[#C8AA6E]" />
                    <div className="absolute -bottom-24 w-full bg-black/80 border border-[#C8AA6E] p-2 rounded flex flex-col gap-1 shadow-lg z-40">
                        <div className="flex justify-between text-xs text-[#C8AA6E] font-bold">
                            <span>HP {playerHp}/{heroData.maxHp}</span>
                            {playerBlock > 0 && <span className="text-blue-400 flex items-center gap-1"><Shield size={12} />{playerBlock}</span>}
                        </div>
                        <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                            <div className="h-full bg-green-600 transition-all duration-300" style={{ width: `${(playerHp / heroData.maxHp) * 100}%` }}></div>
                        </div>
                        {renderStatus(playerStatus)}
                        <div className="mt-2 w-full bg-[#0a1324] border border-[#1f2a3f] rounded px-2 py-1 text-[11px] text-[#C8AA6E] font-semibold">
                            <div>Crt Chance: {displayCritChance} | Crt Count: {critCount}</div>
                            <div className="text-[10px] font-normal text-gray-300">Base: {displayBaseChance} | Str: {displayStrChance} | Buff: {displayBuffChance}</div>
                        </div>
                    </div>
                </div>
                <div className="text-6xl font-black text-[#C8AA6E]/20 italic">VS</div>
                <div className={`absolute right-10 bottom-[42%] w-64 h-[500px] transition-all duration-200 ${enemyAnim === 'attack' ? '-translate-x-32' : ''} ${enemyAnim === 'hit' ? 'translate-x-[10px] brightness-50 bg-red-500/30' : ''}`}>
                    <img src={enemyConfig.img} className="w-full h-full object-cover object-top rounded-xl shadow-[0_0_30px_rgba(0,0,0,0.8)] border-2 border-red-800" />
                    <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-black/80 border border-red-600 px-3 py-1 rounded flex items-center gap-2 animate-bounce"><IntentIcon /><span className="text-white font-bold text-lg">{displayValue}{nextEnemyAction.count > 1 ? `x${nextEnemyAction.count}` : ''}</span></div>
                    <div className="absolute -bottom-24 w-full bg-black/80 border border-red-800 p-2 rounded flex flex-col gap-1 shadow-lg z-40"><div className="flex justify-between text-xs text-red-500 font-bold"><span>{enemyConfig.name}</span><span>{enemyHp}/{enemyConfig.maxHp}</span></div><div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden"><div className="h-full bg-red-600 transition-all duration-300" style={{ width: `${(enemyHp / enemyConfig.maxHp) * 100}%` }}></div></div>{enemyBlock > 0 && <div className="text-blue-400 text-xs font-bold flex items-center gap-1"><Shield size={10} /> 格挡 {enemyBlock}</div>}{renderStatus(enemyStatus)}</div>
                </div>
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
            {scoutInfo && (
                <div className="absolute top-12 left-1/2 -translate-x-1/2 bg-black/80 border border-cyan-400 text-cyan-200 px-4 py-2 rounded-lg text-sm z-50 shadow-lg">
                    <span>敌人下一动：{scoutInfo.label}</span>
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
                            const card = getCardWithUpgrade(cid);
                            if (!card) {
                                console.warn(`Card not found in database: ${cid}`);
                                return null;
                            }
                            const canPlay = playerMana >= card.cost && gameState === 'PLAYER_TURN';
                            const discountAmount = getDiscountForCard(cid);
                            return (
                                <Card
                                    key={`${cid}-${i}`}
                                    cardId={cid}
                                    index={i}
                                    totalCards={hand.length}
                                    canPlay={canPlay}
                                    onPlay={playCard}
                                    discountAmount={discountAmount}
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

