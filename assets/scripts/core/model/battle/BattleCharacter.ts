import { ClassConfig } from "../../../project/config/ClassConfig";
import { PCEventType } from "../../../project/event/EventType";
import { EventManager } from "../../../project/manager/EventManager";
import { Buff } from "../Buff/Buff";

export enum ECharacterAttrKey {
    hp = "hp",
    remainHp = "remainHp",
    strength = "strength",
    defense = "defense",
    shield = "shield",
    mp = "mp",
}

export enum ETargetNumType {
    single = 1,
    random = 0,
    all = 999,
}

export interface ICharacterHurtParams {
    value: number;
    segment: number;
    ignoreShield?: boolean;
}

export class BattleCharacter {
    // --------------------------------------------------------------------------------------- 内存长久保存 ---------------------------------------------------------------------------------------
    protected _hp: number = 0;
    /** 最大生命值 */
    get hp() {
        return this._hp;
    }

    protected _remainHp: number = 0;
    /** 剩余生命值 */
    get remainHp() {
        return this._remainHp;
    }

    // ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

    // ---------------------------------------------------------------------------------------- 临时战斗数据 ----------------------------------------------------------------------------------------
    /** 力量, 影响攻击力 初始为0, 每增加一点力量, 攻击力增加1 */
    protected _strength: number = 0;
    get strength() {
        return this._strength;
    }

    /** 防御力, 影响护盾值 初始为0, 每增加一点防御力, 护盾值增加1 */
    protected _defense: number = 0;
    get defense() {
        return this._defense;
    }

    /** 护盾值, 影响受到伤害时的减免值 初始为0, 每增加一点护盾值, 减免值增加1 */
    protected _shield: number = 0;
    get shield() {
        return this._shield;
    }

    private _buffList: Array<Buff>;
    get buffList() {
        return this._buffList;
    }
    // ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

    constructor() {
        this._buffList = [];
    }

    getAttr(key: ECharacterAttrKey): number {
        return this["_" + key];
    }

    addAttrKeyVal(key: ECharacterAttrKey, val: number) {
        let attr = this.getAttr(key);
        attr += val;
    }

    reduceAttrKeyVal(key: ECharacterAttrKey, val: number) {
        let attr = this.getAttr(key);
        attr -= val;
    }

    addBuff(buff: Buff) {
        this._buffList.push(buff);
    }

    removeBuff(buff: Buff) {
        let index = this._buffList.findIndex((item) => item.id == buff.id);
        if (index == -1) return;
        this._buffList.splice(index, 1);
    }

    syncData(data) {
        if (data.hp != null) {
            this._hp = data.hp;
        }
        if (data.remainHp != null) {
            this._remainHp = data.remainHp;
        }
        if (data.strength != null) {
            this._strength = data.strength;
        }
        if (data.defense != null) {
            this._defense = data.defense;
        }
        if (data.shield != null) {
            this._shield = data.shield;
        }
        if (data.buffList != null) {
            this._buffList = data.buffList;
        }
    }

    initialize() {}

    getFinalDamage(damage: number): number {
        // if (this.buffsMap.has()) return 0;
        return damage;
    }

    hurt(params: ICharacterHurtParams) {
        let damage = params.value;
        let segment = params.segment;
        if (params.ignoreShield) {
            this.hurtForHP(damage, segment);
        } else {
            this.hurtForShield(damage, segment);
        }
    }

    addHP(params: ICharacterHurtParams) {
        let value = params.value;
        let segment = params.segment;
        this.addAttrKeyVal(ECharacterAttrKey.remainHp, value);
    }

    addMP(params: ICharacterHurtParams) {
        let value = params.value;
        let segment = params.segment;
    }

    /**
     * @param damage 伤害值
     * @param segment 攻击段数
     */
    private hurtForHP(damage: number, segment: number) {
        damage = this.getFinalDamage(damage);
        this.reduceAttrKeyVal(ECharacterAttrKey.remainHp, damage);
        EventManager.dispatchEvent(PCEventType.EVT_CHARACTER_REDUCE_REMAIN_HP, {
            character: this,
            damage: damage,
            segment: segment,
        });
    }

    private hurtForShield(damage: number, segment: number) {
        if (damage < this._shield) {
            // 播放护盾减少动画
        } else if (damage == this._shield) {
            // 播放破盾动画
        } else {
            // 播放破盾动画
            // 播放掉血动画
            let remainDamage = damage - this._shield;
            this.hurtForHP(remainDamage, segment);
        }
    }

    clear() {
        this._strength = 0;
        this._defense = 0;
        this._shield = 0;
        this._buffList.length = 0;
    }
}
ClassConfig.addClass("Character", BattleCharacter);
