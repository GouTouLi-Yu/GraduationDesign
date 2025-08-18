import { _decorator } from "cc";
import { BattleCharacter, ETargetNumType } from "../battle/BattleCharacter";
import { ICSParams, Strategy } from "./Strategy";
const { ccclass, property } = _decorator;

export abstract class CommonStrategy extends Strategy {
    private _chooseIndex: number;
    private _targetType: ETargetNumType;

    protected _segment: number;
    protected _value: number;

    protected _changeFunc: (target: BattleCharacter, segment: number) => void;
    protected _params: any;

    constructor(params: ICSParams) {
        super(params);
        this._value = params.value;
        this._targets = params.targets;
        this._segment = params.segment;
        this._chooseIndex = params.chooseIndex;
        this._targetType = params.targetNumType;
    }

    setFinalValue() {
        this.setFinalValueByBuff();
        this.setFinalValueByDebuff();
    }

    syncData(data: ICSParams) {
        if (data.chooseIndex != null) {
            this._chooseIndex = data.chooseIndex;
        }
        if (data.targets != null) {
            this._targets = data.targets;
        }
    }

    excute() {
        this.setFinalValue();
        if (this._targetType == ETargetNumType.random) {
            this.excuteByRandom();
        } else {
            this.excuteBySingleAndAll();
        }
    }

    abstract setFinalValueByDebuff();

    abstract setFinalValueByBuff();

    private excuteByRandom() {
        let segments = new Array<number>(this._targets.length);
        segments.fill(0);
        for (let i = 0; i < this._segment; i++) {
            let index = Math.floor(Math.random() * this._targets.length);
            segments[index]++;
        }
        for (let i = 0; i < this._targets.length; i++) {
            let target = this._targets[i];
            let segment = segments[i];
            if (segment > 0) {
                this._changeFunc(this._targets[i], segment);
            }
        }
    }

    private excuteBySingleAndAll() {
        if (this._chooseIndex != null) {
            let target = this._targets[this._chooseIndex];
            this._changeFunc(target, this._segment);
        } else {
            for (let target of this._targets) {
                this._changeFunc(target, this._segment);
            }
        }
    }

    end() {}
}
