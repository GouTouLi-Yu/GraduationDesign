import { Character } from "../character/Character";
import { Strategy } from "./Strategy";

export interface IAddShieldStrategyParams {
    targets: Array<Character>;
    shield: number;
    segment: number;
    excutor: Character;
}

export class AddShieldStrategy extends Strategy {
    private _targets: Array<Character>;
    private _shield: number;
    private _segment: number;
    private _excutor: Character;
    constructor(params: IAddShieldStrategyParams) {
        super();
        this._targets = params.targets;
        this._shield = params.shield;
        this._segment = params.segment;
        this._excutor = params.excutor;
    }

    excute() {}

    end() {}
}
