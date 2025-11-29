// cards.js - Legends of the Spire
// 200 cards: 80 hero cards + 120 neutral cards
// Fields: id, name, type (ATTACK/SKILL/POWER), cost, value, rarity, hero, target, effect, effectValue, description, img, price

import { SPELL_URL } from './constants.js';
export const CARD_DATABASE = {
  // ---------- BASIC CARDS ----------
  Strike: { id: 'Strike', hero: 'Neutral', name: '打击', price: 0, type: 'ATTACK', cost: 1, value: 6, description: '造成 6 点伤害。', img: `${SPELL_URL}/SummonerFlash.png`, rarity: 'BASIC' },
  Defend: { id: 'Defend', hero: 'Neutral', name: '防御', price: 0, type: 'SKILL', cost: 1, block: 5, description: '获得 5 点护甲。', img: `${SPELL_URL}/SummonerBarrier.png`, rarity: 'BASIC' },
  Ignite: { id: 'Ignite', hero: 'Neutral', name: '点燃', price: 80, type: 'SKILL', cost: 0, value: 0, effect: 'STRENGTH', effectValue: 2, exhaust: true, description: '获得 2 点力量。消耗。', img: `${SPELL_URL}/SummonerDot.png`, rarity: 'UNCOMMON' },
  Heal: { id: 'Heal', hero: 'Neutral', name: '治疗术', price: 80, type: 'SKILL', cost: 1, effect: 'HEAL', effectValue: 10, exhaust: true, description: '恢复 10 点生命。消耗。', img: `${SPELL_URL}/SummonerHeal.png`, rarity: 'UNCOMMON' },

  // ---------- HERO CARDS (80) ----------
  // Garen
  GarenQ: { id: 'GarenQ', name: '致命打击', type: 'ATTACK', cost: 1, value: 6, rarity: 'COMMON', hero: 'Garen', target: 'single', effect: 'VULNERABLE', effectValue: 2, description: '对单一目标造成8点伤害，并施加2层易伤。', img: `${SPELL_URL}/GarenQ.png`, price: 50 },
  GarenW: { id: 'GarenW', name: '勇气', type: 'SKILL', cost: 1, value: 10, block: 10, rarity: 'UNCOMMON', hero: 'Garen', target: 'self', effect: 'CLEANSE', effectValue: 1, description: '获得10点护甲，清除1个负面状态。', img: `${SPELL_URL}/GarenW.png`, price: 80 },
  GarenE: { id: 'GarenE', name: '审判', type: 'ATTACK', cost: 2, value: 14, rarity: 'UNCOMMON', hero: 'Garen', target: 'single', effect: null, effectValue: 0, description: '对单一目标造成16点伤害。', img: `${SPELL_URL}/GarenE.png`, price: 100 },
  GarenR: { id: 'GarenR', name: '德玛西亚正义', type: 'ATTACK', cost: 3, value: 24, rarity: 'RARE', hero: 'Garen', target: 'single', effect: 'EXECUTE_SCALE', effectValue: 0.5, description: '对目标造成 20 + 50%（目标已损失生命）的真实伤害（单体斩杀）。', img: `${SPELL_URL}/GarenR.png`, price: 150 },

  // Darius
  DariusQ: { id: 'DariusQ', name: '大杀四方', type: 'ATTACK', cost: 1, value: 6, rarity: 'COMMON', hero: 'Darius', target: 'single', effect: 'BLEED', effectValue: 2, description: '造成7点伤害并施加2层流血。', img: `${SPELL_URL}/DariusCleave.png`, price: 50 },
  DariusW: { id: 'DariusW', name: '致残打击', type: 'ATTACK', cost: 1, value: 5, rarity: 'UNCOMMON', hero: 'Darius', target: 'single', effect: 'VULNERABLE', effectValue: 1, description: '造成5点伤害并给予目标1层易伤；本回合你的下一次攻击+3伤害。', img: `${SPELL_URL}/DariusNoxianTacticsONH.png`, price: 80 },
  DariusE: { id: 'DariusE', name: '无情铁手', type: 'SKILL', cost: 2, value: 0, rarity: 'UNCOMMON', hero: 'Darius', target: 'single', effect: 'BLEED_VULN', effectValue: 3, description: '对目标施加3层流血并1层虚弱。', img: `${SPELL_URL}/DariusAxeGrabCone.png`, price: 100 },
  DariusR: { id: 'DariusR', name: '诺克萨斯断头台', type: 'ATTACK', cost: 3, value: 18, rarity: 'RARE', hero: 'Darius', target: 'single', effect: 'BLEED_EXECUTE', effectValue: 2, description: '对目标造成 20 + (流血层数×2) 伤害；若击杀则此卡本局费用变为0。', img: `${SPELL_URL}/DariusExecute.png`, price: 150 },

  // Lux
  LuxQ: { id: 'LuxQ', name: '光之束缚', type: 'ATTACK', cost: 1, value: 8, rarity: 'COMMON', hero: 'Lux', target: 'single', effect: 'VULNERABLE', effectValue: 1, description: '对单体造成9点伤害并施加1层易伤。', img: `${SPELL_URL}/LuxLightBinding.png`, price: 50 },
  LuxW: { id: 'LuxW', name: '结界护盾', type: 'SKILL', cost: 1, value: 6, rarity: 'UNCOMMON', hero: 'Lux', target: 'self', effect: 'DRAW_NEXT', effectValue: 1, description: '获得6护甲；下回合抽1张牌。', img: `${SPELL_URL}/LuxPrismaticWave.png`, price: 80 },
  LuxE: { id: 'LuxE', name: '透光奇点', type: 'ATTACK', cost: 2, value: 12, rarity: 'UNCOMMON', hero: 'Lux', target: 'single', effect: 'BONUS_PER_EXTRA_MANA', effectValue: 2, description: '对单体造成12伤害；若本回合你获得额外法力则每点法力+2伤害。', img: `${SPELL_URL}/LuxLightStrikeKugel.png`, price: 100 },
  LuxR: { id: 'LuxR', name: '终极闪光', type: 'ATTACK', cost: 3, value: 28, rarity: 'RARE', hero: 'Lux', target: 'single', effect: 'CONDITIONAL_DOUBLE', effectValue: 4, description: '对单体造成30伤害；若本回合打出≥4张牌则伤害翻倍。', img: `${SPELL_URL}/LuxR.png`, price: 150 },

  // Jinx
  JinxQ: { id: 'JinxQ', name: '机枪扫射', type: 'ATTACK', cost: 1, value: 8, rarity: 'COMMON', hero: 'Jinx', target: 'single', effect: 'MULTI_HIT', effectValue: 3, isMultiHit: true, hits: 3, description: '对单体造成三段击打（总伤害24）。', img: `${SPELL_URL}/JinxQ.png`, price: 50 },
  JinxW: { id: 'JinxW', name: '电磁炮', type: 'ATTACK', cost: 1, value: 10, rarity: 'UNCOMMON', hero: 'Jinx', target: 'single', effect: 'VULNERABLE', effectValue: 2, description: '对目标造成10伤害并施加2层易伤。', img: `${SPELL_URL}/JinxW.png`, price: 80 },
  JinxE: { id: 'JinxE', name: '火箭陷阱', type: 'SKILL', cost: 1, value: 0, rarity: 'UNCOMMON', hero: 'Jinx', target: 'mark', effect: 'MARK_TRIGGER', effectValue: 12, description: '给目标放置标记；标记被触发时对该目标造成12点伤害。', img: `${SPELL_URL}/JinxE.png`, price: 100 },
  JinxR: { id: 'JinxR', name: '超究极飞弹', type: 'ATTACK', cost: 3, value: 25, rarity: 'RARE', hero: 'Jinx', target: 'single', effect: 'LOW_HP_BONUS', effectValue: 25, description: '对单体造成25伤害；若目标HP<50%再造成25。', img: `${SPELL_URL}/JinxR.png`, price: 150 },

  // Yasuo
  YasuoQ: { id: 'YasuoQ', name: '斩钢闪', type: 'ATTACK', cost: 1, value: 7, rarity: 'COMMON', hero: 'Yasuo', target: 'single', effect: 'CRIT_CHANCE', effectValue: 10, description: '对单体造成7点伤害；暴击率受力量影响。', img: `${SPELL_URL}/YasuoQ1Wrapper.png`, price: 50 },
  YasuoW: { id: 'YasuoW', name: '风之墙', type: 'SKILL', cost: 1, block: 4, rarity: 'UNCOMMON', hero: 'Yasuo', target: 'self', effect: 'IMMUNE_ONCE', effectValue: 1, description: '获得4护甲并免疫一次伤害（本回合）。', img: `${SPELL_URL}/YasuoW.png`, price: 80 },
  YasuoE: { id: 'YasuoE', name: '疾风步', type: 'ATTACK', cost: 0, value: 4, rarity: 'UNCOMMON', hero: 'Yasuo', target: 'single', effect: 'DOUBLE_IF_ATTACKED', effectValue: 0, description: '造成4点伤害；若本回合已打出攻击则伤害翻倍。', img: `${SPELL_URL}/YasuoE.png`, price: 60 },
  YasuoR: { id: 'YasuoR', name: '狂风绝息斩', type: 'ATTACK', cost: 3, value: 6, rarity: 'RARE', hero: 'Yasuo', target: 'single', effect: 'SCALE_BY_CRIT', effectValue: 6, description: '对目标造成 6×（本回合暴击次数） 伤害。', img: `${SPELL_URL}/YasuoR.png`, price: 150 },

  // Sona
  SonaQ: { id: 'SonaQ', name: '英勇赞美诗', type: 'ATTACK', cost: 1, value: 8, rarity: 'COMMON', hero: 'Sona', target: 'single', effect: 'SELF_BLOCK', effectValue: 3, description: '对单体造成8点伤害，同时自身获得3点护甲。', img: `${SPELL_URL}/SonaQ.png`, price: 50 },
  SonaW: { id: 'SonaW', name: '坚毅咏叹调', type: 'SKILL', cost: 1, value: 0, rarity: 'UNCOMMON', hero: 'Sona', target: 'self', effect: 'HEAL', effectValue: 8, description: '恢复8生命。', img: `${SPELL_URL}/SonaW.png`, price: 80 },
  SonaE: { id: 'SonaE', name: '迅捷奏鸣曲', type: 'SKILL', cost: 1, value: 0, rarity: 'UNCOMMON', hero: 'Sona', target: 'self', effect: 'DRAW_MANA', effectValue: 2, description: '抽2张牌并获得1点临时法力。', img: `${SPELL_URL}/SonaE.png`, price: 100 },
  SonaR: { id: 'SonaR', name: '终乐章', type: 'ATTACK', cost: 3, value: 20, rarity: 'RARE', hero: 'Sona', target: 'single', effect: 'PER_CARD_BONUS', effectValue: 2, description: '对单体造成20点伤害；本回合你每打出1张牌，对该目标额外造成2点伤害。', img: `${SPELL_URL}/SonaR.png`, price: 150 },

  // Ekko
  EkkoQ: { id: 'EkkoQ', name: '时间折刃', type: 'ATTACK', cost: 1, value: 8, rarity: 'COMMON', hero: 'Ekko', target: 'single', effect: 'RETRO_BONUS', effectValue: 6, description: '对目标造成8伤；若目标在上回合已受你伤害则额外+6伤害。', img: `${SPELL_URL}/EkkoQ.png`, price: 50 },
  EkkoW: { id: 'EkkoW', name: '时光护盾', type: 'SKILL', cost: 1, value: 10, rarity: 'UNCOMMON', hero: 'Ekko', target: 'self', effect: 'REFLECT_IF_HIT', effectValue: 6, description: '获得10护甲；若下回合被攻击则反弹6伤害给攻击者。', img: `${SPELL_URL}/EkkoW.png`, price: 80 },
  EkkoE: { id: 'EkkoE', name: '相位俯冲', type: 'ATTACK', cost: 1, value: 8, rarity: 'UNCOMMON', hero: 'Ekko', target: 'single', effect: 'NEXT_COST_REDUCE', effectValue: 1, description: '对目标造成8伤；本回合下一张攻击卡费用-1。', img: `${SPELL_URL}/EkkoE.png`, price: 100 },
  EkkoR: { id: 'EkkoR', name: '时空逆转', type: 'SKILL', cost: 3, value: 20, rarity: 'RARE', hero: 'Ekko', target: 'single', effect: 'HEAL_AND_DAMAGE', effectValue: 20, description: '恢复20生命，同时对单体造成20伤害（交换效果）。', img: `${SPELL_URL}/EkkoR.png`, price: 150 },

  // Sylas
  SylasQ: { id: 'SylasQ', name: '锁链鞭笞', type: 'ATTACK', cost: 1, value: 8, rarity: 'COMMON', hero: 'Sylas', target: 'single', effect: null, effectValue: 0, description: '对目标造成8点伤害。', img: `${SPELL_URL}/SylasQ.png`, price: 50 },
  SylasW: { id: 'SylasW', name: '吸取之斩', type: 'ATTACK', cost: 1, value: 8, rarity: 'UNCOMMON', hero: 'Sylas', target: 'single', effect: 'LIFELINK', effectValue: 8, description: '造成8伤并回复8生命。', img: `${SPELL_URL}/SylasW.png`, price: 80 },
  SylasE: { id: 'SylasE', name: '叛乱突袭', type: 'SKILL', cost: 1, value: 6, rarity: 'UNCOMMON', hero: 'Sylas', target: 'self', effect: 'NEXT_ATTACK_DOUBLE', effectValue: 2, description: '获得6护甲；下一次攻击伤害翻倍。', img: `${SPELL_URL}/SylasE.png`, price: 100 },
  SylasR: { id: 'SylasR', name: '夺魂', type: 'SKILL', cost: 3, value: 0, rarity: 'RARE', hero: 'Sylas', target: 'single', effect: 'COPY_ENEMY_ACTION', effectValue: 0, description: '复制目标的下一行动并为自己执行（伤害减半）。', img: `${SPELL_URL}/SylasR.png`, price: 150 },

  // Urgot
  UrgotQ: { id: 'UrgotQ', name: '腐蚀炸弹', type: 'ATTACK', cost: 1, value: 6, rarity: 'COMMON', hero: 'Urgot', target: 'single', effect: null, effectValue: 0, description: '对目标造成7点伤害。', img: `${SPELL_URL}/UrgotQ.png`, price: 50 },
  UrgotW: { id: 'UrgotW', name: '集火屏障', type: 'SKILL', cost: 1, value: 15, block: 15, rarity: 'UNCOMMON', hero: 'Urgot', target: 'self', effect: null, effectValue: 0, description: '获得15护甲。', img: `${SPELL_URL}/UrgotW.png`, price: 80 },
  UrgotE: { id: 'UrgotE', name: '超限驱动', type: 'SKILL', cost: 1, value: 10, rarity: 'UNCOMMON', hero: 'Urgot', target: 'single', effect: 'SELF_DAMAGE', effectValue: 4, description: '对目标造成10伤；自身承受4点反噬。', img: `${SPELL_URL}/UrgotE.png`, price: 100 },
  UrgotR: { id: 'UrgotR', name: '处刑索命', type: 'ATTACK', cost: 3, value: 30, rarity: 'RARE', hero: 'Urgot', target: 'single', effect: 'LOW_HP_EXECUTE', effectValue: 30, description: '对单体造成30伤；若目标HP<30%则直接处决。', img: `${SPELL_URL}/UrgotR.png`, price: 150 },

  // Viktor
  ViktorQ: { id: 'ViktorQ', name: '能量转导', type: 'SKILL', cost: 1, value: 7, rarity: 'COMMON', hero: 'Viktor', target: 'single', effect: 'BUFF_NEXT_SKILL', effectValue: 2, description: '对目标造成7伤；令你下一张技能对该目标伤害+2。', img: `${SPELL_URL}/ViktorPowerTransfer.png`, price: 50 },
  ViktorW: { id: 'ViktorW', name: '引力场', type: 'SKILL', cost: 1, value: 0, rarity: 'UNCOMMON', hero: 'Viktor', target: 'single', effect: 'STUN', effectValue: 1, description: '使目标眩晕1回合。', img: `${SPELL_URL}/ViktorGravitonField.png`, price: 80 },
  ViktorE: { id: 'ViktorE', name: '光束', type: 'ATTACK', cost: 2, value: 12, rarity: 'UNCOMMON', hero: 'Viktor', target: 'single', effect: 'BONUS_IF_VULN', effectValue: 4, description: '对目标造成12伤；若该目标有易伤再+4。', img: `${SPELL_URL}/ViktorDeathRay.png`, price: 100 },
  ViktorR: { id: 'ViktorR', name: '进化歧路', type: 'SKILL', cost: 3, value: 18, rarity: 'RARE', hero: 'Viktor', target: 'single', effect: 'DRAW_ON_USE', effectValue: 1, description: '对目标造成18伤并抽1张牌（进化打点）。', img: `${SPELL_URL}/ViktorChaosStorm.png`, price: 150 },

  LeeR: { id: 'LeeR', name: '猛龙摆尾', type: 'ATTACK', cost: 3, value: 20, rarity: 'RARE', hero: 'LeeSin', target: 'single', effect: 'REMOVE_BUFF', effectValue: 1, description: '对目标造成20伤并移除目标的一个增益。', img: `${SPELL_URL}/LeeR.png`, price: 150 },

  // Vayne
  VayneQ: { id: 'VayneQ', name: '翻滚', type: 'ATTACK', cost: 0, value: 6, rarity: 'COMMON', hero: 'Vayne', target: 'single', effect: 'NEXT_HIT_DOUBLE', effectValue: 2, description: '造成4伤；下一次对同一目标的攻击伤害翻倍。', img: `${SPELL_URL}/VayneTumble.png`, price: 30 },
  VayneE: { id: 'VayneE', name: '墙角突袭', type: 'ATTACK', cost: 1, value: 8, rarity: 'UNCOMMON', hero: 'Vayne', target: 'single', effect: 'STUN_IF_WEAK', effectValue: 1, description: '对目标造成6伤；若目标虚弱则使其眩晕1回合。', img: `${SPELL_URL}/VayneCondemn.png`, price: 100 },
  ZedR: { id: 'ZedR', name: '死亡印记', type: 'SKILL', cost: 3, value: 0, rarity: 'RARE', hero: 'Zed', target: 'single', effect: 'DEATHMARK', effectValue: 3, description: '对目标施加印记（3回合）；若在印记期间造成致命伤害，则额外造成等量伤害。', img: `${SPELL_URL}/ZedR.png`, price: 150 },
  ZedQ: { id: 'ZedQ', name: '手里剑', type: 'ATTACK', cost: 1, value: 9, rarity: 'COMMON', hero: 'Zed', target: 'single', effect: 'MULTI_HIT', effectValue: 3, description: '对目标造成三段伤害，总计9点。', img: `${SPELL_URL}/ZedQ.png`, price: 50 },
  ZedW: { id: 'ZedW', name: '影分身', type: 'SKILL', cost: 1, value: 0, rarity: 'UNCOMMON', hero: 'Zed', target: 'self', effect: 'COPY_NEXT_ATTACK', effectValue: 50, description: '召唤影分身：在本回合复制下一次对单体的攻击（分身造成50%伤害）。', img: `${SPELL_URL}/ZedW.png`, price: 80 },
  ZedE: { id: 'ZedE', name: '影刃', type: 'ATTACK', cost: 1, value: 6, rarity: 'UNCOMMON', hero: 'Zed', target: 'single', effect: 'SLOW', effectValue: 1, description: '造成6伤并使目标减速1回合。', img: `${SPELL_URL}/ZedE.png`, price: 100 },

  // Vayne
  VayneQ: { id: 'VayneQ', name: '闪避突袭', type: 'ATTACK', cost: 1, value: 7, rarity: 'COMMON', hero: 'Vayne', target: 'single', effect: 'NEXT_ATTACK_BONUS', effectValue: 3, description: '造成7伤，下一次攻击+3伤害。', img: `${SPELL_URL}/VayneTumble.png`, price: 50 },
  VayneW: { id: 'VayneW', name: '圣银弩箭', type: 'POWER', cost: 0, value: 0, rarity: 'UNCOMMON', hero: 'Vayne', target: 'self', effect: 'MARK_STACK', effectValue: 3, description: '每3次攻击同一目标触发额外10真实伤害。', img: `${SPELL_URL}/VayneSilveredBolts.png`, price: 80 },
  VaynePassive: { id: 'VaynePassive', name: '圣银弩箭被动', type: 'POWER', cost: 0, value: 0, rarity: 'COMMON', hero: 'Vayne', target: 'self', effect: 'TRIPLE_CHAIN_BONUS', effectValue: 15, description: '对同一目标连续造成3次伤害时，第3次造成额外12点真实伤害（单体被动）。', img: `${SPELL_URL}/VaynePassive.png`, price: 0 },
  VayneE: { id: 'VayneE', name: '墙角突袭', type: 'ATTACK', cost: 1, value: 8, rarity: 'UNCOMMON', hero: 'Vayne', target: 'single', effect: 'STUN_IF_WEAK', effectValue: 1, description: '对目标造成6伤；若目标虚弱则使其眩晕1回合。', img: `${SPELL_URL}/VayneCondemn.png`, price: 100 },

  // Teemo
  TeemoQ: { id: 'TeemoQ', name: '致盲吹箭', type: 'ATTACK', cost: 1, value: 6, rarity: 'COMMON', hero: 'Teemo', target: 'single', effect: 'WEAK', effectValue: 2, description: '造成6伤并使目标虚弱2（致盲效果）。', img: `${SPELL_URL}/TeemoQ.png`, price: 50 },
  TeemoW: { id: 'TeemoW', name: '疾速行军', type: 'SKILL', cost: 1, value: 5, rarity: 'UNCOMMON', hero: 'Teemo', target: 'self', effect: 'DRAW', effectValue: 1, description: '抽1张牌并获得5护甲。', img: `${SPELL_URL}/TeemoW.png`, price: 80 },
  TeemoE: { id: 'TeemoE', name: '毒性射击', type: 'ATTACK', cost: 1, value: 0, rarity: 'UNCOMMON', hero: 'Teemo', target: 'single', effect: 'POISON', effectValue: 3, description: '对目标施加3层毒（目标单体持续伤害）。', img: `${SPELL_URL}/TeemoE.png`, price: 100 },

  // Thresh
  ThreshQ: { id: 'ThreshQ', name: '死亡判决', type: 'ATTACK', cost: 1, value: 8, rarity: 'COMMON', hero: 'Thresh', target: 'single', effect: 'PULL', effectValue: 1, description: '造成8伤并拉近目标（使其下一次攻击伤害+2）。', img: `${SPELL_URL}/ThreshQ.png`, price: 50 },
  ThreshW: { id: 'ThreshW', name: '魂灯灯笼', type: 'SKILL', cost: 1, value: 0, rarity: 'UNCOMMON', hero: 'Thresh', target: 'self', effect: 'HEAL', effectValue: 8, description: '恢复8生命。', img: `${SPELL_URL}/ThreshW.png`, price: 80 },
  ThreshE: { id: 'ThreshE', name: '罪恶引', type: 'SKILL', cost: 1, value: 0, rarity: 'UNCOMMON', hero: 'Thresh', target: 'single', effect: 'WEAK', effectValue: 2, description: '使目标虚弚2。', img: `${SPELL_URL}/ThreshE.png`, price: 100 },
  ThreshR: { id: 'ThreshR', name: '幽冥监牢', type: 'SKILL', cost: 3, value: 0, rarity: 'RARE', hero: 'Thresh', target: 'single', effect: 'WEAK_VULN_AND_PERMAHP', effectValue: 2, description: '使目标虚弚2并易伤2；若随后击杀该目标则永久+2最大生命。', img: `${SPELL_URL}/ThreshRPenta.png`, price: 150 },

  // Teemo
  TeemoW: { id: 'TeemoW', name: '小跑', type: 'SKILL', cost: 1, value: 0, rarity: 'COMMON', hero: 'Teemo', target: 'self', effect: 'DRAW', effectValue: 2, description: '抽2张牌。', img: `${SPELL_URL}/MoveQuick.png`, price: 60 },
  TeemoE: { id: 'TeemoE', name: '毒性射击', type: 'ATTACK', cost: 1, value: 5, rarity: 'UNCOMMON', hero: 'Teemo', target: 'single', effect: 'POISON', effectValue: 3, description: '造成5伤并附加3层中毒。', img: `${SPELL_URL}/ToxicShot.png`, price: 80 },

  // Nasus
  NasusQ: { id: 'NasusQ', name: '汲魂痛击', type: 'ATTACK', cost: 1, value: 8, rarity: 'COMMON', hero: 'Nasus', target: 'single', effect: 'PERMA_STR_ON_KILL', effectValue: 1, description: '造成8伤；若本牌击杀目标则永久获得+1力量（跨战斗或本局设置）。', img: `${SPELL_URL}/NasusQ.png`, price: 50 },
  NasusW: { id: 'NasusW', name: '腐化咒', type: 'SKILL', cost: 1, value: 0, rarity: 'UNCOMMON', hero: 'Nasus', target: 'single', effect: 'WEAK_VULN', effectValue: 2, description: '使目标虚弱2并易伤1。', img: `${SPELL_URL}/NasusW.png`, price: 80 },
  NasusE: { id: 'NasusE', name: '灵魂烈焰', type: 'ATTACK', cost: 2, value: 10, rarity: 'UNCOMMON', hero: 'Nasus', target: 'single', effect: 'STR_DEBUFF', effectValue: 2, description: '对目标造成10伤并减少其力量2。', img: `${SPELL_URL}/NasusE.png`, price: 100 },
  NasusR: { id: 'NasusR', name: '狂沙之怒', type: 'POWER', cost: 3, value: 8, rarity: 'RARE', hero: 'Nasus', target: 'self', effect: 'TEMP_STR', effectValue: 8, description: '本回合力量+8。', img: `${SPELL_URL}/NasusR.png`, price: 150 },

  // Irelia
  IreliaQ: { id: 'IreliaQ', name: '利刃冲击', type: 'ATTACK', cost: 1, value: 8, rarity: 'COMMON', hero: 'Irelia', target: 'single', effect: 'KILL_REWARD', effectValue: 1, description: '造成6伤；若击杀目标则抽1并回复1法力。', img: `${SPELL_URL}/IreliaQ.png`, price: 50 },
  IreliaW: { id: 'IreliaW', name: '反击之舞', type: 'SKILL', cost: 1, value: 12, rarity: 'UNCOMMON', hero: 'Irelia', target: 'self', effect: 'REFLECT_BUFF', effectValue: 2, description: '获得12护甲；若被命中则下一次攻击伤害×2。', img: `${SPELL_URL}/IreliaW.png`, price: 80 },
  IreliaE: { id: 'IreliaE', name: '束缚之刃', type: 'ATTACK', cost: 1, value: 8, rarity: 'UNCOMMON', hero: 'Irelia', target: 'single', effect: 'STUN', effectValue: 1, description: '对目标造成8伤并使其眩晕1回合。', img: `${SPELL_URL}/IreliaE.png`, price: 100 },
  IreliaR: { id: 'IreliaR', name: '先锋突袭', type: 'ATTACK', cost: 3, value: 12, rarity: 'RARE', hero: 'Irelia', target: 'single', effect: 'ALL_ATTACKS_BONUS', effectValue: 2, description: '造成12伤；本回合你所有对该目标的攻击额外+2伤。', img: `${SPELL_URL}/IreliaR.png`, price: 150 },

  // Thresh
  ThreshQ: { id: 'ThreshQ', name: '生死判决', type: 'ATTACK', cost: 1, value: 8, rarity: 'COMMON', hero: 'Thresh', target: 'single', effect: 'PULL', effectValue: 0, description: '造成8伤并拉近目标（影响下一回合的决策）。', img: `${SPELL_URL}/ThreshQ.png`, price: 50 },
  ThreshW: { id: 'ThreshW', name: '灵魂灯笼', type: 'SKILL', cost: 1, value: 0, rarity: 'UNCOMMON', hero: 'Thresh', target: 'self', effect: 'HEAL', effectValue: 8, description: '恢复8生命。', img: `${SPELL_URL}/ThreshW.png`, price: 80 },
  ThreshE: { id: 'ThreshE', name: '罪恶引', type: 'SKILL', cost: 1, value: 0, rarity: 'UNCOMMON', hero: 'Thresh', target: 'single', effect: 'WEAK', effectValue: 2, description: '使目标虚弱2。', img: `${SPELL_URL}/ThreshE.png`, price: 100 },
  ThreshR: { id: 'ThreshR', name: '幽冥监牢', type: 'SKILL', cost: 3, value: 0, rarity: 'RARE', hero: 'Thresh', target: 'single', effect: 'WEAK_VULN_AND_PERMAHP', effectValue: 2, description: '使目标虚弱2并易伤2；若随后击杀该目标则永久+2最大生命。', img: `${SPELL_URL}/ThreshR.png`, price: 150 },

  // Katarina
  KatarinaQ: { id: 'KatarinaQ', name: '弧刃斩', type: 'ATTACK', cost: 1, value: 10, rarity: 'COMMON', hero: 'Katarina', target: 'single', effect: 'MULTI_HIT', effectValue: 3, description: '对目标进行三段攻击，总计9伤。', img: `${SPELL_URL}/KatarinaQ.png`, price: 50 },
  KatarinaW: { id: 'KatarinaW', name: '迅刃突袭', type: 'ATTACK', cost: 1, value: 9, rarity: 'UNCOMMON', hero: 'Katarina', target: 'single', effect: 'DRAW_ON_HIT', effectValue: 1, description: '造成8伤并抽1张牌。', img: `${SPELL_URL}/KatarinaW.png`, price: 80 },
  KatarinaE: { id: 'KatarinaE', name: '蛇步闪击', type: 'ATTACK', cost: 1, value: 7, rarity: 'UNCOMMON', hero: 'Katarina', target: 'single', effect: 'COMBO_BONUS', effectValue: 4, description: '造成6伤；若本回合你已造成伤害则本牌额外+4。', img: `${SPELL_URL}/KatarinaEWrapper.png`, price: 100 },
  KatarinaR: { id: 'KatarinaR', name: '死亡莲华', type: 'ATTACK', cost: 3, value: 30, rarity: 'RARE', hero: 'Katarina', target: 'single', effect: 'MULTI_STRIKE_SEGMENTS', effectValue: 5, description: '对单体造成5段6伤，共30伤（分段判定，单体）。', img: `${SPELL_URL}/KatarinaR.png`, price: 150 },

  // ---------- END HERO CARDS (80) ----------
  // ---------- NEUTRAL CARDS (120) ----------
  // We'll enumerate neutral cards id'ed as Neutral_001 ... Neutral_120
  Neutral_001: { id: 'Neutral_001', name: '破绽刺击', type: 'ATTACK', cost: 1, value: 6, rarity: 'COMMON', hero: 'Neutral', target: 'single', effect: 'BONUS_IF_MARKED', effectValue: 4, description: '对目标造成6点伤；若目标有标记则再造成4点伤。', img: `${SPELL_URL}/SummonerExhaust.png`, price: 50 },
  Neutral_002: { id: 'Neutral_002', name: '致盲烟幕', type: 'ATTACK', cost: 1, value: 4, rarity: 'COMMON', hero: 'Neutral', target: 'single', effect: 'WEAK', effectValue: 2, description: '造成4点伤并使目标虚弱2。', img: `${SPELL_URL}/SummonerSmite.png`, price: 50 },
  Neutral_003: { id: 'Neutral_003', name: '缚魂钩', type: 'SKILL', cost: 1, value: 5, rarity: 'UNCOMMON', hero: 'Neutral', target: 'mark', effect: 'TETHER_MARK', effectValue: 8, description: '对目标造成5伤并在其上放置“牵绊”标记：若你下回合对其攻击则额外触发8伤。', img: `${SPELL_URL}/SummonerExhaust.png`, price: 80 },
  Neutral_004: { id: 'Neutral_004', name: '破甲一击', type: 'ATTACK', cost: 2, value: 12, rarity: 'UNCOMMON', hero: 'Neutral', target: 'single', effect: 'ARMOR_REDUCE', effectValue: 6, description: '造成12点伤并减少目标护甲6点。', img: `${SPELL_URL}/SummonerIgnite.png`, price: 100 },
  Neutral_005: { id: 'Neutral_005', name: '扰心之刃', type: 'ATTACK', cost: 1, value: 6, rarity: 'UNCOMMON', hero: 'Neutral', target: 'single', effect: 'DEBUFF_CARD', effectValue: -1, description: '造成6点伤并使目标下一张卡效果降低1（若实现对 AI 非真实卡改为降低下一行动威力）。', img: `${SPELL_URL}/SummonerExhaust.png`, price: 80 },
  Neutral_006: { id: 'Neutral_006', name: '缠绕陷阱', type: 'SKILL', cost: 1, value: 0, rarity: 'UNCOMMON', hero: 'Neutral', target: 'mark', effect: 'TRAP_TRIGGER', effectValue: 10, description: '在目标上放置陷阱标记：若目标下回合尝试攻击或打牌，则触发对该目标造成10伤。', img: `${SPELL_URL}/SummonerExhaust.png`, price: 90 },
  Neutral_007: { id: 'Neutral_007', name: '逆流牵制', type: 'ATTACK', cost: 1, value: 10, rarity: 'UNCOMMON', hero: 'Neutral', target: 'single', effect: 'REMOVE_BUFF', effectValue: 1, description: '若目标本回合有增益，则对其造成10伤并移除一个增益。', img: `${SPELL_URL}/SummonerSmite.png`, price: 100 },
  Neutral_008: { id: 'Neutral_008', name: '强制斩击', type: 'ATTACK', cost: 2, value: 14, rarity: 'UNCOMMON', hero: 'Neutral', target: 'single', effect: 'FREE_IF_WEAK', effectValue: 0, description: '对单体造成14伤；若目标虚弱则费用变为0。', img: `${SPELL_URL}/SummonerIgnite.png`, price: 120 },

  Neutral_009: { id: 'Neutral_009', name: '净化之页', type: 'SKILL', cost: 0, value: 0, rarity: 'COMMON', hero: 'Neutral', target: 'self', effect: 'DRAW', effectValue: 2, description: '抽2张牌。', img: `${SPELL_URL}/SummonerFlash.png`, price: 40 },
  Neutral_010: { id: 'Neutral_010', name: '法力容器', type: 'SKILL', cost: 1, value: 0, rarity: 'COMMON', hero: 'Neutral', target: 'self', effect: 'TEMP_MANA', effectValue: 1, description: '获得1点临时法力（本回合）。', img: `${SPELL_URL}/SummonerClarity.png`, price: 50 },
  Neutral_011: { id: 'Neutral_011', name: '贪婪商券', type: 'SKILL', cost: 0, value: 10, rarity: 'COMMON', hero: 'Neutral', target: 'self', effect: 'GAIN_GOLD', effectValue: 10, description: '获得10金币；若弃置此牌则额外获得10金币（弃置风险换奖励）。', img: `${SPELL_URL}/SummonerTeleport.png`, price: 30 },
  Neutral_012: { id: 'Neutral_012', name: '战争学识', type: 'SKILL', cost: 1, value: 0, rarity: 'UNCOMMON', hero: 'Neutral', target: 'self', effect: 'CONDITIONAL_DRAW', effectValue: 2, description: '抽1；若本回合已打出≥2张攻击则改为抽2。', img: `${SPELL_URL}/SummonerGhost.png`, price: 80 },
  Neutral_013: { id: 'Neutral_013', name: '战术速记', type: 'SKILL', cost: 1, value: 0, rarity: 'UNCOMMON', hero: 'Neutral', target: 'self', effect: 'NEXT_DRAW_PLUS', effectValue: 1, description: '下回合先手抽牌+1。', img: `${SPELL_URL}/SummonerGhost.png`, price: 80 },
  Neutral_014: { id: 'Neutral_014', name: '暗影笔记', type: 'SKILL', cost: 0, value: 0, rarity: 'RARE', hero: 'Neutral', target: 'single', effect: 'SCOUT', effectValue: 1, description: '查看目标下一个行动（在 AI 环境中为查看其策略）。', img: `${SPELL_URL}/SummonerClairvoyance.png`, price: 120 },
  Neutral_015: { id: 'Neutral_015', name: '金币押注', type: 'SKILL', cost: 0, value: 0, rarity: 'RARE', hero: 'Neutral', target: 'self', effect: 'GAMBLE', effectValue: 30, description: '50%获得+30G，50%失去10HP（高风险高回报）。', img: `${SPELL_URL}/SummonerTeleport.png`, price: 0 },
  Neutral_016: { id: 'Neutral_016', name: '法力石碎片', type: 'SKILL', cost: 0, value: 0, rarity: 'COMMON', hero: 'Neutral', target: 'self', effect: 'MANA_IF_LOW_HAND', effectValue: 1, description: '若你手牌≤3，则获得1法力并抽1。', img: `${SPELL_URL}/SummonerClarity.png`, price: 40 },

  Neutral_017: { id: 'Neutral_017', name: '求知铭文', type: 'POWER', cost: 2, value: 0, rarity: 'RARE', hero: 'Neutral', target: 'self', effect: 'PERMA_DRAW_ON_KILL', effectValue: 1, description: '每次击杀单位（非 boss）永久+1抽牌（慎用）。', img: `${SPELL_URL}/SummonerSnowball.png`, price: 200 },
  Neutral_018: { id: 'Neutral_018', name: '匠魂之锤', type: 'SKILL', cost: 2, value: 0, rarity: 'RARE', hero: 'Neutral', target: 'self', effect: 'PERMA_UPGRADE_CARD', effectValue: 1, description: '选择一张卡永久+1数值（或-1费用）。', img: `${SPELL_URL}/SummonerSnowball.png`, price: 220 },
  Neutral_019: { id: 'Neutral_019', name: '荣誉奖章', type: 'SKILL', cost: 1, value: 0, rarity: 'COMMON', hero: 'Neutral', target: 'self', effect: 'WIN_GOLD_BONUS', effectValue: 10, description: '战斗胜利时获得额外+10金币（可叠）。', img: `${SPELL_URL}/SummonerTeleport.png`, price: 60 },
  Neutral_020: { id: 'Neutral_020', name: '猎手徽章', type: 'POWER', cost: 1, value: 0, rarity: 'UNCOMMON', hero: 'Neutral', target: 'self', effect: 'TEMP_STR_ON_KILLS', effectValue: 2, description: '若本局击杀≥5，立即获得本局力量+2（战斗内成长）。', img: `${SPELL_URL}/SummonerHaste.png`, price: 120 },
  Neutral_021: { id: 'Neutral_021', name: '野心契约', type: 'SKILL', cost: 0, value: 0, rarity: 'RARE', hero: 'Neutral', target: 'self', effect: 'PERMA_STR_FOR_HP', effectValue: 1, description: '牺牲5最大生命 → 永久+1力量（高代价长期收益）。', img: `${SPELL_URL}/SummonerHaste.png`, price: 0 },
  Neutral_022: { id: 'Neutral_022', name: '古老碑铭', type: 'POWER', cost: 3, value: 0, rarity: 'RARE', hero: 'Neutral', target: 'self', effect: 'DRAW_AT_START', effectValue: 1, description: '战斗开始时若持有本卡则每回合开始额外抽1张（持续战斗期）。', img: `${SPELL_URL}/SummonerSnowball.png`, price: 200 },

  Neutral_023: { id: 'Neutral_023', name: '逆向引擎', type: 'SKILL', cost: 1, value: 0, rarity: 'UNCOMMON', hero: 'Neutral', target: 'self', effect: 'RECYCLE', effectValue: 1, description: '从弃牌堆将一张卡返回手牌。', img: `${SPELL_URL}/SummonerFlash.png`, price: 80 },
  Neutral_024: { id: 'Neutral_024', name: '献祭之环', type: 'SKILL', cost: 1, value: 0, rarity: 'UNCOMMON', hero: 'Neutral', target: 'self', effect: 'SELF_HP_FOR_BLOCK', effectValue: 12, description: '牺牲6生命获得12护甲。', img: `${SPELL_URL}/SummonerHeal.png`, price: 70 },
  Neutral_025: { id: 'Neutral_025', name: '随风信笺', type: 'SKILL', cost: 0, value: 0, rarity: 'COMMON', hero: 'Neutral', target: 'self', effect: 'DISCOUNT_ONE_CARD', effectValue: 1, description: '随机选择一张手牌使其本回合费用-1；结束回合后该卡被移除(消耗版)。', img: `${SPELL_URL}/SummonerGhost.png`, price: 40 },
  Neutral_026: { id: 'Neutral_026', name: '暗金卷轴', type: 'SKILL', cost: 2, value: 0, rarity: 'RARE', hero: 'Neutral', target: 'self', effect: 'UPGRADE_CARD', effectValue: 1, description: '立即升级一张非BASIC卡（+3数值或-1费用）。', img: `${SPELL_URL}/SummonerSnowball.png`, price: 200 },
  Neutral_027: { id: 'Neutral_027', name: '诱饵之箱', type: 'SKILL', cost: 1, value: 0, rarity: 'UNCOMMON', hero: 'Neutral', target: 'mark', effect: 'BAIT_TRIGGER', effectValue: 8, description: '放置诱饵标记；若目标尝试触发则对其造成8伤。', img: `${SPELL_URL}/SummonerExhaust.png`, price: 80 },
  Neutral_028: { id: 'Neutral_028', name: '回旋弹', type: 'ATTACK', cost: 1, value: 9, rarity: 'UNCOMMON', hero: 'Neutral', target: 'single', effect: 'NEXT_ENEMY_COST_PLUS', effectValue: 1, description: '造成9伤并使敌人下一张卡费用+1（资源压制）。', img: `${SPELL_URL}/SummonerSmite.png`, price: 90 },
  Neutral_029: { id: 'Neutral_029', name: '虚弱契约', type: 'SKILL', cost: 0, value: 0, rarity: 'UNCOMMON', hero: 'Neutral', target: 'single', effect: 'STR_DEBUFF', effectValue: 1, description: '使目标-1力量，持续2回合。', img: `${SPELL_URL}/SummonerExhaust.png`, price: 60 },
  Neutral_030: { id: 'Neutral_030', name: '重塑石', type: 'SKILL', cost: 2, value: 0, rarity: 'RARE', hero: 'Neutral', target: 'self', effect: 'TRANSFORM', effectValue: 0, description: '随机将手上一张卡替换为同稀有度另一张卡（高变数）。', img: `${SPELL_URL}/SummonerFlash.png`, price: 200 },

  Neutral_031: { id: 'Neutral_031', name: '守护之盾', type: 'SKILL', cost: 1, value: 10, rarity: 'COMMON', hero: 'Neutral', target: 'self', effect: null, effectValue: 0, description: '获得10护甲。', img: `${SPELL_URL}/SummonerBarrier.png`, price: 60 },
  Neutral_032: { id: 'Neutral_032', name: '回复秘药', type: 'SKILL', cost: 1, value: 10, rarity: 'COMMON', hero: 'Neutral', target: 'self', effect: 'HEAL', effectValue: 10, description: '回复10生命。', img: `${SPELL_URL}/SummonerHeal.png`, price: 60 },
  Neutral_033: { id: 'Neutral_033', name: '格挡之歌', type: 'SKILL', cost: 1, value: 6, rarity: 'COMMON', hero: 'Neutral', target: 'self', effect: 'NEXT_DAMAGE_REDUCE', effectValue: 4, description: '获得6护甲并使下一次受到的伤害额外减少4。', img: `${SPELL_URL}/SummonerBarrier.png`, price: 70 },
  Neutral_034: { id: 'Neutral_034', name: '逆伤反震', type: 'SKILL', cost: 2, value: 0, rarity: 'UNCOMMON', hero: 'Neutral', target: 'self', effect: 'RETALIATE_ON_HIT', effectValue: 8, description: '若在本回合被攻击，则反弹8伤给攻击者。', img: `${SPELL_URL}/SummonerBarrier.png`, price: 100 },
  Neutral_035: { id: 'Neutral_035', name: '能量回复', type: 'SKILL', cost: 2, value: 0, rarity: 'UNCOMMON', hero: 'Neutral', target: 'self', effect: 'REGEN_MANA', effectValue: 2, description: '恢复2法力：本回合与下回合各+1（节奏），合计2回。', img: `${SPELL_URL}/SummonerClarity.png`, price: 120 },
  Neutral_036: { id: 'Neutral_036', name: '稳固姿态', type: 'POWER', cost: 0, value: 0, rarity: 'COMMON', hero: 'Neutral', target: 'self', effect: 'PASSIVE_BLOCK_IF_IDLE', effectValue: 6, description: '若本回合没有出牌，则下回合获得6护甲（鼓励保留）。', img: `${SPELL_URL}/SummonerBarrier.png`, price: 40 },

  // World-theme / small group (4)
  Neutral_037: { id: 'Neutral_037', name: '暗影岛之歌', type: 'ATTACK', cost: 2, value: 8, rarity: 'UNCOMMON', hero: 'Neutral', target: 'single', effect: 'OPEN_SHADOW_EVENT', effectValue: 0, description: '对单体造成8伤；胜利时解锁一次暗影岛事件（剧情/奖励）。', img: `${SPELL_URL}/SummonerDot.png`, price: 100 },
  Neutral_038: { id: 'Neutral_038', name: '诺克萨斯断章', type: 'SKILL', cost: 1, value: 0, rarity: 'UNCOMMON', hero: 'Neutral', target: 'single', effect: 'HEAL_REDUCE', effectValue: 50, description: '目标获取治疗效果降低50%，持续2回合。', img: `${SPELL_URL}/SummonerExhaust.png`, price: 90 },
  Neutral_039: { id: 'Neutral_039', name: '德玛之徽', type: 'SKILL', cost: 2, value: 0, rarity: 'UNCOMMON', hero: 'Neutral', target: 'single', effect: 'DAMAGE_REDUCE', effectValue: 30, description: '目标对你造成的伤害减少30%（1回合）。', img: `${SPELL_URL}/SummonerBarrier.png`, price: 110 },
  Neutral_040: { id: 'Neutral_040', name: '虚空砂', type: 'SKILL', cost: 3, value: 0, rarity: 'RARE', hero: 'Neutral', target: 'single', effect: 'VOID_DOT', effectValue: 5, description: '标记目标：其在3回合内每回合损失5生命；若击杀目标则返还20G。', img: `${SPELL_URL}/SummonerDot.png`, price: 200 },

  // ---------------------------------------------------------
  // Neutral_041
  Neutral_041: {
    id: 'Neutral_041',
    name: '无畏壁垒',
    type: 'SKILL',
    target: 'self',
    cost: 1,
    value: 12,
    rarity: 'COMMON',
    effect: null,
    effectValue: 0,
    description: '获得12点护甲。',
    price: 55
  },

  // Neutral_042
  Neutral_042: {
    id: 'Neutral_042',
    name: '精准打击',
    type: 'ATTACK',
    target: 'single',
    cost: 1,
    value: 8,
    rarity: 'COMMON',
    effect: 'CRIT_IF_VULN',
    effectValue: 6,
    description: '造成8点伤害；若目标处于易伤，额外造成6点伤害。',
    price: 60
  },

  // Neutral_043
  Neutral_043: {
    id: 'Neutral_043',
    name: '灵巧身法',
    type: 'SKILL',
    target: 'self',
    cost: 1,
    value: 0,
    rarity: 'COMMON',
    effect: 'GAIN_AGI',
    effectValue: 1,
    description: '获得1点敏捷。',
    price: 55
  },

  // Neutral_044
  Neutral_044: {
    id: 'Neutral_044',
    name: '集火号令',
    type: 'POWER',
    target: 'self',
    cost: 2,
    value: 0,
    rarity: 'RARE',
    effect: 'NEXT_ATTACK_X2',
    effectValue: 0,
    description: '你的下一张攻击牌伤害翻倍。',
    price: 110
  },

  // Neutral_045
  Neutral_045: {
    id: 'Neutral_045',
    name: '积蓄怒火',
    type: 'POWER',
    target: 'self',
    cost: 1,
    value: 0,
    rarity: 'UNCOMMON',
    effect: 'GAIN_STRENGTH_PER_HIT',
    effectValue: 1,
    description: '每当你受到伤害时，获得1点力量。',
    price: 90
  },

  // Neutral_046
  Neutral_046: {
    id: 'Neutral_046',
    name: '暗影毒刃',
    type: 'ATTACK',
    target: 'single',
    cost: 1,
    value: 4,
    rarity: 'UNCOMMON',
    effect: 'POISON',
    effectValue: 4,
    description: '造成4点伤害并附加4层中毒。',
    price: 70
  },

  Neutral_047: {
    id: 'Neutral_047',
    name: '坚韧不拔7',
    type: 'POWER',
    target: 'self',
    cost: 3,
    value: 2,
    rarity: 'RARE',
    hero: 'Neutral',
    effect: 'PASSIVE_BLOCK',
    effectValue: 5,
    description: '每回合开始获得5护甲（本战斗）。',
    img: `${SPELL_URL}/SummonerBarrier.png`,
    price: 50
  },
  Neutral_048: {
    id: 'Neutral_048',
    name: '破甲斩8',
    type: 'ATTACK',
    target: 'single',
    cost: 1,
    value: 11,
    rarity: 'COMMON',
    hero: 'Neutral',
    effect: null,
    effectValue: 2,
    description: '对单体造成11点伤害。',
    img: `${SPELL_URL}/SummonerIgnite.png`,
    price: 53
  },
  Neutral_049: {
    id: 'Neutral_049',
    name: '回旋镖9',
    type: 'SKILL',
    target: 'self',
    cost: 1,
    value: 14,
    rarity: 'UNCOMMON',
    hero: 'Neutral',
    effect: 'DRAW',
    effectValue: 3,
    description: '抽3张牌。',
    img: `${SPELL_URL}/SummonerGhost.png`,
    price: 56
  },
  Neutral_050: {
    id: 'Neutral_050',
    name: '持久态势0',
    type: 'POWER',
    target: 'self',
    cost: 3,
    value: 0,
    rarity: 'RARE',
    hero: 'Neutral',
    effect: 'PASSIVE_BLOCK',
    effectValue: 4,
    description: '每回合开始获得4护甲（本战斗）。',
    img: `${SPELL_URL}/SummonerBarrier.png`,
    price: 59
  },
  Neutral_051: {
    id: 'Neutral_051',
    name: '烈焰斩1',
    type: 'ATTACK',
    target: 'single',
    cost: 2,
    value: 10,
    rarity: 'COMMON',
    hero: 'Neutral',
    effect: null,
    effectValue: 5,
    description: '对单体造成10点伤害。',
    img: `${SPELL_URL}/SummonerIgnite.png`,
    price: 62
  },
  Neutral_052: {
    id: 'Neutral_052',
    name: '能量脉冲2',
    type: 'SKILL',
    target: 'self',
    cost: 1,
    value: 10,
    rarity: 'UNCOMMON',
    hero: 'Neutral',
    effect: 'BLOCK',
    effectValue: 2,
    description: '获得10护甲。',
    img: `${SPELL_URL}/SummonerBarrier.png`,
    price: 65
  },
  Neutral_053: {
    id: 'Neutral_053',
    name: '坚韧不拔3',
    type: 'POWER',
    target: 'self',
    cost: 3,
    value: 2,
    rarity: 'RARE',
    hero: 'Neutral',
    effect: 'PASSIVE_BLOCK',
    effectValue: 3,
    description: '每回合开始获得3护甲（本战斗）。',
    img: `${SPELL_URL}/SummonerBarrier.png`,
    price: 68
  },
  Neutral_054: {
    id: 'Neutral_054',
    name: '致命一击4',
    type: 'ATTACK',
    target: 'single',
    cost: 1,
    value: 9,
    rarity: 'COMMON',
    hero: 'Neutral',
    effect: null,
    effectValue: 4,
    description: '对单体造成9点伤害。',
    img: `${SPELL_URL}/SummonerIgnite.png`,
    price: 71
  },
  Neutral_055: {
    id: 'Neutral_055',
    name: '治疗波5',
    type: 'SKILL',
    target: 'self',
    cost: 1,
    value: 6,
    rarity: 'UNCOMMON',
    hero: 'Neutral',
    effect: 'BLOCK_DRAW',
    effectValue: 5,
    description: '获得6护甲并抽1牌。',
    img: `${SPELL_URL}/SummonerHeal.png`,
    price: 74
  },
  Neutral_056: {
    id: 'Neutral_056',
    name: '持久态势6',
    type: 'POWER',
    target: 'self',
    cost: 3,
    value: 0,
    rarity: 'RARE',
    hero: 'Neutral',
    effect: 'PASSIVE_BLOCK',
    effectValue: 2,
    description: '每回合开始获得2护甲（本战斗）。',
    img: `${SPELL_URL}/SummonerBarrier.png`,
    price: 77
  },
  Neutral_057: {
    id: 'Neutral_057',
    name: '雷霆一击7',
    type: 'ATTACK',
    target: 'single',
    cost: 2,
    value: 8,
    rarity: 'COMMON',
    hero: 'Neutral',
    effect: null,
    effectValue: 3,
    description: '对单体造成8点伤害。',
    img: `${SPELL_URL}/SummonerIgnite.png`,
    price: 80
  },
  Neutral_058: {
    id: 'Neutral_058',
    name: '法力回复8',
    type: 'SKILL',
    target: 'self',
    cost: 1,
    value: 12,
    rarity: 'UNCOMMON',
    hero: 'Neutral',
    effect: 'GAIN_MANA',
    effectValue: 4,
    description: '回复4法力。',
    img: `${SPELL_URL}/SummonerClarity.png`,
    price: 83
  },
  Neutral_059: {
    id: 'Neutral_059',
    name: '坚韧不拔9',
    type: 'POWER',
    target: 'self',
    cost: 3,
    value: 2,
    rarity: 'RARE',
    hero: 'Neutral',
    effect: 'PASSIVE_BLOCK',
    effectValue: 5,
    description: '每回合开始获得5护甲（本战斗）。',
    img: `${SPELL_URL}/SummonerBarrier.png`,
    price: 86
  },
  Neutral_060: {
    id: 'Neutral_060',
    name: '冰霜打击0',
    type: 'ATTACK',
    target: 'single',
    cost: 1,
    value: 7,
    rarity: 'COMMON',
    hero: 'Neutral',
    effect: null,
    effectValue: 2,
    description: '对单体造成7点伤害。',
    img: `${SPELL_URL}/SummonerIgnite.png`,
    price: 89
  },
  Neutral_061: {
    id: 'Neutral_061',
    name: '强化1',
    type: 'SKILL',
    target: 'self',
    cost: 1,
    value: 8,
    rarity: 'UNCOMMON',
    hero: 'Neutral',
    effect: 'DRAW',
    effectValue: 3,
    description: '抽3张牌。',
    img: `${SPELL_URL}/SummonerGhost.png`,
    price: 92
  },
  Neutral_062: {
    id: 'Neutral_062',
    name: '持久态势2',
    type: 'POWER',
    target: 'self',
    cost: 3,
    value: 0,
    rarity: 'RARE',
    hero: 'Neutral',
    effect: 'PASSIVE_BLOCK',
    effectValue: 4,
    description: '每回合开始获得4护甲（本战斗）。',
    img: `${SPELL_URL}/SummonerBarrier.png`,
    price: 95
  },
  Neutral_063: {
    id: 'Neutral_063',
    name: '连环打击3',
    type: 'ATTACK',
    target: 'single',
    cost: 2,
    value: 6,
    rarity: 'COMMON',
    hero: 'Neutral',
    effect: null,
    effectValue: 5,
    description: '对单体造成6点伤害。',
    img: `${SPELL_URL}/SummonerIgnite.png`,
    price: 98
  },
  Neutral_064: {
    id: 'Neutral_064',
    name: '护盾术4',
    type: 'SKILL',
    target: 'self',
    cost: 1,
    value: 14,
    rarity: 'UNCOMMON',
    hero: 'Neutral',
    effect: 'BLOCK',
    effectValue: 2,
    description: '获得14护甲。',
    img: `${SPELL_URL}/SummonerBarrier.png`,
    price: 101
  },
  Neutral_065: {
    id: 'Neutral_065',
    name: '坚韧不拔5',
    type: 'POWER',
    target: 'self',
    cost: 3,
    value: 2,
    rarity: 'RARE',
    hero: 'Neutral',
    effect: 'PASSIVE_BLOCK',
    effectValue: 3,
    description: '每回合开始获得3护甲（本战斗）。',
    img: `${SPELL_URL}/SummonerBarrier.png`,
    price: 104
  },
  Neutral_066: {
    id: 'Neutral_066',
    name: '疾风斩6',
    type: 'ATTACK',
    target: 'single',
    cost: 1,
    value: 12,
    rarity: 'COMMON',
    hero: 'Neutral',
    effect: null,
    effectValue: 4,
    description: '对单体造成12点伤害。',
    img: `${SPELL_URL}/SummonerIgnite.png`,
    price: 107
  },
  Neutral_067: {
    id: 'Neutral_067',
    name: '战术撤退7',
    type: 'SKILL',
    target: 'self',
    cost: 1,
    value: 10,
    rarity: 'UNCOMMON',
    hero: 'Neutral',
    effect: 'BLOCK_DRAW',
    effectValue: 5,
    description: '获得10护甲并抽1牌。',
    img: `${SPELL_URL}/SummonerHeal.png`,
    price: 110
  },
  Neutral_068: {
    id: 'Neutral_068',
    name: '持久态势8',
    type: 'POWER',
    target: 'self',
    cost: 3,
    value: 0,
    rarity: 'RARE',
    hero: 'Neutral',
    effect: 'PASSIVE_BLOCK',
    effectValue: 2,
    description: '每回合开始获得2护甲（本战斗）。',
    img: `${SPELL_URL}/SummonerBarrier.png`,
    price: 113
  },
  Neutral_069: {
    id: 'Neutral_069',
    name: '暗影突袭9',
    type: 'ATTACK',
    target: 'single',
    cost: 2,
    value: 11,
    rarity: 'COMMON',
    hero: 'Neutral',
    effect: null,
    effectValue: 3,
    description: '对单体造成11点伤害。',
    img: `${SPELL_URL}/SummonerIgnite.png`,
    price: 116
  },
  Neutral_070: {
    id: 'Neutral_070',
    name: '净化0',
    type: 'SKILL',
    target: 'self',
    cost: 1,
    value: 6,
    rarity: 'UNCOMMON',
    hero: 'Neutral',
    effect: 'GAIN_MANA',
    effectValue: 4,
    description: '回复4法力。',
    img: `${SPELL_URL}/SummonerClarity.png`,
    price: 119
  },
  Neutral_071: {
    id: 'Neutral_071',
    name: '坚韧不拔1',
    type: 'POWER',
    target: 'self',
    cost: 3,
    value: 2,
    rarity: 'RARE',
    hero: 'Neutral',
    effect: 'PASSIVE_BLOCK',
    effectValue: 5,
    description: '每回合开始获得5护甲（本战斗）。',
    img: `${SPELL_URL}/SummonerBarrier.png`,
    price: 122
  },
  Neutral_072: {
    id: 'Neutral_072',
    name: '破甲斩2',
    type: 'ATTACK',
    target: 'single',
    cost: 1,
    value: 10,
    rarity: 'COMMON',
    hero: 'Neutral',
    effect: null,
    effectValue: 2,
    description: '对单体造成10点伤害。',
    img: `${SPELL_URL}/SummonerIgnite.png`,
    price: 125
  },
  Neutral_073: {
    id: 'Neutral_073',
    name: '回旋镖3',
    type: 'SKILL',
    target: 'self',
    cost: 1,
    value: 12,
    rarity: 'UNCOMMON',
    hero: 'Neutral',
    effect: 'DRAW',
    effectValue: 3,
    description: '抽3张牌。',
    img: `${SPELL_URL}/SummonerGhost.png`,
    price: 128
  },
  Neutral_074: {
    id: 'Neutral_074',
    name: '持久态势4',
    type: 'POWER',
    target: 'self',
    cost: 3,
    value: 0,
    rarity: 'RARE',
    hero: 'Neutral',
    effect: 'PASSIVE_BLOCK',
    effectValue: 4,
    description: '每回合开始获得4护甲（本战斗）。',
    img: `${SPELL_URL}/SummonerBarrier.png`,
    price: 131
  },
  Neutral_075: {
    id: 'Neutral_075',
    name: '烈焰斩5',
    type: 'ATTACK',
    target: 'single',
    cost: 2,
    value: 9,
    rarity: 'COMMON',
    hero: 'Neutral',
    effect: null,
    target: 'self',
    cost: 3,
    value: 2,
    rarity: 'RARE',
    hero: 'Neutral',
    effect: 'PASSIVE_BLOCK',
    effectValue: 3,
    description: '每回合开始获得3护甲（本战斗）。',
    img: `${SPELL_URL}/SummonerBarrier.png`,
    price: 140
  },
  Neutral_078: {
    id: 'Neutral_078',
    name: '致命一击8',
    type: 'ATTACK',
    target: 'single',
    cost: 1,
    value: 8,
    rarity: 'COMMON',
    hero: 'Neutral',
    effect: null,
    effectValue: 4,
    description: '对单体造成8点伤害。',
    img: `${SPELL_URL}/SummonerIgnite.png`,
    price: 143
  },
  Neutral_079: {
    id: 'Neutral_079',
    name: '治疗波9',
    type: 'SKILL',
    target: 'self',
    cost: 1,
    value: 14,
    rarity: 'UNCOMMON',
    hero: 'Neutral',
    effect: 'BLOCK_DRAW',
    effectValue: 5,
    description: '获得14护甲并抽1牌。',
    img: `${SPELL_URL}/SummonerHeal.png`,
    price: 146
  },
  Neutral_080: {
    id: 'Neutral_080',
    name: '持久态势0',
    type: 'POWER',
    target: 'self',
    cost: 3,
    value: 0,
    rarity: 'RARE',
    hero: 'Neutral',
    effect: 'PASSIVE_BLOCK',
    effectValue: 2,
    description: '每回合开始获得2护甲（本战斗）。',
    img: `${SPELL_URL}/SummonerBarrier.png`,
    price: 149
  },
  Neutral_081: {
    id: 'Neutral_081',
    name: '雷霆一击1',
    type: 'ATTACK',
    target: 'single',
    cost: 2,
    value: 7,
    rarity: 'COMMON',
    hero: 'Neutral',
    effect: null,
    effectValue: 3,
    description: '对单体造成7点伤害。',
    img: `${SPELL_URL}/SummonerIgnite.png`,
    price: 152
  },
  Neutral_082: {
    id: 'Neutral_082',
    name: '法力回复2',
    type: 'SKILL',
    target: 'self',
    cost: 1,
    value: 10,
    rarity: 'UNCOMMON',
    hero: 'Neutral',
    effect: 'GAIN_MANA',
    effectValue: 4,
    description: '回复4法力。',
    img: `${SPELL_URL}/SummonerClarity.png`,
    price: 155
  },
  Neutral_083: {
    id: 'Neutral_083',
    name: '坚韧不拔3',
    type: 'POWER',
    target: 'self',
    cost: 3,
    value: 2,
    rarity: 'RARE',
    hero: 'Neutral',
    effect: 'PASSIVE_BLOCK',
    effectValue: 5,
    description: '每回合开始获得5护甲（本战斗）。',
    img: `${SPELL_URL}/SummonerBarrier.png`,
    price: 158
  },
  Neutral_084: {
    id: 'Neutral_084',
    name: '冰霜打击4',
    type: 'ATTACK',
    target: 'single',
    cost: 1,
    value: 6,
    rarity: 'COMMON',
    hero: 'Neutral',
    effect: null,
    effectValue: 2,
    description: '对单体造成6点伤害。',
    img: `${SPELL_URL}/SummonerIgnite.png`,
    price: 161
  },
  Neutral_085: {
    id: 'Neutral_085',
    name: '强化5',
    type: 'SKILL',
    target: 'self',
    cost: 1,
    value: 6,
    rarity: 'UNCOMMON',
    hero: 'Neutral',
    effect: 'DRAW',
    effectValue: 3,
    description: '抽3张牌。',
    img: `${SPELL_URL}/SummonerGhost.png`,
    price: 164
  },
  Neutral_086: {
    id: 'Neutral_086',
    name: '持久态势6',
    type: 'POWER',
    target: 'self',
    cost: 3,
    value: 0,
    rarity: 'RARE',
    hero: 'Neutral',
    effect: 'PASSIVE_BLOCK',
    effectValue: 4,
    description: '每回合开始获得4护甲（本战斗）。',
    img: `${SPELL_URL}/SummonerBarrier.png`,
    price: 167
  },
  Neutral_087: {
    id: 'Neutral_087',
    name: '连环打击7',
    type: 'ATTACK',
    target: 'single',
    cost: 2,
    value: 12,
    rarity: 'COMMON',
    hero: 'Neutral',
    effect: null,
    effectValue: 5,
    description: '对单体造成12点伤害。',
    img: `${SPELL_URL}/SummonerIgnite.png`,
    price: 170
  },
  Neutral_088: {
    id: 'Neutral_088',
    name: '护盾术8',
    type: 'SKILL',
    target: 'self',
    cost: 1,
    value: 12,
    rarity: 'UNCOMMON',
    hero: 'Neutral',
    effect: 'BLOCK',
    effectValue: 2,
    description: '获得12护甲。',
    img: `${SPELL_URL}/SummonerBarrier.png`,
    price: 173
  },
  Neutral_089: {
    id: 'Neutral_089',
    name: '坚韧不拔9',
    type: 'POWER',
    target: 'self',
    cost: 3,
    value: 2,
    rarity: 'RARE',
    hero: 'Neutral',
    effect: 'PASSIVE_BLOCK',
    effectValue: 3,
    description: '每回合开始获得3护甲（本战斗）。',
    img: `${SPELL_URL}/SummonerBarrier.png`,
    price: 176
  },
  Neutral_090: {
    id: 'Neutral_090',
    name: '疾风斩0',
    type: 'ATTACK',
    target: 'single',
    cost: 1,
    value: 11,
    rarity: 'COMMON',
    hero: 'Neutral',
    effect: null,
    effectValue: 4,
    description: '对单体造成11点伤害。',
    img: `${SPELL_URL}/SummonerIgnite.png`,
    price: 179
  },
  Neutral_091: {
    id: 'Neutral_091',
    name: '战术撤退1',
    type: 'SKILL',
    target: 'self',
    cost: 1,
    value: 8,
    rarity: 'UNCOMMON',
    hero: 'Neutral',
    effect: 'BLOCK_DRAW',
    effectValue: 5,
    description: '获得8护甲并抽1牌。',
    img: `${SPELL_URL}/SummonerHeal.png`,
    price: 182
  },
  Neutral_092: {
    id: 'Neutral_092',
    name: '持久态势2',
    type: 'POWER',
    target: 'self',
    cost: 3,
    value: 0,
    rarity: 'RARE',
    hero: 'Neutral',
    effect: 'PASSIVE_BLOCK',
    effectValue: 2,
    description: '每回合开始获得2护甲（本战斗）。',
    img: `${SPELL_URL}/SummonerBarrier.png`,
    price: 185
  },
  Neutral_093: {
    id: 'Neutral_093',
    name: '暗影突袭3',
    type: 'ATTACK',
    target: 'single',
    cost: 2,
    value: 10,
    rarity: 'COMMON',
    hero: 'Neutral',
    effect: null,
    effectValue: 3,
    description: '对单体造成10点伤害。',
    img: `${SPELL_URL}/SummonerIgnite.png`,
    price: 188
  },
  Neutral_094: {
    id: 'Neutral_094',
    name: '净化4',
    type: 'SKILL',
    target: 'self',
    cost: 1,
    value: 14,
    rarity: 'UNCOMMON',
    hero: 'Neutral',
    effect: 'GAIN_MANA',
    effectValue: 4,
    description: '回复4法力。',
    img: `${SPELL_URL}/SummonerClarity.png`,
    price: 191
  },
  Neutral_095: {
    id: 'Neutral_095',
    name: '坚韧不拔5',
    type: 'POWER',
    target: 'self',
    cost: 3,
    value: 2,
    rarity: 'RARE',
    hero: 'Neutral',
    effect: 'PASSIVE_BLOCK',
    effectValue: 5,
    description: '每回合开始获得5护甲（本战斗）。',
    img: `${SPELL_URL}/SummonerBarrier.png`,
    price: 194
  },
  Neutral_096: {
    id: 'Neutral_096',
    name: '破甲斩6',
    type: 'ATTACK',
    target: 'single',
    cost: 1,
    value: 9,
    rarity: 'COMMON',
    hero: 'Neutral',
    effect: null,
    effectValue: 2,
    description: '对单体造成9点伤害。',
    img: `${SPELL_URL}/SummonerIgnite.png`,
    price: 197
  },
  Neutral_097: {
    id: 'Neutral_097',
    name: '回旋镖7',
    type: 'SKILL',
    target: 'self',
    cost: 1,
    value: 10,
    rarity: 'UNCOMMON',
    hero: 'Neutral',
    effect: 'DRAW',
    effectValue: 3,
    description: '抽3张牌。',
    img: `${SPELL_URL}/SummonerGhost.png`,
    price: 200
  },
  Neutral_098: {
    id: 'Neutral_098',
    name: '持久态势8',
    type: 'POWER',
    target: 'self',
    cost: 3,
    value: 0,
    rarity: 'RARE',
    hero: 'Neutral',
    effect: 'PASSIVE_BLOCK',
    effectValue: 4,
    description: '每回合开始获得4护甲（本战斗）。',
    img: `${SPELL_URL}/SummonerBarrier.png`,
    price: 203
  },
  Neutral_099: {
    id: 'Neutral_099',
    name: '烈焰斩9',
    type: 'ATTACK',
    target: 'single',
    cost: 2,
    value: 8,
    rarity: 'COMMON',
    hero: 'Neutral',
    effect: null,
    effectValue: 5,
    description: '对单体造成8点伤害。',
    img: `${SPELL_URL}/SummonerIgnite.png`,
    price: 206
  },
  Neutral_100: {
    id: 'Neutral_100',
    name: '能量脉冲0',
    type: 'SKILL',
    target: 'self',
    cost: 1,
    value: 6,
    rarity: 'UNCOMMON',
    hero: 'Neutral',
    effect: 'BLOCK',
    effectValue: 2,
    description: '获得6护甲。',
    img: `${SPELL_URL}/SummonerBarrier.png`,
    price: 209
  },
  Neutral_101: {
    id: 'Neutral_101',
    name: '坚韧不拔1',
    type: 'POWER',
    target: 'self',
    cost: 3,
    value: 2,
    rarity: 'RARE',
    hero: 'Neutral',
    effect: 'PASSIVE_BLOCK',
    effectValue: 3,
    description: '每回合开始获得3护甲（本战斗）。',
    img: `${SPELL_URL}/SummonerBarrier.png`,
    price: 212
  },
  Neutral_102: {
    id: 'Neutral_102',
    name: '致命一击2',
    type: 'ATTACK',
    target: 'single',
    cost: 1,
    value: 7,
    rarity: 'COMMON',
    hero: 'Neutral',
    effect: null,
    effectValue: 4,
    description: '对单体造成7点伤害。',
    img: `${SPELL_URL}/SummonerIgnite.png`,
    price: 215
  },
  Neutral_103: {
    id: 'Neutral_103',
    name: '治疗波3',
    type: 'SKILL',
    target: 'self',
    cost: 1,
    value: 12,
    rarity: 'UNCOMMON',
    hero: 'Neutral',
    effect: 'BLOCK_DRAW',
    effectValue: 5,
    description: '获得12护甲并抽1牌。',
    img: `${SPELL_URL}/SummonerHeal.png`,
    price: 218
  },
  Neutral_104: {
    id: 'Neutral_104',
    name: '持久态势4',
    type: 'POWER',
    target: 'self',
    cost: 3,
    value: 0,
    rarity: 'RARE',
    hero: 'Neutral',
    effect: 'PASSIVE_BLOCK',
    effectValue: 2,
    description: '每回合开始获得2护甲（本战斗）。',
    img: `${SPELL_URL}/SummonerBarrier.png`,
    price: 221
  },
  Neutral_105: {
    id: 'Neutral_105',
    name: '雷霆一击5',
    type: 'ATTACK',
    target: 'single',
    cost: 2,
    value: 6,
    rarity: 'COMMON',
    hero: 'Neutral',
    effect: null,
    effectValue: 3,
    description: '对单体造成6点伤害。',
    img: `${SPELL_URL}/SummonerIgnite.png`,
    price: 224
  },
  Neutral_106: {
    id: 'Neutral_106',
    name: '法力回复6',
    type: 'SKILL',
    target: 'self',
    cost: 1,
    value: 8,
    rarity: 'UNCOMMON',
    hero: 'Neutral',
    effect: 'GAIN_MANA',
    effectValue: 4,
    description: '回复4法力。',
    img: `${SPELL_URL}/SummonerClarity.png`,
    price: 227
  },
  Neutral_107: {
    id: 'Neutral_107',
    name: '坚韧不拔7',
    type: 'POWER',
    target: 'self',
    cost: 3,
    value: 2,
    rarity: 'RARE',
    hero: 'Neutral',
    effect: 'PASSIVE_BLOCK',
    effectValue: 5,
    description: '每回合开始获得5护甲（本战斗）。',
    img: `${SPELL_URL}/SummonerBarrier.png`,
    price: 230
  },
  Neutral_108: {
    id: 'Neutral_108',
    name: '冰霜打击8',
    type: 'ATTACK',
    target: 'single',
    cost: 1,
    value: 12,
    rarity: 'COMMON',
    hero: 'Neutral',
    effect: null,
    effectValue: 2,
    description: '对单体造成12点伤害。',
    img: `${SPELL_URL}/SummonerIgnite.png`,
    price: 233
  },
  Neutral_109: {
    id: 'Neutral_109',
    name: '强化9',
    type: 'SKILL',
    target: 'self',
    cost: 1,
    value: 14,
    rarity: 'UNCOMMON',
    hero: 'Neutral',
    effect: 'DRAW',
    effectValue: 3,
    description: '抽3张牌。',
    img: `${SPELL_URL}/SummonerGhost.png`,
    price: 236
  },
  Neutral_110: {
    id: 'Neutral_110',
    name: '持久态势0',
    type: 'POWER',
    target: 'self',
    cost: 3,
    value: 0,
    rarity: 'RARE',
    hero: 'Neutral',
    effect: 'PASSIVE_BLOCK',
    effectValue: 4,
    description: '每回合开始获得4护甲（本战斗）。',
    img: `${SPELL_URL}/SummonerBarrier.png`,
    price: 239
  },
  Neutral_111: {
    id: 'Neutral_111',
    name: '连环打击1',
    type: 'ATTACK',
    target: 'single',
    cost: 2,
    value: 11,
    rarity: 'COMMON',
    hero: 'Neutral',
    effect: null,
    effectValue: 5,
    description: '对单体造成11点伤害。',
    img: `${SPELL_URL}/SummonerIgnite.png`,
    price: 242
  },
  Neutral_112: {
    id: 'Neutral_112',
    name: '护盾术2',
    type: 'SKILL',
    target: 'self',
    cost: 1,
    value: 10,
    rarity: 'UNCOMMON',
    hero: 'Neutral',
    effect: 'BLOCK',
    effectValue: 2,
    description: '获得10护甲。',
    img: `${SPELL_URL}/SummonerBarrier.png`,
    price: 245
  },
  Neutral_113: {
    id: 'Neutral_113',
    name: '坚韧不拔3',
    type: 'POWER',
    target: 'self',
    cost: 3,
    value: 2,
    rarity: 'RARE',
    hero: 'Neutral',
    effect: 'PASSIVE_BLOCK',
    effectValue: 3,
    description: '每回合开始获得3护甲（本战斗）。',
    img: `${SPELL_URL}/SummonerBarrier.png`,
    price: 248
  },
  Neutral_114: {
    id: 'Neutral_114',
    name: '疾风斩4',
    type: 'ATTACK',
    target: 'single',
    cost: 1,
    value: 10,
    rarity: 'COMMON',
    hero: 'Neutral',
    effect: null,
    effectValue: 4,
    description: '对单体造成10点伤害。',
    img: `${SPELL_URL}/SummonerIgnite.png`,
    price: 251
  },
  Neutral_115: {
    id: 'Neutral_115',
    name: '战术撤退5',
    type: 'SKILL',
    target: 'self',
    cost: 1,
    value: 6,
    rarity: 'UNCOMMON',
    hero: 'Neutral',
    effect: 'BLOCK_DRAW',
    effectValue: 5,
    description: '获得6护甲并抽1牌。',
    img: `${SPELL_URL}/SummonerHeal.png`,
    price: 254
  },
  Neutral_116: {
    id: 'Neutral_116',
    name: '持久态势6',
    type: 'POWER',
    target: 'self',
    cost: 3,
    value: 0,
    rarity: 'RARE',
    hero: 'Neutral',
    effect: 'PASSIVE_BLOCK',
    effectValue: 2,
    description: '每回合开始获得2护甲（本战斗）。',
    img: `${SPELL_URL}/SummonerBarrier.png`,
    price: 257
  },
  Neutral_117: {
    id: 'Neutral_117',
    name: '暗影突袭7',
    type: 'ATTACK',
    target: 'single',
    cost: 2,
    value: 9,
    rarity: 'COMMON',
    hero: 'Neutral',
    effect: null,
    effectValue: 3,
    description: '对单体造成9点伤害。',
    img: `${SPELL_URL}/SummonerIgnite.png`,
    price: 260
  },
  Neutral_118: {
    id: 'Neutral_118',
    name: '净化8',
    type: 'SKILL',
    target: 'self',
    cost: 1,
    value: 12,
    rarity: 'UNCOMMON',
    hero: 'Neutral',
    effect: 'GAIN_MANA',
    effectValue: 4,
    description: '回复4法力。',
    img: `${SPELL_URL}/SummonerClarity.png`,
    price: 263
  },
  Neutral_119: {
    id: 'Neutral_119',
    name: '坚韧不拔9',
    type: 'POWER',
    target: 'self',
    cost: 3,
    value: 2,
    rarity: 'RARE',
    hero: 'Neutral',
    effect: 'PASSIVE_BLOCK',
    effectValue: 5,
    description: '每回合开始获得5护甲（本战斗）。',
    img: `${SPELL_URL}/SummonerBarrier.png`,
    price: 266
  },
  Neutral_120: {
    id: 'Neutral_120',
    name: '破甲斩0',
    type: 'ATTACK',
    target: 'single',
    cost: 1,
    value: 8,
    rarity: 'COMMON',
    hero: 'Neutral',
    effect: null,
    effectValue: 2,
    description: '对单体造成8点伤害。',
    img: `${SPELL_URL}/SummonerIgnite.png`,
    price: 269
  },


  // Neutral_047
  Neutral_047: {
    id: 'Neutral_047',
    name: '诱敌深入',
    type: 'SKILL',
    target: 'single',
    cost: 1,
    value: 0,
    rarity: 'UNCOMMON',
    effect: 'MARK',
    effectValue: 1,
    description: '给目标施加“诱捕标记”：目标下次攻击你时受到8点反噬。',
    price: 70
  },

  // Neutral_048
  Neutral_048: {
    id: 'Neutral_048',
    name: '牺牲打',
    type: 'ATTACK',
    target: 'single',
    cost: 1,
    value: 12,
    rarity: 'UNCOMMON',
    effect: 'SELF_DAMAGE',
    effectValue: 3,
    description: '造成12点伤害，你自己受到3点反伤。',
    price: 60
  },

  // Neutral_049
  Neutral_049: {
    id: 'Neutral_049',
    name: '闪转腾挪',
    type: 'SKILL',
    target: 'self',
    cost: 0,
    value: 5,
    rarity: 'COMMON',
    effect: null,
    effectValue: 0,
    description: '获得5点护甲。',
    price: 40
  },

  // Neutral_050
  Neutral_050: {
    id: 'Neutral_050',
    name: '战术撤退',
    type: 'SKILL',
    target: 'self',
    cost: 1,
    value: 0,
    rarity: 'COMMON',
    effect: 'DRAW',
    effectValue: 2,
    description: '抽2张牌。',
    price: 45
  },

  // Neutral_051
  Neutral_051: {
    id: 'Neutral_051',
    name: '烈火试炼',
    type: 'ATTACK',
    target: 'single',
    cost: 2,
    value: 18,
    rarity: 'RARE',
    effect: 'BURN',
    effectValue: 5,
    description: '造成18点伤害并附加5层燃烧。',
    price: 120
  },

  // Neutral_052
  Neutral_052: {
    id: 'Neutral_052',
    name: '蓄能冥想',
    type: 'POWER',
    target: 'self',
    cost: 1,
    value: 0,
    rarity: 'RARE',
    effect: 'GAIN_MANA_NEXT_TURN',
    effectValue: 1,
    description: '下个回合开始时获得1点额外法力。',
    price: 90
  },

  // Neutral_053
  Neutral_053: {
    id: 'Neutral_053',
    name: '暗影虹吸',
    type: 'ATTACK',
    target: 'single',
    cost: 1,
    value: 7,
    rarity: 'UNCOMMON',
    effect: 'LIFESTEAL',
    effectValue: 5,
    description: '造成7点伤害，并回复5点生命。',
    price: 70
  },

  // Neutral_054
  Neutral_054: {
    id: 'Neutral_054',
    name: '符文点燃',
    type: 'POWER',
    target: 'self',
    cost: 1,
    value: 0,
    rarity: 'UNCOMMON',
    effect: 'DAMAGE_UP_PER_TURN',
    effectValue: 1,
    description: '每回合开始时获得1点力量（仅本战斗）。',
    price: 95
  },

  // Neutral_055
  Neutral_055: {
    id: 'Neutral_055',
    name: '不屈意志',
    type: 'SKILL',
    target: 'self',
    cost: 1,
    value: 12,
    rarity: 'COMMON',
    effect: 'CLEANSE',
    effectValue: 1,
    description: '获得12点护甲并移除1个负面状态。',
    price: 60
  },

  // Neutral_056
  Neutral_056: {
    id: 'Neutral_056',
    name: '蓄势待发',
    type: 'POWER',
    target: 'self',
    cost: 1,
    value: 0,
    rarity: 'COMMON',
    effect: 'FIRST_ATTACK_PLUS',
    effectValue: 4,
    description: '每回合你的第一张攻击牌额外造成4点伤害。',
    price: 85
  },

  // Neutral_057
  Neutral_057: {
    id: 'Neutral_057',
    name: '致命连击',
    type: 'ATTACK',
    target: 'single',
    cost: 2,
    value: 10,
    rarity: 'RARE',
    effect: 'DOUBLE_HIT',
    effectValue: 10,
    description: '造成10点伤害，然后再次造成10点伤害。',
    price: 140
  },

  // Neutral_058
  Neutral_058: {
    id: 'Neutral_058',
    name: '军备补给',
    type: 'SKILL',
    target: 'self',
    cost: 1,
    value: 0,
    rarity: 'UNCOMMON',
    effect: 'DRAW',
    effectValue: 3,
    description: '抽3张牌。',
    price: 65
  },

  // Neutral_059
  Neutral_059: {
    id: 'Neutral_059',
    name: '强攻扫击',
    type: 'ATTACK',
    target: 'single',
    cost: 1,
    value: 13,
    rarity: 'UNCOMMON',
    effect: null,
    effectValue: 0,
    description: '造成13点伤害。',
    price: 70
  },

  // Neutral_060
  Neutral_060: {
    id: 'Neutral_060',
    name: '暗影屏障',
    type: 'SKILL',
    target: 'self',
    cost: 2,
    value: 20,
    rarity: 'RARE',
    effect: 'AVOID_NEXT_DAMAGE',
    effectValue: 1,
    description: '获得20点护甲，并无效化下一次受到的伤害。',
    price: 130
  },
  // Neutral_061
  Neutral_061: {
    id: 'Neutral_061',
    name: '符能穿刺',
    type: 'ATTACK',
    target: 'single',
    cost: 1,
    value: 9,
    rarity: 'COMMON',
    effect: 'IGNORE_BLOCK',
    effectValue: 1,
    description: '造成9点无视护甲的伤害。',
    price: 70
  },

  // Neutral_062
  Neutral_062: {
    id: 'Neutral_062',
    name: '战术压制',
    type: 'SKILL',
    target: 'single',
    cost: 1,
    value: 0,
    rarity: 'COMMON',
    effect: 'WEAK',
    effectValue: 2,
    description: '对目标施加2层虚弱。',
    price: 60
  },

  // Neutral_063
  Neutral_063: {
    id: 'Neutral_063',
    name: '符文庇护',
    type: 'SKILL',
    target: 'self',
    cost: 1,
    value: 15,
    rarity: 'COMMON',
    effect: null,
    effectValue: 0,
    description: '获得15点护甲。',
    price: 60
  },

  // Neutral_064
  Neutral_064: {
    id: 'Neutral_064',
    name: '暗影洞察',
    type: 'POWER',
    target: 'self',
    cost: 1,
    value: 0,
    rarity: 'UNCOMMON',
    effect: 'SEE_ENEMY_ACTION',
    effectValue: 1,
    description: '所有回合都能看到敌人的下一个行动。',
    price: 90
  },

  // Neutral_065
  Neutral_065: {
    id: 'Neutral_065',
    name: '精准爆头',
    type: 'ATTACK',
    target: 'single',
    cost: 1,
    value: 11,
    rarity: 'UNCOMMON',
    effect: 'CRIT_25',
    effectValue: 10,
    description: '造成11点伤害；25% 几率额外造成10点伤害。',
    price: 75
  },

  // Neutral_066
  Neutral_066: {
    id: 'Neutral_066',
    name: '迅击三连',
    type: 'ATTACK',
    target: 'single',
    cost: 2,
    value: 5,
    rarity: 'UNCOMMON',
    effect: 'TRIPLE_HIT',
    effectValue: 5,
    description: '连续攻击3次，每次造成5点伤害。',
    price: 110
  },

  // Neutral_067
  Neutral_067: {
    id: 'Neutral_067',
    name: '痛苦献祭',
    type: 'POWER',
    target: 'self',
    cost: 1,
    value: 0,
    rarity: 'RARE',
    effect: 'GAIN_STR_WHEN_LOSE_HP',
    effectValue: 1,
    description: '每当你损失生命，获得1点力量。',
    price: 120
  },

  // Neutral_068
  Neutral_068: {
    id: 'Neutral_068',
    name: '烈焰冲击',
    type: 'ATTACK',
    target: 'single',
    cost: 2,
    value: 20,
    rarity: 'RARE',
    effect: null,
    effectValue: 0,
    description: '造成20点伤害。',
    price: 120
  },

  // Neutral_069
  Neutral_069: {
    id: 'Neutral_069',
    name: '暗影幻步',
    type: 'SKILL',
    target: 'self',
    cost: 0,
    value: 6,
    rarity: 'UNCOMMON',
    effect: 'GAIN_AGI',
    effectValue: 1,
    description: '获得6点护甲，并获得1点敏捷。',
    price: 70
  },

  // Neutral_070
  Neutral_070: {
    id: 'Neutral_070',
    name: '死线一击',
    type: 'ATTACK',
    target: 'single',
    cost: 1,
    value: 7,
    rarity: 'COMMON',
    effect: 'BONUS_IF_LOW_HP',
    effectValue: 10,
    description: '造成7点伤害；若目标生命低于50%，额外造成10点伤害。',
    price: 65
  },

  // Neutral_071
  Neutral_071: {
    id: 'Neutral_071',
    name: '复仇之焰',
    type: 'POWER',
    target: 'self',
    cost: 1,
    value: 0,
    rarity: 'UNCOMMON',
    effect: 'GAIN_STRENGTH_WHEN_HIT',
    effectValue: 1,
    description: '每当你受到伤害，获得1点力量。',
    price: 100
  },

  // Neutral_072
  Neutral_072: {
    id: 'Neutral_072',
    name: '灵魂压制',
    type: 'SKILL',
    target: 'single',
    cost: 1,
    value: 0,
    rarity: 'RARE',
    effect: 'REMOVE_BUFF',
    effectValue: 1,
    description: '移除目标的一个增益状态。',
    price: 120
  },

  // Neutral_073
  Neutral_073: {
    id: 'Neutral_073',
    name: '暗影灵刺',
    type: 'ATTACK',
    target: 'single',
    cost: 0,
    value: 4,
    rarity: 'COMMON',
    effect: null,
    effectValue: 0,
    description: '造成4点伤害。',
    price: 30
  },

  // Neutral_074
  Neutral_074: {
    id: 'Neutral_074',
    name: '复生印记',
    type: 'POWER',
    target: 'self',
    cost: 1,
    value: 0,
    rarity: 'RARE',
    effect: 'REVIVE_ONCE',
    effectValue: 20,
    description: '战斗中首次死亡时，以20点生命复活。',
    price: 200
  },

  // Neutral_075
  Neutral_075: {
    id: 'Neutral_075',
    name: '精准处刑',
    type: 'ATTACK',
    target: 'single',
    cost: 2,
    value: 15,
    rarity: 'RARE',
    effect: 'EXECUTE_THRESHOLD',
    effectValue: 25,
    description: '造成15点伤害；若目标低于25%生命，直接处决。',
    price: 150
  },

  // Neutral_076
  Neutral_076: {
    id: 'Neutral_076',
    name: '奥术屏障',
    type: 'SKILL',
    target: 'self',
    cost: 1,
    value: 14,
    rarity: 'UNCOMMON',
    effect: 'SHIELD',
    effectValue: 8,
    description: '获得14点护甲，并获得8点临时屏障。',
    price: 75
  },

  // Neutral_077
  Neutral_077: {
    id: 'Neutral_077',
    name: '符文激荡',
    type: 'POWER',
    target: 'self',
    cost: 1,
    value: 0,
    rarity: 'RARE',
    effect: 'GAIN_POWER_PER_TURN',
    effectValue: 1,
    description: '每回合开始时获得1点力量与1点敏捷。',
    price: 150
  },

  // Neutral_078
  Neutral_078: {
    id: 'Neutral_078',
    name: '重斩连发',
    type: 'ATTACK',
    target: 'single',
    cost: 2,
    value: 9,
    rarity: 'UNCOMMON',
    effect: 'DOUBLE_HIT',
    effectValue: 9,
    description: '连续攻击两次，每次造成9点伤害。',
    price: 110
  },

  // Neutral_079
  Neutral_079: {
    id: 'Neutral_079',
    name: '灵巧格挡',
    type: 'SKILL',
    target: 'self',
    cost: 1,
    value: 10,
    rarity: 'COMMON',
    effect: 'GAIN_AGI',
    effectValue: 1,
    description: '获得10点护甲与1点敏捷。',
    price: 60
  },

  // Neutral_080
  Neutral_080: {
    id: 'Neutral_080',
    name: '反制锁链',
    type: 'SKILL',
    target: 'single',
    cost: 1,
    value: 0,
    rarity: 'UNCOMMON',
    effect: 'COUNTER',
    effectValue: 10,
    description: '本回合若目标攻击你，对其反击造成10点伤害。',
    price: 80
  },
  // ---------------------------------------------------------
  // Neutral_081
  Neutral_081: {
    id: 'Neutral_081',
    name: '猎杀预兆',
    type: 'SKILL',
    target: 'single',
    cost: 1,
    value: 0,
    rarity: 'UNCOMMON',
    effect: 'MARK',
    effectValue: 1,
    description: '对目标施加“猎杀标记”：你下次对其造成的伤害 +8。',
    price: 70
  },

  // Neutral_082
  Neutral_082: {
    id: 'Neutral_082',
    name: '痛击',
    type: 'ATTACK',
    target: 'single',
    cost: 0,
    value: 3,
    rarity: 'COMMON',
    effect: 'APPLY_WEAK',
    effectValue: 1,
    description: '造成3点伤害并使目标虚弱1回合。',
    price: 35
  },

  // Neutral_083
  Neutral_083: {
    id: 'Neutral_083',
    name: '魂能冲击',
    type: 'ATTACK',
    target: 'single',
    cost: 2,
    value: 22,
    rarity: 'RARE',
    effect: null,
    effectValue: 0,
    description: '造成22点伤害。',
    price: 120
  },

  // Neutral_084
  Neutral_084: {
    id: 'Neutral_084',
    name: '战技突破',
    type: 'SKILL',
    target: 'self',
    cost: 1,
    value: 0,
    rarity: 'UNCOMMON',
    effect: 'GAIN_STRENGTH',
    effectValue: 2,
    description: '获得2点力量。',
    price: 80
  },

  // Neutral_085
  Neutral_085: {
    id: 'Neutral_085',
    name: '符文燃烧',
    type: 'ATTACK',
    target: 'single',
    cost: 1,
    value: 10,
    rarity: 'UNCOMMON',
    effect: 'BURN',
    effectValue: 3,
    description: '造成10点伤害并附加3层燃烧。',
    price: 75
  },

  // Neutral_086
  Neutral_086: {
    id: 'Neutral_086',
    name: '灵魂抽取',
    type: 'POWER',
    target: 'self',
    cost: 1,
    value: 0,
    rarity: 'RARE',
    effect: 'LIFESTEAL_BUFF',
    effectValue: 3,
    description: '所有攻击牌获得3点吸血效果。',
    price: 130
  },

  // Neutral_087
  Neutral_087: {
    id: 'Neutral_087',
    name: '侵蚀毒雾',
    type: 'SKILL',
    target: 'single',
    cost: 1,
    value: 0,
    rarity: 'UNCOMMON',
    effect: 'POISON',
    effectValue: 6,
    description: '对目标施加6层中毒。',
    price: 80
  },

  // Neutral_088
  Neutral_088: {
    id: 'Neutral_088',
    name: '沉稳姿态',
    type: 'POWER',
    target: 'self',
    cost: 1,
    value: 0,
    rarity: 'COMMON',
    effect: 'GAIN_BLOCK_NEXT_TURN',
    effectValue: 8,
    description: '下回合开始时获得8点护甲。',
    price: 60
  },

  // Neutral_089
  Neutral_089: {
    id: 'Neutral_089',
    name: '失衡猛击',
    type: 'ATTACK',
    target: 'single',
    cost: 1,
    value: 7,
    rarity: 'COMMON',
    effect: 'VULNERABLE',
    effectValue: 1,
    description: '造成7点伤害并附加1层易伤。',
    price: 55
  },

  // Neutral_090
  Neutral_090: {
    id: 'Neutral_090',
    name: '符纹甲胄',
    type: 'SKILL',
    target: 'self',
    cost: 2,
    value: 24,
    rarity: 'RARE',
    effect: null,
    effectValue: 0,
    description: '获得24点护甲。',
    price: 130
  },

  // Neutral_091
  Neutral_091: {
    id: 'Neutral_091',
    name: '灵能涌动',
    type: 'POWER',
    target: 'self',
    cost: 2,
    value: 0,
    rarity: 'RARE',
    effect: 'DRAW_START',
    effectValue: 1,
    description: '每回合多抽1张牌。',
    price: 150
  },

  // Neutral_092
  Neutral_092: {
    id: 'Neutral_092',
    name: '致命标记',
    type: 'SKILL',
    target: 'single',
    cost: 1,
    value: 0,
    rarity: 'UNCOMMON',
    effect: 'MARK',
    effectValue: 1,
    description: '对目标施加“致命标记”：其下次受到攻击额外 +12 伤害。',
    price: 80
  },

  // Neutral_093
  Neutral_093: {
    id: 'Neutral_093',
    name: '凶刃连舞',
    type: 'ATTACK',
    target: 'single',
    cost: 2,
    value: 6,
    rarity: 'RARE',
    effect: 'TRIPLE_HIT',
    effectValue: 6,
    description: '连续3次造成6点伤害。',
    price: 130
  },

  // Neutral_094
  Neutral_094: {
    id: 'Neutral_094',
    name: '仪式献祭',
    type: 'SKILL',
    target: 'self',
    cost: 0,
    value: 0,
    rarity: 'RARE',
    effect: 'LOSE_HP_GAIN_STRENGTH',
    effectValue: 2,
    description: '失去4点生命，获得2点力量。',
    price: 60
  },

  // Neutral_095
  Neutral_095: {
    id: 'Neutral_095',
    name: '幽魂钩爪',
    type: 'ATTACK',
    target: 'single',
    cost: 1,
    value: 11,
    rarity: 'UNCOMMON',
    effect: 'LIFESTEAL',
    effectValue: 3,
    description: '造成11点伤害并回复3点生命。',
    price: 80
  },

  // Neutral_096
  Neutral_096: {
    id: 'Neutral_096',
    name: '软化目标',
    type: 'SKILL',
    target: 'single',
    cost: 1,
    value: 0,
    rarity: 'COMMON',
    effect: 'REDUCE_BLOCK',
    effectValue: 6,
    description: '使目标减少6点护甲。',
    price: 50
  },

  // Neutral_097
  Neutral_097: {
    id: 'Neutral_097',
    name: '冷酷精准',
    type: 'POWER',
    target: 'self',
    cost: 1,
    value: 0,
    rarity: 'UNCOMMON',
    effect: 'CRIT_UP',
    effectValue: 10,
    description: '你的所有攻击牌暴击几率 +10%。',
    price: 100
  },

  // Neutral_098
  Neutral_098: {
    id: 'Neutral_098',
    name: '操控心智',
    type: 'SKILL',
    target: 'single',
    cost: 1,
    value: 0,
    rarity: 'RARE',
    effect: 'DELAY_ACTION',
    effectValue: 1,
    description: '延迟目标下一个行动（延迟 1 回合）。',
    price: 150
  },

  // Neutral_099
  Neutral_099: {
    id: 'Neutral_099',
    name: '血色冲锋',
    type: 'ATTACK',
    target: 'single',
    cost: 1,
    value: 9,
    rarity: 'COMMON',
    effect: 'GAIN_STRENGTH',
    effectValue: 1,
    description: '造成9点伤害，并获得1点力量。',
    price: 55
  },

  // Neutral_100
  Neutral_100: {
    id: 'Neutral_100',
    name: '符文震爆',
    type: 'ATTACK',
    target: 'single',
    cost: 3,
    value: 28,
    rarity: 'RARE',
    effect: null,
    effectValue: 0,
    description: '造成28点伤害。',
    price: 160
  },

  // Neutral_101
  Neutral_101: {
    id: 'Neutral_101',
    name: '魂火庇佑',
    type: 'SKILL',
    target: 'self',
    cost: 1,
    value: 14,
    rarity: 'UNCOMMON',
    effect: 'CLEANSE',
    effectValue: 1,
    description: '获得14点护甲并移除1个负面状态。',
    price: 75
  },

  // Neutral_102
  Neutral_102: {
    id: 'Neutral_102',
    name: '血债血偿',
    type: 'ATTACK',
    target: 'single',
    cost: 1,
    value: 6,
    rarity: 'UNCOMMON',
    effect: 'DAMAGE_IF_HURT',
    effectValue: 10,
    description: '造成6点伤害；若上一回合你受到伤害，则额外造成10点。',
    price: 75
  },

  // Neutral_103
  Neutral_103: {
    id: 'Neutral_103',
    name: '铁壁守势',
    type: 'SKILL',
    target: 'self',
    cost: 2,
    value: 25,
    rarity: 'RARE',
    effect: 'GAIN_AGI',
    effectValue: 1,
    description: '获得25点护甲和1点敏捷。',
    price: 150
  },

  // Neutral_104
  Neutral_104: {
    id: 'Neutral_104',
    name: '无声毒息',
    type: 'SKILL',
    target: 'single',
    cost: 1,
    value: 0,
    rarity: 'UNCOMMON',
    effect: 'POISON',
    effectValue: 7,
    description: '施加7层中毒。',
    price: 85
  },

  // Neutral_105
  Neutral_105: {
    id: 'Neutral_105',
    name: '过载打击',
    type: 'ATTACK',
    target: 'single',
    cost: 2,
    value: 18,
    rarity: 'UNCOMMON',
    effect: 'SELF_WEAK',
    effectValue: 1,
    description: '造成18点伤害，你获得1层虚弱。',
    price: 95
  },

  // Neutral_106
  Neutral_106: {
    id: 'Neutral_106',
    name: '灵感迸发',
    type: 'SKILL',
    target: 'self',
    cost: 0,
    value: 0,
    rarity: 'COMMON',
    effect: 'DRAW',
    effectValue: 1,
    description: '抽1张牌。',
    price: 25
  },

  // Neutral_107
  Neutral_107: {
    id: 'Neutral_107',
    name: '迅捷突袭',
    type: 'ATTACK',
    target: 'single',
    cost: 0,
    value: 5,
    rarity: 'COMMON',
    effect: null,
    effectValue: 0,
    description: '造成5点伤害。',
    price: 30
  },

  // Neutral_108
  Neutral_108: {
    id: 'Neutral_108',
    name: '坚韧信仰',
    type: 'POWER',
    target: 'self',
    cost: 1,
    value: 0,
    rarity: 'UNCOMMON',
    effect: 'END_TURN_BLOCK',
    effectValue: 4,
    description: '每回合结束时获得4点护甲。',
    price: 80
  },

  // Neutral_109
  Neutral_109: {
    id: 'Neutral_109',
    name: '虚空腐蚀',
    type: 'SKILL',
    target: 'single',
    cost: 2,
    value: 0,
    rarity: 'RARE',
    effect: 'HP_DEGEN',
    effectValue: 12,
    description: '使目标在3回合内每回合损失4点生命。',
    price: 140
  },

  // Neutral_110
  Neutral_110: {
    id: 'Neutral_110',
    name: '急速斩',
    type: 'ATTACK',
    target: 'single',
    cost: 1,
    value: 9,
    rarity: 'COMMON',
    effect: 'DRAW_IF_KILL',
    effectValue: 1,
    description: '造成9点伤害；若击杀目标，抽1张牌。',
    price: 60
  },

  // Neutral_111
  Neutral_111: {
    id: 'Neutral_111',
    name: '英勇风范',
    type: 'POWER',
    target: 'self',
    cost: 1,
    value: 0,
    rarity: 'UNCOMMON',
    effect: 'GAIN_BLOCK_WHEN_ATTACK',
    effectValue: 4,
    description: '你每次打出攻击牌时获得4点护甲。',
    price: 80
  },

  // Neutral_112
  Neutral_112: {
    id: 'Neutral_112',
    name: '战术压制',
    type: 'SKILL',
    target: 'single',
    cost: 1,
    value: 0,
    rarity: 'COMMON',
    effect: 'WEAK',
    effectValue: 2,
    description: '对目标施加2层虚弱。',
    price: 50
  },

  // Neutral_113
  Neutral_113: {
    id: 'Neutral_113',
    name: '异能注入',
    type: 'POWER',
    target: 'self',
    cost: 1,
    value: 0,
    rarity: 'RARE',
    effect: 'GAIN_RANDOM_BUFF',
    effectValue: 2,
    description: '获得随机2点属性（力量或敏捷）。',
    price: 150
  },

  // Neutral_114
  Neutral_114: {
    id: 'Neutral_114',
    name: '终焉标记',
    type: 'SKILL',
    target: 'single',
    cost: 1,
    value: 0,
    rarity: 'RARE',
    effect: 'MARK',
    effectValue: 1,
    description: '施加“终焉标记”：目标在3回合后受到25点伤害。',
    price: 160
  },

  // Neutral_115
  Neutral_115: {
    id: 'Neutral_115',
    name: '暗影深击',
    type: 'ATTACK',
    target: 'single',
    cost: 1,
    value: 12,
    rarity: 'UNCOMMON',
    effect: 'BONUS_IF_MARKED',
    effectValue: 6,
    description: '造成12点伤害；若目标被标记，则额外造成6点。',
    price: 85
  },

  // Neutral_116
  Neutral_116: {
    id: 'Neutral_116',
    name: '灵魂献祭',
    type: 'SKILL',
    target: 'self',
    cost: 0,
    value: 0,
    rarity: 'RARE',
    effect: 'LOSE_HP_GAIN_MANA',
    effectValue: 1,
    description: '失去4点生命，获得1点法力。',
    price: 70
  },

  // Neutral_117
  Neutral_117: {
    id: 'Neutral_117',
    name: '月之鼓动',
    type: 'POWER',
    target: 'self',
    cost: 1,
    value: 0,
    rarity: 'UNCOMMON',
    effect: 'GAIN_STRENGTH_NEXT_TURN',
    effectValue: 2,
    description: '下回合开始时获得2点力量。',
    price: 90
  },

  // Neutral_118
  Neutral_118: {
    id: 'Neutral_118',
    name: '锋芒暴刺',
    type: 'ATTACK',
    target: 'single',
    cost: 0,
    value: 4,
    rarity: 'COMMON',
    effect: 'APPLY_VULNERABLE',
    effectValue: 1,
    description: '造成4点伤害，并施加1层易伤。',
    price: 35
  },

  // Neutral_119
  Neutral_119: {
    id: 'Neutral_119',
    name: '符火连锁',
    type: 'ATTACK',
    target: 'single',
    cost: 2,
    value: 14,
    rarity: 'RARE',
    effect: 'DOUBLE_HIT',
    effectValue: 14,
    description: '连续造成两次14点伤害。',
    price: 150
  },

  // Neutral_120
  Neutral_120: {
    id: 'Neutral_120',
    name: '虚空裂痕',
    type: 'ATTACK',
    target: 'single',
    cost: 3,
    value: 30,
    rarity: 'RARE',
    effect: 'APPLY_VULNERABLE',
    effectValue: 2,
    description: '造成30点伤害，并附加2层易伤。',
    price: 170
  },
};
