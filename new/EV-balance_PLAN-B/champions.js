// champions.js - Legends of the Spire
// 20 champions meta for simulator & game data.

export const CHAMPION_POOL = {
  Garen: {
    id: 'Garen',
    name: '盖伦',
    title: '德玛西亚之力',
    maxHp: 80,
    maxMana: 3,
    baseStr: 0,
    avatar: `${CDN_URL}/img/champion/Garen.png`,
    passive: '坚韧：战斗结束恢复6HP',
    relicId: 'GarenPassive',
    initialCards: ['GarenQ','GarenW','GarenE','Strike','Defend','Neutral_009','Neutral_031'],
    description: '坦克/斩杀，稳定的护甲与斩杀窗口'
  },

  Darius: {
    id: 'Darius',
    name: '德莱厄斯',
    title: '诺克萨斯之手',
    maxHp: 85,
    maxMana: 3,
    baseStr: 0,
    avatar: `${CDN_URL}/img/champion/Darius.png`,
    passive: '出血：每次攻击给予1层流血',
    relicId: 'DariusPassive',
    initialCards: ['DariusQ','DariusW','DariusE','Strike','Defend','Neutral_001','Neutral_052'],
    description: '高爆发流血叠层，填补补刀与续战'
  },

  Lux: {
    id: 'Lux',
    name: '拉克丝',
    title: '光之魔法师',
    maxHp: 70,
    maxMana: 3,
    baseStr: 0,
    avatar: `${CDN_URL}/img/champion/Lux.png`,
    passive: '法力回流：偶发获得1点法力',
    relicId: 'LuxPassive',
    initialCards: ['LuxQ','LuxW','LuxE','Strike','Defend','Neutral_009','Neutral_012'],
    description: '法术循环保守，依赖手牌节奏产出高伤'
  },

  Jinx: {
    id: 'Jinx',
    name: '金克丝',
    title: '爆裂枪手',
    maxHp: 68,
    maxMana: 3,
    baseStr: 0,
    avatar: `${CDN_URL}/img/champion/Jinx.png`,
    passive: '暴走：打出数张牌后短时增伤',
    relicId: 'JinxPassive',
    initialCards: ['JinxQ','JinxW','JinxE','Strike','Defend','Neutral_027','Neutral_028'],
    description: '爆发单体收割，依赖标记与斩杀'
  },

  Yasuo: {
    id: 'Yasuo',
    name: '亚索',
    title: '浪客之道',
    maxHp: 72,
    maxMana: 3,
    baseStr: 0,
    avatar: `${CDN_URL}/img/champion/Yasuo.png`,
    passive: '风之身法：暴击相关机制',
    relicId: 'YasuoPassive',
    initialCards: ['YasuoQ','YasuoW','YasuoE','Strike','Defend','Neutral_036','Neutral_056'],
    description: '连击型，依赖攻击衔接与暴击'
  },

  Sona: {
    id: 'Sona',
    name: '娑娜',
    title: '琴瑟仙女',
    maxHp: 65,
    maxMana: 3,
    baseStr: 0,
    avatar: `${CDN_URL}/img/champion/Sona.png`,
    passive: '旋律回响：打出牌会触发小额回复或护甲',
    relicId: 'SonaPassive',
    initialCards: ['SonaQ','SonaW','SonaE','Strike','Defend','Neutral_009','Neutral_033'],
    description: '支援/节奏法，兼具自保与拆节奏'
  },

  Ekko: {
    id: 'Ekko',
    name: '艾克',
    title: '时间刺客',
    maxHp: 66,
    maxMana: 3,
    baseStr: 0,
    avatar: `${CDN_URL}/img/champion/Ekko.png`,
    passive: '时间涌动：回溯连携奖励',
    relicId: 'EkkoPassive',
    initialCards: ['EkkoQ','EkkoW','EkkoE','Strike','Defend','Neutral_025','Neutral_016'],
    description: '连携高收益，适合抓时机的刺客'
  },

  Sylas: {
    id: 'Sylas',
    name: '塞拉斯',
    title: '叛逆者',
    maxHp: 78,
    maxMana: 3,
    baseStr: 0,
    avatar: `${CDN_URL}/img/champion/Sylas.png`,
    passive: '吸血：技能触发小量治疗',
    relicId: 'SylasPassive',
    initialCards: ['SylasQ','SylasW','SylasE','Strike','Defend','Neutral_053','Neutral_034'],
    description: '战斗续航与反打，控场能力强'
  },

  Urgot: {
    id: 'Urgot',
    name: '厄加特',
    title: '深海毒魔',
    maxHp: 92,
    maxMana: 3,
    baseStr: 0,
    avatar: `${CDN_URL}/img/champion/Urgot.png`,
    passive: '装甲转换：自带大量护甲',
    relicId: 'UrgotPassive',
    initialCards: ['UrgotQ','UrgotW','UrgotE','Strike','Defend','Neutral_031','Neutral_103'],
    description: '硬控坦克，自伤换高爆发'
  },

  Viktor: {
    id: 'Viktor',
    name: '维克托',
    title: '机械先驱',
    maxHp: 68,
    maxMana: 3,
    baseStr: 0,
    avatar: `${CDN_URL}/img/champion/Viktor.png`,
    passive: '进化：长线发育获得增益',
    relicId: 'ViktorPassive',
    initialCards: ['ViktorQ','ViktorW','ViktorE','Strike','Defend','Neutral_012','Neutral_052'],
    description: '发育型法师，依靠卡组搭配成长'
  },

  Riven: {
    id: 'Riven',
    name: '瑞文',
    title: '流浪剑客',
    maxHp: 74,
    maxMana: 3,
    baseStr: 0,
    avatar: `${CDN_URL}/img/champion/Riven.png`,
    passive: '气合：攻击连打获得小额法力/护甲',
    relicId: 'RivenPassive',
    initialCards: ['RivenQ','RivenW','RivenE','Strike','Defend','Neutral_056','Neutral_033'],
    description: '高连段压力，擅长短回合爆发'
  },

  CardMaster: {
    id: 'CardMaster',
    name: '卡牌大师',
    title: '赌徒',
    maxHp: 70,
    maxMana: 3,
    baseStr: 0,
    avatar: `${CDN_URL}/img/champion/CardMaster.png`,
    passive: '金库：战斗胜利增加金币',
    relicId: 'CardMasterPassive',
    initialCards: ['CardMasterQ','CardMasterW','CardMasterE','Strike','Defend','Neutral_011','Neutral_015'],
    description: '经济导向，可通过金币换强或赌局'
  },

  LeeSin: {
    id: 'LeeSin',
    name: '盲僧',
    title: '疾风之拳',
    maxHp: 76,
    maxMana: 3,
    baseStr: 0,
    avatar: `${CDN_URL}/img/champion/LeeSin.png`,
    passive: '连环：完成连招获得费用优惠',
    relicId: 'LeeSinPassive',
    initialCards: ['LeeQ','LeeW','LeeE','Strike','Defend','Neutral_025','Neutral_036'],
    description: '连招型拳师，控制与连段兼备'
  },

  Vayne: {
    id: 'Vayne',
    name: '薇恩',
    title: '誓约猎人',
    maxHp: 66,
    maxMana: 3,
    baseStr: 0,
    avatar: `${CDN_URL}/img/champion/Vayne.png`,
    passive: '猎人之印：连续对目标伤害触发真伤',
    relicId: 'VaynePassive',
    initialCards: ['VayneQ','VayneE','VaynePassive','Strike','Defend','Neutral_070','Neutral_110'],
    description: '刺客/收割，适合小血量斩杀'
  },

  Teemo: {
    id: 'Teemo',
    name: '提莫',
    title: '游击手',
    maxHp: 65,
    maxMana: 3,
    baseStr: 0,
    avatar: `${CDN_URL}/img/champion/Teemo.png`,
    passive: '蘑菇：对单体放标记并触发伤害',
    relicId: 'TeemoPassive',
    initialCards: ['TeemoQ','TeemoW','TeemoE','Strike','Defend','Neutral_027','Neutral_116'],
    description: '毒系耗血/标记触发玩法'
  },

  Zed: {
    id: 'Zed',
    name: '劫',
    title: '影之刺客',
    maxHp: 68,
    maxMana: 3,
    baseStr: 0,
    avatar: `${CDN_URL}/img/champion/Zed.png`,
    passive: '影分身：复制下一次攻击（分身伤害折半）',
    relicId: 'ZedPassive',
    initialCards: ['ZedQ','ZedW','ZedE','Strike','Defend','Neutral_023','Neutral_030'],
    description: '影分身与连击，标准刺客'
  },

  Nasus: {
    id: 'Nasus',
    name: '内瑟斯',
    title: '汲魂巨兽',
    maxHp: 85,
    maxMana: 3,
    baseStr: 0,
    avatar: `${CDN_URL}/img/champion/Nasus.png`,
    passive: '补刀成长：用卡击杀时获得永久力量',
    relicId: 'NasusPassive',
    initialCards: ['NasusQ','NasusW','NasusE','Strike','Defend','Neutral_017','Neutral_021'],
    description: '补刀成长型，越打越强'
  },

  Irelia: {
    id: 'Irelia',
    name: '艾瑞莉娅',
    title: '秩序先锋',
    maxHp: 72,
    maxMana: 3,
    baseStr: 0,
    avatar: `${CDN_URL}/img/champion/Irelia.png`,
    passive: '斩杀回春：击杀恢复法力并抽牌',
    relicId: 'IreliaPassive',
    initialCards: ['IreliaQ','IreliaW','IreliaE','Strike','Defend','Neutral_010','Neutral_110'],
    description: '机动斩杀，节奏奖励明显'
  },

  Thresh: {
    id: 'Thresh',
    name: '锤石',
    title: '幽魂守望',
    maxHp: 88,
    maxMana: 3,
    baseStr: 0,
    avatar: `${CDN_URL}/img/champion/Thresh.png`,
    passive: '灯笼守望：击杀提升最大生命',
    relicId: 'ThreshPassive',
    initialCards: ['ThreshQ','ThreshW','ThreshE','Strike','Defend','Neutral_032','Neutral_072'],
    description: '控制/回复向，适合拖延与单体控制'
  },

  Katarina: {
    id: 'Katarina',
    name: '卡特琳娜',
    title: '不祥之刃',
    maxHp: 68,
    maxMana: 3,
    baseStr: 0,
    avatar: `${CDN_URL}/img/champion/Katarina.png`,
    passive: '连斩爆发：连击获得翻倍收益',
    relicId: 'KatarinaPassive',
    initialCards: ['KatarinaQ','KatarinaW','KatarinaE','Strike','Defend','Neutral_057','Neutral_093'],
    description: '连击爆发型刺客'
  }
};

export default CHAMPION_POOL;
