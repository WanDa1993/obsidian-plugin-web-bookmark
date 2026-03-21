import {Editor, Menu, Notice, Plugin, setIcon} from "obsidian";
import {LinkBookmarkModal} from "./modal";
import iconAndroid from "./assets/ic_android.svg"

interface LinkBookmarkBean {

	/**
	 * 链接
	 */
	link: string,

	/**
	 * 标题
	 */
	title: string

}


export default class LinkBookmarkFeature {

	private readonly plugin: Plugin

	constructor(plugin: Plugin) {
		this.plugin = plugin
	}

	async onload() {
		// 添加指令: 插入书签
		this.plugin.addCommand({
			id: "insert_link_bookmark_template",
			name: "Add a link bookmark",
			editorCallback: (editor: Editor) => {
				const modal = new LinkBookmarkModal(this.plugin.app, (title, link) => {
					// 校验输入内容
					if (!URL.canParse(link)) {
						new Notice("Please enter a valid URL.")
						return
					}
					const block = this.buildLinkBookmarkBlock(title, link)
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

		// 添加处理器: 专门处理"web_bookmark_block"
		this.plugin.registerMarkdownCodeBlockProcessor('link_bookmark_block', (source, el) => {
			this.renderLinkBookmarkBlock(source, el)
		})
	}

	/**
	 * 创建 Link Bookmark 代码块
	 */
	private buildLinkBookmarkBlock(title: string, link: string): string {
		const bookmarkLink = link.trim()
		const bookmarkTitle = title || this.getHostname(link)
		const code = [
			'```link_bookmark_block',
			`link: ${bookmarkLink}`,
			`title: ${bookmarkTitle}`,
			'```'
		].join('\n')
		return `${code}\n`
	}

	/**
	 * 渲染 Link Bookmark 代码块
	 */
	private renderLinkBookmarkBlock(source: string, el: HTMLElement) {
		const bean = this.parseLinkBookmarkBlock(source)
		this.generateLinkBookmark(bean, el)
	}

	/**
	 * 解析 Link Bookmark 代码块
	 */
	private parseLinkBookmarkBlock(source: string): LinkBookmarkBean {
		return source
			.split('\n')
			.map((line) => line.trim())
			.filter((line) => line.length > 0)
			.reduce<LinkBookmarkBean>((result, line) => {
				const separatorIndex = line.indexOf(':')
				if (separatorIndex === -1) {
					return result
				}
				const key = line.slice(0, separatorIndex).trim().toLowerCase()
				const value = line.slice(separatorIndex + 1).trim()
				if (value.length === 0) {
					return result
				}
				if (key === 'link') {
					result.link = value
				}
				if (key === 'title') {
					result.title = value
				}
				return result
			}, {} as LinkBookmarkBean);
	}

	/**
	 * 生成 Link Bookmark
	 */
	private generateLinkBookmark(source: LinkBookmarkBean, el: HTMLElement) {
		const cardEl = el.createDiv({cls: 'bookmark-card'})
		// 标题区域
		const titleEl = cardEl.createDiv({cls: 'bookmark-card-title'})
		// 根据不同的状态,生成不同的布局样式
		if (!URL.canParse(source.link)) {
			titleEl.setText('Invalid link')
			this.generateErrorLayout(cardEl)
		} else {
			titleEl.setText(source.title || "")
			this.generateLinkBookmarkLayout(source, cardEl)
		}
	}

	/**
	 * 创建 Link Bookmark 卡片布局
	 */
	private generateLinkBookmarkLayout(source: LinkBookmarkBean, cardEl: HTMLElement) {
		// 链接区域
		const linkEl = cardEl.createEl('a', {
			cls: 'bookmark-card-link',
			href: source.link
		})
		linkEl.setAttr('target', '_blank');
		linkEl.setAttr('rel', 'noopener noreferrer');

		// 链接图标
		const iconEl = linkEl.createSpan({cls: 'bookmark-card-icon'})
		const fileType = this.getFileType(source.link)
		if (fileType === '.pdf') {
			setIcon(iconEl, 'file-text')
		} else if (fileType === '.zip') {
			setIcon(iconEl, 'file-archive')
		} else if (fileType === '.apk') {
			iconEl.innerHTML = iconAndroid
		} else {
			setIcon(iconEl, 'link')
		}
		// 链接文本
		linkEl.createDiv({
			cls: 'bookmark-card-link-text',
			text: source.link
		})

		// 菜单交互
		this.plugin.registerDomEvent(cardEl, 'contextmenu', (evt: MouseEvent) => {
			evt.preventDefault()
			const menu = new Menu()
			// 功能: 复制链接
			menu.addItem((item) => {
				item
					.setIcon("copy")
					.setTitle("Copy link from bookmark")
					.onClick(async () => {
						await this.copyText(source.link)
					})
			})
			// 功能: 复制文本
			menu.addItem((item) => {
				item
					.setIcon('copy')
					.setTitle("Copy title from bookmark")
					.onClick(async () => {
						await this.copyText(source.title)
					})
			})
			menu.showAtMouseEvent(evt)
		})
	}

	/**
	 * 创建 Bookmark 错误样式
	 */
	private generateErrorLayout(cardEl: HTMLElement) {
		const errorEl = cardEl.createDiv({cls: 'bookmark-card-error'})
		// 错误图标
		const iconEl = errorEl.createSpan({cls: 'bookmark-card-error-icon'})
		setIcon(iconEl, 'link')
		// 错误文本
		errorEl.createDiv({cls: 'bookmark-card-error-text', text: 'Invalid link'})
	}

	/**
	 * 获取链接的host属性
	 */
	private getHostname(link: string): string {
		try {
			const url = new URL(link)
			return url.hostname
		} catch (e) {
			return link
		}
	}

	/**
	 * 获取链接的文件类型
	 */
	private getFileType(link: string): string {
		try {
			const url = new URL(link)
			const path = url.pathname
			const lastDotIndex = path.lastIndexOf(".")
			if (lastDotIndex === -1) return ""
			return path.slice(lastDotIndex).toLowerCase()
		} catch (e) {
			return ""
		}
	}

	/**
	 * 复制"文本"并提示
	 */
	private async copyText(text: string) {
		try {
			await navigator.clipboard.writeText(text);
			new Notice("Link copied");
		} catch {
			new Notice("Copy failed");
		}
	}

}
