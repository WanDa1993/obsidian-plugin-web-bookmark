import {TFile} from "obsidian";
import type BookmarkPlugin from "./main";

export default class FileClickInterceptor {

	private readonly plugin: BookmarkPlugin;

	constructor(plugin: BookmarkPlugin) {
		this.plugin = plugin;
	}

	onload() {
		this.plugin.registerDomEvent(document, "click", (event: MouseEvent) => {
			// 检测单击拦截功能开关
			if (!this.plugin.settings.isEnableFileClickInterceptFeature) {
				return;
			}
			// 事件已被拦截时,无须处理
			if (event.defaultPrevented) {
				return;
			}
			// 组合事件时,无须处理 ctrl + 左键
			if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
				return;
			}
			// 非鼠标左键单击时,无须处理
			if (event.button !== 0) {
				return;
			}
			// 除单击、双击外,其他无须处理
			if (event.detail > 2) {
				return;
			}
			// 检测双击拦截功能开关
			if (event.detail == 2 && !this.plugin.settings.isEnableFileDoubleInterceptFeature) {
				return;
			}
			const target = event.target;
			if (!(target instanceof HTMLElement)) {
				return;
			}
			// 查找对应的<nav-file>元素
			const navFileEl = target.closest(".workspace-leaf-content[data-type='file-explorer'] .nav-file");
			if (!(navFileEl instanceof HTMLElement)) {
				return;
			}
			// 查找对应的<nav-file-title>
			const navFileTitleEl = navFileEl.querySelector(".nav-file-title[data-path]")
			if (!(navFileTitleEl instanceof HTMLElement)) {
				return;
			}
			// 检查文件类型
			const filePath = navFileTitleEl.dataset.path;
			if (!filePath) {
				return;
			}
			const file = this.plugin.app.vault.getAbstractFileByPath(filePath);
			if (!(file instanceof TFile)) {
				return;
			}
			const extension = file.extension.toLowerCase()
			const blockedExtensions = this.getBlockedExtensions()
			if (!blockedExtensions.includes(extension)) {
				return;
			}
			event.preventDefault();
			event.stopImmediatePropagation();
		}, {capture: true});
	}

	/**
	 * 获取当前配置的拦截文件类型
	 */
	private getBlockedExtensions(): string[] {
		const blockedFileExtensions = this.plugin.settings.blockedFileExtensions || ''
		return blockedFileExtensions.split(',').map((value) => {
			return value.trim().toLowerCase()
		});
	}
}
