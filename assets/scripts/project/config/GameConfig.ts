import { ConfigReader } from "../ConfigReader/ConfigReader";

export class GameConfig {
    static playerAllDataKey: string = "player_all_data";

    /** 玩家初始化配置 */
    static get playerInitCfg() {
        return ConfigReader.getDataById("PlayerInitConfig", "player");
    }
}
