import { Injector } from "../Injector/Injector";
import { EventManager } from "../manager/EventManager";

export class EventObject {
    /** 是否有效 */
    isValid(): boolean {
        return Injector.hasClass(typeof this);
    }

    removeAllListeners() {}

    dispatchEvent(event: string, args?: any) {
        EventManager.dispatchEvent(event, args);
    }

    mapEventListener(event: string, target: any, callback: Function) {
        EventManager.addEventListener(event, target, callback.bind(target));
    }
}
