import { Node } from "cc";
import { ClassConfig } from "../../../project/config/ClassConfig";
import { PopupMediator } from "../PopupMediator";

export class MainMenuMediator extends PopupMediator {
    static fullPath: string = "prefab/mainMenu/";
    private _layout: Node;

    initialize(): void {
        super.initialize();
        console.log("成功");
    }

    onRegister(): void {
        super.onRegister();
        this.registerUI();
    }

    registerUI(): void {
        this._layout = this.view.getChildByName("Layout");
    }

    enterWithData(data?: any): void {
        super.enterWithData(data);
        console.log("当前节点：", this.view);
        this._layout.getChildByName("newBtn").addClickListener(() => {
            console.log("点击新游戏");
        });
    }
}
ClassConfig.addClass("MainMenuMediator", MainMenuMediator);
