import { _decorator } from "cc";
const { ccclass, property } = _decorator;

@ccclass("ConfigReader")
export class ConfigReader {
    private static _configMap: Map<string, any>;
    static init() {}
}
