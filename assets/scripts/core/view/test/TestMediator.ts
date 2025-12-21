import { Node } from "cc";
import { ClassConfig } from "../../../project/config/ClassConfig";
import { AreaMediator } from "../AreaMediator";

export class TestMediator extends AreaMediator {
    static fullPath: string = "prefab/";
    private _arr: Array<number>;

    private _num: number = 100000000;
    private _touchLayer: Node;
    private _Node: Node;

    initialize(): void {}

    onRegister(): void {
        this.registerUI();
    }

    registerUI() {
        this._touchLayer = this.view.getChildByName("touchLayer");
        this._Node = this.view.getChildByName("Node");
    }

    enterWithData(data?: any): void {
        this.setupView();
    }

    setupView() {
        this.func();
    }

    async func(): Promise<void> {
        console.log("开始创建大数组");
        await new Promise((resolve) => {
            setTimeout(() => {
                resolve(null);
            }, 1000);
        });
        this._arr = new Array<number>(this._num);
        this._arr.fill(0);
        console.log("大数组创建完成");
    }
}
ClassConfig.addClass("TestMediator", TestMediator);
