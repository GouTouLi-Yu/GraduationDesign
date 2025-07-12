import { _decorator } from "cc";
import { ClassConfig } from "../../../project/config/ClassConfig";
import { ConfigReader } from "../../../project/ConfigReader/ConfigReader";
import { Battle } from "../battle/Battle";
import { Character } from "../character/Character";
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
    static static_uuid: number = 0;
    private _uuid: number;
    get uuid() {
        return this._uuid;
    }

    private _id: string;

    private _battleData: Battle;

    getBattleData(): Battle {
        return this._battleData;
    }

    /** 敌人类型 */
    get type(): EEnemyType {
        return this.cfg.type as EEnemyType;
    }

    get cfg() {
        return ConfigReader.getDataById("EnemyConfig", this._id);
    }

    get rolePicPath(): string {
        return this.cfg.rolePicPath;
    }

    constructor(id: string) {
        super();
        Enemy.static_uuid++;
        this._uuid = Enemy.static_uuid;
        this._id = id;
        this._hp = this.cfg.hp;
        this._remainHp = this._hp;
        this._battleData = new Battle();
    }
}
ClassConfig.addClass("Enemy", Enemy);
