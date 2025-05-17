import { EMediatorType, Mediator } from "./Mediator";

export abstract class PopupMediator extends Mediator {
    type = EMediatorType.popup;
    initialize() {}
    onRegister() {}
    enterWithData(data?: any) {}
    mapEventListeners() {}
    resumeWithData(data?: any) {}
    dispose() {
        super.dispose();
    }
}
