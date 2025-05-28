import { _decorator, Component, DynamicAtlasManager } from "cc";

import { Player } from "./core/model/player/Player";
import { ConfigReader } from "./project/ConfigReader/ConfigReader";
import { Injector } from "./project/Injector/Injector";
import { EventManager } from "./project/manager/EventManager";
import { GameManager, IPlayerDataType } from "./project/manager/GameManager";
import { MyResManager } from "./project/manager/ResManager";
import { UIManager } from "./project/manager/UIManager";
const { ccclass, property } = _decorator;
DynamicAtlasManager.instance.enabled = false;
@ccclass("Main")
export class Main extends Component {
    protected onLoad(): void {
        this.initStaticClass();
    }

    private initStaticClass() {
        MyResManager.init();
        UIManager.init();
        Injector.init();
        EventManager.init();
        ConfigReader.init();
        GameManager.init();
    }

    start() {
        this.initConfig().then(() => {
            this.initPlayerData();
            this.startGame();
        });
    }

    private initConfig(): Promise<void> {
        return ConfigReader.initConfig();
    }

    test() {
        let data: IPlayerDataType = {
            itemIds: ["item_001", "item_002", "item_003", "item_004"],
        };
        GameManager.saveDataToDisk(data);

        data = GameManager.getDataFromDisk();
        console.log("玩家磁盘数据：", data);

        GameManager.syncPlayerData(data);
        let itemModel = Player.instance.itemModel;
        itemModel.print();

        GameManager.syncDelData();
        data = GameManager.getDataFromDisk();
        console.log("玩家磁盘数据：", data);
    }

    private initPlayerData() {
        this.test();

        // let data = GameManager.getDataFromDisk();

        // GameManager.syncPlayerData(data);
    }

    private startGame() {
        GameManager.startGame();
    }

    update(deltaTime: number) {}
}
