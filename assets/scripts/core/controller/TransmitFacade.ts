import { ClassConfig } from "../../project/config/ClassConfig";
import { ConfigReader } from "../../project/ConfigReader/ConfigReader";
import { BattleMonsterCharacter } from "../model/battle/BattleMonsterCharacter";

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
            let enemy = new BattleMonsterCharacter(id);
            enemy.syncData({
                id,
            });
            return enemy;
        });
    }
}
ClassConfig.addClass("TransmitFacade", TransmitFacade);
