import { ClassConfig } from "../../../project/config/ClassConfig";
import { PopupMediator } from "../PopupMediator";

export class MainMenuMediator extends PopupMediator {
    static fullPath: string = "prefab/mainMenu/";
}
ClassConfig.addClass("MainMenuMediator", MainMenuMediator);
