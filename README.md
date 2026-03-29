# Card Bookmark

Card Bookmark 是一个 Obsidian 插件，用于把链接和库内文件制作成卡片式书签。

它提供两类书签：

- 链接书签：为一个 URL 插入代码块，并渲染为卡片。
- 文件书签：为一个 vault 相对路径插入代码块，并渲染为卡片。

插件还提供可选的文件栏点击拦截功能，可以按文件扩展名阻止单击或双击打开。

## 功能

- 从 URL 创建链接书签。
- 从 vault 相对路径创建文件书签。
- 在阅读视图中把书签代码块渲染成卡片。
- 通过卡片右键菜单复制链接或标题。
- 从文件书签卡片中在系统文件管理器里定位文件，或用关联应用打开文件。
- 按扩展名阻止文件栏中的单击或双击打开行为。

## 安装

1. 使用 `npm run build` 构建插件。
2. 将 `main.js`、`manifest.json` 和 `styles.css` 复制到：
   `<Vault>/.obsidian/plugins/obsidian-plugin-card-bookmark/`
3. 重新加载 Obsidian，并在 **Settings → Community plugins** 中启用插件。

## 开发

```bash
npm install
npm run dev
```

常用脚本：

- `npm run dev`：监听构建
- `npm run build`：生产构建
- `npm run lint`：代码检查
- `npm run version`：提升插件版本并更新发布元数据

## 使用方法

### 链接书签

1. 打开命令面板。
2. 执行 `Add a link bookmark`。
3. 输入可选标题和一个有效的 URL。
4. 将生成的 `link_bookmark_block` 代码块插入笔记。

示例：

````markdown
```link_bookmark_block
link: https://example.com
title: Example
```
````

### 文件书签

1. 打开命令面板。
2. 执行 `Add a file bookmark`。
3. 输入可选标题和一个 vault 相对路径。
4. 将生成的 `file_bookmark_block` 代码块插入笔记。

示例：

````markdown
```file_bookmark_block
path: Projects/notes/example.md
title: Example note
```
````

### 文件栏点击拦截

插件可以按扩展名阻止文件栏中文件的打开行为。

- 开启单击拦截后，可阻止单击打开。
- 开启双击拦截后，可阻止双击打开。
- 扩展名使用英文逗号分隔，例如 `pdf,zip,apk`。

## 说明

- 文件定位和外部打开依赖桌面端 API。
- 插件围绕 Obsidian 的本地 vault 数据设计，不依赖云服务。
- 书签代码块名称属于稳定约定，非必要不要更改，否则旧笔记需要迁移。

## 项目结构

- `src/main.ts`：插件生命周期和功能注册
- `src/link_bookmark.ts`：链接书签命令与渲染
- `src/file_bookmark.ts`：文件书签命令与渲染
- `src/file_click_interceptor.ts`：文件栏点击拦截
- `src/settings.ts`：设置模型和设置页
- `src/modal.ts`：书签创建弹窗
- `src/assets/`：插件使用的静态资源

## 发布

准备发布时：

1. 更新 `manifest.json` 和必要的版本元数据。
2. 运行 `npm run build`。
3. 发布 `main.js`、`manifest.json`，以及存在时的 `styles.css`。
