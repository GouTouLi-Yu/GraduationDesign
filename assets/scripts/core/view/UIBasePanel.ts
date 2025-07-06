import { _decorator } from "cc";
import { EMediatorType, Mediator } from "./Mediator";
const { ccclass, property } = _decorator;

export class UIBasePanel extends Mediator {
    type = EMediatorType.panel;
    initialize() {}

    onRegister() {}

    enterWithData(data?: any) {}

    mapEventListeners() {
        console.log("注册事件");
    }

    resumeWithData(data?: any) {
        console.log("恢复");
    }
}
