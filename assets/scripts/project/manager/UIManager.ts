import { Node } from "cc";
import { EMediatorType, Mediator } from "../../core/view/Mediator";
import { ClassConfig } from "../config/ClassConfig";
import { Injector } from "../Injector/Injector";
import { ResManager } from "./ResManager";
import { SceneManager } from "./SceneManager";

export class UIManager {
    /** 跳转场景 */
    /**
     * @description 跳转界面
     * @param viewName 界面名字, 必须是view结尾
     * @param params
     */
    static gotoView(viewName: string, params?: any): Promise<Node> {
        // 传进来MainMenuView
        let viewNameWithOutSuffix = viewName.slice(0, -4);
        // 得到MainMenu
        let layerName = viewNameWithOutSuffix + "Layer";
        let mediatorName = viewNameWithOutSuffix + "Mediator";
        let mediator = ClassConfig.getClass(mediatorName);
        if (!mediator) {
            console.error(`${mediatorName} not found in ClassConfig`);
            return;
        }
        let layerPath = mediator.fullPath + layerName;
        let PromiseNode: Promise<Node> = ResManager.loadPrefab(layerPath);
        let parentNode: Node;
        PromiseNode.then((node: Node) => {
            if (mediator.type == EMediatorType.popup) {
                parentNode = SceneManager.popupLayer;
            } else {
                parentNode = SceneManager.areaLayer;
            }
            parentNode.addChildCC(node);
        }).then(() => {
            let _mediator: Mediator = Injector.getInstance(mediatorName);
            _mediator.initialize();
            _mediator.onRegister();
            _mediator.mapEventListeners();
            _mediator.enterWithData(params);
            return PromiseNode;
        });
    }

    static removeView(viewName: string) {}
}
