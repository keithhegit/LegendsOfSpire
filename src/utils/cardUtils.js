import { CARD_DATABASE } from '../data/cards';

export const getBaseCardId = (cardId = '') => {
    if (typeof cardId !== 'string') return '';
    return cardId.replace(/\++$/g, '');
};

export const getUpgradeLevel = (cardId = '') => {
    if (typeof cardId !== 'string') return 0;
    const match = cardId.match(/\++$/);
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
    const baseId = getBaseCardId(cardId);
    const upgradeLevel = getUpgradeLevel(cardId);
    const baseCard = CARD_DATABASE[baseId];
    if (!baseCard) return null;

    const valueIncrement = baseCard.upgradeValueIncrement ?? baseCard.upgradeIncrement ?? 3;
    const blockIncrement = baseCard.upgradeBlockIncrement ?? baseCard.upgradeIncrement ?? 3;
    const effectIncrement = baseCard.upgradeEffectIncrement ?? 1;
    const descriptionIncrement = baseCard.upgradeDescriptionIncrement ?? valueIncrement;

    return {
        ...baseCard,
        id: cardId,
        baseId,
        upgradeLevel,
        name: upgradeLevel > 0 ? `${baseCard.name}${'+'.repeat(upgradeLevel)}` : baseCard.name,
        value: applyIncrement(baseCard.value, upgradeLevel, valueIncrement),
        block: applyIncrement(baseCard.block, upgradeLevel, blockIncrement),
        effectValue: applyIncrement(baseCard.effectValue, upgradeLevel, effectIncrement),
        description: upgradeDescription(baseCard.description, upgradeLevel, descriptionIncrement)
    };
};

