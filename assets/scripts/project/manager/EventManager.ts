import { EventObject } from "../event/EventObject";

export class EventManager {
    static eventMap: Map<number, Map<EventObject, EventTarget>>;

    static init() {
        this.eventMap = new Map();
    }

    static dispatchEvent(eventName: number, data?: any) {
        let eventTargets = this.eventMap.get(eventName);
        if (!eventTargets) {
            eventTargets = new Map<EventObject, EventTarget>();
            this.eventMap.set(eventName, eventTargets);
        }
        for (let eventTarget of eventTargets.values()) {
            eventTarget.dispatchEvent(
                new CustomEvent(eventName.toString(), { detail: data })
            );
        }
    }

    static addEventListener(
        eventName: number,
        target: EventObject,
        callback: Function
    ) {
        let eventTargetsMap = this.eventMap.get(eventName);
        if (!eventTargetsMap) {
            eventTargetsMap = new Map<EventObject, EventTarget>();
            this.eventMap.set(eventName, eventTargetsMap);
        }
        let eventTarget = new EventTarget();
        eventTarget.addEventListener(
            eventName.toString(),
            (event: CustomEvent) => {
                if (target.isValid) {
                    callback(event.detail);
                } else {
                    eventTargetsMap.delete(target);
                    return;
                }
            }
        );
        eventTargetsMap.set(target, eventTarget);
    }

    static removeEventListener(eventName: number, target: EventObject) {
        let eventTargetsMap = this.eventMap.get(eventName);
        if (!eventTargetsMap) {
            return;
        }
        let eventTarget = eventTargetsMap.get(target);
        if (!eventTarget) {
            return;
        }
        eventTarget.removeEventListener(
            eventName.toString(),
            (event: CustomEvent) => {}
        );
        eventTargetsMap.delete(target);
    }
}
