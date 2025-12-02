export const ACHIEVEMENTS = [
    {
        id: 'ACH_001',
        name: 'Shrug It Off',
        category: 'BATTLE',
        description: '以 ≤10 HP 结束战斗并获胜',
        difficulty: 'B',
        trigger: 'battle_end_low_hp',
        reward: { type: 'CARD', ref: 'ToughBandages' }
    },
    {
        id: 'ACH_005',
        name: 'Adrenaline',
        category: 'BATTLE',
        description: '战斗中任意时刻拥有 4 点及以上法力',
        difficulty: 'A',
        trigger: 'peak_mana',
        reward: { type: 'RELIC', ref: 'AdrenalineOrb' }
    },
    {
        id: 'ACH_019',
        name: 'The Guardian',
        category: 'BOSS',
        description: '击败 Act1 Boss：岩石守护者',
        difficulty: 'B',
        trigger: 'boss_guardian',
        reward: { type: 'CARD', ref: 'GuardianStrike' }
    }
];

export const ACHIEVEMENT_STORAGE_KEY = 'lots_achievements_v1';

