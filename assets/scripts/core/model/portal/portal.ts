import { ConfigReader } from "../../../project/ConfigReader/ConfigReader";
import { Strings } from "../../../project/strings/Strings";

export enum EMapType {
    /** 挑战(普通小怪) */
    challenge = "challenge",
    /** 精英 */
    elite = "elite",
    /** boss */
    boss = "boss",
    /** 事件 */
    event = "event",
    /** 商店 */
    shop = "shop",
    /** 营地 */
    camp = "camp",
}

export class Portal {
    private _type: EMapType;

    private get cfg() {
        return ConfigReader.getDataById("TransmitConfig", this._type);
    }

    constructor(type: EMapType) {
        this._type = type;
    }

    get imgPath(): string {
        return "res/portal/" + this.cfg.imgPath;
    }

    get viewName(): string {
        return this.cfg.viewName;
    }

    get name(): string {
        return Strings.get(this._type);
    }
}
