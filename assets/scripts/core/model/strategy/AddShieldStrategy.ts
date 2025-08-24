import { CommonStrategy } from "./CommonStrategy";
import { IStrategyParams } from "./Strategy";

export class AddShieldStrategy extends CommonStrategy {
    constructor(params: IStrategyParams) {
        super(params);
    }

    setFinalValueByBuff() {}

    setFinalValueByDebuff() {}

    execute() {}

    end() {}

    syncData(data: any) {
        super.syncData(data);
    }
}
