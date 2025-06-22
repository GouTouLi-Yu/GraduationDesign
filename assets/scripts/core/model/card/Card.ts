import { ClassConfig } from "../../../project/config/ClassConfig";
import { ConfigReader } from "../../../project/ConfigReader/ConfigReader";
import { Character } from "../character/Character";
import { Strings } from "./../../../project/strings/Strings";

export interface IAttack {
    /**
     * @param val 伤害值
     * @param segment 攻击段数
     */
    excute: (targets: Array<Character>, val: number, segment: number) => void;
}

export interface IDefense {
    excute: (val: number) => void;
}

export enum ECardQuality {
    nomal = 1,
    rare, //稀有
    excellent, //优秀
    legend, //传说
}
export enum ECardType {
    /** 单体攻击 */
    attack_single = 1 << 0,
    /** 群体攻击 */
    attack_all = 1 << 1,
    /** 随机攻击 */
    attack_random = 1 << 2,
    /** 防御 --> 给自己加盾 */
    defense = 1 << 3,
    /** 恢复 --> 给自身回血 */
    recover = 1 << 4,
}

export enum ETargetType {
    self = 1,
    enemy_single,
    enemy_all,
    enemy_random,
}

export class Card {
    private _id: string;
    get id(): string {
        return this._id;
    }

    private _cardType: ECardType;
    get cardType(): ECardType {
        return this._cardType;
    }

    private _mpCost: Array<number>;
    get mpCost(): Array<number> {
        return this._mpCost;
    }

    private _name: string;
    get name(): string {
        return this._name;
    }

    private _targetType: ETargetType;
    /** 作用对象类型 */
    get targetType(): ETargetType {
        return this._targetType;
    }

    protected _targets: Array<Character>;
    /** 作用对象 */

    /** 卡牌描述 */
    private _desc: string;
    get desc(): string {
        return Strings.get(this._desc, {
            factor1: this._factors[0]?.[this._level - 1],
            factor2: this._factors[1]?.[this._level - 1],
            factor3: this._factors[2]?.[this._level - 1],
        });
    }

    private _buyPrice: number;
    get buyPrice(): number {
        return this._buyPrice;
    }

    private _upgradePrice: number;
    get upgradePrice(): number {
        return this._upgradePrice;
    }

    private _factors: Array<Array<number>>;
    get factors(): Array<Array<number>> {
        return this._factors;
    }

    private _level: number = 1;
    get level() {
        return this._level;
    }

    set level(level: number) {
        this._level = level;
    }

    constructor(id: string) {
        this._factors = [];
        this._targets = [];
        let cardConfig = ConfigReader.getDataById("CardConfig", id);
        this.syncData(cardConfig);
    }

    syncData(config: any) {
        this.setCardType(config);
        this._mpCost = config.mpCost;
        this._name = config.name;
        this._targetType = config.target;
        this._desc = config.desc;
        this._buyPrice = config.buyPrice;
        this._upgradePrice = config.upgradePrice;
        this.setFactors(config);
        this._id = config.id;
    }

    setCardType(config) {
        for (let i = 0; i < config.cardType.length; i++) {
            this._cardType |= config.cardType[i];
        }
    }

    setFactors(config) {
        let i = 1;
        let id = "factor" + i;
        while (config[id] != null) {
            this._factors.push(config[id]);
            i++;
            id = "factor" + i;
        }
    }

    excute(targets: Array<Character>) {
        this._targets = targets;
    }

    end() {
        this._targets = null;
    }
}
ClassConfig.addClass("Card", Card);
