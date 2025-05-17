import { _decorator, Component, DynamicAtlasManager } from "cc";
import { Injector } from "./project/Injector/Injector";
import { EventManager } from "./project/manager/EventManager";
import { UIManager } from "./project/manager/UIManager";
const { ccclass, property } = _decorator;

DynamicAtlasManager.instance.enabled = false;
@ccclass("Main")
export class Main extends Component {
    protected onLoad(): void {
        this.initStaticClass();
    }

    private initStaticClass() {
        UIManager.init();
        Injector.init();
        EventManager.init();
    }

    start() {
        UIManager.gotoView("MainMenuView");
    }

    update(deltaTime: number) {}
}
