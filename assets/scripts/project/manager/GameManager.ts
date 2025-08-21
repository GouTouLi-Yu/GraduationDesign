import { director } from "cc";
import { Player } from "./../../core/model/player/Player";
import { UIManager } from "./UIManager";

export class GameManager {
    private static _player: Player;
    static init() {
        Player.instance.initialize();
        this._player = Player.instance;
        this.addGlobalTimer();
    }

    static addGlobalTimer() {
        let scheduler = director.getScheduler();
        scheduler.schedule(
            () => {
                console.log("全局计时器");
            },
            {
                id: "3",
                uuid: "uuid_3",
            },
            1
        );
    }

    static startGame() {
        UIManager.gotoView("MainMenuView");
    }
}
