import { ClassConfig } from "../../project/config/ClassConfig";
import { ConfigReader } from "../../project/ConfigReader/ConfigReader";
import { UIManager } from "../../project/manager/UIManager";
import { BattleHelper } from "../helper/BattleHelper";
import { BattleMonsterCharacter } from "../model/battle/BattleMonsterCharacter";
import { Player } from "../model/player/Player";
import { EMapType, Portal } from "../model/portal/portal";

import { Facade } from "./Facade";

export class TransmitFacade extends Facade {
    initialize() {
        super.initialize();
    }

    get player() {
        return Player.instance;
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

    opUsePortal(portal: Portal) {
        let data: any = {};
        switch (portal.type) {
            case EMapType.challenge: {
            }
            case EMapType.elite: {
            }
            case EMapType.boss: {
                let teamId = BattleHelper.getEnemyTeamIdByMapType(portal.type);
                data.teamId = teamId;
                // PlayerDataManager.syncPlayerData({
                //     battleModelData: data,
                // });
                break;
            }
        }
        UIManager.gotoView(portal.viewName, data);
    }
}
ClassConfig.addClass("TransmitFacade", TransmitFacade);
