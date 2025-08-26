import { ClassConfig } from "../../../project/config/ClassConfig";
import { ConfigReader } from "../../../project/ConfigReader/ConfigReader";
import { Model } from "../Model";
import { EMapType } from "../portal/portal";

export class QuestModel extends Model {
    private _quest: number = 1;
    get quest() {
        return this._quest;
    }

    private _leftPotalType: EMapType;
    get leftPotalType() {
        return this._leftPotalType;
    }

    private _rightPotalType: EMapType;
    get rightPotalType() {
        return this._rightPotalType;
    }

    private _curMapType: EMapType = EMapType.transmit;
    get curMapType() {
        return this._curMapType;
    }

    private get cfg() {
        return ConfigReader.getDataById(
            "TransmitLevelConfig",
            this._quest.toString()
        );
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
            this._quest = data.questId;
        }
        if (data.leftPotalType != null) {
            this._leftPotalType = data.leftPotalType;
        }
        if (data.rightPotalType != null) {
            this._rightPotalType = data.rightPotalType;
        }
        if (data.curMapType != null) {
            this._curMapType = data.curMapType;
        }
    }

    syncDelData(data: any) {}

    initialize() {}

    clear() {
        this._quest = 1;
        this._leftPotalType = null;
        this._rightPotalType = null;
        this._curMapType = EMapType.transmit;
    }
}
ClassConfig.addClass("QuestModel", QuestModel);
