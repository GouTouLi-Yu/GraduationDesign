import { Node, Prefab } from "cc";
import { EventObject } from "../../project/event/EventObject";
import { Injector } from "../../project/Injector/Injector";

export enum EMediatorType {
    popup,
    area,
    panel,
}

export enum EMediatorDisposeType {
    immediate = 0,
    shortTime = 30,
    longTime = 180,
    never = 9999999,
}

export abstract class Mediator extends EventObject {
    type: EMediatorType;
    fullPath: string = "";
    view: Node | null = null;
    disposeType: EMediatorDisposeType = EMediatorDisposeType.shortTime;
    protected _intervalId: number = 0;

    abstract initialize();
    abstract onRegister();
    abstract enterWithData(data?: any);
    abstract mapEventListeners();
    abstract resumeWithData(data?: any);
    dispose() {
        setTimeout(() => {
            console.log("释放");
            this._dipose();
        }, this.disposeType * 1000);
    }

    _dipose() {
        if (this.view) {
            let prefab: Prefab = this.view.prefab;
            // MyResManager.printAssetInfo();
            // AssetManager.instance.releaseAsset(prefab);
            this.view.destroy();
            this.view = null;
        }
        this.removeAllListeners();
        Injector.delete(typeof this);
        super.dispose();
    }
}
