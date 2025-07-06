import { ICharacterHurtParams } from "../battle/Battle";
import { Character } from "../character/Character";
import {
    INCASParams,
    NormalChangeAttrisStrategy,
} from "./NormalChangeAttrisStrategy";

// 最终伤害 =（攻击+伤害）* （1 - 虚弱率）* （1 + 易伤率）* （1 + 最终伤害率）* (1 - 最终减伤率）

export class AttackStrategy extends NormalChangeAttrisStrategy {
    constructor(params: INCASParams) {
        super(params);
        this._changeFunc = (target: Character, segment: number) => {
            let params: ICharacterHurtParams = {
                value: this._value,
                segment: segment,
            };
            target.hurt(params);
        };
    }

    setFinalValueByBuff() {
        this._value += this._excutor.battleData.strength;
    }

    setFinalValueByDebuff() {}

    excute() {
        super.excute();
    }

    end() {}
}
