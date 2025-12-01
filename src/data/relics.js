import { PASSIVE_URL, ITEM_URL } from './constants';

export const RELIC_DATABASE = {
  // 基础被动
  "GarenPassive": { id: "GarenPassive", name: "坚韧", description: "战斗结束时恢复 6 HP", rarity: "PASSIVE", img: `${PASSIVE_URL}/Garen_Passive.png` },
  "DariusPassive": { id: "DariusPassive", name: "出血", description: "每次攻击时，给予敌人 1 层虚弱", rarity: "PASSIVE", img: `${PASSIVE_URL}/Garen_Passive.png` },
  "LuxPassive": { id: "LuxPassive", name: "光芒四射", description: "每回合开始时获得 1 点额外法力", rarity: "PASSIVE", img: `${PASSIVE_URL}/LuxIllumination.png` },
  "JinxPassive": { id: "JinxPassive", name: "爆发", description: "每回合初始手牌数量+1", rarity: "PASSIVE", img: `${PASSIVE_URL}/Jinx_Passive.png` },
  "YasuoPassive": { id: "YasuoPassive", name: "浪客之道", description: "攻击牌暴击几率 +10%", rarity: "PASSIVE", img: `${PASSIVE_URL}/Yasuo_Passive.png` },
  "SonaPassive": { id: "SonaPassive", name: "能量弦", description: "每回合打出第三张卡时，获得 3 点临时护甲", rarity: "PASSIVE", img: `${PASSIVE_URL}/Sona_Passive.png` },
  "EkkoPassive": { id: "EkkoPassive", name: "Z型驱动共振", description: "每次打出消耗卡时，获得 1 点力量", rarity: "PASSIVE", img: `${PASSIVE_URL}/Ekko_P.png` },
  "SylasPassive": { id: "SylasPassive", name: "叛乱", description: "每次打出技能牌时，回复 3 点生命值", rarity: "PASSIVE", img: `${PASSIVE_URL}/SylasP.png` },
  "UrgotPassive": { id: "UrgotPassive", name: "回火", description: "每场战斗开始时获得 15 点护甲", rarity: "PASSIVE", img: `${PASSIVE_URL}/Urgot_Passive.png` },
  "ViktorPassive": { id: "ViktorPassive", name: "光荣进化", description: "每回合开始时，50% 几率获得一张额外基础卡", rarity: "PASSIVE", img: `${PASSIVE_URL}/Viktor_Passive.png` },
  
  // 第二批英雄被动 (11-20)
  "RivenPassive": { id: "RivenPassive", name: "符文之刃", description: "每打出 3 张攻击牌，获得 1 点法力", rarity: "PASSIVE", img: `${PASSIVE_URL}/RivenRunicBlades.png` },
  "TwistedFatePassive": { id: "TwistedFatePassive", name: "灌铅骰子", description: "每次战斗胜利额外获得 15 金币", rarity: "PASSIVE", img: `${PASSIVE_URL}/CardMaster_SealFate.png` },
  "LeeSinPassive": { id: "LeeSinPassive", name: "疾风骤雨", description: "打出技能牌后，下一张攻击牌费用 -1", rarity: "PASSIVE", img: `${PASSIVE_URL}/LeeSinPassive.png` },
  "VaynePassive": { id: "VaynePassive", name: "圣银弩箭", description: "对同一目标连续造成 3 次伤害时，额外造成 10 点伤害", rarity: "PASSIVE", img: `${PASSIVE_URL}/Vayne_SilveredBolts.png` },
  "TeemoPassive": { id: "TeemoPassive", name: "游击战", description: "每回合开始时，给敌人施加 2 层虚弱", rarity: "PASSIVE", img: `${PASSIVE_URL}/Teemo_P.png` },
  "ZedPassive": { id: "ZedPassive", name: "影分身", description: "每回合第一张攻击牌额外造成 50% 伤害", rarity: "PASSIVE", img: `${PASSIVE_URL}/Zed_Passive.png` },
  "NasusPassive": { id: "NasusPassive", name: "汲魂痛击", description: "每次用攻击牌击杀敌人，永久获得 1 点力量", rarity: "PASSIVE", img: `${PASSIVE_URL}/Nasus_Passive.png` },
  "IreliaPassive": { id: "IreliaPassive", name: "热诚", description: "每次击杀敌人，恢复 1 点法力并抽 1 张牌", rarity: "PASSIVE", img: `${PASSIVE_URL}/Irelia_Passive.png` },
  "ThreshPassive": { id: "ThreshPassive", name: "地狱诅咒", description: "每次击杀敌人，永久增加 2 最大生命值", rarity: "PASSIVE", img: `${PASSIVE_URL}/Thresh_Passive.png` },
  "KatarinaPassive": { id: "KatarinaPassive", name: "贪婪", description: "每回合每打出 3 张攻击牌后，下一张攻击牌伤害翻倍", rarity: "PASSIVE", img: `${PASSIVE_URL}/Katarina_Passive.png` },

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

  // 章节专属遗物
  "Cull": { id: "Cull", name: "萃取", price: 400, rarity: "RARE", description: "Act 1 限定：击杀 10 个敌人后获得 300 金币。", img: `${ITEM_URL}/1083.png`, actLock: 1 },
  "DarkSeal": { id: "DarkSeal", name: "黑暗封印", price: 300, rarity: "RARE", description: "Act 1 限定：每次战斗胜利 +2 点最大生命值。", img: `${ITEM_URL}/1082.png`, actLock: 1 },
  "QSS": { id: "QSS", name: "水银饰带", price: 500, rarity: "RARE", description: "Act 2 限定：战斗开始时获得 1 层人工制品，抵挡下一个负面状态。", img: `${ITEM_URL}/3140.png`, actLock: 2 },
  "Executioner": { id: "Executioner", name: "死刑宣告", price: 450, rarity: "RARE", description: "Act 2 限定：攻击施加重伤，目标无法回复生命。", img: `${ITEM_URL}/3123.png`, actLock: 2 },
  "Nashor": { id: "Nashor", name: "纳什之牙", price: 800, rarity: "RARE", description: "Act 3 限定：每回合打出的第 3 张攻击牌伤害翻倍。", img: `${ITEM_URL}/3115.png`, actLock: 3 }
};

