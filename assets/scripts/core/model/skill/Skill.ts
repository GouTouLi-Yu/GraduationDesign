import { ConfigReader } from "../../../project/ConfigReader/ConfigReader";
import { BuffHelper } from "../../helper/BuffHelper";
import { Action } from "../action/Action";
import { BattleCharacter, ETargetNumType } from "../battle/BattleCharacter";
import { BattleMonsterCharacter } from "../battle/BattleMonsterCharacter";
import { IStrategyParams } from "../strategy/Strategy";

export enum ETargetType {
    player = 1,
    monster,
}

export class Skill {
    private _cfg: any;
    private _level: number = 1;
    private _actions: Array<Action>;
    get actions(): Array<Action> {
        return this._actions;
    }

    private get actionIds(): Array<string> {
        return this._cfg.actionIds;
    }

    private get buffsId(): Array<string> {
        return this._cfg.buffsId;
    }

    private get id(): string {
        return this._cfg.id;
    }

    private get targetNums(): Array<number> {
        return this._cfg.targetNums;
    }

    private get targetTypes(): Array<ETargetType> {
        return this._cfg.targetTypes;
    }

    private get buffTargetNums(): Array<number> {
        return this._cfg.buffTargetNums;
    }

    /** 1级作用段数 */
    private get level1Segments(): Array<number> {
        return this._cfg.level1Segments;
    }

    /** 2级作用段数 */
    private get level2Segments(): Array<number> {
        return this._cfg.level2Segments;
    }

    /** 1级数值 */
    private get level1Factors(): Array<number> {
        return this._cfg.level1Factors;
    }

    /** 2级数值 */
    private get level2Factors(): Array<number> {
        return this._cfg.level2Factors;
    }

    /**
     * @description 获取属性值（攻击、防御、恢复等）
     * @param index 第几个行为 0 ~ num - 1
     * @param level 等级，不传默认为当前卡牌等级
     *
     */
    private getFactor(index: number, level?: number): number {
        let _level = level ?? this._level;
        return _level == 1
            ? this.level1Factors[index]
            : this.level2Factors[index];
    }

    getFactors(level?: number): Array<number> {
        let _level = level ?? this._level;
        return _level == 1 ? this.level1Factors : this.level2Factors;
    }

    getBuffFactorsByLevel(level?: number): Array<number> {
        let arr: Array<number> = [];
        let _level = level ?? this._level;
        for (let buffId of this.buffsId) {
            let factor = BuffHelper.getBuffFactor(buffId, _level);
            arr.push(factor);
            return arr;
        }
        return arr;
    }

    /**
     * @description 获取行为段数
     * @param index 第几个行为 0 ~ num - 1
     * @param level 等级，不传默认为当前卡牌等级
     */
    private getSegment(index: number, level?: number): number {
        let _level = level ?? this._level;
        if (_level == 1) {
            return this.level1Segments[index];
        }
        return this.level2Segments[index] ?? this.level1Segments[index];
    }

    constructor(
        id: string,
        level: number,
        chooseIndex: number = -1,
        executor: BattleCharacter,
        monsters: Array<BattleMonsterCharacter>
    ) {
        this._cfg = ConfigReader.getDataById("SkillConfig", id);
        this._level = level;
        this._actions = new Array<Action>();
        this.setActions(chooseIndex, executor, monsters);
    }

    syncData(data) {
        if (data.level != null) {
            this._level = data.level;
        }
    }

    clear() {
        for (let action of this._actions) {
            action.clear();
        }
    }

    setActions(
        chooseIndex: number = -1,
        executor: BattleCharacter,
        monsters: Array<BattleMonsterCharacter>
    ) {
        for (let i = 0; i < this.actionIds.length; i++) {
            let actionId = this.actionIds[i];
            let params: IStrategyParams = {
                value: this.getFactor(i),
                segment: this.getSegment(i),
                targetNumType: this.targetNums[i] as ETargetNumType,
                chooseIndex: chooseIndex,
                targetType: this.targetTypes[i],
                executor: executor,
                monsters: monsters,
            };
            let action = new Action(actionId, params);
            this._actions.push(action);
        }
    }
}
