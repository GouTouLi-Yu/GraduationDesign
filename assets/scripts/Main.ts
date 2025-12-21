import { _decorator, Component } from "cc";

import { DynamicAtlasManager } from "cc";
import { ConfigReader } from "./project/ConfigReader/ConfigReader";
import { Injector } from "./project/Injector/Injector";
import { EventManager } from "./project/manager/EventManager";
import { GameManager } from "./project/manager/GameManager";
import { MyResManager } from "./project/manager/ResManager";
import { UIManager } from "./project/manager/UIManager";
const { ccclass, property } = _decorator;

DynamicAtlasManager.instance.enabled = true;
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
    }

    start() {
        this.initConfig().then(() => {
            GameManager.init();
            this.startGame();
        });
    }

    private initConfig(): Promise<void> {
        return ConfigReader.initConfig();
    }

    private startGame() {
        GameManager.startGame();
    }
}
