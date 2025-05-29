import { ClassConfig } from "../../../project/config/ClassConfig";
import { GameManager } from "../../../project/manager/GameManager";
import { UIManager } from "../../../project/manager/UIManager";
import { Player } from "../../model/player/Player";
import { Facade } from "../Facade";

export class MainMenuFacade extends Facade {
    private _player: Player;

    initialize() {
        super.initialize();
        this._player = Player.instance;
    }

    private syncPlayerData() {
        let data = GameManager.getPlayerDataFromDisk();
        this._player.syncData(data);
    }

    private syncDelPlayerData() {
        GameManager.clearPlayerAllDataFromDisk();
    }

    enterGame() {
        UIManager.gotoView("TransmitView");
    }

    opStartGame() {
        this.syncPlayerData();
        this.enterGame();
    }

    opStartNewGame() {
        this.syncDelPlayerData();
        this.syncPlayerData();
        this.enterGame();
    }
}
ClassConfig.addClass("MainMenuFacade", MainMenuFacade);
