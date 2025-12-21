import { ClassConfig } from "../../project/config/ClassConfig";
import { ConfigReader } from "../../project/ConfigReader/ConfigReader";
import { PlayerDataManager } from "../../project/manager/PlayerDataManager";
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
                break;
            }
            case EMapType.shop: {
                break;
            }
            case EMapType.camp: {
                break;
            }
            case EMapType.event: {
                break;
            }
        }
        this.opSyncData(portal.type, data);
        UIManager.gotoView(portal.viewName, data);
    }

    opSyncData(type: EMapType, _data: any) {
        let data: any = {};
        switch (type) {
            case EMapType.challenge: {
            }
            case EMapType.elite: {
            }
            case EMapType.boss: {
                data.battleModelData = {
                    teamId: _data.teamId,
                };
                break;
            }
            case EMapType.shop: {
                break;
            }
            case EMapType.camp: {
                break;
            }
            case EMapType.event: {
                break;
            }
        }
        data.questModelData = {
            curMapType: type,
        };
        PlayerDataManager.syncPlayerData(data);
    }
}
ClassConfig.addClass("TransmitFacade", TransmitFacade);
