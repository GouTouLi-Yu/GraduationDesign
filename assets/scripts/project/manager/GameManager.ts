import { GameConfig } from "../config/GameConfig";
import { DataStore } from "../dataStore/DataStore";
import { Player } from "./../../core/model/player/Player";
import { UIManager } from "./UIManager";

export class GameManager {
    private static _player: Player;
    static init() {
        Player.instance.initialize();
        this._player = Player.instance;
    }

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

    static startGame() {
        let data = this.getPlayerDataFromDisk();
        this._player.syncData(data);
        UIManager.gotoView("MainMenuView");
    }

    /** 从磁盘获取玩家数据 */
    static getPlayerDataFromDisk() {
        let data = DataStore.getObjectData(GameConfig.playerAllDataKey);
        return data;
    }
}
