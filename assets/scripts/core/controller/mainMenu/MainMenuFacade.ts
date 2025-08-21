import { ClassConfig } from "../../../project/config/ClassConfig";
import { PlayerDataManager } from "../../../project/manager/PlayerDataManager";
import { UIManager } from "../../../project/manager/UIManager";
import { Player } from "../../model/player/Player";
import { EMapType } from "../../model/portal/portal";
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

    enterGame() {
        let lastMapType = this._player.lastMapType;
        let viewName: string = "";
        switch (lastMapType) {
            case null: {
                viewName = "TransmitView";
                break;
            }
            case EMapType.boss: {
            }
            case EMapType.challenge: {
            }
            case EMapType.elite: {
                viewName = "battleView";
                break;
            }
            case EMapType.camp: {
                viewName = "CampView";
                break;
            }
            case EMapType.event: {
                viewName = "EventView";
                break;
            }
            case EMapType.shop: {
                viewName = "ShopView";
                break;
            }
        }
        UIManager.gotoView(viewName);
    }

    opStartGame() {
        let data = PlayerDataManager.getPlayerDataFromDisk();
        this._player.syncData(data);
        this.enterGame();
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
        PlayerDataManager.syncPlayerData(data);
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
        this.enterGame();
    }
}
ClassConfig.addClass("MainMenuFacade", MainMenuFacade);
