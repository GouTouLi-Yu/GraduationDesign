import { ConfigReader } from "../../../project/ConfigReader/ConfigReader";

export enum EBuffEffectType {
    yiShang = 1,
    xuRuo,
}

export class BuffEffect {
    private _id: string;
    private _val: number;
    private _round1: number = 0;
    private _round2: number = 0;
    private _remainRound: number = 0;
    private _type: EBuffEffectType;
    private _desc: string;
    private _name: string;
    private _level: number = 1;

    constructor(id: string, level: number) {
        this._id = id;
        this._level = level;
        this.initialize();
    }

    private get config() {
        return ConfigReader.getDataById("BuffEffectConfig", this._id);
    }

    get round(): number {
        return this._level == 1 ? this._round1 : this._round2;
    }

    initialize() {
        this._round1 = this.config.round1;
        this._round2 = this.config.round2;
        this._type = this.config.type;
        this._desc = this.config.desc;
        this._val = this.config.val;
        this._remainRound = this.round;
    }

    get val() {
        return this._val;
    }

    get remainRound() {
        return this._remainRound;
    }

    decreaseRound() {
        this._remainRound--;
    }

    resetRound() {
        this._remainRound = this.round;
    }

    clear() {
        this._remainRound = 0;
    }

    increaseRound(round: number = 1) {
        this._remainRound += round;
    }
}
