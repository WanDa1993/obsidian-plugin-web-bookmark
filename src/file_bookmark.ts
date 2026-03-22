import {Editor, FileSystemAdapter, Menu, normalizePath, Notice, Plugin, setIcon, TFile} from "obsidian";
import {CreateFileBookmarkModal} from "./modal";
import process from "process";

interface FileBookmarkBean {

	/**
	 * 文件
	 */
	file: TFile | null,

	/**
	 * 标题
	 */
	title: string

}

export default class FileBookmarkFeature {

	private readonly plugin: Plugin

	constructor(plugin: Plugin) {
		this.plugin = plugin
	}

	async onload() {
		// 添加指令: 插入书签
		this.plugin.addCommand({
			id: "insert_file_bookmark_template",
			name: "Add a file bookmark",
			editorCallback: (editor: Editor) => {
				const modal = new CreateFileBookmarkModal(this.plugin.app, (title, filePath) => {
					// 校验输入文件路径
					const tFile = this.getTFile(filePath)
					if (!tFile) {
						new Notice("Please enter a path relative to the vault root.")
						return
					}
					const block = this.buildFileBookmarkBlock(title, tFile)
					const cursor = editor.getCursor('from')
					editor.replaceSelection(`${block}`)
					editor.setCursor({
						line: cursor.line + block.split('\n').length,
						ch: 0
					})
				})
				modal.open()

			}
		})


		// 添加处理器: 专门处理"file_bookmark_block"
		this.plugin.registerMarkdownCodeBlockProcessor('file_bookmark_block', (source, el) => {
			this.renderFileBookmarkBlock(source, el)
		})
	}

	/**
	 * 创建 File Bookmark 代码块
	 */
	private buildFileBookmarkBlock(title: string, tFile: TFile): string {
		const bookmarkFilePath = tFile.path
		const bookmarkTitle = title || tFile.name
		const code = [
			'```file_bookmark_block',
			`path: ${bookmarkFilePath}`,
			`title: ${bookmarkTitle}`,
			'```'
		].join('\n')
		return `${code}\n`
	}

	/**
	 * 渲染 File Bookmark 代码块
	 */
	private renderFileBookmarkBlock(source: string, el: HTMLElement) {
		const bean = this.parseFileBookmarkBlock(source)
		this.generateFileBookmark(bean, el)
	}

	/**
	 * 解析 File Bookmark 代码块
	 */
	private parseFileBookmarkBlock(source: string): FileBookmarkBean {
		return source
			.split('\n')
			.map((line) => line.trim())
			.filter((line) => line.length > 0)
			.reduce<FileBookmarkBean>((result, line) => {
				const separatorIndex = line.indexOf(':')
				if (separatorIndex === -1) {
					return result
				}
				const key = line.slice(0, separatorIndex).trim().toLowerCase()
				const value = line.slice(separatorIndex + 1).trim()
				if (value.length === 0) {
					return result
				}
				if (key === 'path') {
					result.file = this.getTFile(value)
				}
				if (key === 'title') {
					result.title = value
				}
				return result
			}, {} as FileBookmarkBean);
	}


	/**
	 * 生成 File Bookmark
	 */
	private generateFileBookmark(source: FileBookmarkBean, el: HTMLElement) {
		const cardEl = el.createDiv({cls: 'bookmark-card'})
		// 标题区域
		const topEl = cardEl.createDiv({cls: 'bookmark-card-top'})
		const titleEl = topEl.createDiv({cls: 'bookmark-card-title'})
		const typeEl = topEl.createDiv({cls: 'bookmark-card-type'})
		typeEl.setText("File")
		if (!source.file) {
			titleEl.setText('Invalid path')
			this.generateErrorLayout(cardEl)
		} else {
			titleEl.setText(source.title || "")
			this.generateFileBookmarkLayout(source, cardEl)
		}
	}

	/**
	 * 创建 File Bookmark 错误样式
	 */
	private generateErrorLayout(cardEl: HTMLElement) {
		const errorEl = cardEl.createDiv({cls: 'bookmark-card-error'})
		// 错误图标
		const iconEl = errorEl.createSpan({cls: 'bookmark-card-error-icon'})
		setIcon(iconEl, 'file')
		// 错误文本
		errorEl.createDiv({cls: 'bookmark-card-error-text', text: 'Invalid path'})
	}

	/**
	 * 创建 File Bookmark 卡片布局
	 */
	private generateFileBookmarkLayout(source: FileBookmarkBean, cardEl: HTMLElement) {
		// 文件区域
		const fileEl = cardEl.createDiv({cls: 'bookmark-card-file'})

		// 文件图标
		const iconEl = fileEl.createSpan({cls: 'bookmark-card-icon'})
		setIcon(iconEl, 'file')
		// 链接文本
		fileEl.createDiv({
			cls: 'bookmark-card-text-path',
			text: source.file?.path || ""
		})

		// 菜单交互
		this.plugin.registerDomEvent(cardEl, 'contextmenu', (evt: MouseEvent) => {
			evt.preventDefault()
			const menu = new Menu()
			// 功能: 打开文件所在文件夹
			menu.addItem((item) => {
				let title: string;
				if (process.platform === "darwin") {
					title = "Reveal in Finder"
				} else {
					title = "Reveal in Explorer"
				}
				item
					.setIcon("folder-open")
					.setTitle(title)
					.onClick(async () => {
						const fileDir = source.file?.parent
						if (!fileDir) {
							new Notice("Failed to open the folder.")
							return
						}
						const adapter = this.plugin.app.vault.adapter
						if (adapter instanceof FileSystemAdapter) {
							const fullPath = adapter.getFullPath(fileDir.path)
							const {shell} = require("electron")
							await shell.openPath(fullPath)
						} else {
							new Notice("Failed to open the folder.")
						}
					})
			})
			// 功能: 打开文件
			menu.addItem((item) => {
				item
					.setIcon("file")
					.setTitle("Open in associated application")
					.onClick(async () => {
						const file = source.file
						if (!file) {
							new Notice("Failed to open the file.")
							return
						}
						const adapter = this.plugin.app.vault.adapter
						if (adapter instanceof FileSystemAdapter) {
							const fullPath = adapter.getFullPath(file.path)
							const {shell} = require("electron")
							await shell.openPath(fullPath)
						} else {
							new Notice("Failed to open the file.")
						}
					})
			})
			menu.showAtMouseEvent(evt)
		})
	}


	/**
	 * 根据文件路径获取文件
	 */
	private getTFile(filePath: string): TFile | null {
		try {
			const path = normalizePath(filePath)
			// 检查标准文件路径
			const target = this.plugin.app.vault.getAbstractFileByPath(path)
			if (target instanceof TFile) {
				return target
			}
			// 检查默认markdown文件类型路径
			const mdFilePath = filePath + ".md"
			const mdTarget = this.plugin.app.vault.getAbstractFileByPath(mdFilePath)
			if (mdTarget instanceof TFile) {
				return mdTarget
			}
			return null
		} catch (e) {
			return null
		}
	}
}
