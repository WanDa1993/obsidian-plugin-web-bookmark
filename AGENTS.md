# Card Bookmark 插件协作说明

## 项目概览

- 这是一个 Obsidian 社区插件，当前功能围绕“卡片式书签”展开。
- 入口文件是 `src/main.ts`，最终打包为仓库根目录的 `main.js`。
- 当前插件包含三块核心功能：
  - 链接书签：`src/link_bookmark.ts`
  - 文件书签：`src/file_bookmark.ts`
  - 文件栏点击拦截：`src/file_click_interceptor.ts`
- 设置界面在 `src/settings.ts`，弹窗在 `src/modal.ts`，静态资源在 `src/assets/`。
- 发布所需产物仍然是 `main.js`、`manifest.json`，以及可选的 `styles.css`。

## 技术栈与构建

- 语言：TypeScript。
- 构建：`esbuild`，配置文件是 `esbuild.config.mjs`。
- 包管理器：`npm`。
- 依赖：`obsidian` 类型与运行时 API。
- 常用脚本：
  - `npm run dev`：监听构建
  - `npm run build`：生产构建
  - `npm run lint`：代码检查
  - `npm run version`：同步版本号并更新发布相关文件

## 目录约定

- 业务逻辑优先放在 `src/` 下，保持模块单一职责。
- `src/main.ts` 只负责插件生命周期、设置加载、设置页注册和功能模块装配。
- 新功能优先拆成独立模块，不要把所有逻辑继续堆进 `main.ts`。
- 新增 UI 相关逻辑时，优先复用现有 `modal.ts`、`settings.ts`、`src/assets/` 的组织方式。

## 当前实现约束

- 这个插件当前实现依赖桌面端能力：
  - `file_bookmark.ts` 使用了 `FileSystemAdapter`
  - 相关逻辑调用了 `electron` 的 `shell.openPath`
- 因此新增或修改文件打开、定位、外部应用唤起相关功能时，要按桌面插件来设计；如果要支持移动端，必须同步调整实现和兼容策略。
- 代码块处理器名称是稳定约定，当前包括：
  - `link_bookmark_block`
  - `file_bookmark_block`
- 设置字段名也是稳定约定，不要随意重命名：
  - `isEnableFileClickInterceptFeature`
  - `isEnableFileDoubleInterceptFeature`
  - `blockedFileExtensions`

## 修改原则

- 先读上下文，再改代码，避免凭猜测改动。
- 只做与当前任务直接相关的修改，避免顺手重构。
- 保持现有命名、代码风格和文件拆分方式一致。
- 已知根因清晰时，优先修根因，不要只修表面现象。
- 涉及跨模块或跨目录重构时，先征求用户批准。
- 不要修改与任务无关的文件、配置或逻辑。

## 命令与工具

- 优先使用现有脚本和工具链，不额外引入临时依赖。
- 优先使用非交互式命令。
- 默认可以执行只读检查，例如查看文件、搜索代码、查看差异。
- 未经明确要求，不要执行发布、推送、合并、重写历史、删除文件或其他高风险操作。
- 未经批准，不要联网安装依赖或修改锁文件。

## 验证建议

- 改动后优先运行最小范围验证。
- 与代码相关的常用验证顺序：
  1. `npm run lint`
  2. `npm run build`
- 如果没有执行验证，需要在最终说明里明确说明原因。

## Manifest 与版本

- `manifest.json` 中的 `id`、`name`、`version`、`minAppVersion`、`description`、`isDesktopOnly` 要保持准确。
- 现有插件 ID 是稳定配置，不要随意更改。
- 发布版本前，需要同步 `manifest.json` 和版本相关文件，保持构建产物一致。

## 安全与隐私

- 默认保持本地离线行为，不要引入不必要的网络请求。
- 不要新增遥测、隐藏上报或远程执行代码。
- 仅读写 vault 内必要内容，不要扩展到 vault 外部文件。
- 如果新增外部服务、数据传输或权限行为，必须在代码和文档里明确说明。

## 沟通要求

- 默认使用中文回复。
- 说明改动时，优先说结果，再补充涉及文件和验证情况。
- 引用文件时，尽量给出明确路径。
- 如果存在未验证项、风险点或假设，要直接说明，不要当成已确认结论。

