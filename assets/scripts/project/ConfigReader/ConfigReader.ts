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
            MyResManager.loadConfig("config").then((jsonArr) => {
                jsonArr.forEach((json) => {
                    let _data = json.json;
                    let map = new Map<string, any>();
                    for (let i = 0; i < _data.length; i++) {
                        let data = _data[i];
                        map.set(data.id, Object.freeze(data));
                    }
                    this._configMap.set(json.name, Object.freeze(map));
                });
                this._configMap = Object.freeze(this._configMap);
                resolve();
            });
        });
    }

    static getDataByIdAndKey(tableName: string, id: string, key: string) {
        let data = this.getDataById(tableName, id);
        if (!data) {
            return null;
        }
        return data[key];
    }

    static getDataById(tableName: string, id: string): any {
        if (!this._configMap.has(tableName)) {
            console.error(`[ConfigReader] 未找到配置表: ${tableName}`);
            return null;
        }
        const table = this._configMap.get(tableName);
        if (!table.has(id)) {
            console.error(
                `[ConfigReader] 未找到配置表: ${tableName} 的 id: ${id}`
            );
            return null;
        }
        return table.get(id);
    }

    static getAllId(tableName: string): IterableIterator<string> {
        return this._configMap.get(tableName)?.keys();
    }
}
