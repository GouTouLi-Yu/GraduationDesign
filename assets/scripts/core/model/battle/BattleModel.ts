import { Model } from "../Model";
import { BattleEnemyCharacter } from "./BattleEnemyCharacter";
import { BattlePlayerCharacter } from "./BattlePlayerCharacter";

export class BattleModel extends Model {
    private _battlePlayerCharacter: BattlePlayerCharacter;
    get battlePlayerCharacter() {
        return this._battlePlayerCharacter;
    }

    private _battleEnemyCharacters: Map<number, BattleEnemyCharacter>;
    get battleEnemyCharacters() {
        return this._battleEnemyCharacters;
    }

    initialize() {
        this._battleEnemyCharacters = new Map();
        this._battlePlayerCharacter = new BattlePlayerCharacter();
    }

    syncData(data) {
        if (data.playerCharacter != null) {
            this._battlePlayerCharacter.syncData(data.playerCharacter);
        }
        if (data.enemyCharacters != null) {
            let enemyCharacters = data.enemyCharacters;
            for (let i = 0; i < enemyCharacters.length; i++) {
                let enemyCharacter = enemyCharacters[i] as BattleEnemyCharacter;
                let enemy = this._battleEnemyCharacters.get(
                    enemyCharacter.uuid
                );
                if (!enemy) {
                    enemy = new BattleEnemyCharacter(enemyCharacter.id);
                    this._battleEnemyCharacters.set(enemyCharacter.uuid, enemy);
                }
                enemy.syncData(enemyCharacter);
            }
        }
    }

    syncDelData(data) {}
}
