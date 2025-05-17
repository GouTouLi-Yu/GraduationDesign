import { Node } from "cc";
import { EMediatorType, Mediator } from "../../core/view/Mediator";
import { ClassConfig } from "../config/ClassConfig";
import { Injector } from "../Injector/Injector";
import { ResManager } from "./ResManager";
import { SceneManager } from "./SceneManager";

export class UIManager {
    static areaViewOpenedMap: Map<string, Mediator>;
    static popupViewOpenedMap: Map<string, Mediator>;
    static openNingView: string = null;

    static init() {
        this.areaViewOpenedMap = new Map();
        this.popupViewOpenedMap = new Map();
    }

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
        let mediator: Mediator = ClassConfig.getClass(mediatorName);
        if (!mediator) {
            console.error(`${mediatorName} not found in ClassConfig`);
            return;
        }
        let layerPath = mediator.fullPath + layerName;
        let PromiseNode: Promise<Node> = ResManager.loadPrefab(layerPath);
        let parentNode: Node;
        // 实例化对象
        mediator = Injector.getInstance(mediatorName);
        PromiseNode.then((node: Node) => {
            if (mediator.type == EMediatorType.popup) {
                parentNode = SceneManager.popupLayer;
            } else {
                parentNode = SceneManager.areaLayer;
            }
            parentNode.addChildCC(node);
            return node;
        })
            .then((node: Node) => {
                mediator.view = node;
                mediator.initialize();
                mediator.onRegister();
                mediator.enterWithData(params);
                return PromiseNode;
            })
            .then(() => {
                if (mediator.type == EMediatorType.popup) {
                    this.popupViewOpenedMap.set(viewName, mediator);
                } else {
                    for (let mediator of this.areaViewOpenedMap.values()) {
                        mediator.dispose();
                    }
                    this.areaViewOpenedMap.set(viewName, mediator);
                }
            });
    }

    static removeView(viewName: string) {}
}
