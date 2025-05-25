import { ClassConfig } from "../../../project/config/ClassConfig";
import { Character } from "../character/Character";
import { Item } from "../item/Item";

export enum ECardQuality {
    nomal = 1,
    rare,//稀有
    excellent,//优秀
    legend//传说
}
export enum ECardType {
    attack = 1,
    defense,
    recover,
    function,//功能
    buff,
    debuff
}
export class Card extends Item {
    private _cardType: ECardType;
    private _quality: ECardQuality;
    private _destroyPrice: number;
    private _energyCost: number;
    private _targets: Array<Character>;
    /** 作用对象 */
    get targets(): Array<Character> {
        return this._targets;
    }
}
ClassConfig.addClass("Card", Card);

