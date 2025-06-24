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
    constructor() {}

    protected _strength: number;
    /** 力量, 影响攻击力 初始为0, 每增加一点力量, 攻击力增加1 */
    get strength() {
        return this._strength;
    }

    protected _defense: number;
    /** 防御力, 影响护盾值 初始为0, 每增加一点防御力, 护盾值增加1 */
    get defense() {
        return this._defense;
    }

    protected _shield: number;

    hurt(params: ICharacterNCAParams) {
        let _params = params as ICharacterHurtParams;
        let damage = _params.value;
        let segment = _params.segment;
        if (_params.ignoreShield) {
            this.hurtForHP(damage, segment);
        } else {
            this.hurtForShield(damage, segment);
        }
    }

    addShield(params: ICharacterNCAParams) {
        let value = params.value;
        let segment = params.segment;
    }

    addHP(params: ICharacterNCAParams) {
        let value = params.value;
        let segment = params.segment;
    }

    addMP(params: ICharacterNCAParams) {
        let value = params.value;
        let segment = params.segment;
    }

    syncData(data: IBattleData) {
        if (data.strength != null) {
            this._strength += data.strength;
        }
        if (data.defense != null) {
            this._defense += data.defense;
        }
        if (data.shield != null) {
            this._shield += data.shield;
        }
    }

    /**
     * @param damage 伤害值
     * @param segment 攻击段数
     */
    private hurtForHP(damage: number, segment: number) {}

    private hurtForShield(damage: number, segment: number) {
        if (damage < this._shield) {
        }
    }
}
