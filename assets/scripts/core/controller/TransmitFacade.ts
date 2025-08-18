import { ClassConfig } from "../../project/config/ClassConfig";
import { ConfigReader } from "../../project/ConfigReader/ConfigReader";
import { BattleEnemyCharacter } from "../model/battle/BattleEnemyCharacter";
import { Facade } from "./Facade";

export class TransmitFacade extends Facade {
    initialize() {
        super.initialize();
    }

    opBattle(teamId: string) {
        let enemyIds = ConfigReader.getDataByIdAndKey(
            "EnemyTeamConfig",
            teamId,
            "enemyIds"
        );
        let enemyTeam = enemyIds.map((id) => {
            let enemy = new BattleEnemyCharacter(id);
            enemy.syncData({
                id,
            });
            return enemy;
        });
    }
}
ClassConfig.addClass("TransmitFacade", TransmitFacade);
