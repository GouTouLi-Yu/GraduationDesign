import {
    BattleCharacter,
    ICharacterHurtParams,
} from "../battle/BattleCharacter";
import { CommonStrategy } from "./CommonStrategy";
import { IStrategyParams } from "./Strategy";

// 最终伤害 =（攻击+伤害）* （1 - 虚弱率）* （1 + 易伤率）* （1 + 最终伤害率）* (1 - 最终减伤率）

export class AttackStrategy extends CommonStrategy {
    constructor(params: IStrategyParams) {
        super(params);
        this._changeFunc = (target: BattleCharacter, segment: number) => {
            let params: ICharacterHurtParams = {
                value: this._value,
                segment: segment,
            };
            target.hurt(params);
        };
    }

    setFinalValueByBuff() {
        this._value += this._executor.strength;
    }

    setFinalValueByDebuff() {}

    execute() {
        super.execute();
    }

    syncData(data: any) {
        if (!data) {
            return;
        }
        super.syncData(data);
    }

    end() {}
}
