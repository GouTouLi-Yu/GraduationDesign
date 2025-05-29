import { DataStore } from "../dataStore/DataStore";
import { Player } from "./../../core/model/player/Player";
import { UIManager } from "./UIManager";
export interface IPlayerDataType {
    level?: number;
    gold?: number;
    energy?: number;
    itemIds?: Array<string>;
    attack?: number;
    defense?: number;
    hp?: number;
    remainHp?: number;
    remainEnergy?: number;
    name?: string;
    quest?: number;
}

const dataTypePreFix = "data_";

export enum EGameDataType {
    level = dataTypePreFix + "level",
    gold = dataTypePreFix + "gold",
    energy = dataTypePreFix + "energy",
    itemIds = dataTypePreFix + "itemIds",
    attack = dataTypePreFix + "attack",
    defense = dataTypePreFix + "defense",
    hp = dataTypePreFix + "hp",
    remainHp = dataTypePreFix + "remainHp",
    remainEnergy = dataTypePreFix + "remainEnergy",
    name = dataTypePreFix + "name",
    quest = dataTypePreFix + "quest",
}

export class GameManager {
    private static _player: Player;
    static init() {
        Player.instance.initialize();
        this._player = Player.instance;
    }

    static syncPlayerData(data: IPlayerDataType) {
        Player.instance.syncData(data);
    }

    /** 保存数据到磁盘 */
    static saveDataToDisk(data: IPlayerDataType) {
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
        if (data.attack != null) {
            DataStore.saveNumData(EGameDataType.attack, data.attack);
        }
        if (data.defense != null) {
            DataStore.saveNumData(EGameDataType.defense, data.defense);
        }
        if (data.hp != null) {
            DataStore.saveNumData(EGameDataType.hp, data.hp);
        }
        if (data.remainHp != null) {
            DataStore.saveNumData(EGameDataType.remainHp, data.remainHp);
        }
        if (data.remainEnergy != null) {
            DataStore.saveNumData(
                EGameDataType.remainEnergy,
                data.remainEnergy
            );
        }
        if (data.name != null) {
            DataStore.saveStringData(EGameDataType.name, data.name);
        }
        if (data.quest != null) {
            DataStore.saveNumData(EGameDataType.quest, data.quest);
        }

        this.syncPlayerData(data);
    }

    static clearPlayerAllDataFromDisk() {
        DataStore.removeData(EGameDataType.level);
        DataStore.removeData(EGameDataType.gold);
        DataStore.removeData(EGameDataType.energy);
        let i = 0;
        let itemKey = EGameDataType.itemIds + i;
        while (DataStore.getStringData(itemKey) != null) {
            DataStore.removeData(itemKey);
            i++;
            itemKey = EGameDataType.itemIds + i;
        }
        DataStore.removeData(EGameDataType.attack);
        DataStore.removeData(EGameDataType.defense);
        DataStore.removeData(EGameDataType.hp);
        DataStore.removeData(EGameDataType.remainHp);
        DataStore.removeData(EGameDataType.remainEnergy);
        DataStore.removeData(EGameDataType.name);
        DataStore.removeData(EGameDataType.quest);

        this._player.clearAll();
    }

    static startGame() {
        UIManager.gotoView("MainMenuView");
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

    /** 从磁盘获取玩家数据 */
    static getPlayerDataFromDisk(): IPlayerDataType {
        const data: IPlayerDataType = {
            level: DataStore.getNumData(EGameDataType.level),
            gold: DataStore.getNumData(EGameDataType.gold),
            energy: DataStore.getNumData(EGameDataType.energy),
            itemIds: this.getItemIds(),
            attack: DataStore.getNumData(EGameDataType.attack),
            defense: DataStore.getNumData(EGameDataType.defense),
            hp: DataStore.getNumData(EGameDataType.hp),
            remainHp: DataStore.getNumData(EGameDataType.remainHp),
            remainEnergy: DataStore.getNumData(EGameDataType.remainEnergy),
            name: DataStore.getStringData(EGameDataType.name),
            quest: DataStore.getNumData(EGameDataType.quest),
        };
        return data;
    }
}
