import { _decorator } from "cc";
import { ClassConfig } from "../../../project/config/ClassConfig";
import { AreaMediator } from "../AreaMediator";
const { ccclass, property } = _decorator;

export class TransmitMediator extends AreaMediator {
    static fullPath: string = "prefab/transmit/";
    initialize() {}

    onRegister() {}

    enterWithData(data?: any) {
        this.setupView();
    }

    setupView() {}
}
ClassConfig.addClass("TransmitMediator", TransmitMediator);
