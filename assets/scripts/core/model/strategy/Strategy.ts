import { BattleCharacter, ETargetNumType } from "../battle/BattleCharacter";
import { Player } from "../player/Player";

interface IStrategyParams {
    /** 不传默认为玩家 */
    executor?: BattleCharacter;
    /** 作用目标可以是敌人数组，也可以是玩家数组（只有一个玩家） */
    targets: Array<BattleCharacter>;
}

/** 常用策略参数 --> interface common strategy params */
export interface ICSParams extends IStrategyParams {
    value: number;
    segment: number;
    targetNumType: ETargetNumType;
    /** 选择的对象（不传就是随机 或者 全部） */
    chooseIndex?: number;
}

export abstract class Strategy {
    protected _targets: Array<BattleCharacter>;
    get targets() {
        return this._targets;
    }

    constructor(params: IStrategyParams) {
        this._executor =
            params.executor ?? Player.instance.battlePlayerCharacter;
        this._targets = params.targets;
    }

    protected _executor: BattleCharacter;
    get executor() {
        return this._executor;
    }

    abstract excute();
    abstract end();
    abstract syncData(data);
}
