import { EMediatorType, Mediator } from "./Mediator";

export abstract class PopupMediator extends Mediator {
    static type = EMediatorType.popup;
}
