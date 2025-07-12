import { ClassConfig } from "../../../project/config/ClassConfig";
import { PCEventType } from "../../../project/event/EventType";
import { EventManager } from "../../../project/manager/EventManager";
import {
    Battle,
    ICharacterHurtParams,
    ICharacterNCAParams,
} from "../battle/Battle";

export abstract class Character {
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

    constructor() {}

    syncData(data: any) {
        if (data.hp != null) {
            this._hp = data.hp;
        }
        if (data.remainHp != null) {
            this._remainHp = data.remainHp;
        }
    }

    initialize() {}

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

    addHP(params: ICharacterNCAParams) {
        let value = params.value;
        let segment = params.segment;
    }

    addMP(params: ICharacterNCAParams) {
        let value = params.value;
        let segment = params.segment;
    }

    abstract getBattleData(): Battle;

    /**
     * @param damage 伤害值
     * @param segment 攻击段数
     */
    private hurtForHP(damage: number, segment: number) {
        damage = this.getBattleData().getFinalDamage(damage);
        this._remainHp -= damage;
        EventManager.dispatchEvent(PCEventType.EVT_CHARACTER_REDUCE_REMAIN_HP, {
            character: this,
            damage: damage,
            segment: segment,
        });
    }

    private hurtForShield(damage: number, segment: number) {
        let battleData = this.getBattleData();
        if (damage < battleData.shield) {
            // 播放护盾减少动画
        } else if (damage == battleData.shield) {
            // 播放破盾动画
        } else {
            // 播放破盾动画
            // 播放掉血动画

            let remainDamage = damage - battleData.shield;
            this.hurtForHP(remainDamage, segment);
        }
    }
}
ClassConfig.addClass("Character", Character);
