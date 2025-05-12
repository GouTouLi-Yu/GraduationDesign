import { _decorator, Component } from "cc";
import { ResManager } from "./project/manager/ResManager";
const { ccclass, property } = _decorator;

@ccclass("Main")
export class Main extends Component {
    protected onLoad(): void {}

    start() {
        let node = ResManager.loadPrefab("prefab/HelloWorld");
    }

    update(deltaTime: number) {}
}
