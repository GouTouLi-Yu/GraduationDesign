export class SingleTon {
    protected static _instance: SingleTon;
    static get instance() {
        if (!this._instance) {
            this._instance = new this();
        }
        return this._instance;
    }
}
