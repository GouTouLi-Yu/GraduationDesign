import { Node } from "cc";
import { ClassConfig } from "../../../project/config/ClassConfig";
import { PCEventType } from "../../../project/event/EventType";
import { Injector } from "../../../project/Injector/Injector";
import { MainMenuFacade } from "../../controller/mainMenu/MainMenuFacade";
import { AreaMediator } from "../AreaMediator";
import { EMediatorDisposeType } from "../Mediator";

export class MainMenuMediator extends AreaMediator {
    static fullPath: string = "prefab/mainMenu/";
    private _layout: Node;
    disposeType = EMediatorDisposeType.immediate;
    private _facade: MainMenuFacade;

    initialize(): void {
        super.initialize();

        this._facade = Injector.getInstance(MainMenuFacade);
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
        this.setStartNewGameBtn();
        this.setStartGameBtn();
    }

    setStartNewGameBtn() {
        let btn = this._layout.getChildByName("newBtn");
        btn.addClickListener(() => {
            this._facade.opStartNewGame();
        });
    }

    setStartGameBtn() {
        let btn = this._layout.getChildByName("continueBtn");
        btn.addClickListener(() => {
            this._facade.opStartGame();
        });
    }

    dispose(): void {
        super.dispose();
        this.dispatchEvent(PCEventType.EVT_MAIN_MENU_START_GAME);
    }
}
ClassConfig.addClass("MainMenuMediator", MainMenuMediator);
