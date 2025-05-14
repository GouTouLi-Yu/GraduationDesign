import { EMediatorType, Mediator } from "./Mediator";

export abstract class PopupMediator extends Mediator {
    static type = EMediatorType.popup;
    initialize() {}
    onRegister() {}
    enterWithData(data?: any) {}
    mapEventListeners() {}
    resumeWithData(data?: any) {}
    dispose() {}
}
