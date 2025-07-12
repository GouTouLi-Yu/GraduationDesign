import { Animation, Node } from "cc";
import { ClassConfig } from "../../../project/config/ClassConfig";
import { Enemy } from "../../model/enemy/Enemy";
import { Character } from "./../../model/character/Character";

export class CharacterPanel {
    private _view: Node;
    private _character: Character;
    get character() {
        return this._character;
    }

    constructor(node: Node, character: Character) {
        this._view = node;
        this._img = this._view.getChildByName("img");
        this._hpLabel = this._view.getChildByName("hpLabel");
        this._buffs = this._view.getChildByName("buffs");
        this._character = character;
        this.initialize();
    }
    static fullPath: string = "";
    private _hpLabel: Node;
    private _buffs: Node;
    private _img: Node;

    initialize() {
        this.loadImg();
        this.setHpLabel();
    }

    private get enemy(): Enemy {
        return this._character as Enemy;
    }

    private loadImg() {
        let preFix = "res/character/enemy/mirror/";
        this._img.loadTexture(preFix + this.enemy.rolePicPath);
        let str = this.enemy.rolePicPath.split("_");
        let flip = Boolean(str[str.length - 1]);
        this._img.setFlipX(flip);
    }

    private setHpLabel() {
        let remainHp = this.enemy.remainHp;
        let maxHp = this.enemy.hp;
        this._hpLabel.setString(remainHp + "/" + maxHp);
    }

    hurtForHp(damage: number, segement: number) {
        this.setHpLabel();
        this.playHurtAnim();
    }

    hurtForShield(damage: number, segement: number) {}

    playHurtAnim() {
        let anim = this._view.getComponent(Animation);
        anim.play("hurtAnim");
    }
}
ClassConfig.addClass("CharacterPanel", CharacterPanel);
