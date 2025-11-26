# 替换ChampionSelect指南

## 目标
用新的`HeroSelectView`替换旧的`ChampionSelect`组件

## 已完成的修改

### 1. HeroSelectView接口兼容性 ✅
- **参数**: 改为接受`onChampionSelect`和`unlockedIds`（与ChampionSelect相同）
- **回调**: 点击"LOCK IN"按钮时调用`onChampionSelect(championData)`
- **数据格式**: 从`CHAMPION_POOL`获取完整的英雄数据，确保与游戏逻辑兼容

### 2. 功能对比

| 功能 | ChampionSelect (旧) | HeroSelectView (新) |
|------|-------------------|-------------------|
| 显示方式 | 3个随机英雄卡片 | 全部14个英雄网格 |
| 皮肤选择 | ❌ 无 | ✅ 轮播查看皮肤 |
| 立绘预览 | 小图 | 大图+左侧全屏立绘 |
| 刷新功能 | ✅ 3次刷新 | ❌ 无需刷新（显示全部） |
| 语音播放 | ✅ 选择时播放 | ⚠️ 需要集成 |
| 锁定系统 | ✅ 支持unlockedIds | ✅ 支持（需添加过滤逻辑） |

## 替换步骤

### 方式一：直接替换文件（推荐）

1. **备份旧组件**（可选）:
   ```bash
   cp src/components/ChampionSelect.jsx src/components/ChampionSelect.backup.jsx
   ```

2. **重命名新组件（如需保留旧组件）**:
   ```bash
   # 如果未来需要回退，可以保留ChampionSelect.jsx
   # 并在需要的地方import HeroSelectView instead
   ```

3. **在使用ChampionSelect的地方导入HeroSelectView**:
   ```javascript
   // 旧的导入
   // import ChampionSelect from './components/ChampionSelect';
   
   // 新的导入
   import HeroSelectView from './components/HeroSelectView';
   
   // 使用方式完全一样
   <HeroSelectView 
     onChampionSelect={handleChampionSelect}
     unlockedIds={unlockedChampionIds}
   />
   ```

---

### 方式二：修改ChampionSelect.jsx直接使用新组件

**编辑 `src/components/ChampionSelect.jsx`**:
```javascript
// 删除所有内容，替换为：
export { default } from './HeroSelectView';
```

这样所有已经import ChampionSelect的地方会自动使用新组件。

---

## 需要补充的功能

### 1. 英雄锁定过滤 🔧
当前HeroSelectView显示所有英雄，需要添加锁定逻辑：

```javascript
// 在HeroSelectView.jsx中
const visibleHeroes = HERO_LIST.filter(hero => 
  !unlockedIds || unlockedIds.length === 0 || unlockedIds.includes(hero.id)
);

// 然后在网格中使用 visibleHeroes.map() 而不是 HERO_LIST.map()
```

### 2. 语音播放 🔊
集成playChampionVoice功能：

```javascript
import { playChampionVoice } from '../utils/audioManager';

// 在handleHeroSelect中添加
const handleHeroSelect = (hero) => {
  setSelectedHero(hero);
  setCurrentSkinIndex(0);
  playChampionVoice(hero.id); // 播放语音
};
```

### 3. 锁定视觉效果 🔒
为锁定的英雄添加灰度和锁图标：

```javascript
<motion.button
  className={`... ${
    isLocked ? 'opacity-50 grayscale cursor-not-allowed' : ''
  }`}
  disabled={isLocked}
>
  {/* 添加锁定遮罩 */}
  {isLocked && (
    <div className="absolute inset-0 flex items-center justify-center bg-black/60 z-10">
      <Lock className="w-8 h-8 text-slate-400" />
    </div>
  )}
</motion.button>
```

---

## 测试检查清单

- [ ] 英雄选择后正确调用`onChampionSelect`
- [ ] 传递的champion数据包含所有必要字段（id, name, maxHp, initialCards等）
- [ ] 锁定系统工作正常（灰色显示+不可点击）
- [ ] 语音在选择英雄时播放
- [ ] 皮肤切换流畅无卡顿
- [ ] 在不同分辨率下布局正常
- [ ] 没有console错误

---

## 回退方案

如果需要回退到旧版本：

1. 恢复备份:
   ```bash
   cp src/components/ChampionSelect.backup.jsx src/components/ChampionSelect.jsx
   ```

2. 或者在App.jsx中切换导入:
   ```javascript
   import ChampionSelect from './components/ChampionSelect.backup';
   ```

---

## 建议

由于App.jsx很大且即将重构，建议：
1. **不要修改App.jsx** - 只替换组件本身
2. **保持接口一致** - onChampionSelect + unlockedIds
3. **独立测试** - 使用NewSkillsDemo.jsx测试完整流程
4. **逐步集成** - 先确保基本功能工作，再添加语音等增强功能
