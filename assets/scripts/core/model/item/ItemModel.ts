import { ConfigReader } from "../../../project/ConfigReader/ConfigReader";
import { Model } from "../Model";
import { Item } from "./Item";

export class ItemModel extends Model {
    private _items: Array<Item>;

    initialize() {
        this._items = [];
    }

    syncData(itemIds: Array<string>) {
        if (itemIds == null || itemIds.length == 0) {
            return;
        }
        for (let i = 0; i < itemIds.length; i++) {
            let itemId = itemIds[i];
            let itemConfig = ConfigReader.getDataById("ItemConfig", itemId);
            let item = new Item();
            item.syncData(itemConfig);
            this._items.push(item);
        }
    }

    syncDelData(itemIds: Array<string>) {
        if (itemIds == null || itemIds.length == 0) {
            return;
        }
        for (let i = itemIds.length - 1; i >= 0; i--) {
            let itemId = itemIds[i];
            let index = this._items.findIndex((item) => item.id == itemId);
            if (index != -1) {
                this._items.splice(index, 1);
            }
        }
    }

    clearAll() {
        this._items = [];
    }

    print() {
        console.log("玩家道具数据：", this._items);
    }
}
