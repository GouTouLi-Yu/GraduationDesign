export class SingleTon {
    protected static _instance: any;
    static get instance(): any {
        if (!this._instance) {
            this._instance = new (this as any)();
        }
        return this._instance;
    }
}
