import { EActionType } from "../card/Card";
import { AttackStrategy } from "../strategy/AttackStrategy";
import { IStrategyParams, Strategy } from "../strategy/Strategy";

export interface IAction {}

export class Action {
    private _id: string;
    get id(): string {
        return this._id;
    }

    private _type: EActionType;
    get type(): EActionType {
        return this._type;
    }

    private _strategy: Strategy;
    get strategy(): Strategy {
        return this._strategy;
    }

    constructor(id: string, params: IStrategyParams) {
        this._id = id;
        this._type = id as EActionType;
    }

    syncData(data) {
        if (!data) {
            return;
        }
    }

    clear() {}

    setStrategy(params: IStrategyParams): Strategy {
        switch (this._type) {
            case EActionType.attack:
                let attackStrategy = new AttackStrategy(params);
                return attackStrategy;
            case EActionType.defense:
                break;
            case EActionType.recover:
                break;
        }
    }
}
