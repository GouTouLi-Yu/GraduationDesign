import { director, Node } from "cc";

export class SceneManager {
    static initScene() {}

    static getCanvas() {
        return director.getScene().getChildByName("Canvas");
    }

    private static initNodes() {
        let canvas = this.getCanvas();
        if (!canvas) {
            canvas = new Node("Canvas");
            director.getScene().addChild(canvas);
        }
        let uiRoot = canvas.getChildByName("UIRoot");
        if (!uiRoot) {
            uiRoot = new Node("UIRoot");
            canvas.addChild(uiRoot);
        }
    }
    /** 加载场景 */
}
