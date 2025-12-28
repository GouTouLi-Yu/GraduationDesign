import { sys } from "cc";

export class DataStore {
    static saveNumData(key: string, value: number) {
        sys.localStorage.setItem(key, value.toString());
    }

    static getNumData(key: string): number {
        const value = sys.localStorage.getItem(key);
        if (value === null || value === undefined) {
            return 0;
        }
        const num = parseFloat(value);
        return isNaN(num) ? 0 : num;
    }

    static saveStringData(key: string, value: string) {
        sys.localStorage.setItem(key, value);
    }

    static getStringData(key: string): string | null {
        return sys.localStorage.getItem(key);
    }

    static saveObjectData(key: string, value: Object) {
        try {
            let jsonStr = JSON.stringify(value);
            console.log("向磁盘保存数据：", value);
            sys.localStorage.setItem(key, jsonStr);
        } catch (error) {
            console.error(`[DataStore] Failed to save object data for key ${key}:`, error);
        }
    }

    static getObjectData(key: string): Object {
        try {
            let jsonStr = sys.localStorage.getItem(key);
            if (!jsonStr) {
                return {};
            }
            return JSON.parse(jsonStr) ?? {};
        } catch (error) {
            console.error(`[DataStore] Failed to parse object data for key ${key}:`, error);
            return {};
        }
    }

    static removeData(key: string) {
        sys.localStorage.removeItem(key);
    }

    static removeAllData() {
        sys.localStorage.clear();
    }
}
