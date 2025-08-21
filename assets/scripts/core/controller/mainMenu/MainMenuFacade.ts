import { ClassConfig } from "../../../project/config/ClassConfig";
import { PlayerDataManager } from "../../../project/manager/PlayerDataManager";
import { Player } from "../../model/player/Player";
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
        console.log("打印数据：", this._player);

        // UIManager.gotoView("BattleView", {
        //     enemyIds: ["enemy_001"],
        // });
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

    opStartNewGame() {
        this.opSaveInitData();
        this.enterGame();
        this._player.print();
    }
}
ClassConfig.addClass("MainMenuFacade", MainMenuFacade);
