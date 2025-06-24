import { ClassConfig } from "../../../project/config/ClassConfig";
import { ConfigReader } from "../../../project/ConfigReader/ConfigReader";
import { ETargetNumType } from "../battle/Battle";
import { Character } from "../character/Character";
import { Player } from "../player/Player";
import { AttackStrategy } from "../strategy/AttackStrategy";
import { INCASParams } from "../strategy/NormalChangeAttrisStrategy";
import { Strategy } from "../strategy/Strategy";

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

export enum EActionType {
    attack = "attack",
    defense = "defense",
    recover = "recover",
}

export abstract class Card {
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

    private _targetNumType: ETargetNumType;
    /** 作用对象类型 */
    get targetNumType(): ETargetNumType {
        return this._targetNumType;
    }

    private _targets: Array<Character>;
    private _executor: Character;

    private _level1Segment: Array<number>;
    private _level2Segment: Array<number>;

    /** 卡牌描述 */
    private _desc: string;
    get desc(): string {
        return "";
    }

    private _buyPrice: number;
    get buyPrice(): number {
        return this._buyPrice;
    }

    private _upgradePrice: number;
    get upgradePrice(): number {
        return this._upgradePrice;
    }

    private _level: number = 1;
    get level() {
        return this._level;
    }

    set level(level: number) {
        this._level = level;
    }

    /** 行为id数组 */
    private _actionIds: Array<string>;
    /** 策略数组, 和行为id 一一对应 */
    private _strategise: Array<Strategy>;

    private _level1Factor: Array<number>;
    private _level2Factor: Array<number>;

    private _needChooseTarget: boolean;
    /** 是否需要选中对象 */
    get needChooseTarget(): boolean {
        return this._needChooseTarget;
    }

    private _chooseIndex: number;
    /** 选中的目标索引 */
    get chooseIndex(): number {
        return this._chooseIndex;
    }
    set chooseIndex(index: number) {
        this._chooseIndex = index;
    }

    /**
     *
     * @param {Array<Character>} targets : 需要传全部的作用对象
     */
    constructor(id: string, targets: Array<Character>) {
        this._targets = targets;
        this._executor = Player.instance;
        this._chooseIndex = -1;
        let cardConfig = ConfigReader.getDataById("CardConfig", id);
        this.syncData(cardConfig);
    }

    syncData(config: any) {
        this.setCardType(config);
        this._mpCost = config.mpCost;
        this._name = config.name;
        this.setTargetType(config.targetNum);
        this._desc = config.desc;
        this._buyPrice = config.buyPrice;
        this._upgradePrice = config.upgradePrice;
        this._id = config.id;
        this._level1Factor = config.level1Factor;
        this._level2Factor = config.level2Factor;
        this._level1Segment = config.level1Segment;
        this._level2Segment = config.level2Segment;
        this._actionIds = config.actionIds;
        this._needChooseTarget = config.needChooseTarget;
        this.setStrategise();
    }

    setTargetType(targetNum: number) {
        if (targetNum == 999) {
            this._targetNumType = ETargetNumType.all;
        } else if (targetNum == 1) {
            this._targetNumType = ETargetNumType.single;
        } else {
            this._targetNumType = ETargetNumType.random;
        }
    }

    /** 获取属性值（攻击、防御、恢复等） */
    private getFactor(index: number): number {
        if (this._level == 1 || !this._level2Factor[index]) {
            return this._level1Factor[index];
        }
        return this._level2Factor[index];
    }

    private getSegment(index: number): number {
        if (this._level == 1 || !this._level2Segment[index]) {
            return this._level1Segment[index];
        }
        return this._level2Segment[index];
    }

    private setStrategise() {
        this._strategise = [];
        for (let i = 0; i < this._actionIds.length; i++) {
            let actionId = this._actionIds[i];
            switch (actionId) {
                case EActionType.attack:
                    let params: INCASParams = {
                        excutor: this._executor,
                        targets: this._targets,
                        value: this.getFactor(i),
                        segment: this.getSegment(i),
                        targetNumType: this.targetNumType,
                        chooseIndex: this._chooseIndex,
                    };
                    let attackStrategy = new AttackStrategy(params);
                    this._strategise.push(attackStrategy);
                    break;
                case EActionType.defense:
                    break;
                case EActionType.recover:
                    break;
            }
        }
    }

    private setCardType(config) {
        for (let i = 0; i < config.cardType.length; i++) {
            this._cardType |= config.cardType[i];
        }
    }

    excute(excutor: Character, targets: Array<Character>) {
        this._targets = targets;
        this._executor = excutor;
        for (let index in this._strategise) {
            this._strategise[index].excute();
        }
    }

    private end() {
        this._targets = null;
    }
}
ClassConfig.addClass("Card", Card);
