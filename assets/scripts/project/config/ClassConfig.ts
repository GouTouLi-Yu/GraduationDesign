export class ClassConfig {
    private static _classMap: Map<string, any> = new Map<string, any>();
    static destroy() {
        this._classMap.clear();
    }

    static addClass(className: string, classType: any) {
        this._classMap.set(className, classType);
    }

    static getClass(className: string) {
        return this._classMap.get(className);
    }
}
