import {Plugin} from 'obsidian';
import LinkBookmarkFeature from "./link_bookmark";
import FileBookmarkFeature from "./file_bookmark";
import FileClickInterceptorFeature from "./file_click_interceptor";
import {CardBookmarkSettingTab, DEFAULT_SETTINGS, BookmarkSettings} from "./settings";


export default class BookmarkPlugin extends Plugin {

	settings: BookmarkSettings;

	/**
	 * 链接标签功能
	 */
	private linkBookmarkFeature = new LinkBookmarkFeature(this)

	/**
	 * 文件标签功能
	 */
	private fileBookmarkFeature = new FileBookmarkFeature(this)

	/**
	 * 文件栏点击拦截
	 */
	private fileClickInterceptorFeature = new FileClickInterceptorFeature(this)


	async onload() {
		// 设置页面
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
		this.addSettingTab(new CardBookmarkSettingTab(this.app, this));

		// 功能加载
		await this.fileClickInterceptorFeature.onload()
		await this.linkBookmarkFeature.onload()
		await this.fileBookmarkFeature.onload()
	}

}
