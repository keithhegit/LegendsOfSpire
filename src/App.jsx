import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { Sword, Shield, Zap, Skull, Heart, RefreshCw, AlertTriangle, Flame, XCircle, Activity, Map as MapIcon, Gift, Anchor, Coins, ShoppingBag, ChevronRight, Star, Play, Pause, Volume2, VolumeX, Landmark, Lock, RotateCcw, Save, ArrowRight, Layers, UserSquare, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { generateGridMap } from './data/gridMapLayout_v4'; // v4生成器（带死胡同检测）
import { CARD_DATABASE } from './data/cards'; // 卡牌数据
import { CHAMPION_POOL } from './data/champions';
import { ENEMY_POOL } from './data/enemies';
import { RELIC_DATABASE } from './data/relics';
import { scaleEnemyStats, shuffle } from './utils/gameLogic';
import IntroVideo from './components/IntroVideo';
import { DEFAULT_UNLOCKED_HEROES, PRIVILEGED_ACCOUNTS, ACT_UNLOCK_HEROES } from './data/constants';
import { getBaseCardId, getCardWithUpgrade, getUpgradeLevel } from './utils/cardUtils';
import GridMapView_v3 from './components/GridMapView_v3'; // 新版六边形地图视图（三选一机制）
import ChampionSelect from './components/ChampionSelect';
import BattleScene from './components/BattleScene';
import LoginView from './components/LoginView'; // 登录界面
import ToastContainer from './components/shared/Toast'; // 导入 ToastContainer
import CollectionSystem from './components/CollectionSystem';
import InventoryPanel from './components/InventoryPanel';
import AchievementPanel from './components/AchievementPanel';
import GMPanel from './components/GMPanel';
import { unlockAudio } from './utils/audioContext'; // 音频解锁工具
import { getHexNeighbors } from './utils/hexagonGrid'; // 六边形邻居帮助函数
import { authService } from './services/authService';
import { achievementTracker } from './utils/achievementTracker';
import AchievementUnlockBanner from './components/AchievementUnlockBanner';
import AchievementDevPanel from './components/AchievementDevPanel';
import { getAchievementFeatureFlag, setAchievementFeatureFlag } from './config/achievementConfig';
const CDN_VERSION = "13.1.1";
const CDN_URL = `https://ddragon.leagueoflegends.com/cdn/${CDN_VERSION}`;
const LOADING_URL = "https://ddragon.leagueoflegends.com/cdn/img/champion/loading";
const SPLASH_URL = "https://ddragon.leagueoflegends.com/cdn/img/champion/splash";
const ITEM_URL = `${CDN_URL}/img/item`;
const COLLECTION_ICON = `${ITEM_URL}/3802.png`;
const ACHIEVEMENT_ICON = `${ITEM_URL}/3190.png`;
const BACKPACK_ICON = `${ITEM_URL}/2052.png`;
const SPELL_URL = `${CDN_URL}/img/spell`;
const PASSIVE_URL = `${CDN_URL}/img/passive`;
const PROFILEICON_URL = `${CDN_URL}/img/profileicon`;
const VOICE_URL = "https://pub-e9a8f18bbe6141f28c8b86c4c54070e1.r2.dev/audio/spire/vo_assets_v1";

// 背景图配置 (按章节)
const ACT_BACKGROUNDS = {
    1: "https://i.17173cdn.com/2fhnvk/YWxqaGBf/cms3/JfEzktbjDoBxmzd.jpg", // 召唤师峡谷
    2: "https://images.17173cdn.com/2014/lol/2014/08/22/Shadow_Isles_10.jpg", // 暗影之地
    3: "https://pic.upmedia.mg/uploads/content/20220519/EV220519112427593030.webp"  // 虚空之地
};

// BGM URLs - 从constants导入
const BGM_MAP_URL = "https://pub-e9a8f18bbe6141f28c8b86c4c54070e1.r2.dev/bgm/spire/To-the-Infinity%20-Castle%20(1).mp3";
const BGM_BATTLE_URL = "https://pub-e9a8f18bbe6141f28c8b86c4c54070e1.r2.dev/bgm/spire/guimie-battle%20(1).mp3";

// 音效 - 使用新的R2存储地址
const SFX_BASE_URL = "https://pub-c98d5902eedf42f6a9765dfad981fd88.r2.dev/sfx";
const SFX_NEW_URL = "https://pub-4785f27b55bc484db8005d5841a1735a.r2.dev";
const SFX = {
    ATTACK: `${SFX_BASE_URL}/attack.mp3`,
    BLOCK: `${SFX_BASE_URL}/block.mp3`,
    DRAW: `${SFX_BASE_URL}/draw.mp3`,
    WIN: `${SFX_BASE_URL}/win.mp3`,
    // 增强音效 - 独立的攻击、格挡、受击音效
    ATTACK_SWING: `${SFX_NEW_URL}/attack_swing.mp3`,
    ATTACK_HIT: `${SFX_NEW_URL}/attack_hit.mp3`,
    BLOCK_SHIELD: `${SFX_NEW_URL}/block_shield.mp3`,
    HIT_TAKEN: `${SFX_NEW_URL}/hit_taken.mp3`,
    HEAL: `${SFX_NEW_URL}/heal-rpg.wav`
};

const STARTING_DECK_BASIC = ["Strike", "Strike", "Strike", "Strike", "Defend", "Defend", "Defend", "Defend"];
const SAVE_KEY = 'lots_save_v75';
const UNLOCK_STORAGE_KEY = 'lots_unlocks_v2';
const CARD_DELETE_COST = { COMMON: 50, UNCOMMON: 100, RARE: 200 };
const MAX_EXTRA_RELICS = 6;
const ACHIEVEMENT_MODE_KEY = 'lots_achievement_modes_v1';
const RELIC_ACT_GATES = {
    Cull: 1,
    DarkSeal: 1,
    QSS: 2,
    Executioner: 2,
    Nashor: 3
};
const GM_STORAGE_KEY = 'lots_gm_config_v1';
const DEFAULT_GM_CONFIG = {
    enabled: false,
    heroId: '',
    extraCards: [],
    forceTopCards: [],
    note: ''
};
const GM_ALLOWED_USERS = ['keithhe2026', 'momota17', 'momota167'];

const sanitizeGMConfig = (config = DEFAULT_GM_CONFIG) => {
    const normalizeList = (list) => {
        if (!Array.isArray(list)) return [];
        const seen = new Set();
        return list.filter(id => {
            if (!CARD_DATABASE[id] || seen.has(id)) return false;
            seen.add(id);
            return true;
        });
    };
    return {
        enabled: !!config.enabled,
        heroId: config.heroId || '',
        extraCards: normalizeList(config.extraCards),
        forceTopCards: normalizeList(config.forceTopCards),
        note: config.note || ''
    };
};

const isRelicAvailableInAct = (relicId, act = 1) => {
    const requiredAct = RELIC_ACT_GATES[relicId] ?? 1;
    return act >= requiredAct;
};
// ==========================================
// 2. 游戏数据库
// ==========================================

const RELIC_DATABASE = {
    // 基础被动遗物 (20个)
    "GarenPassive": { id: "GarenPassive", name: "坚韧", description: "战斗结束时恢复 6 HP", rarity: "PASSIVE", img: `${PASSIVE_URL}/Garen_Passive.png` },
    "DariusPassive": { id: "DariusPassive", name: "出血", description: "每次攻击时，给予敌人 1 层虚弱", rarity: "PASSIVE", img: `${PASSIVE_URL}/Garen_Passive.png` },
    "LuxPassive": { id: "LuxPassive", name: "光芒四射", description: "每回合开始时获得 1 点额外法力", rarity: "PASSIVE", img: `${PASSIVE_URL}/LuxIllumination.png` },
    "JinxPassive": { id: "JinxPassive", name: "爆发", description: "每回合初始手牌数量+1", rarity: "PASSIVE", img: `${PASSIVE_URL}/Jinx_Passive.png` },
    "YasuoPassive": { id: "YasuoPassive", name: "浪客之道", description: "攻击牌暴击几率+10%", rarity: "PASSIVE", img: `${PASSIVE_URL}/Yasuo_Passive.png` },
    "SonaPassive": { id: "SonaPassive", name: "能量弦", description: "每回合打出第三张卡时，获得 3 点临时护甲", rarity: "PASSIVE", img: `${PASSIVE_URL}/Sona_Passive.png` },
    "EkkoPassive": { id: "EkkoPassive", name: "Z型驱动共振", description: "每次打出消耗卡时，获得 1 点力量", rarity: "PASSIVE", img: `${PASSIVE_URL}/Ekko_P.png` },
    "SylasPassive": { id: "SylasPassive", name: "叛乱", description: "每次打出技能牌时，回复 3 点生命值", rarity: "PASSIVE", img: `${PASSIVE_URL}/SylasP.png` },
    "UrgotPassive": { id: "UrgotPassive", name: "回火", description: "战斗开始时获得 15 点临时护甲", rarity: "PASSIVE", img: `${PASSIVE_URL}/Urgot_Passive.png` },
    "ViktorPassive": { id: "ViktorPassive", name: "光荣进化", description: "回合开始时，50% 几率获得一张额外基础卡", rarity: "PASSIVE", img: `${PASSIVE_URL}/Viktor_Passive.png` },
    "RivenPassive": { id: "RivenPassive", name: "符文之刃", description: "每打出3张攻击牌，获得1点能量", rarity: "PASSIVE", img: `${PASSIVE_URL}/RivenRunicBlades.png` },
    "TwistedFatePassive": { id: "TwistedFatePassive", name: "灌铅骰子", description: "战斗胜利额外获得 15 金币", rarity: "PASSIVE", img: `${PASSIVE_URL}/CardMaster_SealFate.png` },
    "LeeSinPassive": { id: "LeeSinPassive", name: "疾风骤雨", description: "打出技能牌后，下一张攻击牌费用-1", rarity: "PASSIVE", img: `${PASSIVE_URL}/LeeSinPassive.png` },
    "VaynePassive": { id: "VaynePassive", name: "圣银弩箭", description: "对同一目标连续造成3次伤害时，额外造成10伤", rarity: "PASSIVE", img: `${PASSIVE_URL}/Vayne_SilveredBolts.png` },
    "TeemoPassive": { id: "TeemoPassive", name: "游击战", description: "回合开始时，随机给一名敌人施加 2 层虚弱", rarity: "PASSIVE", img: `${PASSIVE_URL}/Teemo_P.png` },
    "ZedPassive": { id: "ZedPassive", name: "影分身", description: "每回合第一张攻击牌会重复施放一次(50%伤害)", rarity: "PASSIVE", img: `${PASSIVE_URL}/Zed_Passive.png` },
    "NasusPassive": { id: "NasusPassive", name: "汲魂痛击", description: "每次用攻击牌击杀敌人，获得1点力量", rarity: "PASSIVE", img: `${PASSIVE_URL}/Nasus_Passive.png` },
    "IreliaPassive": { id: "IreliaPassive", name: "热诚", description: "每次击杀敌人，恢复 1 点能量并抽 1 张牌", rarity: "PASSIVE", img: `${PASSIVE_URL}/Irelia_Passive.png` },
    "ThreshPassive": { id: "ThreshPassive", name: "地狱诅咒", description: "敌人死亡增加 2 最大生命值", rarity: "PASSIVE", img: `${PASSIVE_URL}/Thresh_Passive.png` },
    "KatarinaPassive": { id: "KatarinaPassive", name: "贪婪", description: "每回合打出的每第 4 张攻击牌伤害翻倍", rarity: "PASSIVE", img: `${PASSIVE_URL}/Katarina_Passive.png` },

    // 通用遗物
    "DoransShield": { id: "DoransShield", name: "多兰之盾", price: 100, rarity: "COMMON", description: "战斗开始时获得 6 点护甲。", img: `${ITEM_URL}/1054.png`, onBattleStart: (state) => ({ ...state, block: state.block + 6 }) },
    "LongSword": { id: "LongSword", name: "长剑", price: 150, rarity: "COMMON", description: "战斗开始时获得 1 点力量。", img: `${ITEM_URL}/1036.png`, onBattleStart: (state) => ({ ...state, status: { ...state.status, strength: state.status.strength + 1 } }) },
    "RubyCrystal": { id: "RubyCrystal", name: "红水晶", price: 120, rarity: "COMMON", description: "最大生命值 +15。", img: `${ITEM_URL}/1028.png`, onPickup: (gameState) => ({ ...gameState, maxHp: gameState.maxHp + 15, currentHp: gameState.currentHp + 15 }) },
    "VampiricScepter": { id: "VampiricScepter", name: "吸血鬼节杖", price: 280, rarity: "UNCOMMON", description: "每次打出攻击牌恢复 1 点生命。", img: `${ITEM_URL}/1053.png` },
    "Sheen": { id: "Sheen", name: "耀光", price: 350, rarity: "UNCOMMON", description: "每回合打出的第一张攻击牌，伤害翻倍。", img: `${ITEM_URL}/3057.png` },
    "ZhonyasHourglass": { id: "ZhonyasHourglass", name: "中娅沙漏", price: 500, rarity: "RARE", description: "每场战斗限一次：免疫下一回合的敌人伤害。", img: `${ITEM_URL}/3157.png`, charges: 1 },
    "InfinityEdge": { id: "InfinityEdge", name: "无尽之刃", price: 700, rarity: "RARE", description: "所有攻击牌伤害+50%。", img: `${ITEM_URL}/3031.png` },
    "Redemption": { id: "Redemption", name: "救赎", price: 650, rarity: "RARE", description: "每回合开始时，治疗你和敌人 5 点生命。", img: `${ITEM_URL}/3107.png`, onTurnStart: (pState, eState) => ({ pState: { ...pState, hp: Math.min(pState.maxHp, pState.hp + 5) }, eState: { ...eState, hp: eState.hp + 5 } }) },
    "BrambleVest": { id: "BrambleVest", name: "荆棘背心", price: 200, rarity: "UNCOMMON", description: "每次被攻击时，对攻击者造成 3 点伤害。", img: `${ITEM_URL}/3076.png` },
    "GuardianAngel": { id: "GuardianAngel", name: "守护天使", price: 750, rarity: "RARE", description: "死亡时，恢复 40 点生命值。每场战斗限一次。", img: `${ITEM_URL}/3026.png`, charges: 1 },

    // 章节专属遗物 (Act Specific)
    "Cull": { id: "Cull", name: "萃取", price: 400, rarity: "RARE", description: "Act 1 限定：击杀 10 个敌人后获得 300 金币。", img: `${ITEM_URL}/1083.png` },
    "DarkSeal": { id: "DarkSeal", name: "黑暗封印", price: 300, rarity: "RARE", description: "Act 1 限定：每次战斗胜利 +2 HP上限。", img: `${ITEM_URL}/1082.png` },
    "QSS": { id: "QSS", name: "水银饰带", price: 500, rarity: "RARE", description: "Act 2 限定：战斗开始时获得 1 层人工制品 (抵挡Debuff)。", img: `${ITEM_URL}/3140.png` },
    "Executioner": { id: "Executioner", name: "死刑宣告", price: 450, rarity: "RARE", description: "Act 2 限定：攻击施加重伤 (敌人无法回复HP)。", img: `${ITEM_URL}/3123.png` },
    "Nashor": { id: "Nashor", name: "纳什之牙", price: 800, rarity: "RARE", description: "Act 3 限定：每回合打出的第 3 张攻击牌伤害翻倍。", img: `${ITEM_URL}/3115.png` }
};

// 扩展敌人池：加入暗影岛和虚空生物
const ENEMY_POOL = {
    // Act 1: Rift
    "Katarina": { id: "Katarina", name: "卡特琳娜", title: "不祥之刃", maxHp: 35, act: 1, difficultyRank: 1, img: `${LOADING_URL}/Katarina_0.jpg`, avatar: `${CDN_URL}/img/champion/Katarina.png`, actions: [{ type: 'ATTACK', value: 5, count: 2, name: "瞬步连击" }, { type: 'DEBUFF', value: 0, name: "死亡莲华", effect: "VULNERABLE", effectValue: 1 }] },
    "Talon": { id: "Talon", name: "泰隆", title: "刀锋之影", maxHp: 40, act: 1, difficultyRank: 1, img: `${LOADING_URL}/Talon_0.jpg`, avatar: `${CDN_URL}/img/champion/Talon.png`, actions: [{ type: 'ATTACK', value: 9, name: "诺克萨斯外交" }, { type: 'BUFF', value: 0, name: "翻墙跑路", effect: "BLOCK", effectValue: 8 }] },
    "Lucian": { id: "Lucian", name: "卢锡安", title: "圣枪游侠", maxHp: 55, act: 1, difficultyRank: 2, img: `${LOADING_URL}/Lucian_0.jpg`, avatar: `${CDN_URL}/img/champion/Lucian.png`, actions: [{ type: 'ATTACK', value: 6, count: 2, name: "圣光银弹" }] },
    "Darius_BOSS": { id: "Darius_BOSS", name: "德莱厄斯", title: "诺克萨斯之手", maxHp: 120, act: 1, difficultyRank: 99, img: `${LOADING_URL}/Darius_0.jpg`, avatar: `${CDN_URL}/img/champion/Darius.png`, actions: [{ type: 'ATTACK', value: 12, name: "大杀四方" }, { type: 'DEBUFF', value: 0, name: "致残打击", effect: "WEAK", effectValue: 2 }, { type: 'ATTACK', value: 20, name: "断头台！" }] },

    // Act 2: Shadow Isles
    "Hecarim": { id: "Hecarim", name: "赫卡里姆", title: "战争之影", maxHp: 80, act: 2, difficultyRank: 1, img: `${LOADING_URL}/Hecarim_0.jpg`, avatar: `${CDN_URL}/img/champion/Hecarim.png`, actions: [{ type: 'ATTACK', value: 12, name: "暴走" }, { type: 'BUFF', value: 0, name: "恐惧之灵", effect: "STRENGTH", effectValue: 2 }] },
    "Thresh": { id: "Thresh", name: "锤石", title: "魂锁典狱长", maxHp: 90, act: 2, difficultyRank: 2, img: `${LOADING_URL}/Thresh_0.jpg`, avatar: `${CDN_URL}/img/champion/Thresh.png`, actions: [{ type: 'DEBUFF', value: 0, name: "死亡判决", effect: "VULNERABLE", effectValue: 2 }, { type: 'ATTACK', value: 8, name: "厄运钟摆" }] },
    "Karthus": { id: "Karthus", name: "卡尔萨斯", title: "死亡颂唱者", maxHp: 70, act: 2, difficultyRank: 2, img: `${LOADING_URL}/Karthus_0.jpg`, avatar: `${CDN_URL}/img/champion/Karthus.png`, actions: [{ type: 'ATTACK', value: 4, count: 3, name: "荒芜" }, { type: 'ATTACK', value: 25, name: "安魂曲" }] },
    "Viego_BOSS": { id: "Viego_BOSS", name: "佛耶戈", title: "破败之王", maxHp: 180, act: 2, difficultyRank: 99, img: `${LOADING_URL}/Viego_0.jpg`, avatar: `${CDN_URL}/img/champion/Viego.png`, actions: [{ type: 'ATTACK', value: 15, count: 2, name: "破败王剑" }, { type: 'BUFF', value: 0, name: "茫茫焦土", effect: "BLOCK", effectValue: 20 }] },

    // Act 3: The Void
    "KhaZix": { id: "KhaZix", name: "卡兹克", title: "虚空掠夺者", maxHp: 100, act: 3, difficultyRank: 1, img: `${LOADING_URL}/Khazix_0.jpg`, avatar: `${CDN_URL}/img/champion/Khazix.png`, actions: [{ type: 'ATTACK', value: 25, name: "品尝恐惧" }] },
    "VelKoz": { id: "VelKoz", name: "维克兹", title: "虚空之眼", maxHp: 110, act: 3, difficultyRank: 2, img: `${LOADING_URL}/Velkoz_0.jpg`, avatar: `${CDN_URL}/img/champion/Velkoz.png`, actions: [{ type: 'ATTACK', value: 5, count: 4, name: "生命形态瓦解" }] },
    "BelVeth_BOSS": { id: "BelVeth_BOSS", name: "卑尔维斯", title: "虚空女皇", maxHp: 300, act: 3, difficultyRank: 99, img: `${LOADING_URL}/Belveth_0.jpg`, avatar: `${CDN_URL}/img/champion/Belveth.png`, actions: [{ type: 'ATTACK', value: 8, count: 4, name: "万载豪筵" }, { type: 'DEBUFF', value: 0, name: "虚空面容", effect: "WEAK", effectValue: 99 }] }
};

// --- Utils ---
const shuffle = (array) => {
    const newArr = [...array];
    for (let i = newArr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
    }
    return newArr;
};
const scaleEnemyStats = (baseStats, floorIndex, act) => {
    const difficultyMultiplier = 1 + 0.1 * floorIndex;
    const actMultiplier = act;
    const scaledHp = Math.floor(baseStats.maxHp * difficultyMultiplier * actMultiplier);
    const scaledActions = baseStats.actions.map(action => {
        let scaledAction = { ...action };
        const isAttack = scaledAction.type === 'ATTACK' || scaledAction.actionType === 'Attack';
        if (isAttack) {
            const baseDmg = scaledAction.type === 'ATTACK' ? scaledAction.value : scaledAction.dmgValue;
            // 降低攻击力50%：原来 floorIndex * 2，现在改为 floorIndex * 1，并且整体降低50%
            const scaledDmg = Math.floor((baseDmg + floorIndex * 1 + (act - 1) * 3) * 0.5);
            if (scaledAction.type === 'ATTACK') scaledAction.value = scaledDmg;
            if (scaledAction.actionType === 'Attack') scaledAction.dmgValue = scaledDmg;
        }
        if (action.effect && ['WEAK', 'VULNERABLE', 'STRENGTH'].includes(action.effect)) {
            scaledAction.effectValue = action.effectValue + Math.floor(floorIndex / 5);
        }
        return scaledAction;
    });
    return { maxHp: scaledHp, actions: scaledActions };
};

const generateMap = (usedEnemyIds, act) => {
    const map = [];
    const actEnemyIds = Object.keys(ENEMY_POOL).filter(id => ENEMY_POOL[id].act === act && ENEMY_POOL[id].difficultyRank < 99);

    const getRandomEnemy = () => {
        const pool = actEnemyIds.length > 0 ? actEnemyIds : Object.keys(ENEMY_POOL).filter(id => ENEMY_POOL[id].difficultyRank < 99);
        return pool[Math.floor(Math.random() * pool.length)];
    };

    const createNode = (id, type) => {
        const node = { id, type, status: 'LOCKED', next: [] };
        if (type === 'BATTLE') node.enemyId = getRandomEnemy();
        return node;
    };

    map.push([{ ...createNode('1-0', 'BATTLE'), status: 'AVAILABLE', next: ['2-0', '2-1'] }]);
    for (let i = 2; i <= 8; i++) {
        // Rest只在第8层（Boss前）出现，且只有10%概率
        const restOptions = i === 8 ? (Math.random() < 0.1 ? ['REST'] : []) : [];
        const nodeType1Pool = i === 8
            ? [...restOptions, 'BATTLE', 'SHOP', 'EVENT', 'CHEST'].filter(Boolean)
            : ['BATTLE', 'SHOP', 'EVENT', 'CHEST'];
        const nodeType2Pool = i === 8
            ? [...restOptions, 'BATTLE', 'EVENT', 'CHEST', 'SHOP'].filter(Boolean)
            : ['BATTLE', 'EVENT', 'CHEST', 'SHOP'];
        const nodeType1 = shuffle(nodeType1Pool)[0];
        const nodeType2 = shuffle(nodeType2Pool)[0];
        const nodes = [createNode(`${i}-0`, nodeType1), createNode(`${i}-1`, nodeType2)];
        const nextFloorIndex = i + 1;
        if (nextFloorIndex <= 9) {
            nodes[0].next = [`${nextFloorIndex}-0`, `${nextFloorIndex}-1`];
            nodes[1].next = [`${nextFloorIndex}-0`, `${nextFloorIndex}-1`];
        }
        if (i === 8) {
            nodes[0].next = [`9-0`];
            nodes[1].next = [`9-0`];
        }
        map.push(nodes);
    }
    // 第9层固定为REST（Boss前）
    map.push([{ ...createNode('9-0', 'REST'), next: ['10-0'] }]);

    let bossId = "Darius_BOSS";
    if (act === 2) bossId = "Viego_BOSS";
    if (act === 3) bossId = "BelVeth_BOSS";

    map.push([{ id: '10-0', type: 'BOSS', enemyId: bossId, status: 'LOCKED', next: [] }]);

    return { map };
};

// --- Components ---

const RelicTooltip = ({ relic, children }) => {
    if (!relic) return children;
    return (
        <div className="relative group">
            {children}
            <div className="absolute top-full left-0 mt-2 w-56 bg-black/95 border border-[#C8AA6E] p-3 z-[110] hidden group-hover:block text-left pointer-events-none rounded-lg shadow-xl">
                <div className="font-bold text-[#F0E6D2] mb-1">{relic.name}</div>
                <div className="text-xs text-[#A09B8C] leading-relaxed whitespace-normal">{relic.description}</div>
                {relic.charges !== undefined && <div className="text-xs text-red-400 mt-1">剩余次数: {relic.charges}</div>}
            </div>
        </div>
    );
};

const AudioPlayer = ({ src }) => {
    const audioRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(true);
    const [volume, setVolume] = useState(0.3);
    useEffect(() => {
        if (audioRef.current && src) {
            audioRef.current.volume = volume;
            audioRef.current.load(); // 重新加载音频
            const p = audioRef.current.play();
            if (p !== undefined) {
                p.then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
            }
        }
    }, [src, volume]);
    const togglePlay = () => {
        if (isPlaying) {
            audioRef.current?.pause();
            setIsPlaying(false);
        } else {
            audioRef.current?.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
        }
    };
    return (
        <div className="fixed top-4 right-4 z-[100] flex items-center gap-2 bg-black/50 p-2 rounded-full border border-[#C8AA6E]/50 hover:bg-black/80 transition-all">
            <audio ref={audioRef} src={src} loop />
            <button onClick={togglePlay} className="text-[#C8AA6E] hover:text-white">{isPlaying ? <Pause size={16} /> : <Play size={16} />}</button>
            <button onClick={() => { const v = volume === 0 ? 0.3 : 0; setVolume(v); if (audioRef.current) audioRef.current.volume = v; }} className="text-[#C8AA6E] hover:text-white">{volume === 0 ? <VolumeX size={16} /> : <Volume2 size={16} />}</button>
        </div>
    );
};

const Card = ({ cardId, index, totalCards, canPlay, onPlay }) => {
    const card = getCardWithUpgrade(cardId);
    if (!card) {
        console.warn(`Card not found: ${cardId}`);
        return null;
    }
    const { baseId, upgradeLevel } = card;
    const isUpgraded = upgradeLevel > 0;
    const overlap = totalCards > 5 ? -50 : 10;
    const rotation = (index - (totalCards - 1) / 2) * 3;
    const yOffset = Math.abs(index - (totalCards - 1) / 2) * 6;

    return (
        <motion.div
            layout
            initial={{ y: 100, opacity: 0, scale: 0.5 }}
            animate={{ y: yOffset, opacity: 1, scale: 1, rotate: rotation }}
            exit={{ y: -100, opacity: 0, scale: 0.5 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            style={{
                marginLeft: index === 0 ? 0 : `${overlap}px`,
                zIndex: index,
                transformOrigin: "bottom center",
                position: 'relative'
            }}
            drag={canPlay ? "y" : false}
            dragConstraints={{ top: -300, bottom: 0 }}
            dragSnapToOrigin={true}
            onDragEnd={(event, info) => { if (info.offset.y < -150 && canPlay) { onPlay(index); } }}
            whileHover={{ scale: 1.2, y: -80, zIndex: 100, rotate: 0 }}
            className={`w-40 h-60 bg-[#1E2328] border-2 rounded-lg flex flex-col items-center overflow-hidden shadow-2xl ${canPlay ? 'border-[#C8AA6E] cursor-grab active:cursor-grabbing' : 'border-slate-700 opacity-60 cursor-not-allowed'}`}
        >
            <div className="w-full h-36 bg-black overflow-hidden relative pointer-events-none">
                                <img
                                    src={card.img || 'https://ddragon.leagueoflegends.com/cdn/13.1.1/img/profileicon/29.png'}
                                    className="w-full h-full object-cover opacity-90"
                                    alt={card.name || 'card'}
                                />
                <div className="absolute top-1 left-1 w-6 h-6 bg-[#091428] rounded-full border border-[#C8AA6E] flex items-center justify-center text-[#C8AA6E] font-bold text-sm shadow-md">{card.cost}</div>
            </div>
            <div className="flex-1 p-2 text-center flex flex-col w-full pointer-events-none bg-[#1E2328]">
                <div className="text-xs font-bold text-[#F0E6D2] mb-1 line-clamp-1">{card.name}</div>
                <div className="text-[9px] text-[#A09B8C] leading-tight font-medium line-clamp-2">{card.description}</div>
                <div className="mt-auto text-[8px] text-slate-500 uppercase font-bold tracking-wider">{card.type}</div>
            </div>
        </motion.div>
    );
};

const MapView = ({ mapData, onNodeSelect, act }) => {
    const getMapIcon = (node) => {
        if (node.type === 'BOSS') {
            if (act === 1) return `${CDN_URL}/img/champion/Darius.png`;
            if (act === 2) return `${CDN_URL}/img/champion/Viego.png`;
            if (act === 3) return `${CDN_URL}/img/champion/Belveth.png`;
        }
        if (node.type === 'REST') return `${ITEM_URL}/2003.png`;
        if (node.type === 'SHOP') return `${ITEM_URL}/3400.png`;
        if (node.type === 'EVENT') return `${ITEM_URL}/3340.png`;
        if (node.type === 'CHEST') return `${PROFILEICON_URL}/2065.png`;
        if (node.type === 'BATTLE' && node.enemyId) return ENEMY_POOL[node.enemyId]?.avatar || `${PROFILEICON_URL}/29.png`;
        return null;
    };
    const getTypeStyle = (type) => {
        switch (type) {
            case 'BOSS': return "text-red-500 border-red-600/50 shadow-[0_0_10px_red]";
            case 'REST': return "text-blue-400 border-blue-500/50";
            case 'SHOP': return "text-yellow-400 border-yellow-500/50";
            case 'EVENT': return "text-purple-400 border-purple-500/50";
            case 'CHEST': return "text-green-400 border-green-500/50";
            case 'BATTLE': return "text-slate-200 border-slate-500/50";
            default: return "text-slate-400";
        }
    }
    return (
        <div className="flex flex-col items-center h-full w-full relative overflow-hidden bg-[#0c0c12]">
            <div className="absolute inset-0 z-0"><div className="absolute inset-0 bg-black/60 z-10" /><div className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-50" style={{ backgroundImage: `url('${ACT_BACKGROUNDS[act] || ACT_BACKGROUNDS[1]}')` }}></div></div>
            <div className="relative z-20 w-full h-full flex flex-col-reverse items-center overflow-y-auto py-20 gap-16 hide-scrollbar">
                <div className="text-[#C8AA6E] font-serif text-2xl mb-8">第 {act} 章</div>
                {mapData.map((floor, floorIndex) => (
                    <div key={floorIndex} className="flex justify-center gap-24 relative group">
                        {floor.map((node, nodeIndex) => {
                            const isAvailable = node.status === 'AVAILABLE';
                            const isCompleted = node.status === 'COMPLETED';
                            const isLocked = node.status === 'LOCKED';
                            const iconUrl = getMapIcon(node);
                            const labelText = node.type === 'BATTLE' ? (ENEMY_POOL[node.enemyId]?.name || 'Unknown') : node.type;
                            return (
                                <div key={node.id} className="relative flex flex-col items-center">
                                    {node.next && node.next.length > 0 && (
                                        <div className="absolute bottom-full left-1/2 w-full h-16 pointer-events-none">
                                            <svg width="200" height="64" style={{ overflow: 'visible', position: 'absolute', bottom: 0, left: '-100px' }}>
                                                {node.next.map(nextId => {
                                                    const nextNodeIndex = parseInt(nextId.split('-')[1]);
                                                    const dx = (nextNodeIndex - nodeIndex) * 50 + 100;
                                                    return <line key={nextId} x1="100" y1="64" x2={dx} y2="0" stroke={isLocked ? "#334155" : "#C8AA6E"} strokeWidth="2" opacity="0.5" />;
                                                })}
                                            </svg>
                                        </div>
                                    )}
                                    <button onClick={() => isAvailable && onNodeSelect(node)} disabled={!isAvailable} className={`w-24 h-24 rounded-full border-2 flex items-center justify-center transition-all duration-300 relative overflow-hidden bg-black ${isAvailable ? `border-[#C8AA6E] scale-110 shadow-[0_0_30px_#C8AA6E] cursor-pointer hover:scale-125 ring-2 ring-[#C8AA6E]/50` : 'border-slate-600'} ${isCompleted ? 'opacity-40 grayscale border-slate-500' : ''} ${isLocked ? 'opacity-20 blur-[1px]' : ''}`}>
                                        {iconUrl && <img src={iconUrl} className="w-full h-full object-cover" alt={node.type} />}
                                        {isCompleted && <div className="absolute inset-0 bg-black/60 flex items-center justify-center"><span className="text-[#C8AA6E] text-4xl font-bold">✓</span></div>}
                                    </button>
                                    <div className={`absolute -bottom-8 px-3 py-1 rounded-full border bg-black/90 backdrop-blur-md whitespace-nowrap font-bold text-xs tracking-widest uppercase transition-all ${getTypeStyle(node.type)} ${isAvailable ? 'scale-110 shadow-lg z-30' : 'opacity-70 scale-90'}`}>{labelText}</div>
                                </div>
                            )
                        })}
                    </div>
                ))}
            </div>
        </div>
    )
};

const ShopView = ({ onLeave, onBuyCard, onBuyRelic, gold, deck, relics, championName, act }) => {
    const cardStock = useMemo(() => shuffle(Object.values(CARD_DATABASE).filter(c => c.rarity !== 'BASIC' && (c.hero === 'Neutral' || c.hero === championName))).slice(0, 5), [championName]);
    const relicStock = useMemo(() => Object.values(RELIC_DATABASE)
        .filter(r => r && r.rarity !== 'PASSIVE' && !relics.includes(r.id) && isRelicAvailableInAct(r.id, act))
        .slice(0, 3), [relics, act]);
    const [purchasedItems, setPurchasedItems] = useState([]);
    const handleBuy = (item, type) => { if (gold >= item.price && !purchasedItems.includes(item.id)) { setPurchasedItems([...purchasedItems, item.id]); if (type === 'CARD') onBuyCard(item); if (type === 'RELIC') onBuyRelic(item); } };
    return (
        <div className="absolute inset-0 z-50 bg-[#0a0a0f] flex flex-col items-center justify-center bg-[url('https://ddragon.leagueoflegends.com/cdn/img/champion/splash/TwistedFate_0.jpg')] bg-cover bg-center">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm"></div>
            <div className="relative z-10 w-full max-w-6xl px-10 py-6 flex flex-col h-full">
                <div className="flex justify-between items-center mb-8 border-b border-[#C8AA6E] pb-4">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-full border-2 border-[#C8AA6E] overflow-hidden bg-black"><img src={`${ITEM_URL}/3400.png`} className="w-full h-full object-cover" /></div>
                        <div><h2 className="text-3xl font-bold text-[#C8AA6E]">黑市商人</h2><p className="text-[#A09B8C] italic">"只要给钱，什么都卖。"</p></div>
                    </div>
                    <div className="flex items-center gap-2 text-4xl font-bold text-yellow-400 bg-black/50 px-6 py-2 rounded-lg border border-yellow-600"><Coins size={32} /> {gold}</div>
                </div>
                <div className="grid grid-cols-2 gap-12 flex-1 overflow-y-auto">
                    <div>
                        <h3 className="text-xl text-[#F0E6D2] mb-4 uppercase tracking-widest border-l-4 border-blue-500 pl-3">技能卷轴</h3>
                        <div className="flex flex-wrap gap-4">
                            {cardStock.map(card => {
                                const isBought = purchasedItems.includes(card.id);
                                return (
                                    <div key={card.id} onClick={() => !isBought && handleBuy(card, 'CARD')} className={`w-32 h-48 relative group transition-all ${isBought ? 'opacity-20 grayscale pointer-events-none' : 'hover:scale-105 cursor-pointer'}`}>
                                        <img
                                            src={card.img || 'https://ddragon.leagueoflegends.com/cdn/13.1.1/img/profileicon/29.png'}
                                            className="w-full h-full object-cover rounded border border-slate-600"
                                            alt={card.name || 'card'}
                                        />
                                        <div className="absolute bottom-0 left-0 right-0 bg-black/90 text-center py-1 text-xs font-bold text-[#C8AA6E] border-t border-[#C8AA6E]">{card.price} G</div>
                                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-40 bg-black border border-[#C8AA6E] p-2 z-50 hidden group-hover:block text-center pointer-events-none text-xs text-white"><div className="font-bold mb-1">{card.name}</div>{card.description}</div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                    <div>
                        <h3 className="text-xl text-[#F0E6D2] mb-4 uppercase tracking-widest border-l-4 border-purple-500 pl-3">海克斯装备</h3>
                        <div className="flex flex-wrap gap-6">
                            {relicStock.map(relic => {
                                if (!relic) return null;
                                const isBought = purchasedItems.includes(relic.id);
                                return (
                                    <div key={relic.id} onClick={() => !isBought && handleBuy(relic, 'RELIC')} className={`w-20 h-20 relative group transition-all ${isBought ? 'opacity-20 grayscale pointer-events-none' : 'hover:scale-110 cursor-pointer'}`}>
                                        <img src={relic.img || 'https://ddragon.leagueoflegends.com/cdn/13.1.1/img/profileicon/29.png'} className="w-full h-full object-cover rounded-lg border-2 border-[#C8AA6E] shadow-[0_0_10px_#C8AA6E]" alt={relic.name || 'relic'} />
                                        <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-black/80 px-2 rounded text-yellow-400 font-bold text-sm whitespace-nowrap">{relic.price} G</div>
                                        <RelicTooltip relic={relic}><div className="w-full h-full absolute inset-0"></div></RelicTooltip>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>
                <div className="mt-auto flex justify-end pt-6 border-t border-[#C8AA6E]/30"><button onClick={onLeave} className="px-8 py-3 bg-[#C8AA6E] hover:bg-[#F0E6D2] text-black font-bold uppercase tracking-widest rounded transition-colors flex items-center gap-2">离开 <ChevronRight /></button></div>
            </div>
        </div>
    )
}

const ChestView = ({ onLeave, onRelicReward, relics, act }) => {
    // 根据当前章节过滤遗物：ACT1只能获得通用遗物，ACT2可以获得ACT1+ACT2，ACT3可以获得所有
    const availableRelics = Object.values(RELIC_DATABASE).filter(r => r && r.rarity !== 'PASSIVE' && !relics.includes(r.id) && isRelicAvailableInAct(r.id, act));
    const rewards = useMemo(() => shuffle(availableRelics).slice(0, 3), [relics, act]);
    const [rewardChosen, setRewardChosen] = useState(false);
    const handleChoose = (relic) => { if (rewardChosen) return; setRewardChosen(true); onRelicReward(relic); };
    return (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/90">
            <div className="relative z-10 max-w-4xl bg-[#091428]/90 border-2 border-[#C8AA6E] p-10 text-center rounded-xl shadow-[0_0_50px_#C8AA6E]">
                <div className="w-24 h-24 mx-auto mb-6 rounded-full border-4 border-[#C8AA6E] overflow-hidden bg-black flex items-center justify-center"><img src={`${ITEM_URL}/3400.png`} className="w-full h-full object-cover" /></div>
                <h2 className="text-4xl font-bold text-[#C8AA6E] mb-6">海克斯宝箱</h2>
                <p className="text-[#F0E6D2] text-lg mb-8">打开宝箱，选择一件强大的装备来武装自己。</p>
                <div className="flex justify-center gap-8">
                    {rewards.filter(Boolean).map((relic) => (
                        <div key={relic.id} onClick={() => handleChoose(relic)} className={`w-36 relative group transition-all p-4 rounded-lg border-2 ${rewardChosen ? 'opacity-40 pointer-events-none' : 'hover:scale-110 cursor-pointer border-[#C8AA6E] shadow-xl hover:shadow-[0_0_20px_#C8AA6E]'}`}>
                            <img src={relic.img || 'https://ddragon.leagueoflegends.com/cdn/13.1.1/img/profileicon/29.png'} className="w-full h-auto object-cover rounded-lg" alt={relic.name || 'relic'} />
                            <div className="font-bold text-[#F0E6D2] mt-3">{relic.name}</div>
                            <div className="text-xs text-[#A09B8C] mt-1">{relic.description}</div>
                            {rewardChosen && <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-3xl font-bold text-green-400">已选</div>}
                        </div>
                    ))}
                </div>
                <button onClick={onLeave} className="mt-8 px-8 py-3 border border-slate-600 text-slate-400 hover:text-white hover:border-white rounded uppercase tracking-widest" disabled={!rewardChosen}>关闭宝箱</button>
            </div>
        </div>
    );
};

const EventView = ({ onLeave, onReward }) => (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black">
        <div className="absolute inset-0 bg-[url('https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Ryze_0.jpg')] bg-cover bg-center opacity-40"></div>
        <div className="relative z-10 max-w-2xl bg-[#091428]/90 border-2 border-[#C8AA6E] p-10 text-center rounded-xl shadow-[0_0_50px_#0AC8B9]">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full border-4 border-[#C8AA6E] overflow-hidden"><img src={`${ITEM_URL}/3340.png`} className="w-full h-full object-cover" /></div>
            <h2 className="text-4xl font-bold text-[#C8AA6E] mb-6">神秘信号</h2>
            <p className="text-[#F0E6D2] text-lg mb-8 leading-relaxed">你在草丛中发现了一个遗落的守卫眼，旁边似乎还散落着一些物资...</p>
            <div className="grid grid-cols-1 gap-4">
                <button onClick={() => { onReward({ type: 'BUFF', stat: 'strength', value: 2 }); }} className="p-4 bg-slate-800 hover:bg-red-900/50 border border-slate-600 hover:border-red-500 rounded transition-all flex items-center gap-4 group text-left"><div className="p-3 bg-black rounded border border-slate-700 group-hover:border-red-500"><Sword className="text-red-500" /></div><div><div className="font-bold text-[#F0E6D2]">训练</div><div className="text-sm text-slate-400">永久获得 <span className="text-red-400">+2 力量</span></div></div></button>
                <button onClick={() => { onReward({ type: 'RELIC_RANDOM' }); }} className="p-4 bg-slate-800 hover:bg-purple-900/50 border border-slate-600 hover:border-purple-500 rounded transition-all flex items-center gap-4 group text-left"><div className="p-3 bg-black rounded border border-slate-700 group-hover:border-purple-500"><Gift className="text-purple-500" /></div><div><div className="font-bold text-[#F0E6D2]">搜寻</div><div className="text-sm text-slate-400">获得一件 <span className="text-purple-400">随机装备</span></div></div></button>
            </div>
        </div>
    </div>
);

const RewardView = ({ onSkip, onCardSelect, goldReward, championName }) => {
    const rewards = useMemo(() => { const all = Object.values(CARD_DATABASE).filter(c => c.rarity !== 'BASIC' && c.rarity !== 'PASSIVE' && (c.hero === 'Neutral' || c.hero === championName)); return shuffle(all).slice(0, 3); }, [championName]);
    return (
        <div className="absolute inset-0 z-50 bg-black/90 flex items-center justify-center">
            <div className="max-w-4xl bg-[#091428]/90 border-2 border-[#C8AA6E] p-10 text-center rounded-xl shadow-[0_0_50px_#C8AA6E]">
                <h2 className="text-4xl font-bold text-[#C8AA6E] mb-6">奖励</h2>
                <div className="text-2xl text-yellow-400 mb-8 flex items-center justify-center gap-2">
                    <Coins size={28} className="text-yellow-400" />
                    <span>金币 +{goldReward}</span>
                </div>
                <div className="flex justify-center gap-6 my-8">
                    {rewards.map(c => (
                        <div
                            key={c.id}
                            onClick={() => onCardSelect(c.id)}
                            className="w-48 h-64 bg-[#1E2328] border-2 border-[#C8AA6E] rounded-lg overflow-hidden cursor-pointer hover:scale-110 hover:shadow-[0_0_20px_#C8AA6E] transition-all group relative"
                        >
                            <div className="w-full h-40 bg-black overflow-hidden relative">
                                <img src={c.img} className="w-full h-full object-cover opacity-90 group-hover:opacity-100" alt={c.name} />
                                <div className="absolute top-2 left-2 w-8 h-8 bg-[#091428] rounded-full border border-[#C8AA6E] flex items-center justify-center text-[#C8AA6E] font-bold text-sm">{c.cost}</div>
                            </div>
                            <div className="p-3 flex flex-col h-24">
                                <div className="text-sm font-bold text-[#F0E6D2] mb-1 line-clamp-1">{c.name}</div>
                                <div className="text-[10px] text-[#A09B8C] leading-tight line-clamp-2">{c.description}</div>
                                <div className="mt-auto text-[8px] text-slate-500 uppercase font-bold">{c.type}</div>
                            </div>
                        </div>
                    ))}
                </div>
                <button onClick={onSkip} className="mt-6 px-8 py-3 border border-slate-600 text-slate-400 hover:text-white hover:border-white rounded uppercase tracking-widest transition-all">跳过</button>
            </div>
        </div>
    );
};

const RestView = ({ onRest }) => (
    <div className="absolute inset-0 z-50 bg-[url('https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Soraka_0.jpg')] bg-cover bg-center flex items-center justify-center">
        <div className="absolute inset-0 bg-black/70"></div>
        <div className="relative z-10 flex flex-col gap-8 text-center items-center">
            <div className="w-24 h-24 rounded-full border-4 border-[#0AC8B9] overflow-hidden bg-black shadow-[0_0_50px_#0AC8B9]"><img src={`${ITEM_URL}/2003.png`} className="w-full h-full object-cover" /></div>
            <h2 className="text-5xl font-serif text-[#0AC8B9] drop-shadow-[0_0_10px_#0AC8B9]">泉水憩息</h2>
            <button onClick={onRest} className="group w-64 h-80 bg-slate-900/80 border-2 border-[#0AC8B9] rounded-xl flex flex-col items-center justify-center hover:bg-[#0AC8B9]/20 transition-all cursor-pointer">
                <Heart size={64} className="text-red-500 mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="text-2xl font-bold text-white mb-2">回复</h3>
                <p className="text-[#0AC8B9]">回复 30% 生命值</p>
            </button>
        </div>
    </div>
);

// --- 主组件 ---

export default function LegendsOfTheSpire() {
    const [view, setView] = useState('MENU');
    const [mapData, setMapData] = useState({ grid: [], nodes: [], nodeMap: new Map() });
    const [currentFloor, setCurrentFloor] = useState(0);
    const [currentAct, setCurrentAct] = useState(1);
    const [masterDeck, setMasterDeck] = useState([]);
    const [champion, setChampion] = useState(null);
    const [currentHp, setCurrentHp] = useState(80);
    const [maxHp, setMaxHp] = useState(80);
    const [gold, setGold] = useState(100);
    const [relics, setRelics] = useState([]);
    const [baseStr, setBaseStr] = useState(0);
    const [nextBattleDrawBonus, setNextBattleDrawBonus] = useState(0);
    const [nextBattleManaBonus, setNextBattleManaBonus] = useState(0);
    const [activeNode, setActiveNode] = useState(null);
    const [usedEnemies, setUsedEnemies] = useState([]);
    const [pendingRelic, setPendingRelic] = useState(null);
    const [showCodex, setShowCodex] = useState(false);
    const [showCollection, setShowCollection] = useState(false);
    const [showInventory, setShowInventory] = useState(false);
    const [showDeck, setShowDeck] = useState(false);
    const [showAchievementPanel, setShowAchievementPanel] = useState(false);
    const [toasts, setToasts] = useState([]);
    const [lockedChoices, setLockedChoices] = useState(new Set()); // 三选一：已锁定的选项
    const [recentAchievement, setRecentAchievement] = useState(null);
    const [achievementsEnabled, setAchievementsEnabled] = useState(getAchievementFeatureFlag());
    const [achievementSnapshot, setAchievementSnapshot] = useState(achievementTracker.getUnlocked());
    const [unlockedModes, setUnlockedModes] = useState(() => {
        try {
            const raw = localStorage.getItem(ACHIEVEMENT_MODE_KEY);
            return raw ? JSON.parse(raw) : [];
        } catch {
            return [];
        }
    });
    const runStartRef = useRef(null);

    const [unlockedChamps, setUnlockedChamps] = useState(() => {
        try {
            const d = localStorage.getItem(UNLOCK_STORAGE_KEY);
            if (!d) return [...DEFAULT_UNLOCKED_HEROES];

            let saved = JSON.parse(d);
            // 修复旧版本的ID (Thresh_Hero -> Thresh, Katarina_Hero -> Katarina)
            saved = saved.map(id => {
                if (id === 'Thresh_Hero') return 'Thresh';
                if (id === 'Katarina_Hero') return 'Katarina';
                return id;
            });
            return saved;
        } catch {
            return [...DEFAULT_UNLOCKED_HEROES];
        }
    });
    const [hasSave, setHasSave] = useState(false);
    const [showUpdateLog, setShowUpdateLog] = useState(() => {
        const lastVersion = localStorage.getItem('last_version');
        return lastVersion !== 'v0.8.0';
    });
    const [loginComplete, setLoginComplete] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    const [showIntro, setShowIntro] = useState(() => {
        try {
            return !localStorage.getItem('lots_intro_watched');
        } catch {
            return true;
        }
    });
    const [showDeadEndPrompt, setShowDeadEndPrompt] = useState(false);
    const [bgmStarted, setBgmStarted] = useState(false);
    const [language, setLanguage] = useState(() => {
        try {
            return localStorage.getItem('lang') || 'zh';
        } catch {
            return 'zh';
        }
    });
    const [activeInventoryTab, setActiveInventoryTab] = useState('CARDS');

    const [ascensionLevel, setAscensionLevel] = useState(() => {
        try {
            const val = localStorage.getItem('lots_ascension_level');
            return val ? parseInt(val) : 0;
        } catch {
            return 0;
        }
    });

    useEffect(() => {
        localStorage.setItem('lots_ascension_level', ascensionLevel);
    }, [ascensionLevel]);

    const isPrivilegedUser = useMemo(() => {
        if (!currentUser?.email) return false;
        const email = currentUser.email.toLowerCase();
        const localPart = email.split('@')[0];
        return PRIVILEGED_ACCOUNTS.some(acc => localPart.startsWith(acc));
    }, [currentUser]);

    const effectiveUnlockedChamps = useMemo(() => {
        if (isPrivilegedUser) return Object.keys(CHAMPION_POOL);
        return unlockedChamps;
    }, [isPrivilegedUser, unlockedChamps]);

    useEffect(() => {
        document.documentElement.lang = language === 'en' ? 'en' : 'zh';
        try {
            localStorage.setItem('lang', language);
        } catch {
            /* ignore */
        }
    }, [language]);

    const openInventory = (tab = 'CARDS') => {
        setActiveInventoryTab(tab);
        setShowInventory(true);
    };

    const loadStoredGMConfig = () => {
        if (typeof window === 'undefined') return DEFAULT_GM_CONFIG;
        try {
            const stored = localStorage.getItem(GM_STORAGE_KEY);
            if (stored) return sanitizeGMConfig(JSON.parse(stored));
        } catch (error) {
            console.warn('[GM] Failed to load config', error);
        }
        return DEFAULT_GM_CONFIG;
    };
    const [gmConfig, setGmConfig] = useState(loadStoredGMConfig);
    const [showGMPanel, setShowGMPanel] = useState(false);

    useEffect(() => {
        try {
            localStorage.setItem(GM_STORAGE_KEY, JSON.stringify(gmConfig));
        } catch (error) {
            console.warn('[GM] Failed to persist config', error);
        }
    }, [gmConfig]);

    const updateGmConfig = (updater) => {
        setGmConfig(prev => {
            const next = typeof updater === 'function' ? updater(prev) : updater;
            return sanitizeGMConfig(next);
        });
    };

    const gmHeroOptions = useMemo(
        () => Object.values(CHAMPION_POOL).map(hero => ({ id: hero.id, name: hero.name })),
        []
    );

    const heroNameLookup = useMemo(() => {
        return Object.values(CHAMPION_POOL).reduce((acc, hero) => {
            acc[hero.id] = hero.name;
            return acc;
        }, {});
    }, []);

    const gmRSkillCards = useMemo(
        () => Object.values(CARD_DATABASE)
            .filter(card => card.hero && card.hero !== 'Neutral' && card.id?.endsWith('R'))
            .map(card => ({
                id: card.id,
                name: card.name,
                heroId: card.hero,
                heroName: heroNameLookup[card.hero] || card.hero
            })),
        [heroNameLookup]
    );

    const isGMUser = useMemo(() => {
        if (!currentUser) return false;
        const email = (currentUser.email || '').toLowerCase();
        const username = (currentUser.username || '').toLowerCase();
        const localPart = email.includes('@') ? email.split('@')[0] : email;
        return GM_ALLOWED_USERS.some(id => id === email || id === username || id === localPart);
    }, [currentUser]);

    const gmActive = useMemo(
        () => isGMUser && gmConfig.enabled,
        [isGMUser, gmConfig.enabled]
    );

    useEffect(() => {
        if (isGMUser) return;
        if (gmConfig.enabled) {
            updateGmConfig(prev => ({ ...prev, enabled: false }));
        }
        if (showGMPanel) {
            setShowGMPanel(false);
        }
    }, [isGMUser, gmConfig.enabled, showGMPanel, updateGmConfig]);

    const getSaveKey = (user) => user ? `${SAVE_KEY}_${user.email}` : SAVE_KEY;

    useEffect(() => {
        localStorage.setItem(ACHIEVEMENT_MODE_KEY, JSON.stringify(unlockedModes));
    }, [unlockedModes]);

    const serializeMapData = () => {
        const serializable = {
            ...mapData,
            nodeMap: mapData.nodeMap instanceof Map
                ? Object.fromEntries(mapData.nodeMap)
                : mapData.nodeMap
        };
        return serializable;
    };

    useEffect(() => {
        achievementTracker.updateUniqueCards(new Set(masterDeck).size);
    }, [masterDeck]);

    useEffect(() => {
        achievementTracker.updateRelicsOwned(relics.length);
    }, [relics]);

    useEffect(() => {
        const interval = setInterval(() => {
            if (!runStartRef.current) return;
            const minutes = (Date.now() - runStartRef.current) / 60000;
            achievementTracker.updateRunDuration(minutes);
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    const applySaveData = (data) => {
        if (!data) return;
        const restoredMapData = { ...data.mapData };
        if (restoredMapData.nodeMap && !(restoredMapData.nodeMap instanceof Map)) {
            restoredMapData.nodeMap = new Map(Object.entries(restoredMapData.nodeMap));
        } else if (!restoredMapData.nodeMap) {
            restoredMapData.nodeMap = new Map();
        }
        setBgmStarted(true);
        setMapData(restoredMapData);
        setCurrentFloor(data.currentFloor);
        setCurrentAct(data.currentAct || 1);
        setMasterDeck(data.masterDeck);
        setChampion(data.champion);
        setCurrentHp(data.currentHp);
        setMaxHp(data.maxHp);
        setGold(data.gold);
        setRelics(data.relics);
        setBaseStr(data.baseStr);
        setActiveNode(data.activeNode);
        setUsedEnemies(data.usedEnemies);
        setView(data.view);
        const savedAchievements = data.achievements || {};
        if (Array.isArray(savedAchievements.unlocked)) {
            achievementTracker.hydrateUnlocked(savedAchievements.unlocked);
        }
        setUnlockedModes(Array.isArray(savedAchievements.modes) ? savedAchievements.modes : []);
    };

    const restoreUserSave = (user) => {
        if (!user) return false;
        const key = getSaveKey(user);
        const stored = localStorage.getItem(key);
        if (stored) {
            applySaveData(JSON.parse(stored));
            setHasSave(true);
            return true;
        }
        return false;
    };

    const hasAvailableNeighbors = (nodesSnapshot = mapData.nodes, gridSnapshot = mapData.grid, totalFloors = mapData.totalFloors || 10) => {
        if (!activeNode) return true; // 起点默认可选
        const neighbors = getHexNeighbors(activeNode.row, activeNode.col, totalFloors, gridSnapshot?.[0]?.length || 11);
        const availableNeighbors = neighbors
            .map(([r, c]) => gridSnapshot?.[r]?.[c])
            .filter(n => {
                if (!n || n.explored) return false;
                const nKey = `${n.row}-${n.col}`;
                if (lockedChoices.has(nKey)) return false;
                return true;
            });
        return availableNeighbors.length > 0;
    };

    const persistRemoteSave = useCallback(async () => {
        // Remote sync disabled - Backend functions removed to avoid CF 500
        return;
    }, []);

    const hydrateRemoteAchievements = useCallback(async (user) => {
        // Remote sync disabled - Backend functions removed to avoid CF 500
        return;
    }, []);

    useEffect(() => {
        const storedUser = authService.getCurrentUser();
        if (!storedUser) return;
        setCurrentUser(storedUser);
        const restored = restoreUserSave(storedUser);
        setLoginComplete(true);
        if (!restored) {
            setView('CHAMPION_SELECT');
        }
    }, []);

    useEffect(() => {
        const key = getSaveKey(currentUser);
        setHasSave(Boolean(localStorage.getItem(key)));
    }, [currentUser]);

    useEffect(() => {
        if (!currentUser) return;
        hydrateRemoteAchievements(currentUser);
    }, [currentUser, hydrateRemoteAchievements]);

    useEffect(() => {
        if (['MENU', 'CHAMPION_SELECT', 'GAMEOVER', 'VICTORY_ALL'].includes(view)) return;
        const serializableMapData = serializeMapData();
        const key = getSaveKey(currentUser);
        const achievementsPayload = {
            unlocked: achievementTracker.getUnlocked(),
            modes: unlockedModes
        };
        localStorage.setItem(key, JSON.stringify({
            view,
            mapData: serializableMapData,
            currentFloor,
            currentAct,
            masterDeck,
            champion,
            currentHp,
            maxHp,
            gold,
            relics,
            baseStr,
            activeNode,
            usedEnemies,
            achievements: achievementsPayload
        }));
        persistRemoteSave();
    }, [view, currentHp, gold, currentFloor, currentAct, champion, masterDeck, relics, baseStr, activeNode, usedEnemies, currentUser, unlockedModes, persistRemoteSave]);

    const handleContinue = async () => {
        await unlockAudio();
        const key = getSaveKey(currentUser);
        const stored = localStorage.getItem(key);
        let heroId = null;
        if (stored) {
            const data = JSON.parse(stored);
            heroId = data?.champion?.id;
            applySaveData(data);
            achievementTracker.startRun({ type: 'resume', heroId });
        } else {
            achievementTracker.startRun({ type: 'resume' });
        }
        if (currentUser) {
            await hydrateRemoteAchievements(currentUser);
        }
    };

    const handleNewGame = async () => {
        await unlockAudio(); // 解锁音频
        localStorage.removeItem(SAVE_KEY);
        if (currentUser) {
            localStorage.removeItem(getSaveKey(currentUser));
        }
        setHasSave(false);
        setBgmStarted(true); // 立即启动BGM
        setView('CHAMPION_SELECT');
        achievementTracker.startRun({ type: 'new_game' });
    };

    const handleLoginSuccess = async (user) => {
        setCurrentUser(user);
        const restored = restoreUserSave(user);
        await hydrateRemoteAchievements(user);
        if (!restored) {
            await handleNewGame();
        }
        setLoginComplete(true);
    };

    const handleLogout = () => {
        authService.logout();
        setCurrentUser(null);
        setLoginComplete(false);
        setView('MENU');
        setHasSave(false);
        setMapData({ grid: [], nodes: [], nodeMap: new Map() });
        setChampion(null);
        setNextBattleDrawBonus(0);
    };

    const handleAct3Unlock = useCallback(() => {
        if (isPrivilegedUser) return;
        const allIds = Object.keys(CHAMPION_POOL);
        const locked = allIds.filter(id => !unlockedChamps.includes(id));
        let newUnlock = null;

        // 首次优先德莱厄斯
        if (!unlockedChamps.includes(ACT_UNLOCK_HEROES[3])) {
            newUnlock = ACT_UNLOCK_HEROES[3];
        } else if (locked.length > 0) {
            newUnlock = locked[Math.floor(Math.random() * locked.length)];
        }

        if (newUnlock) {
            const updated = [...unlockedChamps, newUnlock];
            setUnlockedChamps(updated);
            localStorage.setItem(UNLOCK_STORAGE_KEY, JSON.stringify(updated));
            alert(`恭喜通关！新英雄解锁: ${CHAMPION_POOL[newUnlock].name}`);
        }
    }, [isPrivilegedUser, unlockedChamps]);

    const handleHeroUnlock = useCallback((heroId) => {
        if (!heroId || isPrivilegedUser) return;
        if (heroId === 'RANDOM_OR_DARIUS') {
            handleAct3Unlock();
            return;
        }
        if (unlockedChamps.includes(heroId)) return;
        const updated = [...unlockedChamps, heroId];
        setUnlockedChamps(updated);
        localStorage.setItem(UNLOCK_STORAGE_KEY, JSON.stringify(updated));
        alert(`新英雄解锁: ${CHAMPION_POOL[heroId]?.name || heroId}`);
    }, [handleAct3Unlock, isPrivilegedUser, unlockedChamps]);

    const handleIntroComplete = useCallback(() => {
        setShowIntro(false);
        try {
            localStorage.setItem('lots_intro_watched', 'true');
        } catch {
            /* ignore */
        }
    }, []);

    // 监听成就系统分发的英雄解锁事件
    useEffect(() => {
        const handler = (e) => {
            const heroId = e?.detail?.heroId;
            if (heroId) {
                handleHeroUnlock(heroId);
            }
        };
        window.addEventListener('hero-unlock', handler);
        return () => window.removeEventListener('hero-unlock', handler);
    }, [handleHeroUnlock]);

    const handleRestartMap = () => {
        if (!window.confirm('检测到死胡同，重新生成地图会清除当前进度。是否继续？')) return;
        const resetMap = generateGridMap(currentAct, []);
        setMapData(resetMap);
        if (resetMap.startNode) {
            setActiveNode(resetMap.startNode);
        }
        setLockedChoices(new Set());
        setShowDeadEndPrompt(!hasAvailableNeighbors(resetMap.nodes, resetMap.grid, resetMap.totalFloors));
        setView('MAP');
    };

    const applyRSkillTestOverrides = (champion) => {
        const baseCards = [...(champion.initialCards || [])];
        const shouldApply = gmActive && (!gmConfig.heroId || gmConfig.heroId === champion.id);
        if (!shouldApply) {
            return { ...champion, initialCards: baseCards, gmOverrides: { enabled: false } };
        }
        const extraCards = (gmConfig.extraCards || []).filter(id => CARD_DATABASE[id]);
        const forceTopCards = (gmConfig.forceTopCards || []).filter(id => CARD_DATABASE[id]);
        return {
            ...champion,
            initialCards: [...baseCards, ...extraCards],
            gmOverrides: {
                enabled: true,
                note: gmConfig.note || 'GM QA Mode',
                extraCards,
                forceTopCards
            }
        };
    };
    const handleChampionSelect = (selectedChamp) => {
        const championPayload = applyRSkillTestOverrides(selectedChamp);
        // 播放英雄语音
        playChampionVoice(championPayload.id);
        setChampion(championPayload);
        setMaxHp(championPayload.maxHp);
        setCurrentHp(championPayload.maxHp);
        setMasterDeck([...STARTING_DECK_BASIC, ...championPayload.initialCards]);
        setRelics([RELIC_DATABASE[championPayload.relicId].id]);
        setBaseStr(0);
        setGold(0);
        setNextBattleDrawBonus(0);
        achievementTracker.startRun({ type: 'run', heroId: championPayload.id });
        runStartRef.current = Date.now();

        // 使用v4地图生成器（带死胡同检测和三选一机制）
        const newMapData = generateGridMap(1, []); // act=1, usedEnemies=[]
        setMapData(newMapData);
        setShowDeadEndPrompt(!hasAvailableNeighbors(newMapData.nodes, newMapData.grid, newMapData.totalFloors));

        // 设置初始activeNode为startNode
        if (newMapData.startNode) {
            setActiveNode(newMapData.startNode);
        }

        setCurrentFloor(0);
        setCurrentAct(1);
        setUsedEnemies([]);
        setLockedChoices(new Set()); // 清空锁定选项
        setView('MAP');
    };

    const completeNode = () => {
        if (!activeNode || !mapData || !mapData.nodes) return;

        // v4自由探索系统：标记当前节点为已探索
        const newNodes = [...mapData.nodes];
        const idx = newNodes.findIndex(n => n.row === activeNode.row && n.col === activeNode.col);
        if (idx === -1) return;

        // 标记为已探索（不再使用status，使用explored属性）
        newNodes[idx].explored = true;
        newNodes[idx].status = 'COMPLETED';

        // 更新mapData（保持grid和nodes同步）
        const newGrid = mapData.grid ? mapData.grid.map(row => [...row]) : [];
        newNodes.forEach(node => {
            if (newGrid[node.row] && newGrid[node.row][node.col]) {
                newGrid[node.row][node.col] = node;
            }
        });

        setMapData({ ...mapData, grid: newGrid, nodes: newNodes });
        setShowDeadEndPrompt(!hasAvailableNeighbors(newNodes, newGrid, mapData.totalFloors || 10));

        // 注意：不清空锁定选项，锁定的选项应该永久锁定
        // 只有在移动到新节点时，才会重新计算可用选项（但已锁定的选项仍然锁定）

        // 检查是否到达BOSS
        if (activeNode.type === 'BOSS') {
            achievementTracker.recordActCompletion(currentAct);
            // 章节通关逻辑
            if (currentAct < 3) {
                const nextAct = currentAct + 1;
                setCurrentAct(nextAct);
                setCurrentFloor(0);
                const nextMapData = generateGridMap(nextAct, []); // v4生成器
                setMapData(nextMapData);
                setShowDeadEndPrompt(!hasAvailableNeighbors(nextMapData.nodes, nextMapData.grid, nextMapData.totalFloors));
                if (nextMapData.startNode) {
                    setActiveNode(nextMapData.startNode);
                }
                // 清空锁定选项
                setLockedChoices(new Set());
                // 章节奖励：回复 50% 生命
                setCurrentHp(Math.min(maxHp, currentHp + Math.floor(maxHp * 0.5)));
                alert(`第 ${currentAct} 章通关！进入下一章...`);
                setView('MAP');
            } else {
                // 游戏通关（解锁逻辑改由成就事件处理）
                localStorage.removeItem(SAVE_KEY);
                setView('VICTORY_ALL');
            }
        } else {
            // 继续探索，返回地图视图
            setView('MAP');
        }
    };

    const handleNodeSelect = (node) => {
        // v4自由探索系统：基于六边形邻接规则，不依赖DAG
        // 三选一机制：当玩家选择一个节点后，锁定其他选项

        if (!activeNode) {
            // 起点：只能选择起点本身
            if (node.row !== mapData.startNode?.row || node.col !== mapData.startNode?.col) return;
        } else {
            // 检查节点是否在已锁定的选项中
            const nodeKey = `${node.row}-${node.col}`;
            if (lockedChoices.has(nodeKey)) {
                return; // 已锁定的选项不能选择
            }

            // 获取当前节点的所有未探索邻居（排除已锁定的选项）
            const neighbors = getHexNeighbors(activeNode.row, activeNode.col, mapData.totalFloors || 10, mapData.grid?.[0]?.length || 11);
            const availableNeighbors = neighbors
                .map(([r, c]) => mapData.grid?.[r]?.[c])
                .filter(n => {
                    if (!n || n.explored) return false;
                    // 排除已锁定的选项
                    const nKey = `${n.row}-${n.col}`;
                    if (lockedChoices.has(nKey)) return false;
                    return true;
                });

            // 检查选择的节点是否是可用邻居
            const isNeighbor = availableNeighbors.some(n => n.row === node.row && n.col === node.col);
            if (!isNeighbor) {
                return; // 不是可用邻居，不能选择
            }

            // 【关键修复】三选一锁定逻辑：只锁定UI实际显示的3个选项中的未选择选项
            // 必须与GridMapView_v3.jsx的getAvailableNodes()逻辑完全一致
            let displayedChoices = availableNeighbors;
            if (availableNeighbors.length > 3) {
                // 使用与UI相同的排序和哈希逻辑
                const sorted = [...availableNeighbors].sort((a, b) => {
                    const seedA = `${a.row}-${a.col}`;
                    const seedB = `${b.row}-${b.col}`;
                    return seedA.localeCompare(seedB);
                });
                const hash = (activeNode.row * 1000 + activeNode.col) % sorted.length;
                displayedChoices = [];
                for (let i = 0; i < 3; i++) {
                    displayedChoices.push(sorted[(hash + i) % sorted.length]);
                }
            }

            // 只锁定UI显示的3个选项中的未选择选项
            const newLockedChoices = new Set(lockedChoices);
            displayedChoices.forEach(n => {
                if (n.row !== node.row || n.col !== node.col) {
                    newLockedChoices.add(`${n.row}-${n.col}`);
                }
            });
            setLockedChoices(newLockedChoices);
        }

        setActiveNode(node);
        setCurrentFloor(node.row);
        achievementTracker.recordNodeVisit();
        if (node.type === 'SHOP') achievementTracker.recordShopVisit();
        if (node.type === 'EVENT') achievementTracker.recordEventVisit();
        if (node.type === 'CHEST') achievementTracker.recordChestOpen();

        switch (node.type) {
            case 'BATTLE': case 'BOSS': setView('COMBAT'); break;
            case 'REST': setView('REST'); break;
            case 'SHOP': setView('SHOP'); break;
            case 'EVENT': setView('EVENT'); break;
            case 'CHEST': setView('CHEST'); break;
            default: break;
        }
    };

    // Toast通知系统
    const formatRewardText = useCallback((reward) => {
        if (!reward) return '奖励：未定义';
        switch (reward.type) {
            case 'CARD':
                return `卡牌 ${reward.ref}`;
            case 'RELIC':
                return `遗物 ${reward.ref}`;
            case 'MODE':
                return `模式 ${reward.ref}`;
            case 'REWARD':
                return reward.ref;
            default:
                return reward.ref;
        }
    }, []);

    const assignAchievementReward = useCallback((achievement) => {
        if (!achievement?.reward) return;
        const { type, ref } = achievement.reward;
        switch (type) {
            case 'CARD': {
                setMasterDeck(prev => [...prev, ref]);
                break;
            }
            case 'RELIC': {
                setRelics(prev => (prev.includes(ref) ? prev : [...prev, ref]));
                break;
            }
            case 'MODE': {
                setUnlockedModes(prev => (prev.includes(ref) ? prev : [...prev, ref]));
                break;
            }
            default:
                break;
        }
    }, [setMasterDeck, setRelics, setUnlockedModes]);

    const showToast = useCallback((message, type = 'default') => {
        const id = Date.now();
        setToasts(prev => [...prev, { id, message, type }]);
        setTimeout(() => {
            setToasts(prev => prev.filter(t => t.id !== id));
        }, 3000);
    }, []);

    const handleBattleGoldChange = useCallback((delta = 0) => {
        if (!delta) return;
        setGold(prev => Math.max(0, prev + delta));
    }, [setGold]);

    const handleAchievementUnlock = useCallback((achievement) => {
        if (!achievement) return;
        assignAchievementReward(achievement);
        const rewardText = formatRewardText(achievement.reward);
        showToast(`成就解锁：${achievement.name} · ${rewardText}`, 'achievement');
        setRecentAchievement(achievement);
        setAchievementSnapshot(achievementTracker.getUnlocked());
        persistRemoteSave();
    }, [assignAchievementReward, formatRewardText, persistRemoteSave, showToast]);

    const handleAchievementToggle = useCallback(() => {
        const next = !achievementsEnabled;
        setAchievementFeatureFlag(next);
        setAchievementsEnabled(next);
        showToast(`成就系统已${next ? '启用' : '关闭'}`, 'achievement');
        persistRemoteSave();
    }, [achievementsEnabled, persistRemoteSave, showToast]);

    useEffect(() => {
        achievementTracker.init({
            onUnlock: handleAchievementUnlock
        });
    }, [handleAchievementUnlock]);

    useEffect(() => {
        if (!recentAchievement) return;
        const timer = setTimeout(() => setRecentAchievement(null), 3200);
        return () => clearTimeout(timer);
    }, [recentAchievement]);

    const queueRelicPickup = (relicId, onResolved) => {
        if (!relicId) return false;
        if (pendingRelic) {
            showToast('装备栏待处理，请先选择保留或放弃上一件装备');
            openInventory('RELICS');
            return false;
        }
        const extraCount = champion ? relics.filter(rid => rid !== champion.relicId).length : relics.length;
        if (extraCount >= MAX_EXTRA_RELICS) {
            setPendingRelic({ id: relicId, onResolved });
            showToast('装备栏已满，请在背包中选择替换或放弃新装备');
            openInventory('RELICS');
            return false;
        }
        setRelics(prev => [...prev, relicId]);
        showToast(`获得装备：${RELIC_DATABASE[relicId]?.name || relicId}`, 'relic');
        onResolved?.(true);
        return true;
    };

    const handleRelicReplace = (relicIdToRemove) => {
        if (!pendingRelic) return;
        let removed = !relicIdToRemove;
        setRelics(prev => {
            const filtered = prev.filter(id => {
                if (!removed && id === relicIdToRemove && id !== champion?.relicId) {
                    removed = true;
                    return false;
                }
                return true;
            });
            return [...filtered, pendingRelic.id];
        });
        showToast(`装备替换：已装备 ${RELIC_DATABASE[pendingRelic.id]?.name || pendingRelic.id}`, 'relic');
        pendingRelic.onResolved?.(true);
        setPendingRelic(null);
    };

    const handleRejectPendingRelic = () => {
        if (!pendingRelic) return;
        showToast(`放弃装备：${RELIC_DATABASE[pendingRelic.id]?.name || pendingRelic.id}`);
        pendingRelic.onResolved?.(false);
        setPendingRelic(null);
    };

    const handleRemoveCard = (cardId) => {
        const card = CARD_DATABASE[getBaseCardId(cardId)];
        if (!card) {
            showToast('卡牌不存在');
            return;
        }
        if (card.hero !== 'Neutral' || card.rarity === 'BASIC') {
            showToast('只能删除中立技能牌');
            return;
        }
        const cost = CARD_DELETE_COST[card.rarity];
        if (!cost) {
            showToast('该卡牌无法删除');
            return;
        }
        if (gold < cost) {
            showToast('金币不足', 'gold');
            return;
        }
        if (!masterDeck.includes(cardId)) {
            showToast('当前牌组没有此卡牌');
            return;
        }
        setMasterDeck(prev => {
            const next = [...prev];
            const idx = next.indexOf(cardId);
            if (idx !== -1) {
                next.splice(idx, 1);
            }
            return next;
        });
        setGold(prev => prev - cost);
        showToast(`已删除 ${card.name} (-${cost}G)`, 'gold');
    };

    const handleGMResetSave = () => {
        localStorage.removeItem(SAVE_KEY);
        if (currentUser) {
            localStorage.removeItem(getSaveKey(currentUser));
        }
        setHasSave(false);
        setMapData({ grid: [], nodes: [], nodeMap: new Map() });
        setActiveNode(null);
        setChampion(null);
        setView('CHAMPION_SELECT');
        setNextBattleDrawBonus(0);
        setNextBattleManaBonus(0);
        showToast('GM：已清空存档，请重新选择英雄', 'default');
    };

    const handleBattleWin = (battleResult) => {
        // 处理战斗结果（可能是旧格式的remainingHp数字，也可能是新格式的对象）
        const result = typeof battleResult === 'number'
            ? { finalHp: battleResult, gainedStr: 0, gainedMaxHp: 0 }
            : battleResult;

        console.log('[战斗胜利] battleResult:', result); // 调试日志
        console.log('[当前属性] baseStr:', baseStr, 'maxHp:', maxHp); // 调试日志

        // 盖伦被动：战斗结束恢复HP
        let passiveHeal = champion.relicId === "GarenPassive" ? 6 : 0;

        // 内瑟斯被动：将战斗中获得的力量永久化
        if (result.gainedStr > 0) {
            console.log('[内瑟斯] 永久力量增长:', result.gainedStr, '→', baseStr + result.gainedStr); // 调试日志
            setBaseStr(prev => prev + result.gainedStr);
            showToast(`永久力量 +${result.gainedStr}`, 'strength');
        }

        // 最大生命值变动：先应用奖励再扣减
        let nextMaxHp = maxHp;
        if (result.gainedMaxHp > 0) {
            console.log('[锤石] 最大HP增长:', result.gainedMaxHp, '→', maxHp + result.gainedMaxHp); // 调试日志
            nextMaxHp += result.gainedMaxHp;
            passiveHeal += result.gainedMaxHp; // 最大HP增长也算作恢复
            showToast(`最大生命值 +${result.gainedMaxHp}`, 'maxHp');
        }
        if (result.maxHpCost > 0) {
            console.log('[生命代价] 最大HP扣除:', result.maxHpCost, '→', nextMaxHp - result.maxHpCost);
            nextMaxHp = Math.max(1, nextMaxHp - result.maxHpCost);
            showToast(`生命代价 -${result.maxHpCost}`, 'maxHp');
        }
        setMaxHp(nextMaxHp);

        // 卡牌大师被动：战斗胜利额外金币
        if (champion && champion.relicId === "TwistedFatePassive") {
            console.log('[卡牌大师] 获得额外金币: +15'); // 调试日志
            setGold(prev => prev + 15);
            showToast('灌铅骰子: +15 金币', 'gold');
        }

        if (result.winGoldBonus > 0) {
            setGold(prev => prev + result.winGoldBonus);
            showToast(`荣誉奖章: +${result.winGoldBonus} 金币`, 'gold');
        }

        if (Array.isArray(result.permaUpgrades) && result.permaUpgrades.length > 0) {
            setMasterDeck(prev => {
                const next = [...prev];
                result.permaUpgrades.forEach(entry => {
                    if (!entry) return;
                    if (typeof entry === 'string') {
                        const idx = next.findIndex(cardId => getBaseCardId(cardId) === entry);
                        if (idx !== -1) {
                            next[idx] = `${next[idx]}+`;
                        }
                        return;
                    }
                    const { from, to } = entry;
                    if (!from || !to) return;
                    let targetIdx = next.findIndex(cardId => cardId === from);
                    if (targetIdx === -1) {
                        targetIdx = next.findIndex(cardId => getBaseCardId(cardId) === getBaseCardId(from));
                    }
                    if (targetIdx !== -1) {
                        next[targetIdx] = to;
                    }
                });
                return next;
            });
            showToast(`永久升级 ${result.permaUpgrades.length} 张卡牌`, 'default');
        }
        if (Array.isArray(result.consumedCards) && result.consumedCards.length > 0) {
            setMasterDeck(prev => {
                const next = [...prev];
                result.consumedCards.forEach(baseId => {
                    const idx = next.findIndex(cardId => getBaseCardId(cardId) === baseId);
                    if (idx !== -1) {
                        next.splice(idx, 1);
                    }
                });
                return next;
            });
            showToast(`猎手徽章 消失 x${result.consumedCards.length}`, 'default');
        }
        if (result.nextBattleDrawBonus > 0) {
            setNextBattleDrawBonus(prev => prev + result.nextBattleDrawBonus);
            showToast(`下场战斗首抽 +${result.nextBattleDrawBonus}`, 'default');
        }
        if (result.nextBattleManaBonus > 0) {
            setNextBattleManaBonus(prev => prev + result.nextBattleManaBonus);
            showToast(`下场战斗首回合法力 +${result.nextBattleManaBonus}`, 'default');
        }

        setCurrentHp(Math.min(nextMaxHp, result.finalHp + passiveHeal));
        achievementTracker.recordEnemyKill({ isBoss: activeNode?.type === 'BOSS' });
        achievementTracker.recordBattleEnd({ playerHp: result.finalHp, bossId: activeNode?.enemyId });
        setView('REWARD');
    };
    const handleBuyCard = (card) => { setGold(prev => prev - card.price); setMasterDeck(prev => [...prev, card.id]); };
    const handleRelicReward = (relic) => {
        const resolver = (didAcquire) => {
            if (didAcquire && relic.onPickup) {
                const ns = relic.onPickup({ maxHp, currentHp });
                setMaxHp(ns.maxHp);
                setCurrentHp(ns.currentHp);
            }
            completeNode();
        };
        queueRelicPickup(relic.id, resolver);
    };
    const handleBuyRelic = (relic) => {
        if (gold < relic.price) {
            showToast('金币不足', 'gold');
            return;
        }
        setGold(prev => prev - relic.price);
        const resolver = (didAcquire) => {
            if (didAcquire && relic.onPickup) {
                const ns = relic.onPickup({ maxHp, currentHp });
                setMaxHp(ns.maxHp);
                setCurrentHp(ns.currentHp);
            }
        };
        queueRelicPickup(relic.id, resolver);
    };
    const handleEventReward = (reward) => {
        if (reward.type === 'BUFF' && reward.stat === 'strength') setBaseStr(prev => prev + reward.value);
        if (reward.type === 'RELIC_RANDOM') {
            const pool = Object.values(RELIC_DATABASE).filter(r => r.rarity !== 'PASSIVE' && !relics.includes(r.id) && isRelicAvailableInAct(r.id, currentAct));
            if (pool.length > 0) {
                handleRelicReward(shuffle(pool)[0]);
            } else {
                showToast('当前章节没有可用装备', 'default');
            }
        }
        if (reward.type === 'UPGRADE_RANDOM') {
            // 随机升级一张卡
            const upgradableIndices = masterDeck
                .map((id, idx) => (getUpgradeLevel(id) === 0 ? idx : -1))
                .filter(i => i !== -1);
            if (upgradableIndices.length > 0) {
                const randomIdx = upgradableIndices[Math.floor(Math.random() * upgradableIndices.length)];
                const newDeck = [...masterDeck];
                newDeck[randomIdx] = `${newDeck[randomIdx]}+`;
                setMasterDeck(newDeck);
            }
        }
        completeNode();
    };
    const handleCardReward = (cardId) => { setMasterDeck([...masterDeck, cardId]); setGold(gold + 50); completeNode(); };

    const handleUpgradeCard = (cardId) => {
        // 升级指定卡牌（找到第一个匹配的未升级版本）
        const targetBaseId = getBaseCardId(cardId);
        const idx = masterDeck.findIndex(id => getBaseCardId(id) === targetBaseId);
        if (idx !== -1) {
            const newDeck = [...masterDeck];
            newDeck[idx] = `${newDeck[idx]}+`;
            setMasterDeck(newDeck);
            setGold(prev => prev - 100);
        }
    };

    const handleBuyMana = () => {
        if (gold < 200) {
            showToast('金币不足', 'gold');
            return;
        }
        setGold(prev => prev - 200);
        queueRelicPickup("ManaGem");
    };

    const handleSkipReward = () => { setGold(gold + 50); completeNode(); };
    const handleRest = () => { setCurrentHp(Math.min(maxHp, currentHp + Math.floor(maxHp * 0.3))); completeNode(); };

    const restartGame = () => {
        setView('CHAMPION_SELECT');
        setMasterDeck([]);
        setCurrentHp(80);
        setMaxHp(80);
        setGold(100);
        setRelics([]);
        setBaseStr(0);
        setChampion(null);
        setUsedEnemies([]);
    };
    const getCurrentBgm = () => (view === 'COMBAT' ? BGM_BATTLE_URL : BGM_MAP_URL);
    const playSfx = (type) => {
        const url = SFX[type] || SFX.ATTACK;
        if (!url) return;
        const audio = new Audio(url);
        // 根据音效类型调整音量
        if (type === 'ATTACK_SWING' || type === 'ATTACK_HIT') {
            audio.volume = 0.5;
        } else if (type === 'BLOCK_SHIELD') {
            audio.volume = 0.4;
        } else if (type === 'HIT_TAKEN') {
            audio.volume = 0.6;
        } else {
            audio.volume = 0.4;
        }
        audio.play().catch(() => { });
    };
    const playChampionVoice = (championKey) => {
        if (!championKey) return;
        const voiceUrl = `${VOICE_URL}/${championKey}.ogg`;
        const audio = new Audio(voiceUrl);
        audio.volume = 0.6;
        audio.play().catch(e => console.log("Champion voice play failed", e));
    };

    const renderView = () => {
        switch (view) {
            case 'MENU': return (
                <div className="h-screen w-full bg-slate-900 flex flex-col items-center justify-center text-white bg-[url('https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Ryze_0.jpg')] bg-cover bg-center">
                    <div className="absolute inset-0 bg-black/60"></div>
                    <div className="z-10 text-center">
                        <h1 className="text-8xl font-black text-[#C8AA6E] mb-2 drop-shadow-lg tracking-widest">峡谷尖塔</h1>
                        {ascensionLevel > 0 && (
                            <div className="text-[#0AC8B9] font-bold text-xl mb-8 tracking-[0.2em]">
                                ASCENSION {ascensionLevel}
                            </div>
                        )}
                        <div className="flex flex-col gap-4 w-64 mx-auto">
                            {hasSave && (
                                <button onClick={handleContinue} className="px-8 py-4 bg-[#0AC8B9] hover:bg-white hover:text-[#0AC8B9] text-black font-bold rounded flex items-center justify-center gap-2 transition-all">
                                    <Play fill="currentColor" /> 继续征程
                                </button>
                            )}
                            <button onClick={handleNewGame} className="px-8 py-4 border-2 border-[#C8AA6E] hover:bg-[#C8AA6E] hover:text-black text-[#C8AA6E] font-bold rounded flex items-center justify-center gap-2 transition-all">
                                <RotateCcw /> 新游戏
                            </button>
                        </div>
                        <p className="mt-8 text-slate-400 text-sm">v0.8.0 Beta</p>
                    </div>
                    {showUpdateLog && (
                        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/90">
                            <div className="max-w-2xl bg-[#091428]/95 border-2 border-[#C8AA6E] p-8 rounded-xl shadow-[0_0_50px_#C8AA6E]">
                                <h2 className="text-3xl font-bold text-[#C8AA6E] mb-6 text-center">v0.8.0 (当前版本) 更新日志</h2>
                                <div className="space-y-4 text-left max-h-96 overflow-y-auto">
                                    <div className="border-l-4 border-green-500 pl-4">
                                        <div className="font-bold text-green-400 mb-1">[Feature] 全英雄实装</div>
                                        <div className="text-sm text-[#A09B8C]">英雄池扩充至 20 位，包含瑞文、卡牌、盲僧等新英雄，且每位英雄拥有独特的初始卡组和被动遗物。</div>
                                    </div>
                                    <div className="border-l-4 border-green-500 pl-4">
                                        <div className="font-bold text-green-400 mb-1">[Feature] 三章节系统</div>
                                        <div className="text-sm text-[#A09B8C]">正式实装 Act 1 (峡谷), Act 2 (暗影岛), Act 3 (虚空) 的完整流程，包含专属敌人和 Boss。</div>
                                    </div>
                                    <div className="border-l-4 border-green-500 pl-4">
                                        <div className="font-bold text-green-400 mb-1">[Feature] 资巧专属遗物</div>
                                        <div className="text-sm text-[#A09B8C]">新增了只能在特定章节获取的强力遗物（如 Act 3 的纳什之牙）。</div>
                                    </div>
                                    <div className="border-l-4 border-blue-500 pl-4">
                                        <div className="font-bold text-blue-400 mb-1">[Fix] 牌库打空 Bug</div>
                                    </div>
                                    <div className="border-l-4 border-blue-500 pl-4">
                                        <div className="font-bold text-blue-400 mb-1">[Fix] 厄加特回血 Bug</div>
                                    </div>
                                    <div className="border-l-4 border-blue-500 pl-4">
                                        <div className="font-bold text-blue-400 mb-1">[Fix] 地图路径逻辑</div>
                                    </div>
                                    <div className="border-l-4 border-blue-500 pl-4">
                                        <div className="font-bold text-blue-400 mb-1">[Fix] 资源链接</div>
                                        <div className="text-sm text-[#A09B8C]">全面校对了 20 位英雄的技能图标、头像和 Loading 图，修复了所有 broken image。</div>
                                    </div>
                                </div>
                                <button
                                    onClick={() => {
                                        setShowUpdateLog(false);
                                        localStorage.setItem('last_version', 'v0.8.0');
                                        setBgmStarted(true);
                                    }}
                                    className="mt-6 w-full px-8 py-3 bg-[#C8AA6E] hover:bg-[#F0E6D2] text-black font-bold rounded transition-all"
                                >
                                    关闭
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            );
            case 'CHAMPION_SELECT': return <ChampionSelect onChampionSelect={handleChampionSelect} unlockedIds={effectiveUnlockedChamps} currentUser={currentUser} />;
            case 'MAP': return (
                <div className="relative w-full h-full">
                    {/* [DEV ONLY] 跳关调试按钮 */}
                    <div className="absolute top-20 left-1/2 -translate-x-1/2 z-[100] flex gap-2">
                        <button
                            onClick={() => handleSkipToAct(1)}
                            className={`px-4 py-2 rounded-lg font-bold text-xs uppercase transition-all ${currentAct === 1
                                ? 'bg-blue-600 text-white border-2 border-blue-400'
                                : 'bg-black/70 text-blue-300 border border-blue-500/50 hover:bg-blue-900/50'
                                }`}
                        >
                            🧪 ACT 1
                        </button>
                        <button
                            onClick={() => handleSkipToAct(2)}
                            className={`px-4 py-2 rounded-lg font-bold text-xs uppercase transition-all ${currentAct === 2
                                ? 'bg-purple-600 text-white border-2 border-purple-400'
                                : 'bg-black/70 text-purple-300 border border-purple-500/50 hover:bg-purple-900/50'
                                }`}
                        >
                            🧪 ACT 2
                        </button>
                        <button
                            onClick={() => handleSkipToAct(3)}
                            className={`px-4 py-2 rounded-lg font-bold text-xs uppercase transition-all ${currentAct === 3
                                ? 'bg-red-600 text-white border-2 border-red-400'
                                : 'bg-black/70 text-red-300 border border-red-500/50 hover:bg-red-900/50'
                                }`}
                        >
                            🧪 ACT 3
                        </button>
                    </div>
                    {/* 右侧功能侧边栏 */}
                    <div className="absolute top-32 right-6 z-[100] flex flex-col gap-5">
                        {/* 图鉴系统 (Collection) */}
                        <button
                            onClick={() => setShowCollection(true)}
                            className="w-16 h-16 bg-slate-900/90 border border-[#C8AA6E] rounded-lg flex items-center justify-center hover:scale-110 transition-transform group relative shadow-lg shadow-black/50"
                        >
                            <img
                                src={COLLECTION_ICON}
                                alt="图鉴入口"
                                className="w-12 h-12 object-contain drop-shadow-[0_0_8px_rgba(200,170,110,0.7)]"
                                draggable="false"
                            />
                            <div className="absolute right-full mr-3 bg-slate-900 text-[#C8AA6E] text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-[#C8AA6E]/30 pointer-events-none">
                                图鉴 (Collection)
                            </div>
                        </button>
                        {/* 背包系统 */}
                        <button
                            onClick={() => openInventory('CARDS')}
                            className="w-16 h-16 bg-slate-900/90 border border-[#C8AA6E] rounded-lg flex items-center justify-center hover:scale-110 transition-transform group relative shadow-lg shadow-black/50"
                        >
                            <img
                                src={BACKPACK_ICON}
                                alt="背包入口"
                                className="w-12 h-12 object-contain drop-shadow-[0_0_8px_rgba(200,170,110,0.7)]"
                                draggable="false"
                            />
                            <div className="absolute right-full mr-3 bg-slate-900 text-[#C8AA6E] text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-[#C8AA6E]/30 pointer-events-none">
                                背包 (Inventory)
                            </div>
                        </button>
                        {/* 成就系统 */}
                        <div className="flex flex-col items-center gap-1">
                            <button
                                onClick={() => setShowAchievementPanel(true)}
                                className="w-16 h-16 bg-slate-900/90 border border-cyan-400 rounded-lg flex items-center justify-center hover:scale-110 transition-transform group relative shadow-lg shadow-black/50"
                            >
                                <img
                                    src={ACHIEVEMENT_ICON}
                                    alt="成就入口"
                                    className="w-12 h-12 object-contain drop-shadow-[0_0_8px_rgba(34,211,238,0.7)]"
                                    draggable="false"
                                />
                                <div className="absolute right-full mr-3 bg-slate-900 text-cyan-300 text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-cyan-400/30 pointer-events-none">
                                    成就 (Achievements)
                                </div>
                            </button>
                            <span className={`text-[10px] uppercase tracking-[0.4em] ${achievementsEnabled ? 'text-emerald-300' : 'text-red-400'}`}>
                                {achievementsEnabled ? '已开启' : '已暂停'}
                            </span>
                        </div>
                    </div>
                    <GridMapView_v3 mapData={mapData} onNodeSelect={handleNodeSelect} currentFloor={currentFloor} act={currentAct} activeNode={activeNode} lockedChoices={lockedChoices} />
                </div>
            );
            case 'SHOP': return <ShopView gold={gold} deck={masterDeck} relics={relics} onLeave={() => completeNode()} onBuyCard={handleBuyCard} onBuyRelic={handleBuyRelic} onUpgradeCard={handleUpgradeCard} onBuyMana={handleBuyMana} championName={champion.name} act={currentAct} />;
            case 'EVENT': return <EventView onLeave={() => completeNode()} onReward={handleEventReward} />;
            case 'CHEST': return <ChestView onLeave={() => completeNode()} onRelicReward={handleRelicReward} relics={relics} act={currentAct} />;
            case 'COMBAT':
                if (!champion) return <div>Loading...</div>;
                return (
                    <BattleScene
                        heroData={{ ...champion, maxHp, currentHp, relics, baseStr }}
                        enemyId={activeNode?.enemyId}
                        initialDeck={masterDeck}
                        onWin={handleBattleWin}
                        onLose={() => {
                            localStorage.removeItem(SAVE_KEY);
                            setView('GAMEOVER');
                        }}
                        floorIndex={currentFloor}
                        act={currentAct}
                        ascensionLevel={ascensionLevel}
                        onGoldChange={handleBattleGoldChange}
                        openingDrawBonus={nextBattleDrawBonus}
                        onConsumeOpeningDrawBonus={() => setNextBattleDrawBonus(0)}
                        openingManaBonus={nextBattleManaBonus}
                        onConsumeOpeningManaBonus={() => setNextBattleManaBonus(0)}
                    />
                );
            case 'REWARD': return <RewardView goldReward={50} onCardSelect={handleCardReward} onSkip={handleSkipReward} championName={champion.name} />;
            case 'REST': return <RestView onRest={handleRest} />;
            case 'VICTORY_ALL': return (
                <div className="h-screen w-full bg-[#0AC8B9]/20 flex flex-col items-center justify-center text-white">
                    <h1 className="text-6xl font-bold text-[#0AC8B9]">传奇永不熄灭！</h1>
                    <div className="mt-4 text-xl text-[#0AC8B9]/80 italic">当前周目: {ascensionLevel} → 下一周目: {ascensionLevel + 1}</div>
                    <button 
                        onClick={() => {
                            setAscensionLevel(prev => prev + 1);
                            setView('MENU');
                        }} 
                        className="mt-8 px-8 py-3 bg-[#0AC8B9] text-black font-bold rounded hover:bg-[#0AC8B9]/80 transition-all"
                    >
                        开启新轮回
                    </button>
                </div>
            );
            case 'GAMEOVER': return <div className="h-screen w-full bg-black flex flex-col items-center justify-center text-white"><h1 className="text-6xl font-bold text-red-600">战败</h1><button onClick={() => setView('MENU')} className="mt-8 px-8 py-3 bg-red-800 rounded font-bold">回到菜单</button></div>;
            default: return <div>Loading...</div>;
        }
    };

    if (!loginComplete) {
        return <LoginView onLogin={handleLoginSuccess} />;
    }

    const renderUserPanel = () => {
        if (!currentUser) return null;
        return (
            <div className="absolute top-4 right-28 z-[120] flex items-center gap-3 bg-gradient-to-r from-black/70 to-slate-900/70 px-4 py-2 rounded-full border border-white/20 shadow-[0_0_30px_rgba(0,0,0,0.7)] text-sm text-white">
                <div className="flex items-center gap-2">
                    <UserSquare className="w-5 h-5 text-amber-400" />
                    <div className="text-xs uppercase tracking-[0.3em] text-right font-semibold">
                        {currentUser.username || currentUser.email}
                    </div>
                </div>
                <button onClick={handleLogout} className="flex items-center gap-1 px-3 py-1 border border-transparent rounded-full bg-white/10 hover:bg-white/30 transition text-xs uppercase tracking-[0.3em]">
                    <LogOut className="w-3 h-3" />
                    Logout
                </button>
            </div>
        )
    };

    const handleResetProgress = () => {
        if (!currentUser) return;
        if (!window.confirm('重置会清除该账号现有进度并重新进入选人，请确认继续。')) return;
        localStorage.removeItem(getSaveKey(currentUser));
        setHasSave(false);
        setMapData({ grid: [], nodes: [], nodeMap: new Map() });
        setActiveNode(null);
        setChampion(null);
        setView('CHAMPION_SELECT');
    };

    const handleExitBattle = () => {
        if (view !== 'COMBAT') return;
        setView('MAP');
    };

    // [DEV ONLY] 跳转到指定ACT（测试用）
    const handleSkipToAct = (targetAct) => {
        if (!champion) return;
        setMapData(null); // 触发加载屏幕
        setTimeout(() => {
            const newMapData = generateGridMap(targetAct, []);
            setMapData(newMapData);
            setShowDeadEndPrompt(!hasAvailableNeighbors(newMapData.nodes, newMapData.grid, newMapData.totalFloors));
            if (newMapData.startNode) {
                setActiveNode(newMapData.startNode);
            }
            setCurrentAct(targetAct);
            setCurrentFloor(0);
            setLockedChoices(new Set());
            // 恢复一些HP以便测试
            setCurrentHp(Math.min(maxHp, currentHp + Math.floor(maxHp * 0.5)));
            setView('MAP');
        }, 100);
    };

    return (
        <div className="relative h-screen w-full bg-[#091428] font-sans select-none overflow-hidden">
            <button
                onClick={() => setLanguage(prev => prev === 'en' ? 'zh' : 'en')}
                className="fixed top-4 right-16 z-[110] px-3 py-1.5 rounded-full border border-white/30 bg-black/50 hover:bg-white/10 text-xs font-semibold text-white uppercase tracking-[0.25em] pointer-events-auto"
            >
                {language === 'en' ? '中文' : 'EN'}
            </button>
            <AudioPlayer src={bgmStarted || view !== 'MENU' ? getCurrentBgm() : null} />
            {renderUserPanel()}
            {view === 'MAP' && showDeadEndPrompt && (
                <div className="absolute inset-0 z-[110] flex flex-col items-center justify-center bg-black/70 text-white px-6 text-center">
                    <div className="bg-slate-900/80 border border-red-500/60 p-6 rounded-lg shadow-[0_0_30px_rgba(0,0,0,0.8)] max-w-xl">
                        <p className="text-lg font-semibold text-red-300 mb-3">死胡同警告</p>
                        <p className="text-sm text-slate-200 mb-4 leading-relaxed">
                            刺客 - 艾克对你大吼：“时间不在于你拥有多少，而在于你怎样使用。”你被时间的 R 技能「时空断裂」击中，即将被回溯到泉水边。
                        </p>
                        <div className="flex items-center justify-center">
                            <button
                                onClick={handleRestartMap}
                                className="px-6 py-2 rounded-full bg-red-500 hover:bg-red-400 text-xs uppercase tracking-[0.4em]"
                            >
                                确认
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {view !== 'GAMEOVER' && view !== 'VICTORY_ALL' && view !== 'MENU' && view !== 'CHAMPION_SELECT' && champion && (
                <>
                    {view === 'MAP' && currentUser && (
                        <div className="absolute top-24 right-5 z-[115] flex flex-col items-end text-right">
                            <button
                                onClick={handleResetProgress}
                                className="px-4 py-1.5 rounded-full border border-red-500 text-red-200 bg-black/60 hover:bg-red-500/20 transition text-xs uppercase tracking-[0.4em]"
                            >
                                重置进度
                            </button>
                        </div>
                    )}
                    <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-black to-transparent z-50 flex items-center justify-between px-8 pointer-events-none relative">
                        <div className="flex items-center gap-6 pointer-events-auto">
                            <div className="relative group">
                                <img src={champion.avatar} className="w-12 h-12 rounded-full border-2 border-[#C8AA6E] shadow-lg" />
                                <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-[#091428] rounded-full border border-[#C8AA6E] flex items-center justify-center text-xs font-bold text-[#C8AA6E]">{currentFloor + 1}F</div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="flex flex-col">
                                    <span className="text-[#F0E6D2] font-bold text-lg shadow-black drop-shadow-md flex items-center gap-2">
                                        {champion.name}
                                        {RELIC_DATABASE[champion.relicId] && (
                                            <RelicTooltip relic={RELIC_DATABASE[champion.relicId]}>
                                                <img
                                                    src={RELIC_DATABASE[champion.relicId].img || 'https://ddragon.leagueoflegends.com/cdn/13.1.1/img/profileicon/29.png'}
                                                    className="w-6 h-6 rounded border border-yellow-400 bg-black/50 cursor-help hover:scale-110 transition-transform"
                                                    alt={RELIC_DATABASE[champion.relicId].name || 'relic'}
                                                />
                                            </RelicTooltip>
                                        )}
                                    </span>
                                    <div className="flex items-center gap-4 text-sm font-bold"><span className="text-red-400 flex items-center gap-1"><Heart size={14} fill="currentColor" /> {currentHp}/{maxHp}</span><span className="text-yellow-400 flex items-center gap-1"><Coins size={14} fill="currentColor" /> {gold}</span></div>
                                </div>
                                {/* 遗物栏 - 紧邻被动技能右侧 */}
                                <div className="flex gap-2 flex-wrap max-w-md">
                                    {relics.filter(rid => rid !== champion.relicId).map((rid, i) => {
                                        const relic = RELIC_DATABASE[rid];
                                        if (!relic) return null;
                                        return (
                                            <RelicTooltip key={i} relic={relic}>
                                                <div className="w-9 h-9 rounded border border-[#C8AA6E]/50 bg-black/50 relative group cursor-help hover:scale-110 transition-transform">
                                                    <img src={relic.img || 'https://ddragon.leagueoflegends.com/cdn/13.1.1/img/profileicon/29.png'} className="w-full h-full object-cover" alt={relic.name || 'relic'} />
                                                </div>
                                            </RelicTooltip>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                        {view === 'COMBAT' && (
                            <div className="absolute left-1/2 -translate-x-1/2 pointer-events-auto">
                                <button
                                    onClick={handleExitBattle}
                                    className="px-5 py-2 rounded-full border border-white/40 bg-black/60 text-white text-xs uppercase tracking-[0.4em] hover:bg-white/10 transition"
                                >
                                    退出战斗
                                </button>
                            </div>
                        )}
                    </div>
                </>
            )}
            {isGMUser && (
                <div className="absolute bottom-6 right-6 z-[200] pointer-events-auto flex flex-col items-end gap-2">
                    <button
                        onClick={() => setShowGMPanel(true)}
                        className="px-4 py-2 rounded-full bg-emerald-600/80 hover:bg-emerald-500 text-white text-xs uppercase tracking-[0.4em] border border-emerald-300 shadow-lg"
                    >
                        GM 控制台
                    </button>
                    {gmActive && (
                        <div className="text-[10px] text-emerald-200 bg-emerald-900/40 border border-emerald-700 px-3 py-1 rounded shadow">
                            GM: {gmConfig.note || 'R 技能测试模式'}
                        </div>
                    )}
                </div>
            )}
            {isGMUser && showGMPanel && (
                <GMPanel
                    gmConfig={gmConfig}
                    onChange={updateGmConfig}
                    onClose={() => setShowGMPanel(false)}
                    heroOptions={gmHeroOptions}
                    rSkillCards={gmRSkillCards}
                    cardDatabase={CARD_DATABASE}
                    onResetSave={handleGMResetSave}
                    onResetConfig={() => updateGmConfig(DEFAULT_GM_CONFIG)}
                />
            )}
            {renderView()}
            {showIntro && (
                <IntroVideo onComplete={handleIntroComplete} />
            )}
            {showInventory && (
                <InventoryPanel
                    onClose={() => setShowInventory(false)}
                    deck={masterDeck}
                    relics={relics}
                    champion={champion}
                    baseStr={baseStr}
                    currentHp={currentHp}
                    maxHp={maxHp}
                    gold={gold}
                    onRemoveCard={handleRemoveCard}
                    initialTab={activeInventoryTab}
                    onTabChange={setActiveInventoryTab}
                    pendingRelic={pendingRelic}
                    onRelicReplace={handleRelicReplace}
                    onCancelPendingRelic={handleRejectPendingRelic}
                />
            )}
            {showCodex && <CodexView onClose={() => setShowCodex(false)} />}
            {showCollection && <CollectionSystem onClose={() => setShowCollection(false)} />}
            {showDeck && (
                <DeckView
                    deck={masterDeck}
                    gmConfig={gmActive ? gmConfig : null}
                    onClose={() => setShowDeck(false)}
                />
            )}
            {showAchievementPanel && (
                <AchievementPanel
                    onClose={() => setShowAchievementPanel(false)}
                    enabled={achievementsEnabled}
                    onToggle={handleAchievementToggle}
                    unlockedSnapshot={achievementSnapshot}
                />
            )}
            <AchievementUnlockBanner achievement={recentAchievement} />
            <ToastContainer toasts={toasts} />
            <AchievementDevPanel />
        </div>
    );
}