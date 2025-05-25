import { _decorator } from 'cc';
import { ClassConfig } from '../../../project/config/ClassConfig';
const { ccclass, property } = _decorator;

export class Character {
    private _attack: number;
    private _defense: number;
    private _hp: number;
    private _remainHp: number;

}
ClassConfig.addClass("Character", Character);

