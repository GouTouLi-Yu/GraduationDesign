import { _decorator } from "cc";
import { ETargetNumType } from "../battle/Battle";
import { Character } from "../character/Character";
import { Strategy } from "./Strategy";
const { ccclass, property } = _decorator;

/** 普通形式改变属性策略参数 --> interface normal change attributes strategy params */
export interface INCASParams {
    value: number;
    excutor: Character;
    /** 作用目标 全部敌人 */
    targets: Array<Character>;
    segment: number;
    targetNumType: ETargetNumType;
    /** 攻击选择的对象（不传就是随机 或者 全部） */
    chooseIndex?: number;
}

export abstract class NormalChangeAttrisStrategy extends Strategy {
    private _targets: Array<Character>;
    private _chooseIndex: number;
    private _targetType: ETargetNumType;
    protected _excutor: Character;
    protected _segment: number;
    protected _value: number;

    protected _changeFunc: (target: Character, segment: number) => void;
    protected _params: any;

    constructor(params: INCASParams) {
        super();
        this._value = params.value;
        this._targets = params.targets;
        this._segment = params.segment;
        this._chooseIndex = params.chooseIndex;
        this._targetType = params.targetNumType;
        this._excutor = params.excutor;
    }

    setFinalValue() {
        this.setFinalValueByBuff();
        this.setFinalValueByDebuff();
    }

    syncData(data: INCASParams) {
        if (data.chooseIndex != null) {
            this._chooseIndex = data.chooseIndex;
        }
        if (data.targets != null) {
            this._targets = data.targets;
        }
        if (data.excutor != null) {
            this._excutor = data.excutor;
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
