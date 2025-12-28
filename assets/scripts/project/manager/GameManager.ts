import { director } from "cc";
import { UIManager } from "./UIManager";

export class GameManager {
    static init() {
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
        // 游戏启动逻辑，由具体游戏实现
        // UIManager.gotoView("YourView");
    }
}
