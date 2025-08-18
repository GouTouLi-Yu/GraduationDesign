import { _decorator } from "cc";
import { Injector } from "../../../project/Injector/Injector";
import { ECharacterAttrKey } from "../battle/BattleCharacter";
import { BattleModel } from "../battle/BattleModel";
import { Card } from "../card/Card";
import { CardModel } from "../card/CardModel";
import { Model } from "../Model";
import { QuestModel } from "../quest/QuestModel";
const { ccclass, property } = _decorator;

export class Player extends Model {
    private _battleModel: BattleModel;
    get battleModel() {
        return this._battleModel;
    }

    private _cardModel: CardModel;
    get cardModel() {
        return this._cardModel;
    }

    private _questModel: QuestModel;
    get questModel() {
        return this._questModel;
    }

    private _level: number = 0;
    /** 等级 */
    get level() {
        return this._level;
    }

    private _name: string = "";
    get name() {
        return this._name;
    }

    private _gold: number = 0;
    get gold() {
        return this._gold;
    }

    private static _instance: Player;
    static get instance() {
        if (!this._instance) {
            this._instance = new Player();
        }
        return this._instance;
    }

    get allCards(): Array<Card> {
        return this._cardModel.cards;
    }

    getAttrkey(key: ECharacterAttrKey) {
        return this._battleModel.battlePlayerCharacter.getAttr(key);
    }

    get battlePlayerCharacter() {
        return this._battleModel.battlePlayerCharacter;
    }

    initialize() {
        this._cardModel = Injector.getInstance(CardModel);
        this._battleModel = Injector.getInstance(BattleModel);
        this._questModel = Injector.getInstance(QuestModel);
    }

    // 存放到内存中的数据

    syncData(data: any) {
        console.log("玩家数据同步：", data);
        if (data.level != null) {
            this._level = data.level;
        }
        if (data.name != null) {
            this._name = data.name;
        }
        if (data.gold != null) {
            this._gold = data.gold;
        }
        if (data.battleModelData != null) {
            this._battleModel.syncData(data.battleModelData);
        }
        if (data.cardModelData != null) {
            this._cardModel.syncData(data.cardModelData);
        }
        if (data.questModelData != null) {
            this._questModel.syncData(data.questModelData);
        }
    }

    syncDelData(data) {
        console.log("玩家数据删除：", data);
        if (data.questModelData != null) {
            this._questModel.syncDelData(data.questModelData);
        }
        if (data.battleModelData != null) {
            this._battleModel.syncDelData(data.battleModelData);
        }
        if (data.cardModelData != null) {
            this._cardModel.syncDelData(data.cardModelData);
        }
    }

    print() {
        console.log("玩家数据：", this);
    }
}
