import { _decorator } from "cc";
import { ClassConfig } from "../../../project/config/ClassConfig";
import { PCEventType } from "../../../project/event/EventType";
import { AreaMediator } from "../AreaMediator";
const { ccclass, property } = _decorator;

export class TransmitMediator extends AreaMediator {
    static fullPath: string = "prefab/transmit/";
    initialize() {
        this.mapEventListener(
            PCEventType.EVT_MAIN_MENU_START_GAME,
            this,
            () => {
                console.log("事件触发成功");
            }
        );
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
