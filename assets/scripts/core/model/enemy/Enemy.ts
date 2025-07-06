import { _decorator } from "cc";
import { ClassConfig } from "../../../project/config/ClassConfig";
import { ConfigReader } from "../../../project/ConfigReader/ConfigReader";
import { Character } from "../character/Character";
import { CharacterPanel } from "./../../view/character/CharacterPanel";
const { ccclass, property } = _decorator;

export enum EEnemyType {
    nomal = 1,
    elite,
    boss,
}
export enum EElement {
    fire = 1,
    water,
    wind,
}
export class Enemy extends Character {
    private _id: string;

    /** 敌人类型 */
    get type(): EEnemyType {
        return this.cfg.type as EEnemyType;
    }

    get cfg() {
        return ConfigReader.getDataById("EnemyConfig", this._id);
    }

    constructor(id: string, characterPanel: CharacterPanel) {
        super(characterPanel);
        this._id = id;
        this._hp = this.cfg.hp;
    }
}
ClassConfig.addClass("Enemy", Enemy);
