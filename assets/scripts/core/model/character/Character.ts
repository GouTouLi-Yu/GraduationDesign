import { ClassConfig } from "../../../project/config/ClassConfig";
import { CharacterPanel } from "../../view/character/CharacterPanel";
import {
    Battle,
    ICharacterHurtParams,
    ICharacterNCAParams,
} from "../battle/Battle";

export class Character {
    protected _hp: number;
    /** 最大生命值 */
    get hp() {
        return this._hp;
    }

    protected _remainHp: number;
    /** 剩余生命值 */
    get remainHp() {
        return this._remainHp;
    }
    set remainHp(val: number) {
        this._remainHp = val;
    }

    protected _battleData: Battle;

    get battleData() {
        return this._battleData;
    }

    constructor(charcterPanel: CharacterPanel) {
        this._battleData = new Battle(charcterPanel);
    }

    syncData(data: any) {
        if (data.hp != null) {
            this._hp = data.hp;
        }
        if (data.remainHp != null) {
            this._remainHp = data.remainHp;
        }
    }

    initialize() {}

    clearBattleData() {
        this._battleData = null;
    }

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

    /**
     * @param damage 伤害值
     * @param segment 攻击段数
     */
    private hurtForHP(damage: number, segment: number) {
        damage = this.battleData.getFinalDamage(damage);
        this._remainHp -= damage;
    }

    private hurtForShield(damage: number, segment: number) {
        if (damage < this.battleData.shield) {
            // 播放护盾减少动画
        } else if (damage == this.battleData.shield) {
            // 播放破盾动画
        } else {
            // 播放破盾动画
            // 播放掉血动画

            let remainDamage = damage - this.battleData.shield;
            this.battleData.shield = 0;
            this.hurtForHP(remainDamage, segment);
        }
    }
}
ClassConfig.addClass("Character", Character);
