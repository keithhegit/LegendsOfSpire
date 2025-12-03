const OVERRIDE_KEY = 'achievement_feature_override';
const DEFAULT_ENABLED = process.env.REACT_APP_ACHIEVEMENT_ENABLED === 'false' ? false : true;

export const getAchievementFeatureFlag = () => {
    if (typeof window === 'undefined') {
        return DEFAULT_ENABLED;
    }
    const override = localStorage.getItem(OVERRIDE_KEY);
    if (override === 'on') return true;
    if (override === 'off') return false;
    return DEFAULT_ENABLED;
};

export const isAchievementFeatureEnabled = () => getAchievementFeatureFlag();

export const setAchievementFeatureFlag = (value) => {
    if (typeof window === 'undefined') return;
    if (value === null) {
        localStorage.removeItem(OVERRIDE_KEY);
    } else {
        localStorage.setItem(OVERRIDE_KEY, value ? 'on' : 'off');
    }
};

