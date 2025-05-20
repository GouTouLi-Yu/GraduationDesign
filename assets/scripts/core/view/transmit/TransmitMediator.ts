import { _decorator, Node, RichText } from "cc";
import { ClassConfig } from "../../../project/config/ClassConfig";
import { PCEventType } from "../../../project/event/EventType";
import { TypewriterEffect } from "../../../UIComponent/TypeWriter";
import { AreaMediator } from "../AreaMediator";
const { ccclass, property } = _decorator;

export class TransmitMediator extends AreaMediator {
    static fullPath: string = "prefab/transmit/";
    private _buddleNode: Node;
    private _textNode: Node;
    private _typeWriter: TypewriterEffect;
    private _richTextNode: Node;
    private _chatEndNode: Node;
    private _textBgNode: Node;
    initialize() {
        super.initialize();
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
        this._richTextNode = this._textNode.getChildByName("RichText");
        this._chatEndNode = this._textNode.getChildByName("chatEnd");
        this._typeWriter = this._richTextNode.getComponent(TypewriterEffect);
    }
    mapEventListeners() {
        this.mapEventListener(PCEventType.EVT_TYPE_WRITER_END, this, () => {
            this._chatEndNode.active = true;
        })
    }

    enterWithData(data?: any) {
        super.enterWithData(data);
        this.setupView();
    }

    setupView() {
        this.setBuddleNode();
        this.setTextBg();
    }
    setTextBg() {
        this._textBgNode.addClickListener(() => {
            this._typeWriter.skipToEnd();
        })
    }
    setChatEnd() {
        this._chatEndNode.addClickListener(() => {//点击跳转下一条文本

        })
    }
    setRichText() {
        let richText = this._richTextNode.getComponent(RichText);
    }
    setBuddleNode() {
        this._buddleNode.addClickListener(() => {
            this._textNode.active = true;
            this._buddleNode.active = false;
        })
    }

}
ClassConfig.addClass("TransmitMediator", TransmitMediator);
