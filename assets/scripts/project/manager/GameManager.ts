import { Player } from "../../core/model/player/Player";
import { DataStore } from "../dataStore/DataStore";

export interface IGameDataType {
    level?: number;
    gold?: number;
    energy?: number;
    itemIds: Array<string>;
}

const dataTypePreFix = "data_";

export enum EGameDataType {
    level = dataTypePreFix + "level",
    gold = dataTypePreFix + "gold",
    energy = dataTypePreFix + "energy",
    itemIds = dataTypePreFix + "itemIds",
}

export class GameManager {
    private static _player: Player;
    static init() {}

    static getPlayer() {
        if (this._player == null) {
            this._player = new Player();
        }
        return this._player;
    }

    private static syncData(data: any) {
        if (data.level != null) {
            this._player.syncData(data);
        }
    }

    /** 保存数据到磁盘 */
    static saveDataToDisk(data: IGameDataType) {
        if (data.level != null) {
            DataStore.saveNumData(EGameDataType.level, data.level);
        }
        if (data.gold != null) {
            DataStore.saveNumData(EGameDataType.gold, data.gold);
        }
        if (data.energy != null) {
            DataStore.saveNumData(EGameDataType.energy, data.energy);
        }
        if (data.itemIds != null) {
            for (let i = 0; i < data.itemIds.length; i++) {
                const itemId = data.itemIds[i];
                DataStore.saveStringData(EGameDataType.itemIds + i, itemId);
            }
        }
        this.syncData(data);
    }

    private static getItemIds(): Array<string> {
        let itemIds: Array<string> = [];
        let i = 0;
        let itemKey = EGameDataType.itemIds + i;
        while (DataStore.getStringData(itemKey) != null) {
            itemIds.push(DataStore.getStringData(itemKey));
            i++;
            itemKey = EGameDataType.itemIds + i;
        }
        return itemIds;
    }

    /** 从磁盘获取数据 */
    static getDataFromDisk() {
        const data: IGameDataType = {
            level: DataStore.getNumData(EGameDataType.level),
            gold: DataStore.getNumData(EGameDataType.gold),
            energy: DataStore.getNumData(EGameDataType.energy),
            itemIds: this.getItemIds(),
        };
    }
}
