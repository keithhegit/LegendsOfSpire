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
- **ACH_017 – Perfect**：Boss 战期间未受到任何伤害并获胜。

> 以上三条用于打通 Tracker → HUD → Save 通路，其余成就将在 S4 通过配置驱动批量导入。

---

## 5. 技术注意事项

1. **性能**：Tracker 仅在事件触发时进行 O(1) 更新，避免每帧轮询。BattleScene 通过 `useRef` 保留引用，不触发额外渲染。
2. **可扩展性**：配置中的 `trigger` 支持 DSL（`{ type: 'buff', stat: 'strength', gte: 50 }`），未来新增成就无需改代码。
3. **禁用策略**：当 `Mods` 或 `Custom Mode` 启用时，直接跳过 Tracker，HUD 提示“成就已禁用”以免混淆。
4. **安全性**：奖励解锁写入服务器（Cloudflare D1）后再写本地，防止客户端改存档即解锁。

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

