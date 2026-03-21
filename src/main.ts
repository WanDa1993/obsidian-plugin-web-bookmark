import {Plugin} from 'obsidian';
import LinkBookmarkFeature from "./link";


export default class BookmarkPlugin extends Plugin {

	private linkBookmarkFeature = new LinkBookmarkFeature(this)

	async onload() {
		await this.linkBookmarkFeature.onload()
	}

}
