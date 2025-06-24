import { ClassConfig } from "../../../project/config/ClassConfig";
import { Battle } from "../battle/Battle";
import { BuffEffect } from "../BuffEffect/BuffEffect";

export class Character {
    protected _hp: number;
    protected _remainHp: number;
    /** value --> remainRound */
    protected _buffsMap: Map<BuffEffect, number>;
    protected _battleData: Battle;
    get battleData() {
        return this._battleData;
    }

    syncData(data: any) {
        if (data.hp != null) {
            this._hp = data.hp;
        }
        if (data.remainHp != null) {
            this._remainHp = data.remainHp;
        }
    }

    initialize() {
        this._buffsMap = new Map();
    }

    clearBattleData() {
        this._battleData = null;
    }
}
ClassConfig.addClass("Character", Character);
