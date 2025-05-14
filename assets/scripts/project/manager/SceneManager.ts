import { director, Node } from "cc";

export class SceneManager {
    static initScene() {}

    static getCanvas(): Node {
        return director.getScene().getChildByName("Canvas");
    }

    static get areaLayer(): Node {
        return this.getCanvas().getChildByPath("UIRoot/AreaLayer");
    }

    static get popupLayer(): Node {
        return this.getCanvas().getChildByPath("UIRoot/PopupLayer");
    }
    /** 加载场景 */
}
