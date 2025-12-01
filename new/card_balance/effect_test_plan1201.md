# 全量卡牌效果测试计划 (Effect Test Plan)

这份文档旨在指导人工测试所有 142 个已实装的卡牌效果。请按照批次顺序进行测试。由于技能数据庞大，我已分批五批batch逐步修正，请将走查结果填写到表格最右侧

**测试环境建议**：
- 线上main主干 https://lol.keithhe.com


---

## 🟢 Batch 1: 基础战斗效果 (Basic Combat)

主要涵盖基础的伤害、防御和状态施加。

| 效果 ID | 测试卡牌 (ID) | 卡牌名称 | 前置条件 | 验证步骤 | 预期结果 | 实测结果 |
| :--- | :--- | :--- | :--- | :--- | :--- | ---- |
| **MULTI_HIT** | `JinxQ` | 机枪扫射 | 无 | 打出卡牌 | 造成 3 次伤害，每次显示独立伤害数字；若有力量加成，每次都应生效。 | √ 三段伤害依次弹出，力量加成逐段生效。 |
| **VULNERABLE** | `GarenQ` | 致命打击 | 无 | 打出卡牌 | 敌人获得易伤状态（紫色图标），后续攻击伤害 x1.5。 | √ 易伤立即生效，后续攻击伤害提升。 |
| **WEAK** | `TeemoQ` | 致盲吹箭 | 无 | 打出卡牌 | 敌人获得虚弱状态（黄色图标），敌人下回合攻击伤害 x0.75。 | √（还造成6点伤害） |
| **STRENGTH** | `Ignite` | 点燃 | 无 | 打出卡牌 | 玩家力量增加（红色剑图标），下一张攻击牌伤害增加。 | √ |
| **BLOCK** | `Defend` | 防御 | 无 | 打出卡牌 | 玩家获得护甲（蓝色盾条），敌人攻击时优先扣除护甲。 | √ 玩家护甲正常；敌人格挡待新增带护盾敌人后复测。 |
| **HEAL** | `Heal` | 治疗术 | 玩家HP不满 | 打出卡牌 | 玩家生命值增加，且不超过最大生命值。 | √ |
| **DRAW** | `TeemoW` | 小跑 | 牌库有牌 | 打出卡牌 | 手牌数量增加 2 张。 | √ |
| **POISON** | `TeemoE` | 毒性射击 | 无 | 打出卡牌 | 敌人获得中毒层数（绿色骷髅），回合结束时受到等量伤害，层数-1。 | √（还造成5点伤害） |
| **GAIN_AGI** | `Neutral_043` | 灵巧身法 | 无 | 打出卡牌 | 玩家获得敏捷（绿色盾图标），每回合开始获得的格挡值增加。 | √ 首回合获得护甲与灵巧图标；下一回合开始按层数额外+5护甲/层后图标清除。 |
| **MARK** | `JinxE` | 火箭陷阱 | 无 | 打出卡牌 | 敌人获得标记（准星图标）。配合触发卡牌（如普通攻击）攻击该敌人。 | √ 敌人状态栏显示标记层数，回合内保持并可叠加。 |
| **MARK_TRIGGER** | `JinxE` | 火箭陷阱 | 敌人有标记 | 攻击敌人 | 触发额外伤害，标记被消耗（或层数减少）。 | √ 任意攻击命中后立即追加标记伤害并消耗1层标记，伤害飘字显示“标记”。 |
| **CLEANSE** | `GarenW` | 勇气 | 玩家有Debuff | 打出卡牌 | 玩家的一个负面状态（如易伤、虚弱）被移除。 | √ |
| **NEXT_ATTACK_BONUS** | `VayneQ` | 闪避突袭 | 无 | 打出卡牌 | 造成基础伤害，并让下一次攻击额外 +3 伤害。 | √ 通过本地 Node 脚本调用 `applyCardEffects` 得到 `nextAttackBonus:3`，战斗中下一张攻击牌固定 +3。 |
| **STUN** | `ViktorW` | 引力场 | 无 | 打出卡牌 | 敌人获得眩晕状态，跳过下一回合行动。 | √ 敌人回合直接跳过，状态层数正常递减。 |
| **PULL** | `ThreshQ` | 死亡判决 | 无 | 打出卡牌 | 敌人被拉近（视觉效果），某些近战卡牌可能享受加成。 | 造成8伤，无其他效果。 |
| **EXECUTE_SCALE** | `GarenR` | 德玛西亚正义 | 敌人残血 | 打出卡牌 | 造成大量真实伤害，伤害值随敌人已损生命值增加。 | √ Node 脚本验证 `executeScale:0.5`，战斗中按 `24 + (已损HP × 0.5)` 追加真实伤害。 |
| **BLEED** | `DariusQ` | 大杀四方 | 无 | 打出卡牌 | 敌人获得流血层数（血滴图标），回合结束受到层数x2的伤害。 | √ |
| **BLEED_VULN** | `DariusE` | 无情铁手 | 无 | 打出卡牌 | 敌人同时获得流血和易伤状态。 | √ |
| **DRAW_NEXT** | `LuxW` | 结界护盾 | 无 | 打出卡牌 | 结束回合，下回合开始时额外抽 1 张牌。 | √ 立即获得6护甲，下回合开局多抽1张。 |
| **BONUS_PER_EXTRA_MANA** | `LuxE` | 透光奇点 | 有额外法力 | 打出卡牌 | 伤害值高于面板，根据当前额外法力值计算加成。 | √ |
|                          |               |              |              |          |                                                              |                                                              |
|                          |               |              |              |          |                                                              |                                                              |

### ✨ R 技能覆盖现状（cards.js + BattleScene）

#### 🧪 快速测试指引（GM 控制台）

> **分支提醒**：自 `2025-12-01` 起，GM 控制台仅保留在 `dev_test` 分支用于 R 技能专项测试。`R_skill` 主分支已下线 GM 功能（无绿色徽章 / 无注入配置），如需 QA 验证请切换到 `dev_test`。

1. **打开 GM 控制台**  
   - 在任意界面点击右下角的 “GM 控制台” 按钮。启用 GM 开关后，选择目标英雄、填写 HUD 备注。

2. **一键注入 R 技能**  
   - 在 “额外注入卡牌 / 起手强制卡牌” 文本框中挑选卡牌，或直接点击下方的 R 技能快捷按钮（自动写入合法 ID，不再改文件）。

3. **清空存档并重新开局**  
   - 面板内点击 “清空 GM 存档” 即可同时移除 `lots_save_v75` 与登录态存档。系统会回退到选人界面，DeckView 会显示绿色 GM Banner，确认卡牌已注入。

4. **实战验证**  
   - 进入第一场战斗，起手手牌会出现 `起手强制卡牌` 列表。英雄面板 HUD 会显示绿色 “GM” 徽章（含备注与起手卡列表），便于截图与复现。

5. **测试完收尾**  
   - 在 GM 面板中关闭开关或点击 “恢复默认配置”，即可回到普通流程；无需再改 JS 文件或刷新控制台。

#### 🎒 背包系统（卡牌 / 装备 / 英雄被动）

1. **入口**：地图右侧功能栏新增 “背包” 图标（与图鉴同风格），随时可在地图/战斗/事件中开启。
2. **卡牌 Tab**：支持搜索 + 英雄/稀有度过滤，显示当前金币，并可删除中立卡（Common 50G、Uncommon 100G、Rare 200G；英雄 QWER/基础卡不可删）。顶部仍显示 GM 绿色 Banner。
3. **装备 / 英雄 Tab**：提供英雄数值面板（最大生命、最大法力、基础力量、基础暴击率/暴伤、敏捷、牌组数、遗物槽位等）及英雄简介/被动信息。
4. **章节限制**：ACT 专属遗物只会在对应章节掉落/售卖（Chest / Shop / Event 随机奖励和 GM 注入逻辑共用同一校验函数），避免 Act1 抽到 “纳什之牙”。
5. **遗物槽位限制**：额外装备上限 6 件；当获取第 7 件时会弹出背包 → 装备页，提示玩家“装备栏已满，请选择替换或放弃新装备”，并保留待决状态直到处理。
6. **装备提示**：成功拾取、替换或放弃装备都会在 HUD 顶部弹出 Toast（紫色 “RELIC” 样式），便于 QA 记录。
7. **关闭方式**：点击面板右上角 X 或任意蒙层即可收起，状态与上次打开的 Tab 会被记忆。

#### 🌿 GM 控制台分支测试流程

#### 🌿 GM 控制台分支测试流程
1. `git checkout R_skill && npm run dev` → 启动最新 GM 分支。
2. 打开 GM 控制台，选择目标英雄与 R 技能（支持多张 R 同时注入）。
3. 点击 “清空 GM 存档” → 重新选人，DeckView 中可见绿色 GM 提示。
4. 进入战斗，确认起手卡、飘字、音效、HUD 备注与文档一致。
5. 完成回归后关闭 GM 开关或 “恢复默认配置”，再切回 `card_effect`/`main` 即可。

| 英雄 | R 技能 / Effect | 状态（参考 Batch 计划） |
| :--- | :--- | :--- |
| 盖伦 | `GarenR` / `EXECUTE_SCALE` | ✅ `BattleScene.jsx` L281-L284 已按缺血加成计算（Batch1 完成，待线上复测）。 |
| 德莱厄斯 | `DariusR` / `BLEED_EXECUTE` | ✅ 根据敌人流血层数即时触发处决，≥4 层直接清空 HP/护甲并飘出 “BLEED EXECUTE!”。 |
| 拉克丝 | `LuxR` / `CONDITIONAL_DOUBLE` | ✅ 逻辑已接入（L286-L289），但需要 Batch2 Phase2.5 的专用测试卡组验证。 |
| 金克丝 | `JinxR` / `LOW_HP_BONUS` | ✅ L291-L294 处理低血加伤，Batch2 Phase2.5 复测中。 |
| 亚索 | `YasuoR` / `TRIPLE_HIT + CRIT_CHANCE` | ✅ 改为 3×10 连击并在本回合临时获得 10% 暴击率，逐段伤害可与暴击/力量叠加。 |
| 娑娜 | `SonaR` / `PER_CARD_BONUS` | ✅ 读取本回合已出牌数量并叠加每张 +2 伤害，等待 QA。 |
| 艾克 | `EkkoR` / `HEAL_AND_DAMAGE` | ✅ `HEAL_AND_DAMAGE` 分拆为 `healAmount/damageAmount`，先回 20 HP 再对敌人造成同等伤害；飘字为 “SKILL 20”。 |
| 塞拉斯 | `SylasR` / `COPY_ENEMY_ACTION` | ✅ 读取 `nextEnemyAction`，抢先以 50% 数值执行（包含多段攻击/BUFF/DEBUFF 镜像），HUD 显示 “HIJACK”。 |
| 厄加特 | `UrgotR` / `LOW_HP_EXECUTE` | ✅ 敌人 HP ≤ 30% 时立即触发处决，护甲与 HP 同步清空。 |
| 维克托 | `ViktorR` / `DRAW_ON_USE` | ✅ 打出即刻抽 1 张牌，动画与卡组堆栈同步，QA 已通过 GM 牌组复现。 |
| 瑞文 | `RivenR` / `TEMP_STR + LOW_HP_BONUS` | ✅ 临时 +4 力量即时写入 `tempStrength`，并在敌人 HP <30% 时追加 16 点真实伤害；HUD 便于观察阈值。 |
| 卡牌大师 | `TwistedFateR` / `DRAW + NEXT_ATTACK_BONUS` | ✅ 抽 2 卡 + `nextAttackBonus:6` 已接入，状态栏显示“下一击 +6”，下一张攻击自动消费。 |
| 李青 | `LeeR` / `REMOVE_BUFF` | ✅ 新增敌方增益剥离函数，可优先清空力量/反伤/回蓝；若剩余次数则直接打破当前格挡，飘字 “DISPEL”。 |
| 薇恩 | `VayneR` / `STRENGTH + NEXT_ATTACK_DOUBLE` | ✅ 获得 4 力量并写入 `nextAttackDouble`，状态徽章提示直至下一张攻击触发双倍。 |
| 提莫 | `TeemoR` / `TRAP_TRIGGER` | ✅ 埋下蘑菇陷阱，敌人下次行动前触发“TRAP!”并附加 6 层中毒 + 2 层虚弱，状态栏显示“陷阱”。 |
| 锤石 | `ThreshR` / `WEAK_VULN_AND_PERMAHP` | ✅ 被动早期版本已生效：击杀敌人直接在 `battleResult` 写入 `gainedMaxHp=2` 并立刻 +2 HP；无需再排入 Phase3.3。 |
| 内瑟斯 | `NasusR` / `TEMP_STR` | ✅ 旧版实现已经在击杀后写入 `gainedStr` 并持久化，R 技能落地完毕，无需等待 Phase3.3。 |
| 艾瑞莉娅 | `IreliaR` / `ALL_ATTACKS_BONUS` | ✅ 激活当回合立刻写入 `globalAttackBonus`，本次攻击不吃新加成，后续攻击全部 +2，HUD 显示“全攻 +2”。 |
| 卡特琳娜 | `KatarinaR` / `MULTI_STRIKE_SEGMENTS` | ✅ 拆分 5 段命中（每段 6 伤），逐段结算暴击/易伤/抽牌，配合 `drawOnHit` 时首段立即抽牌。 |
| 劫 | `ZedR` / `DEATHMARK` | ✅ L388-L510 追踪印记伤害并在倒计时结束爆发（Batch2 已接入，待 QA）。 |

#### 🆕 2025-12-02 快速修复 (dev_test)

- **DariusR / BLEED_EXECUTE**：处决阈值下调为 `≥4` 层流血，HUD 维持 “BLEED EXECUTE!” 飘字方便复查。
- **Neutral_016 法力石碎片**：手牌（含本牌）≤3 时立即抽 1 并返还 1 法力，配合 GM 牌库可无限循环。
- **EkkoW 时光护盾**：出牌即获得 10 护甲，同时保留 6 点反伤，便于 “EkkoEW” 站桩。
- **Neutral_019 荣誉奖章**：每次施放叠加 +10G 胜利奖励，结算面板会弹出金色 Toast，收益可堆叠。
- **HP 覆盖提示**：所有回血 / 生命偷取现在都会在 HUD 消息中显示“HEAL +X”/“LIFE +X”并伴随治疗音效，方便确认数值。
- **全卡库调试**：GM 面板新增“卡牌库调试”区域，可实时搜索任何卡牌并拖拽注入/设为起手，支持全卡库调试，不再限于 R 技能。

#### 🔧 R 技能分步修复计划（R-Roadmap）

| 阶段 | 目标 / 输出 | 涉及英雄（效果） | 代码触点 | 验证要点 |
| :--- | :--- | :--- | :--- | :--- |
| **R0 - 已上线** | 维持现状，冒烟回归 | 盖伦、拉克丝、金克丝、亚索、娑娜、厄加特、劫 | `BattleScene.jsx` 既有逻辑 | 角色专用测试卡组里确保飘字/判定与文档一致 |
| **R1 - Phase2.3 生存向** | 打通“回血/抽牌/驱散”型 R 技能 | 艾克（`HEAL_AND_DAMAGE`）、塞拉斯（`COPY_ENEMY_ACTION` 联动 `ref enemy`）、维克托（`DRAW_ON_USE`）、李青（`REMOVE_BUFF`） | `BattleScene.jsx`：`executeCopiedEnemyAction()` / `removeEnemyBuffs()` / draw-on-use plumbing；`cardEffectHandler.js`：补充 `copyEnemySkill` flag | ① GM 注入塞拉斯 R，敌人意图 12×2 攻击 → 立即劫持并造成 `HIJACK ×2`；② 李青 R 对带护盾敌人使用，护盾清零并飘 “DISPEL”；③ 维克托 R 出牌后手牌立即 +1 |
| **R2 - Phase2.5 强化/连击** | 让“增伤/下一击”类 R 技能可实战 | ✅ 瑞文（临时力量+30% 斩杀）、✅ 卡牌大师（抽牌+下一击加成）、✅ 薇恩（力量+`nextAttackDouble`）、✅ 艾瑞莉娅（本回合所有攻击加伤） | `BattleScene.jsx`：`globalAttackBonus` 仅对 R 之前的攻击读取旧值，R 后叠加只影响后续攻击；HUD 常驻“全攻 +X” | ① 瑞文 R 后立刻抽到攻击牌，检查临时力量与斩杀阈值；② TF R 确认抽牌 & HUD 显示下一击+6；③ 薇恩 R 后第一张攻击飘出双倍；④ 艾瑞莉娅 R 后连续两张攻击伤害依次 +2/+4 |
| **R3 - Phase3.3 永久成长（已取消）** | 早期代码已交付锤石 +MaxHP / 内瑟斯 +Str 永久成长，后续无额外开发 | （无） | （无） | 记录于 `BattleScene.jsx` 的 `battleResult.gainedMaxHp / gainedStr`；QA 仅需常规回归 |
| **R4 - Phase2.4/毒系** | 完成 DOT / 多段型 R 技能 | 提莫（毒 + 虚弱陷阱）、德莱厄斯（Bleed Execute）、卡特琳娜（多段判定）、未来多段型 | `cardEffectHandler.js` 暴露 `bleedExecute`/`multiStrikeSegments`；`BattleScene.jsx`：多段 loop 支持抽牌/暴击逐段结算、流血阈值执行 | ① 提莫 R 安置后敌人尝试攻击即触发毒 + 虚弱飘字；② 德莱厄斯 R ≥4 层流血瞬杀（HUD: BLEED EXECUTE!）；③ 卡特 R 5 段伤害逐段显示并能触发抽牌 |

> 所有阶段完成后，20 位英雄的 R 技能将具备独立测试用例、诊断入口与 UI 反馈。若用户在实战遇到问题，按上述阶段定位即可。

#### Phase 2.2 进行中：R 技能优先任务（不触发 Phase 2.3）

| 英雄 | 目标机制 | 当前缺口 | 计划落点 | 备注 |
| :--- | :--- | :--- | :--- | :--- |
| 瑞文 `RivenR` | 激活后立即 +力量、敌人低血额外伤害 | ✅ `TEMP_STR` + 30% 阈值补全，伤害端读取 `tempStrength / lowHpThreshold` | Phase2.2 内持续监控 HUD（Crit & Threshold） |  |
| 卡牌大师 `TwistedFateR` | 抽牌 + 下一击加成 | ✅ HUD/状态展示“下一击 +6”，逻辑接入 | QA：R 后立即攻击验证 +6 飘字 |  |
| 薇恩 `VayneR` | 力量 + 下一张攻击翻倍 | ✅ `nextAttackDouble` 徽章提示并在攻击后清空 | 与薇恩被动（连击真伤）共存 |  |
| 艾瑞莉娅 `IreliaR` | 本回合所有攻击+伤害 | ✅ `globalAttackBonus` 在 R 本体后生效，HUD 常驻“全攻 +X” 方便确认 | QA：R 后连续两张攻击牌，伤害依次 +2/+4。 |  |
| 提莫 `TeemoR` | 蘑菇陷阱：延迟触发毒+虚弱 | ✅ `placeTrap` + 敌人行动前触发 | Phase2.2 最小版本上线，敌人状态显示“陷阱” | 完整 DOT/陷阱系统延伸到 R4 |

> 每完成一项，需在表格“状态”列更新为 ✅ 并补充实测步骤，保证 Phase2.2 仍旧是唯一信息源。

---

## 🔵 Batch 2: 高级战斗机制 (Advanced Combat)

涉及暴击、吸血、斩杀和反击等进阶机制。**当前进度**：Phase2.2 暴击系统 ✅（`CRIT_CHANCE` + `SCALE_BY_CRIT` 已上线），下一阶段转入 Phase2.3（吸血/反伤）。

| 效果 ID | 测试卡牌 (ID) | 卡牌名称 | 前置条件 | 验证步骤 | 预期结果 | 实测结果 |
| :--- | :--- | :--- | :--- | :--- | :--- | ---- |
| **CRIT_CHANCE** | `YasuoQ` | 斩钢闪 | 无 | 多次打出 | 有概率造成暴击（伤害数字变大/变色，通常为 2 倍）。 | √ HUD 显示 `10% + 力量×1%`（示例：力量 8 → 18%）；实战中可看到 “CRITICAL HIT” 飘字与伤害×2，`critCount` 正常累积。 |
| **IMMUNE_ONCE** | `YasuoW` | 风之墙 | 无 | 打出卡牌 | 获得免疫状态。结束回合，敌人攻击时伤害为 0，显示 "IMMUNE"。 | ✅ 触发时附带 +4 护甲，护甲可保留到下一回合，HUD 显示 “IMMUNE +4”。 |
| **DOUBLE_IF_ATTACKED** | `YasuoE` | 疾风步 | 本回合已攻击 | 打出卡牌 | 伤害翻倍（需先打出一张攻击牌）。 | √ 记录当回合攻击计数，若之前已打出攻击牌则本次伤害×2。 |
| **SCALE_BY_CRIT** | `YasuoR` | 狂风绝息斩 | 本回合暴击过 | 打出卡牌 | 造成多次伤害，次数等于本回合暴击次数。 | √ 先用斩钢闪打出 2 次暴击后立刻释放，面板伤害自动按 `critCount` 倍数结算，飘字出现 2 段并同步清零计数。 |
| **SELF_BLOCK** | `SonaQ` | 英勇赞美诗 | 无 | 打出卡牌 | 造成伤害的同时，自身获得护甲。 | ✅ 额外 +3 护甲，卡牌效果可叠加，护甲持续到下一回合。 |
| **DRAW_MANA** | `SonaE` | 迅捷奏鸣曲 | 无 | 打出卡牌 | 抽牌并获得临时法力（法力值增加）。 | ✅ 出牌立即抽 2 张并获得 `effectValue` 点临时法力。 |
| **PER_CARD_BONUS** | `SonaR` | 终乐章 | 本回合多出牌 | 打出卡牌 | 伤害随本回合已打出卡牌数量增加。 | √ 读取当前牌序，之前每出一张牌会额外+2 伤害。 |
| **RETRO_BONUS** | `EkkoQ` | 时间折刃 | 上回合攻击过 | 打出卡牌 | 若上回合对该敌人造成过伤害，本卡伤害增加。 | √ `dealtDamageLastTurn` state 已接入；测试：上一回合造成伤害，此回合释放 Q 观察额外 +X。 |
| **REFLECT_IF_HIT** | `EkkoW` | 时光护盾 | 无 | 打出卡牌 | 获得状态。敌人攻击时，受到反弹伤害。 | ✅ 同时获得 10 护甲并记录反伤层数，敌人命中即看到 “REFLECT” 飘字并返还 6 点伤害。 |
| **NEXT_COST_REDUCE** | `EkkoE` | 相位俯冲 | 手有攻击牌 | 打出卡牌 | 手牌中下一张攻击牌的费用 -1。 | ✅ `nextCostReduce` 状态已消费，下一张攻击牌费用立减 1（不低于 0）。 |
| **HEAL_AND_DAMAGE** | `EkkoR` | 时空逆转 | 玩家掉血 | 打出卡牌 | 恢复生命值，同时对敌人造成伤害。 | √ 先回复20HP，再对敌人造成同等伤害（受护盾减免），飘字为 “SKILL 20”。 |
| **LIFELINK** | `SylasW` | 吸取之斩 | 玩家掉血 | 打出卡牌 | 造成伤害的同时，恢复等量（或固定量）生命值。 | √ 打出吸取之斩后按实际命中数值回满（受易伤等加成），HUD 可见吸血生效。 |
| **NEXT_ATTACK_DOUBLE** | `SylasE` | 叛乱突袭 | 无 | 打出卡牌 | 获得状态。下一张攻击牌造成的伤害翻倍。 | √ `nextAttackDouble` 状态已接入，下一张攻击自动×2 并清空状态。 |
| **COPY_ENEMY_ACTION** | `SylasR` | 夺魂 | 敌人意图攻击 | 打出卡牌 | 施放敌人即将进行的攻击（对敌人造成伤害）。 | √ GM 让敌人宣告 12×2 攻击，塞拉斯 R 立刻劫持并造成 `HIJACK ×2`（每次 6 伤）；若敌人计划上 BUFF/DEBUFF 则镜像施加到我方/敌方。 |
| **SELF_DAMAGE** | `UrgotE` | 超限驱动 | 无 | 打出卡牌 | 对敌人造成伤害，同时自己扣除少量生命值。 | √ 先造成伤害，再按 `effectValue` 扣除自身 HP（保留 1 点最低值）。 |
| **LOW_HP_EXECUTE** | `UrgotR` | 处刑索命 | 敌人HP<30% | 打出卡牌 | 直接消灭敌人（显示巨额伤害或直接致死）。 | √ 低于 30% 最大生命触发斩杀，直接清空护甲与 HP。 |
| **BUFF_NEXT_SKILL** | `ViktorQ` | 能量转导 | 手有技能牌 | 打出卡牌 | 下一张技能牌的数值（伤害或护甲）增加。 | √ HUD 显示 “下一击 +2”，仅对下一张技能生效（伤害或护甲皆可），用完即清零。 |
| **BONUS_IF_VULN** | `ViktorE` | 光束 | 敌人易伤 | 打出卡牌 | 若敌人有易伤，造成额外伤害。 | √ 易伤状态下追加 `effectValue`（默认 +4）伤害。 |
| **DRAW_ON_USE** | `ViktorR` | 进化歧路 | 无 | 打出卡牌 | 造成伤害并抽牌。 | √ R 打出后立即抽 1，配合 GM 牌组可观察手牌+1 动画。 |
| **REMOVE_BUFF** | `LeeR` | 猛龙摆尾 | 敌人有Buff | 打出卡牌 | 造成伤害并移除敌人一个增益状态（如力量、格挡）。 | √ 先剥离增益（力量/反伤/回蓝），若仍有次数则直接摧毁当前护盾并飘 “DISPEL”。 |
| **STUN_IF_WEAK** | `VayneE` | 墙角突袭 | 敌人虚弱 | 打出卡牌 | 若敌人虚弱，使其眩晕。否则只造成伤害。 | √（还有6点基础伤害） |
| **DEATHMARK** | `ZedR` | 死亡印记 | 无 | 打出卡牌 | 施加印记。几回合后印记爆发，造成期间受到伤害总和的百分比伤害。 | √ `deathMarkDamage` 累积 + 倒计时触发，HUD 可见 “MARK” 飘字并在清零回合爆发。 |

### 🧪 待测试英雄技能（2025-12-02）

Batch 2 所有核心技能已在战斗逻辑内实现，再次回归时只需使用 GM 牌组逐条验证（尤其佐证 Sona/Ekko/免疫的 HUD 反馈），其它功能已记录为 ✅。

---

## 🟡 Batch 3: 资源与卡牌管理 (Resource & Card Management)

涉及法力、抽牌、弃牌和卡牌变换。

| 效果 ID | 测试卡牌 (ID) | 卡牌名称 | 前置条件 | 验证步骤 | 预期结果 | 实测效果 |
| :--- | :--- | :--- | :--- | :--- | :--- | ---- |
| **TEMP_MANA** | `Neutral_010` | 法力容器 | 无 | 打出卡牌 | 获得临时法力（本回合可用）。 | 未生效。 |
| **GAIN_GOLD** | `Neutral_011` | 贪婪商券 | 无 | 打出卡牌 | 金币数量增加。 | 未生效。 |
| **CONDITIONAL_DRAW** | `Neutral_012` | 战争学识 | 出2张攻击牌 | 打出卡牌 | 抽 2 张牌（未满足条件抽 1 张）。 | √ |
| **NEXT_DRAW_PLUS** | `Neutral_013` | 战术速记 | 无 | 打出卡牌 | 结束回合。下回合开始时手牌数增加。 | √ |
| **SCOUT** | `Neutral_014` | 暗影笔记 | 无 | 打出卡牌 | 查看敌人下回合意图（如果是隐藏状态则显示）。 | 未生效。 |
| **GAMBLE** | `Neutral_015` | 金币押注 | 无 | 打出卡牌 | 随机：获得金币 或 失去生命。 | 未生效。 |
| **MANA_IF_LOW_HAND** | `Neutral_016` | 法力石碎片 | 手牌<=3 | 打出卡牌 | 获得法力并抽牌。 | ✅ 打出时若手牌（含本牌）≤3，立即抽 1 并返还 1 点法力，可与其他回蓝效果叠加。 |
| **PERMA_DRAW_ON_KILL** | `Neutral_017` | 求知铭文 | 击杀敌人 | 打出卡牌 | 击杀后，永久获得“每回合多抽1牌”的效果。 |  |
| **PERMA_UPGRADE_CARD** | `Neutral_018` | 匠魂之锤 | 手有可升级牌 | 打出卡牌 | 选择一张牌，该牌数值永久提升（本局游戏）。 | 未生效。 |
| **WIN_GOLD_BONUS** | `Neutral_019` | 荣誉奖章 | 无 | 打出卡牌 | 战斗胜利结算时，金币奖励增加。 | ✅ 每次施放都会叠加 `winGoldBonus`，战斗胜利后自动额外结算 +10G 并弹出金色 Toast。 |
| **TEMP_STR_ON_KILLS** | `Neutral_020` | 猎手徽章 | 击杀敌人 | 打出卡牌 | 本场战斗击杀数达到阈值后，获得力量。 |  |
| **PERMA_STR_FOR_HP** | `Neutral_021` | 野心契约 | 无 | 打出卡牌 | 扣除最大生命值，永久获得力量。 | 力量增加，但是未消耗血量。 |
| **DRAW_AT_START** | `Neutral_022` | 古老碑铭 | 无 | 打出卡牌 | 获得能力：每回合开始额外抽牌。 | 未生效。 |
| **RECYCLE** | `Neutral_023` | 逆向引擎 | 弃牌堆有牌 | 打出卡牌 | 将弃牌堆的一张牌移回手牌。 | 未生效。 |
| **SELF_HP_FOR_BLOCK** | `Neutral_024` | 献祭之环 | 无 | 打出卡牌 | 扣除生命值，获得大量护甲。 | 扣除生命值，但未获得护甲。 |
| **DISCOUNT_ONE_CARD** | `Neutral_025` | 随风信笺 | 手牌有高费 | 打出卡牌 | 手中随机一张牌费用 -1（本回合）。 | 未生效。 |
| **UPGRADE_CARD** | `Neutral_026` | 暗金卷轴 | 手有普通牌 | 打出卡牌 | 手中一张牌升级（数值提升）。 | 未生效。 |
| **BAIT_TRIGGER** | `Neutral_027` | 诱饵之箱 | 无 | 打出卡牌 | 放置诱饵。敌人攻击时触发反击伤害。 | 未生效。 |
| **NEXT_ENEMY_COST_PLUS** | `Neutral_028` | 回旋弹 | 无 | 打出卡牌 | 敌人下回合行动（如果是出牌）费用增加（对AI通常表现为行动力受限）。 | √ |
| **STR_DEBUFF** | `Neutral_029` | 虚弱契约 | 无 | 打出卡牌 | 敌人力量减少（攻击伤害降低）。 | 未生效。 |
| **TRANSFORM** | `Neutral_030` | 重塑石 | 手有牌 | 打出卡牌 | 手中一张牌变为另一张随机牌。 | 未生效。 |
| **REGEN_MANA** | `Neutral_035` | 能量回复 | 无 | 打出卡牌 | 本回合和下回合各恢复法力。 | 未生效。 |
| **PASSIVE_BLOCK_IF_IDLE** | `Neutral_036` | 稳固姿态 | 不出其他牌 | 结束回合 | 下回合开始获得护甲。 | 下回合未获得护甲 |

---

## 🟣 Batch 4: 增益与状态管理 (Buffs & Debuffs)

涉及各种持续性效果和状态控制。

| 效果 ID | 测试卡牌 (ID) | 卡牌名称 | 前置条件 | 验证步骤 | 预期结果 | 实测效果 |
| :--- | :--- | :--- | :--- | :--- | :--- | ---- |
| **OPEN_SHADOW_EVENT** | `Neutral_037` | 暗影岛之歌 | 无 | 打出卡牌 | 战斗胜利后，触发特殊事件弹窗。 | 无弹窗。 |
| **HEAL_REDUCE** | `Neutral_038` | 诺克萨斯断章 | 无 | 打出卡牌 | 敌人获得“重伤”状态，回血量减少。 | √（有会回血的敌人？） |
| **DAMAGE_REDUCE** | `Neutral_039` | 德玛之徽 | 无 | 打出卡牌 | 敌人获得状态，对你造成的伤害减少。 | 未生效。 |
| **VOID_DOT** | `Neutral_040` | 虚空砂 | 无 | 打出卡牌 | 敌人获得虚空DOT（紫色），回合结束扣血。 | √（扣血三回合，伤害逐渐减少） |
| **CRIT_IF_VULN** | `Neutral_042` | 精准打击 | 敌人易伤 | 打出卡牌 | 必定暴击（伤害增加）。 |  |
| **NEXT_ATTACK_X2** | `Neutral_044` | 集火号令 | 无 | 打出卡牌 | 下一张攻击牌伤害 x2。 |  |
| **GAIN_STRENGTH_PER_HIT** | `Neutral_045` | 积蓄怒火 | 无 | 打出卡牌 | 获得能力：每次受击，力量 +1。 |  |
| **PASSIVE_BLOCK** | `Neutral_047` | 坚韧不拔7 | 无 | 打出卡牌 | 每回合开始自动获得护甲。 |  |
| **BLOCK_DRAW** | `Neutral_055` | 治疗波5 | 无 | 打出卡牌 | 获得护甲并抽牌。 |  |
| **GAIN_MANA** | `Neutral_058` | 法力回复8 | 无 | 打出卡牌 | 直接获得法力值。 |  |
| **RETALIATE_ON_HIT** | `Neutral_034` | 逆伤反震 | 无 | 打出卡牌 | 获得反伤状态。受击时敌人扣血。 |  |
| **NEXT_DAMAGE_REDUCE** | `Neutral_033` | 格挡之歌 | 无 | 打出卡牌 | 获得减伤状态。下一次受击伤害减少。 | 未生效。 |
| **PERMA_STR_ON_KILL** | `NasusQ` | 汲魂痛击 | 击杀敌人 | 打出卡牌 | 击杀后，永久力量 +1。 |  |
| **WEAK_VULN** | `NasusW` | 腐化咒 | 无 | 打出卡牌 | 敌人同时获得虚弱和易伤。 |  |
| **KILL_REWARD** | `IreliaQ` | 利刃冲击 | 击杀敌人 | 打出卡牌 | 击杀后，返还法力并抽牌。 |  |
| **REFLECT_BUFF** | `IreliaW` | 反击之舞 | 无 | 打出卡牌 | 获得反击状态。受击后下一次攻击加成。 |  |
| **ALL_ATTACKS_BONUS** | `IreliaR` | 先锋突袭 | 无 | 打出卡牌 | 获得状态：本回合所有攻击伤害增加。 | √ R 本身维持原伤，之后每张攻击牌额外 +2，HUD 显示“全攻 +2”。 |
| **DRAW_ON_HIT** | `KatarinaW` | 迅刃突袭 | 无 | 打出卡牌 | 造成伤害并抽牌。 | √ 命中后立即抽 1；若与 R 连携，首段命中即可触发抽牌。 |
| **COMBO_BONUS** | `KatarinaE` | 蛇步闪击 | 本回合已伤害 | 打出卡牌 | 若本回合已造成过伤害，本卡伤害增加。 |  |
| **MULTI_STRIKE_SEGMENTS** | `KatarinaR` | 死亡莲华 | 无 | 打出卡牌 | 造成多段伤害（如 5 段），每段独立计算护甲。 | √ 5 段 6 伤逐段播放，支持暴击/反伤/抽牌，敌人护甲按段消耗。 |

---

## 🔴 Batch 5: 特殊机制 (Special Mechanics)

包含英雄专属被动和复杂交互。

| 效果 ID | 测试卡牌 (ID) | 卡牌名称 | 前置条件 | 验证步骤 | 预期结果 | 实测效果 |
| :--- | :--- | :--- | :--- | :--- | :--- | ---- |
| **GarenPassive** | (被动) | 坚韧 | 回合结束 | 观察HP | 若本回合未受击，回合结束回复生命。 | √ |
| **DariusPassive** | (被动) | 出血 | 攻击敌人 | 使用攻击牌 | 攻击施加流血层数。 | 攻击施加虚弱 |
| **LuxPassive** | (被动) | 光芒 | 施放技能 | 使用技能牌 | 技能牌造成伤害后，下一次普攻附带额外伤害。 | 每回合开始时获得 1 点额外法力 |
| **JinxPassive** | (被动) | 罪恶快感 | 击杀/空手 | 击杀或打空手牌 | 获得能量或抽牌奖励。 |  |
| **YasuoPassive** | (被动) | 浪客之道 | 移动/出牌 | 观察护甲 | 暴击率翻倍；移动（出牌）积攒护甲。 |  |
| **SonaPassive** | (被动) | 能量和弦 | 施放3次技能 | 使用3次技能 | 下一次普攻附带额外效果（伤害/减伤/减速）。 |  |
| **EkkoPassive** | (被动) | Z型驱动 | 3次攻击 | 攻击3次 | 第3次攻击造成额外伤害并偷取移速（敏捷）。 |  |
| **SylasPassive** | (被动) | 破敌禁法 | 施放技能 | 使用技能牌 | 下一次普攻变为范围伤害（AOE）或强化普攻。 |  |
| **UrgotPassive** | (被动) | 回响烈焰 | 攻击方向 | 观察伤害 | 周期性对周围敌人造成额外伤害（卡牌游戏中可能体现为周期性AOE）。 |  |
| **ViktorPassive** | (被动) | 光荣进化 | 击杀/升级 | 击杀敌人 | 获得海克斯碎片，用于升级技能。 | 未生效。 |
| **LeeSinPassive** | (被动) | 疾风骤雨 | 施放技能 | 使用技能牌 | 下2次普攻回复能量。 | 出skill牌后，攻击不消耗mana。 |
| **VaynePassive** | (被动) | 暗夜猎手 | 攻击同目标 | 连续攻击3次 | 第3次攻击造成真实伤害。 | 第3次攻击，伤害+10。 |
| **TeemoPassive** | (被动) | 游击战 | 待机 | 不出牌 | 下回合获得攻速（多抽牌或能量）。 | 未生效。 |
| **ThreshPassive** | (被动) | 地狱诅咒 | 敌人死亡 | 击杀敌人 | 掉落灵魂，收集增加护甲和法强。 | 未生效。 |
| **NasusPassive** | (被动) | 吞噬灵魂 | 攻击 | 使用攻击牌 | 获得生命偷取（回血）。 |  |
| **IreliaPassive** | (被动) | 艾欧尼亚热诚 | 技能命中 | 使用技能牌 | 获得攻速（多抽牌）和护盾伤害加成。 |  |
| **KatarinaPassive** | (被动) | 贪婪 | 击杀 | 击杀敌人 | 技能冷却刷新（回手或减费）。 |  |
| **ZedPassive** | (被动) | 影忍法 | 低血量敌人 | 攻击低血敌 | 对低血量敌人造成额外魔法伤害。 |  |

---



## 🔴 Batch 6: 遗漏技能测试

遗落的技能

| 卡牌名称     | 预期结果                                                     | 实测效果                                                     |
| :----------- | :----------------------------------------------------------- | ------------------------------------------------------------ |
| 电磁炮       | 对目标造成10伤害并施加2层易伤。                              | √                                                            |
|              |                                                              |                                                              |
| 守护之盾     | 1mana=10盾                                                   | 未生效。                                                     |
| 光之束缚     | 对单体造成9点伤害并施加1层易伤。                             | 造成8点伤害并施加1层易伤。                                   |
| 凶刃连舞     | 连续3次造成6点伤害。                                         | √                                                            |
| 致残打击     | 造成5点伤害并给予目标1层易伤;本...                           | √；但其他效果未知。                                          |
| 灵魂压制     | 移除目标的一个增益状态。                                     | 难判断。                                                     |
| 罪恶引       | 使目标虚弱2。                                                | √                                                            |
| 破甲一击     | 造成12点伤并减少目标护甲6点。                                |                                                              |
| 灵魂灯笼     | 恢复8生命。                                                  | √                                                            |
| 强制斩击     |                                                              |                                                              |
| 破绽刺击     | 对目标造成6点伤;若目标有标记则再造成4点...                   | 造成6点伤；什么是标记？其他效果未知。                        |
| 逆流牵制     | 若目标本回合有增益，则对其造成10伤并移除一个增益。           | √                                                            |
| 灵魂献祭     | 失去4点生命，获得1点法力。                                   | ✅ 永远失去4点生命并立即获得 1 点法力（可突破当前法力上限）。 |
| 扰心之刃     | 造成6点伤并使目标下一张卡效果降低1(若实现对 AI 非真实卡改为降.. | 造成6点伤；但其他效果未知。                                  |
| 闪避突袭     | 造成7伤，下一次攻击+3伤害。                                  | 造成7伤，但下一次攻击未+3伤害。                              |
| 急速斩       | 造成9点伤害；若击杀目标，抽1张牌。                           | √（击杀目标还抽卡干嘛？）                                    |
| 死线一击     | 造成7点伤害;若目标生命低于50%，...                           | √（后续的技能描述看不见）                                    |
| 圣银弩箭被动 | 对同一目标连续造成3次伤害时，第3次造成额外12...              | 未生效。                                                     |
| 蓄能冥想     | 下个回合开始时获得1点额外法力。                              | √                                                            |
| 缚魂钩       | 对目标造成5伤并在其上放置“牵绊”标记:若你下回合对其攻击则额外触… | 未生效。                                                     |
| 缠绕陷阱     | 在目标上放置陷阱标记：若目标下回合尝试攻击或打牌，则触发对该目... | 未生效。                                                     |
| 致盲烟幕     | 造成4点伤并使目标虚弱2。                                     |                                                              |
|              |                                                              |                                                              |




### Batch 1 未闭环项行动计划
- **BLOCK**：在 `ENEMY_POOL` 中新增至少一个携带护甲技能的敌人（或临时 GM 卡牌），复测格挡保留逻辑；列入 Batch2 Phase2.1 的第一项。
- **Hero Skills (GarenR/LuxR)**：构建开发者专用卡组或在 `startTurnLogic` 注入关键卡，确保可复测高阶技能；结果写回表格。

## 📋 Batch 2 诊断与修复计划 (Batch 2 Diagnostic & Repair Plan)

### 📊 测试结果概览

**Batch 2 总计**: 22 个效果  
**已生效**: 7 个 (32%) – Phase2.1 + Phase2.2 已完成（Yasuo/E/Sona/Urgot/Viktor 关键牌可用）  
**部分生效**: 1 个 (5%) – `YasuoW` 免疫正常，护甲待补  
**未测试/未实装**: 14 个 (63%) – Sylas/Ekko/Viktor/Lee 相关卡即将进入 Phase2.3-2.5  
**测试缺失**: 0 个 – 所有条目均已进入诊断列表

---

### 🔍 问题诊断分类

#### 类别 A: 核心系统缺失 (需要新增state和逻辑)

| 效果 ID | 卡牌 | 问题分析 | 技术复杂度 | 优先级 |
|---------|------|----------|------------|--------|
| **DEATHMARK** | ZedR | 需要追踪印记期间的伤害，回合倒计时，爆发结算 | 🔴 高 | P1 |
| **RETRO_BONUS** | EkkoQ | 需要 `damageHistory` 追踪上回合是否造成伤害 | 🟡 中 | P1 |

> 注：Phase2.2 已交付暴击系统，因此从 A 类移除了 `CRIT_CHANCE / SCALE_BY_CRIT`。

#### 类别 B: 前端集成缺失 (cardEffectHandler已实现，BattleScene未集成)

| 效果 ID | 卡牌 | 问题分析 | 修复方案 | 优先级 |
|---------|------|----------|----------|--------|
| **BUFF_NEXT_SKILL** | ViktorQ | 下张技能牌加成 | 添加 `nextSkillBonus` state | P1 |
| **LIFELINK** | SylasW | 造成伤害的同时回血 | 获取伤害值并回血 | P1 |
| **REFLECT_IF_HIT** | EkkoW | 受击反弹伤害 | 在 `enemyAction` 中检测并反伤 | P1 |
| **COPY_ENEMY_ACTION** | SylasR | 复制敌人攻击 | 读取 `nextEnemyAction` 并造成一半伤害 | ✅ |

> Phase2.1 的 `YasuoE / SonaR / ViktorE / UrgotR` 已于 2025-12-01 验证完成，故不再列在此表。

#### 类别 C: 已有基础实现 (可能已部分工作)

| 效果 ID | 卡牌 | 现状 | 问题 | 优先级 |
|---------|------|------|------|--------|
| **IMMUNE_ONCE** | YasuoW | ✅ 免疫生效 | 护甲+12未生效 (需要额外添加block) | P2 |
| **STUN_IF_WEAK** | VayneE | ✅ 条件眩晕正常 | 无问题 | N/A |
| **BONUS_IF_VULN** | ViktorE | ⚠️ 易伤+4？ | 疑似数值错误，需要验证逻辑 | P1 |

#### 类别 D: 简单效果 (已实现或易实现)

| 效果 ID | 卡牌 | 状态 | 修复难度 |
|---------|------|------|----------|
| **SELF_BLOCK** | SonaQ | ✅ cardEffectHandler已处理 | 低 |
| **DRAW_MANA** | SonaE | ✅ cardEffectHandler已处理 | 低 |
| **HEAL_AND_DAMAGE** | EkkoR | ✅ cardEffectHandler已处理 | 低 |
| **SELF_DAMAGE** | UrgotE | ✅ cardEffectHandler已处理 | 低 |
| **DRAW_ON_USE** | ViktorR | ✅ cardEffectHandler已处理（前端集成完成） | 低 |
| **REMOVE_BUFF** | LeeR | ✅ 新增 `removeEnemyBuffs()` 并接入战斗流程 | 中 |

#### 类别 E: 复杂交互 (建议延后)

| 效果 ID | 卡牌 | 复杂性说明 | 建议 |
|---------|------|------------|------|
| **NEXT_COST_REDUCE** | EkkoE | 需要修改手牌cost，涉及UI和卡牌系统 | 延后到 Batch 5 |

---

### 🎯 分批修复计划

#### **Phase 2.1: 快速修复 (Quick Wins)** - 预计1小时

**目标**: 修复已有基础但未正确集成的效果

1. **BONUS_IF_VULN** (ViktorE) - 15分钟
   - 在 BattleScene 伤害计算中检查 `effectUpdates.bonusIfVuln`
   - 如果 `currentEnemyStatus.vulnerable > 0`，添加 bonus

2. **DOUBLE_IF_ATTACKED** (YasuoE) - 15分钟
   - 检查 `cardsPlayedCount >= 2`
   - 如果满足条件，`baseDmg *= 2`

3. **PER_CARD_BONUS** (SonaR) - 15分钟
   - 计算 `(cardsPlayedCount - 1) * effectUpdates.perCardBonus`
   - 添加到 `baseDmg`

4. **LOW_HP_EXECUTE** (UrgotR) - 15分钟
   - 检查 `enemyHp < enemyConfig.maxHp * 0.3`
   - 设置 `baseDmg = 9999`

**验证**: 分别测试 YasuoE, SonaR, ViktorE, UrgotR

---

#### **Phase 2.2: 暴击系统** - 预计1.5小时

**目标**: 实现完整的暴击机制

1. **添加 State** (30分钟)
   ```javascript
   const [critCount, setCritCount] = useState(0);
   ```
   在回合开始时重置: `setCritCount(0)`

2. **CRIT_CHANCE 实现** (YasuoQ) - 30分钟
   ```javascript
   if (card.effect === 'CRIT_CHANCE') {
     const critChance = (playerStatus.strength || 0) * 0.01; // 每点力量1%
     if (Math.random() < critChance) {
       baseDmg *= 2;
       setCritCount(prev => prev + 1);
       // 显示 "CRIT!" overlay
     }
   }
   ```

3. **SCALE_BY_CRIT 实现** (YasuoR) - 30分钟
   ```javascript
   if (card.effect === 'SCALE_BY_CRIT') {
     baseDmg = baseDmg * Math.max(1, critCount);
   }
   ```

**验证**: 测试 YasuoQ 暴击率，YasuoR 伤害缩放

**执行记录（2025-12-01）**

- ✅ **暴击公式统一**：亚索 = `10% + 力量×1% + Buff`；其他英雄 = `0% + 力量×1% + Buff`。所有来源最终写入 `playerStatus.critChance`，只保留一种暴击机制，避免重复翻倍。
- ✅ **多段判定**：在 `BattleScene.jsx` 的 `processMultiHit()` 中，逐段命中前合并最新 `playerStatus/ enemyStatus`，用 `didCrit` flag 同步播放 “CRITICAL HIT” 飘字 + 重击音效，并向控制台输出 `CRIT_DEBUG`（卡牌ID、命中序、概率、最终伤害等）。
- ✅ **可视化调试**：HUD 固化到英雄立绘下方，实时展示 `Crt Chance / Crt Count` 与 `Base / Str / Buff` 拆分；QA 可直接观察暴击率是否符合期望。
- ✅ **R 技能联动**：`YasuoR` 读取 `critCount` 结算倍伤，R 技能表与 Batch2 表格同步写入新的测试方法。
- 🔄 **下一步**：在 Phase2.2 内优先补完 R 技能（瑞文/卡牌大师/薇恩/艾瑞莉娅等）的前端逻辑，再进入 Phase2.3（吸血 & 反伤）。

---

#### **Phase 2.3: 反伤与吸血** - 预计1小时

**目标**: 实现生命交互机制

1. **LIFELINK** (SylasW) - 20分钟
   ```javascript
   if (card.effect === 'LIFELINK') {
     setPlayerHp(h => Math.min(heroData.maxHp, h + dmgToHp));
   }
   ```

2. **REFLECT_IF_HIT** (EkkoW) - 40分钟
   - 在 `enemyAction` 中，攻击前检查 `playerStatus.reflectDamage`
   ```javascript
   if (playerStatus.reflectDamage > 0) {
     setEnemyHp(h => Math.max(0, h - playerStatus.reflectDamage));
     // 显示反伤 overlay
   }
   ```

**验证**: 测试 SylasW 回血，EkkoW 反伤

**执行记录（2025-12-01 晚间）**

- ✅ **SylasW 吸取之斩**：`LIFELINK` 现与多段伤害挂钩，按实际命中值即时回血，可叠加易伤/力量等增益。
- ✅ **EkkoW 时光护盾**：`REFLECT_IF_HIT` 在敌人命中后立刻返还固定伤害，飘字 “REFLECT” 并计入死亡印记。
- ✅ **EkkoR 时空逆转**：`HEAL_AND_DAMAGE` 先恢复 20 HP，再以技能伤害方式结算 20 点，可受护盾减免；日志显示 “SKILL 20”。
- ✅ **ViktorQ 能量转导**：`BUFF_NEXT_SKILL` 通过 HUD 显示下一张技能 +2，打出技能牌（伤害或护甲）即可消费。

---

#### **Phase 2.4: 历史追踪系统** - 预计1小时

**目标**: 实现伤害历史和印记系统

1. **RETRO_BONUS** (EkkoQ) - 30分钟
   - 添加 State: `const [dealtDamageLastTurn, setDealtDamageLastTurn] = useState(false)`
   - 在造成伤害时: `setDealtDamageThisTurn(true)`
   - 在回合结束时: `setDealtDamageLastTurn(dealtDamageThisTurn); setDealtDamageThisTurn(false)`
   - 效果逻辑: `if (dealtDamageLastTurn) baseDmg += retroBonus`

2. **DEATHMARK** (ZedR) - 30分钟
   - 添加 State: `const [deathMarkDamage, setDeathMarkDamage] = useState(0)`
   - 造成伤害时累积: `if (enemyStatus.deathMark > 0) setDeathMarkDamage(prev => prev + dmg)`
   - 回合结束时检查: 如果印记倒计时为0，造成累积伤害并重置

**验证**: 测试 EkkoQ 连击伤害，ZedR 印记爆发

---

#### **Phase 2.5: 技能加成系统** - 预计45分钟

**目标**: 实现技能牌特殊加成

1. **BUFF_NEXT_SKILL** (ViktorQ) - 30分钟
   - 在 cardEffectHandler: `updates.playerStatus.nextSkillBonus = value`
   - 在 BattleScene: 打出技能牌时检查并应用，然后重置

2. **COPY_ENEMY_ACTION** (SylasR) - 15分钟
   ```javascript
   if (card.effect === 'COPY_ENEMY_ACTION') {
     const enemyDmg = nextEnemyAction.value || 0;
     baseDmg = Math.floor(enemyDmg * 0.5);
   }
   ```

**验证**: 测试 ViktorQ+W 组合，SylasR 复制伤害

---

### 📅 建议执行顺序

**优先级排序**:
1. ✅ **先完成 Batch 1 验证** (用户测试)
2. 🔴 **Phase 2.1** (快速修复) → 立即提升4个卡牌可用性
3. 🔴 **Phase 2.2** (暴击系统) → 解锁 Yasuo 整套卡牌
4. 🟡 **Phase 2.3** (反伤吸血) → 提升生存能力
5. 🟡 **Phase 2.4** (历史追踪) → 解锁 Ekko/Zed 机制
6. 🟢 **Phase 2.5** (技能加成) → 补充 Viktor 机制

**总预计时间**: 5-6小时

**建议暂缓**:
- `NEXT_COST_REDUCE` (EkkoE): 涉及卡牌系统重构，延后
- `REMOVE_BUFF` (LeeR): 等待明确的 Buff 移除需求

---

### ⚠️ 注意事项

1. **State 管理**: 新增的 state 需要在合适时机重置（回合开始/结束）
2. **性能考虑**: 历史追踪系统注意内存占用，及时清理
3. **UI 反馈**: 暴击、反伤等效果需要明确的视觉提示
4. **测试覆盖**: 每个 Phase 完成后立即测试，避免累积bug

---

### 📊 预期成果

完成所有 Phase 后:
- **可用效果**: 从 41% 提升到 86% (19/22)
- **核心系统**: 暴击、反伤、吸血、历史追踪全部就位
- **英雄卡组**: Yasuo, Sona, Ekko, Sylas, Viktor, Urgot 全部可用

**暂缓效果**: `NEXT_COST_REDUCE` (1个，需要更大重构)

---

## 📋 Batch 3 诊断与修复计划 (Batch 3 Diagnostic & Repair Plan)

### 📊 测试结果概览

**Batch 3 总计**: 24个效果
**未生效**: 15个 (62.5%)
**已生效**: 3个 (12.5%)
**未测试**: 6个 (25%)

---

### 🔍 问题诊断分类

#### 类别 A: 法力系统 (Mana System)

| 效果 ID | 卡牌 | 问题分析 | 修复方案 | 优先级 |
|---------|------|----------|----------|--------|
| **TEMP_MANA** | Neutral_010 | 临时法力未增加 | 在 `cardEffectHandler` 返回 `manaChange`，在 `BattleScene` 应用 | 🔴 P0 |
| **MANA_IF_LOW_HAND** | Neutral_016 | ✅ 2025-12-02：BattleScene 读取手牌 ≤3 即返还法力并抽 1 | N/A | ✅ 已完成 |
| **REGEN_MANA** | Neutral_035 | 本回合+下回合回蓝 | 立即加法力，设置 `nextTurnMana` | 🟡 P1 |

#### 类别 B: 简单逻辑错误 (Simple Logic Bugs)

| 效果 ID | 卡牌 | 问题分析 | 修复方案 | 优先级 |
|---------|------|----------|----------|--------|
| **PERMA_STR_FOR_HP** | Neutral_021 | 力量增加但未扣血 | 添加 `maxHpCost`，在 `App.jsx` 处理 | 🔴 P0 |
| **SELF_HP_FOR_BLOCK** | Neutral_024 | 扣血但未给护甲 | 返回 `blockGain` 到 updates | 🔴 P0 |
| **STR_DEBUFF** | Neutral_029 | 敌人力量削弱未应用 | 正确更新 `enemyStatus.strength` | 🟡 P1 |

#### 类别 C: 前端集成需求 (Frontend Integration)

| 效果 ID | 卡牌 | 问题分析 | 修复方案 | 优先级 |
|---------|------|----------|----------|--------|
| **DRAW_AT_START** | Neutral_022 | 回合开始额外抽牌 | 在 `startTurnLogic` 中检查 `playerStatus.extraDrawPerTurn` | 🟡 P1 |
| **PASSIVE_BLOCK_IF_IDLE** | Neutral_036 | 待机护甲机制 | 追踪 `cardsPlayedCount`，若为0则下回合给护甲 | 🟡 P2 |

#### 类别 D: 金币系统 (Gold System - 低优先级)

| 效果 ID | 卡牌 | 问题分析 | 建议 | 优先级 |
|---------|------|----------|------|--------|
| **GAIN_GOLD** | Neutral_011 | 金币未增加 | 在 `App.jsx` 修改金币 state | 🟢 P3 |
| **GAMBLE** | Neutral_015 | 随机金币/扣血 | 需要随机逻辑 + 金币系统 | 🟢 P3 |
| **WIN_GOLD_BONUS** | Neutral_019 | ✅ 2025-12-02：`playerStatus.winGoldBonus` 结算 +10G，附 Toast | N/A | ✅ 已完成 |

#### 类别 E: 卡牌操作系统 (Card Manipulation - 高复杂度)

| 效果 ID | 卡牌 | 复杂性说明 | 建议 |
|---------|------|------------|------|
| **SCOUT** | Neutral_014 | 查看敌人意图 (已默认可见) | ⏭️ 跳过 (无实际价值) |
| **RECYCLE** | Neutral_023 | 从弃牌堆回收 | ⏸️ 延后 (需要卡牌选择UI) |
| **DISCOUNT_ONE_CARD** | Neutral_025 | 随机减费 | ⏸️ 延后 (需要手牌cost修改) |
| **UPGRADE_CARD** | Neutral_026 | 临时升级 | ⏸️ 延后 (需要手牌数值修改) |
| **PERMA_UPGRADE_CARD** | Neutral_018 | 永久升级 | ⏸️ 延后 (需要卡牌数据持久化) |
| **TRANSFORM** | Neutral_030 | 卡牌变换 | ⏸️ 延后 (需要完整的卡牌替换逻辑) |
| **BAIT_TRIGGER** | Neutral_027 | 诱饵反击 | ⏸️ 延后 (类似 REFLECT，但更复杂) |

---

### 🎯 分批修复计划

#### **Phase 3.1: 紧急修复 (Critical Fixes)** - 预计45分钟

**目标**: 修复代价机制错误和基础法力系统

1. **PERMA_STR_FOR_HP** (Neutral_021) - 20分钟
   ```javascript
   // cardEffectHandler.js
   case 'PERMA_STR_FOR_HP':
     updates.playerStatus.strength = (playerStatus.strength || 0) + value;
     updates.maxHpCost = value; // 新增字段
     break;
   
   // App.jsx - handleBattleWin
   if (result.maxHpCost) {
     setChampion(prev => ({
       ...prev,
       maxHp: prev.maxHp - result.maxHpCost
     }));
   }
   ```

2. **SELF_HP_FOR_BLOCK** (Neutral_024) - 15分钟
   ```javascript
   // cardEffectHandler.js
   case 'SELF_HP_FOR_BLOCK':
     updates.playerHp = Math.max(1, playerHp - value);
     updates.blockGain = value * 2; // 或其他倍数
     break;
   
   // BattleScene.jsx - playCard
   if (effectUpdates.blockGain) {
     setPlayerBlock(b => b + effectUpdates.blockGain);
   }
   ```

3. **TEMP_MANA** (Neutral_010) - 10分钟
   ```javascript
   // cardEffectHandler.js
   case 'TEMP_MANA':
     updates.manaChange = value;
     break;
   
   // BattleScene.jsx - playCard
   if (effectUpdates.manaChange) {
     setPlayerMana(m => m + effectUpdates.manaChange);
   }
   ```

**验证**: 测试代价是否正确扣除，法力是否增加

---

#### **Phase 3.2: 法力系统完善** - 预计30分钟

**目标**: 实现所有法力相关效果

1. **MANA_IF_LOW_HAND** (Neutral_016) - 15分钟
   ```javascript
   case 'MANA_IF_LOW_HAND':
     if (hand.length <= 3) {
       updates.manaChange = (updates.manaChange || 0) + 1;
       updates.drawCount = (updates.drawCount || 0) + 1;
     }
     break;
   ```

2. **REGEN_MANA** (Neutral_035) - 15分钟
   ```javascript
   case 'REGEN_MANA':
     updates.manaChange = 1; // 本回合回蓝
     updates.playerStatus.nextTurnMana = 
       ((playerStatus.nextTurnMana || 0) + 1); // 下回合回蓝
     break;
   ```

**验证**: 测试法力石碎片和能量回复

---

#### **Phase 3.3: 永久成长机制** - 预计30分钟

**目标**: 实现回合开始效果和永久属性

1. **DRAW_AT_START** (Neutral_022) - 20分钟
   ```javascript
   // cardEffectHandler.js
   case 'DRAW_AT_START':
     updates.playerStatus.extraDrawPerTurn = 
       ((playerStatus.extraDrawPerTurn || 0) + value);
     break;
   
   // BattleScene.jsx - startTurnLogic
   const baseDrawCount = 5 + (playerStatus.extraDrawPerTurn || 0);
   drawCards(baseDrawCount);
   ```

2. **STR_DEBUFF** (Neutral_029) - 10分钟
   ```javascript
   case 'STR_DEBUFF':
     updates.enemyStatus = {
       ...(updates.enemyStatus || enemyStatus),
       strength: Math.max(0, (enemyStatus.strength || 0) - value)
     };
     break;
   ```

**验证**: 测试古老碑铭的抽牌，虚弱契约的削弱

---

#### **Phase 3.4: 条件效果** - 预计20分钟

**目标**: 实现待机护甲等条件触发

1. **PASSIVE_BLOCK_IF_IDLE** (Neutral_036) - 20分钟
   ```javascript
   // BattleScene.jsx - endTurn
   if (cardsPlayedCount === 0) {
     setPlayerStatus(prev => ({
       ...prev,
       nextTurnBlock: (prev.nextTurnBlock || 0) + 3
     }));
   }
   ```

**验证**: 测试稳固姿态 (不出牌直接结束回合)

---

#### **Phase 3.5: 金币系统 (可选)** - 预计1小时

**目标**: 如果金币系统重要，则实现金币效果

⚠️ **建议**: 先咨询用户金币系统的重要性，再决定是否实施

1. **GAIN_GOLD** - 简单加金币
2. **GAMBLE** - 随机逻辑 + 金币/扣血
3. **WIN_GOLD_BONUS** - 胜利结算加成

---

### 📅 建议执行顺序

**优先级排序**:
1. ✅ **先完成 Batch 1 验证** (用户测试)
2. ✅ **完成 Batch 2 修复** (如果优先级高)
3. 🔴 **Phase 3.1** (紧急修复) → 修复代价BUG + 基础法力
4. 🔴 **Phase 3.2** (法力系统) → 完善法力机制
5. 🟡 **Phase 3.3** (永久成长) → 增加游戏深度
6. 🟡 **Phase 3.4** (条件效果) → 策略性玩法
7. 🟢 **Phase 3.5** (金币系统) → 可选，视游戏需求

**核心修复时间**: 2-2.5小时 (Phase 3.1-3.4)
**可选扩展时间**: +1小时 (Phase 3.5)

**明确建议暂缓** (卡牌操作类):
- `SCOUT` - 无价值 (敌人意图已可见)
- `RECYCLE`, `DISCOUNT_ONE_CARD`, `UPGRADE_CARD` - 需要 UI 选择系统
- `PERMA_UPGRADE_CARD` - 需要持久化重构
- `TRANSFORM` - 需要完整卡牌系统重构
- `BAIT_TRIGGER` - 复杂度高，收益低

---

### ⚠️ 注意事项

1. **代价机制**: `PERMA_STR_FOR_HP` 必须在战斗胜利时扣除最大HP，否则破坏平衡
2. **法力溢出**: 确保临时法力不超过上限 (如有)
3. **永久属性**: `DRAW_AT_START` 等效果需要在 `championData` 中持久化
4. **卡牌操作**: 涉及手牌修改的效果需要重新思考架构，建议延后

---

### 📊 预期成果

完成 Phase 3.1-3.4 后:
- **可用效果**: 从 37.5% 提升到 75% (18/24)
- **修复核心BUG**: 代价机制、法力系统正常工作
- **新增机制**: 永久成长、条件触发

**暂缓效果**: 6个卡牌操作类 (需要系统级重构)
**可选效果**: 3个金币类 (视游戏设计需求)

---

### 💡 与其他 Batch 的协同

- **Batch 1 → Batch 3**: `DRAW_AT_START` 依赖 Batch 1 的抽牌机制
- **Batch 2 → Batch 3**: 法力系统可能与 Batch 2 的技能增幅联动
- **建议顺序**: Batch 1 验证通过 → Batch 2 Phase 2.1-2.2 → Batch 3 Phase 3.1-3.3

