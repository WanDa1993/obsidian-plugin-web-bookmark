import {PluginSettingTab, Setting, App} from "obsidian";
import type BookmarkPlugin from "./main";

export interface BookmarkSettings {

	/**
	 * 是否开启文件单击拦截功能(非markdown格式)
	 */
	isEnableFileClickInterceptFeature: boolean;

	/**
	 * 是否开启文件双击拦截功能(非markdown格式)
	 */
	isEnableFileDoubleInterceptFeature: boolean;

	/**
	 * 指定阻止打开的文件扩展名,用逗号分隔
	 */
	blockedFileExtensions: string;

}

export const DEFAULT_SETTINGS: BookmarkSettings = {

	isEnableFileClickInterceptFeature: false,

	isEnableFileDoubleInterceptFeature: false,

	blockedFileExtensions: "",

};

export class CardBookmarkSettingTab extends PluginSettingTab {

	private readonly plugin: BookmarkPlugin;

	constructor(app: App, plugin: BookmarkPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const {containerEl} = this;
		containerEl.empty();
		new Setting(containerEl)
			.setName("Preferences")
			.setHeading()
		// 功能: 单击打开文件功能拦截
		new Setting(containerEl)
			.setName("Enable file click interceptor")
			.setDesc("Prevent files whose extensions match the list below from opening on single click.")
			.addToggle((toggle) => toggle
				.setValue(this.plugin.settings.isEnableFileClickInterceptFeature)
				.onChange(async (value) => {
					this.plugin.settings.isEnableFileClickInterceptFeature = value;
					await this.plugin.saveData(this.plugin.settings);
				}));
		// 功能: 双击打开文件功能拦截
		new Setting(containerEl)
			.setName("Enable file double click interceptor")
			.setDesc("Prevent files whose extensions match the list below from opening on double click.")
			.addToggle((toggle) => toggle
				.setValue(this.plugin.settings.isEnableFileDoubleInterceptFeature)
				.onChange(async (value) => {
					this.plugin.settings.isEnableFileDoubleInterceptFeature = value;
					await this.plugin.saveData(this.plugin.settings);
				}));
		// 功能: 指定阻止打开的文件类型
		new Setting(containerEl)
			.setName("Blocked file extensions")
			.setDesc("Enter a comma-separated list of extensions. Leave empty to block nothing.")
			.addText((text) => text
				.setPlaceholder("Extension list")
				.setValue(this.plugin.settings.blockedFileExtensions)
				.onChange(async (value) => {
					this.plugin.settings.blockedFileExtensions = value;
					await this.plugin.saveData(this.plugin.settings);
				}));

	}
}
