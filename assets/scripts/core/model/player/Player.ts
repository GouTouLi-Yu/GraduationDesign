import { _decorator } from "cc";
import { Character } from "../character/Character";
import { Item } from "../item/Item";
const { ccclass, property } = _decorator;

export class Player extends Character {
    // 存放到磁盘中的数据
    private _level: number; //已通过的关卡数目

    // 存放到内存中的数据
    private _name: string;

    private _gold: number;
    private _energy: number;
    private _remainEnergy: number;
    private _items: Array<Item>;

    syncData(data: any) {
        if (data.level != null) {
            this._level = data.level;
        }
    }
}
