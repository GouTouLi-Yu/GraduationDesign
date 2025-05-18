import { DisposableObject } from "../disposableObject/DisposableObject";
import { EventManager } from "../manager/EventManager";

export class EventObject extends DisposableObject {
    removeAllListeners() {}

    dispatchEvent(event: number, args?: any) {
        EventManager.dispatchEvent(event, args);
    }

    mapEventListener(event: number, target: any, callback: Function) {
        EventManager.addEventListener(event, target, callback.bind(target));
    }
}
