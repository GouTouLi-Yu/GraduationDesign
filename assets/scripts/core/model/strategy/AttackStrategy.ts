import { ICharacterHurtParams } from "../battle/BattleCharacter";
import { BattleEnemyCharacter } from "../battle/BattleEnemyCharacter";
import { CommonStrategy } from "./CommonStrategy";
import { ICSParams } from "./Strategy";

// 最终伤害 =（攻击+伤害）* （1 - 虚弱率）* （1 + 易伤率）* （1 + 最终伤害率）* (1 - 最终减伤率）

export class AttackStrategy extends CommonStrategy {
    constructor(params: ICSParams) {
        super(params);
        this._changeFunc = (target: BattleEnemyCharacter, segment: number) => {
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

    excute() {
        super.excute();
    }

    syncData(data: any) {
        super.syncData(data);
    }

    end() {}
}
