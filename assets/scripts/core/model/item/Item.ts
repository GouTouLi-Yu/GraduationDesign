import { ClassConfig } from "../../../project/config/ClassConfig";

export enum EItemType {
    card = 1,
    treasure,
}
export class Item {
    private _id: string;
    private _name: string;
    private _desc: string;
    private _buyPrice: number;
    private _upgradePrice: number;
    private _type: EItemType;

    syncData(config: any) {
        this._id = config.id;
        this._name = config.name;
        this._desc = config.desc;
        this._buyPrice = config.buyPrice;
        this._upgradePrice = config.upgradePrice;
        this._type = config.type;
    }
}
ClassConfig.addClass("Item", Item);
