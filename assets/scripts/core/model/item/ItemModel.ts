import { ConfigReader } from "../../../project/ConfigReader/ConfigReader";
import { Model } from "../Model";
import { Item } from "./Item";

export class ItemModel extends Model {
    private _items: Array<Item>;

    initialize() {
        this._items = [];
    }

    syncData(itemIds: Array<string>) {
        for (let i = 0; i < itemIds.length; i++) {
            let itemId = itemIds[i];
            let itemConfig = ConfigReader.getDataById("ItemConfig", itemId);
            let item = new Item();
            item.syncData(itemConfig);
            this._items.push(item);
        }
    }

    print() {
        console.log("玩家道具数据：", this._items);
    }
}
