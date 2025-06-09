import { Node } from "cc";
import { ClassConfig } from "../../../project/config/ClassConfig";
import { ConfigReader } from "../../../project/ConfigReader/ConfigReader";
import { PCEventType } from "../../../project/event/EventType";
import { EventManager } from "../../../project/manager/EventManager";
import { UIManager } from "../../../project/manager/UIManager";
import { TypewriterEffect } from "../../../UIComponent/TypeWriter";
import { QuestHelper } from "../../helper/QuestHelper";
import { Player } from "../../model/player/Player";
import { AreaMediator } from "../AreaMediator";

export enum EMapLevel {
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

export class TransmitMediator extends AreaMediator {
    private _player: Player;
    static fullPath: string = "prefab/transmit/";
    private _buddleNode: Node;
    private _textNode: Node;
    private _typeWriter: TypewriterEffect;
    private _chatEndNode: Node;
    private _textBgNode: Node;
    //********************************************************** */
    private _currentIndex: number = 0;
    private _Alice_text: Array<string>;
    private _portalLeft: Node;
    private _portalRight: Node;
    private _leftType: EMapLevel;
    private _rightType: EMapLevel;
    private _currentElem: number;
    //********************************************************** */
    initialize() {
        super.initialize();
        this._player = Player.instance;
        this.setText();
    }

    get quest() {
        return this._player.quest;
    }

    onRegister() {
        super.onRegister();
        this.registerUI();
        this.mapEventListeners();
    }
    registerUI() {
        this._buddleNode = this.view.getChildByName("buddle");
        this._textNode = this.view.getChildByName("chatText");
        this._textBgNode = this._textNode.getChildByName("textBg");
        this._chatEndNode = this._textNode.getChildByName("chatEnd");
        this._typeWriter = this._textNode
            .getChildByName("RichText")
            .getComponent(TypewriterEffect);
        this._portalLeft = this.view.getChildByName("portalLeft");
        this._portalRight = this.view.getChildByName("portalRight");
        this._currentElem = Math.floor(Math.random() * 3);
    }
    dispatchEvents() {
        EventManager.dispatchEvent(PCEventType.EVT_QUEST_ELEM_SKIP, { currentElem: this._currentElem });
    }
    mapEventListeners() {
        this.mapEventListener(PCEventType.EVT_TYPE_WRITER_END, this, () => {
            this._chatEndNode.active = true;
        });
    }

    enterWithData(data?: any) {
        super.enterWithData(data);
        this.setupView();
    }
    setupView() {
        this.setBuddleNode();
        this.setTextBg();
        this.setChatEnd();
        this.setTransmit();
        this.setupPortal(this._leftType, this._rightType);
    }

    // 当前关卡的传送门数据
    get transmitCfg() {
        let questId = QuestHelper.curQuestId;
        let cfg = ConfigReader.getDataById("TransmitLevelConfig", questId);
        return cfg;
    }

    setTransmit() {
        this._leftType = this.setTransmitType(true);
        this._rightType = this.setTransmitType(false);
        this.setTransmitImg(true);
        this.setTransmitImg(false);
    }

    setTransmitImg(left: boolean) {
        let pathMap = ConfigReader.getDataByIdAndKey(
            "TransmitConfig",
            "transmit",
            "imgPath"
        );
        let node = left ? this._portalLeft : this._portalRight;
        let type = left ? this._leftType : this._rightType;
        node.getChildByName("Label").setString(type);
        let path = pathMap[type];
        node.loadTexture("res/portal/" + path);
    }

    setTransmitType(left: boolean): EMapLevel {
        let typeJson = left
            ? this.transmitCfg.leftNextType
            : this.transmitCfg.rightNextType;
        let total = 0;
        let transmitType: EMapLevel = left ? this._leftType : this._rightType;
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
                transmitType = type as EMapLevel;
                break;
            }
        }
        if (left) {
            return this._leftType = transmitType;
        }
        return this._rightType = transmitType;
    }

    setupPortal(leftType: EMapLevel, rightType: EMapLevel) {
        let viewJson = ConfigReader.getDataByIdAndKey("TransmitConfig", "transmit", "viewName");
        let arr: Array<[string, string]> = [];

        for (let type in viewJson) {
            let probility = viewJson[type];
            arr.push([type, probility]);

        }
        console.log("this._view", arr);
        this._portalLeft.addClickListener(() => {
            if (leftType === EMapLevel.challenge || leftType === EMapLevel.elite || leftType === EMapLevel.boss) {
                UIManager.gotoView("BattleView");// 跳转到战斗界面，并关闭当前界面
            }
            for (let i = 0; i < arr.length; i++) {
                let [type, probility] = arr[i];
                if (type === leftType) {
                    console.log(type);
                    UIManager.gotoView(probility);
                    break;
                }
            }
        });
        this._portalRight.addClickListener(() => {
            if (rightType === EMapLevel.challenge || rightType === EMapLevel.elite || rightType === EMapLevel.boss) {
                UIManager.gotoView("BattleView");
            }
            for (let i = 0; i < arr.length; i++) {
                let [type, probility] = arr[i];
                if (type === rightType) {
                    console.log(type);
                    UIManager.gotoView(probility);
                    break;
                }
            }
        })
    }
    setText() {
        this._Alice_text = [
            "你好异世界的旅者，我是爱丽丝。",
            "欢迎来到我的世界，我是时间魔女，但是我迷失在了这里，你能帮助我回家吗？作为回报我会赐予你力量。",
            "感谢你，异世界的旅者，我将为你开启传送门，你将传送到不同的地点。",
            "如果你做好准备请触碰传送门吧，愿圣光永远照耀您。",
        ];
    }
    setTextBg() {
        this._textBgNode.addClickListener(() => {
            this._typeWriter.skipToEnd();
        });
    }
    setChatEnd() {
        this._chatEndNode.active = false;
        this._portalLeft.active = false;
        this._portalRight.active = false;
        this._textNode.getChildByName("RichText").setString(this._Alice_text[this._currentIndex]);
        this._chatEndNode.addClickListener(() => {
            this._currentIndex++; //索引+1
            if (this._currentIndex >= this._Alice_text.length) {
                this._textNode.active = false;
                this._portalLeft.active = true;
                this._portalRight.active = true;
                return;
            }
            this._typeWriter.updateText(this._Alice_text[this._currentIndex]); //开始打字机
        });
    }

    setBuddleNode() {
        this._textNode.active = false;
        this._buddleNode.addClickListener(() => {
            this._textNode.active = true;
            this._buddleNode.active = false;
        });
    }
}
ClassConfig.addClass("TransmitMediator", TransmitMediator);
