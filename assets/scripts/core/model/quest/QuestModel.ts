import { ClassConfig } from "../../../project/config/ClassConfig";
import { Model } from "../Model";

export interface IQuestModelData {
    quest?: number;
}

export class QuestModel extends Model {
    private _quest: number = 0;
    syncData(data: IQuestModelData) {
        if (this._quest != null) {
            this._quest = data.quest;
        }
    }

    syncDelData(data: IQuestModelData) {
        if (this._quest != null) {
            this._quest = null;
        }
    }

    initialize() {}
}
ClassConfig.addClass("QuestModel", QuestModel);
