import { Animation, Node } from "cc";
import { ClassConfig } from "../../../project/config/ClassConfig";
import { BattleCharacter } from "../../model/battle/BattleCharacter";
import { BattleMonsterCharacter } from "../../model/battle/BattleMonsterCharacter";
import { Player } from "../../model/player/Player";

export class CharacterPanel {
    private _view: Node;
    private _character: BattleCharacter;
    get character() {
        return this._character;
    }

    constructor(node: Node, character?: BattleCharacter) {
        this._view = node;
        this._img = this._view.getChildByName("img");
        this._hpLabel = this._view.getChildByName("hpLabel");
        this._buffs = this._view.getChildByName("buffs");
        this._character = character ?? Player.instance.battlePlayerCharacter;
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

    private loadImg() {
        let preFix = "res/character/enemy/mirror/";
        this._img.loadTexture(
            preFix + (this.character as BattleMonsterCharacter).rolePicPath
        );
        let str = (this.character as BattleMonsterCharacter).rolePicPath.split(
            "_"
        );
        let flip = Boolean(str[str.length - 1]);
        this._img.setFlipX(flip);
    }

    private setHpLabel() {
        let remainHp = this.character.remainHp;
        let maxHp = this.character.hp;
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
