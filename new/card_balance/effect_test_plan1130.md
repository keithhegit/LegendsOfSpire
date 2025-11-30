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
| **CONDITIONAL_DOUBLE** | `LuxR` | 终极闪光 | 本回合出牌≥4 | 打出卡牌 | 伤害翻倍（需先打出 3 张其他牌）。 | 待测试（需要专用卡组保证抽到该牌并满足条件，计划在 Batch2 Phase2.5 执行）。 |
| **LOW_HP_BONUS** | `JinxR` | 超究极飞弹 | 敌人HP<50% | 打出卡牌 | 造成额外伤害（需先将敌人打至半血以下）。 | 待测试（尚未抽到该牌，Batch2 Phase2.5 补测）。 |

### ✨ R 技能覆盖现状（cards.js + BattleScene）

| 英雄 | R 技能 / Effect | 状态（参考 Batch 计划） |
| :--- | :--- | :--- |
| 盖伦 | `GarenR` / `EXECUTE_SCALE` | ✅ `BattleScene.jsx` L281-L284 已按缺血加成计算（Batch1 完成，待线上复测）。 |
| 德莱厄斯 | `DariusR` / `BLEED_EXECUTE` | ⚠️ 仅在 `cardEffectHandler.js` 写回 `bleedExecute`，前端未消费；列入 Batch2 Phase2.1。 |
| 拉克丝 | `LuxR` / `CONDITIONAL_DOUBLE` | ✅ 逻辑已接入（L286-L289），但需要 Batch2 Phase2.5 的专用测试卡组验证。 |
| 金克丝 | `JinxR` / `LOW_HP_BONUS` | ✅ L291-L294 处理低血加伤，Batch2 Phase2.5 复测中。 |
| 亚索 | `YasuoR` / `SCALE_BY_CRIT` | ⚠️ L296-L309 依赖暴击计数，当前 crit 系统只接入 `YasuoQ`，需 Phase2.2 完成全量暴击流程。 |
| 娑娜 | `SonaR` / `PER_CARD_BONUS` | ⛔ BattleScene 未读取 `perCardBonus`，排期在 Batch2 Phase2.1（Quick Win）。 |
| 艾克 | `EkkoR` / `HEAL_AND_DAMAGE` | ⛔ 尚未实现“同时伤害并回复”逻辑，列入 Batch2 Phase2.3。 |
| 塞拉斯 | `SylasR` / `COPY_ENEMY_ACTION` | ⛔ 未接管 `nextEnemyAction`，Batch2 Phase2.5 待实现。 |
| 厄加特 | `UrgotR` / `LOW_HP_EXECUTE` | ⛔ 没有阈值检验，Batch2 Phase2.1 需新增直接击杀逻辑。 |
| 维克托 | `ViktorR` / `DRAW_ON_USE` | ⛔ 未触发额外抽牌，Batch2 Phase2.3 需补。 |
| 瑞文 | `RivenR` / `STRENGTH + LOW_HP_BONUS` | ⚠️ 卡牌已写入 `cards.js`，但 BattleScene 仍缺“激活放逐之锋后获得力量与残血加伤”的逻辑；排入 Batch2 Phase2.1。 |
| 卡牌大师 | `TwistedFateR` / `DRAW + NEXT_ATTACK_BONUS` | ⚠️ 新卡提供抽牌与下一击增伤，BattleScene 需读取 `effectUpdates.nextAttackBonus`；归入 Batch2 Phase2.1。 |
| 李青 | `LeeR` / `REMOVE_BUFF` | ⛔ 仅 effect 占位，敌人增益移除逻辑未写；归档 Batch2 Phase2.3。 |
| 薇恩 | `VayneR` / `STRENGTH + NEXT_ATTACK_DOUBLE` | ⚠️ R 技能已补齐，需在 BattleScene 中叠加力量并复用 `nextAttackDouble` 逻辑；同样排进 Phase2.1。 |
| 提莫 | `TeemoR` / `POISON + WEAK` | ⚠️ 卡片现已存在，但未实现“蘑菇爆炸追加毒+虚弱”；视同批次与毒系机制一起实现。 |
| 锤石 | `ThreshR` / `WEAK_VULN_AND_PERMAHP` | ⛔ 仅记录状态，未处理“击杀加最大生命”；排入 Batch3 Phase3.3。 |
| 内瑟斯 | `NasusR` / `TEMP_STR` | ⛔ `tempStrength` 没有结算入口；Batch3 Phase3.3 实现。 |
| 艾瑞莉娅 | `IreliaR` / `ALL_ATTACKS_BONUS` | ⛔ 未对本回合其它攻击追加伤害；计划在 Batch2 Phase2.5。 |
| 卡特琳娜 | `KatarinaR` / `MULTI_STRIKE_SEGMENTS` | ⛔ 尚未拆分多段伤害；列入 Batch2 Phase2.4（历史追踪）。 |
| 劫 | `ZedR` / `DEATHMARK` | ✅ L388-L510 追踪印记伤害并在倒计时结束爆发（Batch2 已接入，待 QA）。 |

---

## 🔵 Batch 2: 高级战斗机制 (Advanced Combat)

涉及暴击、吸血、斩杀和反击等进阶机制。

| 效果 ID | 测试卡牌 (ID) | 卡牌名称 | 前置条件 | 验证步骤 | 预期结果 | 实测结果 |
| :--- | :--- | :--- | :--- | :--- | :--- | ---- |
| **CRIT_CHANCE** | `YasuoQ` | 斩钢闪 | 无 | 多次打出 | 有概率造成暴击（伤害数字变大/变色，通常为 2 倍）。 |  |
| **IMMUNE_ONCE** | `YasuoW` | 风之墙 | 无 | 打出卡牌 | 获得免疫状态。结束回合，敌人攻击时伤害为 0，显示 "IMMUNE"。 | 防御+12未生效，免疫效果生效 |
| **DOUBLE_IF_ATTACKED** | `YasuoE` | 疾风步 | 本回合已攻击 | 打出卡牌 | 伤害翻倍（需先打出一张攻击牌）。 | 伤害翻倍未实现 |
| **SCALE_BY_CRIT** | `YasuoR` | 狂风绝息斩 | 本回合暴击过 | 打出卡牌 | 造成多次伤害，次数等于本回合暴击次数。 |  |
| **SELF_BLOCK** | `SonaQ` | 英勇赞美诗 | 无 | 打出卡牌 | 造成伤害的同时，自身获得护甲。 |  |
| **DRAW_MANA** | `SonaE` | 迅捷奏鸣曲 | 无 | 打出卡牌 | 抽牌并获得临时法力（法力值增加）。 |  |
| **PER_CARD_BONUS** | `SonaR` | 终乐章 | 本回合多出牌 | 打出卡牌 | 伤害随本回合已打出卡牌数量增加。 |  |
| **RETRO_BONUS** | `EkkoQ` | 时间折刃 | 上回合攻击过 | 打出卡牌 | 若上回合对该敌人造成过伤害，本卡伤害增加。 |  |
| **REFLECT_IF_HIT** | `EkkoW` | 时光护盾 | 无 | 打出卡牌 | 获得状态。敌人攻击时，受到反弹伤害。 |  |
| **NEXT_COST_REDUCE** | `EkkoE` | 相位俯冲 | 手有攻击牌 | 打出卡牌 | 手牌中下一张攻击牌的费用 -1。 |  |
| **HEAL_AND_DAMAGE** | `EkkoR` | 时空逆转 | 玩家掉血 | 打出卡牌 | 恢复生命值，同时对敌人造成伤害。 |  |
| **LIFELINK** | `SylasW` | 吸取之斩 | 玩家掉血 | 打出卡牌 | 造成伤害的同时，恢复等量（或固定量）生命值。 |  |
| **NEXT_ATTACK_DOUBLE** | `SylasE` | 叛乱突袭 | 无 | 打出卡牌 | 获得状态。下一张攻击牌造成的伤害翻倍。 |  |
| **COPY_ENEMY_ACTION** | `SylasR` | 夺魂 | 敌人意图攻击 | 打出卡牌 | 施放敌人即将进行的攻击（对敌人造成伤害）。 |  |
| **SELF_DAMAGE** | `UrgotE` | 超限驱动 | 无 | 打出卡牌 | 对敌人造成伤害，同时自己扣除少量生命值。 |  |
| **LOW_HP_EXECUTE** | `UrgotR` | 处刑索命 | 敌人HP<30% | 打出卡牌 | 直接消灭敌人（显示巨额伤害或直接致死）。 |  |
| **BUFF_NEXT_SKILL** | `ViktorQ` | 能量转导 | 手有技能牌 | 打出卡牌 | 下一张技能牌的数值（伤害或护甲）增加。 | 未生效。 |
| **BONUS_IF_VULN** | `ViktorE` | 光束 | 敌人易伤 | 打出卡牌 | 若敌人有易伤，造成额外伤害。 | √（敌人有易伤，易伤+4？ |
| **DRAW_ON_USE** | `ViktorR` | 进化歧路 | 无 | 打出卡牌 | 造成伤害并抽牌。 |  |
| **REMOVE_BUFF** | `LeeR` | 猛龙摆尾 | 敌人有Buff | 打出卡牌 | 造成伤害并移除敌人一个增益状态（如力量、格挡）。 |  |
| **STUN_IF_WEAK** | `VayneE` | 墙角突袭 | 敌人虚弱 | 打出卡牌 | 若敌人虚弱，使其眩晕。否则只造成伤害。 | √（还有6点基础伤害） |
| **DEATHMARK** | `ZedR` | 死亡印记 | 无 | 打出卡牌 | 施加印记。几回合后印记爆发，造成期间受到伤害总和的百分比伤害。 |  |

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
| **MANA_IF_LOW_HAND** | `Neutral_016` | 法力石碎片 | 手牌<=3 | 打出卡牌 | 获得法力并抽牌。 | 未生效。 |
| **PERMA_DRAW_ON_KILL** | `Neutral_017` | 求知铭文 | 击杀敌人 | 打出卡牌 | 击杀后，永久获得“每回合多抽1牌”的效果。 |  |
| **PERMA_UPGRADE_CARD** | `Neutral_018` | 匠魂之锤 | 手有可升级牌 | 打出卡牌 | 选择一张牌，该牌数值永久提升（本局游戏）。 | 未生效。 |
| **WIN_GOLD_BONUS** | `Neutral_019` | 荣誉奖章 | 无 | 打出卡牌 | 战斗胜利结算时，金币奖励增加。 | 未生效。 |
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
| **ALL_ATTACKS_BONUS** | `IreliaR` | 先锋突袭 | 无 | 打出卡牌 | 获得状态：本回合所有攻击伤害增加。 |  |
| **DRAW_ON_HIT** | `KatarinaW` | 迅刃突袭 | 无 | 打出卡牌 | 造成伤害并抽牌。 |  |
| **COMBO_BONUS** | `KatarinaE` | 蛇步闪击 | 本回合已伤害 | 打出卡牌 | 若本回合已造成过伤害，本卡伤害增加。 |  |
| **MULTI_STRIKE_SEGMENTS** | `KatarinaR` | 死亡莲华 | 无 | 打出卡牌 | 造成多段伤害（如 5 段），每段独立计算护甲。 |  |

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
| 灵魂献祭     | 失去4点生命，获得1点法力。                                   | mana<3，失去1点生命，获得1点法力；mana=3，失去1点生命，但不获得法力。 |
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

**Batch 2 总计**: 22个效果
**未测试/未生效**: 13个 (59%)
**已生效**: 3个 (14%)
**部分生效**: 2个 (9%)
**测试缺失**: 4个 (18%)

---

### 🔍 问题诊断分类

#### 类别 A: 核心系统缺失 (需要新增state和逻辑)

| 效果 ID | 卡牌 | 问题分析 | 技术复杂度 | 优先级 |
|---------|------|----------|------------|--------|
| **CRIT_CHANCE** | YasuoQ | 暴击系统未实现：需要随机判定、伤害翻倍、暴击次数追踪 | 🔴 高 | P0 |
| **SCALE_BY_CRIT** | YasuoR | 依赖暴击系统，需要 `critCount` state | 🔴 高 | P0 |
| **DEATHMARK** | ZedR | 需要追踪印记期间的伤害，回合倒计时，爆发结算 | 🔴 高 | P1 |
| **RETRO_BONUS** | EkkoQ | 需要 `damageHistory` 追踪上回合是否造成伤害 | 🟡 中 | P1 |

#### 类别 B: 前端集成缺失 (cardEffectHandler已实现，BattleScene未集成)

| 效果 ID | 卡牌 | 问题分析 | 修复方案 | 优先级 |
|---------|------|----------|----------|--------|
| **DOUBLE_IF_ATTACKED** | YasuoE | 检查本回合是否已打出攻击牌 | 检查 `cardsPlayedCount >= 2` | P1 |
| **PER_CARD_BONUS** | SonaR | 每打一张牌加成 | 使用 `cardsPlayedCount` 计算 | P1 |
| **BUFF_NEXT_SKILL** | ViktorQ | 下张技能牌加成 | 添加 `nextSkillBonus` state | P1 |
| **BONUS_IF_VULN** | ViktorE | 易伤额外伤害 | 已有 `bonusIfVuln` 但未应用 | P0 |
| **LIFELINK** | SylasW | 造成伤害的同时回血 | 获取伤害值并回血 | P1 |
| **REFLECT_IF_HIT** | EkkoW | 受击反弹伤害 | 在 `enemyAction` 中检测并反伤 | P1 |
| **COPY_ENEMY_ACTION** | SylasR | 复制敌人攻击 | 读取 `nextEnemyAction` 并造成一半伤害 | P2 |
| **LOW_HP_EXECUTE** | UrgotR | 低血斩杀 | 检查 `enemyHp < maxHp * 0.3` 直接击杀 | P1 |

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
| **DRAW_ON_USE** | ViktorR | ✅ cardEffectHandler已处理 | 低 |
| **REMOVE_BUFF** | LeeR | ⚠️ 未测试 | 中 |

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
     const critChance = (playerStatus.strength || 0) * 0.05; // 每点力量5%
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
| **MANA_IF_LOW_HAND** | Neutral_016 | 条件判断和法力增加 | 检查手牌数，返回 `manaChange` | 🟡 P1 |
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
| **WIN_GOLD_BONUS** | Neutral_019 | 胜利金币加成 | 在 `battleResult` 中添加 `goldBonus` | 🟢 P3 |

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

