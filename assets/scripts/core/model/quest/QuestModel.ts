import { ClassConfig } from "../../../project/config/ClassConfig";
import { ConfigReader } from "../../../project/ConfigReader/ConfigReader";
import { Model } from "../Model";
import { EMapType } from "../portal/portal";

export class QuestModel extends Model {
    private _questId: string;

    private get cfg() {
        return ConfigReader.getDataById("TransmitLevelConfig", this._questId);
    }

    /**
     * @description 获取下一个关卡的类型
     * @param left 是否为左传送门，否则为右
     */
    getNextQuestType(left: boolean = true): EMapType {
        let typeJson = left ? this.cfg.leftNextTypes : this.cfg.rightNextTypes;
        let total = 0;
        let transmitType: EMapType;
        let arr: Array<[string, number]> = [];
        for (let type in typeJson) {
            let probility = typeJson[type];
            arr.push([type, probility]);
            total += probility;
        }
        let random = Math.floor(Math.random() * total + 1);
        let _probilibty = 0;
        for (let i = 0; i < arr.length; i++) {
            let [type, probility] = arr[i];
            _probilibty += probility;
            if (random <= _probilibty) {
                transmitType = type as EMapType;
                break;
            }
        }
        return transmitType;
    }

    syncData(data: any) {
        if (data.questId != null) {
            this._questId = data.questId;
        }
    }

    syncDelData(data: any) {}

    initialize() {}
}
ClassConfig.addClass("QuestModel", QuestModel);
