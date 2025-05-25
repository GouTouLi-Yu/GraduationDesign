import { _decorator } from 'cc';
import { ClassConfig } from '../../../project/config/ClassConfig';
import { Item } from '../item/Item';
const { ccclass, property } = _decorator;

export enum ETreasureType {
    nomal = 1,
    rare,
    legend
}

export class Treasure extends Item {

    private _treasureType: ETreasureType;

}
ClassConfig.addClass("Treasure", Treasure);

