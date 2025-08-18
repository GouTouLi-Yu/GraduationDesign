import { ClassConfig } from "../../../project/config/ClassConfig";
import { ConfigReader } from "../../../project/ConfigReader/ConfigReader";
import { GameManager } from "../../../project/manager/GameManager";
import { UIManager } from "../../../project/manager/UIManager";
import { ECharacterAttrKey } from "../../model/battle/BattleCharacter";
import { Player } from "../../model/player/Player";
import { Facade } from "../Facade";

export class MainMenuFacade extends Facade {
    private _player: Player;

    initialize() {
        super.initialize();
        this._player = Player.instance;
    }

    private syncDelPlayerData() {
        GameManager.clearPlayerAllDataFromDisk();
    }

    enterGame() {
        // UIManager.gotoView("TransmitView");
        UIManager.gotoView("BattleView", {
            enemyIds: ["enemy_001"],
        });
        // UIManager.gotoView("ShopView");
    }

    opStartGame() {
        this.enterGame();
    }

    /** 向磁盘存储新游戏的玩家初始数据, 如最开始的五张卡和宝物等 */
    opSaveInitData() {
        let playerInitCfg = ConfigReader.getDataById(
            "PlayerInitConfig",
            "player"
        );
        let playerLevelCfg = ConfigReader.getDataById("PlayerLevelConfig", "1");

        let data = {
            level: playerInitCfg.level,
            gold: playerInitCfg.gold,
            cardModelData: this.getCardModelData(),
            battleModelData: this.getBattleModelData(),
        };
        GameManager.saveDataToDisk(data);
    }

    private getCardModelData() {
        return {
            cardIds: this._player.allCards,
        };
    }

    private getBattleModelData() {
        return {
            playerCharacter: {
                mp: this._player.getAttrkey(ECharacterAttrKey.mp),
                hp: this._player.getAttrkey(ECharacterAttrKey.hp),
                remainHp: this._player.getAttrkey(ECharacterAttrKey.remainHp),
            },
        };
    }

    opStartNewGame() {
        this.syncDelPlayerData();
        this.opSaveInitData();
        this.enterGame();
        this._player.print();
    }
}
ClassConfig.addClass("MainMenuFacade", MainMenuFacade);
