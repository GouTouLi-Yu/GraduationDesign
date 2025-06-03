import { _decorator, Label, Node, RichText } from "cc";
import { ClassConfig } from "../../../project/config/ClassConfig";
import { PCEventType } from "../../../project/event/EventType";
import { TypewriterEffect } from "../../../UIComponent/TypeWriter";
import { Player } from "../../model/player/Player";
import { AreaMediator } from "../AreaMediator";
const { ccclass, property } = _decorator;
export enum EMapLevel {
    challenge,
    elite,
    boss,
    event,
    shop,
    camp,
}
export class TransmitMediator extends AreaMediator {
    private _player: Player;
    static fullPath: string = "prefab/transmit/";
    private _buddleNode: Node;
    private _textNode: Node;
    private _typeWriter: TypewriterEffect;
    private _richTextNode: Node;
    private _chatEndNode: Node;
    private _textBgNode: Node;
    private _rtComponent: RichText; //富文本组件
    //********************************************************** */
    private _currentIndex: number = 0;
    private _Alice_text: Array<string>;
    private _portalLeft: Node;
    private _portalRight: Node;
    private _portalleftText: Node;
    private _portalRightText: Node;
    private _currentportal1: number;
    private _currentportal2: number;
    private _levelNameMap: Object = {
        [EMapLevel.challenge]: "挑战",
        [EMapLevel.elite]: "精英",
        [EMapLevel.boss]: "boss",
        [EMapLevel.event]: "事件",
        [EMapLevel.shop]: "商店",
        [EMapLevel.camp]: "营地",
    };
    //********************************************************** */
    initialize() {
        super.initialize();
        this._player = Player.instance;
        this.setText();
    }

    onRegister() {
        super.onRegister();
        this.registerUI();
        this.mapEventListeners();
        this.showPortalText();
    }
    registerUI() {
        this._buddleNode = this.view.getChildByName("buddle");
        this._textNode = this.view.getChildByName("chatText");
        this._textBgNode = this._textNode.getChildByName("textBg");
        this._richTextNode = this._textNode.getChildByName("RichText");
        this._rtComponent = this._richTextNode.getComponent(RichText);
        this._chatEndNode = this._textNode.getChildByName("chatEnd");
        this._typeWriter = this._richTextNode.getComponent(TypewriterEffect);
        this._currentportal1 = Math.floor(Math.random() * 6);
        this._currentportal2 = Math.floor(Math.random() * 6);
        this._portalLeft = this.view.getChildByName("portalLeft");
        this._portalRight = this.view.getChildByName("portalRight");
        this._portalleftText = this._portalLeft.getChildByName("Label");
        this._portalRightText = this._portalRight.getChildByName("Label");
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
    }

    setupPortal() {
        this._portalLeft.addClickListener(() => {});
    }
    showPortalText() {
        this._portalleftText.getComponent(Label).string =
            this._levelNameMap[this._currentportal1];
        this._portalRightText.getComponent(Label).string =
            this._levelNameMap[this._currentportal2];
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
        this._rtComponent.string = this._Alice_text[this._currentIndex];
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

    setRichText() {
        let richText = this._richTextNode.getComponent(RichText);
    }
    setBuddleNode() {
        this._buddleNode.addClickListener(() => {
            this._textNode.active = true;
            this._buddleNode.active = false;
        });
    }
}
ClassConfig.addClass("TransmitMediator", TransmitMediator);
