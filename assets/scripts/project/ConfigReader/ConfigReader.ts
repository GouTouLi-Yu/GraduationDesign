import { _decorator } from "cc";
import { MyResManager } from "./../manager/ResManager";
const { ccclass, property } = _decorator;

export type DeepReadonly<T> = {
    readonly [P in keyof T]: T[P] extends object ? DeepReadonly<T[P]> : T[P];
};
export class ConfigReader {
    private static deepFreeze<T>(obj: T): DeepReadonly<T> {
        Object.freeze(obj);
        for (const key in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, key)) {
                const value = obj[key];
                if (typeof value === "object" && value !== null) {
                    this.deepFreeze(value);
                }
            }
        }
        return obj as DeepReadonly<T>;
    }

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
                resolve();
            });
        });
    }

    static getDataByIdAndKey(tableName: string, id: string, key: string): any {
        let data = this.getDataById(tableName, id);
        if (!data) {
            return null;
        }
        const val = data[key];
        return this.deepFreeze(val);
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
        return this.deepFreeze(table.get(id));
    }

    static getAllId(tableName: string): IterableIterator<string> | undefined {
        return this._configMap.get(tableName)?.keys();
    }

    static getData(tableName: string): Map<string, any> | undefined {
        return this._configMap.get(tableName);
    }
}
