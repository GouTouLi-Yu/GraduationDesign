import { _decorator } from "cc";
import { ClassConfig } from "../../../project/config/ClassConfig";
const { ccclass, property } = _decorator;

export enum ETreasureType {
    nomal = 1,
    rare,
    legend,
}

export class Treasure {
    private _id: string;
    get id(): string {
        return this._id;
    }
    private _name: string;
    get name(): string {
        return this._name;
    }
    private _desc: string;
    get desc(): string {
        return this._desc;
    }
    private _buyPrice: number;
    get buyPrice(): number {
        return this._buyPrice;
    }
    private _upgradePrice: number;
    get upgradePrice(): number {
        return this._upgradePrice;
    }
    private _type: ETreasureType;
    get type(): ETreasureType {
        return this._type;
    }

    syncData(config: any) {
        this._id = config.id;
        this._name = config.name;
        this._desc = config.desc;
        this._buyPrice = config.buyPrice;
        this._upgradePrice = config.upgradePrice;
        this._type = config.type;
    }
}
ClassConfig.addClass("Treasure", Treasure);
