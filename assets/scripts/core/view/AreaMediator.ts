import { EMediatorType, Mediator } from "./Mediator";

export abstract class AreaMediator extends Mediator {
    type = EMediatorType.area;

    initialize() {}
    onRegister() {}
    enterWithData(data?: any) {}
    mapEventListeners() {}
    resumeWithData(data?: any) {}
    dispose() {
        super.dispose();
    }
}
