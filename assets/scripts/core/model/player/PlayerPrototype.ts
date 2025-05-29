import { IPlayerDataType } from "../../../project/manager/GameManager";
import { Character } from "../character/Character";

export class PlayerPrototype extends Character {
    // 存放到磁盘中的数据
    protected _quest: number;
    /** 关卡 */
    get quest() {
        return this._quest;
    }

    protected _level: number;
    /** 等级 */
    get level() {
        return this._level;
    }

    protected _name: string;
    get name() {
        return this._name;
    }

    protected _gold: number;
    get gold() {
        return this._gold;
    }

    protected _energy: number;
    get energy() {
        return this._energy;
    }

    protected _remainEnergy: number;
    get remainEnergy() {
        return this._remainEnergy;
    }

    syncData(data: IPlayerDataType): void {
        if (data.level != null) {
            this._level = data.level;
        }
        if (data.quest != null) {
            this._quest = data.quest;
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

    clearAll(): void {
        this._level = null;
        this._quest = null;
        this._name = null;
        this._energy = null;
        this._remainEnergy = null;
        this._gold = null;
        this._attack = null;
        this._defense = null;
        this._hp = null;
        this._remainHp = null;
    }
}
