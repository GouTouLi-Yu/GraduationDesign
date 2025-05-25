import { _decorator } from 'cc';
import { ClassConfig } from '../../../project/config/ClassConfig';
import { Character } from '../character/Character';
const { ccclass, property } = _decorator;

export enum EEnemyType {
    nomal = 1,
    elite,
    boss
}
export enum EElement {
    fire = 1,
    water,
    wind,
}
export class Enemy extends Character {
    private _id: string;
    private _skillIds: Array<string>;
    private _type: EEnemyType;
    private _elem: EElement;

    constructor() {
        super();
    }
}
ClassConfig.addClass("Enemy", Enemy);


