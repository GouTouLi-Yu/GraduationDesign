import { ConfigReader } from "../../../project/ConfigReader/ConfigReader";
import { BattleCharacter } from "./BattleCharacter";
export enum EEnemyType {
    nomal = 1,
    elite,
    boss,
}
export class BattleMonsterCharacter extends BattleCharacter {
    private _id: string;
    get id() {
        return this._id;
    }

    static static_uuid: number = 0;
    private readonly _uuid: number;
    get uuid() {
        return this._uuid;
    }
    get type(): EEnemyType {
        return this.cfg.type as EEnemyType;
    }

    get cfg() {
        return ConfigReader.getDataById("EnemyConfig", this._id);
    }

    get rolePicPath(): string {
        return this.cfg.rolePicPath;
    }
    constructor(id: string) {
        super();
        this._id = id;
        BattleMonsterCharacter.static_uuid++;
        this._uuid = BattleMonsterCharacter.static_uuid;
    }
    clear() {
        super.clear();
    }
    syncData(data: any): void {
        super.syncData(data);
    }
}
