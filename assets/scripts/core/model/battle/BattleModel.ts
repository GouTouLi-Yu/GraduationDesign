import { Model } from "../Model";
import { BattleMonsterCharacter } from "./BattleMonsterCharacter";
import { BattlePlayerCharacter } from "./BattlePlayerCharacter";

export class BattleModel extends Model {
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
        if (data.enemyCharacters != null) {
            let enemyCharacters = data.enemyCharacters;
            for (let i = 0; i < enemyCharacters.length; i++) {
                let enemyCharacter = enemyCharacters[
                    i
                ] as BattleMonsterCharacter;
                let enemy = this._battleMonsterCharacters.get(
                    enemyCharacter.uuid
                );
                if (!enemy) {
                    enemy = new BattleMonsterCharacter(enemyCharacter.id);
                    this._battleMonsterCharacters.set(
                        enemyCharacter.uuid,
                        enemy
                    );
                }
                enemy.syncData(enemyCharacter);
            }
        }
    }

    syncDelData(data) {}
}
