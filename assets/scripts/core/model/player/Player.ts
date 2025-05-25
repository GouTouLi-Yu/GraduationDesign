import { _decorator } from 'cc';
import { Card } from '../card/Card';
import { Character } from '../character/Character';
const { ccclass, property } = _decorator;

export class Player extends Character {
    private _name: string;
    private _level: number;//已通过的关卡数目
    private _gold: number;
    private _energy: number;
    private _remainEnergy: number;
    private _cards: Array<Card>;
    private _item: Array<string>;
}


