import { _decorator } from "cc";
import { MyResManager } from "../manager/ResManager";
const { ccclass, property } = _decorator;

@ccclass("DisposableObject")
export class DisposableObject {
    private _isValid: boolean = true;
    get isValid(): boolean {
        return this._isValid;
    }

    dispose() {
        if (!this._isValid) {
            console.error(`${this.constructor.name} is already disposed`);
            return;
        }
        this._isValid = false;
        MyResManager.clearAllAssets();
    }
}
