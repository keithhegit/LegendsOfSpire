# New Achievement System – Execution Plan (v0.2)

> 基于《成就系统初稿》提出的 40 项里程碑，本方案聚焦 **第一版交付范围**、**技术落地方式** 与 **QA/运营需求**，确保能在一个迭代周期内实现核心体验，并为后续扩展留足结构空间。

---

## 1. 版本目标

| 目标 | 描述 | 验收方式 |
| ---- | ---- | -------- |
| **G1. 运行时追踪** | 可在一场跑中实时记录成就条件（战斗内/战斗外）。 | Devtools 中 `achievementTracker` 有清晰状态镜像；完成条件后触发 HUD 提示。 |
| **G2. 解锁内容发放** | 成就完成后立即写入账号存档，奖励在本局或下局可见。 | 存档 JSON 新增 `achievements`, `unlockedRewards` 字段；重新登录后仍保持。 |
| **G3. 前端呈现** | 主菜单「成就」页显示分类、进度、奖励；战斗或跑结算时弹出成就解锁卡片。 | UI 截图 & 交互录屏；QA checklist。 |
| **G4. 运营开关** | 可通过远端配置/版本号强制关闭成就（如 Custom Mode ）。 | `.env` / Remote config flag，关掉后逻辑完全跳过。 |

---

## 2. 系统结构

### 2.1 状态追踪（Runtime Tracker）

```
AchievementTracker (singleton per run)
 ├── sessionStats:  run 层级（战斗次数、耗时、boss 状态 …）
 ├── combatStats:   当前战斗实时节点（回合数、出牌序列、buff/HP 阈值）
 ├── metaStats:     角色、难度、Ascension、Mod 标记
 └── events:        以 publish/subscribe 接入 BattleScene / Map / Shop 事件
```

- **事件来源**：`BattleScene`（攻击/HP/Buff）、`App`（节点切换、商店购买）、`InventoryPanel`（遗物/卡组管理）。
- **持久化**：战斗/跑结束时写入 `achievementTracker.flush()`，生成 `[achievementId, timestamp, rewardState]`。

### 2.2 存档结构

```ts
type SaveFile = {
  ...,
  achievements: {
    unlocked: string[];
    progress: Record<string, AchievementProgress>;
  };
  rewards: {
    cards: string[];
    relics: string[];
    modes: string[];
  };
}
```

- `progress` 仅对累计型成就（如“累计击杀 500 敌”）记录数值，普通单次成就直接写进 `unlocked`。
- 奖励与内容池产生关联：`CARD_DATABASE` / `RELIC_DATABASE` 新增 `requiresAchievement` 字段，由 `App` 在发牌/掉落时过滤。

### 2.3 配置驱动

新增 `src/data/achievements.js`：

```ts
export const ACHIEVEMENTS = [
  {
    id: 'ACH_001',
    category: 'BATTLE',
    name: 'Shrug It Off',
    description: '以 1 HP 获胜',
    difficulty: 'B',
    trigger: { type: 'battle_end', hpEqual: 1 },
    reward: { type: 'CARD', ref: 'ToughBandages' },
    enabledModes: ['DEFAULT', 'ASCENSION'],
  },
  ...
];
```

触发条件统一描述，Tracker 读取配置自动注册监听，无需手写 if/else。

---

## 3. UX & 交互

| 场景 | 要素 | 说明 |
| ---- | ---- | ---- |
| **主菜单 / 成就页** | 分类 Tab + 进度条 + 奖励预览 | 参考初稿中的 4 大分类，每条显示达成条件、奖励、达成时间。 |
| **HUD 提示** | 战斗中侧边弹出 `ACHIEVEMENT UNLOCKED` | 小型卡片 + 图标 + 奖励摘要，2 秒自动消失。 |
| **跑结算** | 多个成就一次性展示 | 使用轮播/列表，支持“查看详情”跳转主菜单成就页。 |
| **奖励提示** | 当奖励为卡牌/遗物/模式时即时提示 | 例如“已解锁 Kunai，加入起始遗物池”。 |

---

## 4. 实施里程碑

| Sprint | 内容 | 输出 |
| ------ | ---- | ---- |
| **S1 - Tracking Core** | 实现 `AchievementTracker`、事件总线、配置文件解析；覆盖 3 个示例成就 (ACH_001/005/017)。 | 单元测试 + Dev overlay |
| **S2 - 存档与奖励** | Save/Load、新奖励 Hook（卡牌/遗物/模式）、禁用条件（Mods/Custom Mode）。 | Save schema 迁移脚本 |
| **S3 - UI/UX** | 主菜单成就页、HUD 提示、跑结算弹窗、音效/动画。 | Figma 走查 + Cypress 冒烟 |
| **S4 - 扩充 40 项清单** | 批量录入初稿中 40 项及 Eternal One；撰写 QA checklist。 | 表格 + 自动化脚本 |

### 4.1 Sprint S1 实装范围（进行中）

- **ACH_001 – Shrug It Off**：战斗胜利且玩家 HP ≤ 10。
- **ACH_005 – Adrenaline**：战斗内任意时刻法力值峰值 ≥ 4。
- **ACH_019 – The Guardian**：击败 Act1 Boss（岩石守护者）。

> 以上三条用于打通 Tracker → HUD → Save 通路，其余成就将在 S4 通过配置驱动批量导入。

### 4.2 成就清单 & 状态追踪

#### 战斗壮举
| ID | 名称 | 分类 | 触发条件 | 状态 |
|----|------|------|----------|------|
| ACH_001 | Shrug It Off | BATTLE | 战斗胜利且 HP ≤10 | ✅ 已实现 |
| ACH_002 | Purity | BATTLE | 手牌+牌库+弃牌 ≤3 | 🔄 规划中 |
| ACH_003 | Come At Me | BATTLE | 不出攻击牌赢战 | 🔄 规划中 |
| ACH_004 | The Pact | BATTLE | 单战耗尽 ≥20 张牌 | 🔄 规划中 |
| ACH_005 | Adrenaline | BATTLE | 战斗中法力峰值 ≥4 | ✅ 已实现 |
| ACH_006 | Powerful | BATTLE | 战斗中 Buff ≥10 层 | 🔄 规划中 |
| ACH_007 | Jaxxed | BATTLE | Ironclad 力量 ≥50 | 🔄 规划中 |
| ACH_008 | Impervious | BATTLE | 战斗中格挡 ≥99 | 🔄 规划中 |
| ACH_009 | Barricaded | BATTLE | 战斗中格挡 ≥999 | 🔄 规划中 |
| ACH_010 | Catalyst | BATTLE | 单敌中毒 ≥99 | 🔄 规划中 |
| ACH_011 | Plague | BATTLE | 单场毒杀 3 敌 | 🔄 规划中 |
| ACH_012 | Ninja | BATTLE | 单回合出 10 飞刀 | 🔄 规划中 |
| ACH_013 | Infinity | BATTLE | 单回合出牌 ≥25 | 🔄 规划中 |
| ACH_014 | Focused | BATTLE | Defect 专注 ≥25 | 🔄 规划中 |
| ACH_015 | Neon | BATTLE | Defect 一回合充能 ≥9 | 🔄 规划中 |
| ACH_018 | Big Hitter | BATTLE | 单次伤害 ≥50 | 🔄 规划中 |
| ACH_019 | Snowball Fight | BATTLE | 单敌雪 ≥15 层 | 🔄 规划中 |
| ACH_020 | Level Up! | BATTLE | 升级任意机制 Lv10 | 🔄 规划中 |
| ACH_021 | 10K Chips | BATTLE | 单回合伤害 ≥10000 | 🔄 规划中 |
| ACH_022 | Retrograde | BATTLE | 任意牌型 Lv10 | 🔄 规划中 |
| ACH_023 | Lone Survivor | BATTLE | 仅领袖存活胜利 | 🔄 规划中 |
| ACH_025 | Desecration | BATTLE | 摧毁防御陷阱 | 🔄 规划中 |

#### Boss / 机制掌握
| ID | 名称 | 分类 | 触发条件 | 状态 |
|----|------|------|----------|------|
| ACH_016 | You Are Nothing | BOSS | Turn1 击败 Boss | 🔄 规划中 |
| ACH_017 | Perfect | BOSS | 不掉血击败 Boss | 🔄 规划中 |
| ACH_019 | The Guardian | BOSS | 击败 Act1 Boss（岩石守护者） | ✅ 已实现 |
| ACH_020 | The Boss | BOSS | 击败 Act1 Slime Boss | 🔄 规划中 |
| ACH_021 | The Automaton | BOSS | 击败 Act2 Bronze Automaton | 🔄 规划中 |
| ACH_024 | The Crow | BOSS | 击败 Act3 Awakened One | 🔄 规划中 |
| ACH_026-028 | Boss Tier 1+ | BOSS | 原 11 个及 Act4 扩展（Seraph/Miners） | 🔄 规划中 |
| ACH_037 | The End? | BOSS | 三角色完成 Ending | 🔄 规划中 |
| ACH_057 | Clan Master: Strength | MECH | 力量机制 Lv10 | 🔄 规划中 |
| ACH_058 | Clan Master: Poison | MECH | 毒机制 Lv10 | 🔄 规划中 |
| ACH_059 | Clan Master: Focus | MECH | 专注机制 Lv10 | 🔄 规划中 |
| ACH_060 | Clan Master: Wrath | MECH | Wrath 机制 Lv10 | 🔄 规划中 |
| ACH_061 | Pyre Survivor | ENDLESS | Pyre ≥25 层 | 🔄 规划中 |
| ACH_062 | Angel Hunter | BOSS | 击败 Angel Boss | 🔄 规划中 |
| ACH_063 | Machinist | MECH | 仅物品牌胜 | 🔄 规划中 |
| ACH_064-076 | Mechanism Mastery | MECH | Block/Draw/Energy/DoT/Snow/Fire 等 Lv5-10 | 🔄 规划中 |

#### 收藏与极限
| ID | 名称 | 分类 | 触发条件 | 状态 |
|----|------|------|----------|------|
| ACH_077 | Card Collector | COLLECTION | 解锁 50 张卡 | 🔄 规划中 |
| ACH_078 | Relic Hoarder | COLLECTION | 持有 20 遗物 | 🔄 规划中 |
| ACH_079 | All Cards | COLLECTION | 解锁所有卡牌 | 🔄 规划中 |
| ACH_080-089 | Hero/Card Completionist | COLLECTION | 英雄/卡全解锁（如 Sharra 系列） | 🔄 规划中 |
| ACH_090 | No Relics | CHALLENGE | 无遗物通关 | 🔄 规划中 |
| ACH_091 | Speed Climber++ | CHALLENGE | <10 分通关 | 🔄 规划中 |
| ACH_092 | Gold Stake | CHALLENGE | Asc20+ 全角色胜 | 🔄 规划中 |
| ACH_093 | Joker Master | CHALLENGE | Joker 遗物全金效 | 🔄 规划中 |
| ACH_094-099 | Extremes | CHALLENGE | 无攻击/0 能量/全普通牌/1HP 全程/Endless100 | 🔄 规划中 |

#### META / 运行统计
| ID | 名称 | 分类 | 触发条件 | 状态 |
|----|------|------|----------|------|
| ACH_038 | Who Needs Relics? | MISC | 单遗物通关 | 🔄 规划中 |
| ACH_039 | Speed Climber | MISC | 20 分钟内通关 | 🔄 规划中 |
| ACH_040 | Common Sense | MISC | 无非普通牌通关 | 🔄 规划中 |
| ACH_041 | My Lucky Day | DAILY | 赢得 Daily Climb | 🔄 规划中 |
| ACH_042 | Eternal One | META | 解锁所有成就 | 🔄 规划中 |
| ACH_100 | Merchant Enthusiast | META | 拜访商店 ≥10 次 | 🟨 待开发 |
| ACH_101 | Explorer | META | 走过事件节点 ≥20 | 🟨 待开发 |
| ACH_102 | Monster Slayer | META | 击杀普通敌人 ≥100 | 🟨 待开发 |
| ACH_103 | Act II Victor | HERO | 通关 Act2（累计） | 🟨 待开发 |
| ACH_104 | Act III Victor | HERO | 通关 Act3（累计） | 🟨 待开发 |
| ACH_105 | Treasure Hunter | META | 开启宝箱 ≥15 | 🟨 待开发 |
| ACH_106 | Big Spender | META | 单次商店消费 ≥300G | 🟨 待开发 |
| ACH_107 | Mana Master | META | 累计回蓝 ≥100 | 🟨 待开发 |
| ACH_108 | Relic Collector | META | 同一跑获得 ≥10 遗物 | 🟨 待开发 |
| ACH_109 | Eventful Run | META | 单次跑走完所有事件 | 🟨 待开发 |
| ACH_110 | Ascender | META | Ascension ≥15 通关 | 🟨 待开发 |

> 表格按分类展开，涵盖 40+ 项成就。前三条（ACH_001/005/019）已和 S1 路径打通，后续依照状态更新 ✅/🟡/🔄 以便 QA、策划追踪。

### 4.3 当前已实装成就（48 项）

> 以下内容同步自 `src/data/achievements.js`，代表目前客户端与服务端同时接入、可实时解锁的成就。所有条目均已写入 Tracker 与奖励管线，可直接用于 QA/运营验收。

#### 战斗 / Boss / 机制（ACH_001–ACH_025）
| ID | 名称 | 触发说明 | 奖励 |
|----|------|----------|------|
| ACH_001 | Shrug It Off | 战斗胜利且 HP ≤10 | 卡牌 ToughBandages |
| ACH_002 | Purity | 手牌+牌库+弃牌总数 ≤3 | 遗物 PurityRing |
| ACH_003 | Come At Me | 不出攻击牌获胜 | 模式 PureSkillMode |
| ACH_004 | The Pact | 单场耗尽 ≥20 张牌 | 卡牌 ExhaustPact |
| ACH_005 | Adrenaline | 单回合法力峰值 ≥4 | 遗物 AdrenalineOrb |
| ACH_006 | Powerful | 战斗中 Buff 层数 ≥10 | 卡牌 PowerSurge |
| ACH_007 | Jaxxed | Ironclad 力量 ≥50 | 遗物 JaxxsBarbell |
| ACH_008 | Impervious | 战斗中格挡 ≥99 | 卡牌 ImperviousShell |
| ACH_009 | Barricaded | 战斗中格挡 ≥999 | 模式 BarricadeChallenge |
| ACH_010 | Catalyst | 单敌中毒 ≥99 层 | 卡牌 CatalystVial |
| ACH_011 | Plague | 单战毒杀 ≥3 敌 | 遗物 PlagueMask |
| ACH_012 | Ninja | 单回合飞刀 ≥10 | 卡牌 MasterNinja |
| ACH_013 | Infinity | 单回合出牌 ≥25 | 模式 InfinityLoop |
| ACH_014 | Focused | Defect 专注 ≥25 | 遗物 FocusCore |
| ACH_015 | Neon | Defect 单回合充能 ≥9 | 卡牌 NeonOverload |
| ACH_016 | You Are Nothing | Turn1 击败 Boss | 遗物 Nothingness |
| ACH_017 | Perfect | 不掉血击败 Boss | 模式 PerfectRun |
| ACH_018 | Big Hitter | 单次伤害 ≥50 | 卡牌 MegaStrike |
| ACH_019 | The Guardian | 击败 Act1 Boss（岩石守护者） | 卡牌 GuardianStrike |
| ACH_020 | Level Up! | 任意机制升级至 Lv10 | 模式 ClanMastery |
| ACH_021 | 10K Chips | 单回合总伤害 ≥10000 | 卡牌 ChipExplosion |
| ACH_022 | Retrograde | 任意牌型等级 Lv10 | 遗物 LevelBooster |
| ACH_023 | Lone Survivor | 仅领袖存活取胜 | 模式 SoloLeader |
| ACH_024 | High Roller | 单次商店购买 ≥3 件遗物 | 奖励 GoldDrop |
| ACH_025 | Desecration | 摧毁全部防御陷阱 | 卡牌 TrapBreaker |

#### Meta / 收藏 / 挑战（ACH_038–ACH_093）
| ID | 名称 | 触发说明 | 奖励 |
|----|------|----------|------|
| ACH_038 | Who Needs Relics? | 单遗物通关 | 模式 ReliclessBoost |
| ACH_039 | Speed Climber | 20 分钟内通关 | 模式 SpeedRun |
| ACH_040 | Common Sense | 全普通卡通关 | 模式 StandardDeckRun |
| ACH_042 | Eternal One | 解锁全部成就 | 模式 GodMode |
| ACH_057 | Clan Master: Strength | 力量机制 Lv10 | 卡牌 StrengthSurge |
| ACH_058 | Clan Master: Poison | 毒机制 Lv10 | 遗物 PoisonClanRing |
| ACH_059 | Clan Master: Focus | 专注机制 Lv10 | 模式 OrbMastery |
| ACH_060 | Clan Master: Wrath | Wrath 机制 Lv10 | 奖励 WrathCycle |
| ACH_077 | Card Collector | 解锁 50 张独特卡牌 | 卡牌 CollectorBonus |
| ACH_078 | Relic Hoarder | 同一跑持有 20 遗物 | 奖励 ShopRelicBonus |
| ACH_079 | All Cards | 解锁全部卡牌 | 模式 GodDeck |
| ACH_090 | No Relics | 无遗物通关 | 遗物 RelicFreeBoost |
| ACH_091 | Speed Climber++ | 10 分钟内通关 | 模式 UltraSpeed |
| ACH_092 | Gold Stake | Asc20+ 全角色胜 | 模式 GoldStake |
| ACH_093 | Joker Master | Joker 遗物全部金效 | 模式 JokerMode |

#### 跑图 / Act / 进程（ACH_100–ACH_110）
| ID | 名称 | 触发说明 | 奖励 |
|----|------|----------|------|
| ACH_100 | Merchant Enthusiast | 累计拜访商店 ≥10 次 | 遗物 LuckyCoin |
| ACH_101 | Explorer | 累计踏足 25 个节点 | 遗物 MapFragment |
| ACH_102 | Monster Slayer | 累计击杀普通敌人 ≥100 | 卡牌 KillingBlow |
| ACH_103 | Act II Victor | 累计通关 Act 2 | 模式 Act2Challenge |
| ACH_104 | Act III Victor | 累计通关 Act 3 | 模式 Act3Challenge |
| ACH_105 | Treasure Hunter | 累计开启宝箱 ≥15 | 遗物 Chestfinder |
| ACH_109 | Eventful Run | 单次跑完成所有事件节点 | 模式 EventMode |
| ACH_110 | Ascender | Ascension ≥15 完成通关 | 模式 AscensionGlory |

---

## 5. 技术注意事项

1. **性能**：Tracker 仅在事件触发时进行 O(1) 更新，避免每帧轮询。BattleScene 通过 `useRef` 保留引用，不触发额外渲染。
2. **可扩展性**：配置中的 `trigger` 支持 DSL（`{ type: 'buff', stat: 'strength', gte: 50 }`），未来新增成就无需改代码。
3. **禁用策略**：当 `Mods` 或 `Custom Mode` 启用时，直接跳过 Tracker，HUD 提示“成就已禁用”以免混淆。
4. **安全性**：奖励解锁写入服务器（Cloudflare D1）后再写本地，防止客户端改存档即解锁。
5. **运营控制**：提供本地 `achievement_feature_override` 开关/按钮（运营可配置开/关）、HUD 内显示运营状态，并同步至 Cloudflare D1 (`featureFlag`) 让不同环境可快速关闭成就功能。

---

## 5.1 QA 检验工具

| 项目 | 说明 |
|------|------|
| `AchievementDevPanel` 面板 | 开发环境下在右下角显示按钮，支持“15 个宝箱”“12 个事件”“25 个节点”“9 分速通”“无遗物”“重置跑”，便于重现对应成就。 |
| 成就进度记录 | 每次 key 成就完成后附带 HUD 弹窗和 `AchievementUnlockBanner`，QA 可在运行日志/Toast 中核对奖励是否正确发放。 |
| 远端同步验证 | 通过 Cloudflare D1 `save`/`load` 接口同步 `achievements`/`modes`，复现“跨设备恢复”场景。 |

---

## 6. 未决问题

1. **奖励叠加**：同一奖励（例如 Kunai）如果已存在于玩家库存，是否发放金币/尘埃补偿？
2. **Eternal One**：要求“解锁全部成就”——是否允许在 Custom Mode 回顾？建议只在标准模式下计算。
3. **Steam API**：若后续接入，需要一个适配层把内置成就 ID 映射到 Steam/PS 奖杯。

---

## 7. 下一步

1. 与策划确认 40 项成就是否最终名单，是否需要按英雄拆表。
2. 梳理奖励资源（卡牌插画、遗物图标、模式说明）并进入美术排期。
3. 建立 QA Checklist：每项成就的复现步骤 + 预期奖励校验。

完成以上准备后即可进入 Sprint S1，实现核心追踪能力。届时 `new_achieve` 分支将作为全部成就研发的主战场。

