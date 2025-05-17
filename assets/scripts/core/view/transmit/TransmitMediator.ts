import { _decorator } from "cc";
import { ClassConfig } from "../../../project/config/ClassConfig";
import { AreaMediator } from "../AreaMediator";
const { ccclass, property } = _decorator;

export class TransmitMediator extends AreaMediator {
    static fullPath: string = "prefab/transmit/";
    initialize() {
        this.mapEventListener("eventA", this, () => {});
    }

    xiake() {
        console.log("下课了");
    }

    onRegister() {}

    enterWithData(data?: any) {
        this.setupView();
    }

    setupView() {}
}
ClassConfig.addClass("TransmitMediator", TransmitMediator);
