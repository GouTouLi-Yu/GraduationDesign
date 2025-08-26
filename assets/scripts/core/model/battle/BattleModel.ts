import { Model } from "../Model";
import { BattleMonsterCharacter } from "./BattleMonsterCharacter";
import { BattlePlayerCharacter } from "./BattlePlayerCharacter";

export class BattleModel extends Model {
    private _enemyTeamId: string;
    /** 敌人队伍id --> 对应 EnemyTeamConfig表 */
    get enemyTeamId() {
        return this._enemyTeamId;
    }

    private _battlePlayerCharacter: BattlePlayerCharacter;
    get battlePlayerCharacter() {
        return this._battlePlayerCharacter;
    }

    private _battleMonsterCharacters: Map<number, BattleMonsterCharacter>;
    get battleEnemyCharacters() {
        return this._battleMonsterCharacters;
    }

    initialize() {
        this._battleMonsterCharacters = new Map();
        this._battlePlayerCharacter = new BattlePlayerCharacter();
    }

    syncData(data) {
        if (data.playerCharacter != null) {
            this._battlePlayerCharacter.syncData(data.playerCharacter);
        }
        if (data.teamId != null) {
            this._enemyTeamId = data.teamId;
        }
    }

    syncDelData(data) {}

    clear() {
        this._battlePlayerCharacter.clear();
        this._battleMonsterCharacters.clear();
    }
}
