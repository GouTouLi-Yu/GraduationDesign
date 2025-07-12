import { Buff } from "../Buff/Buff";

/** normal change attributes params */
export interface ICharacterNCAParams {
    value: number;
    segment: number;
}

export interface ICharacterHurtParams extends ICharacterNCAParams {
    /** 无视护盾 */
    ignoreShield?: boolean;
}

export interface IBattleData {
    strength?: number;
    defense?: number;
    shield?: number;
}

/** 作用目标类型 */
export enum ETargetNumType {
    single = 1,
    random,
    all,
}

export class Battle {
    /** 力量, 影响攻击力 初始为0, 每增加一点力量, 攻击力增加1 */
    private _strength: number = 0;
    get strength() {
        return this._strength;
    }

    /** 防御力, 影响护盾值 初始为0, 每增加一点防御力, 护盾值增加1 */
    private _defense: number = 0;
    get defense() {
        return this._defense;
    }

    /** 护盾值, 影响受到伤害时的减免值 初始为0, 每增加一点护盾值, 减免值增加1 */
    private _shield: number = 0;
    get shield() {
        return this._shield;
    }

    private _buffsMap: Map<string, Buff>;
    get buffsMap() {
        return this._buffsMap;
    }

    addStrength(val: number) {
        this._strength += val;
    }

    addDefense(val: number) {
        this._defense += val;
    }
    addShield(val: number) {
        this._shield += val;
    }

    reduceShield(val: number) {
        this._shield -= val;
    }

    reduceStrength(val: number) {
        this._strength -= val;
    }

    reduceDefense(val: number) {
        this._defense -= val;
    }

    constructor() {
        this._buffsMap = new Map<string, Buff>();
    }

    syncData(data: IBattleData) {
        if (data.strength != null) {
            this._strength = data.strength;
        }
        if (data.defense != null) {
            this._defense = data.defense;
        }
        if (data.shield != null) {
            this._shield = data.shield;
        }
    }

    getFinalDamage(damage: number): number {
        // if (this.buffsMap.has()) return 0;
        return damage;
    }
}
