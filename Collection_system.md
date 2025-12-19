# Collection System - Game Data Reference

## 📊 数据汇总

**版本**: v1.0  
**最后更新**: 2025-11-29

### 统计
- **总计卡牌**: 192 张
  - 基础卡牌: 4 张
  - 英雄卡牌: 80 张 (20 英雄 × 4 张)
  - 中立卡牌: 108 张
- **英雄被动**: 20 个
- **装备/遗物**: 10 个

---

## 🃏 卡牌数据

### 基础卡牌 (4张)

| ID | 名称 | 类型 | 费用 | 稀有度 | 效果 |
|----|------|------|------|--------|------|
| Strike | 打击 | ATTACK | 1 | BASIC | 造成6点伤害 |
| Defend | 防御 | SKILL | 1 | BASIC | 获得5点护甲 |
| Ignite | 点燃 | SKILL | 0 | UNCOMMON | 获得2点力量（消耗） |
| Heal | 治疗术 | SKILL | 1 | UNCOMMON | 恢复10点生命（消耗） |

---

### 英雄卡牌 (80张 = 20英雄 × 4张)

#### 1. Garen (盖伦)

| 卡牌ID | 名称 | 类型 | 费用 | 稀有度 | 效果 | 描述 |
|--------|------|------|------|--------|------|------|
| GarenQ | 致命打击 | ATTACK | 1 | COMMON | VULNERABLE(2) | 造成6伤害并施加2层易伤 |
| GarenW | 勇气 | SKILL | 1 | UNCOMMON | CLEANSE + BLOCK(10) | 获得10护甲并清除1个负面状态 |
| GarenE | 审判 | ATTACK | 2 | UNCOMMON | - | 造成14点伤害 |
| GarenR | 德玛西亚正义 | ATTACK | 3 | RARE | EXECUTE_SCALE(0.5) | 造成24伤害 + 50%已损失生命 |

#### 2. Darius (德莱厄斯)

| 卡牌ID | 名称 | 类型 | 费用 | 稀有度 | 效果 | 描述 |
|--------|------|------|------|--------|------|------|
| DariusQ | 大杀四方 | ATTACK | 1 | COMMON | BLEED(2) | 造成6伤害并施加2层流血 |
| DariusW | 致残打击 | ATTACK | 1 | UNCOMMON | VULNERABLE(1) | 造成5伤害并给予1层易伤 |
| DariusE | 无情铁手 | SKILL | 2 | UNCOMMON | BLEED_VULN(3) | 施加3层流血和1层虚弱 |
| DariusR | 诺克萨斯断头台 | ATTACK | 3 | RARE | BLEED_EXECUTE(2) | 造成18 + (流血层数×2)伤害 |

#### 3. Lux (拉克丝)

| 卡牌ID | 名称 | 类型 | 费用 | 稀有度 | 效果 | 描述 |
|--------|------|------|------|--------|------|------|
| LuxQ | 光之束缚 | ATTACK | 1 | COMMON | VULNERABLE(1) | 造成8伤害并施加1层易伤 |
| LuxW | 结界护盾 | SKILL | 1 | UNCOMMON | BLOCK(6) + DRAW_NEXT(1) | 获得6护甲，下回合抽1牌 |
| LuxE | 透光奇点 | ATTACK | 2 | UNCOMMON | BONUS_PER_EXTRA_MANA(2) | 造成12伤害，额外法力每点+2伤害 |
| LuxR | 终极闪光 | ATTACK | 3 | RARE | CONDITIONAL_DOUBLE(4) | 造成28伤害，打出≥4张牌则翻倍 |

#### 4. Jinx (金克丝)

| 卡牌ID | 名称 | 类型 | 费用 | 稀有度 | 效果 | 描述 |
|--------|------|------|------|--------|------|------|
| JinxQ | 机枪扫射 | ATTACK | 1 | COMMON | MULTI_HIT(3) | 对单体造成3段击打（总24伤害） |
| JinxW | 电磁炮 | ATTACK | 1 | UNCOMMON | VULNERABLE(2) | 造成10伤害并施加2层易伤 |
| JinxE | 火箭陷阱 | SKILL | 1 | UNCOMMON | MARK_TRIGGER(12) | 放置标记，触发时造成12伤害 |
| JinxR | 超究极飞弹 | ATTACK | 3 | RARE | LOW_HP_BONUS(25) | 造成25伤害，目标HP<50%再造成25 |

#### 5. Yasuo (亚索)

| 卡牌ID | 名称 | 类型 | 费用 | 稀有度 | 效果 | 描述 |
|--------|------|------|------|--------|------|------|
| YasuoQ | 斩钢闪 | ATTACK | 1 | COMMON | CRIT_CHANCE(10) | 造成7伤害，暴击率受力量影响 |
| YasuoW | 风之墙 | SKILL | 1 | UNCOMMON | IMMUNE_ONCE(1) + BLOCK(4) | 获得4护甲并免疫一次伤害 |
| YasuoE | 疾风步 | ATTACK | 0 | UNCOMMON | DOUBLE_IF_ATTACKED | 造成4伤害，若已打出攻击则翻倍 |
| YasuoR | 狂风绝息斩 | ATTACK | 3 | RARE | SCALE_BY_CRIT(6) | 造成6×(本回合暴击次数)伤害 |

#### 6. Sona (娑娜)

| 卡牌ID | 名称 | 类型 | 费用 | 稀有度 | 效果 | 描述 |
|--------|------|------|------|--------|------|------|
| SonaQ | 英勇赞美诗 | ATTACK | 1 | COMMON | SELF_BLOCK(3) | 造成8伤害，自身获得3护甲 |
| SonaW | 坚毅咏叹调 | SKILL | 1 | UNCOMMON | HEAL(8) | 恢复8生命 |
| SonaE | 迅捷奏鸣曲 | SKILL | 1 | UNCOMMON | DRAW_MANA(2) | 抽2牌并获得1临时法力 |
| SonaR | 终乐章 | ATTACK | 3 | RARE | PER_CARD_BONUS(2) | 造成20伤害，每打出1牌额外+2伤害 |

#### 7. Ekko (艾克)

| 卡牌ID | 名称 | 类型 | 费用 | 稀有度 | 效果 | 描述 |
|--------|------|------|------|--------|------|------|
| EkkoQ | 时间折刃 | ATTACK | 1 | COMMON | RETRO_BONUS(6) | 造成8伤害，上回合已伤害目标+6 |
| EkkoW | 时光护盾 | SKILL | 1 | UNCOMMON | REFLECT_IF_HIT(6) + BLOCK(10) | 获得10护甲，被攻击反弹6伤害 |
| EkkoE | 相位俯冲 | ATTACK | 1 | UNCOMMON | NEXT_COST_REDUCE(1) | 造成8伤害，下张攻击牌费用-1 |
| EkkoR | 时空逆转 | SKILL | 3 | RARE | HEAL_AND_DAMAGE(20) | 恢复20生命并造成20伤害 |

#### 8. Sylas (塞拉斯)

| 卡牌ID | 名称 | 类型 | 费用 | 稀有度 | 效果 | 描述 |
|--------|------|------|------|--------|------|------|
| SylasQ | 锁链鞭笞 | ATTACK | 1 | COMMON | - | 造成8点伤害 |
| SylasW | 吸取之斩 | ATTACK | 1 | UNCOMMON | LIFELINK(8) | 造成8伤害并回复8生命 |
| SylasE | 叛乱突袭 | SKILL | 1 | UNCOMMON | NEXT_ATTACK_DOUBLE(2) + BLOCK(6) | 获得6护甲，下次攻击翻倍 |
| SylasR | 夺魂 | SKILL | 3 | RARE | COPY_ENEMY_ACTION | 复制敌人下一行动（伤害减半） |

#### 9. Urgot (厄加特)

| 卡牌ID | 名称 | 类型 | 费用 | 稀有度 | 效果 | 描述 |
|--------|------|------|------|--------|------|------|
| UrgotQ | 腐蚀炸弹 | ATTACK | 1 | COMMON | - | 造成6点伤害 |
| UrgotW | 集火屏障 | SKILL | 1 | UNCOMMON | BLOCK(15) | 获得15护甲 |
| UrgotE | 超限驱动 | SKILL | 1 | UNCOMMON | SELF_DAMAGE(4) | 造成10伤害，自身受4反噬 |
| UrgotR | 处刑索命 | ATTACK | 3 | RARE | LOW_HP_EXECUTE(30) | 造成30伤害，目标HP<30%直接处决 |

#### 10. Viktor (维克兹)

| 卡牌ID | 名称 | 类型 | 费用 | 稀有度 | 效果 | 描述 |
|--------|------|------|------|--------|------|------|
| ViktorQ | 能量转导 | SKILL | 1 | COMMON | BUFF_NEXT_SKILL(2) | 造成7伤害，下张技能牌+2伤害 |
| ViktorW | 引力场 | SKILL | 1 | UNCOMMON | STUN(1) | 使目标眩晕1回合 |
| ViktorE | 光束 | ATTACK | 2 | UNCOMMON | BONUS_IF_VULN(4) | 造成12伤害，目标易伤+4 |
| ViktorR | 进化歧路 | SKILL | 3 | RARE | DRAW_ON_USE(1) | 造成18伤害并抽1牌 |

#### 11-20. 其他英雄

**注**: 11-20号英雄的详细卡牌数据请参考 `src/data/cards.js` 文件

---

## 🎭 英雄被动技能

| ID | 英雄 | 被动名称 | 效果描述 |
|----|------|----------|----------|
| GarenPassive | Garen | 坚韧 | 战斗结束时恢复6 HP |
| DariusPassive | Darius | 出血 | 每次攻击时，给予敌人1层虚弱 |
| LuxPassive | Lux | 光芒四射 | 每回合开始时获得1点额外法力 |
| JinxPassive | Jinx | 爆发 | 每回合初始手牌数量+1 |
| YasuoPassive | Yasuo | 浪客之道 | 攻击牌暴击几率+10% |
| SonaPassive | Sona | 能量弦 | 每回合打出第三张卡时，获得3点临时护甲 |
| EkkoPassive | Ekko | Z型驱动共振 | 每次打出消耗卡时，获得1点力量 |
| SylasPassive | Sylas | 叛乱 | 每次打出技能牌时，回复3点生命值 |
| UrgotPassive | Urgot | 回火 | 每场战斗开始时获得15点护甲 |
| ViktorPassive | Viktor | 光荣进化 | 每回合开始时，50%几率获得一张额外基础卡 |
| RivenPassive | Riven | 符文之刃 | 每打出3张攻击牌，获得1点法力 |
| TwistedFatePassive | TwistedFate | 灌铅骰子 | 每次战斗胜利额外获得15金币 |
| LeeSinPassive | LeeSin | 疾风骤雨 | 打出技能牌后，下一张攻击牌费用-1 |
| VaynePassive | Vayne | 圣银弩箭 | 对同一目标连续造成3次伤害时，额外造成10点伤害 |
| TeemoPassive | Teemo | 游击战 | 每回合开始时，给敌人施加2层虚弱 |
| ZedPassive | Zed | 影分身 | 每回合第一张攻击牌额外造成50%伤害 |
| NasusPassive | Nasus | 汲魂痛击 | 每次用攻击牌击杀敌人，永久获得1点力量 |
| IreliaPassive | Irelia | 热诚 | 每次击杀敌人，恢复1点法力并抽1张牌 |
| ThreshPassive | Thresh | 地狱诅咒 | 每次击杀敌人，永久增加2最大生命值 |
| KatarinaPassive | Katarina | 贪婪 | 每回合每打出3张攻击牌后，下一张攻击牌伤害翻倍 |

---

## 🎒 装备/遗物系统

### 普通装备 (COMMON)

| ID | 名称 | 价格 | 效果 | 图标ID |
|----|------|------|------|--------|
| DoransShield | 多兰之盾 | 100 | 战斗开始时获得6点护甲 | 1054 |
| LongSword | 长剑 | 150 | 战斗开始时获得1点力量 | 1036 |
| RubyCrystal | 红水晶 | 120 | 最大生命值+15 | 1028 |

### 稀有装备 (UNCOMMON)

| ID | 名称 | 价格 | 效果 | 图标ID |
|----|------|------|------|--------|
| VampiricScepter | 吸血鬼节杖 | 280 | 每次打出攻击牌恢复1点生命 | 1053 |
| Sheen | 耀光 | 350 | 每回合打出的第一张攻击牌，伤害翻倍 | 3057 |
| BrambleVest | 荆棘背心 | 200 | 每次被攻击时，对攻击者造成3点伤害 | 3076 |

### 史诗装备 (RARE)

| ID | 名称 | 价格 | 效果 | 图标ID | 限制 |
|----|------|------|------|--------|------|
| ZhonyasHourglass | 中娅沙漏 | 500 | 免疫下一回合的敌人伤害 | 3157 | 每场战斗限1次 |
| InfinityEdge | 无尽之刃 | 700 | 所有攻击牌伤害+50% | 3031 | - |
| Redemption | 救赎 | 650 | 每回合开始时，治疗你和敌人5点生命 | 3107 | - |
| GuardianAngel | 守护天使 | 750 | 死亡时，恢复40点生命值 | 3026 | 每场战斗限1次 |

---

## 📁 数据源文件

- **卡牌数据**: `src/data/cards.js` - `CARD_DATABASE` (192张)
- **装备数据**: `src/data/relics.js` - `RELIC_DATABASE` (10个)
- **图标资源**: `src/data/constants.js` - `SPELL_URL`, `ITEM_URL`, `PASSIVE_URL`

---

## 💡 UI设计建议

可通过以下方式访问完整数据：
```javascript
import { CARD_DATABASE } from './src/data/cards.js';
import { RELIC_DATABASE } from './src/data/relics.js';

// 获取所有卡牌
const allCards = Object.values(CARD_DATABASE);

// 按英雄筛选
const garenCards = allCards.filter(card => card.hero === 'Garen');

// 按稀有度筛选
const rareCards = allCards.filter(card => card.rarity === 'RARE');
```
