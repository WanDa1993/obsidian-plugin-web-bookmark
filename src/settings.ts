import {App, PluginSettingTab, Setting} from "obsidian";
import WebBookmarkPlugin from "./main";

export interface WebBookmarkPluginSettings {

	/**
	 * 默认URL
	 */
	defaultUrl: string

	/**
	 * 默认标题
	 */
	defaultTitle: string

}

/**
 * 默认配置项
 */
export const SETTINGS: WebBookmarkPluginSettings = {

	defaultUrl: "https://example.com",

	defaultTitle: "Web bookmark"
};

export class WebBookmarkSettingsTab extends PluginSettingTab {
	plugin: WebBookmarkPlugin

	constructor(app: App, plugin: WebBookmarkPlugin) {
		super(app, plugin)
		this.plugin = plugin
	}

	display(): void {
		const {containerEl} = this
		containerEl.empty()

		// 设置项: 默认标签
		new Setting(containerEl)
			.setName("Default bookmark title")
			.setDesc("Set the default title for bookmarks")
			.addText((text) => {
				text.setPlaceholder(SETTINGS.defaultTitle)
				text.setValue(this.plugin.settings.defaultTitle)
				text.onChange(async (value) => {
					this.plugin.settings.defaultTitle = value.trim() || SETTINGS.defaultTitle
					await this.plugin.saveSettings()
				})
			});

		// 设置项: 默认URL
		new Setting(containerEl)
			.setName("Default URL template")
			.setDesc("Set the default url template for bookmarks")
			.addText((text) => {
				text.setPlaceholder(SETTINGS.defaultUrl)
				text.setValue(this.plugin.settings.defaultUrl)
				text.onChange(async (value) => {
					this.plugin.settings.defaultUrl = value.trim() || SETTINGS.defaultUrl
					await this.plugin.saveSettings()
				})
			})
	}
}

