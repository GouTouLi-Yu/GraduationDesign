import { EventObject } from "../../project/event/EventObject";

export enum EMediatorType {
    popup,
    area,
}

export abstract class Mediator extends EventObject {
    type: EMediatorType;
    fullPath: string = "";
}
