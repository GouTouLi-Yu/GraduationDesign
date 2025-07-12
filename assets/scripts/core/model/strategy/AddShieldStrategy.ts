import { Character } from "../character/Character";
import {
    INCASParams,
    NormalChangeAttrisStrategy,
} from "./NormalChangeAttrisStrategy";

export interface IAddShieldStrategyParams {
    targets: Array<Character>;
    shield: number;
    segment: number;
    excutor: Character;
}

export class AddShieldStrategy extends NormalChangeAttrisStrategy {
    constructor(params: INCASParams) {
        super(params);
    }

    setFinalValueByBuff() {}

    setFinalValueByDebuff() {}

    excute() {}

    end() {}

    syncData(data: any) {
        super.syncData(data);
    }
}
