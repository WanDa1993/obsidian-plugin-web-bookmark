import {App, Modal} from "obsidian";

/**
 * 创建Web Bookmark 的对话框
 */
export class WebBookmarkModal extends Modal {

	private readonly callback: (link: string) => void;

	constructor(app: App, callback: (link: string) => void) {
		super(app)
		this.callback = callback
	}

	onOpen() {
		const {contentEl, modalEl} = this
		// 初始化视图
		modalEl.addClass('web-bookmark-modal')
		contentEl.empty()

		// 输入框
		const formEl = contentEl.createEl('form', {
			cls: 'web-bookmark-modal-form'
		})
		const inputEl = formEl.createEl('input', {
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
			const content = inputEl.value.trim();
			if (content.length > 0) {
				this.callback(content)
			}
			this.close()
		})

		window.setTimeout(() => {
			inputEl.focus()
			inputEl.select()
		}, 10)
	}

	onClose() {
		this.contentEl.empty()
	}

}
