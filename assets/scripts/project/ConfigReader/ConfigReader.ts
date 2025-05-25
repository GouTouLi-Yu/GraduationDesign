import { _decorator } from "cc";
import { MyResManager } from "./../manager/ResManager";
const { ccclass, property } = _decorator;

export class ConfigReader {
    // configName --> id --> data
    private static _configMap: Map<string, Map<string, any>>;
    static init() {
        this._configMap = new Map();
    }

    static initConfig() {
        return new Promise<void>((resolve, reject) => {
            console.log("开始加载配置文件");
            MyResManager.loadConfig("config").then((jsonArr) => {
                jsonArr.forEach((json) => {
                    let _data = json.json;
                    let map = new Map<string, any>();
                    for (let i = 0; i < _data.length; i++) {
                        let data = _data[i];
                        map.set(data.id, data);
                    }
                    this._configMap.set(json.name, map);
                });
                resolve();
            });
        });
    }

    static getDataByIdAndKey(tableName: string, id: string, key: string) {
        let data = this.getDataById(tableName, id);
        if (!data) {
            return null;
        }
        return this._configMap.get(tableName).get(id)[key];
    }

    static getDataById(tableName: string, id: string) {
        if (!this._configMap.has(tableName)) {
            console.error(`[ConfigReader] 未找到配置表: ${tableName}`);
            return null;
        }
        if (!this._configMap.get(tableName).has(id)) {
            console.error(
                `[ConfigReader] 未找到配置表: ${tableName} 的 id: ${id}`
            );
        }
        return this._configMap.get(tableName).get(id);
    }

    static getAllId(tableName: string) {
        return this._configMap.get(tableName)?.keys();
    }
}
