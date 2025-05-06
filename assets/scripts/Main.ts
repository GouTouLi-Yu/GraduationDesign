import { _decorator, Component } from "cc";
const { ccclass, property } = _decorator;

@ccclass("Main")
export class Main extends Component {
    protected onLoad(): void {}

    start() {
        let a = 4;
        let b = 5;
    }

    update(deltaTime: number) {}
}
