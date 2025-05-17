import { _decorator } from "cc";
import { EventObject } from "../event/EventObject";
const { ccclass, property } = _decorator;

export class EventManager {
    static eventMap: Map<string, Map<any, EventTarget>>;

    // static eventTarget: EventTarget;

    static init() {
        this.eventMap = new Map();
    }

    static dispatchEvent(eventName: string, data?: any) {
        let eventTargets = this.eventMap.get(eventName);
        if (!eventTargets) {
            eventTargets = new Map<any, EventTarget>();
            this.eventMap.set(eventName, eventTargets);
        }
        for (let eventTarget of eventTargets.values()) {
            eventTarget.dispatchEvent(
                new CustomEvent(eventName, { detail: data })
            );
        }
    }

    static addEventListener(
        eventName: string,
        target: EventObject,
        callback: Function
    ) {
        let eventTargetsMap = this.eventMap.get(eventName);
        if (!eventTargetsMap) {
            eventTargetsMap = new Map<any, EventTarget>();
            this.eventMap.set(eventName, eventTargetsMap);
        }
        let eventTarget = new EventTarget();
        eventTarget.addEventListener(eventName, (event: CustomEvent) => {
            if (target.isValid()) {
                callback(event.detail);
            } else {
                eventTargetsMap.delete(target);
                return;
            }
        });
        eventTargetsMap.set(target, eventTarget);
    }
}
