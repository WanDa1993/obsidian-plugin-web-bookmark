import {App, Modal} from "obsidian";

/**
 * 创建 Link Bookmark 的对话框
 */
export class CreateLinkBookmarkModal extends Modal {

	private readonly callback: (title: string, link: string) => void;

	constructor(app: App, callback: (title: string, link: string) => void) {
		super(app)
		this.callback = callback
	}

	onOpen() {
		const {contentEl, modalEl} = this
		// 初始化视图
		modalEl.addClass('bookmark-modal')
		contentEl.empty()

		const formEl = contentEl.createEl('form', {
			cls: 'bookmark-modal-form'
		})
		// 标题输入框
		const inputTitleEl = formEl.createEl('input', {
			cls: 'bookmark-modal-input',
			placeholder: 'Enter title (optional)',
			value: ""
		})
		inputTitleEl.maxLength = 100

		// 链接输入框
		const inputLinkEl = formEl.createEl('input', {
			cls: 'bookmark-modal-input',
			type: 'url',
			placeholder: 'Paste in https://...',
			value: ""
		})

		// 描述信息
		formEl.createEl('p', {
			cls: 'bookmark-modal-desc',
			text: 'Create a bookmark from a link.'
		})

		const buttonEl = formEl.createEl('button', {
			cls: 'mod-cta bookmark-modal-button',
			text: "Create bookmark",
			type: 'submit'
		})
		buttonEl.disabled = false

		// 按钮点击事件
		formEl.addEventListener('submit', (event) => {
			event.preventDefault()
			const title = inputTitleEl.value.trim()
			const content = inputLinkEl.value.trim();
			if (content.length > 0) {
				this.callback(title, content)
			}
			this.close()
		})

		window.setTimeout(() => {
			inputLinkEl.focus()
			inputLinkEl.select()
		}, 10)
	}

	onClose() {
		this.contentEl.empty()
	}

}


/**
 * 创建 File Bookmark 的对话框
 */
export class CreateFileBookmarkModal extends Modal {

	private readonly callback: (title: string, filePath: string) => void;

	constructor(app: App, callback: (title: string, filePath: string) => void) {
		super(app)
		this.callback = callback
	}

	onOpen() {
		const {contentEl, modalEl} = this
		// 初始化视图
		modalEl.addClass('bookmark-modal')
		contentEl.empty()

		const formEl = contentEl.createEl('form', {
			cls: 'bookmark-modal-form'
		})
		// 标题输入框
		const inputTitleEl = formEl.createEl('input', {
			cls: 'bookmark-modal-input',
			placeholder: 'Enter title (optional)',
			value: ""
		})
		inputTitleEl.maxLength = 100

		// 文件路径输入框
		const inputFilePathEl = formEl.createEl('input', {
			cls: 'bookmark-modal-input',
			placeholder: 'Paste a path relative to the vault root',
			value: ""
		})

		// 描述信息
		formEl.createEl('p', {
			cls: 'bookmark-modal-desc',
			text: 'Create a bookmark from a path relative to the vault root'
		})

		const buttonEl = formEl.createEl('button', {
			cls: 'mod-cta bookmark-modal-button',
			text: "Create bookmark",
			type: 'submit'
		})
		buttonEl.disabled = false

		// 按钮点击事件
		formEl.addEventListener('submit', (event) => {
			event.preventDefault()
			const title = inputTitleEl.value.trim()
			const content = inputFilePathEl.value.trim();
			if (content.length > 0) {
				this.callback(title, content)
			}
			this.close()
		})

		window.setTimeout(() => {
			inputFilePathEl.focus()
			inputFilePathEl.select()
		}, 10)
	}

	onClose() {
		this.contentEl.empty()
	}

}
