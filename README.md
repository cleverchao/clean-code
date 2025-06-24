# 🔧 通用代码清理工具

一个功能强大的Node.js命令行工具，用于清理代码文件中的注释和空行，支持多种文件格式和灵活的配置选项。

## ✨ 特性

- 🎯 **多文件格式支持**：Vue、JavaScript、TypeScript、JSX、TSX等
- 📁 **批量处理**：支持单个文件或整个目录的递归处理
- 🔧 **灵活配置**：可选择性地启用/禁用各种清理功能
- 💾 **安全备份**：自动备份原文件，确保数据安全
- 📊 **详细统计**：显示处理进度和清理效果
- 🎨 **保留格式**：保持代码缩进和结构

## 🚀 快速开始

### 安装

1. 确保已安装Node.js
2. 下载 `clean-code.js` 文件
3. 在命令行中运行

### 基本使用

```bash
# 处理单个文件
node clean-code.js ./src/App.vue

# 处理整个目录
node clean-code.js ./src/components

# 处理多个文件
node clean-code.js ./src/App.vue ./src/main.js
```

## 📖 详细用法

### 命令行参数

```bash
node clean-code.js <文件路径或目录路径> [选项]
```

### 选项说明

| 选项 | 说明 | 默认值 |
|------|------|--------|
| `--no-backup` | 不备份原文件 | 自动备份 |
| `--no-verbose` | 不显示详细输出 | 显示详细信息 |
| `--no-html-comments` | 不删除HTML注释 | 删除HTML注释 |
| `--no-js-comments` | 不删除JavaScript注释 | 删除JS注释 |
| `--no-css-comments` | 不删除CSS注释 | 删除CSS注释 |
| `--no-empty-lines` | 不删除空行 | 删除空行 |
| `--no-trim-whitespace` | 不清理行尾空白 | 清理行尾空白 |
| `--no-trim-ends` | 不清理文件首尾空行 | 清理首尾空行 |
| `--extensions <扩展名>` | 指定文件扩展名 | `.vue,.js,.ts,.jsx,.tsx` |
| `--help` 或 `-h` | 显示帮助信息 | - |

### 使用示例

#### 1. 基本清理
```bash
# 清理单个Vue文件
node clean-code.js ./src/App.vue
```

#### 2. 批量处理
```bash
# 清理整个src目录下的所有支持的文件
node clean-code.js ./src
```

#### 3. 自定义文件类型
```bash
# 只处理JavaScript文件
node clean-code.js ./src --extensions .js

# 处理多种文件类型
node clean-code.js ./src --extensions .js,.ts,.vue
```

#### 4. 选择性清理
```bash
# 只删除注释，保留空行
node clean-code.js ./src --no-empty-lines

# 只删除空行，保留注释
node clean-code.js ./src --no-js-comments --no-html-comments --no-css-comments
```

#### 5. 静默模式
```bash
# 不显示详细输出
node clean-code.js ./src --no-verbose
```

#### 6. 不备份模式
```bash
# 直接修改文件，不创建备份
node clean-code.js ./src --no-backup
```

## 🔧 清理功能

### 1. 注释清理
- **HTML注释**：`<!-- 注释内容 -->`
- **JavaScript单行注释**：`// 注释内容`
- **JavaScript多行注释**：`/* 注释内容 */`
- **CSS单行注释**：在`<style>`标签内的`// 注释`
- **CSS多行注释**：在`<style>`标签内的`/* 注释 */`

### 2. 空行处理
- 删除所有空行（包括只包含空白字符的行）
- 保留代码缩进结构

### 3. 空白字符处理
- 清理行尾的空白字符
- 保留行首的缩进（空格和制表符）
- 清理文件开头和结尾的空行

## 📊 输出示例

```
🔄 正在处理文件: ./src/App.vue
💾 已备份原文件到: ./src/App.vue.backup
📁 开始处理文件: ./src/App.vue
📊 文件大小: 45.67 KB
✅ 已删除HTML注释
✅ 已删除JavaScript单行注释
✅ 已删除JavaScript多行注释
✅ 已删除CSS单行注释
✅ 已删除CSS多行注释
✅ 已删除所有空行 (从 234 行减少到 189 行)
✅ 已清理行尾空白（保留缩进）
✅ 已清理文件首尾空行
📊 清理完成:
   原始大小: 45.67 KB
   清理后大小: 38.92 KB
   节省空间: 6.75 KB (14.78%)
✅ 文件清理完成: ./src/App.vue

🎉 处理完成! 成功处理 1/1 个文件
```

## ⚠️ 注意事项

1. **备份重要**：默认会备份原文件，建议保留备份
2. **文件编码**：确保文件使用UTF-8编码
3. **权限问题**：确保有读写文件的权限
4. **大文件处理**：大文件可能需要一些时间处理
5. **版本控制**：建议在版本控制系统中使用前先测试

## 🔄 与其他脚本的区别

| 脚本 | 用途 | 特点 |
|------|------|------|
| `clean-code.js` | 通用清理工具 | 支持命令行参数，功能最全面 |
| `clean-vue-files.js` | Vue文件专用 | 简单易用，适合Vue项目 |
| `clean-large-vue-file.js` | 大文件处理 | 流式处理，适合大文件 |
| `clean-untitled-file.js` | 特定文件 | 专门处理特定文件 |

## 🛠️ 扩展使用

### 作为模块导入

```javascript
const { cleanCodeFile, processFile, processDirectory } = require('./clean-code.js');

// 清理单个文件
const cleanedContent = cleanCodeFile('./src/App.vue', {
    verbose: true,
    removeEmptyLines: false
});

// 处理文件
processFile('./src/App.vue', {
    backup: false,
    verbose: false
});

// 处理目录
processDirectory('./src', {
    extensions: ['.js', '.ts'],
    removeJsComments: false
});
```

### 自定义配置

```javascript
const options = {
    backup: true,                    // 是否备份
    verbose: true,                   // 是否显示详细信息
    removeHtmlComments: true,        // 删除HTML注释
    removeJsComments: true,          // 删除JavaScript注释
    removeCssComments: true,         // 删除CSS注释
    removeEmptyLines: true,          // 删除空行
    trimTrailingWhitespace: true,    // 清理行尾空白
    trimFileEnds: true,              // 清理文件首尾空行
    extensions: ['.vue', '.js', '.ts', '.jsx', '.tsx']  // 支持的文件扩展名
};
```

## 🐛 故障排除

### 常见问题

1. **文件不存在**
   ```
   ❌ 文件不存在: ./src/App.vue
   ```
   解决：检查文件路径是否正确

2. **权限错误**
   ```
   ❌ 写入文件失败: ./src/App.vue
   ```
   解决：检查文件权限，确保有写权限

3. **编码问题**
   ```
   ❌ 读取文件失败: ./src/App.vue
   ```
   解决：确保文件使用UTF-8编码

### 获取帮助

```bash
# 显示帮助信息
node clean-code.js --help
```

## 📝 更新日志

### v1.0.0
- ✨ 初始版本发布
- 🎯 支持多种文件格式
- 🔧 灵活的配置选项
- 💾 自动备份功能
- 📊 详细的处理统计 