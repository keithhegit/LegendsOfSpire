export const ACHIEVEMENTS = [
    {
        id: 'ACH_001',
        category: 'BATTLE',
        name: 'Shrug It Off',
        description: '以 10 HP 或更少结束战斗并获胜',
        difficulty: 'B',
        trigger: { type: 'battle_end', playerHpLte: 10 },
        reward: { type: 'CARD', ref: 'ToughBandages' }
    },
    {
        id: 'ACH_002',
        category: 'BATTLE',
        name: 'Purity',
        description: '手牌、牌库、弃牌区总数≤3 才能继续战斗',
        difficulty: 'A',
        trigger: { type: 'battle_stat', stat: 'totalCards', maxValue: 3 },
        reward: { type: 'RELIC', ref: 'PurityRing' }
    },
    {
        id: 'ACH_003',
        category: 'BATTLE',
        name: 'Come At Me',
        description: '不出攻击牌也能赢得一场战斗',
        difficulty: 'A',
        trigger: { type: 'battle_flag', flag: 'noAttackPlayed' },
        reward: { type: 'MODE', ref: 'PureSkillMode' }
    },
    {
        id: 'ACH_004',
        category: 'BATTLE',
        name: 'The Pact',
        description: '单场战斗耗尽 20 张牌',
        difficulty: 'B',
        trigger: { type: 'battle_stat', stat: 'cardsPlayed', valueGte: 20 },
        reward: { type: 'CARD', ref: 'ExhaustPact' }
    },
    {
        id: 'ACH_005',
        category: 'BATTLE',
        name: 'Adrenaline',
        description: '单回合法力峰值达到或超过 4',
        difficulty: 'A',
        trigger: { type: 'mana_peak', valueGte: 4 },
        reward: { type: 'RELIC', ref: 'AdrenalineOrb' }
    },
    {
        id: 'ACH_006',
        category: 'BATTLE',
        name: 'Powerful',
        description: '战斗中 Buff 层数达到 10',
        difficulty: 'B',
        trigger: { type: 'battle_stat', stat: 'buffStacks', valueGte: 10 },
        reward: { type: 'CARD', ref: 'PowerSurge' }
    },
    {
        id: 'ACH_007',
        category: 'BATTLE',
        name: 'Jaxxed',
        description: 'Ironclad 战斗中力量 ≥50',
        difficulty: 'S',
        trigger: { type: 'battle_stat', stat: 'strength', valueGte: 50 },
        reward: { type: 'RELIC', ref: 'JaxxsBarbell' }
    },
    {
        id: 'ACH_008',
        category: 'BATTLE',
        name: 'Impervious',
        description: '战斗中累积格挡 ≥99',
        difficulty: 'A',
        trigger: { type: 'battle_stat', stat: 'blockGained', valueGte: 99 },
        reward: { type: 'CARD', ref: 'ImperviousShell' }
    },
    {
        id: 'ACH_009',
        category: 'BATTLE',
        name: 'Barricaded',
        description: '战斗中格挡累计达 999',
        difficulty: 'S',
        trigger: { type: 'battle_stat', stat: 'blockGained', valueGte: 999 },
        reward: { type: 'MODE', ref: 'BarricadeChallenge' }
    },
    {
        id: 'ACH_010',
        category: 'BATTLE',
        name: 'Catalyst',
        description: '对单体敌人造成 ≥99 层中毒',
        difficulty: 'A',
        trigger: { type: 'battle_stat', stat: 'poisonStacks', valueGte: 99 },
        reward: { type: 'CARD', ref: 'CatalystVial' }
    },
    {
        id: 'ACH_011',
        category: 'BATTLE',
        name: 'Plague',
        description: '单场战斗毒杀 3 个敌人',
        difficulty: 'B',
        trigger: { type: 'battle_stat', stat: 'poisonKills', valueGte: 3 },
        reward: { type: 'RELIC', ref: 'PlagueMask' }
    },
    {
        id: 'ACH_012',
        category: 'BATTLE',
        name: 'Ninja',
        description: '单回合出 10 把飞刀',
        difficulty: 'A',
        trigger: { type: 'battle_stat', stat: 'shurikenPlayed', valueGte: 10 },
        reward: { type: 'CARD', ref: 'MasterNinja' }
    },
    {
        id: 'ACH_013',
        category: 'BATTLE',
        name: 'Infinity',
        description: '单回合打出 ≥25 张牌',
        difficulty: 'S',
        trigger: { type: 'battle_stat', stat: 'cardsPlayedInTurn', valueGte: 25 },
        reward: { type: 'MODE', ref: 'InfinityLoop' }
    },
    {
        id: 'ACH_014',
        category: 'BATTLE',
        name: 'Focused',
        description: 'Defect 专注 ≥25',
        difficulty: 'A',
        trigger: { type: 'battle_stat', stat: 'focus', valueGte: 25 },
        reward: { type: 'RELIC', ref: 'FocusCore' }
    },
    {
        id: 'ACH_015',
        category: 'BATTLE',
        name: 'Neon',
        description: 'Defect 单回合充能 ≥9',
        difficulty: 'B',
        trigger: { type: 'battle_stat', stat: 'charges', valueGte: 9 },
        reward: { type: 'CARD', ref: 'NeonOverload' }
    },
    {
        id: 'ACH_016',
        category: 'BOSS',
        name: 'You Are Nothing',
        description: 'Turn1 击败 Boss',
        difficulty: 'S',
        trigger: { type: 'battle_flag', flag: 'turnOneBossKill' },
        reward: { type: 'RELIC', ref: 'Nothingness' }
    },
    {
        id: 'ACH_017',
        category: 'BOSS',
        name: 'Perfect',
        description: '不掉血击败 Boss',
        difficulty: 'A',
        trigger: { type: 'battle_flag', flag: 'noDamageTaken' },
        reward: { type: 'MODE', ref: 'PerfectRun' }
    },
    {
        id: 'ACH_018',
        category: 'BATTLE',
        name: 'Big Hitter',
        description: '单次伤害 ≥50',
        difficulty: 'C',
        trigger: { type: 'battle_stat', stat: 'singleHit', valueGte: 50 },
        reward: { type: 'CARD', ref: 'MegaStrike' }
    },
    {
        id: 'ACH_019',
        category: 'BOSS',
        name: 'The Guardian',
        description: '击败 Act1 终章 Boss（岩石守护者）',
        difficulty: 'B',
        trigger: { type: 'battle_end', bossId: 'Darius_BOSS' },
        reward: { type: 'CARD', ref: 'GuardianStrike' }
    },
    {
        id: 'ACH_020',
        category: 'BATTLE',
        name: 'Level Up!',
        description: '升级任意机制至 Lv10',
        difficulty: 'A',
        trigger: { type: 'mechanic_level', mechanic: 'any', valueGte: 10 },
        reward: { type: 'MODE', ref: 'ClanMastery' }
    },
    {
        id: 'ACH_021',
        category: 'BATTLE',
        name: '10K Chips',
        description: '单回合总伤害 ≥10000',
        difficulty: 'S',
        trigger: { type: 'battle_stat', stat: 'turnDamage', valueGte: 10000 },
        reward: { type: 'CARD', ref: 'ChipExplosion' }
    },
    {
        id: 'ACH_022',
        category: 'BATTLE',
        name: 'Retrograde',
        description: '任意牌型等级达到 Lv10',
        difficulty: 'A',
        trigger: { type: 'mechanic_level', mechanic: 'cardTier', valueGte: 10 },
        reward: { type: 'RELIC', ref: 'LevelBooster' }
    },
    {
        id: 'ACH_023',
        category: 'BATTLE',
        name: 'Lone Survivor',
        description: '仅剩领袖存活并获胜',
        difficulty: 'B',
        trigger: { type: 'battle_flag', flag: 'leaderOnly' },
        reward: { type: 'MODE', ref: 'SoloLeader' }
    },
    {
        id: 'ACH_024',
        category: 'SHOP',
        name: 'High Roller',
        description: '单次商店购买 3 件遗物',
        difficulty: 'C',
        trigger: { type: 'battle_stat', stat: 'relicsBoughtInShop', valueGte: 3 },
        reward: { type: 'REWARD', ref: 'GoldDrop' }
    },
    {
        id: 'ACH_025',
        category: 'BATTLE',
        name: 'Desecration',
        description: '摧毁所有防御陷阱',
        difficulty: 'B',
        trigger: { type: 'battle_flag', flag: 'trapsPurged' },
        reward: { type: 'CARD', ref: 'TrapBreaker' }
    },
    {
        id: 'ACH_038',
        category: 'META',
        name: 'Who Needs Relics?',
        description: '单遗物通关',
        difficulty: 'B',
        trigger: { type: 'battle_flag', flag: 'singleRelicRun' },
        reward: { type: 'MODE', ref: 'ReliclessBoost' }
    },
    {
        id: 'ACH_039',
        category: 'META',
        name: 'Speed Climber',
        description: '20 分钟内完成一局',
        difficulty: 'M',
        trigger: { type: 'stat', stat: 'runDurationMinutes', maxValue: 20 },
        reward: { type: 'MODE', ref: 'SpeedRun' }
    },
    {
        id: 'ACH_040',
        category: 'META',
        name: 'Common Sense',
        description: '使用全普通卡达成通关',
        difficulty: 'B',
        trigger: { type: 'battle_flag', flag: 'commonDeck' },
        reward: { type: 'MODE', ref: 'StandardDeckRun' }
    },
    {
        id: 'ACH_042',
        category: 'META',
        name: 'Eternal One',
        description: '解锁所有成就',
        difficulty: 'S',
        trigger: { type: 'meta', meta: 'allAchievements' },
        reward: { type: 'MODE', ref: 'GodMode' }
    },
    {
        id: 'ACH_057',
        category: 'MECH',
        name: 'Clan Master: Strength',
        description: '力量机制 Lv10',
        difficulty: 'A',
        trigger: { type: 'mechanic_level', mechanic: 'strength', level: 10 },
        reward: { type: 'CARD', ref: 'StrengthSurge' }
    },
    {
        id: 'ACH_058',
        category: 'MECH',
        name: 'Clan Master: Poison',
        description: '毒机制 Lv10',
        difficulty: 'A',
        trigger: { type: 'mechanic_level', mechanic: 'poison', level: 10 },
        reward: { type: 'RELIC', ref: 'PoisonClanRing' }
    },
    {
        id: 'ACH_059',
        category: 'MECH',
        name: 'Clan Master: Focus',
        description: '专注机制 Lv10',
        difficulty: 'A',
        trigger: { type: 'mechanic_level', mechanic: 'focus', level: 10 },
        reward: { type: 'MODE', ref: 'OrbMastery' }
    },
    {
        id: 'ACH_060',
        category: 'MECH',
        name: 'Clan Master: Wrath',
        description: 'Wrath 机制 Lv10',
        difficulty: 'S',
        trigger: { type: 'mechanic_level', mechanic: 'wrath', level: 10 },
        reward: { type: 'REWARD', ref: 'WrathCycle' }
    },
    {
        id: 'ACH_077',
        category: 'COLLECTION',
        name: 'Card Collector',
        description: '解锁 50 张卡',
        difficulty: 'B',
        trigger: { type: 'stat', stat: 'uniqueCards', valueGte: 50 },
        reward: { type: 'CARD', ref: 'CollectorBonus' }
    },
    {
        id: 'ACH_078',
        category: 'COLLECTION',
        name: 'Relic Hoarder',
        description: '持有 20 件遗物',
        difficulty: 'A',
        trigger: { type: 'stat', stat: 'relicsOwned', valueGte: 20 },
        reward: { type: 'REWARD', ref: 'ShopRelicBonus' }
    },
    {
        id: 'ACH_079',
        category: 'COLLECTION',
        name: 'All Cards',
        description: '解锁全部卡牌',
        difficulty: 'S',
        trigger: { type: 'meta', meta: 'cardCollectionComplete' },
        reward: { type: 'MODE', ref: 'GodDeck' }
    },
    {
        id: 'ACH_090',
        category: 'CHALLENGE',
        name: 'No Relics',
        description: '无遗物通关',
        difficulty: 'S',
        trigger: { type: 'battle_flag', flag: 'noRelicRun' },
        reward: { type: 'RELIC', ref: 'RelicFreeBoost' }
    },
    {
        id: 'ACH_091',
        category: 'CHALLENGE',
        name: 'Speed Climber++',
        description: '<10 分钟通关',
        difficulty: 'S',
        trigger: { type: 'stat', stat: 'runDurationMinutes', maxValue: 10 },
        reward: { type: 'MODE', ref: 'UltraSpeed' }
    },
    {
        id: 'ACH_092',
        category: 'CHALLENGE',
        name: 'Gold Stake',
        description: 'Ascension ≥20 全角色通关',
        difficulty: 'S',
        trigger: { type: 'meta', meta: 'ascensionRuns', valueGte: 20 },
        reward: { type: 'MODE', ref: 'GoldStake' }
    },
    {
        id: 'ACH_093',
        category: 'CHALLENGE',
        name: 'Joker Master',
        description: '所有 Joker 遗物达成金色效果',
        difficulty: 'S',
        trigger: { type: 'battle_flag', flag: 'jokerRelicsMax' },
        reward: { type: 'MODE', ref: 'JokerMode' }
    },
    {
        id: 'ACH_100',
        category: 'META',
        name: 'Merchant Enthusiast',
        description: '累计拜访商店 10 次',
        difficulty: 'B',
        trigger: { type: 'stat', stat: 'shopVisits', valueGte: 10 },
        reward: { type: 'RELIC', ref: 'LuckyCoin' }
    },
    {
        id: 'ACH_101',
        category: 'META',
        name: 'Explorer',
        description: '累计踏足 25 个节点',
        difficulty: 'B',
        trigger: { type: 'stat', stat: 'nodesVisited', valueGte: 25 },
        reward: { type: 'RELIC', ref: 'MapFragment' }
    },
    {
        id: 'ACH_102',
        category: 'META',
        name: 'Monster Slayer',
        description: '累计击杀 100 个普通敌人',
        difficulty: 'A',
        trigger: { type: 'stat', stat: 'monsterKills', valueGte: 100 },
        reward: { type: 'CARD', ref: 'KillingBlow' }
    },
    {
        id: 'ACH_103',
        category: 'HERO',
        name: 'Act II Victor',
        description: '通关 Act2',
        difficulty: 'B',
        trigger: { type: 'act_complete', act: 2 },
        reward: { type: 'MODE', ref: 'Act2Challenge' }
    },
    {
        id: 'ACH_104',
        category: 'HERO',
        name: 'Act III Victor',
        description: '通关 Act3',
        difficulty: 'A',
        trigger: { type: 'act_complete', act: 3 },
        reward: { type: 'MODE', ref: 'Act3Challenge' }
    },
    {
        id: 'ACH_105',
        category: 'META',
        name: 'Treasure Hunter',
        description: '累计开启 15 个宝箱',
        difficulty: 'C',
        trigger: { type: 'stat', stat: 'chestOpens', valueGte: 15 },
        reward: { type: 'RELIC', ref: 'Chestfinder' }
    },
    {
        id: 'ACH_109',
        category: 'META',
        name: 'Eventful Run',
        description: '单次跑走完所有事件',
        difficulty: 'B',
        trigger: { type: 'meta', meta: 'eventRunComplete' },
        reward: { type: 'MODE', ref: 'EventMode' }
    },
    {
        id: 'ACH_110',
        category: 'META',
        name: 'Ascender',
        description: 'Ascension ≥15 难度通关',
        difficulty: 'A',
        trigger: { type: 'meta', meta: 'ascensionClears', valueGte: 15 },
        reward: { type: 'MODE', ref: 'AscensionGlory' }
    }
];

export const ACHIEVEMENT_STORAGE_KEY = 'lots_achievements_v1';

