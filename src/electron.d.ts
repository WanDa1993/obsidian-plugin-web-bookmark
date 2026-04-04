declare module "electron" {

	/**
	 * "electron" 打开文件能力
	 */
	export const shell: {
		openPath(path: string): Promise<string>
	}

}
