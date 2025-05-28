import { _decorator } from "cc";
import { ClassConfig } from "../../../project/config/ClassConfig";
const { ccclass, property } = _decorator;

export class Character {
    protected _attack: number;
    protected _defense: number;
    protected _hp: number;
    protected _remainHp: number;

    syncData(data: any) {
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
}
ClassConfig.addClass("Character", Character);
