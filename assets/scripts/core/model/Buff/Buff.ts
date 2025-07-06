import { ConfigReader } from "../../../project/ConfigReader/ConfigReader";

export enum EBuffType {
    /** 易伤 */
    vulnerability = "vulnerability",
    /** 虚弱 */
    weakness = "weakness",
}

export enum EBuffTargetType {
    /** 己方 */
    self = 1,
    /** 敌方 */
    enemy,
}

export class Buff {
    private _id: string;
    private _remainRound: number = 0;
    /** 剩余回合数 */
    get remainRound(): number {
        return this._remainRound;
    }
    set remainRound(value: number) {
        this._remainRound = value;
    }

    get value(): number {
        return this._level == 1 ? this.cfg.level1Factor : this.cfg.level2Factor;
    }

    /** 最大持续回合数 */
    get maxRound(): number {
        return this._level == 1 ? this.cfg.level1Round : this.cfg.level2Round;
    }

    get type(): EBuffType {
        let buffId: string = this._id;
        let buffTypeName = buffId.split("_")[1];
        return buffTypeName as EBuffType;
    }

    get desc() {
        return this.cfg._desc;
    }

    private _name: string;
    get name() {
        return this._name;
    }

    private _level: number = 1;
    get level() {
        return this._level;
    }

    set level(val: number) {
        this._level = Math.max(2, val);
    }

    private _targetType: EBuffTargetType;
    get targetType() {
        return this._targetType;
    }

    constructor(id: string, level: number) {
        this._id = id;
        this._level = level;
    }

    private get cfg() {
        return ConfigReader.getDataById("BuffConfig", this._id);
    }

    clear() {
        this._remainRound = 0;
    }
}
