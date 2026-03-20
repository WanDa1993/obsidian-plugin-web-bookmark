import {App, Modal} from "obsidian";

/**
 * 创建Web Bookmark 的对话框
 */
export class WebBookmarkModal extends Modal {

	private readonly callback: (title: string, link: string) => void;

	constructor(app: App, callback: (title: string, link: string) => void) {
		super(app)
		this.callback = callback
	}

	onOpen() {
		const {contentEl, modalEl} = this
		// 初始化视图
		modalEl.addClass('web-bookmark-modal')
		contentEl.empty()

		const formEl = contentEl.createEl('form', {
			cls: 'web-bookmark-modal-form'
		})
		// 标题输入框
		const inputTitleEl = formEl.createEl('input', {
			cls: 'web-bookmark-modal-input',
			placeholder: 'Enter title (optional)',
			value: ""
		})
		inputTitleEl.maxLength = 100

		// 链接输入框
		const inputLinkEl = formEl.createEl('input', {
			cls: 'web-bookmark-modal-input',
			type: 'url',
			placeholder: 'Paste in https://...',
			value: ""
		})

		// 描述信息
		formEl.createEl('p', {
			cls: 'web-bookmark-modal-desc',
			text: 'Create a bookmark from a link.'
		})

		const buttonEl = formEl.createEl('button', {
			cls: 'mod-cta web-bookmark-modal-button',
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
