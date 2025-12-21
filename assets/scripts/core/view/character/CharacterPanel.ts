import { Animation, AnimationState, director, Node } from "cc";
import { ClassConfig } from "../../../project/config/ClassConfig";
import { cancelDelayInterval, setDelayInterval } from "../../helper/TimeHelper";
import { BattleCharacter } from "../../model/battle/BattleCharacter";
import { BattleMonsterCharacter } from "../../model/battle/BattleMonsterCharacter";
import { Player } from "../../model/player/Player";

export enum EEnemyAnimType {
    hurt = "hurtAnim",
    idle = "idleAnim",
    /** 选中状态 */
    choosing = "choosingAnim",
}

export class CharacterPanel {
    private _view: Node;
    private _character: BattleCharacter;
    private _anim: Animation;
    private _intervalId: number;
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
        this._anim = this._view.getComponent(Animation);
        this.loadImg();
        this.setHpLabel();
        // this.playAnim(EEnemyAnimType.idle);

        let scheduler = director.getScheduler();
        this._intervalId = setDelayInterval(() => {
            this.playAnim(EEnemyAnimType.idle);
            cancelDelayInterval(this._intervalId);
        }, 100);
    }

    private loadImg() {
        let preFix = "res/character/enemy/mirror/";
        let picPath = (this._character as BattleMonsterCharacter).rolePicPath;
        picPath = preFix + picPath;
        this._img.loadTexture(picPath);
        let str = picPath.split("_");
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
        this.playAnim(EEnemyAnimType.hurt);
    }

    hurtForShield(damage: number, segement: number) {}

    playAnim(animType: EEnemyAnimType) {
        if (!this._anim.node.init) {
            this._anim.on(
                Animation.EventType.FINISHED,
                (a, b: AnimationState) => {
                    if (b.name == EEnemyAnimType.hurt) {
                        this.afterHurt();
                    }
                }
            );
            this._anim.node.init = true;
        }
        this._anim.play(animType);
    }

    afterHurt() {
        console.log("受伤动画结束");
        this._anim.play(EEnemyAnimType.idle);
    }
}
ClassConfig.addClass("CharacterPanel", CharacterPanel);
