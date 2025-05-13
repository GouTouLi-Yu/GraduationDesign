import { EventObject } from "../../project/event/EventObject";

export class Mediator extends EventObject {
    protected _fullPath: string;
    get fullPath() {
        return this._fullPath;
    }

    constructor(fullPath: string) {
        super();
        this._fullPath = fullPath;
    }
}
