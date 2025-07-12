import { ConfigReader } from "../../project/ConfigReader/ConfigReader";

export class BuffHelper {
    static getBuffFactor(buffId: string, level: number): number {
        let key = level == 1 ? "level1Factor" : "level2Factor";
        return ConfigReader.getDataByIdAndKey("BuffConfig", buffId, key);
    }
}
