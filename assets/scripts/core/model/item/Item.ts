export enum EItemType {
    card = 1,
    treasure,
}
export class Item {
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
    private _type: EItemType;
    get type(): EItemType {
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
