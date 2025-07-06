import { _decorator } from "cc";
import { Injector } from "../../../project/Injector/Injector";
import { IPlayerDataType } from "../../../project/manager/GameManager";
import { CardModel } from "../card/CardModel";
import { PlayerPrototype } from "./PlayerPrototype";
const { ccclass, property } = _decorator;

export class Player extends PlayerPrototype {
    private static _instance: Player;
    static get instance() {
        if (!this._instance) {
            this._instance = new Player();
        }
        return this._instance;
    }

    private constructor() {
        super();
    }

    private _cardModel: CardModel;
    get cardModel() {
        return this._cardModel;
    }

    /** 玩家可以修改最大生命值 */
    set hp(val: number) {
        this._hp = val;
    }

    initialize() {
        super.initialize();
        this._cardModel = Injector.getInstance(CardModel);
        this._cardModel.initialize();
    }

    // 存放到内存中的数据

    syncData(data: IPlayerDataType) {
        super.syncData(data);
        console.log("玩家数据同步：", data);
        if (data.cardIds != null) {
            this._cardModel.syncData(data.cardIds);
        }
    }

    syncDelData(data: IPlayerDataType) {
        console.log("玩家数据删除：", data);
        this._cardModel.syncDelData(data.cardIds);
    }

    clearAll() {
        super.clearAll();
        this._cardModel.clearAll();
    }

    print() {
        console.log("玩家数据：", this);
    }
}
