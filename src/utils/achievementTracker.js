import { ACHIEVEMENTS, ACHIEVEMENT_STORAGE_KEY } from '../data/achievements';

const achievementMap = ACHIEVEMENTS.reduce((acc, achv) => {
    acc[achv.id] = achv;
    return acc;
}, {});

const defaultState = {
    unlocked: new Set(),
    battle: null,
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
    persistState();
    defaultState.notifier?.(achievementMap[id]);
};

export const achievementTracker = {
    init({ onUnlock } = {}) {
        deserializeState();
        defaultState.notifier = onUnlock || null;
    },
    startRun(meta = {}) {
        defaultState.runMeta = meta;
    },
    startBattle({ isBoss } = {}) {
        defaultState.battle = {
            isBoss: !!isBoss,
            damageTaken: false,
            peakMana: 0
        };
    },
    recordMana(currentMana) {
        if (!defaultState.battle) return;
        defaultState.battle.peakMana = Math.max(defaultState.battle.peakMana, currentMana || 0);
        if (defaultState.battle.peakMana >= 4) {
            unlockAchievement('ACH_005');
        }
    },
    recordPlayerDamage(amount) {
        if (!defaultState.battle) return;
        if (amount > 0) {
            defaultState.battle.damageTaken = true;
        }
    },
    recordBattleEnd({ playerHp = 0, bossId = null } = {}) {
        if (!defaultState.battle) return;
        if (playerHp <= 10) {
            unlockAchievement('ACH_001');
        }
        if (bossId === 'Guardian') {
            unlockAchievement('ACH_019');
        }
        defaultState.battle = null;
    },
    cancelBattle() {
        defaultState.battle = null;
    },
    isUnlocked(id) {
        return defaultState.unlocked.has(id);
    }
};

