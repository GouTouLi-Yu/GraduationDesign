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

    get mpCost(): Array<number> {
        return this.cfg.mpCost;
    }

    get name(): string {
        return this.cfg.name;
    }

    private _targetNumType: ETargetNumType;
    /** 作用对象类型 */
    get targetNumType(): ETargetNumType {
        return this._targetNumType;
    }

    private _targets: Array<Character>;
    private _executor: Character;

    private get level1Segment(): Array<number> {
        return this.cfg.level1Segment;
    }
    private get level2Segment(): Array<number> {
        return this.cfg.level2Segment;
    }

    private getSegment(level?: number): number {
        let _level = level ?? this._level;
        if (_level == 1) {
            return this.cfg.level1Segment;
        }
        return this.cfg.level2Segment ?? this.cfg.level1Segment;
    }

    /** 卡牌描述 */
    get desc(): string {
        return "";
    }

    get buyPrice(): number {
        return this.cfg.buyPrice;
    }

    get upgradePrice(): number {
        return this.cfg.upgradePrice;
    }

    private _level: number = 1;
    get level() {
        return this._level;
    }

    set level(level: number) {
        this._level = level;
    }

    /** 行为id数组 */
    private get actionIds(): Array<string> {
        return this.cfg.actionIds;
    }

    /** 策略数组, 和行为id 一一对应 */
    private _strategise: Array<Strategy>;

    /** 是否需要选中对象 */
    get needChooseTarget(): boolean {
        return this.cfg.needChooseTarget;
    }

    private _chooseIndex: number;
    /** 选中的目标索引 */
    get chooseIndex(): number {
        return this._chooseIndex;
    }
    set chooseIndex(index: number) {
        this._chooseIndex = index;
    }

    get buffIds(): Array<string> {
        return this.cfg.buffIds;
    }

    private get cfg() {
        return ConfigReader.getDataById("CardConfig", this._id);
    }

    /**
     *
     * @param {Array<Character>} targets : 需要传全部的作用对象
     */
    constructor(id: string, targets: Array<Character>, level?: number) {
        this._id = id;
        this._targets = targets;
        this._executor = Player.instance;
        this._chooseIndex = -1;
        this._level = level ?? 1;
        let cardConfig = ConfigReader.getDataById("CardConfig", id);
        this.syncData(cardConfig);
    }

    syncData(config: any) {
        this._id = config.id;
        this.setTargetType(config.targetNum);
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
    getFactorByLevel(level?: number): number {
        let _level = level ?? this._level;
        return _level == 1 ? this.cfg.level1Factor : this.cfg.level2Factor;
    }

    private setStrategise() {
        this._strategise = [];
        for (let i = 0; i < this.actionIds.length; i++) {
            let actionId = this.actionIds[i];
            switch (actionId) {
                case EActionType.attack:
                    let params: INCASParams = {
                        excutor: this._executor,
                        targets: this._targets,
                        value: this.getFactorByLevel(i),
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
