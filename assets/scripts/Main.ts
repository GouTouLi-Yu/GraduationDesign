import { _decorator, Component } from "cc";
import { ClassConfig } from "./project/config/ClassConfig";
const { ccclass, property } = _decorator;

@ccclass("Main")
export class Main extends Component {
    protected onLoad(): void {
        this.initStaticClass();
    }

    private initStaticClass() {
        ClassConfig.init();
    }

    start() {}

    update(deltaTime: number) {}
}
