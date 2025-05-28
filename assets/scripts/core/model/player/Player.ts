import { _decorator } from "cc";
import { Injector } from "../../../project/Injector/Injector";
import { IPlayerDataType } from "../../../project/manager/GameManager";
import { Character } from "../character/Character";
import { ItemModel } from "../item/ItemModel";
const { ccclass, property } = _decorator;

export class Player extends Character {
    static _instance: Player;
    static get instance() {
        if (!this._instance) {
            this._instance = new Player();
        }
        return this._instance;
    }

    // 存放到磁盘中的数据
    private _quest: number;
    /** 关卡 */
    get quest() {
        return this._quest;
    }

    private _level: number;
    /** 等级 */
    get level() {
        return this._level;
    }

    private _name: string;
    get name() {
        return this._name;
    }

    private _gold: number;
    get gold() {
        return this._gold;
    }

    private _energy: number;
    get energy() {
        return this._energy;
    }

    private _itemModel: ItemModel;
    get itemModel() {
        return this._itemModel;
    }

    private _remainEnergy: number;
    get remainEnergy() {
        return this._remainEnergy;
    }

    initialize() {
        this._itemModel = Injector.getInstance(ItemModel);
        this._itemModel.initialize();
    }

    // 存放到内存中的数据

    syncData(data: IPlayerDataType) {
        if (data.level != null) {
            this._level = data.level ?? 1;
        }
        if (data.quest != null) {
            this._quest = data.quest ?? 1;
        }
        if (data.name != null) {
            this._name = data.name;
        }
        if (data.energy != null) {
            this._energy = data.energy;
        }
        if (data.remainEnergy != null) {
            this._remainEnergy = data.remainEnergy;
        }
        if (data.itemIds != null) {
            this._itemModel.syncData(data.itemIds);
        }
        if (data.gold != null) {
            this._gold = data.gold;
        }
        if (data.attack != null) {
            this._attack = data.attack;
        }
        if (data.defense != null) {
            this._defense = data.defense;
        }
        if (data.hp != null) {
            this._hp = data.hp;
        }
        if (data.remainHp != null) {
            this._remainHp = data.remainHp;
        }
    }

    syncDelData() {
        this._level = null;
        this._quest = null;
        this._name = "";
    }
}
