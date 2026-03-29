# Card Bookmark

Card Bookmark 是一个 Obsidian 插件，用于把链接和文件路径制作成卡片式书签

它主要有以下三个功能：

- 链接书签：将一个 URL 插入代码块，并渲染为卡片
- 文件书签：将一个基于 vault 的相对路径插入代码块，并渲染为卡片
- 文件栏打开事件拦截：指定文件类型阻止其打开事件类型

## 使用方法

### 链接书签

1. 打开命令面板。
2. 执行 `Add a link bookmark`
3. 输入可选标题和一个有效的 URL
4. 将生成的 `link_bookmark_block` 代码块插入笔记

示例：

````markdown
```link_bookmark_block
link: https://example.com
title: Example
```
````

![Link bookmark example](./example_link_bookmark.png)

### 文件书签

1. 打开命令面板。
2. 执行 `Add a file bookmark`
3. 输入可选标题和一个基于 vault 的相对路径
4. 将生成的 `file_bookmark_block` 代码块插入笔记

示例：

````markdown
```file_bookmark_block
path: Projects/notes/example.md
title: Example note
```
````

![File bookmark example](./example_file_bookmark.png)

### 文件栏打开事件拦截

插件可以根据文件类型阻止其文件栏中的打开行为

- 开启单击拦截后，可阻止单击打开事件
- 开启双击拦截后，可阻止双击打开事件
- 扩展名使用英文逗号分隔，例如 `pdf,zip,apk`

![File interceptor example](./example_file_interceptor.png)

## 提示

- 快捷键：给两种书签设置指定的快捷键，可以大幅提升创建效率
- 文件书签：文件书签只支持 vault 内部的文件，当根据路径无法找到对应文件时，会提示"invalid path"
- 复制文件路径：右键点击文件 - Copy path - from vault folder，即可快速复制文件路径
- 拦截功能：单击文件、双击文件、文件类型都支持配置


## 项目结构

- `src/main.ts`：插件生命周期和功能注册
- `src/link_bookmark.ts`：链接书签命令与渲染
- `src/file_bookmark.ts`：文件书签命令与渲染
- `src/file_click_interceptor.ts`：文件栏点击拦截
- `src/settings.ts`：设置模型和设置页
- `src/modal.ts`：书签创建弹窗
- `src/assets/`：插件使用的静态资源

