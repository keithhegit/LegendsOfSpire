import { LOADING_URL, CDN_URL } from './constants';

const ENEMY_ART_URL = 'https://pub-c98d5902eedf42f6a9765dfad981fd88.r2.dev/LoL/enemy_c_art';

export const ENEMY_POOL = {
  // --- ACT 1 小怪 ---
  "Forge_Drone": { 
    id: "Forge_Drone", 
    name: "赫菲斯托斯工蚁", 
    title: "机械自爆单位", 
    maxHp: 30, 
    difficultyRank: 1, 
    act: 1, 
    img: `${ENEMY_ART_URL}/Forge_Drone_default_c_art.png`, 
    avatar: `${ENEMY_ART_URL}/Forge_Drone_default_c_art.png`, 
    traits: ["EXPLODE_ON_DEATH"],
    traitValues: { explodeDamage: 25 },
    actions: [
      { type: 'ATTACK', value: 8, name: "钻头冲击" },
      { type: 'BUFF', value: 0, name: "自我加固", effect: "BLOCK", effectValue: 10 }
    ]
  },
  "Spartan_Shade": { 
    id: "Spartan_Shade", 
    name: "斯巴达亡魂", 
    title: "不屈之影", 
    maxHp: 50, 
    difficultyRank: 1, 
    act: 1, 
    img: `${ENEMY_ART_URL}/Spartan_Shade_default_c_art.png`, 
    avatar: `${ENEMY_ART_URL}/Spartan_Shade_default_c_art.png`, 
    traits: ["UNDYING"],
    actions: [
      { type: 'ATTACK', value: 10, name: "长矛突刺" },
      { type: 'ATTACK', value: 6, count: 2, name: "盾牌猛击" }
    ]
  },
  "Cyclops_Whelp": { 
    id: "Cyclops_Whelp", 
    name: "基克洛普斯幼体", 
    title: "独眼巨人之子", 
    maxHp: 80, 
    difficultyRank: 2, 
    act: 1, 
    img: `${ENEMY_ART_URL}/Cyclops_Whelp_default_c_art.png`, 
    avatar: `${ENEMY_ART_URL}/Cyclops_Whelp_default_c_art.png`, 
    actionPattern: "CHARGING",
    chargeTime: 1,
    actions: [
      { type: 'ATTACK', value: 12, name: "巨力重砸" },
      { type: 'BUFF', value: 0, name: "战吼", effect: "STRENGTH", effectValue: 2 }
    ]
  },

  // --- ACT 1 BOSS ---
  "Talos": { 
    id: "Talos", 
    name: "青铜巨人塔罗斯", 
    title: "巨神的樊笼", 
    maxHp: 200, 
    difficultyRank: 99, 
    act: 1, 
    img: `${ENEMY_ART_URL}/Talos_default_c_art.png`, 
    avatar: `${ENEMY_ART_URL}/Talos_default_c_art.png`, 
    isBoss: true,
    traits: ["BOSS_TALOS"],
    actions: [
      { type: 'BUFF', value: 20, name: "坚壁", effect: "BLOCK", effectValue: 20 },
      { type: 'ATTACK', value: 18, name: "铁拳" },
      { type: 'SPECIAL', value: 0, name: "碾压", specialId: "EXECUTE_LOW_HP" }
    ]
  },

  // --- ACT 2 小怪 ---
  "Siren": { 
    id: "Siren", 
    name: "冥河女妖", 
    title: "礁石上的诱惑", 
    maxHp: 60, 
    difficultyRank: 2, 
    act: 2, 
    img: `${ENEMY_ART_URL}/Siren_default_c_art.png`, 
    avatar: `${ENEMY_ART_URL}/Siren_default_c_art.png`, 
    actions: [
      { type: 'DEBUFF', value: 0, name: "海妖之歌", effect: "STUN_PLAYER", effectValue: 1 },
      { type: 'ATTACK', value: 10, name: "利爪撕裂" }
    ]
  },
  "Shadow_Stalker": { 
    id: "Shadow_Stalker", 
    name: "暗影潜行者", 
    title: "幻象之刃", 
    maxHp: 70, 
    difficultyRank: 2, 
    act: 2, 
    img: `${ENEMY_ART_URL}/Stalker_default_c_art.png`, 
    avatar: `${ENEMY_ART_URL}/Stalker_default_c_art.png`, 
    traits: ["EVASION"],
    traitValues: { evasionChance: 50 },
    actions: [
      { type: 'ATTACK', value: 8, count: 2, name: "暗影突袭" },
      { type: 'DEBUFF', value: 0, name: "恐惧", effect: "WEAK", effectValue: 2 }
    ]
  },
  "Venom_Lantern": { 
    id: "Venom_Lantern", 
    name: "剧毒灯笼", 
    title: "腐蚀之光", 
    maxHp: 50, 
    difficultyRank: 1, 
    act: 2, 
    img: `${ENEMY_ART_URL}/Venom_Lantern_default_c_art.png`, 
    avatar: `${ENEMY_ART_URL}/Venom_Lantern_default_c_art.png`, 
    actions: [
      { type: 'DEBUFF', value: 0, name: "毒性散播", effect: "POISON", effectValue: 1 },
      { type: 'ATTACK', value: 12, name: "灯火灼烧" }
    ]
  },

  // --- ACT 2 BOSS ---
  "Charon": { 
    id: "Charon", 
    name: "冥河船夫卡戎", 
    title: "谎言回廊的领主", 
    maxHp: 280, 
    difficultyRank: 99, 
    act: 2, 
    img: `${ENEMY_ART_URL}/Ferryman_default_c_art.png`, 
    avatar: `${ENEMY_ART_URL}/Ferryman_default_c_art.png`, 
    isBoss: true,
    traits: ["BOSS_CHARON", "AURA_HP_DEGEN"],
    traitValues: { hpDegenPercent: 5 },
    actionPattern: "ALTERNATING",
    actions: [
      { type: 'ATTACK', value: 24, name: "冥河审判" },
      { type: 'DEBUFF', value: 0, name: "腐蚀", effect: "WEAK_VULN", effectValue: 2 }
    ]
  },

  // --- ACT 3 小怪 ---
  "Golden_Guard": { 
    id: "Golden_Guard", 
    name: "金甲御林军", 
    title: "众神禁卫", 
    maxHp: 100, 
    difficultyRank: 3, 
    act: 3, 
    img: `${ENEMY_ART_URL}/Golden_Guard_default_c_art.png`, 
    avatar: `${ENEMY_ART_URL}/Golden_Guard_default_c_art.png`, 
    traits: ["PARRY_ACCUMULATE"],
    actions: [
      { type: 'BUFF', value: 0, name: "神圣防御", effect: "PARRY", effectValue: 1 },
      { type: 'ATTACK', value: 15, name: "金戟挥砍" }
    ]
  },
  "Thunder_Construct": { 
    id: "Thunder_Construct", 
    name: "雷霆构造体", 
    title: "宙斯的零件", 
    maxHp: 120, 
    difficultyRank: 3, 
    act: 3, 
    img: `${ENEMY_ART_URL}/Thunder_Construct_default_c_art.png`, 
    avatar: `${ENEMY_ART_URL}/Thunder_Construct_default_c_art.png`, 
    traits: ["REFLECT"],
    traitValues: { reflectDamage: 5 },
    actions: [
      { type: 'ATTACK', value: 12, count: 2, name: "电磁振荡" },
      { type: 'DEBUFF', value: 0, name: "麻痹", effect: "VULNERABLE", effectValue: 2 }
    ]
  },
  "Arbiter": { 
    id: "Arbiter", 
    name: "审判天使", 
    title: "奥林匹斯之矛", 
    maxHp: 150, 
    difficultyRank: 3, 
    act: 3, 
    img: `${ENEMY_ART_URL}/Arbiter_default_c_art.png`, 
    avatar: `${ENEMY_ART_URL}/Arbiter_default_c_art.png`, 
    traits: ["OLYMPUS_AURA"],
    actions: [
      { type: 'ATTACK', value: 18, name: "审判之剑" },
      { type: 'BUFF', value: 0, name: "奥林匹斯之光", effect: "STRENGTH", effectValue: 2 }
    ]
  },

  // --- ACT 3 BOSS ---
  "Zeus": { 
    id: "Zeus", 
    name: "众神之父宙斯", 
    title: "奥林匹斯之巅", 
    maxHp: 400, 
    difficultyRank: 99, 
    act: 3, 
    img: `${ENEMY_ART_URL}/Zeus_default_c_art.png`, 
    avatar: `${ENEMY_ART_URL}/Zeus_default_c_art.png`, 
    isBoss: true,
    traits: ["BOSS_ZEUS", "PHASE_TRANSITION"],
    nextPhase: "Zeus_Adamas",
    actions: [
      { type: 'ATTACK', value: 10, count: 5, name: "五雷轰顶" }
    ]
  },
  "Zeus_Adamas": { 
    id: "Zeus_Adamas", 
    name: "宙斯·阿陀磨须", 
    title: "超越时间之拳", 
    maxHp: 400, 
    difficultyRank: 99, 
    act: 3, 
    img: `${ENEMY_ART_URL}/Zeus_Adamas_default_c_art.png`, 
    avatar: `${ENEMY_ART_URL}/Zeus_Adamas_default_c_art.png`, 
    isBoss: true,
    traits: ["BOSS_ZEUS", "PHASE_TRANSITION"],
    nextPhase: "Zeus_Cosmos",
    actions: [
      { type: 'SPECIAL', value: 0, name: "超越时间之拳", specialId: "STUN_PLAYER", effectValue: 1 },
      { type: 'ATTACK', value: 25, name: "时空冲击" }
    ]
  },
  "Zeus_Cosmos": { 
    id: "Zeus_Cosmos", 
    name: "宙斯·终焉形态", 
    title: "诸神的黄昏", 
    maxHp: 800, 
    difficultyRank: 99, 
    act: 3, 
    img: `${ENEMY_ART_URL}/Zeus_Cosmos_default_c_art.png`, 
    avatar: `${ENEMY_ART_URL}/Zeus_Cosmos_default_c_art.png`, 
    isBoss: true,
    traits: ["BOSS_ZEUS", "FINAL_PHASE"],
    actions: [
      { type: 'ATTACK', value: 40, name: "终焉之雷" },
      { type: 'BUFF', value: 0, name: "神王威压", effect: "STRENGTH", effectValue: 5 }
    ]
  },

  // --- 旧数据保留 (用于兼容) ---
  "Katarina": { id: "Katarina", name: "卡特琳娜", title: "不祥之刃", maxHp: 42, difficultyRank: 1, act: 1, img: `${LOADING_URL}/Katarina_0.jpg`, avatar: `${CDN_URL}/img/champion/Katarina.png`, actions: [{ type: 'ATTACK', value: 6, count: 2, name: "瞬步连击" }, { type: 'DEBUFF', value: 0, name: "死亡莲华", effect: "VULNERABLE", effectValue: 2 }, { type: 'ATTACK', value: 15, name: "匕首投掷" }] },
  "Talon": { id: "Talon", name: "泰隆", title: "刀锋之影", maxHp: 48, difficultyRank: 1, act: 1, img: `${LOADING_URL}/Talon_0.jpg`, avatar: `${CDN_URL}/img/champion/Talon.png`, actions: [{ type: 'ATTACK', value: 12, name: "诺克萨斯外交" }, { type: 'ATTACK', value: 8, name: "刺客诡道", count: 2 }, { type: 'BUFF', value: 0, name: "翻墙跑路", effect: "BLOCK", effectValue: 10 }] },
  "Sylas_E": { id: "Sylas_E", name: "塞拉斯", title: "解脱者", maxHp: 65, difficultyRank: 2, act: 1, img: `${LOADING_URL}/Sylas_0.jpg`, avatar: `${CDN_URL}/img/champion/Sylas.png`, actions: [{ type: 'ATTACK', value: 10, name: "锁链鞭击" }, { type: 'DEBUFF', value: 0, name: "弑君突刺", effect: "WEAK", effectValue: 2 }, { type: 'ATTACK', value: 5, count: 3, name: "其人之道" }] },
  "Lucian": { id: "Lucian", name: "卢锡安", title: "圣枪游侠", maxHp: 60, difficultyRank: 2, act: 1, img: `${LOADING_URL}/Lucian_0.jpg`, avatar: `${CDN_URL}/img/champion/Lucian.png`, actions: [{ type: 'ATTACK', value: 7, count: 2, name: "圣光银弹" }, { type: 'BUFF', value: 0, name: "热诚", effect: "BLOCK", effectValue: 12 }, { type: 'DEBUFF', value: 0, name: "冷酷追击", effect: "WEAK", effectValue: 1, actionType: 'Attack', dmgValue: 8 }] },
  "Fiora": { id: "Fiora", name: "菲奥娜", title: "无双剑姬", maxHp: 70, difficultyRank: 2, act: 1, img: `${LOADING_URL}/Fiora_0.jpg`, avatar: `${CDN_URL}/img/champion/Fiora.png`, actions: [{ type: 'ATTACK', value: 14, name: "破空斩" }, { type: 'BUFF', value: 0, name: "心眼刀", effect: "BLOCK", effectValue: 15 }, { type: 'ATTACK', value: 8, name: "夺命连刺" }] },
  "Viego": { id: "Viego", name: "佛耶戈", title: "破败之王", maxHp: 80, difficultyRank: 3, act: 2, img: `${LOADING_URL}/Viego_0.jpg`, avatar: `${CDN_URL}/img/champion/Viego.png`, actions: [{ type: 'ATTACK', value: 20, name: "破败王剑" }, { type: 'BUFF', value: 0, name: "休止符", effect: "STRENGTH", effectValue: 3 }, { type: 'ATTACK', value: 12, count: 2, name: "折磨" }] },
  "LeBlanc": { id: "LeBlanc", name: "乐芙兰", title: "诡术妖姬", maxHp: 85, difficultyRank: 3, act: 2, img: `${LOADING_URL}/Leblanc_0.jpg`, avatar: `${CDN_URL}/img/champion/Leblanc.png`, actions: [{ type: 'DEBUFF', value: 0, name: "恶意魔印", effect: "VULNERABLE", effectValue: 3 }, { type: 'ATTACK', value: 18, name: "幻影锁链" }, { type: 'ATTACK', value: 12, count: 2, name: "故技重施" }] },
  "Darius_BOSS": { id: "Darius_BOSS", name: "德莱厄斯", title: "诺克萨斯之手", maxHp: 150, difficultyRank: 99, act: 1, img: `${LOADING_URL}/Darius_0.jpg`, avatar: `${CDN_URL}/img/champion/Darius.png`, actions: [{ type: 'ATTACK', value: 15, name: "大杀四方" }, { type: 'DEBUFF', value: 0, name: "致残打击", effect: "WEAK", effectValue: 3 }, { type: 'ATTACK', value: 30, name: "断头台！" }] }
};

