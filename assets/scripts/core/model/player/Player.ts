import { _decorator } from "cc";
import { Injector } from "../../../project/Injector/Injector";
import { IPlayerDataType } from "../../../project/manager/GameManager";
import { ItemModel } from "../item/ItemModel";
import { PlayerPrototype } from "./PlayerPrototype";
const { ccclass, property } = _decorator;

export class Player extends PlayerPrototype {
    static _instance: Player;
    static get instance() {
        if (!this._instance) {
            this._instance = new Player();
        }
        return this._instance;
    }

    private constructor() {
        super();
    }

    private _itemModel: ItemModel;
    get itemModel() {
        return this._itemModel;
    }

    initialize() {
        this._itemModel = Injector.getInstance(ItemModel);
        this._itemModel.initialize();
    }

    // 存放到内存中的数据

    syncData(data: IPlayerDataType) {
        super.syncData(data);
        console.log("玩家数据同步：", data);
        if (data.itemIds != null) {
            this._itemModel.syncData(data.itemIds);
        }
    }

    syncDelData(data: IPlayerDataType) {
        console.log("玩家数据删除：", data);
        this._itemModel.syncDelData(data.itemIds);
    }

    clearAll() {
        super.clearAll();
        this._itemModel.clearAll();
    }

    print() {
        console.log("玩家数据：", this);
    }
}
