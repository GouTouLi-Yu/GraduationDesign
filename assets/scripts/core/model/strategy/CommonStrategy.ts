import { _decorator } from "cc";
import { BattleCharacter, ETargetNumType } from "../battle/BattleCharacter";
import { IStrategyParams, Strategy } from "./Strategy";
const { ccclass, property } = _decorator;

export abstract class CommonStrategy extends Strategy {
    protected _changeFunc: (target: BattleCharacter, segment: number) => void;

    constructor(params: IStrategyParams) {
        super(params);
    }

    setFinalValue() {
        this.setFinalValueByBuff();
        this.setFinalValueByDebuff();
    }

    syncData(data) {
        if (!data) {
            return;
        }
        super.syncData(data);
    }

    execute() {
        this.setFinalValue();
        if (this._targetNumType == ETargetNumType.random) {
            this.executeByRandom();
        } else {
            this.executeBySingleAndAll();
        }
    }

    abstract setFinalValueByDebuff();

    abstract setFinalValueByBuff();

    private executeByRandom() {
        let segments = new Array<number>(this._monsters.length);
        segments.fill(0);
        for (let i = 0; i < this._segment; i++) {
            let index = Math.floor(Math.random() * this._monsters.length);
            segments[index]++;
        }
        for (let i = 0; i < this._monsters.length; i++) {
            let target = this._monsters[i];
            let segment = segments[i];
            if (segment > 0) {
                this._changeFunc(this._monsters[i], segment);
            }
        }
    }

    private executeBySingleAndAll() {
        if (this._chooseIndex != null) {
            let target = this._monsters[this._chooseIndex];
            this._changeFunc(target, this._segment);
        } else {
            for (let target of this._monsters) {
                this._changeFunc(target, this._segment);
            }
        }
    }
}
