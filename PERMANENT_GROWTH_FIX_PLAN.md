# 🔧 永久成长机制修复计划

> **问题发现时间**: 2025-11-21 (Commit 530755f)  
> **报告人**: User (走查测试)

---

## 🚨 发现的问题

### 问题 1: 内瑟斯被动 - 力量成长不持久化

**现状**:
- 内瑟斯被动在 `BattleScene.jsx` 中实现，通过 `setPlayerStatus(s => ({ ...s, strength: s.strength + 1 }))` 增加力量
- 这个力量值只存在于**战斗内部状态**中
- 战斗结束后，`strength` 会丢失，无法带到下一场战斗

**预期行为**:
- 内瑟斯每次用攻击牌击杀敌人，应该**永久**获得 +1 力量
- 这个力量应该保存在 `App.jsx` 的 `baseStr` 状态中
- 下一场战斗开始时，应该继承之前积累的力量

**影响范围**: 高 - 核心成长机制失效

---

### 问题 2: 锤石被动 - 最大生命值增长未实现

**现状**:
```javascript
// BattleScene.jsx Line 292-294
if (heroData.relicId === "ThreshPassive") {
    setPlayerHp(h => h + 2); // 只增加当前HP
}
```

**问题**:
- 代码只增加了**当前HP**，没有增加**最大HP**
- 无法修改 `heroData.maxHp`（这是从 props 传入的）
- 需要通过回调函数将最大HP变化传递回 `App.jsx`

**预期行为**:
- 锤石每次击杀敌人，应该永久增加 +2 最大生命值
- 当前生命值也应该增加 +2（避免玩家立即死亡）
- 最大生命值应该保存在 `App.jsx` 的 `maxHp` 状态中

**影响范围**: 高 - 功能完全未实现

---

### 问题 3: 卡牌大师被动 - 战斗胜利金币未实现

**现状**:
- 卡牌大师被动 "战斗胜利额外获得 15 金币" 在任何地方都没有实现
- `App.jsx` 的 `handleBattleWin` 中没有检查 `TwistedFatePassive`

**预期行为**:
- 选择卡牌大师时，每场战斗胜利额外获得 +15 金币
- 应该在 `handleBattleWin` 中添加检测逻辑

**影响范围**: 中 - 经济优势失效

---

### 问题 4: 英雄锁定问题

**现状**:
```javascript
// champions.js
"Thresh_Hero": { id: "Thresh_Hero", ... }
"Katarina_Hero": { id: "Katarina_Hero", ... }

// ChampionSelect.jsx Line 40
const champId = Object.keys(CHAMPION_POOL).find(key => CHAMPION_POOL[key].name === champ.name);
```

**问题**:
- `Thresh_Hero` 的 `name` 是 "锤石"，但 `id` 是 "Thresh_Hero"
- `unlockedIds` 可能包含 "Thresh"，但实际ID是 "Thresh_Hero"
- 导致匹配失败，英雄被错误地锁定

**预期行为**:
- 所有英雄ID应该统一（建议使用英文ID如 "Thresh"，而不是 "Thresh_Hero"）
- 或者修改解锁检测逻辑，改为通过 `id` 而不是 `name` 匹配

**影响范围**: 中 - 影响用户体验

---

## 🔧 修复方案

### 方案 A: 添加战斗结果回调（推荐）

**步骤 1: 修改 `BattleScene.jsx` 的 `onWin` 回调**

```javascript
// 当前
const handleBattleWin = () => {
    if (heroData.relicId === "GarenPassive") {
        setPlayerHp(h => Math.min(heroData.maxHp, h + 6));
    }
    setTimeout(() => onWin(), 1200);
};

// 修复后
const handleBattleWin = () => {
    let gainedStr = 0;
    let gainedMaxHp = 0;
    
    // 盖伦被动：战斗结束恢复HP
    if (heroData.relicId === "GarenPassive") {
        setPlayerHp(h => Math.min(heroData.maxHp, h + 6));
    }
    
    // 内瑟斯被动：将临时力量转为永久力量
    if (heroData.relicId === "NasusPassive") {
        gainedStr = playerStatus.strength - (heroData.baseStr || 0);
    }
    
    // 锤石被动：累计最大生命值增长
    if (heroData.relicId === "ThreshPassive" && threshKillCount > 0) {
        gainedMaxHp = threshKillCount * 2;
    }
    
    setTimeout(() => {
        onWin({
            gainedStr,
            gainedMaxHp,
            finalHp: playerHp
        });
    }, 1200);
};
```

**步骤 2: 修改 `App.jsx` 的 `handleBattleWin` 函数**

```javascript
const handleBattleWin = (battleResult = {}) => {
    // 更新永久成长属性
    if (battleResult.gainedStr > 0) {
        setBaseStr(prev => prev + battleResult.gainedStr);
    }
    if (battleResult.gainedMaxHp > 0) {
        setMaxHp(prev => prev + battleResult.gainedMaxHp);
        setCurrentHp(prev => prev + battleResult.gainedMaxHp); // 当前HP也增加
    }
    
    // 卡牌大师被动：战斗胜利额外金币
    if (champion && champion.relicId === "TwistedFatePassive") {
        setGold(prev => prev + 15);
    }
    
    // 更新当前HP
    if (battleResult.finalHp !== undefined) {
        setCurrentHp(battleResult.finalHp);
    }
    
    setView('REWARD');
};
```

---

### 方案 B: 添加击杀计数器（适用于锤石）

**在 `BattleScene.jsx` 中添加**:

```javascript
const [threshKillCount, setThreshKillCount] = useState(0);

// 在敌人死亡的 useEffect 中
useEffect(() => {
    if (enemyHp <= 0 && gameState === 'ENEMY_TURN') {
        // 锤石被动：计数击杀
        if (heroData.relicId === "ThreshPassive") {
            setThreshKillCount(prev => prev + 1);
            setPlayerHp(h => h + 2); // 立即恢复2HP（视觉反馈）
        }
        // ... 其他逻辑
    }
}, [enemyHp]);
```

---

### 方案 C: 修复英雄ID不一致（最简单）

**修改 `champions.js`**:

```javascript
// 修改前
"Thresh_Hero": { id: "Thresh_Hero", name: "锤石", ... }
"Katarina_Hero": { id: "Katarina_Hero", name: "卡特琳娜", ... }

// 修改后
"Thresh": { id: "Thresh", name: "锤石", ... }
"Katarina": { id: "Katarina", name: "卡特琳娜", ... }
```

**或者修改 `ChampionSelect.jsx` 解锁检测**:

```javascript
// 修改前
const isUnlocked = unlockedIds && unlockedIds.includes(champId);

// 修改后（如果 unlockedIds 为空或未定义，则默认全部解锁）
const isUnlocked = !unlockedIds || unlockedIds.length === 0 || unlockedIds.includes(champ.id);
```

---

## 📊 实现优先级

| 优先级 | 任务 | 影响范围 | 预计时间 |
|--------|------|----------|----------|
| **P0** | 修复英雄ID不一致（锤石/卡特琳娜被锁） | 高 - 阻塞测试 | 5分钟 |
| **P0** | 实现内瑟斯力量持久化 | 高 - 核心机制 | 15分钟 |
| **P0** | 实现锤石最大HP增长 | 高 - 核心机制 | 15分钟 |
| **P1** | 实现卡牌大师金币奖励 | 中 - 平衡性 | 5分钟 |
| **P2** | 添加战斗结果反馈UI（显示获得的永久属性） | 低 - UX | 20分钟 |

**总计**: 60分钟

---

## ✅ 验收标准

### 测试用例 1: 内瑟斯力量成长

1. 选择内瑟斯开始游戏
2. 第一场战斗：用攻击牌击杀敌人1次，力量应为1
3. 战斗结束，进入奖励界面
4. 第二场战斗开始时，检查力量是否仍为1（而不是重置为0）
5. 再次用攻击牌击杀敌人，力量应变为2

### 测试用例 2: 锤石生命值成长

1. 选择锤石开始游戏（最大HP 90）
2. 第一场战斗：击杀1个敌人
3. 战斗结束时，最大HP应变为92，当前HP也应+2
4. 第二场战斗开始时，最大HP应保持92
5. 再次击杀1个敌人，最大HP应变为94

### 测试用例 3: 卡牌大师金币奖励

1. 选择卡牌大师开始游戏（初始金币100）
2. 完成第一场战斗
3. 检查金币是否变为165（50基础 + 15被动）
4. 完成第二场战斗
5. 检查金币增量是否包含+15被动

### 测试用例 4: 英雄解锁

1. 刷新英雄选择界面
2. 锤石和卡特琳娜应该**可选**（无灰色锁定遮罩）
3. 点击应该能正常选择

---

## 📝 后续优化建议

1. **添加战斗统计面板**：战斗结束时显示 "获得力量 +2"、"最大生命 +4" 等反馈
2. **保存永久属性到 localStorage**：确保刷新页面后成长属性不丢失
3. **添加英雄解锁系统**：通过通关特定关卡解锁新英雄
4. **平衡性调整**：内瑟斯和锤石的成长速度可能需要根据测试数据调整

---

**创建时间**: 2025-11-21  
**状态**: 待修复 🔴  
**负责人**: AI全栈工程师

