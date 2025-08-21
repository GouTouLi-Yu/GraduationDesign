import { Player } from "../../core/model/player/Player";
import { GameConfig } from "../config/GameConfig";
import { DataStore } from "../dataStore/DataStore";

export class PlayerDataManager {
    static syncPlayerData(data) {
        Player.instance.syncData(data);
    }

    /** 保存数据到磁盘 */
    static saveDataToDisk(data) {
        DataStore.saveObjectData(GameConfig.playerAllDataKey, data);
        this.syncPlayerData(data);
    }

    /** 清空玩家所有数据（磁盘） */
    static clearPlayerAllDataFromDisk() {
        DataStore.removeData(GameConfig.playerAllDataKey);
    }

    /** 从磁盘获取玩家数据 */
    static getPlayerDataFromDisk() {
        let data = DataStore.getObjectData(GameConfig.playerAllDataKey);
        return data;
    }
}
