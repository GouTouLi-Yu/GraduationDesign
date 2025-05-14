import { Node } from "cc";
import { EventObject } from "../../project/event/EventObject";

export enum EMediatorType {
    popup,
    area,
}

export abstract class Mediator extends EventObject {
    type: EMediatorType;
    fullPath: string = "";
    view: Node;

    abstract initialize();
    abstract onRegister();
    abstract enterWithData(data?: any);
    abstract mapEventListeners();
    abstract resumeWithData(data?: any);
    dispose() {
        this.view.destroy();
        this.view = null;
        this.removeAllListeners();
    }
}
