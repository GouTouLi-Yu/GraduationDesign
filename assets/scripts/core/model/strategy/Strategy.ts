import { BattleCharacter, ETargetNumType } from "../battle/BattleCharacter";
import { BattleMonsterCharacter } from "../battle/BattleMonsterCharacter";
import { Player } from "../player/Player";
import { ETargetType } from "../skill/Skill";

export interface IStrategyParams {
    /** 不传默认为玩家 */
    executor: BattleCharacter;
    /** 作用目标可以是敌人数组，也可以是玩家数组（只有一个玩家） */
    monsters: Array<BattleMonsterCharacter>;
    /** 选择的对象（不传就是随机 或者 全部） */
    chooseIndex?: number;
    value: number;
    segment: number;
    targetNumType: ETargetNumType;
    /** 作用目标类型  1玩家 2怪物 */
    targetType: ETargetType;
}

export abstract class Strategy {
    protected _monsters: Array<BattleCharacter>;
    protected get player() {
        return Player.instance;
    }
    protected _executor: BattleCharacter;
    protected _chooseIndex: number;
    /** 选择的对象（不传就是随机 或者 全部） */
    protected _targetNumType: ETargetNumType;
    protected _targetType: ETargetType;
    protected _segment: number;
    protected _value: number;

    constructor(params: IStrategyParams) {
        this._executor = params.executor;
        this._targetType = params.targetType;
        if (this._targetType == ETargetType.monster) {
            this._monsters = params.monsters;
        }
        this._chooseIndex = params.chooseIndex;
        this._targetNumType = params.targetNumType;
        this._segment = params.segment;
        this._value = params.value;
    }

    abstract execute();
    abstract end();
    syncData(data) {
        if (!data) {
            return;
        }
        if (data.executor != null) {
            this._executor = data.executor;
        }
        if (data.monsters != null && this._targetType == ETargetType.monster) {
            this._monsters = data.monsters;
        }
        if (data.chooseIndex != null) {
            this._chooseIndex = data.chooseIndex;
        }
    }

    clear() {
        this._executor = null;
        this._monsters = null;
        this._chooseIndex = -1;
    }
}
