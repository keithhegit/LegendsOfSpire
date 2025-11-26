"""
地图死胡同修复脚本
方案A: 改进挖空逻辑 + 重新启用死胡同检测
"""
import re

file_path = 'src/data/gridMapLayout_v4.js'

# 读取文件
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

print("[Step 1] 改进挖空逻辑 - 保护主路径的邻居节点")

# 找到applyHoles函数的开始
# 在"创建主路径节点集合"之后添加主路径邻居保护逻辑
old_pattern = r"(// 创建主路径节点集合\(保护主路径不被挖空\)\s+const mainPathSet = new Set\(mainPath\.map\(n => `\$\{n\.row\}-\$\{n\.col\}`\)\);)"

new_code = r"""\1
  
  // ===========================
  // 改进: 保护主路径 + 主路径的一度邻居
  // ===========================
  // NEW: 创建主路径邻居集合(一度邻居)
  const mainPathNeighbors = new Set();
  for (const node of mainPath) {
    const neighbors = getHexNeighbors(node.row, node.col, gridRows, gridCols);
    for (const [r, c] of neighbors) {
      if (grid[r] && grid[r][c] && !mainPathSet.has(`${r}-${c}`)) {
        mainPathNeighbors.add(`${r}-${c}`);
      }
    }
  }
  
  console.log(`[挖空保护] 主路径节点: ${mainPathSet.size}, 邻居节点: ${mainPathNeighbors.size}`)"""

content = re.sub(old_pattern, new_code, content)

# 修改挖空保护逻辑
old_protection = r"// 保护主路径节点\s+if \(!mainPathSet\.has\(key\)\) \{"
new_protection = r"""// ✅ 改进: 保护主路径 + 主路径邻居
          if (!mainPathSet.has(key) && !mainPathNeighbors.has(key)) {"""

content = re.sub(old_protection, new_protection, content)

print("[Step 2] 重新启用死胡同检测")

# 找到被注释的死胡同检测代码并取消注释
dead_end_pattern = r"/\*\s+(const deadEnds = detectDeadEnds\(grid, gridRows, startNode, bossNode, allNodes\);[^*]+)\*/"

dead_end_replacement = r"""// ===========================
  // Step 6.5: 检测死胡同节点(重新启用)
  // ===========================
  // 改进: 在挖空之后重新检测死胡同，确保三选一机制下所有路径都通向BOSS
  \1
    if (attempt < 5) { // 增加重试次数到5次
      console.log(`⚠️ 重新生成地图 (尝试 ${attempt + 2}/6)...`);
      return generateGridMap(act, usedEnemies, attempt + 1);
    }
    console.warn('⚠️ 多次生成失败，使用fallback生成线性地图');
    return generateFallbackMap(act, usedEnemies);
  }"""

content = re.sub(dead_end_pattern, dead_end_replacement, content, flags=re.DOTALL)

print("[Step 3] 增加BOSS可达性验证的重试次数")

# 修改BOSS可达性验证的重试次数
content = re.sub(r"if \(attempt < 4\) \{", r"if (attempt < 5) { // 增加重试次数到5次\n      console.log(`⚠️ 重新生成地图 (尝试 ${attempt + 2}/6)...`);", content)

# 写回文件
with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("  ✅ 地图死胡同修复完成!")
print("  - 挖空逻辑已改进 (保护主路径邻居)")
print("  - 死胡同检测已重新启用")
print("  - 最大重试次数增加到6次")
