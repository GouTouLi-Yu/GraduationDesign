import { CharacterPanel } from "../../view/character/CharacterPanel";
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
    private _characterPanel: CharacterPanel;
    constructor(charcterView: CharacterPanel) {
        this._characterPanel = charcterView;
    }
    /** 力量, 影响攻击力 初始为0, 每增加一点力量, 攻击力增加1 */
    strength: number;

    /** 防御力, 影响护盾值 初始为0, 每增加一点防御力, 护盾值增加1 */
    defense: number;
    /** 护盾值, 影响受到伤害时的减免值 初始为0, 每增加一点护盾值, 减免值增加1 */
    shield: number;

    private _buffsMap: Map<string, Buff>;
    get buffsMap() {
        return this._buffsMap;
    }

    addStrength(val: number) {
        this.strength += val;
    }
    addDefense(val: number) {
        this.defense += val;
    }
    addShield(val: number) {
        this.shield += val;
    }

    getFinalDamage(damage: number): number {
        // if (this.buffsMap.has()) return 0;
        return 0;
    }
}
