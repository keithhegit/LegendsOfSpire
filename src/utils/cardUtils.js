import { CARD_DATABASE } from '../data/cards';

const HAMMER_SUFFIX_REGEX = /\^(\d+)$/;

const stripHammerSuffix = (cardId = '') => {
    if (typeof cardId !== 'string') return '';
    return cardId.replace(HAMMER_SUFFIX_REGEX, '');
};

export const getHammerBonus = (cardId = '') => {
    if (typeof cardId !== 'string') return 0;
    const match = cardId.match(HAMMER_SUFFIX_REGEX);
    return match ? parseInt(match[1], 10) || 0 : 0;
};

export const setHammerBonus = (cardId = '', bonus = 0) => {
    if (typeof cardId !== 'string') return '';
    const normalizedBonus = Math.max(0, bonus);
    const base = stripHammerSuffix(cardId);
    return normalizedBonus > 0 ? `${base}^${normalizedBonus}` : base;
};

export const addHammerBonus = (cardId = '', delta = 1) => {
    const current = getHammerBonus(cardId);
    return setHammerBonus(cardId, current + delta);
};

export const getBaseCardId = (cardId = '') => {
    if (typeof cardId !== 'string') return '';
    const withoutHammer = stripHammerSuffix(cardId);
    return withoutHammer.replace(/\++$/g, '');
};

export const getUpgradeLevel = (cardId = '') => {
    if (typeof cardId !== 'string') return 0;
    const withoutHammer = stripHammerSuffix(cardId);
    const match = withoutHammer.match(/\++$/);
    return match ? match[0].length : 0;
};

const applyIncrement = (baseValue, level, increment) => {
    if (typeof baseValue !== 'number') return baseValue;
    return baseValue + level * increment;
};

const upgradeDescription = (description, level, increment) => {
    if (typeof description !== 'string' || !description.length || level === 0) {
        return description;
    }
    return description.replace(/\d+/g, (match) => {
        const numeric = parseInt(match, 10);
        if (Number.isNaN(numeric)) return match;
        return numeric + level * increment;
    });
};

export const getCardWithUpgrade = (cardId) => {
    if (!cardId) return null;
    const hammerBonus = getHammerBonus(cardId);
    const baseId = getBaseCardId(cardId);
    const upgradeLevel = getUpgradeLevel(cardId);
    const baseCard = CARD_DATABASE[baseId];
    if (!baseCard) return null;

    const valueIncrement = baseCard.upgradeValueIncrement ?? baseCard.upgradeIncrement ?? 3;
    const blockIncrement = baseCard.upgradeBlockIncrement ?? baseCard.upgradeIncrement ?? 3;
    const effectIncrement = baseCard.upgradeEffectIncrement ?? 1;
    const descriptionIncrement = baseCard.upgradeDescriptionIncrement ?? valueIncrement;

    const upgradedValue = applyIncrement(baseCard.value, upgradeLevel, valueIncrement);
    const upgradedBlock = applyIncrement(baseCard.block, upgradeLevel, blockIncrement);

    const applyHammer = (stat) => (typeof stat === 'number' ? stat + hammerBonus : stat);

    return {
        ...baseCard,
        id: cardId,
        baseId,
        upgradeLevel,
        hammerBonus,
        name: upgradeLevel > 0 ? `${baseCard.name}${'+'.repeat(upgradeLevel)}` : baseCard.name,
        value: applyHammer(upgradedValue),
        block: applyHammer(upgradedBlock),
        effectValue: applyIncrement(baseCard.effectValue, upgradeLevel, effectIncrement),
        description: upgradeDescription(baseCard.description, upgradeLevel, descriptionIncrement)
    };
};

