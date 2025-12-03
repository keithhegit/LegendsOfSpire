import { ACHIEVEMENTS, ACHIEVEMENT_STORAGE_KEY } from '../data/achievements';
import { isAchievementFeatureEnabled } from '../config/achievementConfig';

const achievementMap = ACHIEVEMENTS.reduce((acc, achv) => {
    acc[achv.id] = achv;
    return acc;
}, {});

const resetRunStats = () => ({
    shopVisits: 0,
    eventVisits: 0,
    chestOpens: 0,
    nodesVisited: 0,
    monsterKills: 0,
    runDurationMinutes: 0,
    relicsOwned: 0,
    uniqueCards: 0,
    ascensionRuns: 0,
    ascensionClears: 0,
    eventRunComplete: false,
    cardCollectionComplete: false
});

const resetBattleStats = () => ({
    manaPeak: 0,
    damageTaken: 0,
    stats: {},
    flags: {},
    mechanicLevels: {},
    turnDamage: 0,
    singleHit: 0,
    lastTurnCards: 0,
    strength: 0
});

const defaultState = {
    unlocked: new Set(),
    runUnlocked: new Set(),
    runStats: resetRunStats(),
    battleStats: resetBattleStats(),
    runMeta: null,
    notifier: null
};

const deserializeState = () => {
    if (typeof localStorage === 'undefined') return;
    try {
        const raw = localStorage.getItem(ACHIEVEMENT_STORAGE_KEY);
        if (!raw) return;
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed.unlocked)) {
            parsed.unlocked.forEach(id => defaultState.unlocked.add(id));
        }
    } catch (err) {
        console.warn('[AchievementTracker] Failed to load state', err);
    }
};

const persistState = () => {
    if (typeof localStorage === 'undefined') return;
    try {
        localStorage.setItem(
            ACHIEVEMENT_STORAGE_KEY,
            JSON.stringify({ unlocked: Array.from(defaultState.unlocked) })
        );
    } catch (err) {
        console.warn('[AchievementTracker] Failed to persist state', err);
    }
};

const unlockAchievement = (id) => {
    if (!achievementMap[id] || defaultState.unlocked.has(id)) {
        return;
    }
    defaultState.unlocked.add(id);
    defaultState.runUnlocked.add(id);
    persistState();
    defaultState.notifier?.(achievementMap[id]);
};

const matchesTrigger = (trigger, payload = {}) => {
    if (!trigger) return false;
    switch (trigger.type) {
        case 'battle_end': {
            const hpCondition =
                trigger.playerHpLte === undefined || payload.playerHp <= trigger.playerHpLte;
            const bossCondition =
                trigger.bossId === undefined || payload.bossId === trigger.bossId;
            return hpCondition && bossCondition;
        }
        case 'mana_peak': {
            if (trigger.valueGte === undefined) return false;
            return defaultState.battleStats?.manaPeak >= trigger.valueGte;
        }
        case 'stat': {
            if (trigger.stat === undefined) return false;
            const statValue = defaultState.runStats[trigger.stat] ?? defaultState.battleStats.stats[trigger.stat];
            if (statValue === undefined) return false;
            if (trigger.valueGte !== undefined && statValue >= trigger.valueGte) return true;
            if (trigger.maxValue !== undefined && statValue <= trigger.maxValue) return true;
            return false;
        }
        case 'battle_stat': {
            if (!trigger.stat) return false;
            const statValue = defaultState.battleStats.stats[trigger.stat];
            if (statValue === undefined) return false;
            if (trigger.valueGte !== undefined && statValue >= trigger.valueGte) return true;
            if (trigger.maxValue !== undefined && statValue <= trigger.maxValue) return true;
            return false;
        }
        case 'battle_flag': {
            if (!trigger.flag) return false;
            return Boolean(defaultState.battleStats.flags[trigger.flag]);
        }
        case 'mechanic_level': {
            if (!trigger.mechanic) return false;
            const level = defaultState.battleStats.mechanicLevels[trigger.mechanic];
            if (level === undefined) return false;
            return level >= (trigger.level ?? trigger.valueGte ?? 0);
        }
        case 'act_complete': {
            return trigger.act !== undefined && payload.act === trigger.act;
        }
        case 'meta': {
            if (!trigger.meta) return false;
            const metaValue = defaultState.runStats[trigger.meta] ?? (trigger.meta === 'runDurationMinutes' ? payload.runDurationMinutes : undefined);
            if (metaValue === undefined) return false;
            if (trigger.valueGte !== undefined) return metaValue >= trigger.valueGte;
            if (trigger.maxValue !== undefined) return metaValue <= trigger.maxValue;
            return metaValue === true;
        }
        default:
            return false;
    }
};

const shouldTrack = () => isAchievementFeatureEnabled();

const checkAchievements = (triggerType, payload) => {
    if (!shouldTrack()) return;
    ACHIEVEMENTS.forEach(achievement => {
        if (!achievement.trigger || achievement.trigger.type !== triggerType) {
            return;
        }
        if (matchesTrigger(achievement.trigger, payload)) {
            unlockAchievement(achievement.id);
        }
    });
};

const incrementRunStat = (statKey, amount = 1) => {
    if (!defaultState.runStats.hasOwnProperty(statKey)) return;
    defaultState.runStats[statKey] += amount;
    checkAchievements('stat', { stat: statKey, value: defaultState.runStats[statKey] });
    return defaultState.runStats[statKey];
};

export const achievementTracker = {
    init({ onUnlock } = {}) {
        deserializeState();
        defaultState.notifier = onUnlock || null;
    },
    startRun(meta = {}) {
        defaultState.runMeta = meta;
        defaultState.runStats = resetRunStats();
        defaultState.runUnlocked = new Set();
    },
    startBattle() {
        if (!shouldTrack()) return;
        defaultState.battleStats = resetBattleStats();
    },
    recordMana(currentMana) {
        if (!shouldTrack()) return;
        if (!defaultState.battleStats) return;
        defaultState.battleStats.manaPeak = Math.max(defaultState.battleStats.manaPeak, currentMana || 0);
        checkAchievements('mana_peak');
    },
    recordPlayerDamage(amount) {
        if (!defaultState.battleStats) return;
        if (amount > 0) {
            defaultState.battleStats.damageTaken += amount;
        }
    },
    recordBattleStat(statKey, value = 1, options = {}) {
        if (!shouldTrack()) return;
        if (!defaultState.battleStats) return;
        const prev = defaultState.battleStats.stats[statKey] || 0;
        defaultState.battleStats.stats[statKey] = options.setValue ?? prev + value;
        checkAchievements('battle_stat');
    },
    setBattleFlag(flag, value = true) {
        if (!shouldTrack()) return;
        if (!defaultState.battleStats) return;
        defaultState.battleStats.flags[flag] = value;
        checkAchievements('battle_flag');
    },
    setMechanicLevel(mechanic, level) {
        if (!shouldTrack()) return;
        if (!defaultState.battleStats) return;
        defaultState.battleStats.mechanicLevels[mechanic] = Math.max(defaultState.battleStats.mechanicLevels[mechanic] || 0, level);
        checkAchievements('mechanic_level');
    },
    recordSingleHit(damage) {
        if (!shouldTrack()) return;
        if (!defaultState.battleStats) return;
        defaultState.battleStats.singleHit = Math.max(defaultState.battleStats.singleHit, damage);
        checkAchievements('battle_stat');
    },
    recordTurnDamage(damage) {
        if (!shouldTrack()) return;
        if (!defaultState.battleStats) return;
        defaultState.battleStats.turnDamage = (defaultState.battleStats.turnDamage || 0) + damage;
        checkAchievements('battle_stat');
    },
    recordBattleEnd({ playerHp = 0, bossId = null } = {}) {
        if (!shouldTrack()) return;
        if (!defaultState.battleStats) return;
        checkAchievements('battle_end', { playerHp, bossId });
        defaultState.battleStats = resetBattleStats();
    },
    recordShopVisit() {
        if (!shouldTrack()) return;
        incrementRunStat('shopVisits');
    },
    recordEventVisit() {
        if (!shouldTrack()) return;
        const count = incrementRunStat('eventVisits') || 0;
        if (count >= 12) {
            this.markEventRunComplete();
        }
    },
    recordChestOpen() {
        if (!shouldTrack()) return;
        incrementRunStat('chestOpens');
    },
    recordNodeVisit() {
        if (!shouldTrack()) return;
        incrementRunStat('nodesVisited');
    },
    recordEnemyKill({ isBoss = false } = {}) {
        if (!shouldTrack()) return;
        if (isBoss) return;
        incrementRunStat('monsterKills');
    },
    recordActCompletion(act) {
        if (!shouldTrack()) return;
        if (!act) return;
        checkAchievements('act_complete', { act });
    },
    updateRunDuration(minutes) {
        if (!shouldTrack()) return;
        defaultState.runStats.runDurationMinutes = minutes;
        checkAchievements('meta', { runDurationMinutes: minutes });
    },
    incrementAscensionRun() {
        if (!shouldTrack()) return;
        incrementRunStat('ascensionRuns');
    },
    incrementAscensionClear() {
        if (!shouldTrack()) return;
        incrementRunStat('ascensionClears');
    },
    markEventRunComplete() {
        if (!shouldTrack()) return;
        defaultState.runStats.eventRunComplete = true;
        checkAchievements('meta');
    },
    updateUniqueCards(count) {
        if (!shouldTrack()) return;
        defaultState.runStats.uniqueCards = count;
        checkAchievements('stat', { stat: 'uniqueCards', value: count });
    },
    updateRelicsOwned(count) {
        if (!shouldTrack()) return;
        defaultState.runStats.relicsOwned = count;
        checkAchievements('stat', { stat: 'relicsOwned', value: count });
    },
    setCardCollectionComplete(flag = true) {
        if (!shouldTrack()) return;
        defaultState.runStats.cardCollectionComplete = flag;
        checkAchievements('meta', { meta: 'cardCollectionComplete', value: flag });
    },
    cancelBattle() {
        defaultState.battleStats = resetBattleStats();
    },
    getUnlocked() {
        return Array.from(defaultState.unlocked);
    },
    hydrateUnlocked(ids = []) {
        ids.forEach(id => {
            defaultState.unlocked.add(id);
            defaultState.runUnlocked.add(id);
        });
        persistState();
    },
    isUnlocked(id) {
        return defaultState.unlocked.has(id);
    },
    wasUnlockedThisRun(id) {
        return defaultState.runUnlocked.has(id);
    }
};

