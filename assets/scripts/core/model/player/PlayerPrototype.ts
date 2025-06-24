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

    protected _mp: number;
    get mp() {
        return this._mp;
    }

    protected _remainMp: number;
    get remainMp() {
        return this._remainMp;
    }

    initialize(): void {
        super.initialize();
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
        if (data.mp != null) {
            this._mp = data.mp;
        }
        if (data.remainMp != null) {
            this._remainMp = data.remainMp;
        }
        if (data.gold != null) {
            this._gold = data.gold;
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
        this._mp = null;
        this._remainMp = null;
        this._gold = null;
        this._hp = null;
        this._remainHp = null;
    }
}
