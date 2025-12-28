import { ConfigReader } from "../ConfigReader/ConfigReader";

export class GameConfig {
    static playerAllDataKey: string = "player_all_data";

    /** 获取配置数据 */
    static getConfig(configName: string, id?: string) {
        if (id) {
            return ConfigReader.getDataById(configName, id);
        }
        return ConfigReader.getData(configName);
    }
}
