import { Battle } from "./Battle";

export class BattleModel {
    private _hp: number = 0;

    private _battleData: Battle;
    get battleData() {
        return this._battleData;
    }

    constructor() {
        this._battleData = new Battle();
    }

    initialize() {}

    syncData(data: Battle) {}
}
