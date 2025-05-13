import { Node } from "cc";
import { Mediator } from "../../core/view/Mediator";
import { ClassConfig } from "../config/ClassConfig";
import { ResManager } from "./ResManager";

export class UIManager {
    /** 跳转场景 */
    /**
     * @description 跳转界面
     * @param viewName 界面名字, 必须是view结尾
     * @param params
     */
    static gotoView(viewName: string, params?: any): Promise<Node> {
        let viewNameWithOutSuffix = viewName.slice(0, -4);
        let layerName = viewNameWithOutSuffix + "Layer";
        let mediatorName = viewNameWithOutSuffix + "Mediator";
        let mediator: Mediator = ClassConfig.getClass(mediatorName);
        if (!mediator) {
            console.error(`${mediatorName} not found in ClassConfig`);
            return;
        }
        let layerPath = mediator.fullPath + layerName;
        return ResManager.loadPrefab(layerPath);
    }
}
