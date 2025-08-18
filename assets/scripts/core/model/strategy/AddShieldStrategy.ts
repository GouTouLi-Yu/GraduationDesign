import { CommonStrategy } from "./CommonStrategy";
import { ICSParams } from "./Strategy";

export class AddShieldStrategy extends CommonStrategy {
    constructor(params: ICSParams) {
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
