import { director, Node } from "cc";

export class SceneManager {
    static initScene() {}

    static getCanvas(): Node | null {
        const scene = director.getScene();
        if (!scene) {
            console.error("[SceneManager] Scene is null");
            return null;
        }
        return scene.getChildByName("Canvas");
    }

    static get areaLayer(): Node | null {
        const canvas = this.getCanvas();
        if (!canvas) {
            return null;
        }
        return canvas.getChildByPath("UIRoot/AreaLayer");
    }

    static get popupLayer(): Node | null {
        const canvas = this.getCanvas();
        if (!canvas) {
            return null;
        }
        return canvas.getChildByPath("UIRoot/PopupLayer");
    }
    /** 加载场景 */
}
