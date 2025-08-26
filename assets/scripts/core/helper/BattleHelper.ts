import { ConfigReader } from "../../project/ConfigReader/ConfigReader";
import { Player } from "../model/player/Player";
import { EMapType } from "../model/portal/portal";

export class BattleHelper {
    static get player() {
        return Player.instance;
    }

    /**
     * @description 根据地图类型 和 关卡数 获取敌人队伍id
     * @param mapType 地图类型
     * @param quest 关卡数, 默认为玩家当前关卡
     */
    static getEnemyTeamIdByMapType(mapType: EMapType, quest?: number): string {
        let _quest = quest != null ? quest : this.player.questModel.quest;
        let key = "";
        switch (mapType) {
            case EMapType.challenge:
                key = "challengeTeamsId";
                break;
            case EMapType.elite:
                key = "eliteTeamsId";
                break;
            case EMapType.boss:
                key = "bossTeamsId";
                break;
        }
        let ids = ConfigReader.getDataByIdAndKey(
            "TransmitLevelConfig",
            _quest.toString(),
            key
        );
        let randomIndex = Math.floor(Math.random() * ids.length);
        return ids[randomIndex];
    }
}
