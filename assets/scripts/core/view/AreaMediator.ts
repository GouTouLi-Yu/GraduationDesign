import { EMediatorType, Mediator } from "./Mediator";

export abstract class AreaMediator extends Mediator {
    static type = EMediatorType.area;
}
