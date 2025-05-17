import { Node } from "cc";
import { ClassConfig } from "../../../project/config/ClassConfig";
import { UIManager } from "../../../project/manager/UIManager";
import { AreaMediator } from "../AreaMediator";
import { EMediatorDisposeType } from "../Mediator";

export class MainMenuMediator extends AreaMediator {
    static fullPath: string = "prefab/mainMenu/";
    private _layout: Node;
    disposeType = EMediatorDisposeType.immediate;

    initialize(): void {
        super.initialize();
        console.log("初始化");
    }

    onRegister(): void {
        super.onRegister();
        this.registerUI();
        console.log("注册");
    }

    registerUI(): void {
        this._layout = this.view.getChildByName("Layout");
    }

    enterWithData(data?: any): void {
        super.enterWithData(data);
        this.setupView();
    }

    setupView() {
        this.setNewGameBtn();
    }

    setNewGameBtn() {
        let btn = this._layout.getChildByName("newBtn");
        btn.addClickListener(() => {
            UIManager.gotoView("TransmitView");
        });
    }
}
ClassConfig.addClass("MainMenuMediator", MainMenuMediator);
