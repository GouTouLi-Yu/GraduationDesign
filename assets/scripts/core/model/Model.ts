import { _decorator } from "cc";
import { EventObject } from "../../project/event/EventObject";
const { ccclass, property } = _decorator;

export abstract class Model extends EventObject {
    abstract initialize();
    abstract syncData(data: any);
    abstract syncDelData(data: any);
    abstract clearAll();
}
