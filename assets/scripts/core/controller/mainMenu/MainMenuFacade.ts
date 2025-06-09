import { ClassConfig } from "../../../project/config/ClassConfig";
import { ConfigReader } from "../../../project/ConfigReader/ConfigReader";
import {
    GameManager,
    IPlayerDataType,
} from "../../../project/manager/GameManager";
import { UIManager } from "../../../project/manager/UIManager";
import { Player } from "../../model/player/Player";
import { Facade } from "../Facade";

export class MainMenuFacade extends Facade {
    private _player: Player;

    initialize() {
        super.initialize();
        this._player = Player.instance;
    }

    private syncPlayerData(_data?: IPlayerDataType) {
        this._player.syncData(_data ?? GameManager.getPlayerDataFromDisk());
    }

    private syncDelPlayerData() {
        GameManager.clearPlayerAllDataFromDisk();
    }

    enterGame() {
        UIManager.gotoView("TransmitView");
        //UIManager.gotoView("BattleView");
        // UIManager.gotoView("ShopView");
    }

    opStartGame() {
        this.syncPlayerData();
        this.enterGame();
    }

    /** 向磁盘存储新游戏的玩家初始数据, 如最开始的五张卡和宝物等 */
    opSaveInitData() {
        let playerCfg = ConfigReader.getDataById("PlayerConfig", "player");
        let playerLevelCfg = ConfigReader.getDataById("PlayerLevelConfig", "1");
        let data: IPlayerDataType = {
            level: playerCfg.level,
            gold: playerCfg.gold,
            mp: playerCfg.mp,
            cardIds: [...playerCfg.initCardsId],
            hp: playerCfg.hp,
            remainHp: playerCfg.hp,
            quest: playerCfg.quest,
        };
        GameManager.saveDataToDisk(data);
    }

    opStartNewGame() {
        this.syncDelPlayerData();
        this.opSaveInitData();
        this.enterGame();
        this._player.print();
    }
}
ClassConfig.addClass("MainMenuFacade", MainMenuFacade);
