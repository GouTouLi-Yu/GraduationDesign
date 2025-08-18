import { _decorator, sys } from "cc";
const { ccclass, property } = _decorator;

export class DataStore {
    static saveNumData(key: string, value: number) {
        sys.localStorage.setItem(key, value);
    }

    static getNumData(key: string): number {
        return sys.localStorage.getItem(key);
    }

    static saveStringData(key: string, value: string) {
        sys.localStorage.setItem(key, value);
    }

    static getStringData(key: string): string {
        return sys.localStorage.getItem(key);
    }

    static saveObjectData(key: string, value: Object) {
        let jsonStr = JSON.stringify(value);
        sys.localStorage.setItem(key, jsonStr);
    }

    static getObjectData(key: string): Object {
        let jsonStr = sys.localStorage.getItem(key);
        return JSON.parse(jsonStr) ?? {};
    }

    static removeData(key: string) {
        sys.localStorage.removeItem(key);
    }
}
