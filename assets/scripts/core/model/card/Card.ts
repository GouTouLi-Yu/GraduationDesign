import { ClassConfig } from "../../../project/config/ClassConfig";
import { ConfigReader } from "../../../project/ConfigReader/ConfigReader";
import { Skill } from "../skill/Skill";
import { Strategy } from "../strategy/Strategy";
import { Strings } from "./../../../project/strings/Strings";

export interface IDefense {
    execute: (val: number) => void;
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

export class Card {
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

    private _skill: Skill;

    /** 卡牌描述 */
    get desc(): string {
        let str: string = "";
        let descs: Array<string> = this.cfg.descs;
        let buffIds: Array<string> = this.buffIds;
        let factors = [
            ...this._skill.getFactors(),
            ...this._skill.getBuffFactorsByLevel(),
        ];
        for (let i = 0; i < descs.length; i++) {
            str += Strings.get(descs[i], {
                factor: factors[i],
            });
            if (i != descs.length - 1) {
                str += ",";
            }
        }
        return str;
    }

    private get skillId(): string {
        return this.cfg.skillId;
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

    /** 策略数组, 和行为id 一一对应 */
    get strategise(): Array<Strategy> {
        let actions = this._skill.actions;
        let arr = [];
        for (let action of actions) {
            arr.push(action.strategy);
        }
        return arr;
    }

    /** 是否需要选中对象 */
    get needChooseTarget(): boolean {
        return this.cfg.needChooseTarget;
    }

    get buffIds(): Array<string> {
        return this.cfg.buffIds ?? [];
    }

    private get cfg() {
        return ConfigReader.getDataById("CardConfig", this._id);
    }

    /**
     *
     * @param {Array<BattleCharacter>} targets : 需要传全部的作用对象
     */
    constructor(id: string, level: number = 1) {
        this._id = id;
        this._level = level;
        this._skill = new Skill(this.skillId, this._level, -1, null, null);
    }

    syncData(data) {
        if (data.level != null) {
            this._level = data.level;
        }
    }

    /**
     * @description 获取属性值（攻击、防御、恢复等）
     * @param index 第几个行为 0 ~ num - 1
     * @param level 等级，不传默认为当前卡牌等级
     *
     */
    private getFactors(index: number, level?: number): number {
        let _level = level ?? this._level;
        return _level == 1
            ? this.cfg.level1Factor[index]
            : this.cfg.level2Factor[index];
    }

    execute() {
        for (let index in this.strategise) {
            this.strategise[index].execute();
        }
    }
}
ClassConfig.addClass("Card", Card);
