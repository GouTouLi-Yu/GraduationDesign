import { GameConfig } from "../config/GameConfig";
import { DataStore } from "../dataStore/DataStore";

export class PlayerDataManager {
    /** 保存数据到磁盘 */
    static saveDataToDisk(data: any, key?: string) {
        const dataKey = key || GameConfig.playerAllDataKey;
        DataStore.saveObjectData(dataKey, data);
    }

    /** 清空玩家所有数据（磁盘） */
    static clearPlayerAllDataFromDisk(key?: string) {
        const dataKey = key || GameConfig.playerAllDataKey;
        DataStore.removeData(dataKey);
    }

    /** 从磁盘获取玩家数据 */
    static getPlayerDataFromDisk(key?: string) {
        const dataKey = key || GameConfig.playerAllDataKey;
        let data = DataStore.getObjectData(dataKey);
        return data;
    }
}
