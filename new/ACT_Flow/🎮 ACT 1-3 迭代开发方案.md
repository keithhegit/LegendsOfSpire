## 🎮 ACT 1-3 迭代开发方案

基于对策划案和现有代码的深入分析，我将给出分阶段的开发方案。

------

## 📊 现有系统能力分析

### ✅ 已有机制（可直接复用）

| 机制             | 代码位置              | 策划案中的对应    |
| :--------------- | :-------------------- | :---------------- |
| 眩晕 (STUN)      | BattleScene.jsx:1427  | Siren 的眩晕技能  |
| 中毒 (POISON)    | BattleScene.jsx:1290  | Venom Lantern     |
| 易伤/虚弱        | 全局支持              | Charon 的冥河审判 |
| 护甲 (BLOCK)     | 敌人 BUFF action      | Talos 的坚壁      |
| 力量 (STRENGTH)  | 敌人 BUFF action      | Arbiter 的光环    |
| 多段攻击 (count) | actions: [{count: 5}] | Zeus P1 五雷轰顶  |

### ⚠️ 需要新增的机制

| 新机制            | 复杂度 | 影响范围          | 策划案对应        |
| :---------------- | :----- | :---------------- | :---------------- |
| 敌人死亡自爆      | 中     | BattleScene       | Forge Drone       |
| 亡语（延迟死亡）  | 高     | BattleScene       | Spartan Shade     |
| 敌人蓄力状态      | 中     | BattleScene + UI  | Cyclops Whelp     |
| 玩家眩晕          | 中     | BattleScene       | Siren / Zeus P2   |
| 敌人闪避          | 低     | applyDamage       | Shadow Stalker    |
| 反弹伤害          | 低     | applyCardEffects  | Thunder Construct |
| BOSS 阶段切换     | 高     | BattleScene       | Zeus P1/P2/P3     |
| BOSS 复活         | 高     | BattleScene       | Zeus P3           |
| 腐蚀领域（%生命） | 中     | BattleScene       | Charon            |
| 多周目难度缩放    | 低     | App.jsx + enemies | 全局              |

------

## 📋 分阶段开发计划

### Phase 0：基础设施准备 (✅ 已完成)

目标：为新机制打下数据结构基础

1.  **扩展敌人数据结构** (`enemies.js`)
2.  **扩展敌人状态** (`BattleScene.jsx`)
3.  **扩展玩家状态** (`BattleScene.jsx`)

------

### Phase 1：ACT1 小怪实现 (✅ 已完成)

优先级：先实现最简单的机制

#### 1.1 Forge Drone（死亡自爆）
敌人死亡时 → 检查 `traits.includes("EXPLODE_ON_DEATH")` → 对玩家造成 `explodeDamage`

#### 1.2 Spartan Shade（亡语不死）
敌人 HP <= 0 时： `if (undying === 0 && traits.includes("UNDYING")) { 设置 undying = 1; HP = 1; 显示 "不屈!" } else if (undying > 0) { undying--; 真正死亡 }`

#### 1.3 Cyclops Whelp（蓄力攻击）
敌人回合： `if (isCharging) { 执行 3 倍攻击; isCharging = false; charging = 0 } else { charging++; if (charging >= chargeTime) isCharging = true 显示 "蓄力中..." UI }`

------

### Phase 2：ACT1 BOSS - Talos (✅ 已完成)

目标：实现简单的 BOSS 机制

- **技能1 坚壁**：每回合获得护甲 20。
- **技能2 碾压**：当玩家生命值低于 50% 时，释放即死级伤害。

------

### Phase 3：ACT2 小怪实现 (✅ 已完成)

#### 3.1 Siren（玩家眩晕）
- 新机制：玩家眩晕。玩家回合开始 → `if (playerStatus.stunned > 0)` → 跳过本回合 → `stunned--`

#### 3.2 Shadow Stalker（50% 闪避）
在 `applyDamage` 中实现随机闪避判定（多段攻击每段独立计算）。

#### 3.3 Venom Lantern（中毒）
复用现有中毒机制。

------

### Phase 4：ACT2 BOSS - Charon (✅ 已完成)

- **腐蚀领域**：每回合开始，玩家按最大生命值的 5% 减少（保留 1 HP）。
- **冥河审判 (WEAK_VULN)**：同时施加虚弱与易伤状态。

------

### Phase 5：ACT3 小怪实现 (✅ 已完成)

- **Golden Guard**：累积格挡（每回合获得 1 层格架，抵挡一次命中）。
- **Thunder Construct**：反弹伤害（每次受击反弹 5 伤害）。
- **Arbiter**：伤害递增（奥林匹斯光环，每回合力量 +1）。

------

### Phase 6：ACT3 BOSS - Zeus (✅ 已完成) ⭐ 核心机制优化

**三阶段 BOSS 切换方案（剧情截断法）：**
采用“阶段击杀”触发剧情，随后无缝替换敌人对象。取消了复杂的内部复活逻辑，通过替换为更高数值的 `Zeus_Cosmos` 对象来实现“复活”感。

1. **P1 击杀** → 触发 3 秒剧情黑屏过渡（“阿陀磨须”形态）。
2. **状态重置** → 替换敌人为 `Zeus_P2`，HP 填满。
3. **P2 击杀** → 再次触发剧情过渡（“终焉”形态）。
4. **最终战** → 替换为 `Zeus_Cosmos`，彻底击杀后获得胜利。

------

### Phase 7：多周目系统 (✅ 已完成)

- **轮回机制**：通关后点击“开启新轮回”，`ascensionLevel + 1` 并重置存档。
- **难度缩放**：敌人全属性（HP/伤害/Buff）+10% 级联叠加。

------

## 🎨 资源清单

(省略 CDN 列表...)
