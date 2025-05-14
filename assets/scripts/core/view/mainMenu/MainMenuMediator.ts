import { ClassConfig } from "../../../project/config/ClassConfig";
import { PopupMediator } from "../PopupMediator";

export class MainMenuMediator extends PopupMediator {
    static fullPath: string = "prefab/mainMenu/";

    initialize(): void {
        super.initialize();
        console.log("成功");
    }

    onRegister(): void {
        super.onRegister();
    }

    enterWithData(data?: any): void {
        super.enterWithData(data);
    }
}
ClassConfig.addClass("MainMenuMediator", MainMenuMediator);
