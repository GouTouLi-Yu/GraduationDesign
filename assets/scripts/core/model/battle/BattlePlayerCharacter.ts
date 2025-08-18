import { GameConfig } from "../../../project/config/GameConfig";
import { BattleCharacter } from "./BattleCharacter";

export class BattlePlayerCharacter extends BattleCharacter {
    // --------------------------------------------------------------------------------------- 临时战斗数据 ---------------------------------------------------------------------------------------
    private _mp: number = 0;
    get mp() {
        return this._mp;
    }
    // -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

    constructor() {
        super();
        this._mp = GameConfig.playerInitCfg.mp;
        this._hp = GameConfig.playerInitCfg.hp;
        this._remainHp = this._hp;
    }

    clear() {
        super.clear();
    }

    syncData(data): void {
        super.syncData(data);
        this._mp = data.mp;
    }
}
