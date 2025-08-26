import { ClassConfig } from "../../../project/config/ClassConfig";
import { PlayerDataManager } from "../../../project/manager/PlayerDataManager";
import { UIManager } from "../../../project/manager/UIManager";
import { Player } from "../../model/player/Player";
import { EMapType, Portal } from "../../model/portal/portal";
import { Facade } from "../Facade";
import { GameConfig } from "./../../../project/config/GameConfig";

export class MainMenuFacade extends Facade {
    private _player: Player;

    initialize() {
        super.initialize();
        this._player = Player.instance;
    }

    private syncDelPlayerData() {
        PlayerDataManager.clearPlayerAllDataFromDisk();
    }

    gotoCurMap() {
        let data: any = {};
        let mapType = this._player.questModel.curMapType;
        let portal = new Portal(mapType);
        let questModel = this._player.questModel;
        switch (mapType) {
            case EMapType.transmit: {
                if (!questModel.leftPotalType && !questModel.rightPotalType) {
                    let leftPotalType = questModel.getNextQuestType(true);
                    let rightPotalType = questModel.getNextQuestType(false);
                    PlayerDataManager.saveDataToDisk({
                        questModelData: {
                            leftPotalType: leftPotalType,
                            rightPotalType: rightPotalType,
                        },
                    });
                }
            }
        }
        UIManager.gotoView(portal.viewName, data);
    }

    opStartGame() {
        let data = PlayerDataManager.getPlayerDataFromDisk();
        this._player.syncData(data);
        this.gotoCurMap();
    }

    /** 向磁盘存储新游戏的玩家初始数据, 如最开始的五张卡和宝物等 */
    opSaveInitData() {
        let data = {
            level: GameConfig.playerInitCfg.level,
            gold: GameConfig.playerInitCfg.gold,
            cardModelData: this.getCardModelData(),
            battleModelData: this.getBattleModelData(),
            questModelData: this.getQuestModelData(),
        };
        PlayerDataManager.saveDataToDisk(data);
    }

    private getCardModelData() {
        return {
            cardIds: [...GameConfig.playerInitCfg.initCardsId],
        };
    }

    private getBattleModelData() {
        return {
            playerCharacter: {
                mp: GameConfig.playerInitCfg.mp,
                hp: GameConfig.playerInitCfg.hp,
                remainHp: GameConfig.playerInitCfg.hp,
            },
        };
    }

    // 关卡数据
    private getQuestModelData() {
        return {
            questId: GameConfig.playerInitCfg.questId,
        };
    }

    opStartNewGame() {
        this.opSaveInitData();
        this.gotoCurMap();
    }
}
ClassConfig.addClass("MainMenuFacade", MainMenuFacade);
