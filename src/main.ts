import {Plugin} from 'obsidian';
import LinkBookmarkFeature from "./link_bookmark";
import FileBookmarkFeature from "./file_bookmark";


export default class BookmarkPlugin extends Plugin {

	/**
	 * 链接标签功能
	 */
	private linkBookmarkFeature = new LinkBookmarkFeature(this)

	/**
	 * 文件标签功能
	 */
	private fileBookmarkFeature = new FileBookmarkFeature(this)

	async onload() {
		await this.linkBookmarkFeature.onload()
		await this.fileBookmarkFeature.onload()
	}

}
